import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import KnowledgeRelationMap from "@/components/home/KnowledgeRelationMap";
import { CATEGORIES } from "@/constant";
import type { Post } from "@/types";

const HOME_TOPICS = ["frontend", "ai", "algorithm", "backend"] as const;

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Shanghai",
});

function getCategoryName(category?: string) {
  if (!category) return "Note";
  return CATEGORIES[category as keyof typeof CATEGORIES]?.name ?? category;
}

function formatDate(date: string) {
  return dateFormatter.format(new Date(date)).replace("/", ".");
}

export default function HomeClient({ posts }: { posts: Post[] }) {
  const recentPosts = posts.slice(0, 3);
  const topicCounts = HOME_TOPICS.map((topic) => ({
    key: topic,
    name: CATEGORIES[topic].name,
    count: posts.filter((post) => post.category === topic).length,
  }));

  return (
    <main id="main-content" className="min-h-screen overflow-hidden px-5 pb-20 pt-28 sm:px-8 lg:px-12 lg:pt-32">
      <div className="mx-auto max-w-[1280px]">
        <section className="relative border-b border-[#cac7bf] pb-14 dark:border-white/15 lg:pb-16">
          <span aria-hidden="true" className="absolute -left-7 top-2 hidden h-2 w-2 bg-[#f05a28] lg:block" />
          <span aria-hidden="true" className="absolute -right-7 bottom-14 hidden h-px w-12 bg-[#f05a28] lg:block" />

          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[#77746d] dark:text-stone-400">
            Personal knowledge system · {posts.length} notes
          </p>

          <div className="mt-7 grid gap-9 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-16">
            <div>
              <h1 className="max-w-[820px] text-[2.6rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[#191916] dark:text-stone-50 sm:text-5xl lg:text-[3.4rem]">
                把问题写下来，
                <br className="hidden sm:block" />
                让理解彼此连接
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#68655f] dark:text-stone-300 sm:text-lg">
                记录前端、AI、算法与工程实践中的真实问题，把零散的答案整理成可以继续生长的知识。
              </p>
            </div>

            <form action="/blog" method="get" role="search" className="group">
              <label htmlFor="home-search" className="mb-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#77746d] dark:text-stone-400">
                Search the knowledge base
              </label>
              <div className="flex items-center gap-3 border-b border-[#191916] pb-3 transition-colors focus-within:border-[#f05a28] dark:border-stone-300">
                <Search aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-[#77746d] group-focus-within:text-[#f05a28]" strokeWidth={1.7} />
                <input
                  id="home-search"
                  name="q"
                  type="search"
                  autoComplete="off"
                  placeholder="搜索问题、概念或文章"
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#191916] outline-none placeholder:text-[#8c8981] dark:text-stone-50 dark:placeholder:text-stone-500"
                />
                <kbd className="hidden border border-[#cac7bf] px-1.5 py-0.5 font-mono text-[9px] text-[#77746d] dark:border-white/20 dark:text-stone-400 sm:inline-block">
                  ENTER
                </kbd>
              </div>
            </form>
          </div>
        </section>

        <section className="grid border-b border-[#cac7bf] dark:border-white/15 lg:grid-cols-[minmax(0,1.35fr)_minmax(21rem,0.75fr)]">
          <div className="py-12 lg:border-r lg:border-[#cac7bf] lg:py-16 lg:pr-14 dark:lg:border-white/15">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f05a28]">01 / Updates</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#191916] dark:text-stone-50">最近更新</h2>
              </div>
              <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm text-[#5f5c56] underline-offset-4 hover:text-[#f05a28] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f05a28] dark:text-stone-300">
                查看全部
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </Link>
            </div>

            <ol className="border-t border-[#cac7bf] dark:border-white/15">
              {recentPosts.map((post, index) => (
                <li key={post.slug} className="group border-b border-[#cac7bf] dark:border-white/15">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="grid gap-4 py-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f05a28] sm:grid-cols-[2.25rem_minmax(0,1fr)_auto] sm:items-start"
                  >
                    <span className="font-mono text-[10px] text-[#8c8981] transition-colors group-hover:text-[#f05a28] dark:text-stone-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-lg font-semibold leading-snug tracking-[-0.02em] text-[#22221f] transition-colors group-hover:text-[#f05a28] dark:text-stone-100 sm:text-xl">
                        {post.title}
                      </span>
                      {post.excerpt && (
                        <span className="mt-2 line-clamp-2 block max-w-2xl text-sm leading-6 text-[#77746d] dark:text-stone-400">
                          {post.excerpt}
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#77746d] dark:text-stone-400 sm:justify-end sm:pt-1">
                      <span>{getCategoryName(post.category)}</span>
                      <span aria-hidden="true" className="h-1 w-1 bg-[#f05a28]" />
                      <time dateTime={post.updatedAt ?? post.date}>{formatDate(post.updatedAt ?? post.date)}</time>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <aside className="py-12 lg:py-16 lg:pl-14">
            <KnowledgeRelationMap />

            <div className="mt-12 border-t border-[#cac7bf] pt-8 dark:border-white/15">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77746d] dark:text-stone-400">In progress</p>
              <h2 className="mt-2 text-lg font-semibold text-[#191916] dark:text-stone-50">正在整理</h2>
              <ol className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[#77746d] dark:text-stone-400">
                {["Selection", "Range", "XPath", "normalize()"].map((item, index) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className={index === 0 ? "text-[#f05a28]" : ""}>{item}</span>
                    {index < 3 && <span aria-hidden="true" className="text-[#aaa69d]">→</span>}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </section>

        <section className="py-12 lg:py-16" aria-labelledby="topic-index-title">
          <div className="grid gap-8 lg:grid-cols-[0.55fr_1.45fr] lg:gap-16">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f05a28]">02 / Index</p>
              <h2 id="topic-index-title" className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#191916] dark:text-stone-50">主题索引</h2>
              <p className="mt-3 max-w-xs text-sm leading-6 text-[#77746d] dark:text-stone-400">从已有内容进入，不制造空的知识分类。</p>
            </div>

            <ul className="grid border-t border-[#191916] dark:border-stone-300 sm:grid-cols-2">
              {topicCounts.map((topic) => (
                <li key={topic.key} className="border-b border-[#cac7bf] sm:odd:border-r dark:border-white/15">
                  <Link
                    href={`/blog/${topic.key}`}
                    className="group flex items-baseline justify-between gap-6 px-0 py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f05a28] sm:px-5"
                  >
                    <span className="text-base font-medium text-[#252521] transition-colors group-hover:text-[#f05a28] dark:text-stone-100">{topic.name}</span>
                    <span className="font-mono text-2xl font-light text-[#77746d] transition-colors group-hover:text-[#f05a28] dark:text-stone-400">{String(topic.count).padStart(2, "0")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
