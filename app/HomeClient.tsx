"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import KnowledgeRelationMap from "@/components/home/KnowledgeRelationMap";
import { CATEGORIES } from "@/constant";
import type { Post } from "@/types";
import styles from "./HomeClient.module.css";

const PAGE_SIZE = 12;
const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Shanghai",
});

export default function HomeClient({ posts }: { posts: Post[] }) {
  const [category, setCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const topics = Object.entries(CATEGORIES).filter(([key]) => posts.some((post) => post.category === key));
  const filteredPosts = category === "all" ? posts : posts.filter((post) => post.category === category);

  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.container}>
        <header className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>ELEMEN’S NOTES</p>
            <h1>在这里，记录每一次想明白。</h1>
            <p className={styles.description}>关于代码、AI，以及那些值得记下来的小发现。</p>
          </div>
          <form action="/blog" method="get" role="search" className={styles.search}>
            <Search size={18} aria-hidden="true" />
            <label htmlFor="home-search" className="sr-only">搜索笔记</label>
            <input id="home-search" name="q" type="search" placeholder="找一篇笔记…" autoComplete="off" />
          </form>
        </header>

        <section aria-label="文章笔记">
          <div className={styles.toolbar}>
            <div className={styles.filters} role="group" aria-label="按主题筛选">
              {[["all", "全部"], ...topics.map(([key, value]) => [key, value.name])].map(([key, label]) => (
                <button key={key} type="button" aria-pressed={category === key} onClick={() => { setCategory(key); setVisibleCount(PAGE_SIZE); }}>
                  {label}
                </button>
              ))}
            </div>
            <span className={styles.count} aria-live="polite">{filteredPosts.length} 篇笔记 · 最新发布</span>
          </div>

          <ol className={styles.grid}>
            {filteredPosts.slice(0, visibleCount).map((post, index) => {
              const label = CATEGORIES[post.category as keyof typeof CATEGORIES]?.name ?? post.category ?? "Note";
              return (
                <li key={post.slug}>
                  <article className={styles.card} data-category={post.category}>
                    <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                      <div className={styles.cover} data-pattern={index % 3}>
                        <span className={styles.coverTop}><span>{label}</span><ArrowUpRight size={17} /></span>
                        <h2>{post.title}</h2>
                        <span className={styles.coverBottom} aria-hidden="true"><span>学习手记</span><span>Elemen / {String(index + 1).padStart(2, "0")}</span></span>
                      </div>
                      <div className={styles.cardBody}>
                        {(post.subtitle || post.excerpt) && <p className={styles.excerpt}>{post.subtitle || post.excerpt}</p>}
                        <div className={styles.meta}>
                          <span className={styles.author}><span className={styles.avatar} aria-hidden="true">e.</span>{post.author || "Elemen"}</span>
                          <time dateTime={post.date}>{dateFormatter.format(new Date(post.date)).replaceAll("/", ".")}</time>
                        </div>
                      </div>
                    </Link>
                  </article>
                </li>
              );
            })}
          </ol>
          {filteredPosts.length === 0 && <p className={styles.empty}>还没有笔记，过些时候再来看看。</p>}
          <div className={styles.more}>
            {visibleCount < filteredPosts.length ? (
              <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>再看一些笔记 <span aria-hidden="true">↓</span></button>
            ) : <span>笔记会继续生长。</span>}
            <Link href="/blog">进入知识库 <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>
        </section>

        <details className={styles.explore}>
          <summary>沿着知识继续探索 <span>知识关系 / 正在整理</span></summary>
          <div className={styles.exploreBody}>
            <KnowledgeRelationMap />
            <div><h2>正在整理</h2><p>Selection → Range → XPath → normalize()</p>
              <nav aria-label="主题索引">{topics.map(([key, value]) => <Link key={key} href={`/blog/${key}`}>{value.name} <ArrowUpRight size={12} aria-hidden="true" /></Link>)}</nav>
            </div>
          </div>
        </details>
      </div>
    </main>
  );
}
