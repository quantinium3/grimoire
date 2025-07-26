import type { Options } from "../types";
import path from "path";
import fs from "fs-extra";

export async function init(name: string, options: Options) {
    const project_dir = path.resolve(name);
    await fs.ensureDir(project_dir);
    process.chdir(project_dir);

    await create_template(options.template);

    console.log(`Project ${name} created successfully`);
}

async function create_templates(template: string) {
    await fs.ensureDir("grimoire/posts")
    await fs.ensureDir("templates")
    await
}
