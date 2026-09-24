import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  LogOut,
  X,
  UserCheck,
  Shield,
  RefreshCw,
  Database,
  Sparkles
} from 'lucide-react';
import { User } from 'firebase/auth';
import { signInWithGoogle, signOutUser } from '../services/firebase';

interface FirebaseAuthModalProps {
  currentUser: User | null;
  onClose: () => void;
}

export const FirebaseAuthModal: React.FC<FirebaseAuthModalProps> = ({
  currentUser,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOutUser();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center">
                Firebase Cloud Sync <Sparkles className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
              </h2>
              <p className="text-xs text-slate-400">
                Firestore persistent backup for Pankaj Ji
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {currentUser ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-center space-x-3.5">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-12 h-12 rounded-full border-2 border-emerald-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    {currentUser.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                    <span>{currentUser.displayName || 'Pankaj Ji User'}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs text-slate-400 truncate max-w-[200px]">
                    {currentUser.email}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                    Cloud Firestore Active
                  </div>
                </div>
              </div>

              {/* Sync features list */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06] space-y-2 text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                  Synchronized to Firebase:
                </span>
                <div className="space-y-1 text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span>Chat history & assistant responses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database className="w-3.5 h-3.5 text-orange-400" />
                    <span>Learned personal memories & routines</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Voice agent preference (Male/Female, speed)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database className="w-3.5 h-3.5 text-rose-400" />
                    <span>Alarms and scheduled reminders</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-rose-800/50 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-bold transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>{loading ? 'Signing out...' : 'Sign Out of Cloud'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-2 space-y-1.5">
                <Cloud className="w-12 h-12 text-amber-400/60 mx-auto" />
                <h3 className="text-sm font-bold text-slate-100">Sync Across Devices</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Sign in with Google to persist your conversations, voice agent preferences, and learned routines in Cloud Firestore.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300">
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2.5 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all active:scale-95"
              >
                <UserCheck className="w-4 h-4" />
                <span>{loading ? 'Connecting...' : 'Sign In with Google'}</span>
              </button>

              <div className="text-center text-[10px] text-slate-500 flex items-center justify-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Protected by Zero-Trust Firestore Security Rules</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
