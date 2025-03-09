import { existsSync, rmSync } from "fs";
import path from "path";
import { globby } from "globby";
import type { Config } from "./consts";
import { readFile } from "fs/promises";
import { ensureDir } from "fs-extra";
import { cp } from "fs/promises";
import Ffmpeg from "fluent-ffmpeg";

Ffmpeg.setFfmpegPath(path.resolve(__dirname, './bin/ffmpeg-git-20240629-amd64-static/ffmpeg'));

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
                try {
                    const fileName = path.basename(imagePath)
                        .replace(/[^\w.-]/g, '-')
                    const baseName = fileName.split('.')[0];
                    const destPath = path.join(outputDir, `${baseName}.jpeg`);

                    await new Promise((resolve, reject) => {
                        Ffmpeg(imagePath)
                            .outputOptions(['-vf scale=-2:360'])
                            .outputOptions(['-q:v 2'])
                            .on('end', resolve)
                            .on('error', reject)
                            .save(destPath);
                    });

                    console.log(`Processed image: ${destPath}`);
                } catch (error) {
                    console.error(`Failed to process ${imagePath}:`, error);
                    throw error;
                }
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

export const cloneContent = async (symlink: string, dest: string) => {
    if (existsSync(dest) && dest != '/') {
        try {
            rmSync(dest, { recursive: true, force: true });
        } catch (err) {
            console.error(err)
            throw err;
        }
    }
    try {
        ensureDir(dest)
        cp(symlink, dest, { recursive: true });
    } catch (err) {
        console.error(err);
        throw err
    }
};
