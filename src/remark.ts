import { visit } from "unist-util-visit";
import type { Plugin } from 'unified';
import type { Node } from 'unist';
import type { Image } from 'mdast';

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

