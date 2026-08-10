import React from 'react';
import { Flame, BrainCircuit, CheckCircle2, Award, ArrowRight, Sparkles, BookOpen, Gamepad2, HelpCircle } from 'lucide-react';

export default function DashboardStats({ verses, streakCount, onSelectVerseMode, onOpenAddModal }) {
  // Statistics
  const totalVerses = verses.length;
  const masteredCount = verses.filter((v) => v.mastery === 'Mastered').length;
  const learningCount = verses.filter((v) => v.mastery === 'Learning' || v.mastery === 'Reviewing').length;
  const newCount = verses.filter((v) => v.mastery === 'New').length;

  // Recommended review verses (learning/reviewing first, then new)
  const dueVerses = verses
    .filter((v) => v.mastery !== 'Mastered')
    .sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate))
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ backgroundColor: '#F7F3EC', borderColor: '#EAE3D9' }}>
        <div>
          <span className="badge badge-terracotta mb-2">Welcome Back</span>
          <h1 className="serif-heading mb-1" style={{ color: '#1E293B' }}>Scripture Study & Memorization</h1>
          <p className="text-sm" style={{ color: '#475569' }}>
            Internalize God's word with focused daily recall practice & interactive games.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-subtle shadow-xs">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
            <Flame size={22} />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">Streak</div>
            <div className="text-lg font-bold text-primary">{streakCount} {streakCount === 1 ? 'Day' : 'Days'}</div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-4 flex flex-col justify-between">
          <div className="text-xs font-medium text-muted mb-1">Total Verses</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-primary">{totalVerses}</span>
            <BookOpen size={18} className="text-muted/60" />
          </div>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <div className="text-xs font-medium text-muted mb-1">In Progress</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold" style={{ color: '#A33A2E' }}>{learningCount}</span>
            <BrainCircuit size={18} style={{ color: '#A33A2E' }} />
          </div>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <div className="text-xs font-medium text-muted mb-1">Mastered</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold" style={{ color: '#556B2F' }}>{masteredCount}</span>
            <CheckCircle2 size={18} style={{ color: '#556B2F' }} />
          </div>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <div className="text-xs font-medium text-muted mb-1">Queue / New</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-secondary">{newCount}</span>
            <Sparkles size={18} className="text-muted/60" />
          </div>
        </div>
      </div>

      {/* Today's Recommended Review Queue */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={20} style={{ color: '#A33A2E' }} />
            <h3 className="serif-heading text-lg">Recommended Today</h3>
          </div>
          <span className="text-xs text-muted font-medium">Spaced Repetition Schedule</span>
        </div>

        {dueVerses.length === 0 ? (
          <div className="text-center py-6 text-muted">
            <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-600" />
            <p className="font-semibold text-primary">All caught up for today!</p>
            <p className="text-xs mt-1">You have reviewed all verses in your queue. Try the Memory Match or Reference Quiz games!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {dueVerses.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-lg bg-secondary/50 border border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-medium transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-neutral text-xs">{v.category}</span>
                    <span className="text-xs text-muted font-bold">{v.translation}</span>
                  </div>
                  <h4 className="serif-heading text-base font-bold">{v.reference}</h4>
                  <p className="scripture-text text-xs line-clamp-1 opacity-85">"{v.text}"</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onSelectVerseMode(v, 'cloze')}
                    className="btn btn-secondary btn-sm text-xs"
                  >
                    Cloze
                  </button>
                  <button
                    onClick={() => onSelectVerseMode(v, 'srs')}
                    className="btn btn-primary btn-sm gap-1 text-xs"
                  >
                    Start <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Interactive Games Section */}
      <div className="flex flex-col gap-3">
        <h3 className="serif-heading text-lg flex items-center gap-2">
          <Gamepad2 size={20} style={{ color: '#A33A2E' }} /> Practice Games & Modes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div 
            onClick={() => onSelectVerseMode(null, 'match')} 
            className="card card-interactive p-4 flex flex-col gap-2 hover:border-terracotta transition-colors"
            style={{ borderColor: '#F2D4C3' }}
          >
            <span className="badge badge-terracotta self-start">🎮 Game Mode</span>
            <h4 className="serif-heading text-base font-bold">Memory Match</h4>
            <p className="text-xs text-secondary">Flip cards to pair passage references (e.g. John 3:16) with their scripture verse text.</p>
          </div>

          <div 
            onClick={() => onSelectVerseMode(null, 'quiz')} 
            className="card card-interactive p-4 flex flex-col gap-2 hover:border-amber transition-colors"
            style={{ borderColor: '#FDE68A' }}
          >
            <span className="badge badge-amber self-start">🏆 Trivia Mode</span>
            <h4 className="serif-heading text-base font-bold">Scripture Trivia Quiz</h4>
            <p className="text-xs text-secondary">Fast-paced 5-question trivia challenge testing references and scripture snippets.</p>
          </div>

          <div 
            onClick={() => dueVerses[0] && onSelectVerseMode(dueVerses[0], 'cloze')} 
            className="card card-interactive p-4 flex flex-col gap-2 hover:border-sage transition-colors"
            style={{ borderColor: '#C8E6C9' }}
          >
            <span className="badge badge-sage self-start">✏️ Cloze Mode</span>
            <h4 className="serif-heading text-base font-bold">Fill in the Blanks</h4>
            <p className="text-xs text-secondary">Test your precise word recall by completing missing verse cloze inputs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
