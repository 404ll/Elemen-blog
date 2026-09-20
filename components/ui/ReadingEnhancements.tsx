"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronUp, List } from "lucide-react";
import type { HeadingItem } from "@/lib/headings";

export default function ReadingEnhancements({ headings }: { headings: HeadingItem[] }) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState("");
  const [showTop, setShowTop] = useState(false);
  const mobileMenu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const elements = headings.map(({ id }) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
    let frame = 0;
    const update = () => {
      frame = 0;
      const article = document.querySelector(".reading-body");
      const rect = article?.getBoundingClientRect();
      if (rect) setProgress(Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height)));
      setShowTop(window.scrollY > 480);
      let current = elements[0]?.id ?? "";
      for (const element of elements) {
        if (element.getBoundingClientRect().top > 140) break;
        current = element.id;
      }
      setActiveId(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  const links = (mobile = false) => (
    <nav aria-label={mobile ? "移动端文章目录" : "文章目录"}>
      <ol>
        {headings.map((heading) => (
          <li key={heading.id} data-level={heading.level}>
            <a href={`#${heading.id}`} aria-current={activeId === heading.id ? "location" : undefined}
              onClick={() => {
                if (mobile && mobileMenu.current) {
                  mobileMenu.current.open = false;
                  const target = document.getElementById(heading.id);
                  target?.setAttribute("tabindex", "-1");
                  target?.focus({ preventScroll: true });
                }
              }}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );

  return (
    <>
      <div className="reading-progress" aria-hidden="true"><div style={{ transform: `scaleX(${progress})` }} /></div>
      {headings.length > 0 && (
        <>
          <aside className="reading-toc"><p>本篇目录</p>{links()}</aside>
          <details ref={mobileMenu} className="reading-mobile-toc" onKeyDown={(event) => {
            if (event.key === "Escape" && mobileMenu.current) {
              mobileMenu.current.open = false;
              mobileMenu.current.querySelector("summary")?.focus();
            }
          }}>
            <summary><List size={16} aria-hidden="true" />目录<span className="reading-close-label"> · 收起</span></summary>
            {links(true)}
          </details>
        </>
      )}
      {showTop && <button type="button" aria-label="返回顶部" className="reading-top" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}><ChevronUp size={18} aria-hidden="true" /></button>}
    </>
  );
}
