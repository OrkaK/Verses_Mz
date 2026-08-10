import React, { useState } from 'react';
import { X, LogIn, UserCheck, ShieldCheck, Cloud, Mail, Lock, Sparkles, Check } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../utils/audioEffects';

export default function AuthModal({ isOpen, onClose, user, onSignIn, onSignOut, soundEnabled = true }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide email and password.');
      return;
    }

    playClickSound(soundEnabled);
    const name = displayName.trim() || email.split('@')[0];
    const newUser = {
      email: email.trim(),
      name,
      avatar: name.charAt(0).toUpperCase(),
      signedInAt: new Date().toISOString()
    };

    onSignIn(newUser);
    playSuccessSound(soundEnabled);
    onClose();
  };

  const handleDemoGoogleSignIn = () => {
    playClickSound(soundEnabled);
    const googleUser = {
      email: 'believer@example.com',
      name: 'Scripture Scholar',
      avatar: 'S',
      provider: 'Google',
      signedInAt: new Date().toISOString()
    };
    onSignIn(googleUser);
    playSuccessSound(soundEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="card w-full max-w-md p-6 bg-card relative flex flex-col gap-5 shadow-2xl border border-subtle max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ borderRadius: '16px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-subtle">
          <div className="flex items-center gap-2">
            <Cloud size={20} style={{ color: '#8A737D' }} />
            <h3 className="serif-heading text-xl">
              {user ? 'Account & Sync' : isSignUp ? 'Create Cloud Account' : 'Sign In to Sync'}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon text-muted">
            <X size={20} />
          </button>
        </div>

        {user ? (
          /* Signed In Profile View */
          <div className="flex flex-col gap-5">
            <div className="p-4 rounded-xl border border-subtle bg-secondary/30 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-terracotta text-white flex items-center justify-center font-bold text-lg shadow-sm" style={{ backgroundColor: '#8A737D' }}>
                {user.avatar || 'U'}
              </div>
              <div className="flex flex-col">
                <div className="font-bold text-base text-primary">{user.name}</div>
                <div className="text-xs text-muted">{user.email}</div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <ShieldCheck size={14} /> Cloud Sync Active
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-medium">
              ✨ Your verses, streaks, and mastery progress are backed up and synced to the cloud.
            </div>

            <button
              onClick={() => {
                playClickSound(soundEnabled);
                onSignOut();
                onClose();
              }}
              className="btn btn-secondary text-rose-600 border-rose-200 hover:bg-rose-50 text-xs font-bold py-2.5"
            >
              Sign Out to Guest Mode
            </button>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div className="flex flex-col gap-4">
            <div className="text-xs text-muted leading-relaxed">
              💡 <strong>Optional:</strong> You can use Verse 100% free without an account. Sign in only if you want to sync your scripture progress across your devices.
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            {/* Quick 1-Click Google Sign-In */}
            <button
              type="button"
              onClick={handleDemoGoogleSignIn}
              className="btn btn-secondary w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold border-medium hover:bg-hover"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google
            </button>

            <div className="relative my-1 flex items-center justify-center text-xs text-muted">
              <span className="bg-card px-2 relative z-10">or with email</span>
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-subtle"></div></div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah M."
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="input-field"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-9"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full gap-2 text-xs font-bold py-2.5 mt-1"
                style={{ backgroundColor: '#8A737D' }}
              >
                <LogIn size={16} /> {isSignUp ? 'Create Cloud Account' : 'Sign In & Enable Sync'}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-subtle">
              <button
                onClick={() => {
                  playClickSound(soundEnabled);
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-xs text-terracotta hover:underline font-semibold"
                style={{ color: '#8A737D' }}
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
