
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  isRTL: boolean;
};

const defaultLanguageContext: LanguageContextType = {
  language: 'en',
  setLanguage: () => null,
  isRTL: false
};

const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

export function LanguageProvider({
  children,
  defaultLanguage = 'en',
  storageKey = 'pds-language',
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get the language from localStorage
    const storedLanguage = localStorage.getItem(storageKey);
    if (storedLanguage === 'en' || storedLanguage === 'ar') {
      return storedLanguage;
    }
    return defaultLanguage;
  });

  // Calculate if the current language is RTL
  const isRTL = language === 'ar';

  // Update the localStorage when language changes
  useEffect(() => {
    localStorage.setItem(storageKey, language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add or remove RTL class on body
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language, isRTL, storageKey]);

  const setLanguage = (language: Language) => {
    setLanguageState(language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
