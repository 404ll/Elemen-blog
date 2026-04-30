'use client';
import Link from "next/link";
import { CATEGORIES } from "@/constant";

export default function CategoryCard() {
  return (
    <div className="sticky top-24">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 tracking-wide uppercase">
          Categories
        </h2>
        <div className="flex flex-col gap-1">
          {Object.entries(CATEGORIES).map(([key, category]) => (
            <Link
              key={category.name}
              href={`/blog/category/${key}`}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
