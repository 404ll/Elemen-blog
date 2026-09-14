import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DIFFICULTY_LABELS, PRACTICE_COLLECTIONS } from "@/lib/practice/categories";
import type { PracticeProblemMeta, PracticeCollection } from "@/lib/practice/types";

export default function PracticeHeader({ problem, collection, groupTitle, sourceUrl }: {
  problem: PracticeProblemMeta;
  collection: PracticeCollection;
  groupTitle: string;
  sourceUrl: string;
}) {
  return (
    <header className="practice-entry-header">
      <div className="practice-entry-topline">
        <p className="practice-breadcrumb">{PRACTICE_COLLECTIONS[collection].title}<span>/</span>{groupTitle}</p>
        <Link href={sourceUrl} target="_blank" rel="noopener noreferrer" className="practice-source-link" aria-label="在 GitHub 查看源码（新窗口）">GitHub <ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>
      <h2>{problem.title}</h2>
      <div className="practice-meta">
        {collection === "handwriting" && <span className="practice-difficulty">{DIFFICULTY_LABELS[problem.difficulty]}</span>}
        {problem.tags?.filter(tag => tag !== "手写").map(tag => <span key={tag}>{tag}</span>)}
        {problem.updatedAt && <time dateTime={problem.updatedAt}>更新于 {problem.updatedAt.replaceAll("-", ".")}</time>}
      </div>
    </header>
  );
}
