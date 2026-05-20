'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, Search, BookMarked } from 'lucide-react';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: t('books'), icon: <BookOpen size={20} strokeWidth={2} /> },
    { href: '/search', label: t('search'), icon: <Search size={20} strokeWidth={2} /> },
    { href: '/journal', label: t('bookmarks'), icon: <BookMarked size={20} strokeWidth={2} /> }
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/' && pathname.startsWith('/read'));
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
