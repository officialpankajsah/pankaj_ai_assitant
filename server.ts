import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt definition for Pankaj Ji
const PANKAJ_JI_SYSTEM_PROMPT = `
You are "Pankaj Ji", an intelligent, respectful, calm, voice-first Indian AI personal assistant for Android.
Voice & Personality Guidelines:
- Default Voice: Male, confident, calm, respectful, intelligent, friendly Indian tone.
- Speaking Speed: Normal conversational speed (do NOT speak too fast, do NOT sound robotic or like a news reader). Use natural pauses and appropriate sentence emphasis.
- Name & Addressing: Address the user naturally as "Ji Pankaj" or "Pankaj" or "Ji" with warmth and respect.
- Languages: Natural Hinglish by default. Also seamlessly support Bhojpuri, Hindi, English, Bengali, Marathi, Telugu, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, and Urdu.

Language-specific response style:
- Bhojpuri:
  User: "मम्मी के फोन लगा दीं।"
  Assistant: "जी पंकज, समझ गइनी। अबहीं मम्मी के फोन लगावतानी।"
  User: "WhatsApp खोल दीं।"
  Assistant: "जी पंकज, समझ गइनी। अबहीं WhatsApp खोल देतानी।"
- Hindi:
  User: "मम्मी के फोन लगा दो।"
  Assistant: "जी पंकज, अभी मम्मी को फोन लगाता हूँ।"
- Hinglish:
  User: "WhatsApp open karo"
  Assistant: "Ji Pankaj, main samajh gaya. Main ab WhatsApp open kar raha hoon."
- English:
  User: "Open YouTube."
  Assistant: "Sure Pankaj, opening YouTube."
- Concise Phone Control:
  User: "Bluetooth on kar do." -> "Ji, Bluetooth on kar raha hoon."
  User: "Kal subah 7 baje alarm laga do." -> "Ji, kal subah 7 baje ka alarm laga diya."

Return valid JSON:
{
  "voiceResponse": "Natural spoken response (concise, warm, respectful) to be read aloud",
  "displayText": "Detailed formatted text for chat UI",
  "toolCalls": [
    {
      "toolName": "OpenAppTool | CallTool | MessageTool | ContactsTool | CalendarTool | ReminderTool | AlarmTool | MapsTool | BrowserTool | CameraTool | MediaTool | NotificationTool | BatteryTool | NetworkTool | BluetoothTool | SettingsTool | ClipboardTool | ShareTool | SearchTool | WeatherTool | FileTool",
      "parameters": { ... },
      "requiresConfirmation": boolean,
      "confirmationPrompt": "string or null"
    }
  ],
  "plan": [ "Step 1...", "Step 2..." ] (optional),
  "detectedLanguage": "Hinglish | Bhojpuri | Hindi | English | etc."
}
`;

// Intent helper fallback if Gemini is offline or without API key
function ruleBasedParser(userQuery: string) {
  const query = userQuery.toLowerCase().trim();

  // Bhojpuri detection
  const isBhojpuri = query.includes('लगा दीं') || query.includes('खोल दीं') || query.includes('बानी') || query.includes('गइनी') || query.includes('बताईं') || query.includes('के फोन') || query.includes('दीहल जाव') || query.includes('हमनी');

  // App Launcher
  if (query.includes('youtube')) {
    return {
      voiceResponse: isBhojpuri ? 'जी पंकज, समझ गइनी। अबहीं YouTube खोल देतानी।' : 'Ji Pankaj, main samajh gaya. Main ab YouTube open kar raha hoon.',
      displayText: 'Opening YouTube on your device...',
      toolCalls: [{ toolName: 'OpenAppTool', parameters: { app: 'YouTube', packageName: 'com.google.android.youtube' }, requiresConfirmation: false }],
      detectedLanguage: isBhojpuri ? 'Bhojpuri' : 'Hinglish',
    };
  }
  if (query.includes('whatsapp')) {
    return {
      voiceResponse: isBhojpuri ? 'जी पंकज, समझ गइनी। अबहीं WhatsApp खोल देतानी।' : 'Ji Pankaj, main samajh gaya. Main ab WhatsApp open kar raha hoon.',
      displayText: 'Opening WhatsApp...',
      toolCalls: [{ toolName: 'OpenAppTool', parameters: { app: 'WhatsApp', packageName: 'com.whatsapp' }, requiresConfirmation: false }],
      detectedLanguage: isBhojpuri ? 'Bhojpuri' : 'Hinglish',
    };
  }
  if (query.includes('gmail') || query.includes('जीमेल') || query.includes('email') || query.includes('mail')) {
    return {
      voiceResponse: isBhojpuri ? 'जी पंकज, Gmail खोल देतानी।' : 'Ji Pankaj, Gmail khol raha hoon.',
      displayText: 'Opening Gmail...',
      toolCalls: [{ toolName: 'OpenAppTool', parameters: { app: 'Gmail', packageName: 'com.google.android.gm' }, requiresConfirmation: false }],
      detectedLanguage: isBhojpuri ? 'Bhojpuri' : 'Hinglish',
    };
  }
  if (query.includes('instagram')) {
    return {
      voiceResponse: isBhojpuri ? 'जी पंकज, Instagram खोल देतानी।' : 'Ji Pankaj, Instagram khol raha hoon.',
      displayText: 'Opening Instagram...',
      toolCalls: [{ toolName: 'OpenAppTool', parameters: { app: 'Instagram', packageName: 'com.instagram.android' }, requiresConfirmation: false }],
      detectedLanguage: isBhojpuri ? 'Bhojpuri' : 'Hinglish',
    };
  }
  if (query.includes('facebook') || query.includes('फेसबुक')) {
    return {
      voiceResponse: isBhojpuri ? 'पंकज जी, Facebook आपके फोन में इंस्टॉल नइखे।' : 'Pankaj Ji, Facebook aapke phone mein installed nahi hai.',
      displayText: 'App not installed: Facebook is not installed on this device.',
      toolCalls: [{ toolName: 'OpenAppTool', parameters: { app: 'Facebook', packageName: 'com.facebook.katana' }, requiresConfirmation: false }],
      detectedLanguage: isBhojpuri ? 'Bhojpuri' : 'Hinglish',
    };
  }
  if (query.includes('bank') || query.includes('banking') || query.includes('बैंक')) {
    return {
      voiceResponse: isBhojpuri ? 'कवन बैंक के ऐप खोले के बा? हमरा लगे YONO SBI, HDFC, Google Pay, PhonePe, Paytm बा।' : 'Aap kaun sa banking app open karna chahte hain? (YONO SBI, HDFC MobileBanking, Google Pay, PhonePe, Paytm)',
      displayText: 'Disambiguation: Which banking app do you want to open?',
      toolCalls: [{ toolName: 'OpenAppTool', parameters: { app: 'banking app' }, requiresConfirmation: false }],
      detectedLanguage: isBhojpuri ? 'Bhojpuri' : 'Hinglish',
    };
  }
  if (query.includes('camera') || query.includes('photo') || query.includes('तस्वीर')) {
    return {
      voiceResponse: isBhojpuri ? 'जी पंकज, कैमरा चालू हो गइल।' : 'Bilkul Ji, Camera open ho raha hai.',
      displayText: 'Opening Camera...',
      toolCalls: [{ toolName: 'CameraTool', parameters: { mode: 'photo' }, requiresConfirmation: false }],
      detectedLanguage: isBhojpuri ? 'Bhojpuri' : 'Hinglish',
    };
  }
  if (query.includes('chrome') || query.includes('browser')) {
    return {
      voiceResponse: isBhojpuri ? 'जी पंकज, Chrome खोल देतानी।' : 'Ji Pankaj, Chrome browser khol diya hai.',
      displayText: 'Opening Google Chrome...',
      toolCalls: [{ toolName: 'BrowserTool', parameters: { url: 'https://google.com' }, requiresConfirmation: false }],
      detectedLanguage: isBhojpuri ? 'Bhojpuri' : 'Hinglish',
    };
  }
  if (query.includes('settings') || query.includes('सेटिंग')) {
    return {
      voiceResponse: isBhojpuri ? 'जी पंकज, फोन के सेटिंग्स खोल देतानी।' : 'Ji Pankaj, Settings khol raha hoon.',
      displayText: 'Opening Android Device Settings...',
      toolCalls: [{ toolName: 'OpenAppTool', parameters: { app: 'Settings', packageName: 'com.android.settings' }, requiresConfirmation: false }],
      detectedLanguage: isBhojpuri ? 'Bhojpuri' : 'Hinglish',
    };
  }
  if (query.includes('notification') || query.includes('सूचना')) {
    return {
      voiceResponse: 'Ji Pankaj, aapke phone par 4 naye notifications hain. Pehla message WhatsApp par Rahul ka hai.',
      displayText: 'Showing Android Notification Center (4 unread)...',
      toolCalls: [{ toolName: 'NotificationTool', parameters: { title: 'Pankaj Ji Notifications', body: '4 active notifications' }, requiresConfirmation: false }],
      detectedLanguage: 'Hinglish',
    };
  }

  // Silent mode / volume / settings
  if (query.includes('silent') || query.includes('mute') || query.includes('sound') || query.includes('मूक')) {
    return {
      voiceResponse: isBhojpuri ? 'जी पंकज, फोन के साइलेंट मोड पर लगा देले बानी।' : 'Ji, phone ko silent mode par switch kar diya hai.',
      displayText: 'Switched device to Silent / DND mode.',
      toolCalls: [{ toolName: 'SettingsTool', parameters: { setting: 'ringer_mode', value: 'silent' }, requiresConfirmation: false }],
      detectedLanguage: isBhojpuri ? 'Bhojpuri' : 'Hinglish',
    };
  }

  // Call
  if (query.includes('call') || query.includes('phone') || query.includes('फोन')) {
    let contactName = 'Rahul';
    if (query.includes('मम्मी') || query.includes('mummy') || query.includes('maa')) contactName = 'Mummy';
    else if (query.includes('पापा') || query.includes('papa') || query.includes('pitaji')) contactName = 'Papa';
    else {
      const match = query.match(/(?:call|phone|mila(?:o|na))\s*(?:to\s*)?([a-zA-Z\u0900-\u097F]+)/i) ||
                    query.match(/([a-zA-Z\u0900-\u097F]+)\s*ko\s*call/i) ||
                    query.match(/([a-zA-Z\u0900-\u097F]+)\s*के\s*फोन/i);
      if (match) contactName = match[1];
    }

    const voiceMsg = isBhojpuri
      ? `जी पंकज, अभी ${contactName} के फोन लगावतानी।`
      : query.includes('फोन लगा दो')
      ? `जी पंकज, अभी ${contactName} को फोन लगाता हूँ।`
      : `Bilkul Ji, ${contactName} ko call mila raha hoon.`;

    return {
      voiceResponse: voiceMsg,
      displayText: `Initiating call to ${contactName}...`,
      toolCalls: [{ toolName: 'CallTool', parameters: { contactName, phoneNumber: '+91 98765 43210' }, requiresConfirmation: true, confirmationPrompt: `Ji, kya main ${contactName} ko call karun?` }],
      detectedLanguage: isBhojpuri ? 'Bhojpuri' : 'Hinglish',
    };
  }

  // Bluetooth
  if (query.includes('bluetooth') || query.includes('ब्लूटूथ')) {
    return {
      voiceResponse: 'Ji, Bluetooth on kar raha hoon.',
      displayText: 'Bluetooth enabled and scanning for paired devices.',
      toolCalls: [{ toolName: 'BluetoothTool', parameters: { action: 'toggle' }, requiresConfirmation: false }],
      detectedLanguage: 'Hinglish',
    };
  }

  // Message
  if (query.includes('message') || query.includes('sms') || query.includes('bhejo')) {
    return {
      voiceResponse: 'Ji, message draft taiyaar hai. Kya main ise send kar doon?',
      displayText: 'Message prepared: "Main 10 minute mein aa raha hoon." recipient: Rahul',
      toolCalls: [{
        toolName: 'MessageTool',
        parameters: { recipient: 'Rahul', message: 'Main 10 minute mein aa raha hoon.', app: 'WhatsApp' },
        requiresConfirmation: true,
        confirmationPrompt: 'Ji, Rahul ko ye message bhej doon?'
      }],
      detectedLanguage: 'Hinglish',
    };
  }

  // Alarm
  if (query.includes('alarm')) {
    const timeMatch = query.match(/(\d+)(?:\s*(?:am|pm|baje))?/i);
    const hour = timeMatch ? parseInt(timeMatch[1], 10) : 7;
    return {
      voiceResponse: `Bilkul Ji, subah ${hour} baje ka alarm set kar diya hai.`,
      displayText: `Alarm set for ${hour}:00 AM.`,
      toolCalls: [{ toolName: 'AlarmTool', parameters: { hour: hour, minute: 0, label: 'Pankaj Ji Wake Up' }, requiresConfirmation: false }],
      detectedLanguage: 'Hinglish',
    };
  }

  // Reminder
  if (query.includes('remind') || query.includes('yaad')) {
    return {
      voiceResponse: 'Samajh gaya Ji, reminder schedule kar diya hai.',
      displayText: 'Reminder set: "Office meeting / Umbrella" at the requested time.',
      toolCalls: [{ toolName: 'ReminderTool', parameters: { title: 'Office Task', timestamp: Date.now() + 3600000 }, requiresConfirmation: false }],
      detectedLanguage: 'Hinglish',
    };
  }

  // Maps / Navigation
  if (query.includes('route') || query.includes('map') || query.includes('rasta') || query.includes('directions')) {
    let dest = 'Banaras Cantt';
    if (query.includes('airport')) dest = 'Varanasi International Airport';
    else if (query.includes('petrol')) dest = 'Nearest Petrol Pump';
    return {
      voiceResponse: `Ji, ${dest} ka route Google Maps par khol raha hoon.`,
      displayText: `Navigating to ${dest} via Google Maps...`,
      toolCalls: [{ toolName: 'MapsTool', parameters: { destination: dest, mode: 'driving' }, requiresConfirmation: false }],
      detectedLanguage: 'Hinglish',
    };
  }

  // Battery
  if (query.includes('battery') || query.includes('charge')) {
    return {
      voiceResponse: 'Ji, aapke phone ki battery 82 percent hai aur abhi charging disconnected hai.',
      displayText: 'Battery Status: 82% (Discharging, Good Health, est. 9 hours remaining).',
      toolCalls: [{ toolName: 'BatteryTool', parameters: {}, requiresConfirmation: false }],
      detectedLanguage: 'Hinglish',
    };
  }

  // Wifi / Internet
  if (query.includes('wifi') || query.includes('internet') || query.includes('network') || query.includes('bluetooth')) {
    return {
      voiceResponse: 'Ji, aapka Wi-Fi High-Speed 5GHz network se connected hai aur Bluetooth active hai.',
      displayText: 'Network Status: Connected to "Home_5G" (Wi-Fi 6, 240 Mbps). Bluetooth: ON.',
      toolCalls: [{ toolName: 'NetworkTool', parameters: {}, requiresConfirmation: false }],
      detectedLanguage: 'Hinglish',
    };
  }

  // Weather
  if (query.includes('weather') || query.includes('mausam') || query.includes('baarish') || query.includes('rain')) {
    return {
      voiceResponse: 'Ji, aaj mausam saaf hai, 28 degree Celsius taapmaan hai. Baarish ki probability sirf 15 percent hai.',
      displayText: 'Weather Report: Varanasi, India — 28°C, Mostly Sunny, Humidity 54%, Rain Chance 15%.',
      toolCalls: [{ toolName: 'WeatherTool', parameters: { city: 'Varanasi' }, requiresConfirmation: false }],
      detectedLanguage: 'Hinglish',
    };
  }

  // Default Greeting / Conversational fallback
  return {
    voiceResponse: 'Namaste Ji! Main Pankaj Ji hoon. Bataiye, main aapki kya madad kar sakta hoon?',
    displayText: 'Namaste Ji! Aap mujhse phone calls, messages, reminders, apps, maps ya device settings control karne ke liye keh sakte hain.',
    toolCalls: [],
    detectedLanguage: 'Hinglish',
  };
}

// API endpoint for Pankaj Ji AI assistant
app.post('/api/gemini/assistant', async (req: Request, res: Response) => {
  try {
    const { message, history = [], language = 'Hinglish', deviceContext = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // If Gemini client is available, use real Gemini 3.8 Flash model
    if (ai) {
      try {
        const contents = [
          ...history.map((h: any) => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          })),
          {
            role: 'user',
            parts: [
              {
                text: `[User Preferred Language: ${language}]
[Device Context: ${JSON.stringify(deviceContext)}]
User Query: "${message}"

Remember: Respond as Pankaj Ji, respectful, natural Hinglish or specified language, use "Ji" naturally. Return valid JSON only as specified in system instructions.`,
              },
            ],
          },
        ];

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents as any,
          config: {
            systemInstruction: PANKAJ_JI_SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch (geminiError) {
        console.warn('Gemini API query error, using deterministic Indian engine fallback:', geminiError);
        const fallback = ruleBasedParser(message);
        return res.json(fallback);
      }
    } else {
      // Fallback engine
      const fallback = ruleBasedParser(message);
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error('Assistant error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      voiceResponse: 'Ji maaf kijiye, abhi kuch technical issue aa gaya. Main dobara try kar raha hoon.',
      displayText: 'Encountered a temporary error. Please try again.',
    });
  }
});

// Device status endpoint
app.get('/api/device/status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    assistantName: 'Pankaj Ji',
    version: '2.4.0',
    platform: 'Android 14 / UpsideDownCake (API 34)',
    capabilities: [
      'VoiceSTT',
      'VoiceTTS',
      'TaskPlanner',
      'AccessibilityService',
      'ForegroundService',
      'NotificationListener',
      'RoomMemory',
      'GeminiReasoning'
    ]
  });
});

// Dev vs Prod Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Pankaj Ji Assistant Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
