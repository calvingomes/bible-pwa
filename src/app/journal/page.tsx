'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Bookmark, Highlight } from '@/types/bible';
import styles from './page.module.css';

export default function JournalPage() {
  const { language, t } = useLanguage();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'bookmarks' | 'highlights'>('bookmarks');

  useEffect(() => {
    // Load local storage states
    const savedBookmarks = localStorage.getItem('bible_pwa_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    const savedHighlights = localStorage.getItem('bible_pwa_highlights');
    if (savedHighlights) setHighlights(JSON.parse(savedHighlights));
  }, []);

  const handleClearAll = () => {
    const confirmClear = window.confirm(
      language === 'en' 
        ? 'Are you sure you want to clear all bookmarks and highlights?' 
        : 'அனைத்து பக்கக்குறிகள் மற்றும் வண்ணக்குறியீடுகளையும் நீக்க வேண்டுமா?'
    );

    if (confirmClear) {
      if (activeSubTab === 'bookmarks') {
        localStorage.removeItem('bible_pwa_bookmarks');
        setBookmarks([]);
      } else {
        localStorage.removeItem('bible_pwa_highlights');
        setHighlights([]);
      }
    }
  };

  const handleRemoveBookmark = (e: React.MouseEvent, bookId: string, chapter: number) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = bookmarks.filter((b) => !(b.bookId === bookId && b.chapter === chapter));
    setBookmarks(updated);
    localStorage.setItem('bible_pwa_bookmarks', JSON.stringify(updated));
  };

  const handleRemoveHighlight = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = highlights.filter((h) => h.id !== id);
    setHighlights(updated);
    localStorage.setItem('bible_pwa_highlights', JSON.stringify(updated));
  };

  return (
    <div className={`${styles.journalPage} animate-fade`}>
      {/* Sub-Header Tabs */}
      <div className={styles.subTabs}>
        <button
          onClick={() => setActiveSubTab('bookmarks')}
          className={`${styles.subTabBtn} ${activeSubTab === 'bookmarks' ? styles.activeSubTab : ''}`}
        >
          {t('bookmarks')} ({bookmarks.length})
        </button>
        <button
          onClick={() => setActiveSubTab('highlights')}
          className={`${styles.subTabBtn} ${activeSubTab === 'highlights' ? styles.activeSubTab : ''}`}
        >
          {t('highlightedVerses')} ({highlights.length})
        </button>
      </div>

      {/* Clear All Action Bar */}
      {((activeSubTab === 'bookmarks' && bookmarks.length > 0) || 
        (activeSubTab === 'highlights' && highlights.length > 0)) && (
        <div className={styles.actionBar}>
          <button onClick={handleClearAll} className={styles.clearAllBtn}>
            🗑️ {t('clearAll')}
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className={styles.contentList}>
        {activeSubTab === 'bookmarks' ? (
          bookmarks.length > 0 ? (
            <div className={styles.bookmarksGrid}>
              {bookmarks.map((bookmark, index) => (
                <Link
                  key={index}
                  href={`/read?book=${bookmark.bookId}&chapter=${bookmark.chapter}`}
                  className={styles.bookmarkCard}
                >
                  <div className={styles.bookmarkMeta}>
                    <span className={styles.bookmarkIcon}>🔖</span>
                    <div className={styles.bookmarkText}>
                      <span className={styles.bookmarkBookName}>
                        {bookmark.bookName}
                      </span>
                      <span className={styles.bookmarkChapter}>
                        {t('chapter')} {bookmark.chapter}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleRemoveBookmark(e, bookmark.bookId, bookmark.chapter)}
                    className={styles.deleteBtn}
                    title="Remove Bookmark"
                  >
                    ✕
                  </button>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🔖</span>
              <p className={styles.emptyText}>{t('noBookmarks')}</p>
            </div>
          )
        ) : (
          highlights.length > 0 ? (
            <div className={styles.highlightsList}>
              {highlights.map((h, index) => (
                <Link
                  key={index}
                  href={`/read?book=${h.bookId}&chapter=${h.chapter}`}
                  className={`${styles.highlightCard} ${styles[h.color]}`}
                >
                  <div className={styles.highlightHeader}>
                    <span className={styles.highlightBook}>
                      {h.bookName} {h.chapter}:{h.verse}
                    </span>
                    <button
                      onClick={(e) => handleRemoveHighlight(e, h.id)}
                      className={styles.deleteBtn}
                      title="Remove Highlight"
                    >
                      ✕
                    </button>
                  </div>
                  <p className={styles.highlightText}>
                    <sup className={styles.highlightNum}>{h.verse}</sup>
                    {h.text}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🎨</span>
              <p className={styles.emptyText}>
                {language === 'en' 
                  ? 'No highlighted verses yet.' 
                  : 'வண்ணமிடப்பட்ட வசனங்கள் இன்னும் சேமிக்கப்படவில்லை.'}
              </p>
            </div>
          ))}
        </div>
      </div>
  );
}
