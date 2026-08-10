import React, { useState, useEffect } from 'react';
import { RotateCcw, Sparkles, Trophy, CheckCircle2, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MemoryMatch({ verses, onComplete }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize game board with pairs (Verse Reference card + Verse Snippet card)
  useEffect(() => {
    startNewGame();
  }, [verses]);

  const startNewGame = () => {
    if (!verses || verses.length === 0) return;

    // Pick 4 random verses to form 8 cards (4 pairs)
    const selected = [...verses].sort(() => Math.random() - 0.5).slice(0, 4);

    const deck = [];
    selected.forEach((v) => {
      // Card A: Reference
      deck.push({
        id: `${v.id}-ref`,
        pairId: v.id,
        type: 'reference',
        title: v.reference,
        subtitle: v.category,
        translation: v.translation
      });
      // Card B: Text snippet
      const snippet = v.text.length > 80 ? v.text.substring(0, 80) + '...' : v.text;
      deck.push({
        id: `${v.id}-text`,
        pairId: v.id,
        type: 'text',
        title: `"${snippet}"`,
        subtitle: 'Verse Scripture'
      });
    });

    // Shuffle deck
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedIds([]);
    setMoves(0);
    setIsGameOver(false);
  };

  const handleCardClick = (card) => {
    // Ignore if already flipped or matched or 2 cards are currently being compared
    if (
      flippedCards.includes(card.id) ||
      matchedIds.includes(card.pairId) ||
      flippedCards.length >= 2
    ) {
      return;
    }

    const newFlipped = [...flippedCards, card.id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const card1 = cards.find((c) => c.id === newFlipped[0]);
      const card2 = cards.find((c) => c.id === newFlipped[1]);

      if (card1.pairId === card2.pairId) {
        // Matched!
        const newMatched = [...matchedIds, card1.pairId];
        setMatchedIds(newMatched);
        setFlippedCards([]);

        // Check victory
        if (newMatched.length === 4) {
          setIsGameOver(true);
          try {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
          } catch (e) {}
          if (onComplete && verses[0]) onComplete(verses[0], 4);
        }
      } else {
        // Not matched -> flip back after 1 second
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="card flex flex-col gap-6 animate-fade-in">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-subtle">
        <div>
          <span className="badge badge-terracotta mb-1">Memory Match Game</span>
          <h3 className="serif-heading text-lg">Pair References with Verse Text</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold text-muted">
            Moves: <span className="text-primary font-bold text-sm">{moves}</span>
          </div>
          <button onClick={startNewGame} className="btn btn-secondary btn-sm gap-1">
            <RotateCcw size={14} /> New Game
          </button>
        </div>
      </div>

      {/* 4x2 Grid of Memory Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((card) => {
          const isFlipped = flippedCards.includes(card.id) || matchedIds.includes(card.pairId);
          const isMatched = matchedIds.includes(card.pairId);

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`flashcard-wrapper h-36 ${isMatched ? 'opacity-90' : ''}`}
            >
              <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
                {/* Card Back (Hidden pattern) */}
                <div
                  className="flashcard-front flex-col items-center justify-center text-center p-3 cursor-pointer hover:border-terracotta transition-colors"
                  style={{
                    backgroundColor: '#F7F3EC',
                    borderColor: '#EAE3D9'
                  }}
                >
                  <Sparkles size={24} style={{ color: '#A33A2E' }} />
                  <span className="text-xs font-semibold text-muted mt-2">Tap to Reveal</span>
                </div>

                {/* Card Front (Revealed Content) */}
                <div
                  className={`flashcard-back flex-col justify-between p-3.5 border-2 ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                      : 'bg-white border-terracotta text-primary'
                  }`}
                  style={{
                    backgroundColor: isMatched ? '#E8F5E9' : '#FFFFFF',
                    borderColor: isMatched ? '#2E7D32' : '#A33A2E'
                  }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    {card.type === 'reference' ? card.subtitle : 'Scripture Snippet'}
                  </span>

                  <div className="my-auto text-center">
                    <p className={`font-bold ${card.type === 'reference' ? 'serif-heading text-base' : 'scripture-text text-xs italic'}`}>
                      {card.title}
                    </p>
                  </div>

                  {isMatched && (
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 size={12} /> Matched!
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Victory Modal / Banner */}
      {isGameOver && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center justify-between text-emerald-900" style={{ backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' }}>
          <div className="flex items-center gap-3">
            <Trophy size={28} style={{ color: '#2E7D32' }} />
            <div>
              <div className="font-bold text-sm">Congratulations! Memory Grid Cleared!</div>
              <div className="text-xs opacity-90">You matched all 4 scripture pairs in {moves} moves!</div>
            </div>
          </div>

          <button onClick={startNewGame} className="btn btn-primary btn-sm gap-1" style={{ backgroundColor: '#556B2F' }}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
