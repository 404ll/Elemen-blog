/**
 * /practice/work/[id] 工作收集详情页
 * 使用轻量记录卡：场景、代码、记一下，其余 Markdown 二级标题按可选段落展示
 */
import Link from "next/link";
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
  const Content = await renderMDX(content);

  return (
    <section className="rounded-sm border border-gray-200/80 bg-white/50 p-4 dark:border-gray-700/80 dark:bg-white/5">
      <h3 className="text-sm font-bold text-black dark:text-white">{title}</h3>
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
    <article>
      <p className="mb-2 text-xs font-mono text-gray-500 dark:text-gray-400">
        工作收集 / {groupTitle} / {problem.id}
      </p>
      <h2 className="mb-3 text-2xl font-bold text-black dark:text-white">
        {problem.title}
      </h2>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-none border-[1.5px] border-current px-2 py-0.5 font-mono text-xs font-bold">
            {groupTitle}
          </span>
          {problem.updatedAt && (
            <span className="rounded-none border border-gray-400 px-2 py-0.5 font-mono text-xs text-gray-600 dark:text-gray-400">
              {problem.updatedAt}
            </span>
          )}
          {problem.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-none border border-gray-400 px-2 py-0.5 font-mono text-xs text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={githubFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:underline"
        >
          在 GitHub 查看源码 →
        </Link>
      </div>

      <div className="space-y-4">
        <WorkMarkdownSection title="场景" content={problem.workNote?.scene} />

        {problem.workNote?.code ? (
          <WorkMarkdownSection title="代码" content={problem.workNote.code} />
        ) : (
          <section className="space-y-3 rounded-sm border border-gray-200/80 bg-white/50 p-4 dark:border-gray-700/80 dark:bg-white/5">
            <h3 className="text-sm font-bold text-black dark:text-white">
              代码
            </h3>
            <PracticeCodeBlock code={problem.code} lang={problem.lang} />
            <CodeCopyButton />
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
