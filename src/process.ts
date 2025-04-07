import type { Config, FileNode, Metadata} from "./consts";
import { ensureDir } from "fs-extra"
import { readFile } from "fs/promises";
import path, { basename, extname } from "path";
import matter from "gray-matter";
import rehypePrism from "rehype-prism-plus";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeMathjax from 'rehype-mathjax'
import remarkParse from "remark-parse";
import Handlebars from "handlebars";
import remarkMath from "remark-math";
import { unified } from "unified";
import { visit } from 'unist-util-visit';
import { createCanvas, loadImage } from "canvas";
import { createWriteStream } from "fs";
import { writeFile } from "fs/promises";
import { minify } from "html-minifier";

export const processNode = async (
    node: FileNode,
    fileTree: string,
    config: Config,
    fileMap: Map<string, string>,
): Promise<void> => {
    if (node.type === "file") {
        await compilePage(node, config, fileTree, fileMap);
    } else if (node.type === "directory") {
        await ensureDir(path.join('dist', node.path))
        await Promise.all(
            node.children.map(child => processNode(child, fileTree, config, fileMap))
        )
    }
}

const compilePage = async (
    node: FileNode,
    config: Config,
    fileTree: string,
    fileMap: Map<string, string>
): Promise<void> => {
    if (!node.name.endsWith('.md')) {
        return;
    }

    try {
        const inputPath = path.join(config.inputDir, node.path)
        const { content, frontMatter, tableOfContents } = await processMarkdown(inputPath, fileMap);

        const metatags = await generateMetatags(frontMatter, config, node.path, content)
        const html = await compileTemplate(node, fileTree, frontMatter, content, tableOfContents, config, metatags)

        await outputHtml(path.join('dist', node.path.replace('.md', '.html')), html)
    } catch (err) {
        console.error("Error while compiling page: ${node.path}: ", err)
        throw err;
    }
}

const compileTemplate = async (
    node: FileNode,
    fileTree: string,
    metadata: Partial<Metadata>,
    content: string,
    toc: string,
    config: Config,
    metaTags: string,
): Promise<string> => {
    try {
        const templateName = node.path === "index.nd" ? 'index' : 'page'

        const [pageTemplate, layoutTemplate] = await Promise.all([
            readFile(`./src/templates/${templateName}.hbs`, "utf-8"),
            readFile(`./src/templates/layout.hbs`, "utf-8")
        ])

        Handlebars.registerHelper("safeProp", function(obj, prop) {
            return obj && obj[prop] ? obj[prop] : "";
        });

        const pageCompiled = Handlebars.compile(pageTemplate);
        const contentHtml = pageCompiled({
            ...metadata,
            content
        });

        const layoutCompiled = Handlebars.compile(layoutTemplate);
        return layoutCompiled({
            title: metadata.title || basename(node.path),
            ...metadata,
            content: contentHtml,
            fileTree,
            owner: config.owner,
            profilePicturePath: basename(config.pfpURL),
            tableOfContents: toc,
            metaTags,
        })
    } catch (err) {
        console.error("Error compiling template: ${node.path}: ", err)
        throw err;
    }
}

const outputHtml = async (outputPath: string, html: string): Promise<void> => {
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
}

const generateMetatags = async (metadata: Partial<Metadata>, config: Config, filePath: string, content: string): Promise<string> => {
    const tags: string[] = [];
    const title = metadata.title || path.parse(basename(filePath)).name;

    tags.push(`<meta property="og:site_name" content="${config.owner}" />`);
    tags.push(`<meta property="og:title" content="${escapeHtml(title)}" />`);
    tags.push(`<meta property="og:type" content="website" />`);
    tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
    tags.push(`<meta name="twitter:title" content="${escapeHtml(title)}" />`);
    tags.push(`<meta name="og:url" content="${config.baseURL}/${filePath}" />`);
    tags.push(`<meta name="twitter:url" content="${config.baseURL}/${filePath}" />`);
    tags.push(`<meta name="generator" content="grimoire" />`);

    if (metadata.description) {
        tags.push(`<meta name="description" content="${metadata.description}" />`);
        tags.push(`<meta property="og:description" content="${metadata.description}" />`);
        tags.push(`<meta name="twitter:description" content="${metadata.description}" />`);
    }

    if(config.baseURL) {
        tags.push(`<meta name="twitter:domain" content="${config.baseURL}" />`);
    }

    if (metadata.author) {
        tags.push(`<meta name="author" content="${escapeHtml(metadata.author)}" />`);
    }

    tags.push(`<meta property="og:type" content="article" />`);

    if (metadata.date) {
        tags.push(`<meta property="article:published_time" content="${new Date(metadata.date).toISOString()}" />`);
    }

    if (metadata.updatedAt) {
        tags.push(`<meta property="article:modified_time" content="${new Date(metadata.updatedAt).toISOString()}" />`);
    }

    if (metadata.tags?.length) {
        tags.push(`<meta name="keywords" content="${escapeHtml(metadata.tags.join(', '))}" />`);
    }

    if (metadata.category) {
        tags.push(`<meta property="article:section" content="${escapeHtml(metadata.category)}" />`);
    }

    if (config.baseURL && filePath) {
        const canonicalURL = new URL(filePath.replace('.md', '.html'), config.baseURL).toString();

        tags.push(`<link rel="canonical" href="${escapeHtml(canonicalURL)}" />`);
        tags.push(`<meta property="og:url" content="${escapeHtml(canonicalURL)}" />`);
    }

    const imageURL = await generateImage(config.metadataImage, config.pfpURL, config.pageTitle, filePath)

    if (imageURL) {
        const absURL = `${config.baseURL}/static/${imageURL}`
        tags.push(`<meta property="og:image:type" content="image/png" />`);
        tags.push(`<meta property="og:image:alt" content="${title}" />`);
        tags.push(`<meta property="og:image:url" content="${escapeHtml(absURL)}" />`);
        tags.push(`<meta property="og:image" content="${escapeHtml(absURL)}" />`);
        tags.push(`<meta property="og:image:width" content="1200" />`);
        tags.push(`<meta property="og:image:height" content="630" />`);
        tags.push(`<meta name="twitter:image" content="${escapeHtml(absURL)}" />`);
    }

    return tags.join('\n  ')

}

const generateImage = async (imagePath: string, pfpPath: string, title: string, filePath: string): Promise<string> => {
    const outputDir = path.join('dist', 'static');
    await ensureDir(outputDir);

    const outputFileName = `${basename(filePath).toLowerCase().replace(/ /g, '-')}${Math.floor(Math.random() * 1000000) + 1}-og.png`
    const outputPath = path.join(outputDir, outputFileName)

    // TODO: WRITE THE LOGIC IF THE PFP IS A URL RATHER THAN PATH;
    try {
        const [baseImage, pfpImage] = await Promise.all([
            loadImage(imagePath), loadImage(pfpPath)
        ]);

        const width = 1200;
        const height = 630;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d')

        ctx.drawImage(baseImage, 0, 0, width, height);

        ctx.font = "bold 100px monospace";
        ctx.fillStyle = "#eff1f5";
        ctx.textAlign = "left";
        const text = title;
        const textX = 100;
        const textY = height / 2;
        ctx.fillText(text, textX, textY);

        // Draw title text
        ctx.font = "50px monospace";
        const p = '/' + filePath;
        const pX = 150;
        const pY = height * 0.67;
        ctx.fillText(p, pX, pY);

        const pfpSize = 100;
        const padding = 30;
        const pfpX = width - pfpSize - padding;
        const pfpY = padding;
        const r = pfpSize / 2;
        const centerX = pfpX + r;
        const centerY = pfpY + r;

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(pfpImage, pfpX, pfpY, pfpSize, pfpSize);
        ctx.restore();

        const out = createWriteStream(outputPath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);

        return new Promise((resolve, reject) => {
            out.on('finish', () => {
                resolve(outputFileName);
            });
            out.on('error', (err) => {
                console.error("Error writing file:", err);
                reject(err);
            });
        });
    } catch (err) {
        console.error("Failed to generate metadata image: ", err)
        throw err;
    }
}

const processMarkdown = async (
    filePath: string,
    fileMap: Map<string, string>
): Promise<{ content: string, frontMatter: Partial<Metadata>, tableOfContents: string }> => {
    try {
        const { content, data: frontmatter } = matter(await readFile(filePath, "utf-8"));
        const processor = unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkMath)
            .use(remarkRehype, {
                allowDangerousHtml: true,
            })
            .use(rehypeRaw)
            .use(rehypeMathjax)
            .use(rehypePrism, {
                showLineNumbers: true,
                ignoreMissing: true,
                defaultLanguage: 'text'
            })
            .use(rehypeStringify)

        const processedContent = await processor.run(processor.parse(content));
        const TOC = generateToc(processedContent);

        const html = await replaceObsidianEmbeds(
            processor.stringify(processedContent),
            fileMap
        )

        const newHtml = html.replace(/<p(?![\s\w-="'>])/g, '<p class="paragraph-spacing"');

        return {
            content: newHtml,
            frontMatter: frontmatter as Partial<Metadata>,
            tableOfContents: TOC,
        }
    } catch (err) {
        console.error("Failed to process markdown: ", err)
        throw err;
    }
}

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
            return `<img src="/static/${baseName}${extname(fileName)}" alt="${baseName}">`;
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


    result = result.replace(/==([^=]*)==/g, (_match: string, group1: string) => {
        return `<mark>${group1}</mark>`;
    });
    return result
};

const processEmbed = async (fullMatch: string, altText: string, url: string): Promise<{ fullMatch: string, replacement: string }> => {
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

const getContentType = async (url: string): Promise<string | null> => {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
        });

        return response.headers.get('Content-Type') ?? null;
    } catch (error) {
        console.error(`Failed to fetch content type for ${url}:`, error);
        return null;
    }
};

const escapeHtml = (unsafe: string): string => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};
