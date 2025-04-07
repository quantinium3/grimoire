export interface Config {
    inputDir: string;
    owner: string;
    contentDir: string;
    pfpURL: string;
    baseURL: string;
    ignorePatterns: ['private']
    metadataImage: string
    pageTitle: string
    theme: {
        colors: {
            lightMode: Theme
            darkMode: Theme
        }
    }
}

interface Theme {
    background: string;
    lightbackground: string;
    darktext: string;
    heading: string;
    links: string;
    linkshover: string;
    text: string;
    comment: string;
}

export interface FileNode {
    name: string;
    path: string;
    type: "directory" | "file";
    children: FileNode[];
}

export interface SearchIndex {
    content: string;
    url: string;
}

export interface Metadata {
    title: string;
    date: string;
    tags: string[];
    author: string;
    category: string;
    status: "Draft" | "In Progress" | "Complete"
    priority: "Low" | "Medium" | "High"
    createdAt: string;
    updatedAt: string;
    description: string;
}

export interface tableOfContentsEntry {
    text: string,
    id: string,
    level: number
}
export const CONFIG_NAME = "grimoire.config.json"
