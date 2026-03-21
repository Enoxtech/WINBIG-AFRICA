'use client';
import CountdownTimer from './CountdownTimer';

interface UrgencyBannerProps {
  campaigns?: any[];
}

export default function UrgencyBanner({ campaigns }: UrgencyBannerProps) {
  // Default to showing the weekly raffle if no campaigns provided
  // Use a FIXED date — never Date.now() which restarts on every refresh
  const urgent = campaigns?.[0] || {
    title: '₦500,000 Weekly Raffle',
    draw_date: '2026-03-28T17:00:00.000Z',
  };

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-semibold flex-wrap">
        <span className="text-lg">⚡</span>
        <span className="hidden sm:inline font-bold">🔥 URGENT —</span>
        <span>{urgent.title} draws in</span>
        <CountdownTimer
          targetDate={urgent.draw_date}
          className="bg-white/20 text-white font-black text-sm px-2 py-0.5 rounded-lg"
        />
        <a
          href="/campaigns"
          className="bg-white text-red-600 px-3 py-0.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
        >
          Enter Now →
        </a>
      </div>
    </div>
  );
}
