const fs = require('fs');
const path = require('path');

const books = [
  // Old Testament - Pentateuch
  { id: "gen", nameEn: "Genesis", nameTa: "தொடக்க நூல்", testament: "OT", category: "Pentateuch", chapters: 50, deuterocanon: false },
  { id: "exo", nameEn: "Exodus", nameTa: "விடுதலைப் பயணம்", testament: "OT", category: "Pentateuch", chapters: 40, deuterocanon: false },
  { id: "lev", nameEn: "Leviticus", nameTa: "லேவியர்", testament: "OT", category: "Pentateuch", chapters: 27, deuterocanon: false },
  { id: "num", nameEn: "Numbers", nameTa: "எண்ணிக்கை", testament: "OT", category: "Pentateuch", chapters: 36, deuterocanon: false },
  { id: "deu", nameEn: "Deuteronomy", nameTa: "இணைச் சட்டம்", testament: "OT", category: "Pentateuch", chapters: 34, deuterocanon: false },

  // OT - Historical
  { id: "jos", nameEn: "Joshua", nameTa: "யோசுவா", testament: "OT", category: "Historical", chapters: 24, deuterocanon: false },
  { id: "jdg", nameEn: "Judges", nameTa: "நீதித் தலைவர்கள்", testament: "OT", category: "Historical", chapters: 21, deuterocanon: false },
  { id: "rut", nameEn: "Ruth", nameTa: "ரூத்", testament: "OT", category: "Historical", chapters: 4, deuterocanon: false },
  { id: "1sa", nameEn: "1 Samuel", nameTa: "1 சாமுவேல்", testament: "OT", category: "Historical", chapters: 31, deuterocanon: false },
  { id: "2sa", nameEn: "2 Samuel", nameTa: "2 சாமுவேல்", testament: "OT", category: "Historical", chapters: 24, deuterocanon: false },
  { id: "1ki", nameEn: "1 Kings", nameTa: "1 அரசர்கள்", testament: "OT", category: "Historical", chapters: 22, deuterocanon: false },
  { id: "2ki", nameEn: "2 Kings", nameTa: "2 அரசர்கள்", testament: "OT", category: "Historical", chapters: 25, deuterocanon: false },
  { id: "1ch", nameEn: "1 Chronicles", nameTa: "1 குறிப்பேடு", testament: "OT", category: "Historical", chapters: 29, deuterocanon: false },
  { id: "2ch", nameEn: "2 Chronicles", nameTa: "2 குறிப்பேடு", testament: "OT", category: "Historical", chapters: 36, deuterocanon: false },
  { id: "ezr", nameEn: "Ezra", nameTa: "எஸ்ரா", testament: "OT", category: "Historical", chapters: 10, deuterocanon: false },
  { id: "neh", nameEn: "Nehemiah", nameTa: "நெகேமியா", testament: "OT", category: "Historical", chapters: 13, deuterocanon: false },
  
  // Deuterocanonical in OT Historical
  { id: "tob", nameEn: "Tobit", nameTa: "தோபித்து", testament: "OT", category: "Historical", chapters: 14, deuterocanon: true },
  { id: "jdt", nameEn: "Judith", nameTa: "யூதித்து", testament: "OT", category: "Historical", chapters: 16, deuterocanon: true },
  { id: "est", nameEn: "Esther", nameTa: "எஸ்தர்", testament: "OT", category: "Historical", chapters: 10, deuterocanon: false }, // with deuterocanon additions inside
  { id: "1ma", nameEn: "1 Maccabees", nameTa: "1 மக்கபேயர்", testament: "OT", category: "Historical", chapters: 16, deuterocanon: true },
  { id: "2ma", nameEn: "2 Maccabees", nameTa: "2 மக்கபேயர்", testament: "OT", category: "Historical", chapters: 15, deuterocanon: true },

  // OT - Wisdom
  { id: "job", nameEn: "Job", nameTa: "யோபு", testament: "OT", category: "Wisdom", chapters: 42, deuterocanon: false },
  { id: "psa", nameEn: "Psalms", nameTa: "திருப்பாடல்கள்", testament: "OT", category: "Wisdom", chapters: 150, deuterocanon: false },
  { id: "pro", nameEn: "Proverbs", nameTa: "நீதிமொழிகள்", testament: "OT", category: "Wisdom", chapters: 31, deuterocanon: false },
  { id: "ecc", nameEn: "Ecclesiastes", nameTa: "சபை உரையாளர்", testament: "OT", category: "Wisdom", chapters: 12, deuterocanon: false },
  { id: "sng", nameEn: "Song of Songs", nameTa: "உன்னதப் பாட்டு", testament: "OT", category: "Wisdom", chapters: 8, deuterocanon: false },
  
  // Deuterocanonical in OT Wisdom
  { id: "wis", nameEn: "Wisdom of Solomon", nameTa: "சாலமோனின் ஞானம்", testament: "OT", category: "Wisdom", chapters: 19, deuterocanon: true },
  { id: "sir", nameEn: "Sirach", nameTa: "சீராக்", testament: "OT", category: "Wisdom", chapters: 51, deuterocanon: true },

  // OT - Prophets
  { id: "isa", nameEn: "Isaiah", nameTa: "எசாயா", testament: "OT", category: "Prophets", chapters: 66, deuterocanon: false },
  { id: "jer", nameEn: "Jeremiah", nameTa: "எரேமியா", testament: "OT", category: "Prophets", chapters: 52, deuterocanon: false },
  { id: "lam", nameEn: "Lamentations", nameTa: "புலம்பல்", testament: "OT", category: "Prophets", chapters: 5, deuterocanon: false },
  
  // Deuterocanonical in OT Prophets
  { id: "bar", nameEn: "Baruch", nameTa: "பாரூக்", testament: "OT", category: "Prophets", chapters: 6, deuterocanon: true },
  
  { id: "ezk", nameEn: "Ezekiel", nameTa: "எசேக்கியேல்", testament: "OT", category: "Prophets", chapters: 48, deuterocanon: false },
  { id: "dan", nameEn: "Daniel", nameTa: "தானியேல்", testament: "OT", category: "Prophets", chapters: 14, deuterocanon: false }, // 14 chapters in RC (including Susanna & Bel)
  { id: "hos", nameEn: "Hosea", nameTa: "ஓசேயா", testament: "OT", category: "Prophets", chapters: 14, deuterocanon: false },
  { id: "joe", nameEn: "Joel", nameTa: "யோவேல்", testament: "OT", category: "Prophets", chapters: 4, deuterocanon: false },
  { id: "amo", nameEn: "Amos", nameTa: "ஆமோஸ்", testament: "OT", category: "Prophets", chapters: 9, deuterocanon: false },
  { id: "oba", nameEn: "Obadiah", nameTa: "ஒபதியா", testament: "OT", category: "Prophets", chapters: 1, deuterocanon: false },
  { id: "jon", nameEn: "Jonah", nameTa: "யோனா", testament: "OT", category: "Prophets", chapters: 4, deuterocanon: false },
  { id: "mic", nameEn: "Micah", nameTa: "மீக்கா", testament: "OT", category: "Prophets", chapters: 7, deuterocanon: false },
  { id: "nah", nameEn: "Nahum", nameTa: "நாகூம்", testament: "OT", category: "Prophets", chapters: 3, deuterocanon: false },
  { id: "hab", nameEn: "Habakkuk", nameTa: "அபகூக்", testament: "OT", category: "Prophets", chapters: 3, deuterocanon: false },
  { id: "zep", nameEn: "Zephaniah", nameTa: "செப்பனியா", testament: "OT", category: "Prophets", chapters: 3, deuterocanon: false },
  { id: "hag", nameEn: "Haggai", nameTa: "ஆகாய்", testament: "OT", category: "Prophets", chapters: 2, deuterocanon: false },
  { id: "zec", nameEn: "Zechariah", nameTa: "செக்கரியா", testament: "OT", category: "Prophets", chapters: 14, deuterocanon: false },
  { id: "mal", nameEn: "Malachi", nameTa: "மலாக்கி", testament: "OT", category: "Prophets", chapters: 3, deuterocanon: false },

  // New Testament - Gospels
  { id: "mat", nameEn: "Matthew", nameTa: "மத்தேயு", testament: "NT", category: "Gospels", chapters: 28, deuterocanon: false },
  { id: "mrk", nameEn: "Mark", nameTa: "மாற்கு", testament: "NT", category: "Gospels", chapters: 16, deuterocanon: false },
  { id: "luk", nameEn: "Luke", nameTa: "ลூக்கா", nameTa: "லூக்கா", testament: "NT", category: "Gospels", chapters: 24, deuterocanon: false },
  { id: "jhn", nameEn: "John", nameTa: "யோவான்", testament: "NT", category: "Gospels", chapters: 21, deuterocanon: false },

  // NT - Acts
  { id: "act", nameEn: "Acts of the Apostles", nameTa: "திருத்தூதர் பணிகள்", testament: "NT", category: "Acts", chapters: 28, deuterocanon: false },

  // NT - Epistles
  { id: "rom", nameEn: "Romans", nameTa: "உரோமையர்", testament: "NT", category: "Epistles", chapters: 16, deuterocanon: false },
  { id: "1co", nameEn: "1 Corinthians", nameTa: "1 கொரிந்தியர்", testament: "NT", category: "Epistles", chapters: 16, deuterocanon: false },
  { id: "2co", nameEn: "2 Corinthians", nameTa: "2 கொரிந்தியர்", testament: "NT", category: "Epistles", chapters: 13, deuterocanon: false },
  { id: "gal", nameEn: "Galatians", nameTa: "கலாத்தியர்", testament: "NT", category: "Epistles", chapters: 6, deuterocanon: false },
  { id: "eph", nameEn: "Ephesians", nameTa: "எபேசியர்", testament: "NT", category: "Epistles", chapters: 6, deuterocanon: false },
  { id: "php", nameEn: "Philippians", nameTa: "பிலிப்பியர்", testament: "NT", category: "Epistles", chapters: 4, deuterocanon: false },
  { id: "col", nameEn: "Colossians", nameTa: "கொலோசையர்", testament: "NT", category: "Epistles", chapters: 4, deuterocanon: false },
  { id: "1th", nameEn: "1 Thessalonians", nameTa: "1 தெசலோனிக்கர்", testament: "NT", category: "Epistles", chapters: 5, deuterocanon: false },
  { id: "2th", nameEn: "2 Thessalonians", nameTa: "2 தெசலோனிக்கர்", testament: "NT", category: "Epistles", chapters: 3, deuterocanon: false },
  { id: "1ti", nameEn: "1 Timothy", nameTa: "1 திமொத்தேயு", testament: "NT", category: "Epistles", chapters: 6, deuterocanon: false },
  { id: "2ti", nameEn: "2 Timothy", nameTa: "2 திமொத்தேயு", testament: "NT", category: "Epistles", chapters: 4, deuterocanon: false },
  { id: "tit", nameEn: "Titus", nameTa: "தீத்து", testament: "NT", category: "Epistles", chapters: 3, deuterocanon: false },
  { id: "phm", nameEn: "Philemon", nameTa: "பிலமோன்", testament: "NT", category: "Epistles", chapters: 1, deuterocanon: false },
  { id: "heb", nameEn: "Hebrews", nameTa: "எபிரேயர்", testament: "NT", category: "Epistles", chapters: 13, deuterocanon: false },
  { id: "jas", nameEn: "James", nameTa: "யாக்கோபு", testament: "NT", category: "Epistles", chapters: 5, deuterocanon: false },
  { id: "1pe", nameEn: "1 Peter", nameTa: "1 பேதுரு", testament: "NT", category: "Epistles", chapters: 5, deuterocanon: false },
  { id: "2pe", nameEn: "2 Peter", nameTa: "2 பேதுரு", testament: "NT", category: "Epistles", chapters: 3, deuterocanon: false },
  { id: "1jn", nameEn: "1 John", nameTa: "1 யோவான்", testament: "NT", category: "Epistles", chapters: 5, deuterocanon: false },
  { id: "2jn", nameEn: "2 John", nameTa: "2 யோவான்", testament: "NT", category: "Epistles", chapters: 1, deuterocanon: false },
  { id: "3jn", nameEn: "3 John", nameTa: "3 யோவான்", testament: "NT", category: "Epistles", chapters: 1, deuterocanon: false },
  { id: "jde", nameEn: "Jude", nameTa: "யூதா", testament: "NT", category: "Epistles", chapters: 1, deuterocanon: false },

  // NT - Revelation
  { id: "rev", nameEn: "Revelation", nameTa: "திருவெளிப்பாடு", testament: "NT", category: "Revelation", chapters: 22, deuterocanon: false }
];

const dataPath = path.join(__dirname, '../public/data');
const enPath = path.join(dataPath, 'en');
const taPath = path.join(dataPath, 'ta');

// Ensure directories exist
fs.mkdirSync(dataPath, { recursive: true });
fs.mkdirSync(enPath, { recursive: true });
fs.mkdirSync(taPath, { recursive: true });

// Write books.json catalog
fs.writeFileSync(path.join(dataPath, 'books.json'), JSON.stringify(books, null, 2));
console.log('Successfully wrote books.json');

// English sample verses generator
const getEnVerses = (bookName, chapter, numVerses = 10) => {
  const verses = [];
  for (let v = 1; v <= numVerses; v++) {
    verses.push({
      verse: v,
      text: `This is the scripture text for ${bookName} Chapter ${chapter} Verse ${v} of the Holy Catholic Bible in English.`
    });
  }
  return verses;
};

// Tamil sample verses generator
const getTaVerses = (bookNameTa, chapter, numVerses = 10) => {
  const verses = [];
  for (let v = 1; v <= numVerses; v++) {
    verses.push({
      verse: v,
      text: `இது கத்தோலிக்க திருவிவிலியத்தில் ${bookNameTa} நூல் அதிகாரம் ${chapter} வசனம் ${v} இன் தமிழ் மொழிபெயர்ப்பு மாதிரி உரை ஆகும்.`
    });
  }
  return verses;
};

// Generate each book file
books.forEach(book => {
  const enBook = {
    bookId: book.id,
    bookName: book.nameEn,
    language: "en",
    chapters: []
  };

  const taBook = {
    bookId: book.id,
    bookName: book.nameTa,
    language: "ta",
    chapters: []
  };

  // We generate up to the book's chapter count. 
  // To keep size extremely lightweight, each chapter has 10 verses for dummy testing.
  for (let ch = 1; ch <= book.chapters; ch++) {
    enBook.chapters.push({
      chapter: ch,
      verses: getEnVerses(book.nameEn, ch, 10)
    });

    taBook.chapters.push({
      chapter: ch,
      verses: getTaVerses(book.nameTa, ch, 10)
    });
  }

  // Write EN
  fs.writeFileSync(path.join(enPath, `${book.id}.json`), JSON.stringify(enBook, null, 2));
  // Write TA
  fs.writeFileSync(path.join(taPath, `${book.id}.json`), JSON.stringify(taBook, null, 2));
});

console.log('Successfully generated 73 books dummy data in English and Tamil!');
