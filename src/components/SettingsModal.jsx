import React, { useState } from 'react';
import { X, Settings, Moon, Sun, Volume2, VolumeX, Download, Upload, RefreshCw, Check, AlertCircle, Cloud, User, ShieldCheck, BookOpen } from 'lucide-react';
import { exportUserDataJSON, importUserDataJSON } from '../utils/storage';
import { TRANSLATIONS } from '../utils/bibleApi';
import { playClickSound, playSuccessSound } from '../utils/audioEffects';

export default function SettingsModal({
  isOpen,
  onClose,
  user,
  onOpenAuth,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  preferredTranslation,
  onChangeTranslation,
  onRefreshData
}) {
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    playClickSound(soundEnabled);
    const jsonStr = exportUserDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verse_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    playSuccessSound(soundEnabled);
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    playClickSound(soundEnabled);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        importUserDataJSON(evt.target.result);
        setImportSuccess(true);
        setImportError('');
        playSuccessSound(soundEnabled);
        onRefreshData();
        setTimeout(() => setImportSuccess(false), 3000);
      } catch (err) {
        setImportError('Failed to import file. Make sure it is a valid Verse JSON backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    playClickSound(soundEnabled);
    localStorage.clear();
    onRefreshData();
    setConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="card w-full max-w-lg p-6 bg-card relative flex flex-col gap-6 shadow-xl border border-subtle max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ borderRadius: '16px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-subtle">
          <div className="flex items-center gap-2">
            <Settings size={20} style={{ color: '#A33A2E' }} />
            <h3 className="serif-heading text-xl">App Settings & Preferences</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon text-muted">
            <X size={20} />
          </button>
        </div>

        {/* Account Cloud Sync Section */}
        <div className="flex flex-col gap-3">
          <h4 className="serif-heading text-sm font-bold uppercase tracking-wider text-muted">Account & Cloud Sync</h4>

          <div className="p-4 rounded-lg border border-subtle bg-secondary/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-600'}`}>
                {user ? user.avatar : <User size={18} />}
              </div>
              <div>
                <div className="text-sm font-bold">{user ? user.name : 'Guest Mode (Local Storage)'}</div>
                <div className="text-xs text-muted">
                  {user ? user.email : 'Practice offline without sign-in, or sign in to sync across devices.'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound(soundEnabled);
                onClose();
                onOpenAuth();
              }}
              className="btn btn-secondary btn-sm text-xs font-bold shrink-0"
              style={user ? undefined : { borderColor: '#A33A2E', color: '#A33A2E' }}
            >
              {user ? 'Manage Sync' : 'Sign In to Sync'}
            </button>
          </div>
        </div>

        {/* Section 1: Appearance & Sound */}
        <div className="flex flex-col gap-4 pt-2 border-t border-subtle">
          <h4 className="serif-heading text-sm font-bold uppercase tracking-wider text-muted">Preferences</h4>

          <div className="flex items-center justify-between p-3 rounded-lg border border-subtle bg-secondary/30">
            <div className="flex items-center gap-3">
              <BookOpen size={20} style={{ color: '#A33A2E' }} />
              <div>
                <div className="text-sm font-bold">Default Bible Translation</div>
                <div className="text-xs text-muted">Select preferred translation for auto-fill & lookup</div>
              </div>
            </div>
            <select
              value={preferredTranslation || 'NIV'}
              onChange={(e) => {
                playClickSound(soundEnabled);
                onChangeTranslation(e.target.value);
              }}
              className="input-field text-xs font-bold shrink-0"
              style={{ width: 'auto' }}
            >
              {TRANSLATIONS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-subtle bg-secondary/30">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon size={20} className="text-amber-400" /> : <Sun size={20} style={{ color: '#A33A2E' }} />}
              <div>
                <div className="text-sm font-bold">Dark Theme</div>
                <div className="text-xs text-muted">Switch between warm light mode and midnight dark mode</div>
              </div>
            </div>
            <button
              onClick={() => {
                playClickSound(soundEnabled);
                onToggleTheme();
              }}
              className="btn btn-secondary btn-sm capitalize text-xs font-semibold"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-subtle bg-secondary/30">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 size={20} style={{ color: '#556B2F' }} /> : <VolumeX size={20} className="text-muted" />}
              <div>
                <div className="text-sm font-bold">Web Audio Sound FX</div>
                <div className="text-xs text-muted">Play subtle chimes on correct answers and card flips</div>
              </div>
            </div>
            <button
              onClick={() => {
                onToggleSound();
                playClickSound(!soundEnabled);
              }}
              className="btn btn-secondary btn-sm text-xs font-semibold"
            >
              {soundEnabled ? 'Mute FX' : 'Enable FX'}
            </button>
          </div>
        </div>

        {/* Section 2: Data Backup & Restore */}
        <div className="flex flex-col gap-3 pt-2 border-t border-subtle">
          <h4 className="serif-heading text-sm font-bold uppercase tracking-wider text-muted">Data Backup & Sync</h4>

          {importSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-medium flex items-center gap-2">
              <Check size={16} className="text-emerald-600" /> Backup data imported successfully!
            </div>
          )}

          {importError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-medium flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-600" /> {importError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              className="btn btn-secondary flex items-center justify-center gap-2 text-xs font-bold py-2.5"
            >
              <Download size={16} /> Export JSON Backup
            </button>

            <label className="btn btn-secondary flex items-center justify-center gap-2 text-xs font-bold py-2.5 cursor-pointer">
              <Upload size={16} /> Import JSON Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Reset Data */}
        <div className="flex flex-col gap-3 pt-2 border-t border-subtle">
          <h4 className="serif-heading text-sm font-bold uppercase tracking-wider text-muted">Danger Zone</h4>

          {confirmReset ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900">Reset all custom verses and streaks?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="btn btn-secondary btn-sm text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="btn btn-primary btn-sm text-xs"
                  style={{ backgroundColor: '#C62828' }}
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="btn btn-ghost text-rose-600 border border-rose-200 hover:bg-rose-50 text-xs font-bold gap-2 py-2"
            >
              <RefreshCw size={16} /> Reset All Local Data to Default
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
