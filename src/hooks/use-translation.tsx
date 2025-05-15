
import { useLanguage } from '@/hooks/use-language';
import en from '@/locales/en';
import ar from '@/locales/ar';

type TranslationKeys = keyof typeof en;

export const useTranslation = () => {
  const { language, setLanguage, isRTL } = useLanguage();
  
  const t = (key: TranslationKeys, placeholders?: Record<string, string>) => {
    const translations = language === 'en' ? en : ar;
    let text = translations[key] || key;
    
    if (placeholders) {
      Object.entries(placeholders).forEach(([key, value]) => {
        text = text.replace(new RegExp(`{${key}}`, 'g'), value);
      });
    }
    
    return text;
  };
  
  return {
    t,
    language,
    setLanguage,
    isRTL
  };
};
