import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  Globe2,
  ShieldCheck,
  Lock,
  Database,
  Sliders,
  Sparkles,
  Smartphone,
  TestTube,
  Clock,
  Wifi,
  Battery,
  Square,
  MessageSquare,
  Cpu,
  Layers,
  ChevronRight,
  Radio,
  Compass,
  Zap,
  Activity,
  Maximize2,
  Minimize2,
  Cloud,
  Bluetooth
} from 'lucide-react';
import {
  OrbState,
  IndianLanguage,
  VoiceStyle,
  AddressingPreference,
  ChatMessage,
  ToolCall,
  AppInfo
} from './types';
import { AiOrb } from './components/AiOrb';
import { QuickActions } from './components/QuickActions';
import { ChatHistory } from './components/ChatHistory';
import { AndroidWidget } from './components/AndroidWidget';
import { MessageConfirmationModal } from './components/MessageConfirmationModal';
import { DisambiguationModal } from './components/DisambiguationModal';
import { PermissionCenterModal } from './components/PermissionCenterModal';
import { PrivacyCenterModal } from './components/PrivacyCenterModal';
import { MemoryModal } from './components/MemoryModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { AndroidCodeExplorerModal } from './components/AndroidCodeExplorerModal';
import { ActiveAlarmsRemindersModal } from './components/ActiveAlarmsRemindersModal';
import { CameraPreviewModal } from './components/CameraPreviewModal';
import { SettingsModal } from './components/SettingsModal';
import { VoiceAgentSettingsModal } from './components/VoiceAgentSettingsModal';
import { FirebaseAuthModal } from './components/FirebaseAuthModal';
import { AndroidAppScreen } from './components/AndroidAppScreen';
import { ActiveCallModal } from './components/ActiveCallModal';
import { NotificationShadeModal } from './components/NotificationShadeModal';
import {
  auth,
  testFirestoreConnection,
  saveUserProfile,
  saveConversationToCloud,
  subscribeToCloudConversations
} from './services/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { voiceService } from './services/voiceService';
import { askPankajJi } from './services/geminiService';
import { executeTool } from './services/toolsService';
import { taskPlanner } from './services/plannerService';
import { memoryService } from './services/memoryService';
import { VoicePreferences } from './types';

const INITIAL_WELCOME: ChatMessage = {
  id: 'welcome-1',
  role: 'assistant',
  content: 'Namaste Ji, main Pankaj Ji hoon. Bataiye, main aapki kya madad kar sakta hoon?',
  voiceText: 'Namaste Ji, main Pankaj Ji hoon. Bataiye, main aapki kya madad kar sakta hoon?',
  timestamp: Date.now(),
  status: 'verified',
  language: 'Hinglish'
};

type ActiveTab = 'assistant' | 'chat' | 'tools' | 'tests';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('assistant');

  // Orb & Voice State
  const [orbState, setOrbState] = useState<OrbState>('IDLE');
  const [amplitude, setAmplitude] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [isInputExpanded, setIsInputExpanded] = useState(false);

  // Conversation & Settings
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [language, setLanguage] = useState<IndianLanguage>('HINGLISH');
  const [voicePrefs, setVoicePrefs] = useState<VoicePreferences>(() => voiceService.getPreferences());
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>('Masculine');
  const [addressingPref, setAddressingPref] = useState<AddressingPreference>('Friendly');
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);

  // Firebase Auth & Cloud Sync
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isCloudOnline, setIsCloudOnline] = useState(false);

  // Modals
  const [showVoiceAgentModal, setShowVoiceAgentModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showTestRunnerModal, setShowTestRunnerModal] = useState(false);
  const [showCodeExplorerModal, setShowCodeExplorerModal] = useState(false);
  const [showAlarmsModal, setShowAlarmsModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Active Android Subsystems States
  const [activeRunningApp, setActiveRunningApp] = useState<AppInfo | null>(null);
  const [activeCallState, setActiveCallState] = useState<{ contactName: string; phoneNumber: string } | null>(null);
  const [showNotificationShade, setShowNotificationShade] = useState(false);
  const [bluetoothActive, setBluetoothActive] = useState(true);

  // Sensitive Flow States
  const [pendingMessageConfirm, setPendingMessageConfirm] = useState<{
    recipient: string;
    message: string;
    app: string;
  } | null>(null);

  const [pendingDisambiguation, setPendingDisambiguation] = useState<{
    queryName: string;
  } | null>(null);

  // Clock & Battery Simulation
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(88);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    testFirestoreConnection().then((connected) => setIsCloudOnline(connected));
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        saveUserProfile(user, voicePrefs);
      }
    });
    return () => unsubscribe();
  }, [voicePrefs]);

  useEffect(() => {
    if (currentUser) {
      const unsubConv = subscribeToCloudConversations(currentUser.uid, (cloudMsgs) => {
        if (cloudMsgs.length > 0) {
          setMessages(cloudMsgs);
        }
      });
      return () => unsubConv();
    }
  }, [currentUser]);

  useEffect(() => {
    voiceService.setLanguage(language);
  }, [language]);

  // Voice & Query Processor
  const handleProcessUserQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    voiceService.stopSpeaking();
    setIsSpeaking(false);
    setIsListening(false);
    setCurrentTranscript('');

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: queryText.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (currentUser) {
      saveConversationToCloud(currentUser.uid, userMsg);
    }
    setOrbState('THINKING');

    const plan = taskPlanner.analyzeAndPlan(queryText);

    try {
      const response = await askPankajJi(queryText, messages, language, {
        battery: batteryLevel,
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      });

      // Disambiguation check
      const qLower = queryText.toLowerCase();
      if ((qLower.includes('call') || qLower.includes('phone')) && qLower.includes('rahul') && !qLower.includes('sharma') && !qLower.includes('verma')) {
        setPendingDisambiguation({ queryName: 'Rahul' });
      }

      // Message Confirmation check (Section 13)
      if (response.toolCalls && response.toolCalls.length > 0) {
        const msgTool = response.toolCalls.find(tc => tc.toolName === 'MessageTool');
        if (msgTool && msgTool.requiresConfirmation) {
          setPendingMessageConfirm({
            recipient: msgTool.parameters.recipient || 'Rahul',
            message: msgTool.parameters.message || queryText,
            app: msgTool.parameters.app || 'WhatsApp'
          });
        }

        // Camera Tool check
        const camTool = response.toolCalls.find(tc => tc.toolName === 'CameraTool');
        if (camTool) {
          setShowCameraModal(true);
        }

        // Alarms check
        const alarmTool = response.toolCalls.find(tc => tc.toolName === 'AlarmTool' || tc.toolName === 'ReminderTool');
        if (alarmTool && (qLower.includes('show') || qLower.includes('dikhao') || qLower.includes('active'))) {
          setShowAlarmsModal(true);
        }
      }

      // Execute non-sensitive tool calls with real Android system verification
      const executedToolCalls: ToolCall[] = [];
      let verifiedVoiceText = response.voiceResponse;
      let overallStatus: 'verified' | 'failed' = 'verified';

      if (response.toolCalls && response.toolCalls.length > 0) {
        for (const tc of response.toolCalls) {
          if (!tc.requiresConfirmation) {
            const execRes = await executeTool(tc.toolName, tc.parameters);
            executedToolCalls.push({
              id: 'tool-' + Date.now(),
              toolName: tc.toolName,
              parameters: tc.parameters,
              status: execRes.success ? 'success' : 'failed',
              result: execRes.message
            });

            // Handle tool specific UI & side-effects
            if (tc.toolName === 'OpenAppTool') {
              if (execRes.success && execRes.data?.appInfo) {
                setActiveRunningApp(execRes.data.appInfo);
                verifiedVoiceText = execRes.message;
              } else if (!execRes.success) {
                overallStatus = 'failed';
                verifiedVoiceText = execRes.message; // e.g. "Pankaj Ji, Facebook aapke phone mein installed nahi hai."
                if (execRes.data?.requiresDisambiguation) {
                  setPendingDisambiguation({ queryName: 'Banking' });
                }
              }
            } else if (tc.toolName === 'CallTool') {
              setActiveCallState({
                contactName: tc.parameters.contactName || 'Mummy',
                phoneNumber: execRes.data?.phone || '+91 98765 43210'
              });
              verifiedVoiceText = execRes.message;
            } else if (tc.toolName === 'NotificationTool') {
              setShowNotificationShade(true);
            } else if (tc.toolName === 'BluetoothTool') {
              setBluetoothActive(true);
            } else if (tc.toolName === 'AlarmTool') {
              setShowAlarmsModal(true);
            } else if (tc.toolName === 'SettingsTool') {
              setShowSettingsModal(true);
            }
          }
        }
      }

      // Check for direct voice commands not caught in tools
      if (qLower.includes('notification') || qLower.includes('सूचना')) {
        setShowNotificationShade(true);
      }
      if (qLower.includes('bluetooth') || qLower.includes('ब्लूटूथ')) {
        setBluetoothActive(true);
      }

      // Formal vs Friendly addressing
      let finalVoiceText = verifiedVoiceText;
      if (addressingPref === 'Formal' && !finalVoiceText.includes('Aap')) {
        finalVoiceText = finalVoiceText.replace(/tum/g, 'aap');
      }

      const assistantMsg: ChatMessage = {
        id: 'resp-' + Date.now(),
        role: 'assistant',
        content: overallStatus === 'failed' ? verifiedVoiceText : (response.displayText || verifiedVoiceText),
        voiceText: finalVoiceText,
        timestamp: Date.now(),
        toolCalls: executedToolCalls,
        planSteps: plan?.steps.map(s => s.description),
        status: overallStatus,
        language: response.detectedLanguage || language
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (currentUser) {
        saveConversationToCloud(currentUser.uid, assistantMsg);
      }
      setOrbState('SPEAKING');
      setIsSpeaking(true);

      // Speak aloud with Indian voice cadence using selected Male/Female voice
      voiceService.speak(
        finalVoiceText,
        voicePrefs.gender,
        () => {
          setIsSpeaking(true);
          setOrbState('SPEAKING');
        },
        () => {
          setIsSpeaking(false);
          setOrbState('IDLE');
        },
        (amp) => setAmplitude(amp)
      );

    } catch (err: any) {
      console.error(err);
      setOrbState('ERROR');
      setTimeout(() => setOrbState('IDLE'), 2000);
    }
  };

  const toggleListening = () => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
      setOrbState('IDLE');
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      setOrbState('IDLE');
    } else {
      setIsListening(true);
      setOrbState('LISTENING');
      setCurrentTranscript('');

      voiceService.startListening(
        (text, isFinal) => {
          setCurrentTranscript(text);
          if (isFinal) {
            setIsListening(false);
            handleProcessUserQuery(text);
          }
        },
        (err) => {
          console.warn(err);
          setIsListening(false);
          setOrbState('IDLE');
        },
        (amp) => {
          setAmplitude(amp);
        }
      );
    }
  };

  const stopSpeaking = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
    setOrbState('IDLE');
    setAmplitude(0);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col items-center justify-between p-2 sm:p-4 selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Modern Top Bar (One-Row, 3-Zone Contract) */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 px-3 mb-2 rounded-2xl glass-panel-subtle">
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-950/40">
            <span className="font-extrabold text-slate-950 text-xs tracking-tighter">PJ</span>
          </div>
          <span className="text-base font-extrabold tracking-wide text-slate-100 uppercase">
            Pankaj Ji
          </span>
        </div>

        {/* Zone 2: Navigation Links / Dynamic Island Status */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full glass-pill text-xs">
          <div
            className={`w-2 h-2 rounded-full ${
              orbState === 'LISTENING'
                ? 'bg-amber-400 animate-ping'
                : orbState === 'SPEAKING'
                ? 'bg-emerald-400 animate-pulse'
                : orbState === 'THINKING'
                ? 'bg-cyan-400 animate-spin'
                : 'bg-emerald-500'
            }`}
          />
          <span className="text-slate-300 font-medium">
            {orbState === 'LISTENING'
              ? 'Listening...'
              : orbState === 'THINKING'
              ? 'Thinking...'
              : orbState === 'SPEAKING'
              ? 'Speaking...'
              : 'Voice Ready · Namaste Ji'}
          </span>
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          {/* Cloud Sync Status */}
          <button
            onClick={() => setShowAuthModal(true)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold transition-colors ${
              currentUser
                ? 'text-emerald-300 border-emerald-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
            title={currentUser ? `Cloud Sync Active: ${currentUser.email}` : "Connect Firebase Cloud Sync"}
          >
            <Cloud className={`w-3.5 h-3.5 ${currentUser ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="hidden md:inline">
              {currentUser ? (currentUser.displayName?.split(' ')[0] || 'Synced') : 'Cloud'}
            </span>
          </button>

          {/* Dedicated Voice & Agent Button (Male Default) */}
          <button
            onClick={() => setShowVoiceAgentModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-slate-200 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
            title="Pankaj Ji Voice Agent: Male Default / Female Option"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{voicePrefs.gender === 'Male' ? '👨 Male' : '👩 Female'}</span>
            <span className="text-[10px] text-slate-400 hidden lg:inline">({voicePrefs.speed})</span>
          </button>

          <button
            onClick={() => setShowLanguageModal(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl glass-pill text-xs font-medium text-slate-200 hover:text-amber-300 transition-colors"
            title="Language Selector"
          >
            <Globe2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{language}</span>
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-xl glass-pill text-slate-300 hover:text-white transition-colors"
            title="Settings & Persona"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsDeviceFrame(!isDeviceFrame)}
            className="p-2 rounded-xl glass-pill text-slate-300 hover:text-amber-300 transition-colors hidden sm:flex"
            title={isDeviceFrame ? 'Full-screen mode' : 'Phone frame mode'}
          >
            {isDeviceFrame ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. Main Viewport Container (Device Frame or Full Canvas) */}
      <main className={`w-full ${isDeviceFrame ? 'max-w-[430px]' : 'max-w-4xl'} flex-1 flex flex-col transition-all duration-300`}>
        <div
          className={`w-full flex-1 flex flex-col bg-slate-950/80 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden ${
            isDeviceFrame ? 'rounded-[44px] ring-8 ring-slate-900/90' : 'rounded-3xl p-4 sm:p-6'
          }`}
        >
          {/* Android Modern Status Bar (Device Frame Mode) */}
          {isDeviceFrame && (
            <div className="px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
              <span className="font-semibold text-slate-200">{currentTime || '12:30'}</span>

              {/* Dynamic Island Capsule */}
              <div className="flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-slate-900/90 border border-white/[0.1] shadow-inner">
                <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-amber-400 animate-ping' : isSpeaking ? 'bg-emerald-400' : 'bg-amber-400/80'}`} />
                <span className="text-[10px] text-slate-300 font-sans truncate max-w-[120px]">
                  {isListening ? (currentTranscript || 'Listening...') : isSpeaking ? 'Speaking...' : 'Pankaj Ji'}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                {bluetoothActive && (
                  <Bluetooth className="w-3 h-3 text-cyan-400" />
                )}
                <button
                  onClick={() => setShowNotificationShade(true)}
                  className="hover:text-amber-300 transition-colors"
                  title="Open Notification Shade"
                >
                  <Wifi className="w-3 h-3 text-slate-300" />
                </button>
                <span className="text-[9px] font-bold text-amber-400">5G</span>
                <div className="flex items-center space-x-0.5">
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px]">{batteryLevel}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Segmented Tab Navigation Bar */}
          <div className="px-4 py-2 flex items-center justify-center">
            <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-white/[0.06] w-full max-w-sm justify-between">
              <button
                onClick={() => setActiveTab('assistant')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all text-center ${
                  activeTab === 'assistant'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Assistant
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all text-center ${
                  activeTab === 'chat'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Feed ({messages.length})
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all text-center ${
                  activeTab === 'tools'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tools
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all text-center ${
                  activeTab === 'tests'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                100 Tests
              </button>
            </div>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* TAB 1: Main Assistant Voice Screen */}
            {activeTab === 'assistant' && (
              <div className="flex flex-col items-center space-y-4 animate-fade-in">
                {/* AI Orb */}
                <div className="relative py-1 flex flex-col items-center">
                  <AiOrb
                    state={orbState}
                    amplitude={amplitude}
                    onClick={toggleListening}
                  />

                  {/* Interrupt Speaking Button */}
                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="mt-2 flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-all active:scale-95"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Speech</span>
                    </button>
                  )}
                </div>

                {/* Subtitle status & live response preview */}
                <div className="text-center space-y-1 max-w-xs">
                  <p className="text-xs text-amber-300 font-medium italic">
                    {messages[messages.length - 1]?.content.slice(0, 100) || 'Namaste Ji, main sun raha hoon...'}
                  </p>
                </div>

                {/* Modern Quick Tools */}
                <QuickActions onSelectAction={(cmd) => handleProcessUserQuery(cmd)} />

                {/* Modern Android 14 Home Widget */}
                <AndroidWidget
                  onAction={(act) => {
                    if (act === 'TALK') toggleListening();
                    else if (act === 'SEARCH') handleProcessUserQuery('Google search historical places in Varanasi');
                    else if (act === 'REMINDER') setShowAlarmsModal(true);
                  }}
                />
              </div>
            )}

            {/* TAB 2: Conversation Stream */}
            {activeTab === 'chat' && (
              <div className="animate-fade-in">
                <ChatHistory
                  messages={messages}
                  onSpeakAgain={(text) => {
                    voiceService.speak(text, voicePrefs.gender, () => setOrbState('SPEAKING'), () => setOrbState('IDLE'), (amp) => setAmplitude(amp));
                  }}
                  onClearHistory={() => setMessages([INITIAL_WELCOME])}
                  onDeleteMessage={(id) => setMessages(prev => prev.filter(m => m.id !== id))}
                />
              </div>
            )}

            {/* TAB 3: Android Tools & Device Dashboard */}
            {activeTab === 'tools' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Active Android Subsystems
                  </span>
                  <button
                    onClick={() => setShowPermissionModal(true)}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Permissions Hub →
                  </button>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Battery Status</span>
                      <Battery className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-lg font-bold text-slate-100">{batteryLevel}%</div>
                    <p className="text-[10px] text-slate-400">Healthy • est. 9h remaining</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Network Status</span>
                      <Wifi className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-lg font-bold text-slate-100">Wi-Fi 6</div>
                    <p className="text-[10px] text-slate-400">Connected to "Home_5G"</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Alarms & Tasks</span>
                      <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-lg font-bold text-slate-100">2 Active</div>
                    <button
                      onClick={() => setShowAlarmsModal(true)}
                      className="text-[10px] text-amber-400 hover:underline"
                    >
                      Manage Alarms & Timers
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Camera Sensor</span>
                      <Zap className="w-4 h-4 text-pink-400" />
                    </div>
                    <div className="text-lg font-bold text-slate-100">CameraX 1.4</div>
                    <button
                      onClick={() => setShowCameraModal(true)}
                      className="text-[10px] text-pink-400 hover:underline"
                    >
                      Open Viewfinder
                    </button>
                  </div>
                </div>

                {/* Subsystem Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowMemoryModal(true)}
                    className="w-full p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/60 border border-white/[0.06] flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Database className="w-4 h-4 text-orange-400" />
                      <div className="text-left">
                        <div className="font-semibold text-slate-200">Local Room Memory</div>
                        <div className="text-[10px] text-slate-400">Learned preferences, routines & patterns</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>

                  <button
                    onClick={() => setShowPrivacyModal(true)}
                    className="w-full p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/60 border border-white/[0.06] flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Lock className="w-4 h-4 text-blue-400" />
                      <div className="text-left">
                        <div className="font-semibold text-slate-200">Privacy Dashboard</div>
                        <div className="text-[10px] text-slate-400">Data control & zero secret recording guarantee</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: 100 Tests & Android Codebase */}
            {activeTab === 'tests' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-300">
                    <TestTube className="w-5 h-5" />
                    <h3 className="font-bold text-sm">100-Command Test Suite Runner</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Verify all 100 test commands across Hindi, Hinglish, and English for App Control, Calls, Alarms, Settings, and Maps.
                  </p>
                  <button
                    onClick={() => setShowTestRunnerModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
                  >
                    Launch Interactive Test Benchmark
                  </button>
                </div>

                <div className="p-4 rounded-3xl bg-gradient-to-br from-cyan-500/15 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center space-x-2 text-cyan-300">
                    <Smartphone className="w-5 h-5" />
                    <h3 className="font-bold text-sm">Android Kotlin Source Code Explorer</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Inspect the production Kotlin, Jetpack Compose, Hilt, Room, and Foreground service source files.
                  </p>
                  <button
                    onClick={() => setShowCodeExplorerModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
                  >
                    Open Android Kotlin Project Files
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Floating Bottom Push-To-Talk Voice Dock */}
          <div className="p-3.5 bg-slate-950/90 border-t border-white/[0.08] backdrop-blur-2xl flex flex-col space-y-2">
            {isInputExpanded ? (
              <div className="flex items-center space-x-2 animate-fade-in">
                <input
                  type="text"
                  placeholder="Ask Pankaj Ji... ('phone silent karo', 'YouTube kholo')"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputText.trim()) {
                      handleProcessUserQuery(inputText);
                      setInputText('');
                      setIsInputExpanded(false);
                    }
                  }}
                  autoFocus
                  className="flex-1 bg-slate-900 border border-white/[0.1] rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => {
                    if (inputText.trim()) {
                      handleProcessUserQuery(inputText);
                      setInputText('');
                    }
                    setIsInputExpanded(false);
                  }}
                  className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsInputExpanded(false)}
                  className="p-2.5 rounded-2xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between space-x-2">
                <button
                  onClick={() => setIsInputExpanded(true)}
                  className="flex-1 flex items-center space-x-2 py-2.5 px-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/[0.06] text-xs text-slate-400 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Ask Pankaj Ji...</span>
                </button>

                {/* Primary Tactile Mic Orb Button */}
                <button
                  onClick={toggleListening}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-xl active:scale-95 ${
                    isListening
                      ? 'bg-rose-600 border-rose-500 text-white animate-pulse shadow-rose-950 glow-amber'
                      : 'bg-amber-500 hover:bg-amber-400 border-amber-300 text-slate-950 shadow-amber-950/40 glow-amber'
                  }`}
                  title={isListening ? 'Tap to stop' : 'Tap to speak'}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <Mic className="w-5 h-5 stroke-[2.5]" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modern Bottom Brand Anchor */}
      <footer className="w-full max-w-md text-center py-1 text-[11px] text-slate-400">
        Pankaj Ji • Voice-First Indian AI • Natural Hinglish Engine
      </footer>

      {/* Sensitive Modals */}
      {pendingMessageConfirm && (
        <MessageConfirmationModal
          recipient={pendingMessageConfirm.recipient}
          initialMessage={pendingMessageConfirm.message}
          app={pendingMessageConfirm.app}
          onConfirm={(finalMsg) => {
            setPendingMessageConfirm(null);
            executeTool('MessageTool', { recipient: pendingMessageConfirm.recipient, message: finalMsg });
            setMessages(prev => [
              ...prev,
              {
                id: 'sent-' + Date.now(),
                role: 'assistant',
                content: `Bilkul Ji! ${pendingMessageConfirm.recipient} ko "${finalMsg}" message bhej diya gaya hai.`,
                voiceText: `Bilkul Ji! ${pendingMessageConfirm.recipient} ko message bhej diya gaya hai.`,
                timestamp: Date.now(),
                status: 'verified'
              }
            ]);
          }}
          onCancel={() => {
            setPendingMessageConfirm(null);
            setMessages(prev => [
              ...prev,
              {
                id: 'cancel-' + Date.now(),
                role: 'assistant',
                content: 'Message cancel kar diya gaya hai Ji.',
                voiceText: 'Message cancel kar diya gaya hai Ji.',
                timestamp: Date.now(),
                status: 'verified'
              }
            ]);
          }}
        />
      )}

      {pendingDisambiguation && (
        <DisambiguationModal
          queryName={pendingDisambiguation.queryName}
          onSelect={(contact) => {
            setPendingDisambiguation(null);
            executeTool('CallTool', { contactName: contact.name, phoneNumber: contact.phone });
            setMessages(prev => [
              ...prev,
              {
                id: 'call-' + Date.now(),
                role: 'assistant',
                content: `Bilkul Ji, ${contact.name} (${contact.relationship}) ko call mila raha hoon.`,
                voiceText: `Bilkul Ji, ${contact.name} ko call mila raha hoon.`,
                timestamp: Date.now(),
                status: 'verified'
              }
            ]);
          }}
          onCancel={() => setPendingDisambiguation(null)}
        />
      )}

      {showLanguageModal && (
        <LanguageSelectorModal
          selectedLanguage={language}
          onSelectLanguage={(lang) => {
            setLanguage(lang);
            setMessages(prev => [
              ...prev,
              {
                id: 'lang-' + Date.now(),
                role: 'assistant',
                content: `Language preference set to ${lang}. Main taiyaar hoon Ji!`,
                voiceText: `Language set to ${lang}. Main taiyaar hoon Ji!`,
                timestamp: Date.now(),
                status: 'verified'
              }
            ]);
          }}
          onClose={() => setShowLanguageModal(false)}
        />
      )}

      {showPermissionModal && (
        <PermissionCenterModal onClose={() => setShowPermissionModal(false)} />
      )}

      {showPrivacyModal && (
        <PrivacyCenterModal
          onClose={() => setShowPrivacyModal(false)}
          onClearConversation={() => setMessages([INITIAL_WELCOME])}
          onClearMemory={() => memoryService.clearAll()}
          onOpenPermissions={() => setShowPermissionModal(true)}
        />
      )}

      {showMemoryModal && (
        <MemoryModal onClose={() => setShowMemoryModal(false)} />
      )}

      {showTestRunnerModal && (
        <TestRunnerModal
          onClose={() => setShowTestRunnerModal(false)}
          onExecuteInMainChat={(cmd) => {
            setActiveTab('chat');
            handleProcessUserQuery(cmd);
          }}
        />
      )}

      {showCodeExplorerModal && (
        <AndroidCodeExplorerModal onClose={() => setShowCodeExplorerModal(false)} />
      )}

      {showAlarmsModal && (
        <ActiveAlarmsRemindersModal onClose={() => setShowAlarmsModal(false)} />
      )}

      {showCameraModal && (
        <CameraPreviewModal onClose={() => setShowCameraModal(false)} />
      )}

      {showSettingsModal && (
        <SettingsModal
          voiceStyle={voiceStyle}
          setVoiceStyle={setVoiceStyle}
          addressingPref={addressingPref}
          setAddressingPref={setAddressingPref}
          wakeWordEnabled={wakeWordEnabled}
          setWakeWordEnabled={setWakeWordEnabled}
          isDeviceFrame={isDeviceFrame}
          setIsDeviceFrame={setIsDeviceFrame}
          onOpenVoiceSettings={() => setShowVoiceAgentModal(true)}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showVoiceAgentModal && (
        <VoiceAgentSettingsModal
          currentPrefs={voicePrefs}
          onSave={(updated) => {
            const saved = voiceService.savePreferences(updated);
            setVoicePrefs(saved);
            if (currentUser) {
              saveUserProfile(currentUser, saved);
            }
            if (updated.language && updated.language !== 'AUTO DETECT') {
              setLanguage(updated.language);
            }
          }}
          onClose={() => setShowVoiceAgentModal(false)}
        />
      )}

      {showAuthModal && (
        <FirebaseAuthModal
          currentUser={currentUser}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* 4. Active Android Subsystem Screens (App Window, Call Screen, Notification Shade) */}
      {activeRunningApp && (
        <AndroidAppScreen
          app={activeRunningApp}
          onClose={() => setActiveRunningApp(null)}
          onVoiceCommand={(cmd) => handleProcessUserQuery(cmd)}
        />
      )}

      {activeCallState && (
        <ActiveCallModal
          contactName={activeCallState.contactName}
          phoneNumber={activeCallState.phoneNumber}
          onEndCall={() => setActiveCallState(null)}
        />
      )}

      {showNotificationShade && (
        <NotificationShadeModal
          onClose={() => setShowNotificationShade(false)}
          onReadAloud={(t) => handleProcessUserQuery(t)}
          bluetoothActive={bluetoothActive}
          onToggleBluetooth={() => setBluetoothActive(!bluetoothActive)}
        />
      )}
    </div>
  );
}
