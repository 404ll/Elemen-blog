import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/types";
import { CATEGORIES } from "@/constant";
import styles from "./ArticleCard.module.css";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Shanghai",
});

export default function ArticleCard({ post, displayDate = post.date }: { post: Post; displayDate?: string }) {
  const { slug, title, subtitle, excerpt, category } = post;
  const categoryMeta = category ? CATEGORIES[category as keyof typeof CATEGORIES] : null;
  const categoryLabel = categoryMeta?.name ?? category ?? "随笔";

  return (
    <article className={styles.card} data-category={category}>
      <div className={styles.heading}>
        {category ? (
          <Link href={`/blog/${category}`} className={styles.category}>
            <span aria-hidden="true" className={styles.dot} />
            {categoryLabel}
          </Link>
        ) : (
          <span className={styles.category}>{categoryLabel}</span>
        )}
        <h2 className={styles.title}>
          <Link href={`/blog/${slug}`} className={styles.articleLink}>
            {title}
          </Link>
        </h2>
      </div>
      <div className={styles.body}>
        <div className={styles.description}>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
        </div>
        <div className={styles.footer}>
          {displayDate && <time dateTime={displayDate}>{dateFormatter.format(new Date(displayDate)).replaceAll("/", ".")}</time>}
          <span className={styles.readMore} aria-hidden="true">
            阅读全文 <ArrowUpRight size={15} strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </article>
  );
}
