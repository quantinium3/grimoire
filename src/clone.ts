import { readFile, rm } from "fs-extra"
import { CONFIG_NAME, type Config } from "./consts"
import path from "path";
import { cp } from "fs/promises";

const cloneContentDir = async () => {
    const configPath = path.resolve(CONFIG_NAME);
    const rawConfig = await readFile(configPath, "utf-8");
    const config: Config = JSON.parse(rawConfig);

    await rm(config.inputDir, { recursive: true });
    await cp(config.contentDir, config.inputDir, { recursive: true })
}

cloneContentDir()
    .then(() => {
        console.log("Cloned the content directory successfully")
    })
    .catch(err => {
        console.log("Error while cloning the content directory: ", err)
    })
