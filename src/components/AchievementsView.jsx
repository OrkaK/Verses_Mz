import React from 'react';
import { Award, Flame, BookOpen, CheckCircle2, Sparkles, Trophy, Star } from 'lucide-react';

export default function AchievementsView({ verses, streakCount }) {
  const totalVerses = verses.length;
  const masteredCount = verses.filter(v => v.mastery === 'Mastered').length;
  const inProgressCount = verses.filter(v => v.mastery === 'Learning' || v.mastery === 'Reviewing').length;

  const totalWordsStored = verses.reduce((sum, v) => sum + (v.text ? v.text.split(/\s+/).length : 0), 0);
  const totalWordsMastered = verses
    .filter(v => v.mastery === 'Mastered')
    .reduce((sum, v) => sum + (v.text ? v.text.split(/\s+/).length : 0), 0);

  const ACHIEVEMENTS = [
    {
      id: 'first_verse',
      title: 'First Step',
      desc: 'Add or practice your first scripture verse',
      icon: BookOpen,
      unlocked: totalVerses > 0,
      req: '1 Verse Saved'
    },
    {
      id: 'streak_3',
      title: 'Faithful Habit',
      desc: 'Maintain a 3-day scripture study streak',
      icon: Flame,
      unlocked: streakCount >= 3,
      req: '3-Day Streak'
    },
    {
      id: 'master_3',
      title: 'Word Collector',
      desc: 'Master 3 scripture passages with spaced recall',
      icon: CheckCircle2,
      unlocked: masteredCount >= 3,
      req: '3 Verses Mastered'
    },
    {
      id: 'streak_7',
      title: 'Scripture Scholar',
      desc: 'Maintain a 7-day study streak',
      icon: Trophy,
      unlocked: streakCount >= 7,
      req: '7-Day Streak'
    },
    {
      id: 'words_100',
      title: 'Century of Words',
      desc: 'Memorize over 100 total scripture words',
      icon: Star,
      unlocked: totalWordsMastered >= 100,
      req: '100 Words Mastered'
    },
    {
      id: 'master_10',
      title: 'Memory Champion',
      desc: 'Master 10 or more Bible verses',
      icon: Award,
      unlocked: masteredCount >= 10,
      req: '10 Verses Mastered'
    }
  ];

  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const unlockPercent = Math.round((unlockedCount / ACHIEVEMENTS.length) * 100);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Banner */}
      <div className="card p-6 bg-secondary/50 border border-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="badge badge-terracotta mb-2">Milestones & Progress</span>
          <h1 className="serif-heading mb-1">Study Achievements</h1>
          <p className="text-sm text-secondary">
            Track your streak, total scripture words internalized, and unlocked badges.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-subtle shadow-xs">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
            <Trophy size={24} style={{ color: '#D97706' }} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">Badges Unlocked</div>
            <div className="text-xl font-bold text-primary">{unlockedCount} / {ACHIEVEMENTS.length} ({unlockPercent}%)</div>
          </div>
        </div>
      </div>

      {/* Scripture Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-4 flex flex-col justify-between">
          <div className="text-xs font-medium text-muted mb-1">Current Streak</div>
          <div className="text-2xl font-bold text-primary flex items-center gap-1.5">
            <Flame size={22} style={{ color: '#A33A2E' }} /> {streakCount} Days
          </div>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <div className="text-xs font-medium text-muted mb-1">Mastered Passages</div>
          <div className="text-2xl font-bold" style={{ color: '#556B2F' }}>
            {masteredCount} <span className="text-xs font-normal text-muted">/ {totalVerses}</span>
          </div>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <div className="text-xs font-medium text-muted mb-1">Words Stored</div>
          <div className="text-2xl font-bold text-primary">
            {totalWordsStored.toLocaleString()}
          </div>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <div className="text-xs font-medium text-muted mb-1">Words Internalized</div>
          <div className="text-2xl font-bold" style={{ color: '#A33A2E' }}>
            {totalWordsMastered.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="flex flex-col gap-3">
        <h3 className="serif-heading text-lg flex items-center gap-2">
          <Award size={20} style={{ color: '#A33A2E' }} /> Unlocked Badges
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className={`card p-4 flex items-start gap-3 transition-all ${
                  item.unlocked
                    ? 'border-terracotta bg-card shadow-xs'
                    : 'opacity-60 bg-secondary/40 border-dashed'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    item.unlocked ? 'bg-terracotta text-white shadow-xs' : 'bg-stone-200 text-stone-500'
                  }`}
                  style={{ backgroundColor: item.unlocked ? '#A33A2E' : undefined }}
                >
                  <IconComponent size={20} />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="serif-heading text-sm font-bold">{item.title}</h4>
                    {item.unlocked && (
                      <span className="badge badge-sage text-[10px] py-0.5">Unlocked</span>
                    )}
                  </div>
                  <p className="text-xs text-secondary leading-snug">{item.desc}</p>
                  <span className="text-[10px] text-muted font-bold mt-1">Goal: {item.req}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
