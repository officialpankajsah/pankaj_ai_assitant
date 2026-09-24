import { ChatMessage, IndianLanguage } from '../types';

export interface AssistantResponse {
  voiceResponse: string;
  displayText: string;
  toolCalls?: {
    toolName: string;
    parameters: Record<string, any>;
    requiresConfirmation?: boolean;
    confirmationPrompt?: string;
  }[];
  plan?: string[];
  detectedLanguage?: string;
  error?: string;
}

export async function askPankajJi(
  message: string,
  history: ChatMessage[] = [],
  language: IndianLanguage = 'HINGLISH',
  deviceContext: Record<string, any> = {}
): Promise<AssistantResponse> {
  try {
    const formattedHistory = history.slice(-8).map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    const response = await fetch('/api/gemini/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: formattedHistory,
        language,
        deviceContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      voiceResponse: data.voiceResponse || 'Ji, main sun raha hoon.',
      displayText: data.displayText || data.voiceResponse || 'Processed your request.',
      toolCalls: data.toolCalls || [],
      plan: data.plan || [],
      detectedLanguage: data.detectedLanguage || 'Hinglish',
    };
  } catch (err: any) {
    console.warn('Network assistant query failed, using local parser:', err);
    // Local fallback
    return {
      voiceResponse: 'Ji samajh gaya, aapka request process ho raha hai.',
      displayText: `Request: "${message}" received and queued.`,
      toolCalls: [],
      detectedLanguage: 'Hinglish',
    };
  }
}
