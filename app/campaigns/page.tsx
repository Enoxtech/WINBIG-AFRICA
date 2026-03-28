'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CampaignCard from '../components/CampaignCard';

export const dynamic = 'force-dynamic';
import { getCampaigns } from '../api';

type FilterType = 'all' | 'active' | 'completed' | 'jackpot';
type SortType = 'ending_soon' | 'biggest_prize' | 'most_popular';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('ending_soon');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns((data?.campaigns || []) as any[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isJackpot = (c: any) => c.jackpot === true || c.prize_amount >= 5_000_000;

  const filtered = campaigns.filter((c) => {
    if (filter === 'active') return c.status === 'active';
    if (filter === 'completed') return c.status === 'completed';
    if (filter === 'jackpot') return isJackpot(c);
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'ending_soon') {
      return new Date(a.draw_date).getTime() - new Date(b.draw_date).getTime();
    }
    if (sort === 'biggest_prize') {
      return b.prize_amount - a.prize_amount;
    }
    if (sort === 'most_popular') {
      return b.sold_tickets - a.sold_tickets;
    }
    return 0;
  });

  const sortLabels: Record<SortType, string> = {
    ending_soon: 'Ending Soonest',
    biggest_prize: 'Biggest Prize',
    most_popular: 'Most Popular',
  };

  const tabs: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'jackpot', label: 'Jackpot' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="section-title mb-3">All Campaigns</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Browse all our raffle campaigns and enter for your chance to win incredible prizes.</p>
        </motion.div>

        {/* Filter Tabs + Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <div className="flex justify-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === tab.key
                    ? 'bg-deep-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:ml-4">
            <span className="text-xs text-gray-400 hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="bg-gray-100 text-gray-700 text-sm rounded-full px-4 py-2 border-none outline-none focus:ring-2 focus:ring-gold cursor-pointer font-medium"
            >
              <option value="ending_soon">Ending Soonest</option>
              <option value="biggest_prize">Biggest Prize</option>
              <option value="most_popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Active sort label */}
        <div className="text-center mb-6">
          <span className="text-sm text-gold font-medium">
            Sorted by: {sortLabels[sort]}
            {filter === 'jackpot' && ' • Jackpot Campaigns'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : sorted.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { opacity: 1 }, hidden: { opacity: 0 } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sorted.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎟️</div>
            <h3 className="text-xl font-semibold text-deep-blue mb-2">No campaigns found</h3>
            <p className="text-gray-500">Check back soon for new exciting campaigns!</p>
          </div>
        )}
      </div>
    </div>
  );
}
