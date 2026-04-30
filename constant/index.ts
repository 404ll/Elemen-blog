// 统一颜色配置 - Tailwind 需要完整类名
export const COLOR_STYLES = {
  blue: {
    badge: "border border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300 font-mono text-xs tracking-wider",
    card: "border-l-2 border-blue-600 dark:border-blue-400",
  },
  green: {
    badge: "border border-green-600 text-green-700 dark:border-green-400 dark:text-green-300 font-mono text-xs tracking-wider",
    card: "border-l-2 border-green-600 dark:border-green-400",
  },
  purple: {
    badge: "border border-purple-600 text-purple-700 dark:border-purple-400 dark:text-purple-300 font-mono text-xs tracking-wider",
    card: "border-l-2 border-purple-600 dark:border-purple-400",
  },
  gray: {
    badge: "border border-gray-500 text-gray-600 dark:border-gray-400 dark:text-gray-300 font-mono text-xs tracking-wider",
    card: "border-l-2 border-gray-500 dark:border-gray-400",
  },
  orange: {
    badge: "border border-orange-600 text-orange-700 dark:border-orange-400 dark:text-orange-300 font-mono text-xs tracking-wider",
    card: "border-l-2 border-orange-600 dark:border-orange-400",
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