import React, { useState } from 'react';
import { X, BookPlus, Sparkles, Search, Loader2 } from 'lucide-react';
import { fetchBiblePassage, TRANSLATIONS } from '../utils/bibleApi';
import { playClickSound, playSuccessSound } from '../utils/audioEffects';

export default function AddVerseModal({ isOpen, onClose, onAddVerse, soundEnabled = true }) {
  const [activeTab, setActiveTab] = useState('lookup'); // 'lookup' | 'manual'
  const [reference, setReference] = useState('');
  const [apiTranslation, setApiTranslation] = useState('web');
  const [manualTranslation, setManualTranslation] = useState('NIV');
  const [category, setCategory] = useState('Faith & Hope');
  const [customCategory, setCustomCategory] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFetchPassage = async () => {
    if (!reference.trim()) {
      setError('Please enter a scripture reference (e.g. John 3:16).');
      return;
    }

    playClickSound(soundEnabled);
    setLoading(true);
    setError('');

    try {
      const data = await fetchBiblePassage(reference, apiTranslation);
      setReference(data.reference);
      setText(data.text);
      setManualTranslation(data.translation);
      playSuccessSound(soundEnabled);
    } catch (err) {
      setError(err.message || 'Failed to fetch passage. Check reference format.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reference.trim() || !text.trim()) {
      setError('Both passage reference and scripture text are required.');
      return;
    }

    const finalCategory = category === 'Custom' ? customCategory.trim() || 'General' : category;

    const newVerse = {
      id: `custom_${Date.now()}`,
      reference: reference.trim(),
      translation: activeTab === 'lookup' ? apiTranslation.toUpperCase() : manualTranslation,
      category: finalCategory,
      text: text.trim(),
      mastery: 'New',
      srsInterval: 0,
      easeFactor: 2.5,
      nextReviewDate: new Date().toISOString(),
      timesReviewed: 0,
      createdAt: new Date().toISOString()
    };

    onAddVerse(newVerse);

    // Reset form
    setReference('');
    setText('');
    setError('');
    setCustomCategory('');
    onClose();
  };

  const CATEGORIES = [
    'Faith & Hope',
    'Peace & Anxiety',
    'Trust & Guidance',
    'Strength & Hope',
    'Courage & Faith',
    'Psalms & Comfort',
    'Love & Grace',
    'Custom'
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="card w-full max-w-lg p-6 bg-card relative flex flex-col gap-4 shadow-xl border border-subtle max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ borderRadius: '16px' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-subtle">
          <div className="flex items-center gap-2">
            <BookPlus size={20} style={{ color: '#A33A2E' }} />
            <h3 className="serif-heading text-xl">Add Scripture Verse</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon text-muted">
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-secondary rounded-lg border border-subtle text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              setActiveTab('lookup');
              setError('');
            }}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'lookup' ? 'bg-card text-primary shadow-xs' : 'text-muted hover:text-primary'
            }`}
          >
            <Search size={14} /> Auto-Fetch (Bible API)
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              setActiveTab('manual');
              setError('');
            }}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'manual' ? 'bg-card text-primary shadow-xs' : 'text-muted hover:text-primary'
            }`}
          >
            <Sparkles size={14} /> Manual Entry
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {activeTab === 'lookup' ? (
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  Passage Reference
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. John 3:16, Psalm 23:1-6, Romans 12:2"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="input-field flex-1"
                  />
                  <select
                    value={apiTranslation}
                    onChange={(e) => setApiTranslation(e.target.value)}
                    className="input-field text-xs font-medium"
                    style={{ width: 'auto' }}
                  >
                    {TRANSLATIONS.map((t) => (
                      <option key={t.id} value={t.id}>{t.id.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFetchPassage}
                disabled={loading}
                className="btn btn-secondary w-full gap-2 text-xs font-bold"
                style={{ borderColor: '#A33A2E', color: '#A33A2E' }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                {loading ? 'Searching Scripture...' : 'Search & Auto-Fill Verse Text'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-secondary mb-1">Passage Reference</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John 3:16 or Psalm 119:105"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">Translation</label>
                <select
                  value={manualTranslation}
                  onChange={(e) => setManualTranslation(e.target.value)}
                  className="input-field"
                >
                  <option value="NIV">NIV</option>
                  <option value="ESV">ESV</option>
                  <option value="KJV">KJV</option>
                  <option value="NKJV">NKJV</option>
                  <option value="NLT">NLT</option>
                  <option value="CSB">CSB</option>
                  <option value="NASB">NASB</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">Theme / Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field mb-2"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {category === 'Custom' && (
              <input
                type="text"
                required
                placeholder="Enter custom topic tag..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="input-field"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">Scripture Verse Text</label>
            <textarea
              required
              rows={4}
              placeholder="Scripture passage text will appear here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input-field serif-heading"
              style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem' }}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-subtle">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary gap-1">
              <Sparkles size={16} /> Save Verse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
