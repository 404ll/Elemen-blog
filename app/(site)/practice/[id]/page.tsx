/**
 * /practice/[id] 题目详情页（SSG）
 * generateStaticParams 预渲染全部题目；展示题面、Shiki 高亮源码、复制与上下题导航
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import PracticeCodeBlock from "@/components/practice/PracticeCodeBlock";
import PracticeNav from "@/components/practice/PracticeNav";
import CodeCopyButton from "@/components/ui/CodeCopyButton";
import { mdxComponents } from "@/components/ui/MdxContent";
import {
  DIFFICULTY_LABELS,
  PRACTICE_REPO_URL,
} from "@/lib/practice/categories";
import { renderMDX } from "@/lib/mdx";
import {
  getAdjacentProblems,
  getAllProblems,
  getPracticeGroups,
  getProblemById,
} from "@/lib/practice/loader";

type PracticeDetailPageProps = {
  params: Promise<{ id: string }>;
};

/** 构建时为 manifest 中每道题生成静态路径 */
export async function generateStaticParams() {
  return getAllProblems().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PracticeDetailPageProps) {
  const { id } = await params;
  const problem = getProblemById(id);
  if (!problem) return {};
  const group = getPracticeGroups().find((group) =>
    group.items.some((item) => item.id === problem.id)
  );
  return {
    title: problem.title,
    description: `${group?.title ?? problem.category} · ${DIFFICULTY_LABELS[problem.difficulty]} · 手写练习`,
  };
}

export default async function PracticeDetailPage({
  params,
}: PracticeDetailPageProps) {
  const { id } = await params;
  const problem = getProblemById(id);
  if (!problem) notFound();

  const { prev, next } = getAdjacentProblems(id);
  const group = getPracticeGroups().find((group) =>
    group.items.some((item) => item.id === problem.id)
  );
  const groupTitle = group?.title ?? problem.category;
  const NoteContent = problem.note ? await renderMDX(problem.note) : null;
  // 外链指向子模块仓库中 entry 对应文件
  const githubFileUrl = `${PRACTICE_REPO_URL}/blob/main/${problem.entry}`;

  return (
    <article>
      <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-2">
        手写练习 / {groupTitle} / {problem.id}
      </p>
      <h2 className="text-2xl font-bold text-black dark:text-white mb-3">
        {problem.title}
      </h2>
      <div className="flex justify-between mb-6">
        <div className="flex flex-wrap gap-2">
        <span className="text-xs font-mono font-bold border-[1.5px] border-current px-2 py-0.5 rounded-none">
          {groupTitle}
        </span>
        <span className="text-xs font-mono font-bold border-[1.5px] border-current px-2 py-0.5 rounded-none">
          {DIFFICULTY_LABELS[problem.difficulty]}
        </span>
        {problem.tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono border border-gray-400 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-none"
          >
            {tag}
          </span>
        ))}
        </div>
        <Link
          href={githubFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          在 GitHub 查看源码 →
        </Link>
      </div>

      <section className="space-y-3">
        <h3 className="text-lg font-bold text-black dark:text-white">
          源码练习
        </h3>
      <PracticeCodeBlock code={problem.code} lang={problem.lang} />
      <CodeCopyButton />
      </section>

      {NoteContent && (
        <section className="mt-8 pt-6 border-t border-dashed border-gray-300 dark:border-gray-600">
          <h3 className="text-lg font-bold text-black dark:text-white mb-3">
            笔记记录
          </h3>
          <article className="prose prose-sm dark:prose-invert max-w-none">
            <NoteContent components={mdxComponents} />
          </article>
        </section>
      )}

      <PracticeNav prev={prev} next={next} />
    </article>
  );
}
