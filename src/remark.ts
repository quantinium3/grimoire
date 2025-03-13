import { visit } from "unist-util-visit";
import type { Plugin } from 'unified';
import type { Node } from 'unist';
import type { Image } from 'mdast';

export const rehypeAddCopyButton: Plugin<[], Node> = () => {
    return (tree) => {
        visit(tree, "element", (node: Element, index, parent) => {
            if (node.tagName === "pre" && node.children.some(child => child.type === "element" && child.tagName === "code")) {
                const copyButton: Element = {
                    type: "element",
                    tagName: "button",
                    properties: {
                        className: ["copy-button"],
                        "data-copy-state": "copy",
                    },
                    children: [{ type: "text", value: "Copy" }],
                };

                const wrapper: Element = {
                    type: "element",
                    tagName: "div",
                    properties: { className: ["code-block-wrapper"] },
                    children: [copyButton, { ...node }],
                };

                if (parent && index !== undefined) {
                    parent.children[index] = wrapper;
                }
            }
        });
    };
};


export const remarkPreventImages: Plugin = () => {
    return (tree) => {
        visit(tree, 'image', (node: Image, index, parent) => {
            if (parent && typeof index === 'number') {
                const imageMarkdown = `![${node.alt || ''}](${node.url})`;
                parent.children[index] = {
                    type: 'text',
                    value: imageMarkdown
                } as Node;
            }
        });
    };
};

