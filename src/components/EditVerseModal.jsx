import React, { useState, useEffect } from 'react';
import { X, Edit3, Trash2, Save } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audioEffects';

export default function EditVerseModal({ verse, isOpen, onClose, onUpdateVerse, onDeleteVerse, soundEnabled = true }) {
  const [reference, setReference] = useState('');
  const [translation, setTranslation] = useState('NIV');
  const [category, setCategory] = useState('Faith & Hope');
  const [text, setText] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (verse) {
      setReference(verse.reference || '');
      setTranslation(verse.translation || 'NIV');
      setCategory(verse.category || 'Faith & Hope');
      setText(verse.text || '');
      setShowConfirmDelete(false);
    }
  }, [verse]);

  if (!isOpen || !verse) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!reference.trim() || !text.trim()) return;

    playClickSound(soundEnabled);
    onUpdateVerse({
      ...verse,
      reference: reference.trim(),
      translation,
      category,
      text: text.trim()
    });
    playSuccessSound(soundEnabled);
    onClose();
  };

  const handleDelete = () => {
    playClickSound(soundEnabled);
    onDeleteVerse(verse.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="card w-full max-w-lg p-6 bg-card relative flex flex-col gap-4 shadow-xl border border-subtle max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ borderRadius: '16px' }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-subtle">
          <div className="flex items-center gap-2">
            <Edit3 size={20} style={{ color: '#A33A2E' }} />
            <h3 className="serif-heading text-xl">Edit Verse Details</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon text-muted">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-secondary mb-1">Passage Reference</label>
              <input
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Translation</label>
              <input
                type="text"
                required
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                className="input-field uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">Category</label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">Scripture Verse Text</label>
            <textarea
              required
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input-field serif-heading"
              style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem' }}
            />
          </div>

          {showConfirmDelete ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900">Delete this verse permanently?</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="btn btn-secondary btn-sm text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-primary btn-sm text-xs"
                  style={{ backgroundColor: '#C62828' }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-2 border-t border-subtle">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="btn btn-ghost btn-sm text-rose-600 gap-1.5 text-xs hover:bg-rose-50"
              >
                <Trash2 size={16} /> Delete Verse
              </button>

              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary gap-1">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
