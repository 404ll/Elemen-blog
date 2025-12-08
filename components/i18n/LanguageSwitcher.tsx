'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🚀 SSR 期间不渲染按钮，避免 i18n.language 造成不一致
  if (!mounted) return null;

  return (
    <div className="flex gap-2 text-xl font-semibold">
      <button
        onClick={() => i18n.changeLanguage('cn')}
        className={`px-3 py-1 rounded ${
          i18n.language === 'cn'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        cn
      </button>

      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-3 py-1 rounded ${
          i18n.language === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        en
      </button>
    </div>
  );
}
