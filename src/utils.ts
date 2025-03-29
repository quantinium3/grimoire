import path from "path";
import { globby } from "globby";
import type { Config, FileNode } from "./consts";
import { readFile } from "fs/promises";
import { ensureDir } from "fs-extra";
import Ffmpeg from "fluent-ffmpeg";
import { cp } from "fs/promises";
import sharp from "sharp";

Ffmpeg.setFfmpegPath(path.resolve(__dirname, './bin/ffmpeg-git-20240629-amd64-static/ffmpeg'));

export const copyVideos = async (inputDir: string, outputDir: string): Promise<void> => {
    try {
        const vidPattern = [
            `${inputDir}/**/*.{wmv,3gp,mkv,flv,mov,avi,ogg,m4a,mp4,webm}`,
        ]
        const videoPaths = await globby(vidPattern, {
            absolute: true,
            caseSensitiveMatch: false,
        })

        await ensureDir(outputDir);
        await Promise.all(
            videoPaths.map((vidPath: string) => {
                try {
                    const fileName = path.basename(vidPath).replace(/[^\w.-]/g, '-')
                    cp(vidPath, path.join(outputDir, fileName))
                } catch (err) {
                    console.error(err)
                    throw err;
                }
            })
        )
    } catch (err) {
        console.error(err)
        throw err;
    }
}

export const copyImages = async (inputDir: string, outputDir: string): Promise<void> => {
    try {
        const imagePattern = [
            `${inputDir}/**/*.{png,jpg,jpeg,gif,webp,svg}`,
        ];

        const imagePaths = await globby(imagePattern, {
            absolute: true,
            caseSensitiveMatch: false,
        });

        await ensureDir(outputDir);

        await Promise.all(
            imagePaths.map(async (imagePath: string) => {
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


export const getConfig = async (): Promise<Config> => {
    try {
        const configFile = await readFile("grimoire.config.json", "utf-8");
        return JSON.parse(configFile);
    } catch (err) {
        console.error("Error reading config file:", err);
        throw new Error("Failed to read configuration file");
    }
};


export const setHashMap = async (tree: FileNode | FileNode[], map: Map<string, string>): Promise<void> => {
    function traverse(node: FileNode): void {
        if (node.type === "file") {
            map.set(node.name.replace('.md', "").trim(), node.path.replace('.md', ".html"));
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
}
