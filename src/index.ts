import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import Handlebars from "handlebars";
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { globby } from 'globby';
import { existsSync } from 'fs';

interface NavbarItem {
    type: string;
    name: string;
    path: string;
}

interface Config {
    navbar: NavbarItem[];
    owner: string;
}

Handlebars.registerHelper('replaceExtension', function(path: string) {
    return path.replace(/\.md$/, '.html');
});

const ensureDirectoryExists = async (dirPath: string) => {
    if (!existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
    }
};

const compileTemplate = async (templateName: string, data: any, layoutData: any = {}) => {
    try {
        const [pageTemplate, layoutTemplate] = await Promise.all([
            readFile(`./templates/${templateName}.hbs`, "utf-8"),
            readFile("./templates/layout.hbs", "utf-8")
        ]);

        const pageCompiled = Handlebars.compile(pageTemplate);
        const contentHTML = pageCompiled(data);

        const layoutCompiled = Handlebars.compile(layoutTemplate);
        const finalHTML = layoutCompiled({
            owner: data.owner,
            title: layoutData.title || data.title || "",
            content: contentHTML
        });

        return finalHTML;
    } catch (error) {
        console.error(`Error compiling template ${templateName}:`, error);
        throw error;
    }
};

const outputHTML = async (outputPath: string, html: string) => {
    await ensureDirectoryExists(path.dirname(outputPath));
    await writeFile(outputPath, html, "utf-8");
    console.log(`Generated: ${outputPath}`);
};

const processMarkdownFile = async (filepath: string) => {
    const mdContent = await readFile(filepath, "utf-8");
    const { content, data: frontmatter } = matter(mdContent);
    
    // Updated markdown processor to preserve raw HTML
    const htmlContent = await unified()
        .use(remarkParse)
        .use(remarkRehype, { allowDangerousHtml: true }) // Allow HTML in markdown
        .use(rehypeRaw) // Parse the raw HTML
        .use(rehypeStringify) // Convert to HTML string
        .process(content);
        
    return {
        content: htmlContent.toString(),
        frontmatter
    };
};

const generateIndexFile = async (dirPath: string, files: string[], config: Config) => {
    try {
        const fileLinks = await Promise.all(files.map(async (file) => {
            const filename = path.basename(file, '.md');
            const { frontmatter } = await processMarkdownFile(file);
            return {
                name: frontmatter['title'] || filename,
                path: `./${filename}.html`
            };
        }));

        const directoryName = path.basename(dirPath);
        const html = await compileTemplate('index', {
            owner: config['owner'],
            files: fileLinks,
            heading: directoryName
        }, { title: directoryName });
        
        const outputPath = path.join(dirPath, "index.html");
        await outputHTML(outputPath, html);
    } catch (error) {
        console.error(`Error generating index file for directory ${dirPath}:`, error);
    }
};


const compilePage = async (filename: string, filepath: string, config: Config) => {
    try {
        const relativePath = path.relative('./content', filepath);
        const targetPage = config.navbar.find((page) => page.path === relativePath);

        const { content, frontmatter } = await processMarkdownFile(filepath);
        const html = await compileTemplate('page', {
            owner: config['owner'],
            title: frontmatter["title"] || "",
            frontmatter,
            content
        }, { title: frontmatter["title"] || filename });

        const outputPath = path.join(
            "dist",
            targetPage?.path.replace('.md', '.html') ||
            relativePath.replace('.md', '.html')
        );

        await outputHTML(outputPath, html);
    } catch (error) {
        console.error(`Error compiling page ${filename}:`, error);
    }
};

const main = async () => {
    try {
        await ensureDirectoryExists('./dist');
        await ensureDirectoryExists('./dist/assets');

        const fileContent = await readFile("grimoire.config.json", "utf-8");
        const config: Config = JSON.parse(fileContent);

        const navbarTemplate = await readFile("./templates/navbar.hbs", "utf-8");
        const navbarCompiled = Handlebars.compile(navbarTemplate);
        const navbarHTML = navbarCompiled(config);
        Handlebars.registerPartial('navbar', navbarHTML);

        for (const item of config.navbar) {
            if (item.type === 'file') {
                await compilePage(item.name, path.join("./content", item.path), config);
            } else if (item.type === 'directory') {
                const dirPath = path.join("./dist", item.path);
                await ensureDirectoryExists(dirPath);

                const files = await globby([path.join("./content", item.path, "*.md")]);
                for (const file of files) {
                    const filename = path.basename(file, '.md');
                    await compilePage(filename, file, config);
                }
                await generateIndexFile(dirPath, files, config);
            }
        }

        const cssContent = await readFile('./templates/assets/styles.css');
        await writeFile('./dist/assets/styles.css', cssContent);

        console.log("Site generation completed successfully!");
    } catch (error) {
        console.error("Error generating site:", error);
    }
};

await main();
