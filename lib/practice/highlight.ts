/**
 * Practice 代码高亮（Shiki）
 * 服务端组件调用；单例 Promise 避免构建时重复初始化 highlighter
 */
import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

/** 懒加载并复用 Shiki 实例，仅注册练习仓会用到的语言与主题 */
async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["one-dark-pro"],
      langs: ["javascript", "jsx"],
    });
  }
  return highlighterPromise;
}

/** 将源码转为带样式的 HTML，由 PracticeCodeBlock 通过 dangerouslySetInnerHTML 渲染 */
export async function highlightCode(
  code: string,
  lang: "javascript" | "jsx"
): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang,
    theme: "one-dark-pro",
  });
}
