export interface Metadata {
    title: string;
    date: string;
    tags: string[];
    author: string;
    category: string;
    status: "Draft" | "In Progress" | "Complete";
    priority: "Low" | "Medium" | "High";
    aliases: string[];
    created: string;
    modified: string;
}

export interface Config {
    inputDir: string;
    relativeDir: string;
    owner: string;
}

export interface FileNode {
    name: string;
    path: string;
    type: "directory" | "file";
    children: FileNode[];
}
