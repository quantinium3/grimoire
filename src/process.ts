import rehypePrism from "rehype-prism-plus";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import { rehypeAddCopyButton, remarkObsidianImages } from "./remark";
import remarkParse from "remark-parse";
import matter from "gray-matter";
import { unified } from "unified";
import { readFile } from "fs/promises";
import path from "path";
import { writeFile } from "fs/promises";
import { minify } from "html-minifier";
import type { FileNode, Metadata } from "./consts";
import Handlebars from "handlebars";
import { ensureDir } from "fs-extra";

export const compilePage = async (
    filename: string,
    filepath: string,
    file_tree: string
): Promise<void> => {
    try {
        if (!filepath.toLowerCase().endsWith('.md')) {
            return;
        }

        const { content, frontmatter } = await processMarkdown(filepath);
        const html = await compileTemplate("page", frontmatter, content, file_tree.replaceAll("index.md", ""));

        const relativePath = filepath.includes("content/")
            ? filepath.substring(filepath.indexOf("content/") + 8)
            : filepath;

        const outputPath = path.join("dist", relativePath.replace(".md", ".html"));
        await outputHTML(outputPath, html);
    } catch (err) {
        console.error(`Error compiling page ${filename}:`, err);
    }
};

export const outputHTML = async (outputPath: string, html: string): Promise<void> => {
    try {
        await ensureDir(path.dirname(outputPath));
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


export const compileTemplate = async (
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

export const processMarkdown = async (
    filepath: string
): Promise<{ content: string; frontmatter: Partial<Metadata> }> => {
    try {
        const mdContent = await readFile(filepath, "utf-8");
        const { content, data: frontmatter } = matter(mdContent);

        const htmlContent = await unified()
            .use(remarkParse)
            .use(remarkObsidianImages)
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

export const processNode = async (
    node: FileNode,
    inputDir: string,
    file_tree: string
): Promise<void> => {
    if (node.type === "file") {
        await compilePage(node.name, path.join(inputDir, node.path), file_tree);
    } else if (node.type === "directory") {
        const dirPath = path.join("dist", node.path);
        await ensureDir(dirPath);

        await Promise.all(
            node.children.map(child => processNode(child, inputDir, file_tree))
        );
    }
};
