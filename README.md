# Verse | Interactive Scripture Memorization

**Verse** is a warm, human-centric, mobile-responsive web application designed to help users interactively internalize and memorize Bible scriptures using cognitive learning techniques, interactive games, audio recitation, and spaced repetition (SRS).

---

## 🌟 Key Features

- **📖 Live Bible API Lookup**: Search and auto-fill scripture text directly by reference (`John 3:16`, `Psalm 23:1`, `Romans 12:2`) across multiple translations (`WEB`, `KJV`, `BBE`, `Clementine`).
- **🧠 6 Practice & Game Modes**:
  1. **Fill in the Blanks (Cloze Test)** with hint support & customizable difficulty.
  2. **First-Letter Prompt** for sequential mental recall.
  3. **Word Scramble Puzzle** to reconstruct verses out of shuffled word chips.
  4. **Flashcards & Spaced Repetition (SuperMemo-2 SM-2 algorithm)**.
  5. **🎮 Memory Match Game** to pair passage references with text snippets.
  6. **🏆 Scripture Trivia Quiz** for fast-paced reference testing.
- **🖼️ Shareable Scripture Card Generator**: Custom image generator with 4 visual themes (*Terracotta Sunset*, *Midnight Slate*, *Warm Sand*, *Olive Grove*) for downloading PNG cards or copying quotes.
- **🌙 Light & Dark Mode**: Seamless toggle between Warm Sand light mode and Midnight Slate dark mode.
- **🔊 Procedural Web Audio Sound FX**: Zero-dependency Web Audio synthesizer for subtle card flips and completion chimes.
- **☁️ Guest Mode & Optional Cloud Sync**: 100% free and functional offline in Guest Mode with zero required sign-in; optional cloud account sync for multi-device users.
- **📱 PWA Ready**: Installable on iOS and Android home screens.

---

## 🚀 Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

---

## 🌐 Deploying to Vercel

1. Push your repository to **GitHub**.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your `Verse-mm` repository.
4. Framework Preset: **Vite**
5. Click **Deploy**.

Vercel will automatically build the app using `npm run build` and output directory `dist`.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Audio**: Native Web SpeechSynthesis API + Web Audio Synthesizer
- **Styling**: Vanilla CSS custom properties with responsive mobile-first tokens
