import { visit } from "unist-util-visit";
import type { Plugin } from 'unified';
import type { Node, Parent } from 'unist';
import type { Image } from 'mdast';

export const remarkObsidianEmbeds: Plugin<[], Node> = () => {
  return async (tree) => {
    const promises = [];

    visit(tree, 'paragraph', (node) => {
      node.children.forEach((child, index) => {
        if (child.type !== 'text' || !child.value || typeof child.value !== 'string') return;

        const textNode = child;
        const match = textNode.value.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (!match) return;

        const [, alt, url] = match;

        const promise = (async () => {
          let embedUrl = null;
          if (url.includes('youtube.com') || url.includes('youtu.be')) {
            if (url.includes('youtube.com/watch')) {
              const videoId = new URL(url).searchParams.get('v');
              if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (url.includes('youtu.be')) {
              const videoId = url.split('/').pop()?.split('?')[0];
              if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }

            if (embedUrl) {
              node.children[index] = {
                type: 'html',
                value: `<iframe title="${alt.replace(/ /g, '-')}" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`,
              };
              return;
            }
          }

          const type = await getContentType(url);
          if (type.startsWith('image/')) {
            node.children[index] = {
              type: 'image',
              url,
              alt: alt.replace(/ /g, '-'),
            };
          }
        })();

        promises.push(promise);
      });
    });

    await Promise.all(promises);
  };
};


/* export const remarkObsidianEmbeds: Plugin<[], Node> = () => {
    return (tree) => {
        visit(tree, "paragraph", (node: any) => {
            node.children.forEach((child: any, index: number) => {
                if (child.type === "text" && child.value.match(/!\[\[(.+?)\]\]/)) {
                    const match = child.value.match(/!\[\[(.+?)\]\]/);
                    if (match) {
                        const fileName = match[1];
                        const imgExtensions = /\.(png|jpg|jpeg|svg|webp)$/i;
                        const vidExtensions = /\.(png|jpg|jpeg|svg|webp)$/i;
                        if (imgExtensions.test(fileName)) {
                            const imageName = fileName.replace(/ /g, "-").split('.')[0] + '.jpeg';
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
}; */

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

export const getContentType = async (url: string): Promise<string | null> => {
    try {
        const res = await fetch(url, {
            method: "HEAD",
            headers: {
                'Accept': '*/*',
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.headers.get('Content-Type')
    } catch (err) {
        console.error("error: ", err);
        return null;
    }
}
