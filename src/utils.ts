import { readFile } from "fs/promises";
import type { Config } from "./consts";

export const getConfig = async (): Promise<Config> => {
    try {
        const configFile = await readFile("grimoire.config.json", "utf-8")
        return JSON.parse(configFile);
    } catch (err) {
        console.log("Error while reading the config file: ", err)
        throw err;
    }
}
