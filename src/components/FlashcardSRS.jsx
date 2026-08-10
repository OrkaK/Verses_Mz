import React, { useState } from 'react';
import { RotateCw, Check, Clock, Brain, ThumbsUp, Flame } from 'lucide-react';
import { calculateSRS } from '../utils/srs';
import confetti from 'canvas-confetti';
import { playFlipSound, playSuccessSound } from '../utils/audioEffects';

export default function FlashcardSRS({ verse, onRateRecall, soundEnabled = true }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipCard = () => {
    playFlipSound(soundEnabled);
    setIsFlipped(!isFlipped);
  };

  const handleRating = (grade) => {
    playSuccessSound(soundEnabled);
    const updatedSRS = calculateSRS(
      grade,
      verse.srsInterval || 0,
      verse.easeFactor || 2.5,
      verse.timesReviewed || 0
    );

    if (grade >= 3) {
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      } catch (e) {}
    }

    setIsFlipped(false);
    if (onRateRecall) {
      onRateRecall(verse, updatedSRS);
    }
  };

  return (
    <div className="card flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between pb-2 border-b border-subtle">
        <div>
          <span className="badge badge-terracotta mb-1">Spaced Repetition (SRS)</span>
          <h3 className="serif-heading text-lg">Self-Recall Flashcard</h3>
        </div>

        <span className="text-xs text-muted font-medium">
          Interval: {verse.srsInterval || 0}d | Ease: {verse.easeFactor || 2.5}
        </span>
      </div>

      {/* 3D Flip Flashcard */}
      <div
        className="flashcard-wrapper"
        onClick={handleFlipCard}
        style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          marginBottom: '1.5rem',
          perspective: '1000px',
          perspectiveOrigin: '50% 50%',
          overflow: 'hidden',
          borderRadius: '12px'
        }}
      >
        <div
          className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 50%',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Front of Card */}
          <div
            className="flashcard-front"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
              padding: '1.25rem'
            }}
          >
            <div className="flex justify-between items-center">
              <span className="badge badge-sage">{verse.category}</span>
              <span className="text-xs text-muted font-bold">{verse.translation}</span>
            </div>

            <div className="text-center my-auto py-4">
              <h2 className="serif-heading text-2xl font-bold mb-2" style={{ color: '#1E293B' }}>
                {verse.reference}
              </h2>
              <p className="text-xs text-muted italic">Recite the verse in your mind, then tap to reveal...</p>
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-terracotta font-medium">
              <RotateCw size={14} /> Tap card to flip
            </div>
          </div>

          {/* Back of Card */}
          <div
            className="flashcard-back"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              backgroundColor: '#FAF6F0',
              padding: '1.25rem'
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold" style={{ color: '#C87D55' }}>{verse.reference}</span>
              <span className="text-xs text-muted">{verse.translation}</span>
            </div>

            <div className="py-2 flex-1 flex items-center justify-center overflow-y-auto">
              <p className="scripture-text text-center italic text-sm leading-relaxed" style={{ fontSize: '0.95rem' }}>{verse.text}</p>
            </div>

            <div className="flex items-center justify-center gap-1 text-[11px] text-muted">
              Rate how well you recalled this verse below
            </div>
          </div>
        </div>
      </div>




      {/* Rating Buttons */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold text-center text-muted uppercase tracking-wider">
          How easily did you recall this verse?
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleRating(1)}
            className="btn btn-secondary flex-col py-2.5 h-auto text-rose-700 hover:bg-rose-50 border-rose-200"
            style={{ color: '#C62828' }}
          >
            <span className="font-bold text-xs">1. Again</span>
            <span className="text-[10px] text-muted">Repeat today</span>
          </button>

          <button
            onClick={() => handleRating(2)}
            className="btn btn-secondary flex-col py-2.5 h-auto text-amber-700 hover:bg-amber-50 border-amber-200"
            style={{ color: '#D97706' }}
          >
            <span className="font-bold text-xs">2. Hard</span>
            <span className="text-[10px] text-muted">Review in 1d</span>
          </button>

          <button
            onClick={() => handleRating(3)}
            className="btn btn-secondary flex-col py-2.5 h-auto text-emerald-700 hover:bg-emerald-50 border-emerald-200"
            style={{ color: '#2E7D32' }}
          >
            <span className="font-bold text-xs">3. Good</span>
            <span className="text-[10px] text-muted">Review in 3d</span>
          </button>

          <button
            onClick={() => handleRating(4)}
            className="btn btn-primary flex-col py-2.5 h-auto"
            style={{ backgroundColor: '#C87D55' }}
          >
            <span className="font-bold text-xs">4. Easy</span>
            <span className="text-[10px] text-white/90">Review in 7+d</span>
          </button>
        </div>
      </div>
    </div>
  );
}
