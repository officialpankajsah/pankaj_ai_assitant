import React, { useState } from 'react';
import {
  X,
  Bell,
  Wifi,
  Bluetooth,
  Moon,
  Zap,
  Volume2,
  Trash2,
  MessageSquare,
  CreditCard,
  Calendar,
  ShoppingBag,
  Check
} from 'lucide-react';

interface NotificationItem {
  id: string;
  appName: string;
  title: string;
  body: string;
  time: string;
  icon: any;
  color: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    appName: 'WhatsApp',
    title: 'Rahul (2 new messages)',
    body: 'Bhai shaam ko coffee ke liye chalein? Movie tickets bhi book karni hain.',
    time: '2m ago',
    icon: MessageSquare,
    color: 'text-emerald-400 bg-emerald-500/20'
  },
  {
    id: 'notif-2',
    appName: 'HDFC Bank Alert',
    title: 'UPI Payment Received',
    body: '₹ 2,500.00 credited to A/C XX4921 via UPI from AMIT KUMAR.',
    time: '14m ago',
    icon: CreditCard,
    color: 'text-blue-400 bg-blue-500/20'
  },
  {
    id: 'notif-3',
    appName: 'Google Calendar',
    title: 'Tech Architecture Review',
    body: 'Meeting in 15 minutes · Google Meet link ready.',
    time: '25m ago',
    icon: Calendar,
    color: 'text-amber-400 bg-amber-500/20'
  },
  {
    id: 'notif-4',
    appName: 'Swiggy',
    title: 'Order Out For Delivery',
    body: 'Your Paneer Butter Masala & Naan from Varanasi Zaika is arriving in 8 mins.',
    time: '32m ago',
    icon: ShoppingBag,
    color: 'text-orange-400 bg-orange-500/20'
  }
];

interface NotificationShadeModalProps {
  onClose: () => void;
  onReadAloud: (text: string) => void;
  bluetoothActive: boolean;
  onToggleBluetooth: () => void;
}

export const NotificationShadeModal: React.FC<NotificationShadeModalProps> = ({
  onClose,
  onReadAloud,
  bluetoothActive,
  onToggleBluetooth
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [wifiActive, setWifiActive] = useState(true);
  const [dndActive, setDndActive] = useState(false);
  const [flashlightActive, setFlashlightActive] = useState(false);

  const handleReadAloud = () => {
    if (notifications.length === 0) {
      onReadAloud('Pankaj Ji, aapke phone par koi naya notification nahi hai.');
      return;
    }
    const summary = `Pankaj Ji, aapke paas ${notifications.length} notifications hain. Pehla notification WhatsApp par Rahul ka hai: "${notifications[0].body}". Doosra HDFC Bank ka UPI credit alert hai.`;
    onReadAloud(summary);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900/95 border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden text-slate-100 max-h-[85vh]">
        
        {/* Android Notification Shade Header */}
        <div className="p-4 bg-slate-950/90 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm text-white">Android Notification Center</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
              {notifications.length} Unread
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Android Quick Settings Tiles */}
        <div className="p-4 bg-slate-950/60 border-b border-white/5">
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
            {/* Wi-Fi */}
            <button
              onClick={() => setWifiActive(!wifiActive)}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all ${
                wifiActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Wifi className="w-4 h-4" />
              <span>{wifiActive ? 'Wi-Fi On' : 'Wi-Fi Off'}</span>
            </button>

            {/* Bluetooth */}
            <button
              onClick={onToggleBluetooth}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all ${
                bluetoothActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Bluetooth className="w-4 h-4" />
              <span>{bluetoothActive ? 'BT On' : 'BT Off'}</span>
            </button>

            {/* Do Not Disturb */}
            <button
              onClick={() => setDndActive(!dndActive)}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all ${
                dndActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>{dndActive ? 'DND On' : 'DND Off'}</span>
            </button>

            {/* Flashlight */}
            <button
              onClick={() => setFlashlightActive(!flashlightActive)}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all ${
                flashlightActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{flashlightActive ? 'Torch On' : 'Torch'}</span>
            </button>
          </div>
        </div>

        {/* Action Bar (Read Aloud & Clear All) */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-white/5 flex items-center justify-between text-xs">
          <button
            onClick={handleReadAloud}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-semibold border border-amber-500/30 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Read Out Loud</span>
          </button>

          {notifications.length > 0 && (
            <button
              onClick={() => setNotifications([])}
              className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Check className="w-8 h-8 text-emerald-400 mx-auto" />
              <p>No new notifications on device.</p>
            </div>
          ) : (
            notifications.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 hover:border-white/10 transition-colors flex space-x-3"
                >
                  <div className={`p-2 rounded-xl h-fit ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-300">{item.appName}</span>
                      <span className="text-[10px] text-slate-500">{item.time}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-100 mt-0.5">{item.title}</p>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{item.body}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pull up Handle */}
        <div className="py-2 flex justify-center bg-slate-950 border-t border-white/5">
          <div className="w-12 h-1 rounded-full bg-slate-600" />
        </div>

      </div>
    </div>
  );
};
