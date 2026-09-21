import "server-only";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { cleanYouMindNodes, normalizeYouMindMarkdown } from "@/lib/markdown/youmind";

export async function compileYouMindContent(content: string) {
  const normalized = normalizeYouMindMarkdown(content);
  // Markdown only: imported documents cannot execute JSX, imports, or expressions.
  const compiled = await compile(normalized.markdown, {
    format: "md", outputFormat: "function-body", remarkPlugins: [remarkGfm, cleanYouMindNodes],
    rehypePlugins: [[rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark" }, keepBackground: false, defaultLang: "plaintext" }]],
  });
  const { default: Content } = await run(compiled, runtime);
  return { Content, ...normalized };
}
