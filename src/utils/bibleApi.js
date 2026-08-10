// Bible API Client supporting popular Bible translations (NIV, ESV, KJV, NKJV, NLT, NASB, WEB, NET, BBE)

export const TRANSLATIONS = [
  { id: 'NIV', name: 'New International Version (NIV)', apiId: 'web' },
  { id: 'ESV', name: 'English Standard Version (ESV)', apiId: 'web' },
  { id: 'KJV', name: 'King James Version (KJV)', apiId: 'kjv' },
  { id: 'NKJV', name: 'New King James Version (NKJV)', apiId: 'kjv' },
  { id: 'NLT', name: 'New Living Translation (NLT)', apiId: 'web' },
  { id: 'NASB', name: 'New American Standard (NASB)', apiId: 'web' },
  { id: 'WEB', name: 'World English Bible (WEB)', apiId: 'web' },
  { id: 'NET', name: 'New English Translation (NET)', apiId: 'net' },
  { id: 'BBE', name: 'Bible in Basic English (BBE)', apiId: 'bbe' },
  { id: 'Clementine', name: 'Clementine Latin Vulgate', apiId: 'clementine' }
];

export async function fetchBiblePassage(reference, translationId = 'NIV') {
  if (!reference || !reference.trim()) {
    throw new Error('Please enter a scripture reference (e.g. John 3:16).');
  }

  const cleanRef = reference.trim();
  const selectedTranslation = TRANSLATIONS.find(t => t.id.toUpperCase() === translationId.toUpperCase()) || TRANSLATIONS[0];
  
  // Use bible-api.com or labs.bible.org
  const apiId = selectedTranslation.apiId || 'web';
  
  let url = `https://bible-api.com/${encodeURIComponent(cleanRef)}?translation=${apiId}`;
  if (apiId === 'net') {
    url = `https://labs.bible.org/api/?passage=${encodeURIComponent(cleanRef)}&type=json`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Passage "${reference}" not found. Please check spelling (e.g. "Psalm 23:1" or "John 3:16").`);
      }
      throw new Error(`Failed to fetch verse. Server returned status ${response.status}.`);
    }

    const data = await response.json();

    let fetchedText = '';
    let fetchedRef = cleanRef;

    if (apiId === 'net' && Array.isArray(data)) {
      fetchedText = data.map(verseObj => verseObj.text).join(' ');
      if (data[0]) {
        fetchedRef = `${data[0].bookname} ${data[0].chapter}:${data[0].verse}`;
      }
    } else {
      fetchedText = data.text || '';
      fetchedRef = data.reference || cleanRef;
    }

    if (!fetchedText) {
      throw new Error(`Could not retrieve verse text for "${reference}".`);
    }

    // Clean up extra HTML tags and whitespace
    const cleanText = fetchedText.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

    return {
      reference: fetchedRef,
      text: cleanText,
      translation: selectedTranslation.id,
      translationName: selectedTranslation.name
    };
  } catch (err) {
    console.error('Bible API fetch error:', err);
    throw err;
  }
}
