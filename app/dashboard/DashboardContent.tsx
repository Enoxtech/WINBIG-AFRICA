'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import NotificationBell from '../components/NotificationBell';
import CampaignsTab from './components/CampaignsTab';
import ProfileTab from './components/ProfileTab';
import ReferralStatsWidget from './components/ReferralStatsWidget';
import { useAuth } from '../context/AuthContext';

const WalletTab = dynamic(() => import('./wallet/WalletClient'), { ssr: false });

function getMockStats() {
  return {
    ticketsBought: 142,
    campaignsEntered: 28,
    wins: 8,
    losses: 20,
    totalWon: 157500,
    totalSpent: 88000,
    activeTickets: 12,
    winStreak: 5,
    payoutRate: '28%',
  };
}

function getMockUser() {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('wb_user');
  return u ? JSON.parse(u) : null;
}

function OverviewTab({ userId }: { userId: string }) {
  const [stats, setStats] = useState<ReturnType<typeof getMockStats> | null>(null);

  useEffect(() => {
    import('../api').then(m => {
      m.getDashboardStats(userId).then((data: any) => setStats(data));
    });
  }, [userId]);

  const s = stats || getMockStats();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Tickets', value: s.activeTickets, icon: '🎟️', color: 'text-[#D4AF37]' },
          { label: 'Total Won', value: `₦${s.totalWon.toLocaleString()}`, icon: '💰', color: 'text-green-400' },
          { label: 'Win Streak', value: `${s.winStreak}🔥`, icon: '🔥', color: 'text-orange-400' },
          { label: 'Payout Rate', value: s.payoutRate, icon: '📊', color: 'text-blue-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0B1F3A]/60 border border-[#D4AF37]/20 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Wins */}
      <div className="bg-[#0B1F3A]/60 border border-[#D4AF37]/20 rounded-xl p-5">
        <h3 className="text-white font-bold mb-3">🏆 Recent Wins</h3>
        <div className="space-y-3">
          {[
            { amount: '₦75,000', campaign: 'Weekly Mega Draw', date: '2 days ago' },
            { amount: '₦12,500', campaign: 'Daily Quick Draw', date: '1 week ago' },
          ].map((win, i) => (
            <div key={i} className="flex items-center justify-between bg-[#0A0A0A]/50 rounded-lg p-3">
              <div>
                <p className="text-green-400 font-bold">{win.amount}</p>
                <p className="text-gray-400 text-xs">{win.campaign}</p>
              </div>
              <span className="text-gray-500 text-xs">{win.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns Quick Access */}
      <div className="bg-[#0B1F3A]/60 border border-[#D4AF37]/20 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold">🎯 Active Campaigns</h3>
          <a href="/campaigns" className="text-[#D4AF37] text-xs hover:underline">View All →</a>
        </div>
        <CampaignsTab />
      </div>
    </div>
  );
}

export default function DashboardContent() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('Player');

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isLoading && (!user || !token)) {
      router.push('/login');
    }
  }, [user, token, isLoading, router]);

  useEffect(() => {
    if (user) {
      setUserId(user.id || '');
      setUserName(user.name?.split(' ')[0] || 'Player');
    } else {
      const u = getMockUser();
      if (u) {
        setUserId(u.id || '');
        setUserName(u.name?.split(' ')[0] || 'Player');
      }
    }
  }, [user]);

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'tickets', label: '🎟️ My Tickets' },
    { id: 'campaigns', label: '🎯 Campaigns' },
    { id: 'achievements', label: '🏅 Achievements' },
    { id: 'referral', label: '🔗 Referral' },
    { id: 'wallet', label: '💰 Wallet' },
    { id: 'profile', label: '👤 Profile' },
  ];

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-deep-blue border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎰</span>
              <span className="text-white font-bold text-xl">WINBIG<span className="text-gold">AFRICA</span></span>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <a href="/" className="text-gray-300 hover:text-gold text-sm font-medium transition-colors">
                Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Bar */}
      <div className="bg-deep-blue/95 border-b border-[#D4AF37]/10 sticky top-16 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-thin">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gold text-deep-blue shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && <OverviewTab userId={userId} />}
        {activeTab === 'tickets' && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎟️</div>
            <h3 className="text-xl font-bold text-deep-blue mb-2">My Tickets</h3>
            <p className="text-gray-500">Browse your active tickets here.</p>
            <a href="/dashboard/tickets" className="mt-4 inline-block px-6 py-3 bg-gold text-deep-blue font-bold rounded-xl hover:bg-yellow-500 transition-all">
              View My Tickets →
            </a>
          </div>
        )}
        {activeTab === 'campaigns' && <CampaignsTab />}
        {activeTab === 'achievements' && (
          <div className="bg-[#0B1F3A]/60 border border-[#D4AF37]/20 rounded-xl p-6">
            <h3 className="text-white font-bold text-xl mb-4">🏅 Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'First Win', desc: 'Won your first campaign', earned: true, icon: '🎉' },
                { title: 'Big Spender', desc: 'Bought 100+ tickets', earned: true, icon: '💸' },
                { title: 'Jackpot Hunter', desc: 'Entered 5 jackpot draws', earned: false, icon: '🎰' },
                { title: 'Lucky Star', desc: 'Won 10 times total', earned: false, icon: '⭐' },
                { title: 'Referral Pro', desc: 'Referred 10 users', earned: false, icon: '🔗' },
                { title: 'Streak Master', desc: '7-day win streak', earned: true, icon: '🔥' },
                { title: 'Early Bird', desc: 'Joined in 2026', earned: true, icon: '🕐' },
                { title: 'VIP', desc: 'Spent ₦500,000+', earned: false, icon: '👑' },
              ].map((a, i) => (
                <div key={i} className={`rounded-xl p-4 text-center border ${a.earned ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30' : 'bg-[#0A0A0A]/50 border-gray-800 opacity-60'}`}>
                  <div className="text-3xl mb-2">{a.icon}</div>
                  <p className={`text-sm font-bold ${a.earned ? 'text-gold' : 'text-gray-500'}`}>{a.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{a.desc}</p>
                  {a.earned && <span className="text-xs text-green-400 mt-2 block">✓ Earned</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'referral' && <ReferralStatsWidget userId={userId} />}
        {activeTab === 'wallet' && <WalletTab userId={userId} />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>
    </div>
  );
}
