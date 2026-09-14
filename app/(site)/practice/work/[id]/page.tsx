/**
 * /practice/work/[id] 工作收集详情页
 * 使用轻量记录卡：场景、代码、记一下，其余 Markdown 二级标题按可选段落展示
 */
import PracticeHeader from "@/components/practice/PracticeHeader";
import { notFound } from "next/navigation";
import PracticeCodeBlock from "@/components/practice/PracticeCodeBlock";
import PracticeNav from "@/components/practice/PracticeNav";
import CodeCopyButton from "@/components/ui/CodeCopyButton";
import { mdxComponents } from "@/components/ui/MdxContent";
import {
  PRACTICE_COLLECTIONS,
  PRACTICE_REPO_URL,
} from "@/lib/practice/categories";
import { renderMDX } from "@/lib/mdx";
import {
  getAdjacentProblems,
  getAllProblems,
  getPracticeGroups,
  getProblemById,
} from "@/lib/practice/loader";

type PracticeWorkDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function WorkMarkdownSection({
  title,
  content,
}: {
  title: string;
  content?: string;
}) {
  if (!content) return null;
  const Content = await renderMDX(content, { theme: { light: "github-light", dark: "github-dark" } });

  return (
    <section className="practice-section">
      <h3 className="practice-section-title">{title}</h3>
      <article className="prose prose-sm dark:prose-invert mt-3 max-w-none">
        <Content components={mdxComponents} />
      </article>
    </section>
  );
}

export async function generateStaticParams() {
  return getAllProblems({ collection: "work" }).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PracticeWorkDetailPageProps) {
  const { id } = await params;
  const problem = getProblemById(id, { collection: "work" });
  if (!problem) return {};

  return {
    title: problem.title,
    description: `${PRACTICE_COLLECTIONS.work.title} · ${problem.tags?.join(" / ") ?? "代码片段"}`,
  };
}

export default async function PracticeWorkDetailPage({
  params,
}: PracticeWorkDetailPageProps) {
  const { id } = await params;
  const problem = getProblemById(id, { collection: "work" });
  if (!problem) notFound();

  const { prev, next } = getAdjacentProblems(id, { collection: "work" });
  const group = getPracticeGroups({ collection: "work" }).find((group) =>
    group.items.some((item) => item.id === problem.id)
  );
  const groupTitle = group?.title ?? problem.category;
  const githubFileUrl = `${PRACTICE_REPO_URL}/blob/main/${problem.entry}`;

  return (
    <article className="practice-entry">
      <PracticeHeader problem={problem} collection="work" groupTitle={groupTitle} sourceUrl={githubFileUrl} />

      <div className="practice-work-sections">
        <WorkMarkdownSection title="场景" content={problem.workNote?.scene} />

        {problem.workNote?.code ? (
          <WorkMarkdownSection title="代码" content={problem.workNote.code} />
        ) : (
          <section className="practice-section">
            <h3 className="practice-section-title">
              代码
            </h3>
            <PracticeCodeBlock code={problem.code} lang={problem.lang} />
          </section>
        )}

        <WorkMarkdownSection title="记一下" content={problem.workNote?.note} />

        {problem.workNote?.optional.map((section) => (
          <WorkMarkdownSection
            key={section.title}
            title={section.title}
            content={section.content}
          />
        ))}
      </div>
      <CodeCopyButton />

      <PracticeNav prev={prev} next={next} />
    </article>
  );
}
