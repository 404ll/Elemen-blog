import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCH from '@/locales/zh-CH';
import enUS from '@/locales/en-US';

const resources = {
  'zh-CN': {
    translation: zhCH,
  },
  'en-US': {
    translation: enUS,
  },
};

// 从 localStorage 读取用户上次选择的语言，如果没有则使用默认值
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang && (savedLang === 'zh-CN' || savedLang === 'en-US')) {
      return savedLang;
    }
  }
  return 'zh-CN'; // 默认语言
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false, // React 已经做了 XSS 防护
    },
  });

// 监听语言变化，自动保存到 localStorage
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
  }
});

export default i18n;
