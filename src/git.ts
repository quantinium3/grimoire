import { execSync } from "node:child_process";

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
    runGitCommand('add .')
    runGitCommand(`commit -m "${new Date().toISOString().slice(0, 16).replace('T', ' ')}"`)
    runGitCommand('push origin main')
}

syncRepo().then(() => {
    console.log("successfully pushed.")
}).catch((err) => {
    console.log("Failed to push to git repo", err);
});
