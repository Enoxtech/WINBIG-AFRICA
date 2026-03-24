'use client';

import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock notifications
    setNotifications([
      { id: '1', message: '🎉 You won ₦25,000 on Weekly Mega Draw!', time: '2h ago', read: false },
      { id: '2', message: '🔥 New jackpot campaign starting soon!', time: '5h ago', read: false },
      { id: '3', message: '🎟️ Your ticket is in the draw tonight!', time: '1d ago', read: true },
    ]);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-[#0B1F3A] border border-[#D4AF37]/30 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#D4AF37]/20">
              <h3 className="text-white font-bold text-sm">Notifications</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-400 text-sm">No notifications yet</div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                      !n.read ? 'bg-[#D4AF37]/5' : ''
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <p className="text-white text-xs leading-relaxed">{n.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{n.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
