'use client';
import Link from "next/link";
import { CATEGORIES } from "@/constant";

export default function CategoryCard() {
  return (
    <div className="sticky top-24">
      <div className="border border-black dark:border-white bg-white/85 dark:bg-gray-900/85 p-5">
        <h2 className="font-mono text-xs font-bold tracking-widest uppercase text-black dark:text-white mb-4">
          Categories
        </h2>
        <div className="flex flex-col gap-2">
          {Object.entries(CATEGORIES).map(([key, category]) => (
            <Link
              key={category.name}
              href={`/blog/category/${key}`}
              aria-label={`查看 ${category.name} 分类`}
              className="block px-3 py-2 border-l-2 border-black dark:border-white font-mono text-sm font-bold text-black dark:text-white hover:opacity-60 hover:-translate-y-0.5 transition-all"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
