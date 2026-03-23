'use client';

import { useState, useEffect } from 'react';
import { getReferralStats } from '../../api';

interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidOut: number;
  referrals: {
    id: string;
    name: string;
    date: string;
    status: string;
    earned: number;
  }[];
}

export default function ReferralStatsWidget({ userId }: { userId: string }) {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getReferralStats(userId).then((d) => {
      setData(d as ReferralData);
      setLoading(false);
    });
  }, [userId]);

  const copyCode = () => {
    navigator.clipboard.writeText(data?.referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-20 bg-gray-800/50 rounded-xl" />
        <div className="h-16 bg-gray-800/50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Referral Stats</h3>
          <p className="text-gray-500 text-xs">Earn ₦2,000 per successful referral</p>
        </div>
        <span className="text-xl">🎁</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-yellow-400">{data?.totalReferrals}</div>
          <div className="text-gray-500 text-xs">Total</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-400">{data?.successfulReferrals}</div>
          <div className="text-gray-500 text-xs">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-400">{data?.pendingReferrals}</div>
          <div className="text-gray-500 text-xs">Pending</div>
        </div>
      </div>

      {/* Earnings */}
      <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-xs">Total Earnings</span>
          <span className="text-yellow-400 font-bold">₦{data?.totalEarnings?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Paid Out</span>
          <span className="text-green-400 font-semibold text-xs">₦{data?.paidOut?.toLocaleString()}</span>
        </div>
      </div>

      {/* Referral Code */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
          <span className="text-yellow-400 font-mono text-sm font-bold">{data?.referralCode}</span>
        </div>
        <button
          onClick={copyCode}
          className="bg-yellow-600 hover:bg-yellow-500 text-white text-xs px-3 py-2 rounded-lg transition-all"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Recent Referrals */}
      {data?.referrals && data.referrals.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="text-gray-400 text-xs mb-2">Recent Referrals</div>
          <div className="space-y-2">
            {data.referrals.slice(0, 3).map((ref) => (
              <div key={ref.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                    {ref.name.charAt(0)}
                  </div>
                  <span className="text-gray-300 text-xs">{ref.name}</span>
                </div>
                <div className="text-right">
                  {ref.status === 'successful' ? (
                    <span className="text-green-400 text-xs">+₦{ref.earned.toLocaleString()}</span>
                  ) : (
                    <span className="text-gray-500 text-xs">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
