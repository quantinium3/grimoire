import { existsSync, rmSync } from "fs";
import config from "../grimoire.config.json"
import { ensureDir } from "fs-extra";
import { cp } from "fs/promises";

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

await cloneContent(config.symlink, "content");
