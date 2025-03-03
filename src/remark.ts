import { visit } from "unist-util-visit";
import { type Node } from "unist";
import { type Plugin } from "unified";

export const remarkObsidianImages: Plugin<[], Node> = () => {
    return (tree) => {
        visit(tree, "paragraph", (node: any) => {
            node.children.forEach((child: any, index: number) => {
                if (child.type === "text" && child.value.match(/!\[\[(.+?)\]\]/)) {
                    const match = child.value.match(/!\[\[(.+?)\]\]/);
                    if (match) {
                        const fileName = match[1];
                        const imgExtensions = /\.(png|jpg|jpeg|svg|webp)$/i;
                        if (imgExtensions.test(fileName)) {
                            const imageName = fileName.replace(/ /g, "-");
                            node.children[index] = {
                                type: "image",
                                url: `/assets/images/${imageName}`,
                                alt: imageName,
                                data: {
                                    hName: "img",
                                    hProperties: {
                                        src: `/assets/images/${imageName}`,
                                        alt: imageName,
                                        loading: "lazy"
                                    }
                                }
                            };
                        }
                        // If it’s a video, leave it as plain text (or handle differently if desired)
                    }
                }
            });
        });
    };
};
