import "server-only";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { cleanYouMindNodes, normalizeYouMindMarkdown } from "@/lib/markdown/youmind";

export async function compileYouMindContent(content: string) {
  // 先解析图片元数据；引用标记和代码高亮在下方编译阶段处理。
  const normalized = normalizeYouMindMarkdown(content);
  // 强制按普通 Markdown 编译，不执行源文档中的 JSX、导入或表达式。
  const compiled = await compile(normalized.markdown, {
    format: "md", outputFormat: "function-body", remarkPlugins: [remarkGfm, cleanYouMindNodes],
    rehypePlugins: [[rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark" }, keepBackground: false, defaultLang: "plaintext" }]],
  });
  const { default: Content } = await run(compiled, runtime);
  return { Content, ...normalized };
}
