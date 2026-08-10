import { INITIAL_VERSES } from '../data/initialVerses';

const STORAGE_KEYS = {
  VERSES: 'verse_verses_v1',
  STREAK: 'verse_streak_v1',
  ACTIVITY: 'verse_activity_v1',
  SETTINGS: 'verse_settings_v1',
  THEME: 'verse_theme_v1',
  SOUND: 'verse_sound_v1',
  BOOKMARKS: 'verse_bookmarks_v1',
  USER: 'verse_user_v1'
};

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredUser(user) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (e) {
    console.error('Error saving user storage:', e);
  }
}

export function getStoredVerses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VERSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.VERSES, JSON.stringify(INITIAL_VERSES));
      return INITIAL_VERSES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading verses from storage:', e);
    return INITIAL_VERSES;
  }
}

export function saveVerses(verses) {
  try {
    localStorage.setItem(STORAGE_KEYS.VERSES, JSON.stringify(verses));
  } catch (e) {
    console.error('Error saving verses to storage:', e);
  }
}

export function getStreakData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
    if (!raw) {
      const initial = { count: 1, lastActiveDate: new Date().toISOString().split('T')[0] };
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(initial));
      return initial;
    }
    const data = JSON.parse(raw);
    
    const today = new Date().toISOString().split('T')[0];
    const lastActive = data.lastActiveDate;
    
    if (lastActive === today) {
      return data;
    }
    
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastActive === yesterday) {
      return data;
    } else {
      const resetData = { count: 0, lastActiveDate: lastActive };
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(resetData));
      return resetData;
    }
  } catch (e) {
    return { count: 1, lastActiveDate: new Date().toISOString().split('T')[0] };
  }
}

export function recordPracticeActivity() {
  const today = new Date().toISOString().split('T')[0];
  const streak = getStreakData();
  
  if (streak.lastActiveDate !== today) {
    const newStreak = {
      count: streak.count + 1,
      lastActiveDate: today
    };
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(newStreak));
  }

  try {
    const rawActivity = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    const activity = rawActivity ? JSON.parse(rawActivity) : {};
    activity[today] = (activity[today] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activity));
  } catch (e) {
    console.error('Error updating activity log:', e);
  }
}

export function getActivityHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

// Theme Preferences (light | dark)
export function getThemePreference() {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  } catch (e) {
    return 'light';
  }
}

export function setThemePreference(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    console.error('Error saving theme preference:', e);
  }
}

// Sound FX Preference (true | false)
export function getSoundPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SOUND);
    return stored !== null ? JSON.parse(stored) : true;
  } catch (e) {
    return true;
  }
}

export function setSoundPreference(enabled) {
  try {
    localStorage.setItem(STORAGE_KEYS.SOUND, JSON.stringify(enabled));
  } catch (e) {
    console.error('Error saving sound preference:', e);
  }
}

// JSON Backup Export / Import
export function exportUserDataJSON() {
  const data = {
    version: 1,
    exportDate: new Date().toISOString(),
    verses: getStoredVerses(),
    streak: getStreakData(),
    activity: getActivityHistory(),
    theme: getThemePreference(),
    sound: getSoundPreference()
  };
  return JSON.stringify(data, null, 2);
}

export function importUserDataJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !Array.isArray(parsed.verses)) {
      throw new Error('Invalid JSON format: missing verses array.');
    }
    saveVerses(parsed.verses);
    if (parsed.streak) localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(parsed.streak));
    if (parsed.activity) localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(parsed.activity));
    if (parsed.theme) setThemePreference(parsed.theme);
    if (parsed.sound !== undefined) setSoundPreference(parsed.sound);
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    throw e;
  }
}
