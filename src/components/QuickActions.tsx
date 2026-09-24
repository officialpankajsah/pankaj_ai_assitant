import React from 'react';
import {
  PhoneCall,
  MessageSquare,
  MapPin,
  Music,
  Bell,
  Clock,
  Calendar,
  Camera
} from 'lucide-react';

interface QuickActionsProps {
  onSelectAction: (command: string) => void;
}

const ACTIONS = [
  { label: 'Call', subtitle: 'Rahul ko call', icon: PhoneCall, command: 'Rahul ko call karo', accent: 'group-hover:text-emerald-400', iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { label: 'Message', subtitle: 'WhatsApp draft', icon: MessageSquare, command: 'Rahul ko message bhejo ki main 10 minute mein aa raha hoon', accent: 'group-hover:text-amber-400', iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { label: 'Maps', subtitle: 'Banaras Cantt', icon: MapPin, command: 'Pankaj Ji Banaras Cantt ka route dikhao', accent: 'group-hover:text-cyan-400', iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { label: 'Music', subtitle: 'YouTube music', icon: Music, command: 'YouTube kholo aur Kesariya gana chalao', accent: 'group-hover:text-purple-400', iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { label: 'Reminder', subtitle: 'Call reminder', icon: Bell, command: 'Shaam 6 baje mujhe call karne ka reminder dena', accent: 'group-hover:text-rose-400', iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  { label: 'Alarm', subtitle: 'Subah 7 AM', icon: Clock, command: 'Kal subah 7 baje alarm lagao', accent: 'group-hover:text-orange-400', iconBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { label: 'Calendar', subtitle: 'Doctor meeting', icon: Calendar, command: 'Kal 4 baje doctor meeting calendar mein add karo', accent: 'group-hover:text-blue-400', iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { label: 'Camera', subtitle: 'Capture photo', icon: Camera, command: 'Camera kholo photo lene ke liye', accent: 'group-hover:text-pink-400', iconBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
];

export const QuickActions: React.FC<QuickActionsProps> = ({ onSelectAction }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">
          Quick Tools
        </span>
        <span className="text-[11px] text-amber-400/80">Tap to run intent</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => onSelectAction(action.command)}
              className="group flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/[0.06] hover:border-amber-500/30 backdrop-blur-xl transition-all duration-200 active:scale-95 text-center min-h-[76px]"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border mb-1.5 transition-transform duration-200 group-hover:scale-110 ${action.iconBg}`}>
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className={`text-[11px] font-semibold text-slate-200 tracking-tight transition-colors ${action.accent}`}>
                {action.label}
              </span>
              <span className="text-[9px] text-slate-400 truncate max-w-[64px]">
                {action.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
