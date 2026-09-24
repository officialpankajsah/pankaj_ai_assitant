import React, { useState } from 'react';
import { Clock, Bell, Calendar, Plus, Trash2, CheckCircle, X, Volume2 } from 'lucide-react';
import { AlarmItem, ReminderItem } from '../types';

interface ActiveAlarmsRemindersModalProps {
  onClose: () => void;
}

export const ActiveAlarmsRemindersModal: React.FC<ActiveAlarmsRemindersModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'alarms' | 'reminders'>('alarms');

  const [alarms, setAlarms] = useState<AlarmItem[]>([
    { id: 'alm-1', time: '07:00 AM', hour: 7, minute: 0, label: 'Subah Ka Alarm', enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { id: 'alm-2', time: '06:00 AM', hour: 6, minute: 0, label: 'Gym & Morning Walk', enabled: true, days: ['Everyday'] },
  ]);

  const [reminders, setReminders] = useState<ReminderItem[]>([
    { id: 'rem-1', title: 'Shaam 6 baje Rahul ko call karna', time: 'Today 06:00 PM', timestamp: Date.now() + 7200000, completed: false },
    { id: 'rem-2', title: 'Doctor meeting in Varanasi', time: 'Tomorrow 04:00 PM', timestamp: Date.now() + 86400000, completed: false },
    { id: 'rem-3', title: 'Electricity Bill Payment', time: '28th Sept 10:00 AM', timestamp: Date.now() + 259200000, completed: false }
  ]);

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              {activeTab === 'alarms' ? <Clock className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Alarms & Reminders Hub</h2>
              <p className="text-xs text-slate-400">Scheduled alarms, timers and calendar notifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('alarms')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'alarms'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Alarms ({alarms.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'reminders'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Reminders ({reminders.length})</span>
            </button>
          </div>

          <button
            onClick={playChime}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700"
            title="Test alarm sound"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Chime</span>
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-2.5 max-h-80">
          {activeTab === 'alarms' ? (
            alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  alarm.enabled
                    ? 'bg-slate-950/80 border-slate-700'
                    : 'bg-slate-950/30 border-slate-800/40 opacity-60'
                }`}
              >
                <div>
                  <div className="text-xl font-bold font-mono text-slate-100 tracking-tight">
                    {alarm.time}
                  </div>
                  <div className="text-xs text-amber-300/90 font-medium">{alarm.label}</div>
                  <div className="text-[10px] text-slate-400">{alarm.days.join(', ')}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAlarm(alarm.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                      alarm.enabled
                        ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {alarm.enabled ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => deleteAlarm(alarm.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  reminder.completed
                    ? 'bg-slate-950/30 border-slate-800/40 opacity-60'
                    : 'bg-slate-950/80 border-slate-700'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleReminder(reminder.id)}
                    className={`mt-0.5 p-1 rounded-md border ${
                      reminder.completed
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-slate-600 text-transparent hover:border-amber-400'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <div className={`text-xs font-semibold ${reminder.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {reminder.title}
                    </div>
                    <div className="text-[11px] text-amber-400/80 font-mono mt-0.5">{reminder.time}</div>
                  </div>
                </div>

                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Synced with Android AlarmManager & WorkManager</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
