import { useLanguage } from '@/hooks/use-language';
import { en } from '@/locales/en';
import { ar } from '@/locales/ar';

// Define the type for all translation keys
export type TranslationKey = keyof typeof en;

interface TranslationOptions {
  defaultValue?: string;
  [key: string]: any; // Allow for interpolation values
}

export const useTranslation = () => {
  const { language, setLanguage, isRTL } = useLanguage();
  
  const t = (key: TranslationKey | string, options?: TranslationOptions) => {
    const translations = language === 'en' ? en : ar;
    
    // Get the translation or fallback
    let translation = '';
    
    // Check if the key exists in translations
    if (key in translations) {
      translation = translations[key as keyof typeof en];
    } else {
      // Use default value or key itself as fallback
      translation = options?.defaultValue || key as string;
    }
    
    // Handle interpolation if options are provided
    if (options) {
      Object.keys(options).forEach(optionKey => {
        if (optionKey !== 'defaultValue') {
          const regex = new RegExp(`{{${optionKey}}}`, 'g');
          translation = translation.replace(regex, String(options[optionKey]));
        }
      });
    }
    
    return translation;
  };
  
  return {
    t,
    language,
    setLanguage,
    isRTL
  };
};
