'use client';
import Link from "next/link";
import { CATEGORIES, getColorStyle } from "@/constant";
import { useTranslation } from "react-i18next";

export default function CategoryCard() {
  const { t } = useTranslation();
  const categories = CATEGORIES;
  return (
    <div className="sticky top-24">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 transition-all shadow-lg hover:shadow-xl dark:bg-gray-800 dark:border dark:border-gray-700">
        <h2 className="text-2xl font-bold tracking-tight mb-4 text-black font-zenmaru dark:text-white">
          {t('home.articleCategories')}
        </h2>
        <div className="flex flex-col gap-3">
          {Object.entries(categories).map(([key, category]) => (
            <Link
              key={category.name}
              href={`/blog/category/${key}`}
              aria-label={`查看 ${category.name} 分类`}
              className={`block px-4 py-3 ${getColorStyle(category.color, 'card')} hover:translate-y-[-2px] text-base font-bold rounded-lg transition-all text-black dark:text-white cursor-pointer shadow-sm hover:shadow-md`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}