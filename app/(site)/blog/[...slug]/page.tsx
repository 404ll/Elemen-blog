import { renderMDX } from "@/lib/mdx";
import { getAllPosts, getPostBySlug, normalizeTags } from "@/lib/post";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"; 
import { mdxComponents } from "@/components/ui/MdxContent"; 

// ISR: 每小时重新验证，新文章自动生成页面
export const revalidate = 3600;

type BlogPageProps = {
  params: Promise<{ slug: string[] }>;
};

// 辅助函数：解析 Slug
async function resolveSlug(paramsPromise: BlogPageProps["params"]) {
  const params = await paramsPromise;
  if (!params?.slug) return null;
  return Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
}

// 辅助函数：格式化日期
function formatDate(dateString?: string) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// SSG 参数生成
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug.split("/"),
  }));
}

// Metadata 生成
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
      type: 'article',
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
    }
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const slug = await resolveSlug(params);
  if (!slug) return notFound();

  const post = getPostBySlug(slug);
  if (!post) return notFound();

  const { frontmatter, content } = post;
  
  // 渲染 MDX
  const MDXContent = await renderMDX(content);
  
  // 计算阅读时间
  const readingMinutes = Math.max(
    1,
    Math.round(content.split(/\s+/).filter(Boolean).length / 300)
  );

  const displayDate = formatDate(frontmatter.date);
  const tags = normalizeTags(frontmatter.tags);

  return (
    <div className="mt-20 pb-16 mb-10 shadow-lg font-zenmaru selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 max-w-5xl mx-auto rounded-2xl transition-colors bg-white dark:bg-gray-900">
      {/* 顶部导航占位 + 返回按钮 */}
      <div className="max-w-4xl mx-auto px-6 pt-12 mb-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-8"
        >
          <div className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm group-hover:shadow-md group-hover:border-blue-600 dark:group-hover:border-blue-400 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-semibold font-zenmaru">返回文章列表</span>
        </Link>

        {/* 文章头部信息 */}
        <header className="space-y-6 text-center md:text-left animate-fade-in-up">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-700 dark:text-gray-300 font-medium transition-colors">
            {frontmatter.category && (
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800 transition-colors">
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

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
      </div>

      {/* 文章正文 */}
      <main className="max-w-4xl mx-auto px-6">
        <article className="prose prose-slate dark:prose-invert prose-headings:font-zenmaru prose-p:font-zenmaru max-w-none text-[17px] leading-[1.75] prose-p:leading-[1.75] prose-p:my-[1.6em] prose-li:leading-[1.7] prose-ul:my-[1.2em] prose-ol:my-[1.2em]">
            <MDXContent components={mdxComponents} />
        </article>
      </main>
      
      {/* 底部版权或简单 Footer */}
      <div className="max-w-[72ch] mx-auto px-6 mt-20 pt-10 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400 text-sm transition-colors">
         © {new Date().getFullYear()} {frontmatter.author || "Blog Owner"}. All rights reserved.
      </div>
    </div>
  );
}