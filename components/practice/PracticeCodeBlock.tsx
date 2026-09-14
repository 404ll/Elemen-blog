/**
 * 练习源码展示块（Server Component）
 * 构建/请求时在服务端调用 Shiki，输出 HTML 后注入 figure
 */
import { highlightCode } from "@/lib/practice/highlight";
import PracticeCopyButton from "./PracticeCopyButton";
import type { PracticeCodeLanguage } from "@/lib/practice/types";

type PracticeCodeBlockProps = {
  code: string;
  lang: PracticeCodeLanguage;
};

export default async function PracticeCodeBlock({
  code,
  lang,
}: PracticeCodeBlockProps) {
  const html = await highlightCode(code, lang);

  return (
    <figure
      className="practice-code-block"
      data-rehype-pretty-code-figure
    >
      <figcaption className="practice-code-caption"><span>{lang === "javascript" ? "JavaScript" : lang.toUpperCase()}</span><span>{code.trimEnd().split("\n").length} 行</span></figcaption>
      <PracticeCopyButton code={code} />
      <div
        // Shiki 已转义，仅渲染受信练习仓源码
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
