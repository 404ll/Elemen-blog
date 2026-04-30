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
    <div className="mt-20 pb-16 mb-10 font-zenmaru selection:bg-orange-100 dark:selection:bg-orange-900 selection:text-orange-900 dark:selection:text-orange-100 max-w-6xl mx-auto transition-colors bg-white/85 dark:bg-gray-900/85 border-x border-black/10 dark:border-white/10 xl:pr-72">
      <ReadingEnhancements headings={headings} />

      <div className="max-w-[72ch] mx-auto px-6 pt-8 mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-5"
        >
          <div className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm group-hover:shadow-md group-hover:border-blue-600 dark:group-hover:border-blue-400 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-semibold font-zenmaru">返回文章列表</span>
        </Link>

        <header className="space-y-3 text-center md:text-left animate-fade-in-up">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-700 dark:text-gray-300 font-medium transition-colors">
            {frontmatter.category && (
              <span className="px-2 py-0.5 font-mono text-xs font-bold tracking-wider border border-black dark:border-white text-black dark:text-white uppercase">
                {frontmatter.category}
              </span>
            )}

            {displayDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {displayDate}
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {readingMinutes} 分钟阅读
            </span>
          </div>

          {frontmatter.title && (
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 font-zenmaru">
              {frontmatter.title}
            </h1>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="font-mono text-xs text-gray-400 dark:text-gray-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>
        <svg
          className="w-full mt-6"
          height="6"
          viewBox="0 0 800 6"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0,3 Q100,1 200,4 Q300,6 400,3 Q500,0 600,3 Q700,5 800,3"
            stroke="currentColor"
            strokeWidth="1"
            className="text-black/20 dark:text-white/20"
          />
        </svg>
      </div>

      <main className="max-w-[72ch] mx-auto px-6">
        <article className="prose prose-slate dark:prose-invert prose-headings:font-zenmaru prose-p:font-zenmaru max-w-none text-[17px] leading-[1.9]">
          <MDXContent components={mdxComponents} />
        </article>
      </main>

      <div className="max-w-[72ch] mx-auto px-6 mt-20 pt-10 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400 text-sm transition-colors">
        © {new Date().getFullYear()} {frontmatter.author || "Blog Owner"}. All rights reserved.
      </div>
    </div>
  );
}
