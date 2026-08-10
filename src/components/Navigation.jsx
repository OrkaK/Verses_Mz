import React from 'react';
import { BookOpen, BrainCircuit, LayoutDashboard, Sparkles, Flame, Plus, Award, Settings, Sun, Moon, User, Cloud, ShieldCheck } from 'lucide-react';
import { playClickSound } from '../utils/audioEffects';

export default function Navigation({
  activeTab,
  setActiveTab,
  streakCount,
  onOpenAddModal,
  onOpenSettings,
  onOpenAuth,
  user,
  theme,
  onToggleTheme,
  soundEnabled = true
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'library', label: 'Verse Library', icon: BookOpen },
    { id: 'practice', label: 'Memorize & Games', icon: BrainCircuit },
    { id: 'achievements', label: 'Badges', icon: Award }
  ];

  const handleTabClick = (id) => {
    playClickSound(soundEnabled);
    setActiveTab(id);
  };

  return (
    <aside className="nav-sidebar">
      {/* Brand Header for Desktop */}
      <div className="hidden md:flex flex-col gap-4 mb-6 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-terracotta flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: '#A33A2E' }}>
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <h2 className="serif-heading text-xl font-bold" style={{ fontSize: '1.25rem' }}>Verse</h2>
              <p className="text-xs text-muted">Scripture Memorization</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                playClickSound(soundEnabled);
                onToggleTheme();
              }}
              className="btn btn-ghost btn-sm p-1.5 text-muted hover:text-primary"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => {
                playClickSound(soundEnabled);
                onOpenSettings();
              }}
              className="btn btn-ghost btn-sm p-1.5 text-muted hover:text-primary"
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Account Cloud Sync Status Button */}
        <button
          onClick={() => {
            playClickSound(soundEnabled);
            onOpenAuth();
          }}
          className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-all ${
            user
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 hover:bg-emerald-100/60'
              : 'bg-secondary/40 border-subtle text-secondary hover:border-medium'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${user ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-600'}`}>
              {user ? user.avatar : <User size={14} />}
            </div>
            <div className="flex flex-col">
              <span className="font-bold line-clamp-1">{user ? user.name : 'Guest Mode'}</span>
              <span className="text-[10px] text-muted">{user ? 'Cloud Sync Active' : 'Sign in to sync'}</span>
            </div>
          </div>
          {user ? <ShieldCheck size={16} className="text-emerald-600" /> : <Cloud size={15} className="text-terracotta" />}
        </button>

        {/* Streak Counter Badge */}
        <div className="flex items-center justify-between p-3 rounded-lg border bg-secondary/50 border-subtle">
          <div className="flex items-center gap-2">
            <Flame size={20} style={{ color: '#A33A2E' }} />
            <div>
              <div className="text-xs font-medium text-muted">Daily Streak</div>
              <div className="text-sm font-bold text-primary">{streakCount} {streakCount === 1 ? 'Day' : 'Days'}</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            playClickSound(soundEnabled);
            onOpenAddModal();
          }}
          className="btn btn-primary w-full mt-2"
          style={{ width: '100%', backgroundColor: '#A33A2E' }}
        >
          <Plus size={18} /> Add Custom Verse
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex md:flex-col gap-1 w-full justify-around md:justify-start">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Footer Quote */}
      <div className="hidden md:block mt-auto p-3 text-xs rounded-md bg-secondary/50 border border-subtle text-muted">
        <p className="italic">"Your word is a lamp for my feet, a light on my path."</p>
        <p className="font-medium mt-1 text-secondary">— Psalm 119:105</p>
      </div>
    </aside>
  );
}
