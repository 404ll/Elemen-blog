// 统一颜色配置 - Tailwind 需要完整类名
export const COLOR_STYLES = {
  blue: {
    badge: "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-400/40 dark:text-blue-300 dark:border-blue-800",
    card: "bg-blue-400 dark:bg-blue-400/40",
  },
  green: {
    badge: "bg-green-50 text-green-700 border border-green-100 dark:bg-green-400/40 dark:text-green-300 dark:border-green-800",
    card: "bg-green-400 dark:bg-green-400/40",
  },
  purple: {
    badge: "bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
    card: "bg-purple-400 dark:bg-purple-400/40",
  },
  gray: {
    badge: "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    card: "bg-gray-400 dark:bg-gray-400/40",
  },
  orange: {
    badge: "bg-orange-50 text-orange-700 border border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
    card: "bg-orange-400 dark:bg-orange-400/40",
  },
} as const;

export type ColorKey = keyof typeof COLOR_STYLES;

// 获取颜色样式的辅助函数
export const getColorStyle = (color: string | undefined, type: 'badge' | 'card') => {
  const key = (color && color in COLOR_STYLES ? color : 'gray') as ColorKey;
  return COLOR_STYLES[key][type];
};

export const CATEGORIES = {
  frontend: {
    name: 'Frontend',
    color: 'blue' as ColorKey,
  },
  backend: {
    name: 'Backend',
    color: 'green' as ColorKey,
  },
  web3: {
    name: 'Web3',
    description: 'Web3 development is the practice of creating decentralized applications.',
    color: 'purple' as ColorKey,
  },
  note: {
    name: 'Note',
    color: 'gray' as ColorKey,
  },
  algorithm: {
    name: 'Algorithm',
    color: 'orange' as ColorKey,
  },
} as const;