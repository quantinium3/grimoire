import fs from "fs/promises";
import path from "path";

interface FileNode {
    name: string;
    path: string;
    type: "directory" | "file";
    children: FileNode[];
}

export const buildFileTree = async (base: string, relative: string): Promise<FileNode[]> => {
    const fullPath = path.join(base, relative);
    const nodes: FileNode[] = [];

    try {
        const entries = await fs.readdir(fullPath, { withFileTypes: true });

        for (const entry of entries) {
            const fileName = entry.name;

            if (fileName.startsWith(".")) {
                continue;
            }

            const isDir = entry.isDirectory();
            const relPath = path.join(relative, fileName);
            const pathStr = relPath.replace(/\\/g, "/");

            if (isDir) {
                const children = await buildFileTree(base, relPath);
                if (children.length != 0) {
                    nodes.push({
                        name: fileName,
                        path: pathStr,
                        type: "directory",
                        children: children,
                    });
                }
            } else if (path.extname(fileName) === ".md") {
                nodes.push({
                    name: fileName,
                    path: pathStr,
                    type: "file",
                    children: [],
                });
            }
        }
    } catch (err) {
        console.log("Error: ", err);
        return nodes;
    }

    nodes.sort((a, b) => {
        if (a.type === "directory" && b.type === "file") return -1;
        if (a.type === "file" && b.type === "directory") return 1;
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    return nodes;
};
