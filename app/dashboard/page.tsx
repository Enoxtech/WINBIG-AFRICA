'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserTickets, getCampaign } from '../api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BADGES = [
  { id: 'first_ticket', icon: '🎫', title: 'First Ticket', desc: 'Buy your first raffle ticket', condition: (s: any) => s.total >= 1 },
  { id: 'first_win', icon: '🎉', title: 'First Win', desc: 'Win your first prize', condition: (s: any) => s.won >= 1 },
  { id: 'streak_master', icon: '🔥', title: 'Streak Master', desc: '7-day login streak', condition: (s: any) => s.streak >= 7 },
  { id: 'jackpot_club', icon: '👑', title: 'Jackpot Club', desc: 'Win a mega jackpot', condition: (s: any) => s.jackpot },
  { id: 'campaign_5', icon: '🎯', title: 'Campaign Pro', desc: 'Enter 5 different campaigns', condition: (s: any) => s.campaigns >= 5 },
  { id: 'lucky_10', icon: '🍀', title: 'Lucky Soul', desc: 'Purchase 10 tickets at once', condition: (s: any) => s.maxSingle >= 10 },
  { id: 'vip', icon: '💎', title: 'VIP Member', desc: 'Win 3+ times on WINBIG', condition: (s: any) => s.won >= 3 },
];

function AchievementCard({ badge, unlocked, delay }: { badge: typeof BADGES[0]; unlocked: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={unlocked ? { y: -4 } : {}}
      className={`rounded-2xl p-4 border text-center transition-all ${unlocked ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'}`}
    >
      <div className={`text-4xl mb-2 ${unlocked ? '' : 'grayscale'}`}>{badge.icon}</div>
      <h4 className={`font-bold text-sm mb-0.5 ${unlocked ? 'text-deep-blue' : 'text-gray-400'}`}>{badge.title}</h4>
      <p className="text-gray-400 text-xs">{badge.desc}</p>
      {unlocked && <span className="inline-block mt-2 text-gold text-xs font-bold">✓ Unlocked</span>}
      {!unlocked && <span className="inline-block mt-2 text-gray-300 text-xs font-bold">🔒 Locked</span>}
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tickets' | 'achievements' | 'referral'>('tickets');
  const [copied, setCopied] = useState(false);
  const [referralCode] = useState(() => user ? `WINBIG${user.id?.slice(-6).toUpperCase() || Math.random().toString(36).slice(-6).toUpperCase()}` : '');
  const [stats, setStats] = useState({ total: 0, won: 0, streak: 0, jackpot: false, campaigns: 0, maxSingle: 0 });

  useEffect(() => {
    const stored = localStorage.getItem('winbig_achievements');
    if (stored) setStats(JSON.parse(stored));
  }, []);

  const updateStat = (key: string, val: any) => {
    setStats(prev => {
      const next = { ...prev, [key]: val };
      localStorage.setItem('winbig_achievements', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const streak = localStorage.getItem('winbig_streak_days') || '1';
    updateStat('streak', parseInt(streak));
  }, []);

  const loadData = useCallback(async () => {
    if (!user || !token) return;
    try {
      const data = await getUserTickets(token);
      const tix: any[] = Array.isArray(data) ? data : data.tickets || [];
      setTickets(tix);

      const uniqueCampaigns = new Set(tix.map((t: any) => t.campaign_id));
      updateStat('campaigns', uniqueCampaigns.size);
      updateStat('total', tix.length);
      const maxQty = Math.max(0, ...tix.map((t: any) => t.quantity || 1));
      updateStat('maxSingle', maxQty);

      const campaignMap: Record<string, any> = {};
      await Promise.all(
        [...uniqueCampaigns].map(async (cid: string) => {
          try {
            const c = await getCampaign(cid);
            campaignMap[cid] = c;
          } catch {}
        })
      );
      setCampaigns(campaignMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCopy = () => {
    const link = `https://winbig.africa/register?ref=${referralCode}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const myBadges = BADGES.map(b => ({ ...b, unlocked: b.condition(stats) }));

  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <h1 className="text-3xl font-black text-deep-blue">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Champion'} 👋
          </h1>
          <p className="text-gray-500 mt-1">Track your tickets, achievements, and referral earnings.</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Tickets', value: stats.total, icon: '🎟️' },
            { label: 'Prizes Won', value: stats.won, icon: '🏆' },
            { label: 'Streak Days', value: stats.streak, icon: '🔥' },
            { label: 'Campaigns Entered', value: stats.campaigns, icon: '🎯' },
          ].map((s, i) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black text-deep-blue">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 border border-gray-100 w-fit">
          {[
            { key: 'tickets', label: '🎟️ My Tickets' },
            { key: 'achievements', label: '🏅 Achievements' },
            { key: 'referral', label: '🔗 Referral' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-deep-blue text-white shadow-sm' : 'text-gray-500 hover:text-deep-blue'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'tickets' && (
            <motion.div key="tickets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-xl h-20 animate-pulse border border-gray-100" />)}</div>
              ) : tickets.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                  <div className="text-5xl mb-4">🎟️</div>
                  <h3 className="font-bold text-deep-blue text-lg mb-2">No tickets yet</h3>
                  <p className="text-gray-400 text-sm mb-5">Time to try your luck! Enter your first campaign.</p>
                  <a href="/campaigns" className="inline-block bg-gold text-deep-blue font-bold px-6 py-2.5 rounded-xl text-sm">Browse Campaigns →</a>
                </div>
              ) : (
                tickets.map((ticket: any, i: number) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-deep-blue text-sm">{campaigns[ticket.campaign_id]?.title || 'Campaign #' + ticket.campaign_id}</div>
                      <div className="text-gray-400 text-xs mt-0.5">
                        {ticket.quantity || 1} ticket{ticket.quantity > 1 ? 's' : ''} • {new Date(ticket.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {ticket.status === 'won' && <span className="bg-gold/10 text-gold text-xs font-bold px-3 py-1 rounded-full">🏆 WON</span>}
                      {ticket.status === 'pending' && <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">⏳ Pending</span>}
                      {ticket.status === 'lost' && <span className="bg-gray-100 text-gray-400 text-xs font-bold px-3 py-1 rounded-full">✗ Not Selected</span>}
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div key="achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {myBadges.map((badge, i) => (
                  <AchievementCard key={badge.id} badge={badge} unlocked={badge.unlocked} delay={i * 0.05} />
                ))}
              </div>
              <div className="mt-6 bg-deep-blue rounded-2xl p-6 text-center">
                <h3 className="text-white font-bold text-lg mb-1">Unlock All Badges!</h3>
                <p className="text-gray-400 text-sm mb-4">Keep playing to unlock every achievement and climb the leaderboard.</p>
                <a href="/campaigns" className="inline-block bg-gold text-deep-blue font-bold px-6 py-2.5 rounded-xl text-sm">Start Playing →</a>
              </div>
            </motion.div>
          )}

          {activeTab === 'referral' && (
            <motion.div key="referral" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center max-w-lg mx-auto">
                <div className="text-5xl mb-4">🎁</div>
                <h2 className="text-2xl font-black text-deep-blue mb-2">Share & Earn</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Invite friends to WINBIG AFRICA. When they purchase their first ticket, you earn a <strong className="text-gold">N500 bonus</strong> into your account!
                </p>
                <div className="bg-light-gray rounded-xl p-4 mb-5">
                  <div className="text-xs text-gray-400 mb-1.5 font-medium">Your Referral Link</div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-deep-blue font-mono text-sm bg-white rounded-lg px-3 py-2 border border-gray-100 truncate">
                      {`winbig.africa/register?ref=${referralCode}`}
                    </code>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCopy}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex-shrink-0 ${copied ? 'bg-green-500 text-white' : 'bg-gold text-deep-blue'}`}
                    >
                      {copied ? '✓ Copied!' : 'Copy'}
                    </motion.button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: '📤', label: 'Share Link', sub: 'Copy & send to friends' },
                    { icon: '🎟️', label: 'They Play', sub: 'Friend buys first ticket' },
                    { icon: '💰', label: 'You Earn', sub: 'N500 bonus credited' },
                  ].map((step, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl mb-1">{step.icon}</div>
                      <div className="font-semibold text-deep-blue text-xs">{step.label}</div>
                      <div className="text-gray-400 text-xs">{step.sub}</div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-xs">Bonus is credited within 24 hours of your friend&apos;s first ticket purchase. No limit on referrals!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
