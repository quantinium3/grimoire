import { writeFile } from "fs/promises";
import grimoire from "../grimoire.config.json";
import path from "path";
import { readFile } from "fs/promises";

export const generateCSSFile = async () => {
    let css = "/*DO NOT CHANGE ANYTHING IN THIS FILE. THIS FILE IS PREGENERATED AND WILL BE OVERWRITTEN.*/\n.light {\n";
    for (const [name, value] of Object.entries(grimoire.theme.colors.lightMode)) {
        css += `    --${name}: ${value};\n`;
    }
    css += "}\n\n";
    css += ".dark{\n";
    for (const [name, value] of Object.entries(grimoire.theme.colors.darkMode)) {
        css += `    --${name}: ${value};\n`;
    }
    css += "}\n";

    const precss: string = await readFile("./src/templates/assets/styles.css", "utf-8")
    const newcss = precss.split('\n').slice(26).join('\n')
    css += newcss;
    writeFile(path.join("src", "templates/assets/styles.css.bak"), precss);
    writeFile(path.join("src", "templates/assets/styles.css"), css);
}
