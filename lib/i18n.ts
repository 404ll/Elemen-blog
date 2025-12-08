import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from '@/locales/en-US';
import cn from '@/locales/zh-CH';

const resources = {
  en: {
    translation: en
  },
  cn: {
    translation: cn
  }
};

// 从 localStorage 获取保存的语言，或检测浏览器语言
const getInitialLanguage = (): string => {
    //解释：typeof window !== 'undefined' 表示在浏览器环境中运行
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('i18nextLng'); //获取保存的语言
    if (saved && (saved === 'en' || saved === 'cn')) {
      return saved; //如果保存的语言是 en 或 cn，则返回保存的语言
    }
    // 检测浏览器语言
    const browserLang = navigator.language.split('-')[0]; //获取浏览器语言
    return browserLang === 'zh' ? 'cn' : 'en'; //如果浏览器语言是 zh，则返回 cn，否则返回 en
  }
  return 'cn'; // 默认语言
};


// 初始化 i18n（只在客户端执行，服务端使用默认配置）
if (typeof window !== 'undefined') {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: getInitialLanguage(),
      fallbackLng: 'cn',
      interpolation: {
        escapeValue: false // xss安全开关
      },
      react: {
        useSuspense: false // 避免在 App Router 中使用 Suspense
      }
    });

  // 监听语言变化，保存到 localStorage
  i18n.on('languageChanged', (lng) => {
    localStorage.setItem('i18nextLng', lng);
  });
} else {
  // 服务端渲染时使用默认配置
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'cn',
      fallbackLng: 'cn',
      interpolation: {
        escapeValue: false
      },
      react: {
        useSuspense: false
      }
    });
}

export default i18n;
