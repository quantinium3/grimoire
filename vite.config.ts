import { defineConfig, Plugin } from "vite";
import handlebars from "vite-plugin-handlebars";
import tailwindcss from "@tailwindcss/vite";
import { spawnSync } from "child_process";
import { resolve } from "path";
import { globSync } from "glob";
import path from "path";
import fs from "fs";

const ensureDistDirectory = () => {
  const distDir = resolve(__dirname, "dist");
  const assetsDir = resolve(__dirname, "dist/assets");
  
  if (!fs.existsSync(distDir)) {
    console.log("Creating dist directory...");
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  if (!fs.existsSync(assetsDir)) {
    console.log("Creating dist/assets directory...");
    fs.mkdirSync(assetsDir, { recursive: true });
  }
};

const generateHtmlAndCssPlugin = (): Plugin => {
  const regenerateFiles = () => {
    const tempDir = resolve(__dirname, "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    spawnSync("bunx", ["@tailwindcss/cli", "-i", "./src/templates/assets/input.css", "-o", "./temp/assets/style.css"], { stdio: "inherit", shell: true });
    spawnSync("bun", ["run", "./src/main.ts"], { stdio: "inherit", shell: true }); // Ensure main.ts writes to temp/
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
  // Remove root: "./dist" as it's causing confusion with the build output
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: false, // Change to false to prevent deleting our generated files
    manifest: true,
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
    tailwindcss(),
  ],
});
