import { renderMDX } from "@/lib/mdx";
import { getAllPosts, getPostBySlug, normalizeTags } from "@/lib/post";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { mdxComponents } from "@/components/ui/MdxContent";
import ReadingEnhancements from "@/components/ui/ReadingEnhancements";
import CodeCopyButton from "@/components/ui/CodeCopyButton";
import { extractHeadingsFromMdx } from "@/lib/headings";
import ArticleList from "@/components/card/ArticleList";
import { CATEGORIES } from "@/constant";
import "./reading.css";

export const revalidate = 3600;

type BlogPageProps = {
  params: Promise<{ slug: string[] }>;
};

async function resolveSlug(paramsPromise: BlogPageProps["params"]) {
  const params = await paramsPromise;
  if (!params?.slug) return null;
  return Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
}

function getCategoryMeta(slug: string | null) {
  if (!slug || slug.includes("/")) return null;
  return CATEGORIES[slug as keyof typeof CATEGORIES] ?? null;
}

function getPostsByCategory(category: string) {
  return getAllPosts().filter((post) => post.category === category);
}

function formatDate(dateString?: string) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  const postParams = posts.map((post) => ({
    slug: post.slug.split("/"),
  }));
  const categoryParams = Object.keys(CATEGORIES).map((category) => ({
    slug: [category],
  }));

  return [...postParams, ...categoryParams];
}

export async function generateMetadata({ params }: BlogPageProps) {
  const slug = await resolveSlug(params);
  if (!slug) return {};

  const categoryMeta = getCategoryMeta(slug);
  if (categoryMeta) {
    return {
      title: `${categoryMeta.name} Articles`,
      description: `${categoryMeta.name} 分类下的文章列表`,
    };
  }

  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt || post.frontmatter.subtitle,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: "article",
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const slug = await resolveSlug(params);
  if (!slug) return notFound();

  const categoryMeta = getCategoryMeta(slug);
  if (categoryMeta) {
    const posts = getPostsByCategory(slug);

    return (
      <div className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          <header className="space-y-3">
            <p className="text-3xl font-bitcount tracking-[0.2em] text-gray-800 dark:text-gray-400 font-semibold transition-colors">
              Category
            </p>
            <h1 className="text-xl font-bold text-black dark:text-white transition-colors">
              {categoryMeta.name}
            </h1>

            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 transition-colors">
              <span className="text-gray-500 dark:text-gray-400">
                {posts.length > 0 ? `${posts.length} 篇文章` : "暂无文章"}
              </span>
            </div>
          </header>

          {posts.length > 0 ? (
            <ArticleList posts={posts} />
          ) : (
            <div className="bg-white/85 dark:bg-gray-900/85 p-10 text-center border border-black dark:border-white transition-colors">
              <p className="text-gray-600 dark:text-gray-400 transition-colors">
                这个分类还没有文章，敬请期待。
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const post = getPostBySlug(slug);
  if (!post) return notFound();

  const { frontmatter, content } = post;
  const MDXContent = await renderMDX(content, { theme: { light: "github-light", dark: "github-dark" } });

  const readingMinutes = Math.max(
    1,
    Math.ceil((content.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu)?.length ?? 0) / 350 + (content.match(/[a-zA-Z0-9]+/g)?.length ?? 0) / 200)
  );

  const displayDate = formatDate(frontmatter.date);
  const tags = normalizeTags(frontmatter.tags);
  const headings = extractHeadingsFromMdx(content);

  return (
    <div className="reading-page">
      <CodeCopyButton />

      <div className="reading-column">
        {/* Header */}
        <div className="reading-header">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group mb-5"
          >
            <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/30 transition-colors">
              <ArrowLeft size={14} />
            </div>
            <span className="text-sm">返回文章列表</span>
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-3 font-mono">
            {frontmatter.category && (
              <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs font-semibold">
                {frontmatter.category}
              </span>
            )}
            {displayDate && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                <Calendar size={12} />
                {displayDate}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <Clock size={12} />
              约 {readingMinutes} 分钟阅读
            </span>
          </div>

          {frontmatter.title && (
            <h1 className="mb-3 max-w-[26ch] text-balance text-[2rem] font-semibold leading-[1.18] tracking-[-0.035em] text-[#191916] dark:text-stone-100 md:text-[2.5rem]">
              {frontmatter.title}
            </h1>
          )}

          {(frontmatter.subtitle || frontmatter.excerpt) && (
            <p className="reading-deck">{frontmatter.subtitle || frontmatter.excerpt}</p>
          )}
        </div>

        {/* Body */}
        <main id="main-content" className="reading-body">
          <article className="article-copy mx-auto min-w-0">
            <MDXContent components={mdxComponents} />
          </article>
        </main>

        <div className="reading-footer">
          {tags.length > 0 && <p className="reading-tags">{tags.map((tag) => <span key={tag}>#{tag}</span>)}</p>}
          © {new Date().getFullYear()} {frontmatter.author || "Elemen"}. All rights reserved.
        </div>
      </div>
      <ReadingEnhancements headings={headings} />
    </div>
  );
}
