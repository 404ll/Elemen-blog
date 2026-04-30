// 统一颜色配置 - Tailwind 需要完整类名
export const COLOR_STYLES = {
  blue: {
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    card: "bg-gray-400 dark:bg-gray-400/40",
  },
  green: {
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    card: "bg-gray-400 dark:bg-gray-400/40",
  },
  purple: {
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    card: "bg-gray-400 dark:bg-gray-400/40",
  },
  gray: {
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    card: "bg-gray-400 dark:bg-gray-400/40",
  },
  orange: {
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    card: "bg-gray-400 dark:bg-gray-400/40",
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