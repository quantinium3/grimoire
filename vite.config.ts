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
    // Ensure the dist directory exists
    ensureDistDirectory();
    
    console.log("Running Tailwind CLI to generate CSS...");
    const tailwindResult = spawnSync("bunx", ["@tailwindcss/cli", "-i", "./src/templates/assets/input.css", "-o", "./dist/assets/style.css"], { 
      stdio: "inherit",
      shell: true
    });
    
    if (tailwindResult.status !== 0) {
      console.error("Error running Tailwind CLI");
    }
    
    console.log("Running main.ts to generate HTML...");
    const mainResult = spawnSync("bun", ["run", "./src/main.ts"], { 
      stdio: "inherit",
      shell: true
    });
    
    if (mainResult.status !== 0) {
      console.error("Error running main.ts");
    }
  };
  
  return {
    name: "generate-html-and-css",
    buildStart() {
      console.log("Starting build process...");
      regenerateFiles();
    },
    configResolved() {
      console.log("Config resolved, regenerating files...");
      regenerateFiles();
    }
  };
};

const htmlFiles = () => {
  ensureDistDirectory();
  
  try {
    const files = globSync("dist/**/*.html");
    console.log(`Found ${files.length} HTML files in dist directory`);
    
    return files.reduce((acc, file) => {
      const name = path.basename(file, ".html");
      acc[name] = resolve(__dirname, file);
      return acc;
    }, {});
  } catch (error) {
    console.warn("Warning: Could not find HTML files in dist directory", error);
    return {};
  }
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
