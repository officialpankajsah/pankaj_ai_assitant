import React from 'react';
import { Mic, Search, Bell, Sparkles } from 'lucide-react';

interface AndroidWidgetProps {
  onAction: (action: 'TALK' | 'SEARCH' | 'REMINDER') => void;
}

export const AndroidWidget: React.FC<AndroidWidgetProps> = ({ onAction }) => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-amber-950/30 border border-white/[0.08] rounded-3xl p-4 shadow-xl backdrop-blur-2xl">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 flex items-center justify-center shadow-md shadow-amber-950/40">
            <span className="text-[11px] font-extrabold text-slate-950">PJ</span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center tracking-tight">
              Pankaj Ji Assistant <Sparkles className="w-3 h-3 text-amber-400 ml-1.5" />
            </div>
            <div className="text-[11px] text-amber-300 font-medium">
              Namaste Ji 👋 • Voice Ready
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-white/[0.06]">
          Android 14 Widget
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onAction('TALK')}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all active:scale-95"
        >
          <Mic className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>TALK</span>
        </button>

        <button
          onClick={() => onAction('SEARCH')}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/[0.06] font-semibold text-xs transition-all active:scale-95"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>SEARCH</span>
        </button>

        <button
          onClick={() => onAction('REMINDER')}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/[0.06] font-semibold text-xs transition-all active:scale-95"
        >
          <Bell className="w-3.5 h-3.5 text-rose-400" />
          <span>REMINDER</span>
        </button>
      </div>
    </div>
  );
};
