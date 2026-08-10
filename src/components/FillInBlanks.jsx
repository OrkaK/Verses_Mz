import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle2, RefreshCw, Lightbulb, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessSound, playVictorySound } from '../utils/audioEffects';

export default function FillInBlanks({ verse, onComplete, soundEnabled = true }) {
  const [difficulty, setDifficulty] = useState('medium'); // 'easy' (25%), 'medium' (50%), 'hard' (75%)
  const [parsedWords, setParsedWords] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [hintsUsed, setHintsUsed] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(null);

  // Parse verse text into words and determine blank indices
  useEffect(() => {
    if (!verse || !verse.text) return;

    const rawWords = verse.text.split(/\s+/);
    let ratio = 0.5;
    if (difficulty === 'easy') ratio = 0.25;
    if (difficulty === 'hard') ratio = 0.75;

    // Pick words to blank out based on ratio (excluding short stop words when possible)
    const newParsed = rawWords.map((word, idx) => {
      // Clean word for comparison (strip punctuation)
      const cleanWord = word.replace(/[.,;:!?"'()]/g, '');
      const punctuationSuffix = word.slice(cleanWord.length + word.indexOf(cleanWord));

      // Deterministic pseudo-random selection based on index and ratio
      const isBlanked = (idx % Math.round(1 / ratio)) === 0 && cleanWord.length > 2;

      return {
        original: word,
        clean: cleanWord,
        isBlanked,
        index: idx
      };
    });

    setParsedWords(newParsed);
    setUserAnswers({});
    setHintsUsed({});
    setIsCompleted(false);
    setScore(null);
  }, [verse, difficulty]);

  const handleInputChange = (idx, val) => {
    setUserAnswers((prev) => ({ ...prev, [idx]: val }));
  };

  const handleRevealHint = (idx, cleanWord) => {
    playClickSound(soundEnabled);
    setHintsUsed((prev) => ({ ...prev, [idx]: true }));
    setUserAnswers((prev) => ({
      ...prev,
      [idx]: cleanWord.substring(0, Math.ceil(cleanWord.length / 2))
    }));
  };

  const handleCheckAnswers = () => {
    let totalBlanks = 0;
    let correctCount = 0;

    parsedWords.forEach((pw) => {
      if (pw.isBlanked) {
        totalBlanks++;
        const userVal = (userAnswers[pw.index] || '').trim().toLowerCase();
        const expected = pw.clean.trim().toLowerCase();
        if (userVal === expected) {
          correctCount++;
        }
      }
    });

    const percent = Math.round((correctCount / totalBlanks) * 100);
    setScore({ correct: correctCount, total: totalBlanks, percent });

    if (percent === 100) {
      setIsCompleted(true);
      playVictorySound(soundEnabled);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
      if (onComplete) onComplete(verse, 4); // High SRS grade
    } else {
      playSuccessSound(soundEnabled);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setHintsUsed({});
    setIsCompleted(false);
    setScore(null);
  };

  return (
    <div className="card flex flex-col gap-6 animate-fade-in">
      {/* Header & Difficulty Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-subtle">
        <div>
          <span className="badge badge-terracotta mb-1">Fill in the Blanks</span>
          <h3 className="serif-heading text-lg">{verse.reference}</h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-secondary font-medium mr-1">Difficulty:</span>
          {['easy', 'medium', 'hard'].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1 rounded-full capitalize font-medium transition-all ${
                difficulty === d
                  ? 'bg-terracotta text-white shadow-sm'
                  : 'bg-secondary text-secondary hover:bg-hover'
              }`}
              style={{
                backgroundColor: difficulty === d ? '#A33A2E' : '#F2EAEA',
                color: difficulty === d ? '#FFFFFF' : '#5B4F55'
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Cloze Verse Text */}
      <div className="scripture-text p-5 rounded-lg bg-secondary/50 leading-relaxed border border-subtle flex flex-wrap items-center">
        {parsedWords.map((item, idx) => {
          if (!item.isBlanked) {
            return (
              <span key={idx} className="inline-block mr-2 my-1">
                {item.original}
              </span>
            );
          }

          const userVal = userAnswers[idx] || '';
          const isCorrect = score && userVal.trim().toLowerCase() === item.clean.trim().toLowerCase();
          const isIncorrect = score && !isCorrect;

          return (
            <span key={idx} className="inline-flex items-center relative mr-2 my-1">
              <input
                type="text"
                value={userVal}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                className={`cloze-input ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                style={{
                  width: `${Math.max(item.clean.length * 14 + 18, 55)}px`
                }}
                placeholder={hintsUsed[idx] ? `${item.clean[0]}...` : '___'}
              />
              {!score && !userVal && (
                <button
                  onClick={() => handleRevealHint(idx, item.clean)}
                  title="Need a hint?"
                  className="text-muted hover:text-terracotta p-0.5 ml-1"
                  style={{ color: '#94A3B8' }}
                >
                  <Lightbulb size={14} />
                </button>
              )}
            </span>
          );
        })}
      </div>


      {/* Score Results Banner */}
      {score && (
        <div className={`p-4 rounded-lg flex items-center justify-between border ${
          score.percent === 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
        style={{
          backgroundColor: score.percent === 100 ? '#E8F5E9' : '#FEF3C7',
          borderColor: score.percent === 100 ? '#A5D6A7' : '#FDE68A',
          color: score.percent === 100 ? '#1B5E20' : '#78350F'
        }}>
          <div className="flex items-center gap-3">
            {score.percent === 100 ? <Sparkles size={24} style={{ color: '#2E7D32' }} /> : <CheckCircle2 size={24} style={{ color: '#D97706' }} />}
            <div>
              <div className="font-bold text-sm">
                {score.percent === 100 ? 'Awesome job! Perfect recall!' : `Good effort! You got ${score.correct} out of ${score.total} blanks correct (${score.percent}%).`}
              </div>
              <div className="text-xs opacity-85">
                {score.percent === 100 ? 'Your mastery score has increased.' : 'Review missing words and try again!'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={handleReset} className="btn btn-secondary btn-sm gap-1">
          <RefreshCw size={14} /> Reset
        </button>

        <button
          onClick={handleCheckAnswers}
          className="btn btn-primary gap-2"
        >
          <CheckCircle2 size={18} /> Verify Answers
        </button>
      </div>
    </div>
  );
}
