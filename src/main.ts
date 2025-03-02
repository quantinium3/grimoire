import { readFile, writeFile } from "fs/promises";
import { buildFileTree } from "./file-tree";
import path from "path";
import matter from "gray-matter";
import { unified, type Plugin } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { minify } from "html-minifier";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import Handlebars from "handlebars";
import rehypePrism from "rehype-prism-plus";
import { visit } from "unist-util-visit";
import { type Node } from "unist";
import { type Element } from "hast";
import remarkGfm from "remark-gfm";

interface Metadata {
    title: string;
    date: string;
    tags: string[];
    author: string;
    category: string;
    status: "Draft" | "In Progress" | "Complete";
    priority: "Low" | "Medium" | "High";
    aliases: string[];
    created: string;
    modified: string;
}

interface Config {
    inputDir: string;
    relativeDir: string;
    owner: string;
}

interface FileNode {
    name: string;
    path: string;
    type: "directory" | "file";
    children: FileNode[];
}

const rehypeAddCopyButton: Plugin<[], Node> = () => {
    return (tree) => {
        visit(tree, "element", (node: Element, index, parent) => {
            if (node.tagName === "pre" && node.children.some(child => child.type === "element" && child.tagName === "code")) {
                const copyButton: Element = {
                    type: "element",
                    tagName: "button",
                    properties: {
                        className: ["copy-button"],
                        "data-copy-state": "copy",
                    },
                    children: [{ type: "text", value: "Copy" }],
                };

                const wrapper: Element = {
                    type: "element",
                    tagName: "div",
                    properties: { className: ["code-block-wrapper"] },
                    children: [copyButton, { ...node }],
                };

                if (parent && index !== undefined) {
                    parent.children[index] = wrapper;
                }
            }
        });
    };
};

const getConfig = async (): Promise<Config> => {
    try {
        const configFile = await readFile("grimoire.config.json", "utf-8");
        return JSON.parse(configFile);
    } catch (err) {
        console.error("Error reading config file:", err);
        throw new Error("Failed to read configuration file");
    }
};

/**
 * Process a file node (either a file or directory) recursively
 */
const processNode = async (
    node: FileNode,
    inputDir: string,
    file_tree: string
): Promise<void> => {
    if (node.type === "file") {
        // Process the file directly
        await compilePage(node.name, path.join(inputDir, node.path), file_tree);
    } else if (node.type === "directory") {
        // Create the output directory
        const dirPath = path.join("dist", node.path);
        await ensureDirectory(dirPath);

        // Process all children nodes recursively
        await Promise.all(
            node.children.map(child => processNode(child, inputDir, file_tree))
        );
    }
};

const main = async (): Promise<void> => {
    try {
        const config: Config = await getConfig();
        const fileTreeNodes: FileNode[] = await buildFileTree(config.inputDir, config.relativeDir).catch((err) => {
            console.log("Failed to build file tree: ", err);
            return [];
        });

        const file_tree = JSON.stringify(fileTreeNodes);

        await ensureDirectory("dist");
        await ensureDirectory("dist/assets/styles");
        await ensureDirectory("dist/assets/js");

        await writeFile(
            "dist/assets/styles/prism.css",
            await readFile("./node_modules/prismjs/themes/prism-okaidia.css", "utf-8")
        );

        // Process all top-level nodes recursively
        await Promise.all(
            fileTreeNodes.map(node => processNode(node, config.inputDir, file_tree))
        );

        console.log("Site generation completed successfully!");
    } catch (err) {
        console.error("Error generating site:", err);
    }
};

const compilePage = async (
    filename: string,
    filepath: string,
    file_tree: string
): Promise<void> => {
    try {
        // Only process markdown files
        if (!filepath.toLowerCase().endsWith('.md')) {
            return;
        }

        const { content, frontmatter } = await processMarkdown(filepath);
        const html = await compileTemplate("page", frontmatter, content, file_tree);

        const relativePath = filepath.includes("content/")
            ? filepath.substring(filepath.indexOf("content/") + 8)
            : filepath;

        const outputPath = path.join("dist", relativePath.replace(".md", ".html"));
        await outputHTML(outputPath, html);
    } catch (err) {
        console.error(`Error compiling page ${filename}:`, err);
    }
};

const outputHTML = async (outputPath: string, html: string): Promise<void> => {
    try {
        await ensureDirectory(path.dirname(outputPath));
        await writeFile(outputPath, minify(html, {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
        }));
        console.log(`Generated: ${outputPath}`);
    } catch (error) {
        console.error(`Failed to write HTML to ${outputPath}:`, error);
    }
};

const ensureDirectory = async (dirpath: string): Promise<void> => {
    if (!existsSync(dirpath)) {
        await mkdir(dirpath, { recursive: true });
    }
};

const compileTemplate = async (
    templateName: string,
    metadata: Partial<Metadata>,
    content: string,
    file_tree: string
): Promise<string> => {
    try {
        const [pageTemplate, layoutTemplate] = await Promise.all([
            readFile(`./src/templates/${templateName}.hbs`, "utf-8").catch(() => {
                throw new Error(`Template ${templateName}.hbs not found`);
            }),
            readFile(`./src/templates/layout.hbs`, "utf-8").catch(() => {
                throw new Error(`Layout template not found`);
            }),
        ]);

        Handlebars.registerHelper("safeProp", function(obj, prop) {
            return obj && obj[prop] ? obj[prop] : "";
        });

        const pageCompiled = Handlebars.compile(pageTemplate);
        const contentHTML = pageCompiled({ content });

        const layoutCompiled = Handlebars.compile(layoutTemplate);
        return layoutCompiled({
            title: metadata.title || "Untitled",
            date: metadata.date || "",
            tags: metadata.tags || [],
            author: metadata.author || "",
            category: metadata.category || "",
            status: metadata.status || "",
            priority: metadata.priority || "",
            aliases: metadata.aliases || [],
            created: metadata.created || "",
            modified: metadata.modified || "",
            content: contentHTML,
            file_tree,
            // Add script and style for copy functionality
            includesCopyButton: true,
        });
    } catch (err) {
        console.error(`Error compiling template ${templateName}:`, err);
        throw err;
    }
};

const processMarkdown = async (
    filepath: string
): Promise<{ content: string; frontmatter: Partial<Metadata> }> => {
    try {
        const mdContent = await readFile(filepath, "utf-8");
        const { content, data: frontmatter } = matter(mdContent);

        const htmlContent = await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypePrism, { showLineNumbers: true })
            .use(rehypeAddCopyButton)
            .use(rehypeRaw)
            .use(rehypeStringify)
            .process(content);

        return {
            content: htmlContent.toString(),
            frontmatter: frontmatter as Partial<Metadata>,
        };
    } catch (err) {
        throw new Error(`Failed to process markdown file ${filepath}: ${err}`);
    }
};

main().catch(console.error);
