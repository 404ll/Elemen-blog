"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpen, ChevronDown, Search, X } from "lucide-react";
import { PRACTICE_COLLECTIONS, practiceProblemHref } from "@/lib/practice/categories";
import type { PracticeCollection, PracticeGroupWithProblems } from "@/lib/practice/types";

type PracticeSidebarProps = {
  groupsByCollection: Record<PracticeCollection, PracticeGroupWithProblems[]>;
  problemCountByCollection: Record<PracticeCollection, number>;
};

export default function PracticeSidebar({ groupsByCollection, problemCountByCollection }: PracticeSidebarProps) {
  const pathname = usePathname();
  const collection: PracticeCollection = pathname.startsWith("/practice/work") ? "work" : "handwriting";
  // A collection switch starts a fresh search and mobile directory.
  return <PracticeDirectory key={collection} collection={collection} pathname={pathname} groups={groupsByCollection[collection]} count={problemCountByCollection[collection]} />;
}

function PracticeDirectory({ collection, pathname, groups, count }: {
  collection: PracticeCollection;
  pathname: string;
  groups: PracticeGroupWithProblems[];
  count: number;
}) {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const search = query.trim().toLocaleLowerCase();
  const filteredGroups = groups.map(group => ({
    ...group,
    items: group.items.filter(item => `${item.title} ${item.id} ${item.tags?.join(" ") ?? ""} ${group.title}`.toLocaleLowerCase().includes(search)),
  })).filter(group => group.items.length > 0);
  const resultCount = filteredGroups.reduce((total, group) => total + group.items.length, 0);

  return (
    <aside className="practice-sidebar">
      <div className="practice-sidebar-heading">
        <div className="practice-identity"><BookOpen size={19} aria-hidden="true" /><h1>代码练习</h1></div>
        <p>日常总结与面试准备</p>
      </div>
      <nav className="practice-collections" aria-label="练习集合">
        {Object.values(PRACTICE_COLLECTIONS).map(item => (
          <Link key={item.id} href={item.href} aria-current={item.id === collection ? "page" : undefined}>{item.title}</Link>
        ))}
      </nav>
      <button type="button" className="practice-directory-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="practice-directory">
        <span>浏览目录 <span className="practice-count">{count}</span></span><ChevronDown size={16} aria-hidden="true" />
      </button>
      <div id="practice-directory" className={`practice-directory ${mobileOpen ? "is-open" : ""}`}>
        <div className="practice-search">
          <Search size={15} aria-hidden="true" />
          <input type="search" aria-label="搜索当前集合的标题、标签或章节" placeholder="搜索标题、标签…" value={query} onChange={event => setQuery(event.target.value)} autoComplete="off" spellCheck={false} />
          {query && <button type="button" aria-label="清空搜索" onClick={() => setQuery("")}><X size={14} aria-hidden="true" /></button>}
        </div>
        <p className="practice-directory-label" aria-live="polite"><span>{search ? "搜索结果" : "全部章节"}</span><span>{search ? resultCount : count} 篇</span></p>
        <nav className="practice-groups" aria-label="练习题目目录">
          {filteredGroups.map(group => {
            const active = group.items.some(item => pathname === practiceProblemHref(item));
            return (
              <details key={`${group.id}-${Boolean(search)}-${active}`} open={active || Boolean(search)} className="practice-group">
                <summary><ChevronDown size={14} aria-hidden="true" /><span>{group.title}</span><span className="practice-count">{group.items.length}</span></summary>
                <ul>{group.items.map(item => (
                  <li key={item.id}><Link href={practiceProblemHref(item)} aria-current={pathname === practiceProblemHref(item) ? "page" : undefined} onClick={() => setMobileOpen(false)}><span className="practice-item-dot" aria-hidden="true" /><span>{item.title.replace(/^手写\s*/, "")}</span></Link></li>
                ))}</ul>
              </details>
            );
          })}
        </nav>
        {resultCount === 0 && <p className="practice-empty">没有匹配的记录，试试其他关键词。</p>}
      </div>
    </aside>
  );
}
