import Link from "next/link";
import { redirect } from "next/navigation";
import { currentAdmin } from "@/server/auth/admin";
import { configuredBoard } from "@/server/cms/source";
import SourceForm from "./SourceForm";
export default async function SourceSettings() {
  const admin = await currentAdmin(); if (!admin) redirect("/admin");
  let boardId = ""; try { boardId = await configuredBoard(); } catch { /* Allow first-time configuration. */ }
  return <main className="cms-source-settings"><Link className="cms-help" href="/admin">← 返回文章库</Link><p className="cms-eyebrow">CONTENT SOURCE</p><h1>内容来源</h1><p className="cms-muted">连接一个 YouMind Board，把文件夹和文章带到工作台。</p>{admin === "local-preview" && <p className="cms-notice">本地配置，仅影响当前电脑上的后台。</p>}<SourceForm boardId={boardId} /><div className="cms-settings-note"><h2>切换来源之后</h2><p>文章库展示新 Board 的内容，已发布的博客文章会保留。文件夹用于浏览和筛选，不会自动改变博客分类，也不会自动发布任何文章。</p></div></main>;
}
