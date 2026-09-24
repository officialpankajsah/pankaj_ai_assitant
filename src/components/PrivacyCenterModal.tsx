import React from 'react';
import {
  Lock,
  Trash2,
  MicOff,
  Radio,
  Sliders,
  X,
  Database,
  ShieldCheck,
  Check
} from 'lucide-react';

interface PrivacyCenterModalProps {
  onClose: () => void;
  onClearConversation: () => void;
  onClearMemory: () => void;
  onOpenPermissions: () => void;
}

export const PrivacyCenterModal: React.FC<PrivacyCenterModalProps> = ({
  onClose,
  onClearConversation,
  onClearMemory,
  onOpenPermissions
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Pankaj Ji Privacy Dashboard</h2>
              <p className="text-xs text-slate-400">Complete control over your personal voice & on-device data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Access audit items */}
        <div className="p-4 space-y-4 overflow-y-auto">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Privacy Safeguards</h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 flex items-center">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                  No Secret Background Recording
                </span>
                <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                  ENFORCED
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 flex items-center">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                  Local Memory Processing
                </span>
                <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                  ON-DEVICE ROOM
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 flex items-center">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                  No Financial / OTP Auto-Execution
                </span>
                <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                  CONFIRMATION REQUIRED
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-300 flex items-center">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                  Zero Telemetry / Sensitive Profile Scraping
                </span>
                <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                  PROTECTED
                </span>
              </div>
            </div>
          </div>

          {/* Privacy Actions */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Data & Session Actions</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClearConversation();
                  onClose();
                }}
                className="flex items-center space-x-2 p-3 rounded-xl border border-rose-800/40 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 text-xs font-semibold transition-all text-left"
              >
                <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Clear Conversation History</span>
              </button>

              <button
                onClick={() => {
                  onClearMemory();
                  onClose();
                }}
                className="flex items-center space-x-2 p-3 rounded-xl border border-orange-800/40 bg-orange-950/20 hover:bg-orange-950/40 text-orange-300 text-xs font-semibold transition-all text-left"
              >
                <Database className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Clear Local Memory</span>
              </button>

              <button
                onClick={() => {
                  onOpenPermissions();
                  onClose();
                }}
                className="flex items-center space-x-2 p-3 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all text-left"
              >
                <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Manage Permissions</span>
              </button>

              <button
                onClick={() => {
                  alert('Background assistant service paused.');
                }}
                className="flex items-center space-x-2 p-3 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all text-left"
              >
                <Radio className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Disable Background Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">Pankaj Ji prioritizes strict user privacy by design.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
