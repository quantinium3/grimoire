import { Command } from "commander";

export const program = new Command();

program
    .name("grimoire")
    .description("A fast minimal static site generator")
    .version("1.0.0")

program
    .command("init")
    .description("initialize a new site")
    .argument("<name>", "project name")
    .option("-t, --template <type>", "template type", 'blog')
    action(init);

