'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCampaign } from '../api';

interface Campaign {
  id: string;
  title: string;
  description: string;
  image_url: string;
  ticket_price: number;
  total_tickets: number;
  sold_tickets: number;
  end_date: string;
  status: string;
}

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [sold, setSold] = useState(campaign.sold_tickets || 0);
  const remaining = campaign.total_tickets - sold;
  const percent = Math.min((sold / campaign.total_tickets) * 100, 100);

  useEffect(() => {
    // Poll for live updates
    const interval = setInterval(async () => {
      try {
        const data = await getCampaign(campaign.id);
        if (data?.sold_tickets !== undefined) {
          setSold(data.sold_tickets);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [campaign.id]);

  const daysLeft = campaign.end_date
    ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden group"
    >
      <div className="relative h-48 bg-light-gray overflow-hidden">
        {campaign.image_url ? (
          <img
            src={campaign.image_url}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-deep-blue to-matte-black flex items-center justify-center">
            <span className="text-6xl">🎁</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-deep-blue/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
          {remaining} left
        </div>
        {daysLeft !== null && daysLeft <= 3 && daysLeft > 0 && (
          <div className="absolute top-3 left-3 bg-red-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
            Ending Soon
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-deep-blue text-lg mb-2 line-clamp-1">{campaign.title}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{campaign.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>{sold} sold</span>
            <span>{percent.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-deep-blue">₦{Number(campaign.ticket_price).toLocaleString()}</span>
            <span className="text-gray-400 text-sm ml-1">per ticket</span>
          </div>
          <Link
            href={`/campaigns/${campaign.id}`}
            className="btn-primary text-sm py-2 px-4"
          >
            Enter Now
          </Link>
        </div>

        {daysLeft !== null && (
          <div className="mt-3 text-center text-xs text-gray-400">
            {daysLeft === 0 ? 'Draw today!' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
          </div>
        )}
      </div>
    </motion.div>
  );
}
