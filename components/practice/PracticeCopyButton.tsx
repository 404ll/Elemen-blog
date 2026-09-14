"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export default function PracticeCopyButton({ code }: { code: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  }
  return <button type="button" className="code-copy-btn practice-copy-button" onClick={copy} aria-label="复制代码"><span aria-hidden="true">{status === "copied" ? <Check size={14} /> : <Copy size={14} />}</span><span aria-live="polite">{status === "copied" ? "已复制" : status === "error" ? "复制失败，请手动选择" : "复制代码"}</span></button>;
}
