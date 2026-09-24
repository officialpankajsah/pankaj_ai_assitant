import { AgentGender, SpeakingSpeed, VoicePreferences, IndianLanguage } from '../types';

const VOICE_PREFS_STORAGE_KEY = 'pankaj_ji_voice_settings_v3';

export const DEFAULT_VOICE_PREFERENCES: VoicePreferences = {
  gender: 'Male',
  speed: 'Normal',
  speedMultiplier: 1.0,
  language: 'AUTO DETECT',
  accent: 'Indian'
};

export class VoiceService {
  private recognition: any = null;
  private isListening = false;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphoneStream: MediaStream | null = null;
  private animationFrameId: number | null = null;
  private onAmplitudeCallback: ((amp: number) => void) | null = null;
  private synth: SpeechSynthesis | null = null;
  private speakingSimInterval: any = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private preferences: VoicePreferences = DEFAULT_VOICE_PREFERENCES;

  constructor() {
    if (typeof window !== 'undefined') {
      // 1. Speech Recognition Setup
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'hi-IN';
      }

      // 2. Speech Synthesis Setup
      this.synth = window.speechSynthesis || null;
      if (this.synth) {
        this.loadVoices();
        if ('onvoiceschanged' in this.synth) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }

      // 3. Load persistent preferences
      this.loadPreferences();
    }
  }

  private loadPreferences() {
    try {
      const stored = localStorage.getItem(VOICE_PREFS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.preferences = {
          gender: parsed.gender || 'Male',
          speed: parsed.speed || 'Normal',
          speedMultiplier: parsed.speedMultiplier || 1.0,
          language: parsed.language || 'AUTO DETECT',
          accent: 'Indian'
        };
      }
    } catch (e) {
      this.preferences = DEFAULT_VOICE_PREFERENCES;
    }
  }

  public savePreferences(prefs: Partial<VoicePreferences>): VoicePreferences {
    const mult = prefs.speed === 'Slow' ? 0.85 : prefs.speed === 'Fast' ? 1.15 : 1.0;
    this.preferences = {
      ...this.preferences,
      ...prefs,
      speedMultiplier: prefs.speedMultiplier || mult
    };

    try {
      localStorage.setItem(VOICE_PREFS_STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (e) {}

    return this.preferences;
  }

  public getPreferences(): VoicePreferences {
    return { ...this.preferences };
  }

  private loadVoices() {
    if (!this.synth) return;
    this.availableVoices = this.synth.getVoices();
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices;
  }

  public isSpeechSupported(): boolean {
    return !!this.recognition;
  }

  public setLanguage(lang: IndianLanguage | string) {
    if (!this.recognition) return;
    switch (lang) {
      case 'HINDI':
      case 'BHOJPURI':
        this.recognition.lang = 'hi-IN';
        break;
      case 'BENGALI':
        this.recognition.lang = 'bn-IN';
        break;
      case 'MARATHI':
        this.recognition.lang = 'mr-IN';
        break;
      case 'TELUGU':
        this.recognition.lang = 'te-IN';
        break;
      case 'TAMIL':
        this.recognition.lang = 'ta-IN';
        break;
      case 'GUJARATI':
        this.recognition.lang = 'gu-IN';
        break;
      case 'KANNADA':
        this.recognition.lang = 'kn-IN';
        break;
      case 'MALAYALAM':
        this.recognition.lang = 'ml-IN';
        break;
      case 'PUNJABI':
        this.recognition.lang = 'pa-IN';
        break;
      case 'URDU':
        this.recognition.lang = 'ur-IN';
        break;
      case 'ENGLISH':
      case 'HINGLISH':
      case 'AUTO DETECT':
      default:
        this.recognition.lang = 'en-IN';
        break;
    }
  }

  public async startListening(
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: any) => void,
    onAmplitude?: (amp: number) => void
  ) {
    if (this.isListening) {
      this.stopListening();
    }

    this.onAmplitudeCallback = onAmplitude || null;

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        const source = this.audioContext.createMediaStreamSource(this.microphoneStream);
        source.connect(this.analyser);
        this.trackAmplitude();
      }
    } catch (micErr) {
      console.warn('Microphone stream initialization skipped:', micErr);
    }

    if (!this.recognition) {
      onError(new Error('Speech recognition not supported in this browser.'));
      return;
    }

    this.isListening = true;

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript.trim(), true);
      } else if (interimTranscript) {
        onResult(interimTranscript.trim(), false);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      this.stopAmplitudeTracking();
      onError(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.stopAmplitudeTracking();
    };

    try {
      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      onError(e);
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.stopAmplitudeTracking();
  }

  private trackAmplitude() {
    if (!this.analyser) return;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const update = () => {
      if (!this.isListening || !this.analyser) return;
      this.analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const normalizedAmp = Math.min(1, average / 80);

      if (this.onAmplitudeCallback) {
        this.onAmplitudeCallback(normalizedAmp);
      }
      this.animationFrameId = requestAnimationFrame(update);
    };

    this.animationFrameId = requestAnimationFrame(update);
  }

  private stopAmplitudeTracking() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach((t) => t.stop());
      this.microphoneStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
    if (this.onAmplitudeCallback) {
      this.onAmplitudeCallback(0);
    }
  }

  /**
   * Voice Selection Engine:
   * Selects or synthesizes natural Indian English / Hindi male or female voice.
   */
  private resolveBestVoice(gender: AgentGender = 'Male'): SpeechSynthesisVoice | null {
    if (!this.availableVoices.length && this.synth) {
      this.availableVoices = this.synth.getVoices();
    }

    const voices = this.availableVoices;
    if (!voices.length) return null;

    // 1. Filter Indian voices first (hi-IN, en-IN)
    const indianVoices = voices.filter(
      (v) =>
        v.lang === 'hi-IN' ||
        v.lang === 'en-IN' ||
        v.lang.startsWith('hi') ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('hindi')
    );

    const isMale = gender === 'Male';

    // 2. Gender heuristics for Indian voice names
    if (indianVoices.length > 0) {
      const genderMatch = indianVoices.find((v) => {
        const name = v.name.toLowerCase();
        if (isMale) {
          return (
            name.includes('male') ||
            name.includes('ravi') ||
            name.includes('madhav') ||
            name.includes('hemant') ||
            name.includes('david') ||
            name.includes('george')
          );
        } else {
          return (
            name.includes('female') ||
            name.includes('neerja') ||
            name.includes('swara') ||
            name.includes('kalpana') ||
            name.includes('priya') ||
            name.includes('zira')
          );
        }
      });

      if (genderMatch) return genderMatch;
      // Return first Indian voice if exact gender name isn't matched
      return indianVoices[0];
    }

    // 3. Fallback: General English voices with gender heuristics
    const generalMatch = voices.find((v) => {
      const name = v.name.toLowerCase();
      if (isMale) {
        return name.includes('male') || name.includes('david') || name.includes('george');
      } else {
        return name.includes('female') || name.includes('zira') || name.includes('samantha');
      }
    });

    return generalMatch || voices[0];
  }

  /**
   * Speaks aloud using configured male/female voice, Indian cadence, and speed.
   */
  public speak(
    text: string,
    genderOverride?: AgentGender,
    onStart?: () => void,
    onEnd?: () => void,
    onAmplitude?: (amp: number) => void
  ) {
    this.stopSpeaking();

    if (!this.synth) {
      if (onStart) onStart();
      setTimeout(() => {
        if (onEnd) onEnd();
      }, 1200);
      return;
    }

    const cleanText = text
      .replace(/[*_#`]/g, '')
      .replace(/http\S+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetGender = genderOverride || this.preferences.gender || 'Male';

    // Assign best matching voice
    const matchedVoice = this.resolveBestVoice(targetGender);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    // Acoustic pitch tuning (Male: calm, grounded; Female: warm, clear)
    if (targetGender === 'Male') {
      utterance.pitch = 0.92; // Natural, calm, warm Indian male pitch
    } else {
      utterance.pitch = 1.16; // Warm, clear, helpful Indian female pitch
    }

    // Speed tuning: Slow (0.85x), Normal (1.0x), Fast (1.15x)
    utterance.rate = this.preferences.speedMultiplier || 1.0;

    // Simulated fluid amplitude pulse during speech
    if (onAmplitude) {
      let t = 0;
      this.speakingSimInterval = setInterval(() => {
        t += 0.2;
        const simulatedAmp = 0.35 + Math.sin(t * 3.5) * 0.25 + Math.cos(t * 8) * 0.15;
        onAmplitude(Math.max(0.1, Math.min(0.9, simulatedAmp)));
      }, 50);
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (this.speakingSimInterval) {
        clearInterval(this.speakingSimInterval);
        this.speakingSimInterval = null;
      }
      if (onAmplitude) onAmplitude(0);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (this.speakingSimInterval) {
        clearInterval(this.speakingSimInterval);
        this.speakingSimInterval = null;
      }
      if (onAmplitude) onAmplitude(0);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  /**
   * Preview Agent Voice:
   * Male: “Namaste Pankaj, main aapka Pankaj Ji assistant hoon.”
   * Female: “Namaste Pankaj, main aapki Pankaj Ji assistant hoon.”
   */
  public previewVoice(
    gender: AgentGender,
    speed: SpeakingSpeed = 'Normal',
    onStart?: () => void,
    onEnd?: () => void,
    onAmplitude?: (amp: number) => void
  ) {
    const previewText =
      gender === 'Male'
        ? 'Namaste Pankaj, main aapka Pankaj Ji assistant hoon.'
        : 'Namaste Pankaj, main aapki Pankaj Ji assistant hoon.';

    const currentSpeedMultiplier = speed === 'Slow' ? 0.85 : speed === 'Fast' ? 1.15 : 1.0;

    // Temporarily apply speed multiplier
    const originalMult = this.preferences.speedMultiplier;
    this.preferences.speedMultiplier = currentSpeedMultiplier;

    this.speak(previewText, gender, onStart, () => {
      this.preferences.speedMultiplier = originalMult;
      if (onEnd) onEnd();
    }, onAmplitude);
  }

  public stopSpeaking() {
    if (this.speakingSimInterval) {
      clearInterval(this.speakingSimInterval);
      this.speakingSimInterval = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
  }
}

export const voiceService = new VoiceService();
