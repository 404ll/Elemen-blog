import { notFound } from "next/navigation";
import Link from "next/link";
import PracticeCodeBlock from "@/components/practice/PracticeCodeBlock";
import PracticeNav from "@/components/practice/PracticeNav";
import CodeCopyButton from "@/components/ui/CodeCopyButton";
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  PRACTICE_REPO_URL,
} from "@/lib/practice/categories";
import {
  getAdjacentProblems,
  getAllProblems,
  getProblemById,
} from "@/lib/practice/loader";

type PracticeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getAllProblems().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PracticeDetailPageProps) {
  const { id } = await params;
  const problem = getProblemById(id);
  if (!problem) return {};
  return {
    title: problem.title,
    description: `${CATEGORY_LABELS[problem.category]} · ${DIFFICULTY_LABELS[problem.difficulty]} · 手写练习`,
  };
}

export default async function PracticeDetailPage({
  params,
}: PracticeDetailPageProps) {
  const { id } = await params;
  const problem = getProblemById(id);
  if (!problem) notFound();

  const { prev, next } = getAdjacentProblems(id);
  const githubFileUrl = `${PRACTICE_REPO_URL}/blob/main/${problem.entry}`;

  return (
    <article>
      <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-2">
        手写练习 / {CATEGORY_LABELS[problem.category]} / {problem.id}
      </p>
      <h2 className="text-2xl font-bold text-black dark:text-white mb-3">
        {problem.title}
      </h2>
      <div className="flex justify-between mb-6">
        <div className="flex flex-wrap gap-2">
        <span className="text-xs font-mono font-bold border-[1.5px] border-current px-2 py-0.5 rounded-none">
          {CATEGORY_LABELS[problem.category]}
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

      {problem.prompt && (
        <div className="prose prose-sm dark:prose-invert max-w-none mb-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {problem.prompt}
        </div>
      )}

      <PracticeCodeBlock code={problem.code} lang={problem.lang} />
      <CodeCopyButton />

      <PracticeNav prev={prev} next={next} />
    </article>
  );
}
