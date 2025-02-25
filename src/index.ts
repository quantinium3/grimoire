import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import Handlebars from "handlebars";
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import { globby } from 'globby';
import { existsSync } from 'fs';

interface NavbarItem {
    type: string;
    name: string;
    path: string;
}

interface Config {
    navbar: NavbarItem[];
}

Handlebars.registerHelper('replaceExtension', function(path: string) {
    return path.replace(/\.md$/, '.html');
});

const ensureDirectoryExists = async (dirPath: string) => {
    if (!existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
    }
};

const main = async () => {
    try {
        await ensureDirectoryExists('./dist');
        
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
                const files = await globby([path.join("./content", item.path, "*.md")]);
                for (const file of files) {
                    const filename = path.basename(file, '.md');
                    await compilePage(filename, file, config);
                }
            }
        }
        
        console.log("Site generation completed successfully!");
    } catch (error) {
        console.error("Error generating site:", error);
    }
};

const compilePage = async (filename: string, filepath: string, config: Config) => {
    try {
        const [pageTemplate, layoutTemplate] = await Promise.all([
            readFile("./templates/page.hbs", "utf-8"),
            readFile("./templates/layout.hbs", "utf-8")
        ]);
        
        const relativePath = path.relative('./content', filepath);
        const targetPage = config.navbar.find((page) => page.path === relativePath);
        
        if (!targetPage) {
            console.warn(`Warning: Markdown file "${relativePath}" not found in navbar config. Using filename as title.`);
        }
        
        const mdContent = await readFile(filepath, "utf-8");
        const { content, data: frontmatter } = matter(mdContent);
        
        const htmlContent = await unified()
            .use(remarkParse)
            .use(remarkHtml)
            .process(content);
        
        const pageCompiled = Handlebars.compile(pageTemplate);
        const pageData = {
            title: frontmatter["title"] || filename,
            frontmatter,
            content: htmlContent.toString()
        };
        const finalHTML = pageCompiled(pageData);
        
        const layoutCompiled = Handlebars.compile(layoutTemplate);
        const outputHTML = layoutCompiled({
            title: frontmatter["title"] || filename,
            content: finalHTML
        });
        
        const outputPath = path.join(
            "dist",
            targetPage?.path.replace('.md', '.html') || 
            relativePath.replace('.md', '.html')
        );
        
        await ensureDirectoryExists(path.dirname(outputPath));
        
        await writeFile(outputPath, outputHTML, "utf-8");
        console.log(`Generated: ${outputPath}`);
    } catch (error) {
        console.error(`Error compiling page ${filename}:`, error);
    }
};

await main();
