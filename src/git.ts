import { execSync } from "node:child_process";
import { CONFIG_NAME, type Config } from "./consts";
import path from "path";
import { readFile } from "node:fs/promises";

const runGitCommand = (cmd: string) => {
    try {
        console.log("syncing...")
        const output = execSync(`git ${cmd}`, { stdio: "inherit" })
        return output
    } catch (err) {
        console.error(`Error running git command ${cmd}`, err)
        process.exit(1);
    }
}

const syncRepo = async () => {
    const config: Config = JSON.parse(await readFile(path.resolve(CONFIG_NAME), "utf-8"));
    runGitCommand('add .')
    runGitCommand(`commit -m "${new Date().toISOString().slice(0, 16).replace('T', ' ')}"`)
    runGitCommand('push origin main')

    if (!config.remoteURL) {
        console.log("Please run `bun run setup` to setup the variables")
    }

    const remoteURL = config.remoteURL;
    runGitCommand('remote remove origin')
    runGitCommand(`remote add origin ${remoteURL}`);
    runGitCommand('push origin main')
}

syncRepo().then(() => {
    console.log("successfully pushed.")
}).catch((err) => {
    console.log("Failed to push to git repo", err);
});
