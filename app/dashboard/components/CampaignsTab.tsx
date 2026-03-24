'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCampaigns } from '../../../api';

interface Campaign {
  id: string;
  title: string;
  description: string;
  jackpot_amount: number;
  ticket_price: number;
  max_tickets: number;
  sold_tickets: number;
  start_time: string;
  end_time: string;
  status: string;
  image_url?: string;
}

export default function CampaignsTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaigns().then((data: any) => {
      setCampaigns((data?.campaigns || []) as Campaign[]);
      setLoading(false);
    });
  }, []);

  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'upcoming');

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gradient-to-r from-[#0B1F3A]/30 to-[#0B1F3A]/10 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Active Campaigns</h2>
        <Link href="/campaigns" className="text-sm text-[#D4AF37] hover:underline">View All →</Link>
      </div>

      {activeCampaigns.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No active campaigns right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {activeCampaigns.slice(0, 5).map(campaign => {
            const sold = campaign.sold_tickets || 0;
            const max = campaign.max_tickets || 1;
            const pct = Math.min((sold / max) * 100, 100);
            const ends = new Date(campaign.end_time);
            const now = new Date();
            const hoursLeft = Math.max(0, (ends.getTime() - now.getTime()) / 3600000);

            return (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                <div className="bg-[#0B1F3A]/60 border border-[#D4AF37]/20 rounded-xl p-4 hover:border-[#D4AF37]/50 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-white">{campaign.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{campaign.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      campaign.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {campaign.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Jackpot</span>
                      <span className="text-[#D4AF37] font-bold">
                        ₦{(campaign.jackpot_amount || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Ticket Price</span>
                      <span className="text-white font-medium">
                        ₦{(campaign.ticket_price || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-[#0A0A0A] rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{sold} / {max} tickets sold</span>
                      <span>{hoursLeft < 1 ? 'Ending soon!' : `${Math.round(hoursLeft)}h left`}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
