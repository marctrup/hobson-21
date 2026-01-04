import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CONTENT } from '@/config/content';
import { CONTENT_DE } from '@/config/content-de';
import { CONTENT_AE } from '@/config/content-ae';
import { CONTENT_FR } from '@/config/content-fr';
import { CONTENT_SG } from '@/config/content-sg';
import { CONTENT_AU } from '@/config/content-au';
import { CONTENT_NZ } from '@/config/content-nz';

export type Language = 'en' | 'de' | 'ae' | 'fr' | 'sg' | 'au' | 'nz';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <T>(path: string, fallback?: T) => T;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Content map - add new languages here
const contentMap: Record<Language, typeof CONTENT | typeof CONTENT_DE | typeof CONTENT_AE | typeof CONTENT_FR | typeof CONTENT_SG | typeof CONTENT_AU | typeof CONTENT_NZ | null> = {
  en: CONTENT,
  de: CONTENT_DE,
  ae: CONTENT_AE,
  fr: CONTENT_FR,
  sg: CONTENT_SG,
  au: CONTENT_AU,
  nz: CONTENT_NZ,
};

// Helper to get nested value from object using dot notation
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Translation function with automatic fallback to English
  const t = useCallback(<T,>(path: string, fallback?: T): T => {
    const currentContent = contentMap[language];
    
    // Try to get value from current language
    if (currentContent) {
      const value = getNestedValue(currentContent, path);
      if (value !== undefined) {
        return value as T;
      }
    }
    
    // Fallback to English
    const englishValue = getNestedValue(CONTENT, path);
    if (englishValue !== undefined) {
      return englishValue as T;
    }
    
    // Return fallback or path as last resort
    return (fallback ?? path) as T;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Hook to get the full content object for current language (with fallbacks)
export const useContent = () => {
  const { language } = useLanguage();
  
  // Return content with fallback chain
  const content = contentMap[language] || CONTENT;
  
  // Merge with English as base to ensure all keys exist
  return {
    ...CONTENT,
    ...content,
  };
};
