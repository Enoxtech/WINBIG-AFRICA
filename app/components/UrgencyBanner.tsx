'use client';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from './CountdownTimer';

interface UrgencyBannerProps {
  campaigns?: any[];
}

export default function UrgencyBanner({ campaigns }: UrgencyBannerProps) {
  const URGENCY_THRESHOLD_MS = 8 * 60 * 60 * 1000; // 8 hours
  
  // Sample urgent campaigns if none provided
  const urgentCampaigns = campaigns?.length
    ? campaigns.filter((c: any) => {
        const end = new Date(c.draw_date || c.end_date).getTime();
        const now = Date.now();
        return end > now && end - now < URGENCY_THRESHOLD_MS;
      })
    : [
        { id: 1, title: '₦5,000,000 Mega Jackpot', draw_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() },
        { id: 2, title: '₦500,000 Weekly Raffle', draw_date: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() },
      ];

  if (urgentCampaigns.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-semibold">
          <span className="animate-pulse text-lg">⚡</span>
          <span className="hidden sm:inline">🔥 URGENT —</span>
          <span>{urgentCampaigns[0].title} ends in</span>
          <CountdownTimer
            targetDate={urgentCampaigns[0].draw_date || urgentCampaigns[0].end_date}
            className="!text-white !font-black !text-sm bg-white/20 px-2 py-0.5 rounded-lg"
          />
          <span>— Don't miss out!</span>
          <a href="/campaigns" className="bg-white text-red-600 px-3 py-0.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors">
            Enter Now →
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
