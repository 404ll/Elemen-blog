"use client";

import { useEffect } from "react";

/**
 * 挂载后扫描页面所有代码块，动态注入复制按钮。
 * 纯 DOM 操作，不影响 SSR 输出。
 */
export default function CodeCopyButton() {
  useEffect(() => {
    const fragments = document.querySelectorAll<HTMLElement>(
      "figure[data-rehype-pretty-code-figure]"
    );

    const cleanups: (() => void)[] = [];

    fragments.forEach((fragment) => {
      // 避免重复注入
      if (fragment.querySelector(".code-copy-btn")) return;

      const btn = document.createElement("button");
      btn.className = "code-copy-btn";
      btn.setAttribute("aria-label", "复制代码");
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

      const handleClick = async () => {
        const pre = fragment.querySelector("pre");
        const text = pre?.textContent ?? "";
        try {
          await navigator.clipboard.writeText(text);
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
          btn.classList.add("copied");
          setTimeout(() => {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
            btn.classList.remove("copied");
          }, 2000);
        } catch {
          // clipboard 不可用时静默失败
        }
      };

      btn.addEventListener("click", handleClick);
      fragment.appendChild(btn);
      cleanups.push(() => btn.removeEventListener("click", handleClick));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
