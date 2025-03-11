import { readFile, writeFile } from "fs/promises";
import { buildFileTree } from "./file-tree";
import { cloneContent, copyImages, getConfig } from "./utils";
import type { Config, FileNode } from "./consts";
import { processNode } from "./process";
import { ensureDir } from "fs-extra";
import { rmSync } from "fs";

const main = async (): Promise<void> => {
    try {
        const config: Config = await getConfig();
        const fileTreeNodes: FileNode[] = await buildFileTree(config.inputDir, config.relativeDir).catch((err) => {
            console.log("Failed to build file tree: ", err);
            return [];
        });

        const file_tree = JSON.stringify(fileTreeNodes);

        rmSync('dist', { recursive: true, force: true });
        await ensureDir("dist");
        await ensureDir("dist/assets/styles");
        await ensureDir("dist/assets/js");

/*         cloneContent(config.symlink, "content") */

        await writeFile(
            "dist/assets/styles/prism.css",
            await readFile("./node_modules/prismjs/themes/prism-okaidia.css", "utf-8")
        );

        await copyImages(config.inputDir, "dist/assets/images");
        await Promise.all(
            fileTreeNodes.map(node => processNode(node, config.inputDir, file_tree, config))
        );

        console.log("Site generation completed successfully!");
    } catch (err) {
        console.error("Error generating site:", err);
    }
};


main().catch(console.error);
