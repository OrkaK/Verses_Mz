// Bible API Client supporting authentic text for NIV, ESV, NKJV, NLT, NASB, KJV, WEB, NET, BBE

export const TRANSLATIONS = [
  { id: 'NIV', name: 'New International Version (NIV)', bollsId: 'NIV' },
  { id: 'ESV', name: 'English Standard Version (ESV)', bollsId: 'ESV' },
  { id: 'KJV', name: 'King James Version (KJV)', bollsId: 'KJV' },
  { id: 'NKJV', name: 'New King James Version (NKJV)', bollsId: 'NKJV' },
  { id: 'NLT', name: 'New Living Translation (NLT)', bollsId: 'NLT' },
  { id: 'NASB', name: 'New American Standard (NASB)', bollsId: 'NASB' },
  { id: 'WEB', name: 'World English Bible (WEB)', bollsId: 'WEB' },
  { id: 'NET', name: 'New English Translation (NET)', bollsId: 'NET' },
  { id: 'BBE', name: 'Bible in Basic English (BBE)', bollsId: 'BBE' }
];

const BIBLE_BOOKS = {
  'genesis': 1, 'gen': 1, 'exodus': 2, 'exod': 2, 'leviticus': 3, 'lev': 3, 'numbers': 4, 'num': 4, 'deuteronomy': 5, 'deut': 5,
  'joshua': 6, 'josh': 6, 'judges': 7, 'judg': 7, 'ruth': 8, '1 samuel': 9, '1sam': 9, '2 samuel': 10, '2sam': 10,
  '1 kings': 11, '1kings': 11, '2 kings': 12, '2kings': 12, '1 chronicles': 13, '1chron': 13, '2 chronicles': 14, '2chron': 14,
  'ezra': 15, 'nehemiah': 16, 'neh': 16, 'esther': 17, 'job': 18, 'psalm': 19, 'psalms': 19, 'proverbs': 20, 'prov': 20,
  'ecclesiastes': 21, 'eccl': 21, 'song of solomon': 22, 'song': 22, 'isaiah': 23, 'isa': 23, 'jeremiah': 24, 'jer': 24,
  'lamentations': 25, 'lam': 25, 'ezekiel': 26, 'ezek': 26, 'daniel': 27, 'dan': 27, 'hosea': 28, 'joel': 29, 'amos': 30,
  'obadiah': 31, 'jonah': 32, 'micah': 33, 'nahum': 34, 'habakkuk': 35, 'zephaniah': 36, 'haggai': 37, 'zechariah': 38, 'malachi': 39,
  'matthew': 40, 'matt': 40, 'mark': 41, 'luke': 42, 'john': 43, 'jhn': 43, 'acts': 44, 'romans': 45, 'rom': 45,
  '1 corinthians': 46, '1cor': 46, '2 corinthians': 47, '2cor': 47, 'galatians': 48, 'gal': 48, 'ephesians': 49, 'eph': 49,
  'philippians': 50, 'phil': 50, 'colossians': 51, 'col': 51, '1 thessalonians': 52, '1thess': 52, '2 thessalonians': 53, '2thess': 53,
  '1 timothy': 54, '1tim': 54, '2 timothy': 55, '2tim': 55, 'titus': 56, 'philemon': 57, 'hebrews': 58, 'heb': 58,
  'james': 59, 'jas': 59, '1 peter': 60, '1pet': 60, '2 peter': 61, '2pet': 61, '1 john': 62, '1jhn': 62, '2 john': 63, '3 john': 64,
  'jude': 65, 'revelation': 66, 'rev': 66
};

function parseReference(ref) {
  const match = ref.trim().match(/^((?:\d\s+)?[a-zA-Z\s]+)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) return null;
  const bookName = match[1].trim().toLowerCase();
  const bookNum = BIBLE_BOOKS[bookName];
  const chapter = parseInt(match[2], 10);
  const startVerse = parseInt(match[3], 10);
  const endVerse = match[4] ? parseInt(match[4], 10) : startVerse;
  return { bookNum, chapter, startVerse, endVerse };
}

function cleanVerseText(rawText) {
  return rawText
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/\[\d+\]/g, '') // remove footnote brackets like [1]
    .replace(/([a-zA-Z]+)\d+/g, '$1') // remove KJV Strong numbers attached to words (e.g. God2316)
    .replace(/\b\d+\b/g, '') // remove isolated numbers
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchBiblePassage(reference, translationId = 'NIV') {
  if (!reference || !reference.trim()) {
    throw new Error('Please enter a scripture reference (e.g. John 3:16).');
  }

  const cleanRef = reference.trim();
  const trObj = TRANSLATIONS.find(t => t.id.toUpperCase() === translationId.toUpperCase()) || TRANSLATIONS[0];
  const bollsId = trObj.bollsId || 'NIV';

  const parsed = parseReference(cleanRef);

  // Method 1: Try Bolls API for exact translation text
  if (parsed && parsed.bookNum) {
    try {
      let fetchedText = '';
      if (parsed.startVerse === parsed.endVerse) {
        const url = `https://bolls.life/get-verse/${bollsId}/${parsed.bookNum}/${parsed.chapter}/${parsed.startVerse}/`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data.text) {
            fetchedText = cleanVerseText(data.text);
          }
        }
      } else {
        const url = `https://bolls.life/get-chapter/${bollsId}/${parsed.bookNum}/${parsed.chapter}/`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const versesInRange = data.filter(v => v.verse >= parsed.startVerse && v.verse <= parsed.endVerse);
            fetchedText = versesInRange.map(v => cleanVerseText(v.text)).join(' ');
          }
        }
      }

      if (fetchedText) {
        return {
          reference: cleanRef,
          text: fetchedText,
          translation: trObj.id,
          translationName: trObj.name
        };
      }
    } catch (e) {
      console.warn('Bolls API fetch failed, falling back to bible-api.com:', e);
    }
  }

  // Method 2: Fallback to bible-api.com (WEB / KJV / BBE)
  try {
    const fallbackId = bollsId.toLowerCase() === 'kjv' ? 'kjv' : bollsId.toLowerCase() === 'bbe' ? 'bbe' : 'web';
    const fallbackUrl = `https://bible-api.com/${encodeURIComponent(cleanRef)}?translation=${fallbackId}`;
    const res = await fetch(fallbackUrl);
    if (!res.ok) {
      throw new Error(`Passage "${reference}" not found. Please check reference formatting.`);
    }

    const data = await res.json();
    const fetchedText = cleanVerseText(data.text || '');

    return {
      reference: data.reference || cleanRef,
      text: fetchedText,
      translation: trObj.id,
      translationName: trObj.name
    };
  } catch (err) {
    console.error('Bible API fetch error:', err);
    throw err;
  }
}
