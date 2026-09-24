import React, { useState } from 'react';
import { MessageSquare, Send, X, Edit3 } from 'lucide-react';

interface MessageConfirmationModalProps {
  recipient: string;
  initialMessage: string;
  app?: string;
  onConfirm: (finalMessage: string) => void;
  onCancel: () => void;
}

export const MessageConfirmationModal: React.FC<MessageConfirmationModalProps> = ({
  recipient,
  initialMessage,
  app = 'WhatsApp',
  onConfirm,
  onCancel
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-amber-400">
            <MessageSquare className="w-5 h-5" />
            <h3 className="font-bold text-sm tracking-wide">Pankaj Ji Message Confirmation</h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            {app}
          </span>
        </div>

        <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400">
            Recipient: <span className="font-semibold text-slate-200">{recipient}</span>
          </div>

          {isEditing ? (
            <div className="space-y-1">
              <label className="text-[11px] text-amber-300/80">Edit Message:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-amber-500/40 rounded-lg p-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          ) : (
            <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-700/50">
              <p className="text-sm text-slate-100 italic">"{message}"</p>
            </div>
          )}
        </div>

        <p className="text-xs text-amber-200 font-medium">
          “Ji, {recipient} ko ye message bhej doon?”
        </p>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center justify-center space-x-1 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1" />
            <span>{isEditing ? 'DONE' : 'EDIT'}</span>
          </button>

          <button
            onClick={onCancel}
            className="flex items-center justify-center space-x-1 py-2.5 px-3 rounded-xl border border-rose-800/40 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold transition-all active:scale-95"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            <span>CANCEL</span>
          </button>

          <button
            onClick={() => onConfirm(message)}
            className="flex items-center justify-center space-x-1 py-2.5 px-3 rounded-xl border border-emerald-500/40 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5 mr-1" />
            <span>SEND</span>
          </button>
        </div>
      </div>
    </div>
  );
};
