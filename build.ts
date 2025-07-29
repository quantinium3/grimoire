import { program } from "commander";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { ensureDir } from "fs-extra";
import matter from "gray-matter";
import Handlebars from "handlebars";
import path from "path";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

interface PostMetadata {
    title: string
    description: string
    date: string
    draft: boolean
}

interface StaticMetadata {
    title: string
    description: string
    draft: boolean
}

interface Slug {
    title: string
    date: string
    slug: string
}

type DateStyle = Intl.DateTimeFormatOptions['dateStyle']

export class Grimoire {
    private input_dir: string = "";
    private output_dir: string = "";
    private include_drafts: boolean = false;

    constructor(input_dir: string, output_dir: string, include_drafts: boolean) {
        this.input_dir = input_dir
        this.output_dir = output_dir;
        this.include_drafts = include_drafts;
    }

    private async process_content(): Promise<void> {
        try {
            if (!existsSync(this.input_dir)) {
                throw new Error("Content Directory not found. Did you run `grimoire init`?");
            }

            try {
                await ensureDir(this.output_dir);
            } catch (error) {
                throw new Error(`Failed to create output directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }

            let dirs: string[];
            try {
                dirs = readdirSync(this.input_dir, { withFileTypes: true })
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);
            } catch (error) {
                throw new Error(`Failed to read content directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }

            try {
                const index_path = path.join(this.input_dir, "index.md");
                if (!existsSync(index_path)) {
                    console.warn("Warning: index.md not found, skipping index page generation");
                } else {
                    const content = await this.get_content(index_path);
                    const title = content.frontmatter.title || "Untitled";
                    const slug = path.join(this.output_dir, "index.html");
                    const html_content = await this.convert_to_html(content.md_content);
                    await this.create_page(html_content, title, slug);
                }
            } catch (error) {
                console.error(`Error processing index.md: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }

            for (const dir of dirs) {
                try {
                    if (dir === "static") {
                        await this.process_static_directory(path.join(this.input_dir, dir));
                    } else {
                        await this.process_regular_directory(path.join(this.input_dir, dir));
                    }
                } catch (error) {
                    console.error(`Error processing directory '${dir}': ${error instanceof Error ? error.message : 'Unknown error'}`);
                    continue;
                }
            }
        } catch (error) {
            console.error(`Fatal error in process_content: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }

    private async process_static_directory(dir: string): Promise<void> {
        let files: string[];
        try {
            files = readdirSync(dir);
        } catch (error) {
            throw new Error(`Failed to read static directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // each file in static -> /filename.html
        for (const file of files) {
            if (file.endsWith(".md")) {
                try {
                    const file_path = path.join(dir, file);
                    const content: { md_content: string, frontmatter: StaticMetadata } = await this.get_content(file_path);
                    const title = content.frontmatter.title || path.basename(file, '.md');
                    const filename = file.replace(".md", "")
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .toLowerCase();
                    const slug = path.join(this.output_dir, filename);
                    const html_content = await this.convert_to_html(content.md_content);
                    await this.create_page(html_content, title, slug);
                } catch (error) {
                    console.error(`Error processing static file '${file}': ${error instanceof Error ? error.message : 'Unknown error'}`);
                    continue;
                }
            }
        }
    }

    private async process_regular_directory(dir: string): Promise<void> {
        try {
            await ensureDir(path.join(this.output_dir, dir));
        } catch (error) {
            throw new Error(`Failed to create directory '${dir}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        let files: string[];
        try {
            files = readdirSync(dir);
        } catch (error) {
            throw new Error(`Failed to read directory '${dir}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        console.log(`processing ${dir} directory`);
        const index: Slug[] = [];

        for (const file of files) {
            if (file.endsWith(".md")) {
                try {
                    const file_path = path.join(dir, file);
                    const content: { md_content: string, frontmatter: PostMetadata } = await this.get_content(file_path);
                    if (!this.include_drafts) continue;
                    const title = content.frontmatter.title || path.basename(file, '.md');
                    const date = this.format_date(content.frontmatter.date);
                    const filename = file.replace(".md", "")
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .toLowerCase();

                    const slug = path.join(this.output_dir, dir, filename);
                    const html_content = await this.convert_to_html(content.md_content);
                    await this.create_post(html_content, title, date, slug);

                    index.push({
                        title,
                        date,
                        slug: slug + ".html"
                    });
                } catch (error) {
                    console.error(`Error processing file '${file}' in directory '${dir}': ${error instanceof Error ? error.message : 'Unknown error'}`);
                    continue;
                }
            }
        }

        try {
            await this.create_index(index, dir);
        } catch (error) {
            console.error(`Error creating index for directory '${dir}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private async create_page(content: string, title: string, slug: string): Promise<void> {
        try {
            const template_path = "templates/page.hbs";

            if (!existsSync(template_path)) {
                throw new Error(`Page template not found at: ${template_path}`);
            }

            const template_content = readFileSync(template_path, "utf-8");
            const page_template = Handlebars.compile(template_content);

            const html = page_template({
                content,
                title
            });

            writeFileSync(slug + ".html", html);
        } catch (error) {
            throw new Error(`Failed to create page '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private async create_index(slugs: Slug[], dir: string): Promise<void> {
        try {
            const template_path = "templates/index.hbs";

            if (!existsSync(template_path)) {
                throw new Error(`Index template not found at: ${template_path}`);
            }

            const template_content = readFileSync(template_path, "utf-8");
            const index_template = Handlebars.compile(template_content);

            const html = index_template({
                slugs
            });

            const index_path = path.join(this.output_dir, dir, "index.html");
            writeFileSync(index_path, html);
        } catch (error) {
            throw new Error(`Failed to create index for directory '${dir}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private async create_post(content: string, title: string, date: string, slug: string): Promise<void> {
        try {
            const template_path = "templates/page.hbs";

            if (!existsSync(template_path)) {
                throw new Error(`Post template not found at: ${template_path}`);
            }

            const template_content = readFileSync(template_path, "utf-8");
            const post_template = Handlebars.compile(template_content);

            const html = post_template({
                content,
                title,
                date,
            });

            writeFileSync(slug + ".html", html);
        } catch (error) {
            throw new Error(`Failed to create post '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private async convert_to_html(content: string): Promise<string> {
        try {
            const result = await unified()
                .use(remarkParse)
                .use(remarkHtml)
                .process(content);

            return String(result);
        } catch (error) {
            throw new Error(`Failed to convert markdown to HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private format_date(date: string | undefined, dateStyle: DateStyle = "medium", locales = "en"): string {
        try {
            if (!date) {
                console.warn("No date provided, using current date");
                return new Intl.DateTimeFormat(locales, { dateStyle }).format(new Date());
            }

            let date_to_format: Date;
            if (date.includes("-")) {
                date_to_format = new Date(date.replaceAll("-", "/"));
            } else {
                date_to_format = new Date(date);
            }

            if (isNaN(date_to_format.getTime())) {
                console.warn(`Invalid date format: ${date}, using current date`);
                date_to_format = new Date();
            }

            const date_formatter = new Intl.DateTimeFormat(locales, { dateStyle });
            return date_formatter.format(date_to_format);
        } catch (error) {
            console.warn(`Error formatting date '${date}': ${error instanceof Error ? error.message : 'Unknown error'}, using current date`);
            return new Intl.DateTimeFormat(locales, { dateStyle }).format(new Date());
        }
    }

    private async get_content(file_path: string): Promise<{ md_content: string; frontmatter: any }> {
        try {
            if (!existsSync(file_path)) {
                throw new Error(`File not found: ${file_path}`);
            }

            const str = readFileSync(file_path, "utf-8");
            const { content, data } = matter(str);

            return {
                md_content: content,
                frontmatter: data
            };
        } catch (error) {
            throw new Error(`Failed to read content from '${file_path}': ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async buildFile(filepath: string) {
        const dir = filepath.split("/")[1]!;
        if (dir == "static") {
            this.process_static_directory(path.join(this.input_dir, "static"))
        } else {
            this.process_regular_directory(path.join(this.input_dir, dir))
        }
    }

    public async convert(): Promise<boolean> {
        try {
            console.log("grimoire building");
            await this.process_content();
            console.log("grimoire build completed successfully");
            return true;
        } catch (error) {
            console.error(`Grimoire build failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
        }
    }
}

program
    .version('1.0.0')
    .description('Grimoire - a simple and dumb static site generator')
    .option('-i, --input <path>', 'input directory', './content')
    .option('-o, --output <path>', 'output directory', './dist')
    .option('--include-drafts [true|false]', 'include drafts', 'false')
    .option('-f, --filepath <path>', 'input filepath')
    .action(async (options) => {
        if (!options.input || !options.output) {
            console.error('Error: Both input and output directories are required');
            process.exit(1);
        }

        const includeDrafts = options.includeDrafts === 'true';

        console.log(`Building site from ${options.input} to ${options.output} (Include drafts: ${includeDrafts})`);

        try {
            const grimoire = new Grimoire(options.input, options.output, includeDrafts);
            let success;
            if (options.filename) {
                success = await grimoire.buildFile(options.filepath);
            } else {
                success = await grimoire.convert();
            }
            process.exit(success ? 0 : 1);
        } catch (error) {
            console.error(`Error: Failed to build site - ${error}`);
            process.exit(1);
        }
    });

program.parse();
