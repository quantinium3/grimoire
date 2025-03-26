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
    config: Config,
    hashPath: Map<string, string>
): Promise<void> => {
    try {
        if (!filepath.toLowerCase().endsWith('.md')) {
            return;
        }

        const { content, frontmatter } = await processMarkdown(filepath, hashPath);
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
            quoteCharacter: '"',
            conservativeCollapse: true,
            keepClosingSlash: true,
            processScripts: ['text/javascript'],
        }));
    } catch (error) {
        console.error(`Failed to write HTML to ${outputPath}:`, error);
        throw error;
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
            includesCopyButton: true,
        });
    } catch (err) {
        console.error(`Error compiling template ${templateName}:`, err);
        throw err;
    }
};

export const processMarkdown = async (
    filepath: string,
    hashPath: Map<string, string>
): Promise<{ content: string; frontmatter: Partial<Metadata> }> => {
    try {
        const mdContent = await readFile(filepath, "utf-8");
        const { content, data: frontmatter } = matter(mdContent);

        const htmlContent = await unified()
            .use(remarkParse)
            .use(remarkDirective)
            .use(remarkFrontmatter)
            .use(remarkGfm)
            .use(remarkMath)
            .use(remarkPreventImages)
            .use(remarkRehype)
            .use(rehypeSanitize)
            .use(rehypePrism, { showLineNumbers: true })
            .use(rehypeAddCopyButton)
            .use(rehypeRaw)
            .use(rehypeFormat)
            .use(rehypeStringify)
            .process(content);

        const changedContent = await replaceObsidianEmbeds(htmlContent.toString(), hashPath);
        const newContent = changedContent.replace(/<p>/g, '<p class="paragraph-spacing">');

        return {
            content: newContent,
            frontmatter: frontmatter as Partial<Metadata>,
        };
    } catch (err) {
        throw new Error(`Failed to process markdown file ${filepath}: ${err}`);
    }
};

export const replaceObsidianEmbeds = async (content: string, hashPath: Map<string, string>): Promise<string> => {
    if (!content) return '';

    const imageExtRegex = /\.(png|jpg|jpeg|ico|svg|webp|gif)$/i;
    let result = content;

    // ![[image.jpeg]]
    result = result.replace(/!\[\[([^\]]+)\]\]/g, (match, fileName) => {
        if (!fileName) return match;

        if (imageExtRegex.test(fileName)) {
            const baseName = fileName.split('.')[0].replace(/ /g, "-");
            return `<img src="/assets/images/${baseName}.jpeg" alt="${baseName}">`;
        }

        return `![[${fileName}]]`;
    });

    // ![image](url)
    for (const match of [...result.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)]) {
        const fullMatch = match[0];
        const altText = match[1];
        const url = match[2];

        const { replacement } = await processEmbed(fullMatch, altText, url);
        result = result.replace(fullMatch, replacement);
    }

    // [[link]] or [[link|display]]
    result = result.replace(/\[\[([^\]|\n]+)(?:\|([^\]|\n]+))?\]\]/g, (match: string, group1: string, group2: string) => {
        if (!group1) return match;

        const displayName = group2 || path.basename(group1);
        const linkedPath = hashPath.get(group1.trim());
        console.log(`displayName: ${displayName}, linkedPath: ${linkedPath}, group1: ${group1}`);

        if (linkedPath) {
            const href = encodeURIComponent(linkedPath);
            return `<a href="${href}" class="internal-link">${displayName}</a>`;
        }

        if (group1.includes('/')) {
            const segment = '/' + group1.split('/').slice(1).join('/');
            return `<a href="${segment}" class="internal-link">${path.basename(group1)}</a>`;
        }

        return `[[${group1}${group2 ? `|${group2}` : ''}]]`;
    });


    result = result.replace(/==([^=]*)==/g, (match: string, group1: string) => {
        return `<mark>${group1}</mark>`;
    });
    return result
};

async function processEmbed(fullMatch: string, altText: string, url: string): Promise<{ fullMatch: string, replacement: string }> {
    try {
        let validUrl: URL;
        try {
            validUrl = new URL(url);
        } catch (e) {
            console.log('error: ', e);
            return { fullMatch, replacement: fullMatch };
        }

        const contentType = await getContentType(url);

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            let videoId;

            if (url.includes('youtube.com')) {
                const urlParams = validUrl.searchParams;
                videoId = urlParams.get("v");
            } else if (url.includes('youtu.be')) {
                videoId = url.split('/').pop();
            }

            if (videoId) {
                return {
                    fullMatch,
                    replacement: `<iframe src="https://www.youtube.com/embed/${videoId}" title="${altText || 'YouTube video'}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`
                };
            }
        }

        if (contentType?.split('/')[0] === 'image') {
            const escapedUrl = validUrl.toString();
            return {
                fullMatch,
                replacement: `<img src="${escapedUrl}" alt="${altText || 'Image'}">`
            };
        } else if (contentType?.split('/')[0] === 'video') {
            const escapedUrl = validUrl.toString();
            return {
                fullMatch,
                replacement: `<video controls><source src="${escapedUrl}" type="video/mp4">${altText || 'Video'}</video>`
            };
        } else if (!contentType) {
            const escapedUrl = validUrl.toString();
            return {
                fullMatch,
                replacement: `<a href="${escapedUrl}">${altText || url}</a>`
            };
        }

        return { fullMatch, replacement: fullMatch };
    } catch (err) {
        console.error(`Error processing embed ${url}:`, err);
        return { fullMatch, replacement: fullMatch };
    }
}

export const getContentType = async (url: string): Promise<string | null> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        return response.headers.get('Content-Type');
    } catch (err) {
        console.log(`Failed to get content type for ${url}:`, err);
        return null;
    }
};

export const processNode = async (
    node: FileNode,
    inputDir: string,
    file_tree: string,
    config: Config,
    hashPath: Map<string, string>
): Promise<void> => {
    if (node.type === "file") {
        await compilePage(node.name, path.join(inputDir, node.path), file_tree, config, hashPath);
    } else if (node.type === "directory") {
        const dirPath = path.join("dist", node.path);
        await ensureDir(dirPath);

        await Promise.all(
            node.children.map(child => processNode(child, inputDir, file_tree, config, hashPath))
        );
    }
};
