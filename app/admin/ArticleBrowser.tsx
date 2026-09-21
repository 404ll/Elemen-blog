"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, Search, SearchX } from "lucide-react";
type Row = { folder: string; id: string; title: string; updatedAt: string; status: "new" | "changed" | "synced"; url: string | null };
const labels = { new: "未同步", changed: "有更新", synced: "已同步" };
const filters = [{ value: "all", label: "全部文章" }, { value: "new", label: "未同步" }, { value: "changed", label: "有更新" }, { value: "synced", label: "已同步" }];
export default function ArticleBrowser({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const visible = rows.filter(row => row.title.toLowerCase().includes(query.trim().toLowerCase()) && (filter === "all" || row.status === filter));
  return <section className="cms-library" aria-label="文章列表">
    <div className="cms-tools"><div className="cms-filters" aria-label="同步状态">{filters.map(item => <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label}<span>{item.value === "all" ? rows.length : rows.filter(row => row.status === item.value).length}</span></button>)}</div><label className="cms-search"><Search size={16} aria-hidden="true" /><span className="sr-only">搜索文章</span><input type="search" placeholder="搜索文章…" value={query} onChange={e => setQuery(e.target.value)} /></label></div>
    <div className="cms-list-heading" aria-hidden="true"><span>文章</span><span>同步状态</span><span>操作</span></div>
    <ul className="cms-articles">{visible.map(row => <li key={row.id}>
      <div className="cms-article-main"><span className={`cms-document-icon cms-icon-${row.status}`}><FileText size={21} strokeWidth={1.5} aria-hidden="true" /></span><div className="cms-article-text"><h2><Link href={`/admin/articles/${row.id}`} prefetch={false}>{row.title}</Link></h2><p>{row.folder} <span>·</span> {new Date(row.updatedAt).toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai", month: "long", day: "numeric" })} 更新{row.url && <Link className="cms-public-link" href={row.url} target="_blank">查看博客 <ArrowUpRight size={12} aria-hidden="true" /></Link>}</p></div></div>
      <span className={`cms-badge cms-${row.status}`}><span />{labels[row.status]}</span>
      <Link className="cms-row-open" href={`/admin/articles/${row.id}`} prefetch={false} aria-label={`预览${row.title}`}>预览 <ArrowRight size={16} aria-hidden="true" /></Link>
    </li>)}</ul>
    {visible.length === 0 && <div className="cms-empty"><SearchX size={28} aria-hidden="true" /><h2>{rows.length ? "没有找到匹配的文章" : "这里，等待你的第一篇文章"}</h2><p>{rows.length ? "换个关键词，或试试其他同步状态。" : "在连接的 YouMind Board 中开始写作，文章会出现在这里。"}</p></div>}
    <footer className="cms-list-footer"><span aria-live="polite">共 {visible.length} 篇文章</span><span>只有点击同步，文章才会出现在博客</span></footer>
  </section>;
}
