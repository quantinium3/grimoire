import rehypePrism from "rehype-prism-plus";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeMathjax from 'rehype-mathjax'
import remarkParse from "remark-parse";
import matter from "gray-matter";
import { unified } from "unified";
import { readFile } from "fs/promises";
import path, { extname } from "path";
import { writeFile } from "fs/promises";
import { minify } from "html-minifier";
import type { Config, FileNode, Metadata } from "./consts";
import Handlebars from "handlebars";
import { ensureDir } from "fs-extra";
import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import { visit } from "unist-util-visit";

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

        const { content, frontmatter, toc } = await processMarkdown(filepath, hashPath);
        const html = await compileTemplate("page", frontmatter, content, file_tree.replaceAll("index.md", ""), config, filename, toc);

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
    filename: string,
    toc: string
): Promise<string> => {
    try {
        const actualTemplateName = filename === 'index.md' ? 'index' : (templateName || 'page');

        const [pageTemplate, layoutTemplate] = await Promise.all([
            readFile(`./src/templates/${actualTemplateName}.hbs`, "utf-8").catch(() => {
                throw new Error(`Template ${actualTemplateName}.hbs not found`);
            }),
            readFile(`./src/templates/layout.hbs`, "utf-8").catch(() => {
                throw new Error(`Layout template not found`);
            }),
        ]);

        Handlebars.registerHelper("safeProp", function(obj, prop) {
            return obj && obj[prop] ? obj[prop] : "";
        });

        const pageCompiled = Handlebars.compile(pageTemplate);
        const contentHTML = pageCompiled({
            ...metadata,
            content
        });

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
            fileTree: file_tree,
            owner: config.owner,
            includesCopyButton: true,
            profilePicturePath: config.profilePicturePath || "/assets/images/defaultpfp.jpeg",
            tableOfContents: toc
        });
    } catch (err) {
        console.error(`Error compiling template ${templateName}:`, err);
        throw err;
    }
};

export const processMarkdown = async (
    filepath: string,
    hashPath: Map<string, string>
): Promise<{ content: string; frontmatter: Partial<Metadata>, toc: string }> => {
    try {
        const mdContent = await readFile(filepath, "utf-8");
        const { content, data: frontmatter } = matter(mdContent);
        const processor = unified()
            .use(remarkParse)
            .use(remarkFrontmatter, ['yaml', 'toml'])
            .use(remarkGfm)
            .use(remarkMath)
            .use(remarkRehype, { 
                allowDangerousHtml: true,
                handlers: {
                    // Custom handlers if needed
                }
            })
            .use(rehypeRaw)
            .use(rehypeMathjax)
            .use(rehypePrism, { 
                showLineNumbers: true, 
                ignoreMissing: true,
                defaultLanguage: 'text'
            })
            .use(rehypeStringify)

        const parsed = processor.parse(content);
        const processedContent = await processor.run(parsed);
        
        const TOC = generateToc(processedContent);

        const htmlContent = processor.stringify(processedContent);
        
        const changedContent = await replaceObsidianEmbeds(
            htmlContent.toString(), 
            hashPath || new Map()
        );

        const newContent = changedContent.replace(/<p(?![\s\w-="'>])/g, '<p class="paragraph-spacing"');

        return {
            content: newContent,
            frontmatter: frontmatter as Partial<Metadata>,
            toc: TOC,
        };
    } catch (err) {
        // More detailed error logging
        console.error(`Markdown Processing Error in ${filepath}:`, err);
        throw new Error(`Failed to process markdown file ${filepath}: ${err instanceof Error ? err.message : String(err)}`);
    }
};

const generateToc = (tree: any): string => {
    const toc: { text: string; id: string; level: number }[] = [];

    visit(tree, "element", (node) => {
        if (node.tagName && /^h[1-6]$/.test(node.tagName)) {
            const level = parseInt(node.tagName[1], 10);
            const text = node.children
                .map((child: any) => (child.value || child.children?.[0]?.value || ""))
                .join("")
            const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            toc.push({ text, id, level });
            node.properties = node.properties || {};
            node.properties.id = id;
        }
    })
    return generateTocHtml(toc);
}

const generateTocHtml = (toc: { text: string; id: string; level: number }[]): string => {
    if (!toc.length) return "";

    let html = '<nav class="toc"><ul>';
    let currentLevel = 1;

    for (let i = 0; i < toc.length; i++) {
        const { text, id, level } = toc[i];
        while (currentLevel > level) {
            html += '</ul>';
            currentLevel--;
        }
        while (currentLevel < level) {
            html += '<ul>';
            currentLevel++;
        }

        html += `<li class="toc-level-${level}"><a href="#${id}">${text}</a>`;
        if (i + 1 < toc.length && toc[i + 1].level > level) {
            continue;
        }
        html += '</li>';
    }
    while (currentLevel > 0) {
        html += currentLevel === 1 ? '</ul>' : '</ul></li>';
        currentLevel--;
    }

    html += '</nav>';
    return html;
};

const replaceObsidianEmbeds = async (content: string, hashPath: Map<string, string>): Promise<string> => {
    if (!content) return '';

    const imageExtRegex = /\.(png|jpg|jpeg|ico|svg|webp|gif)$/i;
    let result = content;

    // ![[image.jpeg]]
    result = result.replace(/!\[\[([^\]]+)\]\]/g, (match, fileName) => {
        if (!fileName) return match;

        if (imageExtRegex.test(fileName)) {
            const baseName = fileName.split('.')[0].replace(/ /g, "-");
            return `<img src="/assets/images/${baseName}${extname(fileName)}" alt="${baseName}">`;
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
