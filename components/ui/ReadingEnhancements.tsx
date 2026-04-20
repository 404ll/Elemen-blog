"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronUp } from "lucide-react";
import type { HeadingItem } from "@/lib/headings";

type ReadingEnhancementsProps = {
  headings: HeadingItem[];
};

export default function ReadingEnhancements({ headings }: ReadingEnhancementsProps) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>("");
  const [showTopButton, setShowTopButton] = useState(false);
  const headingIds = useMemo(() => headings.map((item) => item.id), [headings]);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      const nextProgress = total > 0 ? (scrollTop / total) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, nextProgress)));
      setShowTopButton(scrollTop > 480);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!headingIds.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.5, 1],
      }
    );

    headingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headingIds]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
        <div
          className="h-full bg-blue-500/80 dark:bg-blue-400/80 transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {headings.length > 0 && (
        <div className="xl:hidden max-w-[72ch] mx-auto px-6 pt-2">
          <details className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/85 dark:bg-gray-900/80 backdrop-blur px-4 py-3">
            <summary className="cursor-pointer text-sm font-semibold text-gray-800 dark:text-gray-200">
              文章目录
            </summary>
            <nav aria-label="文章目录" className="mt-3">
              <ul className="space-y-1.5">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className={`block rounded-md px-2 py-1.5 text-sm transition ${
                        activeId === heading.id
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                      } ${heading.level === 3 ? "ml-3 text-[13px]" : ""}`}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      )}

      {headings.length > 0 && (
        <aside className="hidden xl:block fixed right-6 top-28 z-40 w-64 rounded-xl border border-gray-200/80 bg-white/90 p-4 shadow-lg backdrop-blur dark:border-gray-700/80 dark:bg-gray-900/85">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            On this page
          </p>
          <nav aria-label="文章目录" className="max-h-[60vh] overflow-y-auto pr-1">
            <ul className="space-y-1.5">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className={`block rounded-md px-2 py-1.5 text-sm transition ${
                      activeId === heading.id
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    } ${heading.level === 3 ? "ml-3 text-[13px]" : ""}`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      {showTopButton && (
        <button
          type="button"
          aria-label="返回顶部"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-5 bottom-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-gray-900/90 text-white shadow-lg transition hover:bg-gray-900 dark:bg-gray-100 dark:text-gray-900"
        >
          <ChevronUp size={18} />
        </button>
      )}
    </>
  );
}
