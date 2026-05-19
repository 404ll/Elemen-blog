/**
 * 详情页底部「上一题 / 下一题」导航
 * prev/next 顺序与 getAllProblems 排序一致（updatedAt → 标题）
 */
import Link from "next/link";
import type { PracticeProblemMeta } from "@/lib/practice/types";

type PracticeNavProps = {
  prev: PracticeProblemMeta | null;
  next: PracticeProblemMeta | null;
};

export default function PracticeNav({ prev, next }: PracticeNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      className="flex justify-between gap-4 pt-6 mt-8 border-t border-dashed border-gray-300 dark:border-gray-600 text-sm"
      aria-label="题目导航"
    >
      {prev ? (
        <Link
          href={`/practice/${prev.id}`}
          className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors max-w-[45%]"
        >
          <span className="font-mono text-xs block mb-0.5">上一题</span>
          <span className="font-semibold truncate block">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/practice/${next.id}`}
          className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-right max-w-[45%] ml-auto"
        >
          <span className="font-mono text-xs block mb-0.5">下一题</span>
          <span className="font-semibold truncate block">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
