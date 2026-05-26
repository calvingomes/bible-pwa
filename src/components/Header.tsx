'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings, Theme } from '@/context/SettingsContext';
import { Settings, BookOpen, X } from 'lucide-react';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const pathname = usePathname();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <Link href="/" className={styles.logo}>
          <BookOpen className={styles.logoIcon} size={24} strokeWidth={2.5} />
          <h1 className={styles.title}>{t('appTitle')}</h1>
        </Link>

        <div className={styles.actions}>
          <button 
            onClick={toggleLanguage} 
            className={styles.langBtn}
            aria-label="Toggle Language"
            title={language === 'en' ? 'தமிழ் மொழிக்கு மாற்றவும்' : 'Switch to English'}
          >
            {language === 'en' ? 'தமிழ்' : 'English'}
          </button>

          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className={`${styles.iconBtn} ${showSettings ? styles.active : ''}`}
            aria-label="Toggle Settings"
            title={t('settings')}
          >
            <Settings size={20} className={styles.settingsIcon} />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className={`${styles.settingsPanel} animate-fade`}>
          <div className={styles.settingsRow}>
            <span className={styles.settingsLabel}>{t('theme')}:</span>
            <div className={styles.themeGroup}>
              {(['light', 'dark', 'sepia'] as Theme[]).map((tMode) => (
                <button
                  key={tMode}
                  onClick={() => setTheme(tMode)}
                  className={`${styles.themeBtn} ${styles[tMode]} ${theme === tMode ? styles.activeTheme : ''}`}
                >
                  {tMode === 'light' && t('themeLight')}
                  {tMode === 'dark' && t('themeDark')}
                  {tMode === 'sepia' && t('themeSepia')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
