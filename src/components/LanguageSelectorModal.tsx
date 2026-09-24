import React from 'react';
import { Globe2, Check, X } from 'lucide-react';
import { IndianLanguage } from '../types';

interface LanguageSelectorModalProps {
  selectedLanguage: IndianLanguage;
  onSelectLanguage: (lang: IndianLanguage) => void;
  onClose: () => void;
}

interface LanguageOption {
  key: IndianLanguage;
  name: string;
  nativeName: string;
  sampleGreeting: string;
}

const LANGUAGES: LanguageOption[] = [
  { key: 'AUTO DETECT', name: 'Auto Detect Language', nativeName: 'स्वतः पहचान', sampleGreeting: 'Automatically adapts to how you speak' },
  { key: 'HINGLISH', name: 'Hinglish (Default)', nativeName: 'Hinglish', sampleGreeting: 'Namaste Ji, main aapki kya madad kar sakta hoon?' },
  { key: 'HINDI', name: 'Hindi', nativeName: 'हिन्दी', sampleGreeting: 'नमस्ते पंकज जी, मैं आपका सहायक हूँ।' },
  { key: 'BHOJPURI', name: 'Bhojpuri', nativeName: 'भोजपुरी', sampleGreeting: 'प्रणाम पंकज जी, हम रउआ के का मदद कर सकीं?' },
  { key: 'ENGLISH', name: 'Indian English', nativeName: 'English (IN)', sampleGreeting: 'Namaste Ji, I am Pankaj Ji. How may I assist you today?' },
  { key: 'BENGALI', name: 'Bengali', nativeName: 'বাংলা', sampleGreeting: 'নমস্কার জি, আমি পঙ্কজ জি। আপনাকে কীভাবে সাহায্য করতে পারি?' },
  { key: 'MARATHI', name: 'Marathi', nativeName: 'मराठी', sampleGreeting: 'नमस्कार जी, मी पंकज जी आहे. मी आपली काय मदत करू शकतो?' },
  { key: 'TELUGU', name: 'Telugu', nativeName: 'తెలుగు', sampleGreeting: 'నమస్కారం జీ, నేను పంకజ్ జీ. మీకు ఎలా సహాయపడగలను?' },
  { key: 'TAMIL', name: 'Tamil', nativeName: 'தமிழ்', sampleGreeting: 'வணக்கம் ஜி, நான் பங்கஜ் ஜி. உங்களுக்கு எப்படி உதவ முடியும்?' },
  { key: 'GUJARATI', name: 'Gujarati', nativeName: 'ગુજરાતી', sampleGreeting: 'નમસ્તે જી, હું પંકજ જી છું. હું આપને કેવી રીતે મદદ કરી શકું?' },
  { key: 'KANNADA', name: 'Kannada', nativeName: 'ಕನ್ನಡ', sampleGreeting: 'ನಮಸ್ಕಾರ ಜಿ, ನಾನು ಪಂಕಜ್ ಜಿ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?' },
  { key: 'MALAYALAM', name: 'Malayalam', nativeName: 'മലയാളം', sampleGreeting: 'നമസ്കാരം ജി, ഞാൻ പങ്കജ് ജി. ഞാൻ എങ്ങനെ സഹായിക്കണം?' },
  { key: 'PUNJABI', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', sampleGreeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਪੰਕਜ ਜੀ ਹਾਂ। ਦੱਸੋ ਕੀ ਮਦਦ ਕਰਾਂ?' },
  { key: 'ODIA', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', sampleGreeting: 'ନମସ୍କାର ଜୀ, ମୁଁ ପଙ୍କଜ ଜୀ। ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିବି?' },
  { key: 'ASSAMESE', name: 'Assamese', nativeName: 'অসমীয়া', sampleGreeting: 'নমস্কাৰ জী, মই পংকজ জী। আপোনাক কিদৰে সহায় কৰিব পাৰোঁ?' },
  { key: 'URDU', name: 'Urdu', nativeName: 'اردو', sampleGreeting: 'آداب جی، میں پنکج جی ہوں۔ فرمائیے میں آپ کی کیا مدد کر سکتا ہوں؟' },
];

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg max-h-[85vh] bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Indian Language Engine</h2>
              <p className="text-xs text-slate-400">15 supported languages & natural mixed dialects</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.key;
            return (
              <button
                key={lang.key}
                onClick={() => {
                  onSelectLanguage(lang.key);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-md shadow-amber-950/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-slate-100">{lang.name}</span>
                    <span className="text-xs font-medium text-amber-400 font-sans">
                      ({lang.nativeName})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 italic line-clamp-1">"{lang.sampleGreeting}"</p>
                </div>

                {isSelected && (
                  <div className="p-1.5 rounded-full bg-amber-500 text-slate-950 shrink-0 ml-2">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-400">
          Pankaj Ji understands mixed-language sentences effortlessly.
        </div>
      </div>
    </div>
  );
};
