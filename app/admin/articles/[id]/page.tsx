import Link from "next/link";
import { redirect } from "next/navigation";
import { currentAdmin } from "@/server/auth/admin";
import { getSourceDocument } from "@/server/cms/source";
import { CmsError, sourceHash } from "@/server/cms/model";
import { cmsStore } from "@/server/cms/database";
import { normalizeYouMindMarkdown } from "@/lib/markdown/youmind";
import YouMindContent from "@/components/cms/YouMindContent";
import CodeCopyButton from "@/components/ui/CodeCopyButton";
import PublishPanel from "./PublishPanel";
import "@/app/(site)/blog/[...slug]/reading.css";

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await currentAdmin(); if (!admin) redirect("/admin");
  const { id } = await params;
  try {
    const [document, articles] = await Promise.all([getSourceDocument(id), cmsStore()?.list() ?? []]);
    const previous = articles.find(article => article.sourceId === id);
    const warnings = normalizeYouMindMarkdown(document.content).warnings;
    return <main className="cms-preview"><div className="cms-preview-top"><Link href="/admin">← 文章同步</Link><a href={`https://youmind.com/boards/${document.boardId}?tab=file&file-id=${id}`} target="_blank" rel="noreferrer">在 YouMind 编辑 ↗</a></div>
      <div className="cms-preview-grid"><div><p className="cms-eyebrow">发布前预览</p><h1>{document.title}</h1>{warnings.map(warning => <p className="cms-notice" key={warning}>{warning}</p>)}<div className="reading-page cms-preview-reading"><div className="reading-body"><CodeCopyButton /><YouMindContent content={document.content} /></div></div></div>
        <PublishPanel id={id} sourceHash={sourceHash(document)} previous={previous ? { revision: previous.revision, slug: previous.slug, category: previous.category, excerpt: previous.excerpt, tags: previous.tags, syncedAt: previous.syncedAt } : null} local={admin === "local-preview"} />
      </div></main>;
  } catch (error) {
    return <main className="cms-dashboard"><Link href="/admin">← 返回文章列表</Link><h1>暂时无法预览</h1><p role="alert">{error instanceof CmsError ? error.message : "文档格式暂时无法渲染，请检查原文后重试。"}</p></main>;
  }
}
