import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText, LogOut, Plug, Monitor } from "lucide-react";
import { currentAdmin, localPreviewEnabled } from "@/server/auth/admin";
import { configuredBoard } from "@/server/cms/source";
import { listSourceBoard } from "@/server/youmind/client";
import { cmsStore } from "@/server/cms/database";
import { CmsError, sourceHash } from "@/server/cms/model";
import ArticleBrowser from "./ArticleBrowser";
import FolderNavigation from "./FolderNavigation";
import { folderPath, inFolder } from "@/server/youmind/folders";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string; folder?: string }> }) {
  const admin = await currentAdmin();
  if (!admin) {
    const { error } = await searchParams;
    const githubReady = !!(process.env.CMS_GITHUB_CLIENT_ID && process.env.CMS_GITHUB_CLIENT_SECRET && process.env.CMS_GITHUB_USER && process.env.CMS_SESSION_SECRET && process.env.CMS_ORIGIN);
    return <main className="cms-login"><p className="cms-eyebrow">ELEMEN / PUBLISHING</p><h1>把创作带到博客。</h1><p>在 YouMind 写作和配图，在这里预览、同步。</p>
      {error && <p role="alert" className="cms-error">登录未成功。请使用已配置的博客管理员账号，并检查 GitHub 登录设置。</p>}
      {/* OAuth must use a full navigation rather than an RSC request. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      {githubReady ? <a className="cms-primary" href="/api/cms/auth/github">使用 GitHub 登录</a> : <p className="cms-muted">线上 GitHub 登录尚未配置。</p>}
      {localPreviewEnabled() && <form action="/api/cms/auth/local" method="post"><button className="cms-primary">进入本地测试后台</button><p className="cms-help">仅开发环境可用。同步内容只保存在这台电脑。</p></form>}
    </main>;
  }
  try {
    const boardId = await configuredBoard();
    const [{ documents, folders }, published, params] = await Promise.all([listSourceBoard(boardId), cmsStore()?.list() ?? [], searchParams]);
    const selected = params.folder === "root" || folders.some(folder => folder.id === params.folder) ? params.folder! : "all";
    const folderTitle = selected === "all" ? "文章库" : selected === "root" ? "未分组" : folderPath(selected, folders).map(folder => folder.title).join(" / ");
    const selectedDocuments = documents.filter(document => inFolder(document.parentGroupId, selected, folders));
    const index = new Map(published.map(article => [article.sourceId, article]));
    const rows = selectedDocuments.map(document => {
      const article = index.get(document.id);
      return { folder: folderPath(document.parentGroupId, folders).map(folder => folder.title).join(" / ") || "未分组", id: document.id, title: document.title, updatedAt: document.updatedAt,
        status: !article ? "new" as const : article.sourceHash === sourceHash(document) ? "synced" as const : "changed" as const,
        url: article ? `/blog/${article.slug}` : null };
    }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const missing = published.filter(article => article.boardId === boardId && !documents.some(document => document.id === article.sourceId));
    return <main className="cms-workspace">
      <aside className="cms-sidebar">
        <p className="cms-eyebrow">WORKSPACE</p>
        <Link href="/admin" className="cms-sidebar-current"><FileText size={17} aria-hidden="true" />文章库 <span>{documents.length}</span></Link>
        <div className="cms-source-card"><span className="cms-source-icon"><BookOpen size={22} aria-hidden="true" /></span><h2>YouMind Board</h2><p>你的创作，从这里出发。</p><a href={`https://youmind.com/boards/${boardId}`} target="_blank" rel="noreferrer">打开 Board <ArrowUpRight size={14} aria-hidden="true" /></a><div className="cms-connection"><span className="cms-dot" /> 已连接 · {documents.length} 篇文章</div><Link className="cms-config-link" href="/admin/settings">配置内容来源 →</Link></div>
        <FolderNavigation folders={folders} documents={documents} selected={selected} />
        <div className="cms-sidebar-note"><Plug size={16} aria-hidden="true" /><p>在 YouMind 写作和配图，<br />在这里发布完成的作品。</p></div>
        <div className="cms-sidebar-bottom">{admin === "local-preview" && <div className="cms-local"><Monitor size={15} aria-hidden="true" /><span>本地预览环境<small>同步仅在这台电脑生效</small></span></div>}<form action="/api/cms/auth/logout" method="post"><button className="cms-logout"><LogOut size={15} aria-hidden="true" />退出登录</button></form></div>
      </aside>
      <section className="cms-dashboard"><header className="cms-dashboard-header"><div><p className="cms-eyebrow">YOUR WORDS, YOUR SPACE</p><h1>{folderTitle}<span className="cms-total">{rows.length}</span></h1><p className="cms-muted">从灵感到发布，让每一篇好内容被看见。</p></div><a className="cms-secondary" href={`https://youmind.com/boards/${boardId}`} target="_blank" rel="noreferrer">去 YouMind 写作 <ArrowUpRight size={15} aria-hidden="true" /></a></header>
        <div className="cms-mobile-session">{admin === "local-preview" && <span><span className="cms-dot" /> 本地预览 · 同步仅在这台电脑生效</span>}<form action="/api/cms/auth/logout" method="post"><button>退出登录</button></form></div>
        <div className="cms-mobile-folders"><details><summary>文件夹 · {selected === "all" ? "全部文章" : folderTitle}</summary><FolderNavigation folders={folders} documents={documents} selected={selected} /></details></div>
        <div className="cms-source-toolbar"><span>当前来源 · YouMind Board</span><Link href="/admin/settings">配置内容来源 →</Link></div>
        <ArticleBrowser key={`${boardId}/${selected}`} rows={rows} />
        {published.some(article => article.boardId !== boardId) && <p className="cms-help">其他 Board 已同步的 {published.filter(article => article.boardId !== boardId).length} 篇文章仍保留在博客中。</p>}
        {missing.length > 0 && <section className="cms-notice"><h2>来源发生变化</h2><p>以下文章已不在当前 Board 列表中，博客仍保留上次发布版本：</p>{missing.map(article => <p key={article.sourceId}><Link href={`/blog/${article.slug}`}>{article.title}</Link></p>)}</section>}
      </section>
    </main>;

  } catch (error) {
    return <main className="cms-dashboard"><h1>暂时无法读取文章</h1><p role="alert">{error instanceof CmsError ? error.message : "读取失败，请检查内容存储配置后重试。"}</p><Link href="/admin" className="cms-secondary">重新读取</Link> <Link href="/admin/settings" className="cms-secondary">配置内容来源</Link></main>;
  }
}
