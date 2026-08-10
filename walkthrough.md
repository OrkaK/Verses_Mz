# Walkthrough - Lumina Verse (Bible Verse Memorization App)

We have created and enhanced **Lumina Verse**, a human-centric, mobile-responsive web app designed to help users interactively memorize Bible verses through multiple engaging techniques and games.

---

## 🎮 Interactive Practice & Game Modes

1. **🎮 Reference & Verse Memory Match:**
   * Flip-card memory matching grid.
   * Pair up passage references (e.g. *"Philippians 4:6-7"*) with their corresponding scripture text snippets.
   * Tracks total moves, flip pairs, match animations, and celebratory confetti upon clearing the grid.

2. **🏆 Scripture Reference Trivia Quiz:**
   * Fast-paced 5-question trivia challenge.
   * Dynamically generates two question types:
     - *Given Scripture Text -> Choose matching Reference*
     - *Given Reference -> Choose matching Scripture Text*
   * Instant green/red visual feedback, score tally, and round breakdown.

3. **🧠 Fill-in-the-Blanks (Cloze Test):**
   * Dynamically blanks out words based on difficulty (Easy 25%, Medium 50%, Hard 75%) with instant validation and hints.

4. **🔤 First-Letter Prompt:**
   * Displays initial letters of each word in the passage. Users type or tap the first letter of each word to build memory pathways.

5. **🧩 Word Scramble Puzzle:**
   * Shuffles scripture words into interactive chips that users tap to reconstruct the verse in proper sequence.

6. **🔊 Audio Recitation Mode:**
   * Integrated SpeechSynthesis API with speed control (0.75x–1.1x) and word-by-word karaoke text highlighting.

7. **🎴 Flashcards & Spaced Repetition (SRS):**
   * Interactive### 3D Flashcard Flip & Layout Alignment Fix
- **Issue Resolved**: Fixed 3D transform origin and absolute bounding on `.flashcard-front` and `.flashcard-back` faces, ensuring the flipped card stays perfectly aligned inside its 240px frame without overflowing into rating controls.
- **Verification**: Verified using interactive browser subagent. The back face renders cleanly with clear vertical margin above the recall rating buttons.

![Flipped Flashcard Back Face](/Users/orkakalds/.gemini/antigravity-ide/brain/a7750d83-8631-4a9f-ab01-becd8081fdf0/flipped_flashcard_back_1786328788923.png)


<!-- slide -->
![Scripture Trivia Quiz](/Users/orkakalds/.gemini/antigravity-ide/brain/a7750d83-8631-4a9f-ab01-becd8081fdf0/scripture_quiz_question_1786133257573.png)
<!-- slide -->
![Desktop Dashboard](/Users/orkakalds/.gemini/antigravity-ide/brain/a7750d83-8631-4a9f-ab01-becd8081fdf0/desktop_sidebar_dashboard_1786132993272.png)
<!-- slide -->
![Mobile Layout & Bottom Navigation](/Users/orkakalds/.gemini/antigravity-ide/brain/a7750d83-8631-4a9f-ab01-becd8081fdf0/mobile_dashboard_1786132967352.png)
````

---

## 🚀 How to Access & Run locally

The dev server is running live at:
👉 **[http://localhost:3001/](http://localhost:3001/)**

To run or modify the code in the future:
```bash
# Workspace location:
cd /Users/orkakalds/.gemini/antigravity-ide/scratch/bible-verse-memorizer

# Start local server:
npm run dev -- --port 3001
```
