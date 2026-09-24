import React from 'react';
import { Sliders, Volume2, ShieldCheck, Moon, Sun, Smartphone, X, Check, Mic } from 'lucide-react';
import { VoiceStyle, AddressingPreference, IndianLanguage } from '../types';

interface SettingsModalProps {
  voiceStyle: VoiceStyle;
  setVoiceStyle: (style: VoiceStyle) => void;
  addressingPref: AddressingPreference;
  setAddressingPref: (pref: AddressingPreference) => void;
  wakeWordEnabled: boolean;
  setWakeWordEnabled: (enabled: boolean) => void;
  isDeviceFrame: boolean;
  setIsDeviceFrame: (frame: boolean) => void;
  onOpenVoiceSettings?: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  voiceStyle,
  setVoiceStyle,
  addressingPref,
  setAddressingPref,
  wakeWordEnabled,
  setWakeWordEnabled,
  isDeviceFrame,
  setIsDeviceFrame,
  onOpenVoiceSettings,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg max-h-[90vh] bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Pankaj Ji Settings & Personalization</h2>
              <p className="text-xs text-slate-400">Voice agent, wake-word, speed & UI settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Primary Voice Agent Banner */}
          {onOpenVoiceSettings && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-amber-300 flex items-center">
                  <Volume2 className="w-4 h-4 mr-1.5" />
                  Voice & Agent Settings
                </div>
                <p className="text-[11px] text-slate-300">
                  👨 Male (Default) / 👩 Female · Normal 1.0x · Indian Accent
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onOpenVoiceSettings();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Configure Voice
              </button>
            </div>
          )}
          {/* Section 20: Voice Style */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Assistant Voice Style (Section 20)
            </label>
            <p className="text-[11px] text-slate-400">
              Configure speech acoustics and tonal delivery:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['Masculine', 'Feminine', 'Neutral'] as VoiceStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setVoiceStyle(style)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    voiceStyle === style
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-950/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Section 20: Addressing Preference */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Addressing Preference
            </label>
            <p className="text-[11px] text-slate-400">
              How Pankaj Ji respectfully addresses you:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['Formal', 'Friendly', 'Neutral'] as AddressingPreference[]).map((pref) => (
                <button
                  key={pref}
                  onClick={() => setAddressingPref(pref)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    addressingPref === pref
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-950/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Section 29: Wake Word */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-200 flex items-center">
                <Mic className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                Wake-Word: "Hey Pankaj Ji"
              </div>
              <p className="text-[11px] text-slate-400">
                Continuous local on-device keyword listener (Section 29)
              </p>
            </div>
            <button
              onClick={() => setWakeWordEnabled(!wakeWordEnabled)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                wakeWordEnabled
                  ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {wakeWordEnabled ? 'ACTIVE' : 'OFF'}
            </button>
          </div>

          {/* Device Frame View Mode */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-200 flex items-center">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
                Android Device Frame Mode
              </div>
              <p className="text-[11px] text-slate-400">
                Simulate native Android phone screen vs Fullscreen web layout
              </p>
            </div>
            <button
              onClick={() => setIsDeviceFrame(!isDeviceFrame)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                isDeviceFrame
                  ? 'bg-cyan-950 border-cyan-600 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {isDeviceFrame ? 'PHONE FRAME' : 'EXPANDED'}
            </button>
          </div>

          {/* Safe Decision Rules */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 text-xs space-y-1.5">
            <span className="font-bold text-amber-400">Safe Decision Rules (Section 22)</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Pankaj Ji will automatically execute routine Android tools, but strictly requires explicit user confirmation before initiating sensitive transactions, deleting contacts, or broadcasting SMS messages.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">Changes saved automatically.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
