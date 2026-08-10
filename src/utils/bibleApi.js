// Bible API Client powered by bible-api.com (free, keyless REST API)

export const TRANSLATIONS = [
  { id: 'web', name: 'World English Bible (WEB)', default: true },
  { id: 'kjv', name: 'King James Version (KJV)' },
  { id: 'bbe', name: 'Bible in Basic English (BBE)' },
  { id: 'clementine', name: 'Clementine Latin Vulgate' }
];

export async function fetchBiblePassage(reference, translation = 'web') {
  if (!reference || !reference.trim()) {
    throw new Error('Please enter a scripture reference (e.g. John 3:16).');
  }

  const cleanRef = reference.trim();
  const url = `https://bible-api.com/${encodeURIComponent(cleanRef)}?translation=${translation}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Passage "${reference}" not found. Please check spelling (e.g. "Psalm 23:1" or "John 3:16").`);
      }
      throw new Error(`Failed to fetch verse. Server returned status ${response.status}.`);
    }

    const data = await response.json();
    if (!data.text) {
      throw new Error(`Could not retrieve verse text for "${reference}".`);
    }

    // Clean up extra whitespace/newlines in fetched text
    const cleanText = data.text.replace(/\s+/g, ' ').trim();

    return {
      reference: data.reference || cleanRef,
      text: cleanText,
      translation: (data.translation_id || translation).toUpperCase(),
      translationName: data.translation_name || translation
    };
  } catch (err) {
    console.error('Bible API fetch error:', err);
    throw err;
  }
}
