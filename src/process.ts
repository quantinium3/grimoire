import rehypePrism from "rehype-prism-plus";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import { rehypeAddCopyButton, remarkPreventImages } from "./remark";
import remarkParse from "remark-parse";
import matter from "gray-matter";
import { unified } from "unified";
import { readFile } from "fs/promises";
import path from "path";
import { writeFile } from "fs/promises";
import { minify } from "html-minifier";
import type { Config, FileNode, Metadata } from "./consts";
import Handlebars from "handlebars";
import { ensureDir } from "fs-extra";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import rehypeSanitize from "rehype-sanitize";
import rehypeFormat from "rehype-format";

export const compilePage = async (
    filename: string,
    filepath: string,
    file_tree: string,
    config: Config
): Promise<void> => {
    try {
        if (!filepath.toLowerCase().endsWith('.md')) {
            return;
        }

        const { content, frontmatter } = await processMarkdown(filepath);
        const html = await compileTemplate("page", frontmatter, content, file_tree.replaceAll("index.md", ""), config);

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
    } catch (error) {
        console.error(`Failed to write HTML to ${outputPath}:`, error);
    }
};


export const compileTemplate = async (
    templateName: string,
    metadata: Partial<Metadata>,
    content: string,
    file_tree: string,
    config: Config,
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
            owner: config.owner,
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
        const data = await replaceObsidianEmbedLinks(content)

        const htmlContent = await unified()
            .use(remarkParse)
            .use(remarkDirective)
            .use(remarkFrontmatter)
            .use(remarkGfm)
            .use(remarkMath)
            .use(remarkPreventImages)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(rehypePrism, { showLineNumbers: true })
            .use(rehypeAddCopyButton)
            .use(rehypeRaw)
            .use(rehypeFormat)
            .use(rehypeSanitize)
            .use(rehypeStringify)
            .process(data);

        return {
            content: htmlContent.toString(),
            frontmatter: frontmatter as Partial<Metadata>,
        };
    } catch (err) {
        throw new Error(`Failed to process markdown file ${filepath}: ${err}`);
    }
};

export const replaceExclaBracketsImages = (content: string): string => {
    const reg = /!\[\[([^\]]+)\]\]/g;

    const result = content.replace(reg, (match: string, group1: string) => {
        try {
            const imageExt = /\.(png|jpg|jpeg|ico|svg|webp|gif)$/i;
            if (imageExt.test(group1)) {
                const image = group1.split('.')[0].replace(/ /g, "-") + '.jpeg';
                return `\n<img src="/assets/images/${image}">\n`;
            } else {
                return `![[${group1}]]`;
            }
        } catch (err) {
            console.error(err);
            return match
        }
    });

    return result || content;
};

export const replaceExclaBracketsVideos = (content: string): string => {
    const reg = /!\[\[([^\]]+)\]\]/g;

    const result = content.replace(reg, (match: string, group1: string): string => {
        try {
            const videoExt = /\.(webm|mp4|mov|avi|mkv)$/i;
            if (videoExt.test(group1)) {
                const formattedFileName = group1.replace(/ /g, "-");
                return `<video controls> <source src="${formattedFileName}" type="video/${path.extname(formattedFileName)}">  Your browser does not support the html video tag.  </video>`
            }
            return `![[${group1}]]`;
        } catch (err) {
            console.error(`Error processing video replacement for "${group1}":`, err);
            return match;
        }
    });

    return result || content;
};

export const replaceObsidianEmbedLinks = async (content: string): Promise<string> => {
    return replaceExclaBracketsVideos(content);
}

export const processNode = async (
    node: FileNode,
    inputDir: string,
    file_tree: string,
    config: Config
): Promise<void> => {
    if (node.type === "file") {
        await compilePage(node.name, path.join(inputDir, node.path), file_tree, config);
    } else if (node.type === "directory") {
        const dirPath = path.join("dist", node.path);
        await ensureDir(dirPath);

        await Promise.all(
            node.children.map(child => processNode(child, inputDir, file_tree, config))
        );
    }
};
