/**
 * 练习源码展示块（Server Component）
 * 构建/请求时在服务端调用 Shiki，输出 HTML 后注入 figure
 */
import { highlightCode } from "@/lib/practice/highlight";

type PracticeCodeBlockProps = {
  code: string;
  lang: "javascript" | "jsx";
};

export default async function PracticeCodeBlock({
  code,
  lang,
}: PracticeCodeBlockProps) {
  const html = await highlightCode(code, lang);

  return (
    <figure
      className="practice-code-block overflow-x-auto rounded-sm border border-gray-200 dark:border-gray-700"
      data-rehype-pretty-code-figure
    >
      <div
        className="text-sm [&_pre]:m-0 [&_pre]:p-4 [&_pre]:overflow-x-auto"
        // Shiki 已转义，仅渲染受信练习仓源码
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
