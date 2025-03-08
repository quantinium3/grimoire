import { existsSync, rmSync } from "fs";
import path from "path";
import { globby } from "globby";
import { copyFile } from "fs/promises";
import type { Config } from "./consts";
import { readFile } from "fs/promises";
import { ensureDir } from "fs-extra";
import { cp } from "fs/promises";

export const copyImages = async (inputDir: string, outputDir: string): Promise<void> => {
    try {
        const imagePattern = [
            `${inputDir}/**/*.{png,jpg,jpeg,gif,webp,svg}`
        ]
        const imagePaths = await globby(imagePattern, {
            absolute: true,
        })
        await ensureDir(outputDir)
        await Promise.all(
            imagePaths.map(async (imagePath: string) => {
                const fileName = path.basename(imagePath).replace(/ /g, "-");
                const destPath = path.join(outputDir, fileName);
                await copyFile(imagePath, destPath);
                console.log(`Copied image: ${destPath}`);
            })
        );
    } catch (err) {
        console.error("Error copying images:", err);
        throw err;
    }
}

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
