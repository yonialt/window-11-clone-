import React, { useState } from 'react';
import { Bell, Star, GitFork, Rocket, CheckCheck, Settings } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsFlyoutProps {
  onClose: () => void;
  onOpenSettings: () => void;
}

const STORAGE_KEY = 'portfolio_os_notifications_v1';

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Portfolio is live',
    message: 'Your Windows Desktop Portfolio OS is now serving on port 3000.',
    time: 'Just now',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'New GitHub star',
    message: 'Someone starred the AeroForm Furniture project ⭐',
    time: '12 minutes ago',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Backup complete',
    message: 'LocalStorage snapshot saved successfully.',
    time: '1 hour ago',
    read: true,
  },
];

export const NotificationsFlyout: React.FC<NotificationsFlyoutProps> = ({ onClose, onOpenSettings }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        /* ignore */
      }
    }
    return INITIAL_NOTIFICATIONS;
  });
  const unreadCount = notifications.filter((n) => !n.read).length;

  const persist = (next: Notification[]) => {
    setNotifications(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const markRead = (id: string) =>
    persist(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const clearAll = () => persist(notifications.map((n) => ({ ...n, read: true })));

  const iconFor = (title: string) => {
    if (title.toLowerCase().includes('star')) return <Star className="w-3.5 h-3.5 text-amber-400" />;
    if (title.toLowerCase().includes('fork')) return <GitFork className="w-3.5 h-3.5 text-sky-400" />;
    if (title.toLowerCase().includes('live') || title.toLowerCase().includes('backup'))
      return <Rocket className="w-3.5 h-3.5 text-emerald-400" />;
    return <Bell className="w-3.5 h-3.5 text-black-70" />;
  };

  return (
    <div
      className="w-80 rounded-2xl overflow-hidden shadow-2xl border border-black/10 text-black-70"
      style={{ background: 'rgba(239, 241, 241, 0)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-balck-70" />
          <span className="text-sm font-semibold text-black">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-black-600 text-[9px] font-bold text-black">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-[11px] text-balck/70 hover:text-black transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      {/* Notifications list */}
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-xs text-balck/70 py-10">No notifications</p>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 ${n.read ? 'opacity-60' : ''
                }`}
            >
              <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center">
                {iconFor(n.title)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-black truncate">{n.title}</p>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                </div>
                <p className="text-[11px] text-black/70 leading-snug mt-0.5 line-clamp-2">{n.message}</p>
                <p className="text-[10px] text-black/70 mt-1">{n.time}</p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <button
        onClick={() => {
          onClose();
          onOpenSettings();
        }}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 border-t border-white/8 text-[11px] text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
      >
        <Settings className="w-3 h-3" />
        Manage notifications
      </button>
    </div>
  );
};
