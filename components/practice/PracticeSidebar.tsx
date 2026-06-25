/**
 * 练习区侧栏：按 manifest groups 分组展示题目链接
 * 桌面端固定左侧栏；移动端抽屉 + 遮罩，选中项高亮并去掉标题前缀「手写 」
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import type { PracticeGroupWithProblems } from "@/lib/practice/types";

type PracticeSidebarProps = {
  groups: PracticeGroupWithProblems[];
  problemCount: number;
};

export default function PracticeSidebar({
  groups,
  problemCount,
}: PracticeSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // 桌面侧栏与移动抽屉共用同一份目录 DOM
  const nav = (
    <nav className="mt-4 space-y-5" aria-label="练习题目目录">
      {groups.map((group) => {
        const activeInGroup = group.items.some(
          (item) => pathname === `/practice/${item.id}`
        );

        return (
          <section
            key={group.id}
            className={`border-l pl-3 ${
              activeInGroup
                ? "border-black dark:border-white"
                : "border-gray-300/80 dark:border-gray-700"
            }`}
          >
            <div className="mb-2">
              <div className="flex items-baseline justify-between gap-3">
                <h2
                  className={`text-[13px] font-bold tracking-[0.18em] uppercase ${
                    activeInGroup
                      ? "text-black dark:text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {group.title}
                </h2>
                <span className="shrink-0 text-[11px] font-mono text-gray-500 dark:text-gray-500">
                  {group.items.length}
                </span>
              </div>
              {group.description && (
                <p className="mt-1 text-[12px] leading-relaxed text-gray-500 dark:text-gray-500">
                  {group.description}
                </p>
              )}
            </div>

            <ol className="space-y-1">
              {group.items.map((item, index) => {
                const href = `/practice/${item.id}`;
                const active = pathname === href;
                return (
                  <li key={item.id}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-start gap-2 rounded-sm px-2.5 py-2 text-sm leading-snug transition-colors ${
                        active
                          ? "bg-white/70 font-semibold text-black shadow-[inset_0_0_0_1px_rgb(0_0_0_/_0.08)] dark:bg-white/10 dark:text-white dark:shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.12)]"
                          : "text-gray-600 hover:bg-white/45 hover:text-black dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                      }`}
                    >
                      <span
                        className={`mt-0.5 w-5 shrink-0 text-[11px] font-mono tabular-nums ${
                          active
                            ? "text-black dark:text-white"
                            : "text-gray-400 dark:text-gray-600"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1 break-words">
                        {item.title.replace(/^手写\s*/, "")}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
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

      <aside className="hidden md:block w-64 shrink-0 border-r border-gray-200/80 pr-5 dark:border-gray-700/80">
        <div className="border-b border-gray-200/80 pb-3 dark:border-gray-700/80">
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-gray-500 dark:text-gray-500">
            Practice Index
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
            {problemCount} 道题 · {groups.length} 个章节
          </p>
        </div>
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
