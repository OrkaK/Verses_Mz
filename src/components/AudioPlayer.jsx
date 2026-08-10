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
    <div className="card p-4 flex flex-col gap-3 my-3" style={{ backgroundColor: '#F8F5EE', borderColor: '#EAE3D9' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 size={18} style={{ color: '#C87D55' }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>
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
                  ? 'bg-terracotta text-white font-bold'
                  : 'bg-white text-secondary border-subtle'
              }`}
              style={{
                backgroundColor: rate === r ? '#C87D55' : '#FFFFFF',
                color: rate === r ? '#FFFFFF' : '#475569',
                borderColor: '#EAE3D9'
              }}
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
          style={{ backgroundColor: isPlaying ? '#D97706' : '#C87D55' }}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span>{isPlaying ? 'Pause' : 'Listen'}</span>
        </button>

        <p className="text-xs italic" style={{ color: '#64748B' }}>
          {isPlaying ? 'Reciting scripture out loud...' : 'Click to listen to word-by-word pronunciation.'}
        </p>
      </div>

      {/* Synchronized Word Highlight Display */}
      {isPlaying && (
        <div className="mt-2 p-3 bg-white rounded-md border text-base leading-relaxed scripture-text" style={{ borderColor: '#EAE3D9' }}>
          {words.map((w, idx) => (
            <span
              key={idx}
              className={`transition-colors duration-150 inline-block mr-1 px-1 rounded ${
                idx === highlightedIndex
                  ? 'bg-amber-100 font-bold text-amber-900 border-b-2 border-amber-500'
                  : ''
              }`}
              style={{
                backgroundColor: idx === highlightedIndex ? '#FEF3C7' : 'transparent',
                color: idx === highlightedIndex ? '#92400E' : 'inherit'
              }}
            >
              {w}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
