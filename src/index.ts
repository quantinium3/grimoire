import { globby } from 'globby';
import matter from 'gray-matter';
import { unified } from 'unified';
import markdown from 'remark-parse';
import html from 'remark-html';
import path from 'path';
import Handlebars from 'handlebars';
import { promises as fs } from 'fs';
import fse from 'fs-extra';

const getAllMarkdownFiles = async (inputPath: string) => {
    const paths = await globby(inputPath);
    return paths;
};

const replaceInternalLinks = async (content: string, currentDir: string) => {
    const internalLinkRegex = /\[\[([^\]]+)\]\]/g;
    content.replace(internalLinkRegex, async (match, pageName: string) => {
        console.log(pageName + '.md');
        console.log(currentDir)
        const file = await globby(encodeURIComponent(pageName), { cwd: currentDir })
        console.log(file)
    })
    return content;
}

const main = async (): Promise<void> => {
    const paths: string[] = await getAllMarkdownFiles('content/**/*.md');

    await Promise.all(
        paths.map(async (filepath: string) => {
            const fileContent = await fs.readFile(filepath, 'utf-8');
            const { content, data } = matter(fileContent);

            console.log("currentdir : ",filepath)
            const currentDir = path.dirname(filepath).replace('content/', '');
            console.log("currentdir : ",currentDir)
            const proccessedContent = replaceInternalLinks(content, currentDir);

            const htmlContent = await unified()
                .use(markdown)
                .use(html, { sanitize: false })
                .process(content);

            const outputPath = path.join(
                'dist',
                filepath.replace('content/', '').replace('.md', '.html')
            );

            const template = Handlebars.compile(
                await fs.readFile('templates/base.hbs', 'utf-8')
            );

            const outPutHtml = template({
                ...data,
                content: htmlContent.toString(),
            });

            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.writeFile(outputPath, outPutHtml);
        })
    );

    await fse.copy('content/assets', 'dist/assets');
    await fse.copy('public', 'dist');

    console.log('Site built successfully!');
};

(async () => {
    await main().catch((err) => {
        console.error('Failed to build the site:', err.stack || err);
        process.exit(1);
    });
})();
