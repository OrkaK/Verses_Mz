import React, { useState } from 'react';
import { Search, Filter, Play, Brain, Sparkles, BookOpen, Volume2, Plus, Share2, Edit3, Star } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import { playClickSound } from '../utils/audioEffects';

export default function VerseLibrary({
  verses,
  onSelectVerseMode,
  onOpenAddModal,
  onOpenEditModal,
  onOpenShareModal,
  soundEnabled = true
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMastery, setSelectedMastery] = useState('All');
  const [activeAudioVerseId, setActiveAudioVerseId] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  const categories = ['All', ...new Set(verses.map((v) => v.category))];
  const masteryLevels = ['All', 'New', 'Learning', 'Reviewing', 'Mastered'];

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    playClickSound(soundEnabled);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredVerses = verses.filter((v) => {
    const matchesSearch =
      v.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.text.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesMastery = selectedMastery === 'All' || v.mastery === selectedMastery;
    const matchesBookmark = !onlyBookmarks || bookmarkedIds.has(v.id);

    return matchesSearch && matchesCategory && matchesMastery && matchesBookmark;
  });

  const getMasteryBadgeClass = (m) => {
    switch (m) {
      case 'Mastered': return 'badge-sage';
      case 'Reviewing': return 'badge-terracotta';
      case 'Learning': return 'badge-amber';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="serif-heading">Scripture Library</h1>
          <p className="text-sm text-secondary">
            Browse, search, listen to, share, and practice your stored Bible verses.
          </p>
        </div>

        <button
          onClick={() => {
            playClickSound(soundEnabled);
            onOpenAddModal();
          }}
          className="btn btn-primary gap-2 self-start sm:self-auto"
        >
          <Plus size={18} /> Add Custom Verse
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-3" style={{ backgroundColor: '#F8F5EE' }}>
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by book, passage, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setOnlyBookmarks(!onlyBookmarks);
            }}
            className={`btn btn-secondary text-xs gap-1.5 ${onlyBookmarks ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold' : ''}`}
          >
            <Star size={14} className={onlyBookmarks ? 'fill-amber-400 text-amber-400' : 'text-muted'} />
            Starred
          </button>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field text-xs sm:text-sm font-medium"
            style={{ width: 'auto' }}
          >
            <option value="All">All Topics</option>
            {categories.filter(c => c !== 'All').map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Mastery Filter */}
          <select
            value={selectedMastery}
            onChange={(e) => setSelectedMastery(e.target.value)}
            className="input-field text-xs sm:text-sm font-medium"
            style={{ width: 'auto' }}
          >
            <option value="All">All Statuses</option>
            {masteryLevels.filter(m => m !== 'All').map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Verses Grid */}
      {filteredVerses.length === 0 ? (
        <div className="card p-8 text-center text-muted">
          <BookOpen size={36} className="mx-auto mb-2 text-muted/60" />
          <p className="font-semibold text-primary">No scriptures found</p>
          <p className="text-xs mt-1">Try clearing your filters or search keywords, or add a new custom verse!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVerses.map((v) => (
            <div key={v.id} className="card card-interactive flex flex-col justify-between gap-4 relative">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleBookmark(v.id, e)}
                      className="p-1 text-muted hover:text-amber-500 transition-colors"
                      title="Bookmark verse"
                    >
                      <Star size={16} className={bookmarkedIds.has(v.id) ? 'fill-amber-400 text-amber-400' : ''} />
                    </button>
                    <span className="badge badge-neutral text-xs">{v.category}</span>
                    <span className="text-xs text-muted font-bold">{v.translation}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playClickSound(soundEnabled);
                        onOpenShareModal(v);
                      }}
                      className="btn btn-ghost btn-sm p-1 text-muted hover:text-terracotta"
                      title="Share verse card"
                    >
                      <Share2 size={15} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playClickSound(soundEnabled);
                        onOpenEditModal(v);
                      }}
                      className="btn btn-ghost btn-sm p-1 text-muted hover:text-primary"
                      title="Edit verse"
                    >
                      <Edit3 size={15} />
                    </button>

                    <span className={`badge ${getMasteryBadgeClass(v.mastery)}`}>
                      {v.mastery}
                    </span>
                  </div>
                </div>

                <h3 className="serif-heading text-lg font-bold" style={{ color: '#1E293B' }}>
                  {v.reference}
                </h3>

                <p className="scripture-text text-sm line-clamp-3 my-2 opacity-90">
                  "{v.text}"
                </p>
              </div>

              {/* Expandable Audio Recitation Player */}
              {activeAudioVerseId === v.id && (
                <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                  <AudioPlayer text={v.text} reference={v.reference} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-subtle">
                <button
                  onClick={() => {
                    playClickSound(soundEnabled);
                    setActiveAudioVerseId(activeAudioVerseId === v.id ? null : v.id);
                  }}
                  className="btn btn-ghost btn-sm gap-1.5 text-xs"
                >
                  <Volume2 size={15} style={{ color: '#C87D55' }} />
                  <span>{activeAudioVerseId === v.id ? 'Close Audio' : 'Listen'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      playClickSound(soundEnabled);
                      onSelectVerseMode(v, 'cloze');
                    }}
                    className="btn btn-secondary btn-sm text-xs"
                    title="Fill in the Blanks practice"
                  >
                    Cloze
                  </button>
                  <button
                    onClick={() => {
                      playClickSound(soundEnabled);
                      onSelectVerseMode(v, 'srs');
                    }}
                    className="btn btn-primary btn-sm gap-1 text-xs"
                  >
                    <Brain size={14} /> Practice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
