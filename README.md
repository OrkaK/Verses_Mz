# Verse

An interactive web application for reading, practicing, and memorizing Bible scriptures. Built with React and Vite.

## Why Verse?

Memorizing scripture can be tough when you're just looking at plain text. **Verse** gives you interactive tools—fill-in-the-blanks, first-letter prompts, word scrambles, spaced repetition flashcards, and quick memory games—so you can internalize verses at your own pace.

## Key Features

- **Multi-Translation Support**: Easily lookup and switch passages between NIV, ESV, KJV, NKJV, NLT, NASB, WEB, NET, and BBE.
- **6 Memorization Modes**:
  - **Fill in the Blanks**: Test your recall with customizable missing words and hints.
  - **First-Letter Prompt**: Practice recalling entire verses using initial letter cues.
  - **Word Scramble**: Unscramble shuffled word blocks into the correct order.
  - **Spaced Repetition Flashcards**: Review cards based on the SM-2 SRS algorithm.
  - **Memory Match**: Pair scripture references with their corresponding text tiles.
  - **Scripture Quiz**: Multiple-choice trivia for quick reference checks.
- **Audio Recitation**: Listen to word-by-word audio pronunciations using built-in speech synthesis.
- **Shareable Cards**: Generate and download formatted scripture cards or copy text to share with friends.
- **Light & Dark Themes**: Includes a warm parchment theme and a dark mode.
- **Offline First**: All your verses and streak data are saved locally in your browser. Optional cloud sync is available if you want to back up across devices.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Verse.git
cd Verse

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open `http://localhost:3001` in your browser to view the app.

## Building for Production

```bash
npm run build
```

The output files will be generated in the `dist` folder.

## Deploying to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select your `Verse` repository.
4. Leave the build command as `npm run build` and output directory as `dist`.
5. Click **Deploy**.

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Vanilla CSS with custom design tokens
- **Icons**: Lucide React
- **Scripture API**: Bolls Bible API & Bible-API.com
- **Animations & Effects**: Canvas Confetti
