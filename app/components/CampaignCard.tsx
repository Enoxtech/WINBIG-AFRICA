'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';

interface Campaign {
  id: string;
  title: string;
  description?: string;
  prize_amount: number;
  ticket_price: number;
  max_tickets: number;
  sold_tickets: number;
  draw_date: string;
  status: 'active' | 'ended' | 'coming_soon';
  image_url?: string;
  jackpot?: boolean;
}

function StatusBadge({ campaign }: { campaign: Campaign }) {
  const URGENCY_THRESHOLD = 8 * 60 * 60 * 1000;
  const endTime = new Date(campaign.draw_date).getTime();
  const now = Date.now();
  const isEnded = campaign.status === 'ended' || endTime <= now;
  const isUrgent = !isEnded && endTime - now < URGENCY_THRESHOLD;
  const isJackpot = campaign.jackpot || campaign.title.toLowerCase().includes('jackpot') || campaign.prize_amount >= 5_000_000;

  if (isEnded) return <span className="absolute top-3 left-3 bg-gray-400 text-white text-xs font-black px-3 py-1 rounded-full">✅ ENDED</span>;
  if (isUrgent) return <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">🔥 HOT</span>;
  if (isJackpot) return <span className="absolute top-3 left-3 bg-gold text-deep-blue text-xs font-black px-3 py-1 rounded-full">💎 JACKPOT</span>;
  return null;
}

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [sold, setSold] = useState(campaign.sold_tickets);
  useEffect(() => {
    const id = setInterval(() => {
      setSold(prev => {
        const max = campaign.max_tickets;
        return prev >= max ? prev : prev + (Math.random() > 0.7 ? 1 : 0);
      });
    }, 5000);
    return () => clearInterval(id);
  }, [campaign.max_tickets]);

  const pct = Math.min(100, Math.round((sold / campaign.max_tickets) * 100));
  const endTime = new Date(campaign.draw_date).getTime();
  const now = Date.now();
  const isEnded = campaign.status === 'ended' || endTime <= now;
  const remaining = Math.max(0, campaign.max_tickets - sold);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative h-44 bg-gradient-to-br from-deep-blue to-deep-blue/80 flex items-center justify-center overflow-hidden">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {campaign.title.toLowerCase().includes('jackpot') ? '💎' : campaign.title.toLowerCase().includes('weekly') ? '🔥' : '🎯'}
        </span>
        <StatusBadge campaign={campaign} />
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
          {remaining} tickets left
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-black text-deep-blue text-base leading-tight pr-2">{campaign.title}</h3>
          <span className="text-gold font-black text-lg flex-shrink-0">₦{campaign.prize_amount.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="bg-deep-blue/5 text-deep-blue text-xs font-bold px-2 py-0.5 rounded-lg">🎫 ₦{campaign.ticket_price.toLocaleString()}</span>
          <span className="text-gray-300 text-xs">|</span>
          <span className="text-gray-400 text-xs">{sold} sold</span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span className="font-medium">{pct}% sold</span>
            <CountdownTimer
              targetDate={campaign.draw_date}
              className="text-gray-600 font-semibold"
            />
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-gold to-gold/70 rounded-full"
            />
          </div>
        </div>

        <Link
          href={`/campaigns/${campaign.id}`}
          className={`block w-full text-center font-bold py-3 rounded-xl text-sm transition-all ${
            isEnded
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-deep-blue hover:bg-deep-blue/90 text-white hover:shadow-lg hover:shadow-deep-blue/25'
          }`}
        >
          {isEnded ? '✅ Draw Ended' : '🎟️ Enter Now'}
        </Link>
      </div>
    </motion.div>
  );
}
