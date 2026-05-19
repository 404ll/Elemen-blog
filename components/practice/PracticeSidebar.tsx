/**
 * 练习区侧栏：按 CATEGORY_ORDER 分组展示题目链接
 * 桌面端固定左侧栏；移动端抽屉 + 遮罩，选中项高亮并去掉标题前缀「手写 」
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
} from "@/lib/practice/categories";
import type { PracticeCategory, PracticeProblemMeta } from "@/lib/practice/types";

type PracticeSidebarProps = {
  problems: PracticeProblemMeta[];
};

/** 将扁平题目列表按分类分组，空分类不渲染 */
function groupByCategory(problems: PracticeProblemMeta[]) {
  const map = new Map<PracticeCategory, PracticeProblemMeta[]>();
  for (const cat of CATEGORY_ORDER) {
    map.set(cat, []);
  }
  for (const p of problems) {
    const list = map.get(p.category) ?? [];
    list.push(p);
    map.set(p.category, list);
  }
  return CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: map.get(cat) ?? [],
  })).filter((g) => g.items.length > 0);
}

export default function PracticeSidebar({ problems }: PracticeSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const groups = groupByCategory(problems);

  // 桌面侧栏与移动抽屉共用同一份目录 DOM
  const nav = (
    <nav className="space-y-4 mt-4" aria-label="练习题目目录">
      {groups.map((group) => (
        <div key={group.category}>
          <p className="text-[14px] font-bold tracking-widest uppercase text-black dark:text-white mb-1 px-2">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const href = `/practice/${item.id}`;
              const active = pathname === href;
              return (
                <li key={item.id}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`block text-sm px-2 py-1.5 rounded-sm transition-colors ${
                      active
                        ? "font-semibold bg-black/5 dark:bg-white/10 border-l-2 border-black dark:border-white pl-[calc(0.5rem-2px)] text-black dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {item.title.replace(/^手写\s*/, "")}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <div className="md:hidden flex items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm"
          aria-expanded={open}
          aria-controls="practice-sidebar-drawer"
        >
          <MenuIcon className="w-4 h-4" />
          题目目录
        </button>
      </div>

      <aside className="hidden md:block w-56 shrink-0 border-r border-gray-200/80 dark:border-gray-700/80 pr-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-mono">
          {problems.length} 道题
        </p>
        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="关闭目录"
            onClick={() => setOpen(false)}
          />
          <aside
            id="practice-sidebar-drawer"
            className="absolute left-0 top-0 bottom-0 w-[min(280px,85vw)] bg-[#fff4e6] dark:bg-[#1a0f00] p-4 pt-20 overflow-y-auto border-r border-orange-200/60 dark:border-orange-900/40 shadow-xl"
          >
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2"
                aria-label="关闭"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
