"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function SourceForm({ boardId }: { boardId: string }) {
  const [link, setLink] = useState(boardId ? `https://youmind.com/boards/${boardId}` : "");
  const [pending, setPending] = useState(false), [error, setError] = useState("");
  const [result, setResult] = useState<{ documents: number; folders: number } | null>(null);
  const router = useRouter();
  async function submit(event: FormEvent) {
    event.preventDefault(); setPending(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/cms/source", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ link }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setResult(data); router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : "连接失败，请重试。"); }
    finally { setPending(false); }
  }
  return <form onSubmit={submit} className="cms-source-form"><label htmlFor="board-link">YouMind Board 链接</label><input id="board-link" required maxLength={1500} value={link} disabled={pending} onChange={event => { setLink(event.target.value); setResult(null); }} placeholder="https://youmind.com/boards/…" /><p className="cms-help">复制浏览器中的 Board 地址即可，链接带有文件或标签参数也可以。</p><button className="cms-primary" disabled={pending}>{pending ? "正在验证连接…" : "连接并保存"}</button><div aria-live="polite">{error && <p className="cms-error" role="alert">{error}</p>}{result && <p className="cms-success">连接成功：{result.documents} 篇文章，{result.folders} 个文件夹。<br /><Link href="/admin">前往文章库 →</Link></p>}</div></form>;
}
