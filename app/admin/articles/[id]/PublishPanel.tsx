"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Send, ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/constant";
type Previous = { revision: string; slug: string; category: string; excerpt: string; tags: string[]; syncedAt: string };
export default function PublishPanel({ id, sourceHash, previous, local }: { id: string; sourceHash: string; previous: Previous | null; local: boolean }) {
  const [slug, setSlug] = useState(previous?.slug.split("/")[1] ?? `youmind-${id.slice(0, 8)}-${id.slice(-8)}`);
  const [category, setCategory] = useState(previous?.category ?? "note");
  const [excerpt, setExcerpt] = useState(previous?.excerpt ?? "");
  const [tags, setTags] = useState(previous?.tags.join(", ") ?? "");
  const [revision, setRevision] = useState(previous?.revision ?? null);
  const [pending, setPending] = useState(false), [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; syncedAt: string } | null>(null);
  async function submit(event: FormEvent) {
    event.preventDefault(); if (pending) return;
    setPending(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/cms/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, sourceHash, expectedRevision: revision, slug, category, excerpt, tags: tags.split(/[,，]/).map(value => value.trim()).filter(Boolean) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "同步失败，请重试。");
      setRevision(data.revision); setResult(data);
    } catch (error) { setError(error instanceof Error ? error.message : "同步失败，请重试。"); }
    finally { setPending(false); }
  }
  return <aside className="cms-publish-panel"><form onSubmit={submit}><span className="cms-publish-icon"><Send size={18} aria-hidden="true" /></span><h2>{revision ? "更新文章" : "同步到博客"}</h2><p className="cms-muted">检查一下，一切就绪后即可同步。</p>
    {local && <p className="cms-notice">本地测试：只更新当前电脑上的博客。</p>}
    <label>分类<select value={category} disabled={!!revision || pending} onChange={e => setCategory(e.target.value)}>{Object.entries(CATEGORIES).map(([key, value]) => <option value={key} key={key}>{value.name}</option>)}</select></label>
    <details className="cms-settings"><summary>文章设置 <span className="cms-help">· 网址、摘要与标签</span></summary>
    <label>文章网址<input value={slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100} readOnly={!!revision} disabled={pending} onChange={e => setSlug(e.target.value)} /><span className="cms-help">/blog/{category}/{slug}</span></label>
    {revision && <p className="cms-help">保留首次发布的网址，避免旧链接失效。</p>}
    <label>摘要<textarea value={excerpt} maxLength={300} rows={3} disabled={pending} placeholder="用于博客列表，可留空" onChange={e => setExcerpt(e.target.value)} /></label>
    <label>标签<input value={tags} disabled={pending} placeholder="用逗号分隔，例如 AI, Agent" onChange={e => setTags(e.target.value)} /></label>
    </details>
    <button className="cms-primary" disabled={pending}>{pending ? "正在同步…" : revision ? "同步最新版本" : "同步到博客"}<ArrowUpRight size={15} aria-hidden="true" /></button>
    <div aria-live="polite">{error && <p role="alert" className="cms-error">{error}</p>}{result && <p className="cms-success">已同步到{local ? "本地" : ""}博客。<br /><Link href={result.url} target="_blank">查看文章 ↗</Link></p>}</div>
    {previous && !result && <p className="cms-help">上次同步：{new Date(previous.syncedAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</p>}
    <p className="cms-help cms-publish-footer">每次同步都保留固定网址。<br />在 YouMind 中修改后，回来更新即可。<br />图片由 YouMind CDN 提供。</p>
  </form></aside>;
}
