import React, { useState } from 'react';
import {
  Volume2,
  Play,
  Check,
  X,
  Sparkles,
  Square,
  Globe2,
  Zap,
  Gauge
} from 'lucide-react';
import { AgentGender, SpeakingSpeed, IndianLanguage, VoicePreferences } from '../types';
import { voiceService } from '../services/voiceService';

interface VoiceAgentSettingsModalProps {
  currentPrefs: VoicePreferences;
  onSave: (prefs: VoicePreferences) => void;
  onClose: () => void;
}

export const VoiceAgentSettingsModal: React.FC<VoiceAgentSettingsModalProps> = ({
  currentPrefs,
  onSave,
  onClose
}) => {
  const [selectedGender, setSelectedGender] = useState<AgentGender>(currentPrefs.gender || 'Male');
  const [selectedSpeed, setSelectedSpeed] = useState<SpeakingSpeed>(currentPrefs.speed || 'Normal');
  const [selectedLanguage, setSelectedLanguage] = useState<IndianLanguage>(currentPrefs.language || 'AUTO DETECT');
  const [isPreviewing, setIsPreviewing] = useState(false);

  const speedMultiplier = selectedSpeed === 'Slow' ? 0.85 : selectedSpeed === 'Fast' ? 1.15 : 1.0;

  const handlePreview = () => {
    if (isPreviewing) {
      voiceService.stopSpeaking();
      setIsPreviewing(false);
      return;
    }

    setIsPreviewing(true);
    voiceService.previewVoice(
      selectedGender,
      selectedSpeed,
      () => setIsPreviewing(true),
      () => setIsPreviewing(false)
    );
  };

  const handleSave = () => {
    const updated: VoicePreferences = {
      gender: selectedGender,
      speed: selectedSpeed,
      speedMultiplier,
      language: selectedLanguage,
      accent: 'Indian'
    };
    onSave(updated);
    onClose();
  };

  const languagesList: { id: IndianLanguage; label: string }[] = [
    { id: 'AUTO DETECT', label: 'Auto Detect (Recommended)' },
    { id: 'HINDI', label: 'Hindi (हिन्दी)' },
    { id: 'BHOJPURI', label: 'Bhojpuri (भोजपुरी)' },
    { id: 'HINGLISH', label: 'Hinglish' },
    { id: 'ENGLISH', label: 'Indian English' },
    { id: 'BENGALI', label: 'Bengali (বাংলা)' },
    { id: 'MARATHI', label: 'Marathi (मराठी)' },
    { id: 'TELUGU', label: 'Telugu (తెలుగు)' },
    { id: 'TAMIL', label: 'Tamil (தமிழ்)' },
    { id: 'GUJARATI', label: 'Gujarati (ગુજરાતી)' },
    { id: 'PUNJABI', label: 'Punjabi (ਪੰਜਾਬੀ)' },
    { id: 'URDU', label: 'Urdu (اردو)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center">
                Pankaj Ji Voice & Agent <Sparkles className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
              </h2>
              <p className="text-xs text-slate-400">
                Male Default · Natural Indian English & Indian-language pronunciation
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

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[78vh]">
          {/* 1. Choose Your Agent (Male vs Female) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">
                Choose Your Agent
              </label>
              <span className="text-[11px] text-amber-400/90 font-medium">Default: Male</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Male Agent Option */}
              <button
                type="button"
                onClick={() => setSelectedGender('Male')}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative ${
                  selectedGender === 'Male'
                    ? 'bg-amber-500/15 border-amber-500/70 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/40'
                    : 'bg-slate-950/60 border-white/[0.06] hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl" role="img" aria-label="Male Agent">👨</span>
                    <span className="text-sm font-bold text-slate-100">Male Agent</span>
                  </div>
                  {selectedGender === 'Male' && (
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-slate-950">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 font-medium italic mb-1.5">
                  “Namaste Pankaj, main aapka Pankaj Ji assistant hoon.”
                </p>
                <div className="text-[10px] text-slate-400">
                  Calm · Confident · Helpful · Professional
                </div>
              </button>

              {/* Female Agent Option */}
              <button
                type="button"
                onClick={() => setSelectedGender('Female')}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative ${
                  selectedGender === 'Female'
                    ? 'bg-amber-500/15 border-amber-500/70 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/40'
                    : 'bg-slate-950/60 border-white/[0.06] hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl" role="img" aria-label="Female Agent">👩</span>
                    <span className="text-sm font-bold text-slate-100">Female Agent</span>
                  </div>
                  {selectedGender === 'Female' && (
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-slate-950">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 font-medium italic mb-1.5">
                  “Namaste Pankaj, main aapki Pankaj Ji assistant hoon.”
                </p>
                <div className="text-[10px] text-slate-400">
                  Warm · Clear · Confident · Helpful
                </div>
              </button>
            </div>
          </div>

          {/* 2. Speaking Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">
                Speaking Speed
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {selectedSpeed === 'Slow' ? '0.85x' : selectedSpeed === 'Fast' ? '1.15x' : '1.0x (Normal)'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['Slow', 'Normal', 'Fast'] as SpeakingSpeed[]).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setSelectedSpeed(spd)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                    selectedSpeed === spd
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-950/30'
                      : 'bg-slate-950/60 border-white/[0.06] text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{spd}</span>
                  {selectedSpeed === spd && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Natural conversational flow without sounding rushed or robotic.
            </p>
          </div>

          {/* 3. Language & Accent */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">
                Voice Language
              </label>
              <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>Accent: Indian</span>
              </div>
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as IndianLanguage)}
              className="w-full bg-slate-950 border border-white/[0.1] rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            >
              {languagesList.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Preview Voice Button */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-200">
                Audition {selectedGender} Voice
              </div>
              <p className="text-[11px] text-slate-400">
                Hear natural Indian cadence and pacing
              </p>
            </div>

            <button
              type="button"
              onClick={handlePreview}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                isPreviewing
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950 animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-950/40'
              }`}
            >
              {isPreviewing ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Preview Voice</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer with Save Preferences */}
        <div className="p-4 border-t border-white/[0.08] bg-slate-950 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Persistent preference saved on-device.
          </p>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all active:scale-95"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
