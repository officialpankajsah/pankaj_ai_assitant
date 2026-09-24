import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  Circle,
  Square,
  ChevronLeft,
  Search,
  Send,
  Play,
  Pause,
  Mail,
  MessageSquare,
  Youtube,
  Globe,
  Instagram,
  Settings,
  Clock,
  MapPin,
  CreditCard,
  Battery,
  Wifi,
  Volume2,
  Lock,
  Plus
} from 'lucide-react';
import { AppInfo } from '../types';

interface AndroidAppScreenProps {
  app: AppInfo;
  onClose: () => void;
  onVoiceCommand?: (cmd: string) => void;
}

export const AndroidAppScreen: React.FC<AndroidAppScreenProps> = ({
  app,
  onClose,
  onVoiceCommand,
}) => {
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const appKey = app.normalizedName || app.displayName.toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md h-[90vh] max-h-[800px] bg-slate-900 border border-white/10 rounded-[36px] shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Android App Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-white/[0.08] select-none">
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
              title="Back to Assistant"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                Running
              </span>
              <span className="font-bold text-sm text-white truncate max-w-[160px]">
                {app.displayName}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              {app.packageName}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              title="Close Application"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic App Content Body */}
        <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-200">
          
          {/* WHATSAPP VIEW */}
          {appKey.includes('whatsapp') && (
            <div className="flex flex-col h-full">
              {/* WhatsApp Subheader */}
              <div className="bg-[#0b141a] px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-emerald-400 font-bold text-base">WhatsApp</span>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Search className="w-4 h-4 cursor-pointer" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 divide-y divide-white/5 overflow-y-auto">
                {[
                  { name: 'Mummy', message: 'Haan beta, shaam ko dahi lete aana.', time: '11:42 AM', unread: 2, online: true },
                  { name: 'Rahul', message: 'Pankaj bhai, movie ka plan pakka hai?', time: '10:15 AM', unread: 1, online: true },
                  { name: 'Office Team', message: 'Vikram: Gemini voice assistant build live ho gaya.', time: '09:30 AM', unread: 0, online: false },
                  { name: 'Papa', message: 'Train ticket booking ho gayi?', time: 'Yesterday', unread: 0, online: false },
                ].map((chat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 flex items-center space-x-3 hover:bg-slate-900/60 transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-800 flex items-center justify-center font-bold text-white shadow">
                        {chat.name[0]}
                      </div>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-100">{chat.name}</span>
                        <span className="text-[10px] text-slate-400">{chat.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{chat.message}</p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Reply Bar */}
              <div className="p-3 bg-[#0b141a] border-t border-white/5 flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Message Mummy or Rahul..."
                  className="flex-1 bg-slate-900 border border-white/10 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => {
                    if (inputText.trim()) {
                      onVoiceCommand?.(`Send a message to Mummy saying ${inputText}`);
                      setInputText('');
                    }
                  }}
                  className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* YOUTUBE VIEW */}
          {appKey.includes('youtube') && (
            <div className="flex flex-col h-full">
              <div className="bg-red-950/40 p-3 border-b border-red-500/20 flex items-center space-x-2">
                <Youtube className="w-5 h-5 text-red-500 fill-current" />
                <span className="font-bold text-sm tracking-wide text-white">YouTube India</span>
              </div>
              
              {/* Featured Video Player Box */}
              <div className="relative aspect-video bg-black flex flex-col items-center justify-center border-b border-white/10 group">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-900/50 cursor-pointer hover:scale-105 transition-transform"
                     onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                </div>
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 bg-black/60 px-2 py-1 rounded backdrop-blur">
                  <span className="font-semibold truncate">Kesariya - Brahmāstra | Ranbir & Alia | Arijit Singh</span>
                  <span className="text-red-400 font-mono">03:42</span>
                </div>
              </div>

              {/* Feed items */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Up Next in Music & Tech</div>
                {[
                  { title: 'Chaleya | Jawan | Shah Rukh Khan | Nayanthara | Anirudh', views: '180M views', channel: 'T-Series' },
                  { title: 'Build Android AI Voice Assistant with Kotlin & Gemini API', views: '240K views', channel: 'Pankaj Ji Academy' },
                  { title: 'Ganga Aarti at Dashashwamedh Ghat Varanasi 4K Live', views: '1.2M views', channel: 'Varanasi Darshan' }
                ].map((item, idx) => (
                  <div key={idx} className="flex space-x-3 p-2 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer">
                    <div className="w-24 h-14 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                      <Play className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white line-clamp-2">{item.title}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{item.channel} • {item.views}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GMAIL VIEW */}
          {appKey.includes('gmail') && (
            <div className="flex flex-col h-full">
              <div className="p-3 bg-red-950/20 border-b border-red-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-red-400" />
                  <span className="font-bold text-sm text-white">Primary Inbox</span>
                </div>
                <span className="text-xs text-red-300 font-semibold px-2 py-0.5 rounded-full bg-red-500/10">
                  pankajsah.696@gmail.com
                </span>
              </div>
              <div className="divide-y divide-white/5 flex-1 overflow-y-auto">
                {[
                  { from: 'Google AI Studio', subject: 'Your Gemini 2.5 Flash assistant is ready to deploy', time: '12:05 PM', unread: true },
                  { from: 'State Bank of India', subject: 'Transaction Alert: INR 2,500.00 credited via UPI', time: '11:15 AM', unread: true },
                  { from: 'IRCTC e-Ticketing', subject: 'Electronic Reservation Slip: Varanasi to New Delhi', time: 'Yesterday', unread: false },
                  { from: 'LinkedIn Notifications', subject: 'Pankaj, 14 people viewed your profile today', time: 'Sep 22', unread: false },
                ].map((mail, idx) => (
                  <div key={idx} className="p-3.5 hover:bg-slate-900 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${mail.unread ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                        {mail.from}
                      </span>
                      <span className="text-[10px] text-slate-400">{mail.time}</span>
                    </div>
                    <p className={`text-xs mt-1 ${mail.unread ? 'font-semibold text-slate-100' : 'text-slate-400'}`}>
                      {mail.subject}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHROME VIEW */}
          {appKey.includes('chrome') && (
            <div className="flex flex-col h-full">
              <div className="p-3 bg-slate-900 border-b border-white/10 flex items-center space-x-2">
                <div className="flex-1 flex items-center space-x-2 bg-slate-950 border border-white/15 px-3 py-1.5 rounded-full text-xs text-slate-300">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span className="truncate">https://www.google.com/search?q=pankaj+ji</span>
                </div>
              </div>
              <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                <div className="text-center py-6">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-red-400 to-amber-300 bg-clip-text text-transparent">
                    Google
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                  <span className="text-xs font-semibold text-sky-400">Pankaj Ji — Indian Voice AI Assistant</span>
                  <p className="text-xs text-slate-300">
                    Production voice-first assistant supporting Hindi, Hinglish, Bhojpuri, and 14 Indian languages with full Android automation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* INSTAGRAM VIEW */}
          {appKey.includes('instagram') && (
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-white/10 flex items-center justify-between bg-slate-900/40">
                <span className="font-serif italic font-bold text-lg text-white">Instagram</span>
                <MessageSquare className="w-5 h-5 text-slate-300 cursor-pointer" />
              </div>
              <div className="p-3 flex space-x-3 overflow-x-auto border-b border-white/5">
                {['Your Story', 'rahul_99', 'mumbai_vibe', 'travel_india', 'foodie_delhi'].map((story, i) => (
                  <div key={i} className="flex flex-col items-center space-y-1 min-w-[56px]">
                    <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-xs">
                        {story[0]}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate max-w-[56px]">{story}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-xs text-slate-950">
                    PJ
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">pankaj_ji_assistant</div>
                    <div className="text-[10px] text-slate-400">Varanasi, India</div>
                  </div>
                </div>
                <div className="aspect-square rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-center p-6">
                  <div className="space-y-2">
                    <div className="text-4xl">🙏</div>
                    <div className="text-sm font-bold text-amber-300">Namaste Ji!</div>
                    <p className="text-xs text-slate-300">Serving all Indian voices with love and intelligence.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS VIEW */}
          {appKey.includes('settings') && (
            <div className="p-4 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Android 15 Device Settings</div>
              {[
                { name: 'Network & Internet', desc: 'Wi-Fi 6 (5GHz), Mobile network, Hotspot', icon: Wifi },
                { name: 'Connected Devices', desc: 'Bluetooth (Active), Quick Share, Android Auto', icon: Settings },
                { name: 'Apps & Notifications', desc: 'Permissions, Default assistant: Pankaj Ji', icon: MessageSquare },
                { name: 'Battery', desc: '82% - Est. 9 hours remaining (Normal Mode)', icon: Battery },
                { name: 'Sound & Vibration', desc: 'Volume, DND, Notification chimes', icon: Volume2 },
                { name: 'Security & Privacy', desc: 'Screen lock, Biometrics, Permission manager', icon: Lock },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-900/70 border border-white/5 flex items-center space-x-3 hover:bg-slate-800/60 transition-colors cursor-pointer">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BANKING APPS VIEW (YONO SBI, HDFC, Google Pay, PhonePe, Paytm) */}
          {app.category === 'Banking' && (
            <div className="p-4 space-y-4">
              <div className="p-4 rounded-3xl bg-gradient-to-tr from-blue-900 to-indigo-950 border border-blue-500/30 text-white space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-200">{app.displayName}</span>
                  <span className="text-[10px] font-mono bg-blue-500/20 px-2 py-0.5 rounded text-blue-300 border border-blue-400/30">Verified UPI</span>
                </div>
                <div>
                  <span className="text-[10px] text-blue-300">Available Account Balance</span>
                  <div className="text-2xl font-bold font-mono tracking-tight text-white">₹ 42,850.50</div>
                </div>
                <div className="flex space-x-2 pt-1">
                  <button className="flex-1 py-1.5 rounded-xl bg-blue-500 text-xs font-bold shadow text-white hover:bg-blue-400">
                    Scan & Pay
                  </button>
                  <button className="flex-1 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-white hover:bg-white/20">
                    To Mobile / UPI
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GENERIC FALLBACK FOR OTHER APPS */}
          {!['whatsapp', 'youtube', 'gmail', 'chrome', 'instagram', 'settings'].some(k => appKey.includes(k)) && app.category !== 'Banking' && (
            <div className="p-6 text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
                <Settings className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{app.displayName}</h3>
                <p className="text-xs text-slate-400 mt-1">{app.packageName}</p>
                <p className="text-xs text-emerald-400 mt-2 font-medium">
                  ✓ Application running actively on Android device
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/5 text-left text-xs space-y-1">
                <div className="text-slate-400 font-mono text-[11px]">Intent: {app.androidIntentUrl || app.deepLinkUri}</div>
                <div className="text-slate-400 font-mono text-[11px]">Category: {app.category || 'Application'}</div>
              </div>
            </div>
          )}

        </div>

        {/* Android Navigation 3-Button Bar */}
        <div className="px-6 py-2.5 bg-slate-950 border-t border-white/10 flex items-center justify-around text-slate-400">
          <button
            onClick={onClose}
            className="p-2 hover:text-white transition-colors"
            title="Android Back Button"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:text-white transition-colors"
            title="Android Home Button (Returns to Pankaj Ji)"
          >
            <Circle className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:text-white transition-colors"
            title="Android Recents Button"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
