'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'sepia';
export type FontType = 'serif' | 'sans';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontType: FontType;
  setFontType: (type: FontType) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [fontSize, setFontSizeState] = useState<number>(18);
  const [fontType, setFontTypeState] = useState<FontType>('serif');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load setting preferences from localStorage
    const savedTheme = localStorage.getItem('bible_pwa_theme') as Theme;
    const savedFontSize = localStorage.getItem('bible_pwa_font_size');
    const savedFontType = localStorage.getItem('bible_pwa_font_type') as FontType;

    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'sepia') {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // detect browser preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setThemeState(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }

    if (savedFontSize) {
      setFontSizeState(Number(savedFontSize));
    }

    if (savedFontType === 'serif' || savedFontType === 'sans') {
      setFontTypeState(savedFontType);
    }

    setIsLoaded(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('bible_pwa_theme', newTheme);
  };

  const setFontSize = (size: number) => {
    setFontSizeState(size);
    localStorage.setItem('bible_pwa_font_size', String(size));
  };

  const setFontType = (type: FontType) => {
    setFontTypeState(type);
    localStorage.setItem('bible_pwa_font_type', type);
  };

  return (
    <SettingsContext.Provider value={{ theme, setTheme, fontSize, setFontSize, fontType, setFontType }}>
      {isLoaded ? children : <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }} />}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
