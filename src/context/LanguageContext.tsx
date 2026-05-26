'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ta';

type TranslationKeys =
  | 'appTitle'
  | 'search'
  | 'bookmarks'
  | 'books'
  | 'oldTestament'
  | 'newTestament'
  | 'language'
  | 'theme'
  | 'themeLight'
  | 'themeDark'
  | 'themeSepia'
  | 'searchPlaceholder'
  | 'searchResultsCount'
  | 'noResults'
  | 'bookmarkedPages'
  | 'noBookmarks'
  | 'highlightedVerses'
  | 'bookmarkThisPage'
  | 'removeBookmark'
  | 'close'
  | 'clearSearch'
  | 'chapter'
  | 'verse'
  | 'goBack'
  | 'selectBook'
  | 'selectChapter'
  | 'Pentateuch'
  | 'Historical'
  | 'Wisdom'
  | 'Prophets'
  | 'Gospels'
  | 'Acts'
  | 'Epistles'
  | 'Revelation'
  | 'home'
  | 'tapVerse'
  | 'bookmarkAdded'
  | 'bookmarkRemoved'
  | 'highlightAdded'
  | 'highlightRemoved'
  | 'offlineMode'
  | 'clearAll'
  | 'settings';

const translations: Record<Language, Record<TranslationKeys, string>> = {
  en: {
    appTitle: "Catholic Bible",
    search: "Search",
    bookmarks: "Bookmarks",
    books: "Books",
    oldTestament: "Old Testament",
    newTestament: "New Testament",
    language: "Language",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSepia: "Sepia",
    searchPlaceholder: "Search keywords (e.g. faith, love, grace)...",
    searchResultsCount: "Found {count} results",
    noResults: "No results found. Try another term.",
    bookmarkedPages: "Bookmarked Chapters",
    noBookmarks: "No bookmarks saved yet.",
    highlightedVerses: "Highlighted Verses",
    bookmarkThisPage: "Bookmark Chapter",
    removeBookmark: "Bookmarked",
    close: "Close",
    clearSearch: "Clear",
    chapter: "Chapter",
    verse: "Verse",
    goBack: "Go Back",
    selectBook: "Select a Book",
    selectChapter: "Select Chapter",
    Pentateuch: "Pentateuch",
    Historical: "Historical",
    Wisdom: "Wisdom",
    Prophets: "Prophets",
    Gospels: "Gospels",
    Acts: "Acts",
    Epistles: "Epistles",
    Revelation: "Revelation",
    home: "Home",
    tapVerse: "Tap a verse to highlight it.",
    bookmarkAdded: "Chapter added to bookmarks",
    bookmarkRemoved: "Chapter removed from bookmarks",
    highlightAdded: "Verse highlighted",
    highlightRemoved: "Highlight removed",
    offlineMode: "Offline Mode Ready",
    clearAll: "Clear All",
    settings: "Settings"
  },
  ta: {
    appTitle: "கத்தோலிக்க திருவிவிலியம்",
    search: "தேடல்",
    bookmarks: "பக்கக்குறிகள்",
    books: "திருவிவிலிய நூல்கள்",
    oldTestament: "பழைய ஏற்பாடு",
    newTestament: "புதிய ஏற்பாடு",
    language: "மொழி",
    theme: "வடிவம்",
    themeLight: "பகல்",
    themeDark: "இரவு",
    themeSepia: "செபியா",
    searchPlaceholder: "தேட வேண்டிய சொற்கள் (எ.கா. விசுவாசம், அன்பு, அருள்)...",
    searchResultsCount: "{count} முடிவுகள் கண்டறியப்பட்டன",
    noResults: "முடிவுகள் எதுவும் இல்லை. வேறு சொல்லை முயலவும்.",
    bookmarkedPages: "குறிக்கப்பட்ட அதிகாரங்கள்",
    noBookmarks: "இன்னும் பக்கக்குறிகள் எதுவும் சேமிக்கப்படவில்லை.",
    highlightedVerses: "வண்ணமிடப்பட்ட வசனங்கள்",
    bookmarkThisPage: "அதிகாரத்தை குறிக்கவும்",
    removeBookmark: "குறிக்கப்பட்டது",
    close: "மூடு",
    clearSearch: "நீக்கு",
    chapter: "அதிகாரம்",
    verse: "வசனம்",
    goBack: "பின்செல்க",
    selectBook: "நூலைத் தேர்ந்தெடுக்கவும்",
    selectChapter: "அதிகாரத்தைத் தேர்ந்தெடுக்கவும்",
    Pentateuch: "திருச்சட்டம் (ஐந்நூல்கள்)",
    Historical: "வரலாற்று நூல்கள்",
    Wisdom: "ஞான இலக்கியங்கள்",
    Prophets: "இறைவாக்கினர் நூல்கள்",
    Gospels: "நற்செய்தி நூல்கள்",
    Acts: "திருத்தூதர் பணிகள்",
    Epistles: "திருமுகங்கள்",
    Revelation: "திருவெளிப்பாடு",
    home: "முகப்பு",
    tapVerse: "வசனத்திற்கு வண்ணமிட அதன் மேல் தட்டவும்.",
    bookmarkAdded: "அதிகாரம் குறிக்கப்பட்டது",
    bookmarkRemoved: "குறிப்பு நீக்கப்பட்டது",
    highlightAdded: "வசனத்திற்கு வண்ணமிடப்பட்டது",
    highlightRemoved: "வண்ணம் நீக்கப்பட்டது",
    offlineMode: "இணையமின்றி வாசிக்கலாம்",
    clearAll: "அனைத்தையும் நீக்கு",
    settings: "அமைப்புகள்"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('bible_pwa_lang') as Language;
    if (savedLang === 'en' || savedLang === 'ta') {
      setLanguageState(savedLang);
    } else {
      // detect user preferences
      const browserLang = navigator.language;
      if (browserLang.startsWith('ta')) {
        setLanguageState('ta');
      }
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bible_pwa_lang', lang);
  };

  const t = (key: TranslationKeys, replacements?: Record<string, string | number>): string => {
    let text = translations[language][key] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {isLoaded ? children : <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }} />}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
