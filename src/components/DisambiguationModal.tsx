import React from 'react';
import { PhoneCall, UserCheck, X } from 'lucide-react';

interface ContactChoice {
  name: string;
  phone: string;
  relationship: string;
}

interface DisambiguationModalProps {
  queryName: string;
  choices?: ContactChoice[];
  onSelect: (contact: ContactChoice) => void;
  onCancel: () => void;
}

const DEFAULT_CHOICES: ContactChoice[] = [
  { name: 'Rahul Sharma', phone: '+91 98765 11111', relationship: 'Office Colleague' },
  { name: 'Rahul Verma', phone: '+91 98765 22222', relationship: 'College Friend' },
  { name: 'Rahul Gupta', phone: '+91 98765 33333', relationship: 'Neighbor' }
];

export const DisambiguationModal: React.FC<DisambiguationModalProps> = ({
  queryName,
  choices = DEFAULT_CHOICES,
  onSelect,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-amber-400">
            <PhoneCall className="w-5 h-5" />
            <h3 className="font-bold text-sm tracking-wide">Contact Disambiguation</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-amber-200 font-medium">
            “Ji, mujhe multiple contacts mile hain. Aap kis {queryName} ko call karna chahte hain?”
          </p>
          <p className="text-[11px] text-slate-400">
            Select the intended recipient below:
          </p>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {choices.map((contact, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(contact)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100 group-hover:text-amber-300">
                    {contact.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {contact.relationship} • {contact.phone}
                  </div>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <PhoneCall className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={onCancel}
            className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            Cancel Call
          </button>
        </div>
      </div>
    </div>
  );
};
