import Link from "next/link";
import { CATEGORIES } from "@/constant";

// 颜色类名映射 - Tailwind 需要完整的类名才能识别
const colorClassMap = {
  blue: {
    bg: 'bg-blue-400 dark:bg-blue-400/40',
    hover: 'hover:translate-y-[-2px] transition-all',
  },
  green: {
    bg: 'bg-green-400 dark:bg-green-400/40',
    hover: 'hover:translate-y-[-2px] transition-all',
  },
  purple: {
    bg: 'bg-purple-400 dark:bg-purple-400/40',
    hover: 'hover:translate-y-[-2px] transition-all',
  },
  gray: {
    bg: 'bg-gray-400 dark:bg-gray-400/40',
    hover: 'hover:translate-y-[-2px] transition-all',
  },
} as const;

export default function CategoryCard() {
  const categories = CATEGORIES;
  return (
    <div className="sticky top-24">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 transition-all shadow-lg hover:shadow-xl dark:bg-gray-800 dark:border dark:border-gray-700">
        <h2 className="text-2xl font-bold tracking-tight mb-4 text-black font-zenmaru dark:text-white">
          Article Categories
        </h2>
        <div className="flex flex-col gap-3">
          {Object.entries(categories).map(([key, category]) => {
            const colorClasses =
              colorClassMap[category.color as keyof typeof colorClassMap] ??
              colorClassMap.gray;
            return (
              <Link
                key={category.name}
                href={`/blog/category/${key}`}
                aria-label={`查看 ${category.name} 分类`}
                className={`block px-4 py-3 ${colorClasses.bg} ${colorClasses.hover} text-base font-bold rounded-lg transition-all text-black dark:text-white cursor-pointer shadow-sm hover:shadow-md`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}