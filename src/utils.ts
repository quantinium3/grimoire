import { existsSync } from "fs";
import path from "path";
import { mkdir } from "fs/promises";
import { globby } from "globby";
import { copyFile } from "fs/promises";
export const copyImages = async (inputDir: string, outputDir: string): Promise<void> => {
    try {
        const imagePattern = [
            `${inputDir}/**/*.{png,jpg,jpeg,gif,webp,svg}`
        ]
        const imagePaths = await globby(imagePattern, {
            absolute: true,
        })
        await ensureDirectory(outputDir)
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

export const ensureDirectory = async (dirpath: string): Promise<void> => {
    if (!existsSync(dirpath)) {
        await mkdir(dirpath, { recursive: true });
    }
};
