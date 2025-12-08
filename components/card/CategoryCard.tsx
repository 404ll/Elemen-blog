import { CATEGORIES } from "@/constant";

// 颜色类名映射 - Tailwind 需要完整的类名才能识别
const colorClassMap = {
  blue: {
    bg: 'bg-blue-400',
    hover: 'hover:translate-y-[-2px] transition-all',
  },
  green: {
    bg: 'bg-green-400',
    hover: 'hover:translate-y-[-2px] transition-all',
  },
  purple: {
    bg: 'bg-purple-400',
    hover: 'hover:translate-y-[-2px] transition-all',
  },
  gray: {
    bg: 'bg-gray-400',
    hover: 'hover:translate-y-[-2px] transition-all',
  },
} as const;

export default function CategoryCard() {
  const categories = CATEGORIES;
  return (
    <div className="max-w-xl mx-auto mt-10">
        <div className="text-2xl font-bold tracking-tight mb-2 text-black font-zenmaru flex items-center gap-2 text-color[#D18F31]">
            Article Categories
        </div>
    <div className="flex gap-4 flex-wrap justify-center">
      {Object.values(categories).map((category) => {
        const colorClasses = colorClassMap[category.color as keyof typeof colorClassMap];
        return (
          <div 
            key={category.name} 
            className={`px-2 py-1 ${colorClasses.bg} ${colorClasses.hover} text-base font-bold rounded-md transition-colors text-black`}
          >
            {category.name}
          </div>
        );
      })}
      </div>
    </div>
  );
}