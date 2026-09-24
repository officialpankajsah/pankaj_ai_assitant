import React, { useState } from 'react';
import {
  User,
  Sparkles,
  Volume2,
  CheckCircle2,
  Trash2,
  Search,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatHistoryProps {
  messages: ChatMessage[];
  onSpeakAgain: (text: string) => void;
  onClearHistory: () => void;
  onDeleteMessage: (id: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  onSpeakAgain,
  onClearHistory,
  onDeleteMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = messages.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.content.toLowerCase().includes(q) ||
      (m.voiceText && m.voiceText.toLowerCase().includes(q)) ||
      (m.toolCalls && m.toolCalls.some(tc => tc.toolName.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Header controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Conversation
          </span>
          <span className="text-[10px] text-slate-400">
            {messages.length} messages
          </span>
        </div>

        {messages.length > 1 && (
          <button
            onClick={onClearHistory}
            className="text-[11px] text-rose-400/80 hover:text-rose-300 flex items-center space-x-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Message Stream */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No matching messages. Say "Hey Pankaj Ji" or tap any quick tool to begin!
          </div>
        ) : (
          filtered.map((msg) => {
            const isAssistant = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} group`}
              >
                <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-400">
                  {isAssistant ? (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span className="font-semibold text-amber-300">Pankaj Ji</span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-slate-300">You</span>
                      <User className="w-3 h-3 text-slate-400" />
                    </>
                  )}
                  <span>·</span>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Modern Bubble */}
                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-3xl p-3.5 text-xs leading-relaxed shadow-lg transition-all ${
                    isAssistant
                      ? 'bg-slate-900/90 border border-white/[0.08] text-slate-100 rounded-tl-sm backdrop-blur-xl'
                      : 'bg-amber-500 text-slate-950 font-medium rounded-tr-sm shadow-amber-950/20'
                  }`}
                >
                  <p className="text-sm font-sans whitespace-pre-wrap">{msg.content}</p>

                  {/* Multi-step Planner Steps */}
                  {msg.planSteps && msg.planSteps.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.08] space-y-1.5">
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        Task Planner (Section 21):
                      </div>
                      {msg.planSteps.map((step, sIdx) => (
                        <div key={sIdx} className="text-[11px] text-slate-300 flex items-start space-x-2">
                          <span className="text-amber-400 font-mono font-bold">{sIdx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tool Invocations */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.08] space-y-1.5">
                      {msg.toolCalls.map((tc, tIdx) => (
                        <div
                          key={tIdx}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-white/[0.06] text-[11px]"
                        >
                          <div className="flex items-center space-x-2 text-slate-300">
                            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="font-mono font-bold text-cyan-300">{tc.toolName}</span>
                          </div>

                          <div className="flex items-center space-x-1 text-emerald-400 font-semibold text-[10px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action buttons on message */}
                  {isAssistant && (
                    <div className="flex items-center justify-end space-x-3 mt-2.5 pt-1.5 border-t border-white/[0.05] text-[11px] text-slate-400">
                      <button
                        onClick={() => onSpeakAgain(msg.voiceText || msg.content)}
                        className="hover:text-amber-300 flex items-center space-x-1 transition-colors"
                        title="Replay Voice"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Speak</span>
                      </button>
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        className="hover:text-rose-400 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
