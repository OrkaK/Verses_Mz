import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import DashboardStats from './components/DashboardStats';
import VerseLibrary from './components/VerseLibrary';
import FillInBlanks from './components/FillInBlanks';
import FirstLetterPrompt from './components/FirstLetterPrompt';
import WordScramble from './components/WordScramble';
import FlashcardSRS from './components/FlashcardSRS';
import AudioPlayer from './components/AudioPlayer';
import MemoryMatch from './components/MemoryMatch';
import ReferenceQuiz from './components/ReferenceQuiz';
import AddVerseModal from './components/AddVerseModal';
import EditVerseModal from './components/EditVerseModal';
import ShareVerseModal from './components/ShareVerseModal';
import SettingsModal from './components/SettingsModal';
import AuthModal from './components/AuthModal';
import AchievementsView from './components/AchievementsView';
import {
  getStoredVerses,
  saveVerses,
  getStreakData,
  recordPracticeActivity,
  getThemePreference,
  setThemePreference,
  getSoundPreference,
  setSoundPreference,
  getStoredUser,
  saveStoredUser,
  getPreferredTranslation,
  setPreferredTranslation
} from './utils/storage';
import { fetchBiblePassage, TRANSLATIONS } from './utils/bibleApi';
import { playClickSound, playSuccessSound } from './utils/audioEffects';
import { BookOpen, BrainCircuit, Sparkles, Plus, ArrowLeft, Settings, Sun, Moon, User, Cloud, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'library', 'practice', 'achievements'
  const [verses, setVerses] = useState([]);
  const [streakData, setStreakData] = useState({ count: 1 });
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [practiceMode, setPracticeMode] = useState('cloze'); // 'cloze', 'firstletter', 'scramble', 'srs', 'match', 'quiz'

  // Modals & Preferences State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [editingVerse, setEditingVerse] = useState(null);
  const [sharingVerse, setSharingVerse] = useState(null);
  const [theme, setTheme] = useState('light');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [preferredTranslation, setTranslationState] = useState('NIV');
  const [isTranslating, setIsTranslating] = useState(false);

  // Initialize data & theme
  useEffect(() => {
    const loadedVerses = getStoredVerses();
    setVerses(loadedVerses);
    setStreakData(getStreakData());
    setUser(getStoredUser());
    setTranslationState(getPreferredTranslation());

    if (loadedVerses.length > 0) {
      setSelectedVerse(loadedVerses[0]);
    }

    const savedTheme = getThemePreference();
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedSound = getSoundPreference();
    setSoundEnabled(savedSound);
  }, []);

  // Update a single verse's translation
  const handleChangeVerseTranslation = async (verseId, targetTranslation) => {
    const targetVerse = verses.find(v => v.id === verseId);
    if (!targetVerse) return;

    setIsTranslating(true);
    try {
      const fetched = await fetchBiblePassage(targetVerse.reference, targetTranslation);
      const updatedVerse = {
        ...targetVerse,
        text: fetched.text,
        translation: fetched.translation
      };

      const updatedList = verses.map(v => (v.id === verseId ? updatedVerse : v));
      setVerses(updatedList);
      saveVerses(updatedList);

      if (selectedVerse?.id === verseId) {
        setSelectedVerse(updatedVerse);
      }
      playSuccessSound(soundEnabled);
    } catch (err) {
      console.error('Failed to update verse translation:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Update global translation & re-fetch all verses
  const handleChangeTranslation = async (newTr) => {
    setTranslationState(newTr);
    setPreferredTranslation(newTr);
    setIsTranslating(true);

    try {
      const updatedList = await Promise.all(
        verses.map(async (v) => {
          try {
            const fetched = await fetchBiblePassage(v.reference, newTr);
            return { ...v, text: fetched.text, translation: fetched.translation };
          } catch (e) {
            return { ...v, translation: newTr };
          }
        })
      );

      setVerses(updatedList);
      saveVerses(updatedList);
      if (selectedVerse) {
        const updatedSel = updatedList.find(v => v.id === selectedVerse.id);
        if (updatedSel) setSelectedVerse(updatedSel);
      }
      playSuccessSound(soundEnabled);
    } catch (err) {
      console.error('Global translation update failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSignIn = (newUser) => {
    setUser(newUser);
    saveStoredUser(newUser);
  };

  const handleSignOut = () => {
    setUser(null);
    saveStoredUser(null);
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setThemePreference(newTheme);
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    setSoundPreference(nextState);
  };

  const refreshData = () => {
    const loaded = getStoredVerses();
    setVerses(loaded);
    setStreakData(getStreakData());
    if (loaded.length > 0) setSelectedVerse(loaded[0]);
  };

  // Update verse progress & SRS score
  const handleUpdateVerseProgress = (updatedVerse, gradeOrSRS) => {
    let updatedList;
    if (typeof gradeOrSRS === 'object') {
      updatedList = verses.map((v) =>
        v.id === updatedVerse.id ? { ...v, ...gradeOrSRS } : v
      );
    } else {
      updatedList = verses.map((v) => {
        if (v.id === updatedVerse.id) {
          const newMastery = gradeOrSRS >= 4 ? 'Mastered' : 'Reviewing';
          return { ...v, mastery: newMastery, timesReviewed: (v.timesReviewed || 0) + 1 };
        }
        return v;
      });
    }

    setVerses(updatedList);
    saveVerses(updatedList);
    recordPracticeActivity();
    setStreakData(getStreakData());
  };

  const handleAddVerse = (newVerse) => {
    const updated = [newVerse, ...verses];
    setVerses(updated);
    saveVerses(updated);
    setSelectedVerse(newVerse);
    setActiveTab('practice');
  };

  const handleUpdateVerse = (updatedVerse) => {
    const updatedList = verses.map((v) => (v.id === updatedVerse.id ? updatedVerse : v));
    setVerses(updatedList);
    saveVerses(updatedList);
    if (selectedVerse?.id === updatedVerse.id) {
      setSelectedVerse(updatedVerse);
    }
  };

  const handleDeleteVerse = (idToDelete) => {
    const updatedList = verses.filter((v) => v.id !== idToDelete);
    setVerses(updatedList);
    saveVerses(updatedList);
    if (selectedVerse?.id === idToDelete) {
      setSelectedVerse(updatedList[0] || null);
    }
  };

  const handleSelectVerseMode = (verse, mode) => {
    if (verse) setSelectedVerse(verse);
    setPracticeMode(mode);
    setActiveTab('practice');
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakCount={streakData.count}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={soundEnabled}
      />

      {/* Main View Shell */}
      <main className="main-content">
        {/* Mobile Header Bar */}
        <header className="flex md:hidden items-center justify-between pb-4 mb-4 border-b border-subtle">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Memorize Verses" className="w-7 h-7 object-contain dark:invert" />
            <h2 className="serif-heading text-lg font-bold text-primary">Memorize Verses</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleTheme}
              className="btn btn-ghost btn-sm p-1 text-muted"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="btn btn-ghost btn-sm p-1 text-muted"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary btn-sm gap-1"
              style={{ backgroundColor: '#A33A2E' }}
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </header>

        {/* View Routing */}
        {activeTab === 'dashboard' && (
          <DashboardStats
            verses={verses}
            streakCount={streakData.count}
            onSelectVerseMode={handleSelectVerseMode}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onChangeVerseTranslation={handleChangeVerseTranslation}
          />
        )}

        {activeTab === 'library' && (
          <VerseLibrary
            verses={verses}
            onSelectVerseMode={handleSelectVerseMode}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenEditModal={(v) => setEditingVerse(v)}
            onOpenShareModal={(v) => setSharingVerse(v)}
            onChangeVerseTranslation={handleChangeVerseTranslation}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsView
            verses={verses}
            streakCount={streakData.count}
          />
        )}

        {activeTab === 'practice' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Header & Mode Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <button
                  onClick={() => {
                    playClickSound(soundEnabled);
                    setActiveTab('library');
                  }}
                  className="btn btn-ghost btn-sm gap-1 text-xs text-muted mb-1"
                >
                  <ArrowLeft size={14} /> Back to Library
                </button>
                <h1 className="serif-heading">Interactive Practice & Games</h1>
              </div>

              {/* Verse Selector Dropdown & Live Translation Switcher */}
              <div className="flex flex-wrap items-center gap-2">
                {practiceMode !== 'match' && practiceMode !== 'quiz' && (
                  <>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-muted">Verse:</label>
                      <select
                        value={selectedVerse?.id || ''}
                        onChange={(e) => {
                          playClickSound(soundEnabled);
                          const found = verses.find((v) => v.id === e.target.value);
                          if (found) setSelectedVerse(found);
                        }}
                        className="input-field text-xs sm:text-sm font-semibold"
                        style={{ width: 'auto', maxWidth: '200px' }}
                      >
                        {verses.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.reference} ({v.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 bg-card px-2.5 py-1 rounded-lg border border-subtle">
                      <span className="text-xs font-bold text-muted uppercase tracking-wider">Version:</span>
                      <select
                        value={selectedVerse?.translation || preferredTranslation || 'NIV'}
                        disabled={isTranslating}
                        onChange={(e) => {
                          playClickSound(soundEnabled);
                          if (selectedVerse) {
                            handleChangeVerseTranslation(selectedVerse.id, e.target.value);
                          } else {
                            handleChangeTranslation(e.target.value);
                          }
                        }}
                        className="input-field text-xs font-bold font-mono py-0.5 px-2 bg-secondary/50 cursor-pointer"
                        style={{ width: 'auto' }}
                      >
                        {TRANSLATIONS.map((t) => (
                          <option key={t.id} value={t.id}>{t.id}</option>
                        ))}
                      </select>
                      {isTranslating && <RefreshCw size={12} className="animate-spin" style={{ color: '#A33A2E' }} />}
                    </div>
                  </>
                )}

                {(practiceMode === 'match' || practiceMode === 'quiz') && (
                  <div className="flex items-center gap-1.5 bg-card px-2.5 py-1 rounded-lg border border-subtle">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Game Version:</span>
                    <select
                      value={preferredTranslation || 'NIV'}
                      disabled={isTranslating}
                      onChange={(e) => {
                        playClickSound(soundEnabled);
                        handleChangeTranslation(e.target.value);
                      }}
                      className="input-field text-xs font-bold font-mono py-0.5 px-2 bg-secondary/50 cursor-pointer"
                      style={{ width: 'auto' }}
                    >
                      {TRANSLATIONS.map((t) => (
                        <option key={t.id} value={t.id}>{t.id}</option>
                      ))}
                    </select>
                    {isTranslating && <RefreshCw size={12} className="animate-spin" style={{ color: '#A33A2E' }} />}
                  </div>
                )}
              </div>
            </div>

            {/* Memorization Technique & Game Switcher */}
            <div className="flex flex-wrap gap-1.5 p-1.5 bg-secondary rounded-lg border border-subtle">
              {[
                { id: 'cloze', label: 'Fill in Blanks' },
                { id: 'firstletter', label: 'First-Letter' },
                { id: 'scramble', label: 'Scramble' },
                { id: 'srs', label: 'Flashcards' },
                { id: 'match', label: '🎮 Memory Match' },
                { id: 'quiz', label: '🏆 Scripture Quiz' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    playClickSound(soundEnabled);
                    setPracticeMode(m.id);
                  }}
                  className={`flex-1 min-w-[110px] py-2 px-2.5 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                    practiceMode === m.id
                      ? 'bg-card text-primary shadow-xs border border-subtle'
                      : 'text-muted hover:text-primary'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Audio Recitation Widget */}
            {selectedVerse && practiceMode !== 'match' && practiceMode !== 'quiz' && (
              <AudioPlayer text={selectedVerse.text} reference={selectedVerse.reference} />
            )}

            {/* Active Mode Component */}
            {selectedVerse && practiceMode === 'cloze' && (
              <FillInBlanks
                verse={selectedVerse}
                onComplete={handleUpdateVerseProgress}
                soundEnabled={soundEnabled}
              />
            )}

            {selectedVerse && practiceMode === 'firstletter' && (
              <FirstLetterPrompt
                verse={selectedVerse}
                onComplete={handleUpdateVerseProgress}
                soundEnabled={soundEnabled}
              />
            )}

            {selectedVerse && practiceMode === 'scramble' && (
              <WordScramble
                verse={selectedVerse}
                onComplete={handleUpdateVerseProgress}
                soundEnabled={soundEnabled}
              />
            )}

            {selectedVerse && practiceMode === 'srs' && (
              <FlashcardSRS
                verse={selectedVerse}
                onRateRecall={handleUpdateVerseProgress}
                soundEnabled={soundEnabled}
              />
            )}

            {practiceMode === 'match' && (
              <MemoryMatch
                verses={verses}
                onComplete={handleUpdateVerseProgress}
                soundEnabled={soundEnabled}
              />
            )}

            {practiceMode === 'quiz' && (
              <ReferenceQuiz
                verses={verses}
                onComplete={handleUpdateVerseProgress}
                soundEnabled={soundEnabled}
              />
            )}
          </div>
        )}
      </main>

      {/* Add Custom Verse Modal */}
      <AddVerseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddVerse={handleAddVerse}
        soundEnabled={soundEnabled}
        preferredTranslation={preferredTranslation}
      />

      {/* Edit Verse Modal */}
      <EditVerseModal
        verse={editingVerse}
        isOpen={!!editingVerse}
        onClose={() => setEditingVerse(null)}
        onUpdateVerse={handleUpdateVerse}
        onDeleteVerse={handleDeleteVerse}
        soundEnabled={soundEnabled}
      />

      {/* Share Verse Modal */}
      <ShareVerseModal
        verse={sharingVerse}
        isOpen={!!sharingVerse}
        onClose={() => setSharingVerse(null)}
        soundEnabled={soundEnabled}
      />

      {/* App Settings & Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        preferredTranslation={preferredTranslation}
        onChangeTranslation={handleChangeTranslation}
        onRefreshData={refreshData}
      />

      {/* Cloud Sync Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}
