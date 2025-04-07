import readline from 'node:readline';
import { CONFIG_NAME, type Config } from './consts';
import { readFile, writeFile } from 'node:fs/promises';
import path from "path";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const ask = (question: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer));
    });
};

const setupGrimoire = async () => {
    const configPath = path.resolve(CONFIG_NAME)

    const rawData = await readFile(configPath, "utf-8")
    const config: Config = JSON.parse(rawData);
    const owner = await ask("Enter Owner's Name: ")
    const contentDir = await ask("Enter the absolute path of the contentDir: ")
    const baseURL = await ask("Enter the baseURL of your website: ");
    const remoteURL = await ask("Enter the remote url of your github repo: ")

    config.owner = owner;
    config.contentDir = contentDir;
    config.baseURL = baseURL;
    config.remoteURL = remoteURL;

    await writeFile(configPath, JSON.stringify(config, null, 2))
    console.log("Updated Config")
    rl.close();
}

await setupGrimoire().catch(err => {
    console.log("Error while setup: ", err)
    rl.close();
})
