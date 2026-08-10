import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RotateCcw, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FirstLetterPrompt({ verse, onComplete }) {
  const [words, setWords] = useState([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showFullVerse, setShowFullVerse] = useState(false);
  const [typedInput, setTypedInput] = useState('');

  useEffect(() => {
    if (!verse || !verse.text) return;
    const splitWords = verse.text.split(/\s+/).map((w) => {
      const clean = w.replace(/[.,;:!?"'()]/g, '');
      return {
        full: w,
        clean: clean,
        firstLetter: clean.charAt(0).toUpperCase()
      };
    });
    setWords(splitWords);
    setRevealedCount(0);
    setShowFullVerse(false);
    setTypedInput('');
  }, [verse]);

  // Handle keyboard typing of first letter
  const handleKeyTyped = (char) => {
    if (revealedCount >= words.length) return;
    const targetWord = words[revealedCount];
    if (char.toUpperCase() === targetWord.firstLetter) {
      const nextCount = revealedCount + 1;
      setRevealedCount(nextCount);
      setTypedInput('');

      if (nextCount === words.length) {
        try {
          confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
        } catch (e) {}
        if (onComplete) onComplete(verse, 4);
      }
    }
  };

  // Add global keydown event listener so desktop typing works automatically
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in another input element or key is not A-Z
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyTyped(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [revealedCount, words]);

  const handleNextWordReveal = () => {
    if (revealedCount < words.length) {
      const nextCount = revealedCount + 1;
      setRevealedCount(nextCount);
      if (nextCount === words.length && onComplete) {
        onComplete(verse, 3);
      }
    }
  };


  const handleReset = () => {
    setRevealedCount(0);
    setTypedInput('');
  };

  const progressPercent = Math.round((revealedCount / words.length) * 100) || 0;

  return (
    <div className="card flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-subtle">
        <div>
          <span className="badge badge-sage mb-1">First-Letter Prompt</span>
          <h3 className="serif-heading text-lg">{verse.reference}</h3>
        </div>

        <button
          onClick={() => setShowFullVerse(!showFullVerse)}
          className="btn btn-ghost btn-sm gap-1.5 text-xs"
        >
          {showFullVerse ? <EyeOff size={15} /> : <Eye size={15} />}
          <span>{showFullVerse ? 'Hide Full Reference' : 'Peek Verse'}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-muted mb-1.5">
          <span>Recall Progress</span>
          <span className="font-bold">{revealedCount} / {words.length} words ({progressPercent}%)</span>
        </div>
        <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-terracotta transition-all duration-300"
            style={{ width: `${progressPercent}%`, backgroundColor: '#556B2F' }}
          />
        </div>
      </div>

      {/* Verse Prompt Area */}
      <div className="scripture-text p-5 rounded-lg bg-secondary/40 leading-relaxed border border-subtle min-h-[140px] flex flex-wrap gap-2 items-center">
        {words.map((w, idx) => {
          const isRevealed = idx < revealedCount || showFullVerse;
          return (
            <span
              key={idx}
              className={`transition-all duration-200 px-1.5 py-0.5 rounded text-lg ${
                isRevealed
                  ? 'bg-white text-primary border border-subtle shadow-sm'
                  : 'bg-stone-200/70 text-stone-600 font-bold tracking-widest border border-dashed border-stone-300'
              }`}
              style={{
                backgroundColor: isRevealed ? '#FFFFFF' : '#EAE3D9',
                color: isRevealed ? '#1E293B' : '#78350F'
              }}
            >
              {isRevealed ? w.full : `${w.firstLetter}_`}
            </span>
          );
        })}
      </div>

      {/* Interactive Typing & Button Controls */}
      {revealedCount < words.length ? (
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-secondary/50 border border-subtle">
          <div className="text-xs text-center text-secondary leading-relaxed">
            💡 <strong>How it works:</strong> Recite the verse out loud or in your mind. As you reach each word, <strong>press its first letter key</strong> on your keyboard (e.g. <strong className="text-terracotta">{words[revealedCount]?.firstLetter}</strong>), or tap the button below!
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-1">
            <button
              onClick={() => handleKeyTyped(words[revealedCount]?.firstLetter)}
              className="btn btn-primary w-full sm:w-auto px-6 py-2.5 text-base gap-2"
              style={{ backgroundColor: '#8A737D' }}
            >
              Tap Key <strong className="bg-white/20 px-2 py-0.5 rounded uppercase font-bold text-lg">{words[revealedCount]?.firstLetter}</strong> to Reveal Next Word
            </button>

            <input
              type="text"
              maxLength={1}
              value={typedInput}
              onChange={(e) => {
                const char = e.target.value;
                setTypedInput('');
                if (char) handleKeyTyped(char);
              }}
              placeholder="Or type here..."
              className="input-field text-center font-bold text-sm uppercase w-full sm:w-36"
            />
          </div>
        </div>
      ) : (

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-900" style={{ backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' }}>
          <div className="flex items-center gap-2 font-bold text-sm">
            <Sparkles size={20} style={{ color: '#2E7D32' }} /> Full verse recited successfully!
          </div>
          <button onClick={handleReset} className="btn btn-secondary btn-sm gap-1">
            <RotateCcw size={14} /> Practice Again
          </button>
        </div>
      )}
    </div>
  );
}
