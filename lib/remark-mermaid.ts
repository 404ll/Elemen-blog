import type { Root, RootContent } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";

// 在代码高亮前提取 Mermaid，保留原始换行及特殊字符。
export default function remarkMermaid() {
  return (tree: Root) => {
    function transform(parent: { children: RootContent[] }) {
      parent.children = parent.children.map((node) => {
        if (node.type === "code" && node.lang?.toLowerCase() === "mermaid") {
          const diagram: MdxJsxFlowElement = {
            type: "mdxJsxFlowElement",
            name: "MermaidDiagram",
            attributes: [{ type: "mdxJsxAttribute", name: "chart", value: node.value }],
            children: [],
          };
          return diagram;
        }
        if ("children" in node) transform(node as { children: RootContent[] });
        return node;
      });
    }
    transform(tree);
  };
}
