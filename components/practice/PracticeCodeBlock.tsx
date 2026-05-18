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
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
