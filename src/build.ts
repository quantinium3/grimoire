import path from "path";
import type { Config, FileNode, SearchIndex } from "./consts";
import { getConfig } from "./utils";
import { readdir, writeFile, readFile } from "fs/promises"
import { rmSync } from "fs";
import { ensureDir } from "fs-extra";
import { cp } from "fs/promises";
import { globby } from "globby";
import { processNode } from "./process";
import cliProgress from 'cli-progress';

const bar = new cliProgress.SingleBar({
    format: 'Processing [{bar}] {percentage}% | {value}/{total} directory',
}, cliProgress.Presets.shades_classic);

const buildFileTree = async (base: string, relative: string, config: Config): Promise<FileNode[]> => {
    const nodes: FileNode[] = [];
    const ignorePatterns: string[] = config.ignorePatterns;

    try {
        const entries = await readdir(path.join(base, relative), { withFileTypes: true });

        for (const entry of entries) {
            const fileName = entry.name;

            // dont include hidden dirs
            if (fileName.startsWith('.')) {
                continue;
            }

            if (ignorePatterns.includes(fileName)) {
                continue;
            }

            const isDir = entry.isDirectory();
            const relPath = path.join(relative, fileName)
            const pathStr = relPath.replace(/\\/g, "/");

            if (isDir) {
                const children = await buildFileTree(base, relPath, config)
                if (children.length != 0) {
                    nodes.push({
                        name: fileName,
                        path: pathStr,
                        type: "directory",
                        children: children
                    })
                }
            } else if (path.extname(fileName) === '.md') {
                nodes.push({
                    name: fileName,
                    path: pathStr,
                    type: "file",
                    children: [],
                })
            }
        }

        nodes.sort((a, b) => {
            if (a.type === "directory" && b.type === "file") return -1;
            if (a.type === "file" && b.type === "directory") return 1;
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        })

        return nodes;
    } catch (err) {
        console.error("Error while building file tree", err)
        return nodes;
    }
}

const getFileMap = (tree: FileNode | FileNode[]): Map<string, string> => {
    const map = new Map<string, string>
    function traverse(node: FileNode): void {
        if (node.type === "file") {
            map.set(node.name.replace('.md', "").trim(), node.path.replace('.md', '.html'))
        }

        for (const child of node.children) {
            traverse(child);
        }
    }

    if (Array.isArray(tree)) {
        for (const node of tree) {
            traverse(node);
        }
    } else {
        traverse(tree);
    }

    return map;
}

export const copyMedia = async (inputDir: string, outputDir: string): Promise<void> => {
    try {
        const mediaPattern = [
            `${inputDir}/**/*.{png,jpg,jpeg,gif,webp,svg,wmv,3gp,mkv,flv,mov,avi,ogg,m4a,mp4,webm}`,
        ];

        const mediaPaths = await globby(mediaPattern, {
            absolute: true,
            caseSensitiveMatch: false,
        });

        await ensureDir(outputDir);

        await Promise.all(
            mediaPaths.map(async (imagePath: string) => {
                const fileName = path.basename(imagePath)
                    .replace(/[^\w.-]/g, '-')
                const destPath = path.join(outputDir, `${fileName}`);
                cp(imagePath, destPath);
            })
        );
    } catch (err) {
        console.error("Error in copyImages:", err);
        throw err;
    }
};

const generateCSSFile = async (config: Config) => {
    let css = "/*DO NOT CHANGE ANYTHING IN THIS FILE. THIS FILE IS PREGENERATED AND WILL BE OVERWRITTEN.*/\n.light {\n";

    css += Object.entries(config.theme.colors.lightMode)
        .map(([name, value]) => `    --${name}: ${value};`)
        .join('\n');

    css += "}\n\n";
    css += ".dark{\n";

    css += Object.entries(config.theme.colors.darkMode)
        .map(([name, value]) => `    --${name}: ${value};`)
        .join('\n');

    css += "\n}\n\n";

    const precss: string = await readFile("./src/static/styles.css", "utf-8")
    const newcss = precss.split('\n').slice(22).join('\n')
    css += newcss;
    await writeFile(path.join("src", "static/styles.css.bak"), precss);
    await writeFile(path.join("src", "static/styles.css"), css);
}

const preProcess = async (config: Config): Promise<void> => {
    try {
        rmSync('dist', { recursive: true, force: true })
        const staticDir = path.join('dist', 'static')

        await ensureDir('dist')
        await ensureDir(staticDir)

        await generateCSSFile(config);
        await writeFile(path.join(staticDir, 'styles.css'), await readFile('./src/static/styles.css'))
        await copyMedia(config.inputDir, staticDir)
        await copyMedia('./src/static/', staticDir)
    } catch (err) {
        console.error("Error while preprocessing: ", err)
        throw err
    }
}

const searchIndexJson = async (map: Map<string, string>): Promise<void> => {
    try {
        const searchIndexData: SearchIndex[] = await Promise.all(
            Array.from(map.values()).map(async (val) => {
                const filePath = path.join('content', val.replace('.html', '.md'));
                const content = await readFile(filePath, 'utf-8');
                return { url: val, content };
            })
        );

        const outputPath = path.join('dist', 'static', 'search-index.json');
        await writeFile(outputPath, JSON.stringify(searchIndexData, null, 2), 'utf-8');
    } catch (error) {
        console.error('Failed to generate search index:', error);
        throw new Error('Search index generation failed');
    }
};


const build = async (): Promise<void> => {
    try {
        const config: Config = await getConfig();
        const fileTreeNode: FileNode[] = await buildFileTree(config.inputDir, ".", config).catch((err) => {
            console.error("Failed to build file tree: ", err);
            return []
        })

        const file_tree = JSON.stringify(fileTreeNode);
        const fileMap: Map<string, string> = getFileMap(fileTreeNode);

        await preProcess(config);
        await searchIndexJson(fileMap)

        bar.start(fileTreeNode.length, 0);
        for (const node of fileTreeNode) {
            await processNode(node, file_tree, config, fileMap);
            bar.increment();
        }

        bar.stop();
    } catch (err) {
        console.error("Error while building: ", err)
    }
}

await build();

