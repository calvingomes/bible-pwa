export interface Book {
  id: string;
  nameEn: string;
  nameTa: string;
  testament: 'OT' | 'NT';
  category: 'Pentateuch' | 'Historical' | 'Wisdom' | 'Prophets' | 'Gospels' | 'Acts' | 'Epistles' | 'Revelation';
  chapters: number;
  deuterocanon: boolean;
}

export interface Verse {
  verse: number;
  text: string;
}

export interface Chapter {
  chapter: number;
  verses: Verse[];
}

export interface BookData {
  bookId: string;
  bookName: string;
  language: string;
  chapters: Chapter[];
}

export interface Bookmark {
  bookId: string;
  bookName: string; // Dynamic based on active language when viewing
  chapter: number;
  timestamp: number;
}

export interface Highlight {
  id: string; // Format: "bookId_chapter_verse"
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  color: 'yellow' | 'blue' | 'green' | 'pink';
  timestamp: number;
}
