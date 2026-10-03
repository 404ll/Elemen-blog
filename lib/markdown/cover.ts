import { createProcessor } from "@mdx-js/mdx";
import { safeImageUrl } from "./youmind.ts";

const markdownParser = createProcessor({ format: "md" });

type ImageNode = {
  type: string;
  url?: string;
  identifier?: string;
  children?: ImageNode[];
};

export function extractYouMindCover(markdown: string): string | undefined {
  const tree = markdownParser.parse(markdown);
  const definitions = new Map<string, string>();

  const collectDefinitions = (node: ImageNode) => {
    if (node.type === "definition" && node.identifier && node.url && !definitions.has(node.identifier)) {
      definitions.set(node.identifier, node.url);
    }
    node.children?.forEach(collectDefinitions);
  };
  collectDefinitions(tree);

  const findImage = (node: ImageNode): string | undefined => {
    const source = node.type === "image"
      ? node.url
      : node.type === "imageReference" && node.identifier
        ? definitions.get(node.identifier)
        : undefined;

    if (source) {
      const url = safeImageUrl(source);
      if (url) {
        return url;
      }
    }

    for (const child of node.children ?? []) {
      const url = findImage(child);
      if (url) {
        return url;
      }
    }
    return undefined;
  };

  return findImage(tree);
}
