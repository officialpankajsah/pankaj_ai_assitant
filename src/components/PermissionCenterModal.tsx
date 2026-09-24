import React, { useState } from 'react';
import {
  ShieldCheck,
  Mic,
  Users,
  Phone,
  MessageSquare,
  Calendar,
  Bell,
  MapPin,
  Bluetooth,
  Camera,
  Layers,
  Inbox,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AppPermission } from '../types';

interface PermissionCenterModalProps {
  onClose: () => void;
}

const INITIAL_PERMISSIONS: AppPermission[] = [
  {
    id: 'mic',
    name: 'Microphone Access',
    description: 'android.permission.RECORD_AUDIO',
    whyRequired: 'Required for voice recognition ("Hey Pankaj Ji"), real-time conversation and voice commands.',
    granted: true,
    category: 'HARDWARE'
  },
  {
    id: 'contacts',
    name: 'Contacts & Address Book',
    description: 'android.permission.READ_CONTACTS',
    whyRequired: 'Used contextually when you ask Pankaj Ji to call or message a contact by name (e.g. "Papa ko phone lagao").',
    granted: true,
    category: 'DATA'
  },
  {
    id: 'phone',
    name: 'Phone & Dialer',
    description: 'android.permission.CALL_PHONE',
    whyRequired: 'Initiates direct phone calls via supported Android telephony APIs after your explicit authorization.',
    granted: true,
    category: 'HARDWARE'
  },
  {
    id: 'sms',
    name: 'SMS & Messaging',
    description: 'android.permission.SEND_SMS',
    whyRequired: 'Drafts and dispatches SMS messages only after displaying the interactive SEND/CANCEL confirmation dialog.',
    granted: false,
    category: 'DATA'
  },
  {
    id: 'calendar',
    name: 'Calendar Access',
    description: 'android.permission.WRITE_CALENDAR',
    whyRequired: 'Allows Pankaj Ji to schedule meetings, appointments and doctor visits directly into Google Calendar.',
    granted: true,
    category: 'DATA'
  },
  {
    id: 'notifications',
    name: 'Post Notifications',
    description: 'android.permission.POST_NOTIFICATIONS',
    whyRequired: 'Required on Android 13+ to deliver alarm alerts, scheduled reminders, and background service indicators.',
    granted: true,
    category: 'SYSTEM'
  },
  {
    id: 'location',
    name: 'Precise Location',
    description: 'android.permission.ACCESS_FINE_LOCATION',
    whyRequired: 'Powers accurate Google Maps navigation, route directions (e.g. "Banaras Cantt"), and local weather forecasts.',
    granted: true,
    category: 'HARDWARE'
  },
  {
    id: 'bluetooth',
    name: 'Bluetooth Management',
    description: 'android.permission.BLUETOOTH_CONNECT',
    whyRequired: 'Checks audio output devices (earphones, car audio) and controls Bluetooth settings.',
    granted: false,
    category: 'HARDWARE'
  },
  {
    id: 'camera',
    name: 'Camera Viewfinder',
    description: 'android.permission.CAMERA',
    whyRequired: 'Allows taking quick photos and scanning documents when you say "Camera kholo".',
    granted: true,
    category: 'HARDWARE'
  },
  {
    id: 'accessibility',
    name: 'Accessibility Service (Opt-in)',
    description: 'android.accessibilityservice.AccessibilityService',
    whyRequired: 'Enables user-authorized UI automation only for supported non-API tasks. Never accesses passwords, banking, or OTP screens.',
    granted: false,
    category: 'ACCESSIBILITY'
  },
  {
    id: 'notif_listener',
    name: 'Notification Listener',
    description: 'android.permission.BIND_NOTIFICATION_LISTENER_SERVICE',
    whyRequired: 'Allows Pankaj Ji to read aloud high-priority incoming alerts and WhatsApp messages hands-free.',
    granted: false,
    category: 'ACCESSIBILITY'
  }
];

export const PermissionCenterModal: React.FC<PermissionCenterModalProps> = ({ onClose }) => {
  const [permissions, setPermissions] = useState<AppPermission[]>(() => {
    const saved = localStorage.getItem('pankaj_ji_permissions_state');
    return saved ? JSON.parse(saved) : INITIAL_PERMISSIONS;
  });

  const togglePermission = (id: string) => {
    setPermissions(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, granted: !p.granted } : p);
      localStorage.setItem('pankaj_ji_permissions_state', JSON.stringify(updated));
      return updated;
    });
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'mic': return Mic;
      case 'contacts': return Users;
      case 'phone': return Phone;
      case 'sms': return MessageSquare;
      case 'calendar': return Calendar;
      case 'notifications': return Bell;
      case 'location': return MapPin;
      case 'bluetooth': return Bluetooth;
      case 'camera': return Camera;
      case 'accessibility': return Layers;
      case 'notif_listener': return Inbox;
      default: return ShieldCheck;
    }
  };

  const grantedCount = permissions.filter(p => p.granted).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl max-h-[90vh] bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Android Permission Center</h2>
              <p className="text-xs text-slate-400">Contextual and privacy-first Android permission manager</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status banner */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-300 font-medium">Active Permissions:</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              {grantedCount} of {permissions.length} granted
            </span>
          </div>
          <span className="text-[11px] text-slate-400">No batch requests at launch</span>
        </div>

        {/* Permissions list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {permissions.map((perm) => {
            const IconComponent = getIcon(perm.id);
            return (
              <div
                key={perm.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  perm.granted
                    ? 'bg-slate-950/60 border-slate-800'
                    : 'bg-slate-950/30 border-slate-800/50 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg border mt-0.5 ${
                        perm.granted
                          ? 'bg-emerald-950/50 border-emerald-800 text-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-slate-100">{perm.name}</span>
                        {perm.granted ? (
                          <span className="inline-flex items-center text-[10px] text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3 mr-0.5" /> Granted
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] text-amber-400 font-medium">
                            <AlertTriangle className="w-3 h-3 mr-0.5" /> Disabled
                          </span>
                        )}
                      </div>
                      <code className="text-[10px] text-slate-400 font-mono">{perm.description}</code>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                        <strong className="text-amber-400/90 font-medium">Why Required: </strong>
                        {perm.whyRequired}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => togglePermission(perm.id)}
                    className={`ml-3 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shrink-0 active:scale-95 ${
                      perm.granted
                        ? 'border-emerald-600/40 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/60'
                        : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {perm.granted ? 'ENABLED' : 'ENABLE'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Pankaj Ji adheres to Android 14+ contextual runtime security standards.
          </p>
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
