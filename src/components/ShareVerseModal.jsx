import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Copy, Check, Image as ImageIcon, Sparkles } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audioEffects';

const CARD_THEMES = [
  {
    id: 'terracotta',
    name: 'Sacred Crimson',
    bg: 'linear-gradient(135deg, #A33A2E 0%, #802B21 100%)',
    textColor: '#FFFFFF',
    refColor: '#EDE4CD',
    borderColor: 'rgba(237, 228, 205, 0.3)'
  },
  {
    id: 'dark',
    name: 'Midnight Ink',
    bg: 'linear-gradient(135deg, #1C1B29 0%, #12111C 100%)',
    textColor: '#EDE4CD',
    refColor: '#B8862E',
    borderColor: '#3E3B52'
  },
  {
    id: 'sand',
    name: 'Parchment Scribe',
    bg: '#F7F4EC',
    textColor: '#1C1B29',
    refColor: '#A33A2E',
    borderColor: '#D9CCA9'
  },
  {
    id: 'olive',
    name: 'Olive Grove',
    bg: 'linear-gradient(135deg, #4A5D23 0%, #354318 100%)',
    textColor: '#FFFFFF',
    refColor: '#FDE68A',
    borderColor: 'rgba(255, 255, 255, 0.2)'
  }
];

export default function ShareVerseModal({ verse, isOpen, onClose, soundEnabled = true }) {
  const [selectedTheme, setSelectedTheme] = useState(CARD_THEMES[0]);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const cardRef = useRef(null);

  if (!isOpen || !verse) return null;

  const handleCopyText = async () => {
    playClickSound(soundEnabled);
    const formatted = `"${verse.text}"\n— ${verse.reference} (${verse.translation || 'WEB'})\nVia Verse App`;
    await navigator.clipboard.writeText(formatted);
    setCopiedText(true);
    playSuccessSound(soundEnabled);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadCard = () => {
    playClickSound(soundEnabled);
    if (!cardRef.current) return;

    const element = cardRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scale = 2; // high definition

    canvas.width = 600 * scale;
    canvas.height = 400 * scale;

    ctx.scale(scale, scale);

    // Draw background
    if (selectedTheme.id === 'terracotta') {
      const grad = ctx.createLinearGradient(0, 0, 600, 400);
      grad.addColorStop(0, '#A33A2E');
      grad.addColorStop(1, '#802B21');
      ctx.fillStyle = grad;
    } else if (selectedTheme.id === 'dark') {
      const grad = ctx.createLinearGradient(0, 0, 600, 400);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(1, '#1E293B');
      ctx.fillStyle = grad;
    } else if (selectedTheme.id === 'olive') {
      const grad = ctx.createLinearGradient(0, 0, 600, 400);
      grad.addColorStop(0, '#4A5D23');
      grad.addColorStop(1, '#354318');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = '#FAF7F8';
    }

    ctx.fillRect(0, 0, 600, 400);

    // Draw Decorative border
    ctx.strokeStyle = selectedTheme.borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 560, 360);

    // Draw Quote Text
    ctx.fillStyle = selectedTheme.textColor;
    ctx.font = 'italic 20px "Playfair Display", serif';
    ctx.textAlign = 'center';

    const words = `"${verse.text}"`.split(' ');
    let line = '';
    const lines = [];
    const maxWidth = 480;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const startY = 180 - (lines.length * 15);
    lines.forEach((l, i) => {
      ctx.fillText(l.trim(), 300, startY + (i * 30));
    });

    // Draw Reference
    ctx.fillStyle = selectedTheme.refColor;
    ctx.font = 'bold 22px "Playfair Display", serif';
    ctx.fillText(`— ${verse.reference} (${verse.translation || 'WEB'})`, 300, startY + (lines.length * 30) + 30);

    // Watermark
    ctx.fillStyle = selectedTheme.textColor;
    ctx.globalAlpha = 0.5;
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('VERSE SCRIPTURE APP', 300, 355);

    // Download Image Link
    const link = document.createElement('a');
    link.download = `${verse.reference.replace(/[^a-zA-Z0-9]/g, '_')}_card.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    playSuccessSound(soundEnabled);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in" onClick={onClose}>
      <div className="bg-card w-full max-w-xl rounded-xl p-6 shadow-lg border border-subtle flex flex-col gap-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-subtle pb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-terracotta" />
            <h3 className="serif-heading text-xl">Share Scripture Card</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm p-1">
            <X size={20} />
          </button>
        </div>

        {/* Theme Chooser */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted">Select Visual Card Theme:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CARD_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setSelectedTheme(theme);
                }}
                className={`p-2.5 rounded-lg border text-left text-xs font-semibold transition-all ${
                  selectedTheme.id === theme.id ? 'ring-2 ring-terracotta border-transparent' : 'border-subtle hover:border-medium'
                }`}
                style={{ background: theme.bg, color: theme.textColor }}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live Card Preview */}
        <div
          ref={cardRef}
          className="p-8 rounded-xl border flex flex-col items-center justify-center text-center gap-4 min-h-[220px] transition-all shadow-md"
          style={{
            background: selectedTheme.bg,
            color: selectedTheme.textColor,
            borderColor: selectedTheme.borderColor
          }}
        >
          <p className="serif-heading italic text-lg leading-relaxed max-w-lg">
            "{verse.text}"
          </p>
          <div
            className="serif-heading font-bold text-base tracking-wide"
            style={{ color: selectedTheme.refColor }}
          >
            — {verse.reference} ({verse.translation || 'WEB'})
          </div>
          <div className="text-[11px] opacity-60 font-sans tracking-widest uppercase mt-2">
            Verse Scripture App
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCopyText}
            className="btn btn-secondary w-full sm:w-auto gap-2 text-xs"
          >
            {copiedText ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            {copiedText ? 'Text Copied!' : 'Copy Text'}
          </button>

          <button
            onClick={handleDownloadCard}
            className="btn btn-primary w-full sm:w-auto gap-2 text-xs"
            style={{ backgroundColor: '#A33A2E' }}
          >
            <Download size={16} /> Download PNG Card
          </button>
        </div>
      </div>
    </div>
  );
}
