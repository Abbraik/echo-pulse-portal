
import { useLanguage } from '@/hooks/use-language';
import en from '@/locales/en';
import ar from '@/locales/ar';

type TranslationKeys = keyof typeof en;

interface TranslationOptions {
  defaultValue?: string;
}

export const useTranslation = () => {
  const { language, setLanguage, isRTL } = useLanguage();
  
  const t = (key: TranslationKeys, options?: TranslationOptions) => {
    const translations = language === 'en' ? en : ar;
    return translations[key] || options?.defaultValue || key;
  };
  
  return {
    t,
    language,
    setLanguage,
    isRTL
  };
};
