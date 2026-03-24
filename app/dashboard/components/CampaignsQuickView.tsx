'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCampaigns } from '../../api';

interface Campaign {
  id: string;
  title: string;
  description: string;
  prize: string;
  ticketPrice: number;
  endDate: string;
  status: string;
  ticketsSold: number;
  maxTickets: number;
  imageUrl?: string;
}

export default function CampaignsQuickView() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaigns().then((c) => {
      setCampaigns((c as any)?.campaigns?.slice(0, 3) || []);
      setLoading(false);
    });
  }, []);

  const formatDate = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Ended';
    if (days === 1) return '1 day left';
    if (days < 7) return `${days} days left`;
    return new Date(dateStr).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
  };

  const getProgress = (sold: number, max: number) => {
    if (!max) return 0;
    return Math.min(100, Math.round((sold / max) * 100));
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-24 bg-gray-800/50 rounded-xl" />
        <div className="h-24 bg-gray-800/50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-white font-semibold text-sm">Live Campaigns</h3>
          <p className="text-gray-500 text-xs">Join before they close</p>
        </div>
        <Link href="/campaigns" className="text-yellow-500 text-xs hover:text-yellow-400 transition-colors">
          See All →
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">No active campaigns right now</div>
      ) : (
        campaigns.map((campaign) => (
          <Link
            key={campaign.id}
            href={`/campaigns/${campaign.id}`}
            className="block bg-gray-800/50 hover:bg-gray-800/70 rounded-xl p-4 border border-white/5 transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Campaign icon */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center text-lg">
                🎯
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-medium text-sm truncate">{campaign.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    campaign.status === 'active' ? 'bg-green-900/50 text-green-400' :
                    campaign.status === 'jackpot' ? 'bg-purple-900/50 text-purple-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {campaign.status === 'jackpot' ? '🔥 JACKPOT' : campaign.status}
                  </span>
                </div>
                <div className="text-yellow-400 font-bold text-sm mb-1">
                  {campaign.prize}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">₦{campaign.ticketPrice.toLocaleString()} per ticket</span>
                  <span className={`font-medium ${
                    formatDate(campaign.endDate) === 'Ended' ? 'text-red-400' : 'text-orange-400'
                  }`}>
                    {formatDate(campaign.endDate)}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    style={{ width: `${getProgress(campaign.ticketsSold, campaign.maxTickets)}%` }}
                  />
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  {campaign.ticketsSold.toLocaleString()} / {campaign.maxTickets?.toLocaleString()} tickets sold
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
