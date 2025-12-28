"use client";

import React, { useState, useRef } from "react";
import { Copy, Check } from "lucide-react";

interface MacCodeBlockProps {
  children: React.ReactNode;
  hasLanguage?: boolean;
}

export const MacCodeBlock = ({ children, hasLanguage = false }: MacCodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  // 提取语言
  const getLanguage = () => {
    if (!hasLanguage) return null;
    
    const child = React.Children.toArray(children)[0] as any;
    const className = child?.props?.className || "";
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : null;
  };

  // 提取代码文本
  const getCodeText = (): string => {
    if (codeRef.current) {
      const codeElement = codeRef.current.querySelector("code");
      return codeElement?.textContent || "";
    }
    return "";
  };

  const handleCopy = async () => {
    try {
      const code = getCodeText();
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const language = getLanguage();

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-[#0d1117] shadow-lg group">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gray-800">
        <div className="flex items-center gap-3">
          {/* Mac 风格按钮 */}
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff6b62] transition-colors" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffc83a] transition-colors" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#33d34b] transition-colors" />
          </div>

          {/* 语言标签 */}
          {language && (
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide ml-2">
              {language}
            </span>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          aria-label="复制代码"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>已复制</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>复制</span>
            </>
          )}
        </button>
      </div>

      {/* 代码内容 */}
      <div
        ref={codeRef}
        className="overflow-x-auto p-4 text-sm leading-relaxed font-mono [&_code]:block [&_code]:min-w-full [&_code]:whitespace-pre [&_code]:break-words [&_code]:leading-relaxed"
        style={{
          fontFamily: "var(--font-mono), 'JetBrains Mono','Fira Code','SF Mono','Cascadia Code','Menlo','Consolas','Liberation Mono','monospace'",
        }}
      >
        {children}
      </div>
    </div>
  );
};
