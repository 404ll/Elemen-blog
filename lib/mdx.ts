// lib/mdx.ts
import { compile } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"

// 配置 rehype-pretty-code（语法高亮）
const rehypePrettyCodeOptions = {
  theme: {
    dark: "github-dark-dimmed",
    light: "github-light",
  },
  keepBackground: false,
  defaultLang: "plaintext",
  onVisitLine(node: any) {
    // 防止空行消失
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }]
    }
  },
  onVisitHighlightedLine(node: any) {
    node.properties.className = ["highlighted"]
  },
  onVisitHighlightedChars(node: any) {
    node.properties.className = ["highlighted-chars"]
  },
}

export async function renderMDX(source: string) {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  })
  
  const fn = new Function(String(compiled))
  return fn({ ...runtime }).default
}
