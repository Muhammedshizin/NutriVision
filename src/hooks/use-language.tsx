'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';

import en from '@/locales/en.json';
import hi from '@/locales/hi.json';

type Language = 'en' | 'hi';

type Translations = typeof en;

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translationsMap = {
  en,
  hi,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const storedLanguage = localStorage.getItem('nutrivision-lang') as Language;
      if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'hi')) {
        setLanguageState(storedLanguage);
      }
    } catch (error) {
      console.error('Failed to parse language from localStorage', error);
      localStorage.removeItem('nutrivision-lang');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem('nutrivision-lang', lang);
      setLanguageState(lang);
    } catch (error)      {
      console.error('Failed to save language to localStorage', error);
    }
  };

  const translations = translationsMap[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
