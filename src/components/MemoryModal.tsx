import React, { useState } from 'react';
import { Database, Plus, Trash2, Edit2, Check, X, ShieldAlert } from 'lucide-react';
import { MemoryItem } from '../types';
import { memoryService } from '../services/memoryService';

interface MemoryModalProps {
  onClose: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({ onClose }) => {
  const [memories, setMemories] = useState<MemoryItem[]>(() => memoryService.getAll());
  const [isEnabled, setIsEnabled] = useState<boolean>(() => memoryService.isEnabled());
  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState<MemoryItem['type']>('USER_PREFERENCE');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleToggleEnable = () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);
    memoryService.setEnabled(nextState);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    memoryService.add({
      type: newType,
      key: newKey.trim(),
      value: newValue.trim()
    });

    setMemories(memoryService.getAll());
    setNewKey('');
    setNewValue('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    memoryService.delete(id);
    setMemories(memoryService.getAll());
  };

  const handleStartEdit = (item: MemoryItem) => {
    setEditingId(item.id);
    setEditValue(item.value);
  };

  const handleSaveEdit = (id: string) => {
    memoryService.update(id, { value: editValue });
    setMemories(memoryService.getAll());
    setEditingId(null);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all learned memories?')) {
      memoryService.clearAll();
      setMemories([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl max-h-[90vh] bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Pankaj Ji Local Memory System</h2>
              <p className="text-xs text-slate-400">On-device Room database memory & personalization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls bar */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <label className="text-xs font-semibold text-slate-200">Adaptive Memory:</label>
            <button
              onClick={handleToggleEnable}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                isEnabled
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-600 text-rose-300'
              }`}
            >
              {isEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Memory</span>
            </button>
            {memories.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1.5 rounded-lg border border-rose-800/40 text-rose-400 hover:bg-rose-950/40 text-xs font-semibold"
                title="Clear all memories"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Add Memory Form */}
        {isAdding && (
          <form onSubmit={handleAddMemory} className="p-4 bg-slate-950/90 border-b border-amber-500/20 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-slate-400">Memory Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                >
                  <option value="USER_PREFERENCE">User Preference</option>
                  <option value="ROUTINE">Daily Routine</option>
                  <option value="COMMAND_PATTERN">Command Pattern</option>
                  <option value="CONVERSATION_CONTEXT">Conversation Context</option>
                  <option value="USER_SETTING">User Setting</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-400">Memory Key</label>
                <input
                  type="text"
                  placeholder="e.g. Favorite Language, Work Office Location"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-slate-400">Value / Information</label>
              <input
                type="text"
                placeholder="e.g. Speaks Hinglish, Morning 7am reminder"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400"
              >
                Save to Memory
              </button>
            </div>
          </form>
        )}

        {/* Memories list */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {memories.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Database className="w-10 h-10 mx-auto mb-2 opacity-30 text-amber-400" />
              <p className="text-sm">No memories recorded yet.</p>
              <p className="text-xs text-slate-400 mt-1">Pankaj Ji learns user preferences when you talk naturally.</p>
            </div>
          ) : (
            memories.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start justify-between space-x-3 group"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono">
                      {item.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">{item.key}</span>
                  </div>

                  {editingId === item.id ? (
                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 bg-slate-900 border border-amber-500 rounded p-1.5 text-xs text-slate-100"
                      />
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="p-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 rounded bg-slate-800 text-slate-400 hover:bg-slate-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300 pl-1">{item.value}</p>
                  )}
                </div>

                <div className="flex items-center space-x-1 shrink-0 pt-1">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    title="Edit memory"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] text-amber-400/80">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Sensitive personal credentials, passwords & OTPs are never stored in memory.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
