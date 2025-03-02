import { defineConfig, Plugin } from "vite";
import handlebars from "vite-plugin-handlebars";
import tailwindcss from "@tailwindcss/vite";
import { spawnSync } from "child_process";
import { resolve } from "path";
import { globSync } from "glob";
import path from "path";
import fs from "fs";

const generateHtmlAndCssPlugin = (): Plugin => {
    const regenerateFiles = () => {
        console.log("Running Tailwind CLI to generate CSS...");
        spawnSync("bunx", ["@tailwindcss/cli", "-i", "./src/templates/assets/input.css", "-o", "./dist/assets/styles.css"], { 
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
        configureServer(server) {
            const templatePaths = [
                resolve(__dirname, "src/templates/layout.hbs"),
                resolve(__dirname, "src/templates/page.hbs"),
            ];
            
            // Ensure the paths exist
            templatePaths.forEach(path => {
                if (fs.existsSync(path)) {
                    console.log(`Watching ${path} for changes...`);
                } else {
                    console.warn(`Warning: ${path} does not exist`);
                }
            });
            
            server.watcher.add(templatePaths);
            
            server.watcher.on("change", (file) => {
                const normalizedFile = path.normalize(file);
                
                // Check if the changed file is one of our templates or main.ts
                if (templatePaths.some(template => normalizedFile === path.normalize(template)) || 
                    normalizedFile.endsWith("main.ts")) {
                    console.log(`Change detected in ${normalizedFile}, regenerating files...`);
                    regenerateFiles();
                }
            });
        }
    };
};

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

export default defineConfig({
    root: "./dist",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
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
    server: {
        open: "/index.html",
        watch: {
            usePolling: true,
            ignored: ["**/node_modules/**"],
        },
    },
});
