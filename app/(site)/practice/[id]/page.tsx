/**
 * /practice/[id] 题目详情页（SSG）
 * generateStaticParams 预渲染全部题目；展示题面、Shiki 高亮源码、复制与上下题导航
 */
import { notFound } from "next/navigation";
import PracticeHeader from "@/components/practice/PracticeHeader";
import PracticeCodeBlock from "@/components/practice/PracticeCodeBlock";
import PracticeHtmlPreview from "@/components/practice/PracticeHtmlPreview";
import PracticeNav from "@/components/practice/PracticeNav";
import CodeCopyButton from "@/components/ui/CodeCopyButton";
import { mdxComponents } from "@/components/ui/MdxContent";
import {
  DIFFICULTY_LABELS,
  PRACTICE_REPO_URL,
} from "@/lib/practice/categories";
import { renderMDX } from "@/lib/mdx";
import {
  getAdjacentProblems,
  getAllProblems,
  getPracticeGroups,
  getProblemById,
} from "@/lib/practice/loader";

type PracticeDetailPageProps = {
  params: Promise<{ id: string }>;
};

/** 构建时为 manifest 中每道题生成静态路径 */
export async function generateStaticParams() {
  return getAllProblems({ collection: "handwriting" }).map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }: PracticeDetailPageProps) {
  const { id } = await params;
  const problem = getProblemById(id, { collection: "handwriting" });
  if (!problem) return {};
  const group = getPracticeGroups({ collection: "handwriting" }).find((group) =>
    group.items.some((item) => item.id === problem.id)
  );
  return {
    title: problem.title,
    description: `${group?.title ?? problem.category} · ${DIFFICULTY_LABELS[problem.difficulty]} · 手写练习`,
  };
}

export default async function PracticeDetailPage({
  params,
}: PracticeDetailPageProps) {
  const { id } = await params;
  const problem = getProblemById(id, { collection: "handwriting" });
  if (!problem) notFound();

  const { prev, next } = getAdjacentProblems(id, {
    collection: "handwriting",
  });
  const group = getPracticeGroups({ collection: "handwriting" }).find((group) =>
    group.items.some((item) => item.id === problem.id)
  );
  const groupTitle = group?.title ?? problem.category;
  const NoteContent = problem.note ? await renderMDX(problem.note, { theme: { light: "github-light", dark: "github-dark" } }) : null;
  // code.html 是独立可执行文档；index.html 可能依赖同目录资源。
  const canPreviewHtml = problem.lang === "html" && problem.entry.endsWith("/code.html");
  // 外链指向子模块仓库中 entry 对应文件
  const githubFileUrl = `${PRACTICE_REPO_URL}/blob/main/${problem.entry}`;

  return (
    <article className="practice-entry">
      <PracticeHeader problem={problem} collection="handwriting" groupTitle={groupTitle} sourceUrl={githubFileUrl} />
      {canPreviewHtml && (
        <section className="practice-section mb-8">
          <h3 className="practice-section-title">运行预览</h3>
          <PracticeHtmlPreview html={problem.code} title={problem.title} />
        </section>
      )}
      <section className="practice-section">
        <h3 className="practice-section-title">代码实现</h3>
        <PracticeCodeBlock code={problem.code} lang={problem.lang} />
      </section>
      <CodeCopyButton />

      {NoteContent && (
        <section className="practice-section practice-note">
          <h3 className="practice-section-title">
            笔记记录
          </h3>
          <article className="prose prose-sm dark:prose-invert max-w-none">
            <NoteContent components={mdxComponents} />
          </article>
        </section>
      )}

      <PracticeNav prev={prev} next={next} />
    </article>
  );
}
