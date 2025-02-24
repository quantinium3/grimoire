import { readFile, writeFile } from "fs/promises";
import Handlebars from "handlebars";
import path from "path";
import matter from 'gray-matter';
import { unified } from 'unified';
import markdown from 'remark-parse';
import html from 'remark-html';
import navbarData from "../grimoire.config.json";

Handlebars.registerHelper('replaceExtension', function (path: string) {
    return path.replace(/\.md$/, '.html');
});

const main = async () => {
    await compileLayout();
}

const compileLayout = async () => {
    try {
        const [navbarTemplate, pageTemplate, layoutTemplate] = await Promise.all([
            readFile("./templates/navbar.hbs", "utf-8"),
            readFile("./templates/page.hbs", "utf-8"),
            readFile("./templates/layout.hbs", "utf-8")
        ]);

        const targetPage = navbarData.navbar.find((page) => page.path === "index.md");
        if (!targetPage) {
            console.error(`Markdown file "index.md" not found in navbar.json`);
            return;
        }

        const navbarCompiled = Handlebars.compile(navbarTemplate);
        const navbarHTML = navbarCompiled(navbarData);

        Handlebars.registerPartial("navbar", navbarHTML);

        const mdFilePath = path.join("./content", "index.md");
        const mdContent = await readFile(mdFilePath, "utf-8");
        const { content, data: frontmatter } = matter(mdContent);
        const htmlContent = await unified().use(markdown).use(html).process(content);

        const pageCompiled = Handlebars.compile(pageTemplate);
        const finalHTML = pageCompiled({ title: targetPage.name, frontmatter, content: htmlContent.toString() });

        const layoutCompiled = Handlebars.compile(layoutTemplate);
        const outputHTML = layoutCompiled({ title: targetPage.name, content: finalHTML });

        const outputPath = path.join("dist", targetPage.path.replace('.md', '.html'));
        await writeFile(outputPath, outputHTML, "utf-8");
        console.log(`Generated: ${outputPath}`);
    } catch (error) {
        console.error("Error compiling layout:", error);
    }
}

await main();
