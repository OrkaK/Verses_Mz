import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';

export default function AudioPlayer({ text, reference }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(0.9); // Speech speed
  const [speechSupported, setSpeechSupported] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const words = text ? text.split(/\s+/) : [];
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!speechSupported) return;

    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      setHighlightedIndex(-1);
    } else {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(`${reference}. ${text}`);
      utterance.rate = rate;
      utterance.pitch = 1.0;

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          // Estimate word index based on character position
          const charIndex = event.charIndex;
          let count = 0;
          let foundIdx = 0;
          for (let i = 0; i < words.length; i++) {
            count += words[i].length + 1;
            if (count > charIndex) {
              foundIdx = i;
              break;
            }
          }
          setHighlightedIndex(foundIdx);
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setHighlightedIndex(-1);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setHighlightedIndex(-1);
      };

      utteranceRef.current = utterance;
      synth.speak(utterance);
      setIsPlaying(true);
    }
  };

  if (!speechSupported) {
    return (
      <div className="text-xs text-muted flex items-center gap-1.5 p-2 bg-secondary rounded-md">
        <VolumeX size={14} /> Audio recitation is not supported in this browser.
      </div>
    );
  }

  return (
    <div className="card p-4 flex flex-col gap-3 my-3 bg-secondary/40 border border-subtle">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 size={18} style={{ color: '#A33A2E' }} />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Audio Recitation Mode
          </span>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-muted">Speed:</span>
          {[0.75, 0.9, 1.1].map((r) => (
            <button
              key={r}
              onClick={() => {
                setRate(r);
                if (isPlaying) {
                  window.speechSynthesis.cancel();
                  setIsPlaying(false);
                }
              }}
              className={`px-2 py-0.5 rounded border transition-colors ${
                rate === r
                  ? 'bg-terracotta text-white font-bold border-transparent'
                  : 'bg-card text-secondary border-subtle hover:bg-hover'
              }`}
            >
              {r}x
            </button>
          ))}
        </div>
      </div>

      {/* Control Buttons & Highlighted Text */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePlayPause}
          className="btn btn-primary btn-sm flex items-center gap-1.5"
          style={{ backgroundColor: isPlaying ? '#D97706' : '#A33A2E' }}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span>{isPlaying ? 'Pause' : 'Listen'}</span>
        </button>

        <p className="text-xs italic text-muted">
          {isPlaying ? 'Reciting scripture out loud...' : 'Click to listen to word-by-word pronunciation.'}
        </p>
      </div>

      {/* Synchronized Word Highlight Display */}
      {isPlaying && (
        <div className="mt-2 p-3 bg-card rounded-md border border-subtle text-base leading-relaxed scripture-text">
          {words.map((w, idx) => (
            <span
              key={idx}
              className={`transition-colors duration-150 inline-block mr-1 px-1 rounded ${
                idx === highlightedIndex
                  ? 'bg-amber-500/20 font-bold text-amber-700 dark:text-amber-300 border-b-2 border-amber-500'
                  : ''
              }`}
            >
              {w}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
