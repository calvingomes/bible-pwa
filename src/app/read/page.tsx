'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import { Book, BookData, Verse, Bookmark, Highlight } from '@/types/bible';
import styles from './page.module.css';

function ReaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const { fontSize, fontType } = useSettings();

  const bookId = searchParams.get('book') || 'gen';
  const chapterNum = Number(searchParams.get('chapter')) || 1;

  const [booksList, setBooksList] = useState<Book[]>([]);
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // Load book catalog and state
  useEffect(() => {
    fetch('/data/books.json')
      .then((res) => res.json())
      .then((data: Book[]) => setBooksList(data))
      .catch((err) => console.error('Failed to load books index:', err));

    // Load bookmarks and highlights
    const savedBookmarks = localStorage.getItem('bible_pwa_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    const savedHighlights = localStorage.getItem('bible_pwa_highlights');
    if (savedHighlights) setHighlights(JSON.parse(savedHighlights));
  }, []);

  // Fetch book scripture text when language or bookId changes
  useEffect(() => {
    setLoading(true);
    setSelectedVerse(null);

    fetch(`/data/${language}/${bookId}.json`)
      .then((res) => res.json())
      .then((data: BookData) => {
        setBookData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load book text offline:', err);
        setLoading(false);
      });
  }, [language, bookId]);

  const currentBook = booksList.find((b) => b.id === bookId);
  const currentBookName = currentBook 
    ? (language === 'en' ? currentBook.nameEn : currentBook.nameTa)
    : '';

  const chapterData = bookData?.chapters.find((c) => c.chapter === chapterNum);

  // Chapter Bookmark Logic
  const isBookmarked = bookmarks.some(
    (b) => b.bookId === bookId && b.chapter === chapterNum
  );

  const toggleBookmark = () => {
    let updated: Bookmark[] = [];
    if (isBookmarked) {
      updated = bookmarks.filter(
        (b) => !(b.bookId === bookId && b.chapter === chapterNum)
      );
    } else {
      const newBookmark: Bookmark = {
        bookId,
        bookName: currentBookName,
        chapter: chapterNum,
        timestamp: Date.now(),
      };
      updated = [newBookmark, ...bookmarks];
    }
    setBookmarks(updated);
    localStorage.setItem('bible_pwa_bookmarks', JSON.stringify(updated));
  };

  // Verse Highlight Logic
  const getVerseHighlight = (vNum: number) => {
    return highlights.find(
      (h) => h.bookId === bookId && h.chapter === chapterNum && h.verse === vNum
    );
  };

  const handleHighlight = (color: 'yellow' | 'blue' | 'green' | 'pink') => {
    if (selectedVerse === null || !chapterData) return;

    const verseText = chapterData.verses.find((v) => v.verse === selectedVerse)?.text || '';
    const highlightId = `${bookId}_${chapterNum}_${selectedVerse}`;
    
    // Remove existing highlight on this verse if any
    const baseList = highlights.filter((h) => h.id !== highlightId);
    
    const newHighlight: Highlight = {
      id: highlightId,
      bookId,
      bookName: currentBookName,
      chapter: chapterNum,
      verse: selectedVerse,
      text: verseText,
      color,
      timestamp: Date.now()
    };

    const updated = [newHighlight, ...baseList];
    setHighlights(updated);
    localStorage.setItem('bible_pwa_highlights', JSON.stringify(updated));
    setSelectedVerse(null);
  };

  const removeHighlight = () => {
    if (selectedVerse === null) return;
    const highlightId = `${bookId}_${chapterNum}_${selectedVerse}`;
    const updated = highlights.filter((h) => h.id !== highlightId);
    setHighlights(updated);
    localStorage.setItem('bible_pwa_highlights', JSON.stringify(updated));
    setSelectedVerse(null);
  };

  // Next & Prev Chapters Routing
  const navigateChapter = (dir: 'next' | 'prev') => {
    if (!currentBook) return;
    
    let targetCh = chapterNum;
    let targetBook = bookId;

    if (dir === 'next') {
      if (chapterNum < currentBook.chapters) {
        targetCh = chapterNum + 1;
      } else {
        // Go to next book chapter 1
        const curIndex = booksList.findIndex((b) => b.id === bookId);
        if (curIndex < booksList.length - 1) {
          targetBook = booksList[curIndex + 1].id;
          targetCh = 1;
        }
      }
    } else {
      if (chapterNum > 1) {
        targetCh = chapterNum - 1;
      } else {
        // Go to prev book last chapter
        const curIndex = booksList.findIndex((b) => b.id === bookId);
        if (curIndex > 0) {
          const prevBook = booksList[curIndex - 1];
          targetBook = prevBook.id;
          targetCh = prevBook.chapters;
        }
      }
    }

    router.push(`/read?book=${targetBook}&chapter=${targetCh}`);
  };

  if (loading || !currentBook) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  const fontClass = fontType === 'serif' ? styles.serif : styles.sans;

  return (
    <div className={`${styles.readerPage} animate-fade`}>
      {/* Reader Nav SubHeader */}
      <div className={styles.subHeader}>
        <Link href="/" className={styles.backBtn} title={t('goBack')}>
          ←
        </Link>
        
        <div className={styles.chapterNav}>
          <button onClick={() => navigateChapter('prev')} className={styles.navArrow} title="Previous Chapter">
            ‹
          </button>
          <div className={styles.titleInfo}>
            <span className={styles.bookTitle}>{currentBookName}</span>
            <span className={styles.chapterBadge}>{t('chapter')} {chapterNum}</span>
          </div>
          <button onClick={() => navigateChapter('next')} className={styles.navArrow} title="Next Chapter">
            ›
          </button>
        </div>

        <button 
          onClick={toggleBookmark} 
          className={`${styles.bookmarkBtn} ${isBookmarked ? styles.isBookmarked : ''}`}
          title={isBookmarked ? t('removeBookmark') : t('bookmarkThisPage')}
        >
          {isBookmarked ? '🔖' : 'bookmark_border'}
        </button>
      </div>

      {/* Reader Main Body */}
      <div className={`${styles.canvas} ${fontClass}`} style={{ fontSize: `${fontSize}px` }}>
        {chapterData ? (
          <div className={styles.versesList}>
            {chapterData.verses.map((verse) => {
              const highlight = getVerseHighlight(verse.verse);
              const isSelected = selectedVerse === verse.verse;

              return (
                <p 
                  key={verse.verse} 
                  className={`${styles.verseRow} ${highlight ? styles[highlight.color] : ''} ${isSelected ? styles.selected : ''}`}
                  onClick={() => setSelectedVerse(isSelected ? null : verse.verse)}
                >
                  <sup className={styles.verseNum}>{verse.verse}</sup>
                  <span className={styles.verseText}>{verse.text}</span>
                </p>
              );
            })}
          </div>
        ) : (
          <div className={styles.errorText}>Failed to load chapter content.</div>
        )}
      </div>

      {/* Interactive Floating Action Drawer for Verse Selection */}
      {selectedVerse !== null && (
        <div className={`${styles.actionDrawer} animate-fade`}>
          <div className={styles.drawerHeader}>
            <span className={styles.drawerTitle}>
              {currentBookName} {chapterNum}:{selectedVerse}
            </span>
            <button onClick={() => setSelectedVerse(null)} className={styles.closeBtn}>
              ✕
            </button>
          </div>
          
          <div className={styles.colorPills}>
            {(['yellow', 'blue', 'green', 'pink'] as const).map((color) => (
              <button
                key={color}
                onClick={() => handleHighlight(color)}
                className={`${styles.colorPill} ${styles[color]}`}
                aria-label={`Highlight ${color}`}
              />
            ))}
          </div>

          {getVerseHighlight(selectedVerse) && (
            <button onClick={removeHighlight} className={styles.clearBtn}>
              🗑️ Remove Color
            </button>
          )}

          <div className={styles.tapTip}>{t('tapVerse')}</div>
        </div>
      )}
    </div>
  );
}

export default function ReaderPage() {
  return (
    <Suspense fallback={
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    }>
      <ReaderContent />
    </Suspense>
  );
}
