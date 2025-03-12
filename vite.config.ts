import { defineConfig, Plugin } from "vite";
import handlebars from "vite-plugin-handlebars";
import { spawnSync } from "child_process";
import { resolve } from "path";
import { globSync } from "glob";
import path from "path";
import fs from "fs";

const generateHtmlAndCssPlugin = (): Plugin => {
  const regenerateFiles = () => {
    const tempDir = resolve(__dirname, "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    spawnSync("bun", ["run", "./src/main.ts"], { stdio: "inherit", shell: true });
  };
  return {
    name: "generate-html-and-css",
    buildStart() {
      regenerateFiles();
    },
  };
};

const htmlFiles = () => {
  const files = globSync("temp/*.html");
  return files.reduce((acc, file) => {
    const name = path.basename(file, ".html");
    acc[name] = resolve(__dirname, file);
    return acc;
  }, {});
};

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: false,
    rollupOptions: {
      input: {
        ...htmlFiles(),
        styles: resolve(__dirname, "src/styles.css"), 
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/templates/partials"),
      reloadOnPartialChange: true,
    }),
    generateHtmlAndCssPlugin(),
  ],
});
