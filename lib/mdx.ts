// lib/mdx.ts
import { compile } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import rehypePrettyCode, { Options } from "rehype-pretty-code"
import remarkGfm from "remark-gfm"

// 配置 rehype-pretty-code（语法高亮）
type PrettyNode = {
  children?: Array<{ type?: string; value?: string }>;
  properties?: Record<string, unknown>;
};

const rehypePrettyCodeOptions = {
  theme: {
    dark: "github-dark-dimmed",
    light: "github-light",
  },
  keepBackground: false,
  defaultLang: "plaintext",
  onVisitLine(node: PrettyNode) {
    // 防止空行消失
    if (!node.children) {
      node.children = [{ type: "text", value: " " }];
    } else if (node.children.length === 0) {
      node.children.push({ type: "text", value: " " });
    }
  },
  onVisitHighlightedLine(node: PrettyNode) {
    if (!node.properties) node.properties = {};
    node.properties.className = ["highlighted"];
  },
  onVisitHighlightedChars(node: PrettyNode) {
    if (!node.properties) node.properties = {};
    node.properties.className = ["highlighted-chars"];
  },
} satisfies Options;

export async function renderMDX(source: string) {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  });
  
  const fn = new Function(String(compiled));
  return fn({ ...runtime }).default;
}
