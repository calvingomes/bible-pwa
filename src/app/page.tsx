'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Book } from '@/types/bible';
import { Book as BookIcon, Loader2 } from 'lucide-react';
import styles from './page.module.css';

export default function HomePage() {
  const { language, t } = useLanguage();
  const [books, setBooks] = useState<Book[]>([]);
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'OT' | 'Deuterocanon' | 'NT'>('OT');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load books index catalog from static asset
    fetch('/data/books.json')
      .then((res) => res.json())
      .then((data: Book[]) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load books catalog offline:', err);
        setLoading(false);
      });
  }, []);

  const handleBookClick = (bookId: string) => {
    if (expandedBook === bookId) {
      setExpandedBook(null);
    } else {
      setExpandedBook(bookId);
      // Scroll book card into viewport center smoothly
      setTimeout(() => {
        const el = document.getElementById(`book-card-${bookId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  // Filter books according to tabs
  const getOTBooks = () => books.filter((b) => b.testament === 'OT' && !b.deuterocanon);
  const getDeutBooks = () => books.filter((b) => b.deuterocanon);
  const getNTBooks = () => books.filter((b) => b.testament === 'NT');

  const filteredBooks = () => {
    if (activeTab === 'OT') return getOTBooks();
    if (activeTab === 'Deuterocanon') return getDeutBooks();
    return getNTBooks();
  };

  // Group books by category for detailed subdivisions
  const groupByCategory = (bookList: Book[]) => {
    const groups: Record<string, Book[]> = {};
    bookList.forEach((b) => {
      if (!groups[b.category]) {
        groups[b.category] = [];
      }
      groups[b.category].push(b);
    });
    return groups;
  };

  const currentGroups = groupByCategory(filteredBooks());

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={40} />
      </div>
    );
  }

  return (
    <div className={`${styles.container} animate-fade`}>
      {/* Category Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => { setActiveTab('OT'); setExpandedBook(null); }}
          className={`${styles.tabBtn} ${activeTab === 'OT' ? styles.activeTab : ''}`}
        >
          {t('oldTestament')}
        </button>
        <button
          onClick={() => { setActiveTab('Deuterocanon'); setExpandedBook(null); }}
          className={`${styles.tabBtn} ${activeTab === 'Deuterocanon' ? styles.activeTab : ''}`}
        >
          {t('deuterocanon')}
        </button>
        <button
          onClick={() => { setActiveTab('NT'); setExpandedBook(null); }}
          className={`${styles.tabBtn} ${activeTab === 'NT' ? styles.activeTab : ''}`}
        >
          {t('newTestament')}
        </button>
      </div>

      {/* Book Grid by Category */}
      <div className={styles.catalog}>
        {Object.entries(currentGroups).map(([category, catBooks]) => (
          <div key={category} className={styles.categorySection}>
            <h2 className={styles.categoryHeading}>{t(category as any)}</h2>
            <div className={styles.grid}>
              {catBooks.map((book) => {
                const isExpanded = expandedBook === book.id;
                const bookName = language === 'en' ? book.nameEn : book.nameTa;

                return (
                  <div
                    key={book.id}
                    id={`book-card-${book.id}`}
                    className={`${styles.bookCard} ${isExpanded ? styles.expandedCard : ''}`}
                  >
                    <button
                      onClick={() => handleBookClick(book.id)}
                      className={styles.bookHeader}
                    >
                      <div className={styles.bookHeaderLeft}>
                        <BookIcon className={styles.bookIcon} size={20} />
                        <div className={styles.bookNames}>
                          <span className={styles.bookMainName}>{bookName}</span>
                          {language === 'ta' && (
                            <span className={styles.bookSubName}>{book.nameEn}</span>
                          )}
                          {language === 'en' && (
                            <span className={styles.bookSubName}>{book.nameTa}</span>
                          )}
                        </div>
                      </div>
                      <span className={styles.chaptersCount}>
                        {book.chapters} {t('chapter').toLowerCase()}(s)
                      </span>
                    </button>

                    {isExpanded && (
                      <div className={`${styles.chaptersGrid} animate-fade`}>
                        <h3 className={styles.selectHeading}>{t('selectChapter')}</h3>
                        <div className={styles.chaptersList}>
                          {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => (
                            <Link
                              key={ch}
                              href={`/read?book=${book.id}&chapter=${ch}`}
                              className={styles.chapterBtn}
                            >
                              {ch}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
