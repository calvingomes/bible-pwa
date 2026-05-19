'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Book, BookData, Verse } from '@/types/bible';
import styles from './page.module.css';

interface SearchResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

// In-memory cache of bible text files to keep multiple searches instantaneous
const bibleCache: Record<string, BookData> = {};

export default function SearchPage() {
  const { language, t } = useLanguage();
  const [booksList, setBooksList] = useState<Book[]>([]);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetch('/data/books.json')
      .then((res) => res.json())
      .then((data: Book[]) => setBooksList(data))
      .catch((err) => console.error('Failed to load books index:', err));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || booksList.length === 0) return;

    setIsSearching(true);
    setProgress(0);
    setResults([]);
    setHasSearched(true);

    const matches: SearchResult[] = [];
    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

    // Limit search results to avoid freezing the browser on very short words (e.g. "the")
    const maxResults = 100;

    for (let i = 0; i < booksList.length; i++) {
      const book = booksList[i];
      const bookName = language === 'en' ? book.nameEn : book.nameTa;
      const cacheKey = `${language}_${book.id}`;

      let bookData: BookData;

      // Use memory cache if already fetched
      if (bibleCache[cacheKey]) {
        bookData = bibleCache[cacheKey];
      } else {
        try {
          const res = await fetch(`/data/${language}/${book.id}.json`);
          bookData = await res.json();
          bibleCache[cacheKey] = bookData;
        } catch (err) {
          console.error(`Failed to fetch ${book.id} in search:`, err);
          continue;
        }
      }

      // Scan chapters and verses
      for (const ch of bookData.chapters) {
        for (const v of ch.verses) {
          const verseTextLower = v.text.toLowerCase();
          
          // Match all search terms (AND search)
          const isMatch = searchTerms.every(term => verseTextLower.includes(term));

          if (isMatch) {
            matches.push({
              bookId: book.id,
              bookName,
              chapter: ch.chapter,
              verse: v.verse,
              text: v.text
            });

            if (matches.length >= maxResults) {
              break;
            }
          }
        }
        if (matches.length >= maxResults) break;
      }

      // Update progress bar
      setProgress(Math.round(((i + 1) / booksList.length) * 100));
      
      if (matches.length >= maxResults) break;
    }

    setResults(matches);
    setIsSearching(false);
  };

  const highlightKeyword = (text: string, keyword: string) => {
    if (!keyword) return <span>{text}</span>;
    
    // Escape regex characters
    const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedKeyword})`, 'gi'));
    
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === keyword.toLowerCase() ? (
            <mark key={index} className={styles.highlight}>{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className={`${styles.searchPage} animate-fade`}>
      {/* Search Input Box Form */}
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className={styles.searchInput}
            disabled={isSearching}
            autoFocus
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery('')} 
              className={styles.clearBtn}
              title={t('clearSearch')}
            >
              ✕
            </button>
          )}
        </div>
        <button 
          type="submit" 
          className={styles.searchSubmit}
          disabled={isSearching || !query.trim()}
        >
          {t('search')}
        </button>
      </form>

      {/* Progress bar during live client search */}
      {isSearching && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          <span className={styles.progressText}>
            Searching... {progress}%
          </span>
        </div>
      )}

      {/* Search Results Summary & Listings */}
      <div className={styles.resultsArea}>
        {hasSearched && !isSearching && (
          <div className={styles.resultsHeader}>
            {results.length > 0 
              ? t('searchResultsCount', { count: results.length }) 
              : t('noResults')}
          </div>
        )}

        <div className={styles.resultsList}>
          {results.map((res, index) => (
            <Link
              key={index}
              href={`/read?book=${res.bookId}&chapter=${res.chapter}`}
              className={styles.resultCard}
            >
              <div className={styles.resultMeta}>
                <span className={styles.resultBook}>{res.bookName}</span>
                <span className={styles.resultLocation}>
                  {t('chapter')} {res.chapter}:{res.verse}
                </span>
              </div>
              <p className={styles.resultText}>
                {highlightKeyword(res.text, query)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
