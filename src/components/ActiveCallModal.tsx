import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Grid, Phone } from 'lucide-react';

interface ActiveCallModalProps {
  contactName: string;
  phoneNumber: string;
  onEndCall: () => void;
}

export const ActiveCallModal: React.FC<ActiveCallModalProps> = ({
  contactName,
  phoneNumber,
  onEndCall,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm h-[580px] bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-white/10 rounded-[40px] shadow-2xl flex flex-col justify-between p-6 text-center text-white relative overflow-hidden">
        
        {/* Top Info */}
        <div className="pt-4 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Active Android Call (Telecom)</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{contactName}</h2>
          <p className="text-xs text-slate-400 font-mono">{phoneNumber}</p>
          <p className="text-sm font-semibold text-emerald-400 font-mono tracking-wider pt-1">
            {formatDuration(seconds)}
          </p>
        </div>

        {/* Center Calling Avatar with sound waves */}
        <div className="relative py-4 flex items-center justify-center">
          <div className="absolute w-44 h-44 rounded-full bg-amber-500/10 animate-ping" />
          <div className="absolute w-36 h-36 rounded-full bg-emerald-500/10 animate-pulse" />
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 via-orange-600 to-amber-400 p-1 shadow-2xl shadow-amber-900/40">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-4xl font-extrabold text-amber-300">
              {contactName[0]?.toUpperCase() || 'M'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-6 pb-2">
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3.5 rounded-full flex flex-col items-center justify-center space-y-1 transition-all ${
                isMuted ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span className="text-[10px] font-semibold">{isMuted ? 'Muted' : 'Mute'}</span>
            </button>

            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`p-3.5 rounded-full flex flex-col items-center justify-center space-y-1 transition-all ${
                isSpeaker ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-[10px] font-semibold">{isSpeaker ? 'Speaker' : 'Earpiece'}</span>
            </button>

            <button
              className="p-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex flex-col items-center justify-center space-y-1 transition-all"
            >
              <Grid className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Keypad</span>
            </button>
          </div>

          {/* End Call Button */}
          <div>
            <button
              onClick={onEndCall}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-950/60 flex items-center justify-center mx-auto transition-transform active:scale-95"
              title="End Phone Call"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">End Call</p>
          </div>
        </div>

      </div>
    </div>
  );
};
