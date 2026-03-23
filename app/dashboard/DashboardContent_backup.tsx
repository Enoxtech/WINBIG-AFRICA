'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyTickets, getCampaign } from '../api';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import WalletModal from '../components/WalletModal';
import WithdrawModal from '../components/WithdrawModal';

const BADGES = [
  { id: 'first_ticket', icon: '🎫', title: 'First Ticket', desc: 'Buy your first raffle ticket', condition: (s: any, _t: any) => s.total >= 1 },
  { id: 'first_win', icon: '🎉', title: 'First Win', desc: 'Win your first prize', condition: (s: any, _t: any) => s.won >= 1 },
  { id: 'streak_master', icon: '🔥', title: 'Streak Master', desc: '7-day login streak', condition: (s: any, _t: any) => s.streak >= 7 },
  { id: 'jackpot_club', icon: '👑', title: 'Jackpot Club', desc: 'Win a mega jackpot', condition: (s: any, _t: any) => s.jackpot },
  { id: 'campaign_5', icon: '🎯', title: 'Campaign Pro', desc: 'Enter 5 different campaigns', condition: (s: any, _t: any) => s.campaigns >= 5 },
  { id: 'lucky_10', icon: '🍀', title: 'Lucky Soul', desc: 'Purchase 10 tickets at once', condition: (s: any, _t: any) => s.maxSingle >= 10 },
  { id: 'vip', icon: '💎', title: 'VIP Member', desc: 'Win 3+ times on WINBIG', condition: (s: any, _t: any) => s.won >= 3 },
];

function playChaChing() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (_e) {
    // silently fail
  }
}

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

function StreakCalendar({ streakDays }: { streakDays: number }) {
  const today = new Date();
  const days: { date: Date; active: boolean }[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({ date: d, active: i < streakDays });
  }
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-deep-blue">🔥 Streak Calendar</h3>
        <span className="text-gold font-black text-lg">{streakDays} day{streakDays !== 1 ? 's' : ''}</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map(({ date, active }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
              active ? 'bg-gold text-deep-blue' : 'bg-gray-100 text-gray-400'
            }`}
            title={date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
          >
            {date.getDate()}
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5 mt-1">
        {dayLabels.map((d, i) => (
          <div key={i} className="aspect-square flex items-center justify-center text-xs text-gray-400">{d}</div>
        ))}
      </div>
    </div>
  );
}

function NotificationBell({ notifications, onMarkRead }: { notifications: { id: string; text: string; type: string; time: string; read: boolean }[]; onMarkRead: () => void }) {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      >
        <svg className="w-5 h-5 text-deep-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100 bg-light-gray flex items-center justify-between">
              <h4 className="font-bold text-deep-blue text-sm">Notifications</h4>
              {unread > 0 && <button onClick={onMarkRead} className="text-gold font-bold text-xs hover:underline">Mark all read</button>}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm">No notifications yet</div>
              ) : notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 border-b border-gray-50 text-sm ${n.read ? '' : 'bg-blue-50/50'}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">{n.type === 'win' ? '🏆' : n.type === 'ending' ? '⏰' : 'ℹ️'}</span>
                    <div>
                      <p className="text-deep-blue font-medium text-xs leading-relaxed">{n.text}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LiveDrawOverlay({ campaign, winner, onClose }: { campaign: any; winner: any; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="text-7xl mb-4"
        >
          🎉
        </motion.div>
        <div className="text-gold font-black text-xs uppercase tracking-widest mb-2">🏆 Winner Selected</div>
        <h2 className="text-2xl font-black text-deep-blue mb-2">{campaign?.title || 'Campaign'}</h2>
        <div className="bg-gold/10 rounded-xl p-4 mb-6">
          <div className="text-3xl font-black text-deep-blue">{winner?.name || 'Winner Name'}</div>
          {winner?.email && <div className="text-gray-400 text-sm mt-1">{winner.email}</div>}
        </div>
        <p className="text-gray-400 text-xs mb-4">Winner has been notified. Prize will be delivered within 24 hours.</p>
        <button onClick={onClose} className="bg-deep-blue text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-deep-blue/90 transition-colors">
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function DashboardContent() {
  const { user, token } = useAuth();
  const { balance, transactions } = useWallet();
  const [tickets, setTickets] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<Record<string, any>>({});
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tickets' | 'achievements' | 'referral' | 'wallet'>('tickets');
  const [copied, setCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [referralCode] = useState(() => user ? `WINBIG${user.id?.slice(-6).toUpperCase() || Math.random().toString(36).slice(-6).toUpperCase()}` : '');
  const [stats, setStats] = useState({ total: 0, won: 0, streak: 0, jackpot: false, campaigns: 0, maxSingle: 0 });
  const [notifications, setNotifications] = useState<{ id: string; text: string; type: string; time: string; read: boolean }[]>([
    { id: '1', text: '🎉 You won the Weekly Mega Raffle! Claim your N50,000 prize now.', type: 'win', time: '2 hours ago', read: false },
    { id: '2', text: '⏰ ₦5,000,000 Jackpot ends in 3 hours — final chance to enter!', type: 'ending', time: '1 hour ago', read: false },
    { id: '3', text: 'Welcome to WINBIG AFRICA! Complete your profile to unlock VIP status.', type: 'info', time: '1 day ago', read: true },
  ]);
  const [liveDraw, setLiveDraw] = useState<{ campaign: any; winner: any } | null>(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('winbig_achievements');
    if (stored) setStats(JSON.parse(stored));
    const notifs = localStorage.getItem('winbig_notifications');
    if (notifs) setNotifications(JSON.parse(notifs));
  }, []);

  useEffect(() => {
    localStorage.setItem('winbig_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const updateStat = useCallback((key: string, val: any) => {
    setStats(prev => {
      const next = { ...prev, [key]: val };
      try { localStorage.setItem('winbig_achievements', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    const streak = localStorage.getItem('winbig_streak_days') || '1';
    updateStat('streak', parseInt(String(streak), 10));
  }, [updateStat]);

  const loadData = useCallback(async () => {
    if (!user || !token) return;
    try {
      const data = await getMyTickets(token);
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
  }, [user, token, updateStat]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCopy = () => {
    const link = `https://winbig.africa/register?ref=${referralCode}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToX = (campaign: any) => {
    const text = `I just entered to win ${campaign?.title || 'an amazing prize'} on @WINBIGAFRICA! 🎉🏆 #WINBIG #Nigeria`;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToWhatsApp = (campaign: any) => {
    const text = `I just entered to win ${campaign?.title || 'an amazing prize'} on WINBIG AFRICA! 🎉🏆\n\nJoin me here: https://winbig.africa/campaigns`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const triggerLiveDraw = () => {
    const winners = [
      { name: 'Chioma A.', email: 'c***a@gmail.com' },
      { name: 'Emeka N.', email: 'e***a@gmail.com' },
      { name: 'Fatima K.', email: 'f***a@gmail.com' },
    ];
    const winner = winners[Math.floor(Math.random() * winners.length)];
    const campaign = allCampaigns[0] || { title: 'Weekly Mega Raffle' };
    setLiveDraw({ campaign, winner });
    setNotifications(prev => [{
      id: `live_${Date.now()}`,
      text: `🏆 LIVE: Winner selected for ${campaign.title} — you could be next!`,
      type: 'win',
      time: 'Right now',
      read: false,
    }, ...prev]);
    if (soundEnabled) playChaChing();
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const myBadges = BADGES.map(b => ({ ...b, unlocked: b.condition(stats, tickets) }));
  const wonTickets = tickets.filter((t: any) => t.status === 'won');
  const pendingTickets = tickets.filter((t: any) => t.status === 'pending');

  return (
    <>
      {liveDraw && <LiveDrawOverlay campaign={liveDraw.campaign} winner={liveDraw.winner} onClose={() => setLiveDraw(null)} />}
      <div className="min-h-screen bg-light-gray">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-deep-blue">
                Welcome back, {user?.name?.split(' ')[0] || 'Champion'} 👋
              </h1>
              <p className="text-gray-500 mt-1">Track your tickets, achievements, and referral earnings.</p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell notifications={notifications} onMarkRead={markAllRead} />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
              >
                {soundEnabled ? (
                  <svg className="w-5 h-5 text-deep-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M6.343 12.657l8.486-8.486A4 4 0 0117.07 6.07l-8.486 8.486A4 4 0 016.343 12.657z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
                  </svg>
                )}
              </motion.button>
            </div>
          </motion.div>

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

          <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 border border-gray-100 w-fit">
            {[
              { key: 'tickets', label: '🎟️ My Tickets' },
              { key: 'achievements', label: '🏅 Achievements' },
              { key: 'referral', label: '🔗 Referral' },
              { key: 'wallet', label: '💰 Wallet' },
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
              <motion.div key="tickets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
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
                  <>
                    {wonTickets.length > 0 && (
                      <div>
                        <h3 className="font-black text-deep-blue mb-3 flex items-center gap-2">🏆 My Wins ({wonTickets.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {wonTickets.map((ticket: any, i: number) => (
                            <motion.div
                              key={ticket.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="bg-gradient-to-r from-gold/20 to-white rounded-xl p-4 border border-gold/30 flex items-center justify-between gap-4"
                            >
                              <div>
                                <div className="font-bold text-deep-blue text-sm">{campaigns[ticket.campaign_id]?.title || 'Campaign #' + ticket.campaign_id}</div>
                                <div className="text-gold text-xs font-bold mt-0.5">🎉 WON — Prize Claimed!</div>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => shareToX(campaigns[ticket.campaign_id])} className="p-2 rounded-lg bg-white border border-gray-100 hover:bg-gold/10 transition-colors" title="Share on X">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </button>
                                <button onClick={() => shareToWhatsApp(campaigns[ticket.campaign_id])} className="p-2 rounded-lg bg-white border border-gray-100 hover:bg-green-50 transition-colors" title="WhatsApp">
                                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-black text-deep-blue mb-3">🎟️ All Tickets ({tickets.length})</h3>
                      <div className="space-y-3">
                        {tickets.map((ticket: any, i: number) => (
                          <motion.div
                            key={ticket.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between gap-4"
                          >
                            <div>
                              <div className="font-bold text-deep-blue text-sm">{campaigns[ticket.campaign_id]?.title || 'Campaign #' + ticket.campaign_id}</div>
                              <div className="text-gray-400 text-xs mt-0.5">
                                {ticket.quantity || 1} ticket{(ticket.quantity || 1) > 1 ? 's' : ''} • {new Date(ticket.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {ticket.status === 'won' && <span className="bg-gold/10 text-gold text-xs font-bold px-3 py-1 rounded-full">🏆 WON</span>}
                              {ticket.status === 'pending' && <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">⏳ Pending</span>}
                              {ticket.status === 'lost' && <span className="bg-gray-100 text-gray-400 text-xs font-bold px-3 py-1 rounded-full">✗ Not Selected</span>}
                              {ticket.status === 'pending' && (
                                <button onClick={() => shareToX(campaigns[ticket.campaign_id])} className="p-2 rounded-lg hover:bg-gold/10 transition-colors" title="Share on X">
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div key="achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <StreakCalendar streakDays={stats.streak} />
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
                {stats.won >= 1 && (
                  <div className="mt-4 bg-gradient-to-r from-gold/20 to-white rounded-2xl p-6 border border-gold/30 text-center">
                    <button onClick={triggerLiveDraw} className="text-gold font-black text-sm hover:underline">
                      🎲 Simulate Live Draw (Demo)
                    </button>
                    <p className="text-gray-400 text-xs mt-1">See how the live winner selection animation works</p>
                  </div>
                )}
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
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(`Join WINBIG AFRICA and win amazing prizes! Use my code: ${referralCode}\n\nhttps://winbig.africa`)}`, '_blank')}
                      className="flex items-center gap-2 bg-black text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-black/80 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      Share on X
                    </button>
                    <button
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join WINBIG AFRICA and win amazing prizes! Use my code: ${referralCode}\n\nhttps://winbig.africa`)}`, '_blank')}
                      className="flex items-center gap-2 bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs mt-6">Bonus is credited within 24 hours. No limit on referrals!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

