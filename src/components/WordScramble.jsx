import React, { useState, useEffect } from 'react';
import { RotateCcw, Undo2, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WordScramble({ verse, onComplete }) {
  const [originalWords, setOriginalWords] = useState([]);
  const [availablePool, setAvailablePool] = useState([]);
  const [placedWords, setPlacedWords] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!verse || !verse.text) return;
    const words = verse.text.split(/\s+/).map((w, idx) => ({ id: `${idx}-${w}`, text: w, originalIndex: idx }));
    setOriginalWords(words);

    // Shuffle pool
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setAvailablePool(shuffled);
    setPlacedWords([]);
    setIsFinished(false);
    setIsSuccess(false);
  }, [verse]);

  const handleSelectWord = (item) => {
    if (isFinished) return;
    const newPlaced = [...placedWords, item];
    const newPool = availablePool.filter((p) => p.id !== item.id);

    setPlacedWords(newPlaced);
    setAvailablePool(newPool);

    if (newPool.length === 0) {
      setIsFinished(true);
      // Check if order matches original
      const isCorrect = newPlaced.every((w, idx) => w.originalIndex === idx);
      setIsSuccess(isCorrect);
      if (isCorrect) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        } catch (e) {}
        if (onComplete) onComplete(verse, 4);
      }
    }
  };

  const handleUndo = () => {
    if (placedWords.length === 0 || isFinished) return;
    const lastItem = placedWords[placedWords.length - 1];
    setPlacedWords(placedWords.slice(0, -1));
    setAvailablePool([...availablePool, lastItem]);
  };

  const handleReset = () => {
    const shuffled = [...originalWords].sort(() => Math.random() - 0.5);
    setAvailablePool(shuffled);
    setPlacedWords([]);
    setIsFinished(false);
    setIsSuccess(false);
  };

  return (
    <div className="card flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-subtle">
        <div>
          <span className="badge badge-amber mb-1">Word Scramble Puzzle</span>
          <h3 className="serif-heading text-lg">{verse.reference}</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            disabled={placedWords.length === 0 || isFinished}
            className="btn btn-secondary btn-sm gap-1 disabled:opacity-50"
          >
            <Undo2 size={14} /> Undo
          </button>
          <button onClick={handleReset} className="btn btn-secondary btn-sm gap-1">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Target Construction Workspace */}
      <div className="min-h-[120px] p-4 rounded-lg bg-secondary/50 border-2 border-dashed border-medium flex flex-wrap gap-2 items-center align-content-start">
        {placedWords.length === 0 ? (
          <p className="text-sm text-muted italic w-full text-center py-4">
            Tap the scrambled words below in the correct order to assemble the scripture...
          </p>
        ) : (
          placedWords.map((item, idx) => (
            <span
              key={item.id}
              className="word-chip bg-white border-terracotta text-primary font-bold shadow-sm"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#C87D55' }}
            >
              {item.text}
            </span>
          ))
        )}
      </div>

      {/* Available Word Chips Pool */}
      <div className="flex flex-wrap gap-2 justify-center p-3 bg-white rounded-lg border border-subtle">
        {availablePool.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelectWord(item)}
            className="word-chip"
          >
            {item.text}
          </button>
        ))}
      </div>

      {/* Result Status */}
      {isFinished && (
        <div className={`p-4 rounded-lg flex items-center justify-between border ${
          isSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}
        style={{
          backgroundColor: isSuccess ? '#E8F5E9' : '#FFEBEE',
          borderColor: isSuccess ? '#A5D6A7' : '#FFCDD2',
          color: isSuccess ? '#1B5E20' : '#B71C1C'
        }}>
          <div className="flex items-center gap-2 font-bold text-sm">
            {isSuccess ? <Sparkles size={20} style={{ color: '#2E7D32' }} /> : <CheckCircle2 size={20} style={{ color: '#C62828' }} />}
            {isSuccess ? 'Splendid! You assembled the verse perfectly!' : 'The sequence had some words out of order. Reset to try again!'}
          </div>
          {!isSuccess && (
            <button onClick={handleReset} className="btn btn-secondary btn-sm">
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
