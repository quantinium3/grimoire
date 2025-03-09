import { defineConfig, Plugin } from "vite";
import handlebars from "vite-plugin-handlebars";
import tailwindcss from "@tailwindcss/vite";
import { spawnSync } from "child_process";
import { resolve } from "path";
import { globSync } from "glob";
import path from "path";
import fs from "fs";

// Plugin to generate HTML and CSS files
const generateHtmlAndCssPlugin = (): Plugin => {
    const regenerateFiles = () => {
        console.log("Running Tailwind CLI to generate CSS...");
        spawnSync("bunx", ["@tailwindcss/cli", "-i", "./src/templates/assets/input.css", "-o", "./dist/assets/style.css"], { 
            stdio: "inherit",
            shell: true
        });
        
        console.log("Running main.ts to generate HTML...");
        spawnSync("bun", ["run", "./src/main.ts"], { 
            stdio: "inherit",
            shell: true
        });
    };
    
    return {
        name: "generate-html-and-css",
        configResolved() {
            regenerateFiles();
        },
        // No server configuration since we're only building
    };
};

// Helper function to get HTML files for rollup input
const htmlFiles = () => {
    try {
        return globSync("dist/**/*.html").reduce((acc, file) => {
            const name = path.basename(file, ".html");
            acc[name] = resolve(__dirname, file);
            return acc;
        }, {});
    } catch (error) {
        console.warn("Warning: Could not find HTML files in dist directory");
        return {};
    }
};

// Build-only configuration
export default defineConfig({
    plugins: [
        handlebars({
            partialDirectory: resolve(__dirname, "src/templates/partials"),
            reloadOnPartialChange: true,
        }),
        generateHtmlAndCssPlugin(),
        tailwindcss(),
    ],
    build: {
        outDir: resolve(__dirname, "dist"),
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: {
                ...htmlFiles(),
                styles: resolve(__dirname, "src/styles.css"),
            },
        },
    },
});
