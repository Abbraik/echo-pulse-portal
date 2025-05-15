
import { useLanguage } from '@/hooks/use-language';
import en from '@/locales/en';
import ar from '@/locales/ar';

type TranslationKeys = keyof typeof en;

export const useTranslation = () => {
  const { language, setLanguage, isRTL } = useLanguage();
  
  const t = (key: TranslationKeys) => {
    const translations = language === 'en' ? en : ar;
    return translations[key] || key;
  };
  
  return {
    t,
    language,
    setLanguage,
    isRTL
  };
};
