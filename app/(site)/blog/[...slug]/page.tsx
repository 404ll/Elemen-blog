import { renderMDX } from "@/lib/mdx";
import { getAllPosts, getPostBySlug, normalizeTags } from "@/lib/post";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { mdxComponents } from "@/components/ui/MdxContent";
import ReadingEnhancements from "@/components/ui/ReadingEnhancements";
import { extractHeadingsFromMdx } from "@/lib/headings";

export const revalidate = 3600;

type BlogPageProps = {
  params: Promise<{ slug: string[] }>;
};

async function resolveSlug(paramsPromise: BlogPageProps["params"]) {
  const params = await paramsPromise;
  if (!params?.slug) return null;
  return Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
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
  return posts.map((post) => ({
    slug: post.slug.split("/"),
  }));
}

export async function generateMetadata({ params }: BlogPageProps) {
  const slug = await resolveSlug(params);
  if (!slug) return {};

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

  const post = getPostBySlug(slug);
  if (!post) return notFound();

  const { frontmatter, content } = post;
  const MDXContent = await renderMDX(content);

  const readingMinutes = Math.max(
    1,
    Math.round(content.split(/\s+/).filter(Boolean).length / 300)
  );

  const displayDate = formatDate(frontmatter.date);
  const tags = normalizeTags(frontmatter.tags);
  const headings = extractHeadingsFromMdx(content);

  return (
    <div className="mt-20 pb-16 selection:bg-orange-100 dark:selection:bg-orange-900 selection:text-orange-900 dark:selection:text-orange-100 max-w-4xl mx-auto px-4 xl:max-w-6xl xl:px-6 xl:pr-72">
      <ReadingEnhancements headings={headings} />

      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-7 pb-6 border-b border-gray-100 dark:border-gray-700">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group mb-5"
          >
            <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/30 transition-colors">
              <ArrowLeft size={14} />
            </div>
            <span className="text-sm">返回文章列表</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-3">
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
              {readingMinutes} 分钟阅读
            </span>
          </div>

          {frontmatter.title && (
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-snug mb-3">
              {frontmatter.title}
            </h1>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span key={tag} className="text-xs text-gray-400 dark:text-gray-500">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <main className="px-8 py-8">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <MDXContent components={mdxComponents} />
          </article>
        </main>

        <div className="px-8 py-6 border-t border-gray-100 dark:border-gray-700 text-center text-gray-400 dark:text-gray-500 text-sm">
          © {new Date().getFullYear()} {frontmatter.author || "Blog Owner"}. All rights reserved.
        </div>
      </div>
    </div>
  );
}
