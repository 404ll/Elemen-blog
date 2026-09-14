/**
 * 详情页底部「上一题 / 下一题」导航
 * prev/next 顺序与 getAllProblems 排序一致（updatedAt → 标题）
 */
import Link from "next/link";
import { practiceProblemHref } from "@/lib/practice/categories";
import type { PracticeProblemMeta } from "@/lib/practice/types";

type PracticeNavProps = {
  prev: PracticeProblemMeta | null;
  next: PracticeProblemMeta | null;
};

export default function PracticeNav({ prev, next }: PracticeNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      className="practice-adjacent"
      aria-label="题目导航"
    >
      {prev ? (
        <Link
          href={practiceProblemHref(prev)}
          className="practice-adjacent-prev"
        >
          <span className="practice-adjacent-label">← 上一篇</span>
          <span className="practice-adjacent-title">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={practiceProblemHref(next)}
          className="practice-adjacent-next"
        >
          <span className="practice-adjacent-label">下一篇 →</span>
          <span className="practice-adjacent-title">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
