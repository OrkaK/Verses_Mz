# Implementation Plan - Lumina Verse (Bible Verse Memorization App)

Build a warm, human-centric, mobile-responsive web app called **Lumina Verse** designed to help users interactively memorize Bible verses through multiple engaging learning modes (Fill-in-the-Blanks, First-Letter Prompts, Word Scramble Puzzles, Audio Read-Aloud, and Spaced Repetition Flashcards).

## User Review Required

> [!IMPORTANT]
> **Design & Aesthetic Direction**:
> - **Color Palette**: Warm Sand background (`#FDFBF7`), Deep Slate Charcoal text (`#1E293B`), Warm Terracotta (`#C87D55`) and Olive Sage (`#556B2F`) accents, and subtle warm borders (`#EAE3D9`).
> - **Typography**: Playfair Display (Serif) for scripture headings & verse cards; Plus Jakarta Sans (Sans-Serif) for UI controls and stats.
> - **Strict Constraints**: No glassmorphism, no nested cards, no purple accents, no generic placeholder graphics. Micro-interactions limited to functional feedback.
> - **Workspace Recommendation**: We will create the project inside `/Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer`. You can set this as your active workspace.

---

## Proposed Changes

### Setup & Foundation

#### [NEW] [package.json](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/package.json)
- Project manifest specifying React 18, Vite, Lucide React icons, and canvas-confetti for mastery celebrations.

#### [NEW] [index.html](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/index.html)
- Main HTML entry point loading Google Fonts (`Playfair Display` and `Plus Jakarta Sans`), responsive viewport meta tags, and SEO tags.

#### [NEW] [src/index.css](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/src/index.css)
- CSS design system: custom properties for colors, typography scales, container queries, touch target sizing, micro-animations, and mobile responsive media queries.

---

### Core Data & Storage Layer

#### [NEW] [src/data/initialVerses.js](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/src/data/initialVerses.js)
- Comprehensive pre-loaded library of key Bible verses categorized by theme (Peace, Faith, Strength, Wisdom, Psalms, Comfort, Hope).

#### [NEW] [src/utils/storage.js](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/src/utils/storage.js)
- LocalStorage wrapper to manage user custom verses, progress, SRS review dates, daily practice streaks, and settings.

#### [NEW] [src/utils/srs.js](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/src/utils/srs.js)
- SuperMemo-2 (SM-2) spaced repetition algorithm calculation helper for card review scheduling.

---

### Components & Memorization Modes

#### [NEW] [src/components/Navigation.jsx](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/src/components/Navigation.jsx)
- Responsive navigation: Mobile bottom navigation bar + Desktop side panel navigation.

#### [NEW] [src/components/FillInBlanks.jsx](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/src/components/FillInBlanks.jsx)
- Cloze memorization mode: customizable difficulty percentage, interactive word inputs, instant validation, and hint buttons.

#### [NEW] [src/components/FirstLetterPrompt.jsx](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/src/components/FirstLetterPrompt.jsx)
- First-letter recall mode: displays initial letters of verse words; user types or taps the letters to reveal words sequentially.

#### [NEW] [src/components/WordScramble.jsx](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/src/components/WordScramble.jsx)
- Interactive puzzle mode: tap or drag scrambled word chips to reconstruct the verse in proper order.

#### [NEW] [src/components/FlashcardSRS.jsx](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/src/components/FlashcardSRS.jsx)
- Interactive 3D card flip with recall rating buttons (Again, Hard, Good, Easy) adjusting SRS intervals.

#### [NEW] [src/components/AudioPlayer.jsx](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/src/components/AudioPlayer.jsx)
- SpeechSynthesis audio player with speed controls (0.75x - 1.25x) and word-by-word karaoke text highlighting.

#### [NEW] [src/components/VerseLibrary.jsx](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/src/components/VerseLibrary.jsx)
- Searchable & filterable library view, collection badges, custom verse creator modal, and mastery progress meters.

#### [NEW] [src/components/DashboardStats.jsx](file:///Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer/src/components/DashboardStats.jsx)
- Daily streak counter, streak activity heat calendar, mastery breakdown (New, Learning, Mastered), and recommended daily review items.

---

## Verification Plan

### Automated Verification
- Verify build via `npm run build` in `/Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer`.
- Verify dev server launch via `npm run dev`.

### Manual & Visual Verification
- Use `browser_subagent` to test mobile viewport (375x812 iPhone view) and desktop viewport (1280x800).
- Test interactive memorization flows: Fill-in-the-Blanks, First-Letter Prompts, Word Scramble, Flashcard flips, and adding custom verses.
