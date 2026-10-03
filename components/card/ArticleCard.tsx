import Link from "next/link";
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
      {post.cover && (
        <div className={styles.cover}>
          {/* Source images are served directly by their CDN. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className={styles.content}>
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
        <div className={styles.description}>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
        </div>
        <div className={styles.footer}>
          {displayDate && <time dateTime={displayDate}>{dateFormatter.format(new Date(displayDate)).replaceAll("/", ".")}</time>}
        </div>
      </div>
    </article>
  );
}
