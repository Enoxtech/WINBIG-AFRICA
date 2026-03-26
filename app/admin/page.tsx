'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import {
  getAdminDashboard,
  getAdminUsers,
  getCampaigns,
  createCampaign,
  triggerDraw,
} from '../api';

interface DashboardStats {
  total_users: number;
  total_campaigns: number;
  total_tickets: number;
  total_revenue: number;
  active_campaigns?: number;
  pending_draws?: number;
  total_winners?: number;
}
interface Campaign {
  id: string;
  title: string;
  ticket_price: number;
  total_tickets: number;
  sold_tickets: number;
  status: string;
  end_date: string;
  draw_date?: string;
  winner_id?: string;
  prize_amount?: number;
  jackpot?: boolean;
  description?: string;
  image_url?: string;
  created_at?: string;
}
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}
interface ActivityEvent {
  id: string;
  type: 'ticket_purchase' | 'user_register' | 'draw_complete' | 'campaign_created' | 'withdrawal';
  message: string;
  time: string;
  amount?: number;
}
interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}
interface Winner {
  id: string;
  name: string;
  prize: string;
  campaign: string;
  date: string;
  amount: number;
}

// ─── Mock system state (replaces missing backend endpoints) ───
const MOCK_ACTIVITY: ActivityEvent[] = [
  { id: '1', type: 'ticket_purchase', message: 'Chidinma from Lagos purchased 5 tickets for ₦500,000 Weekly Draw', time: '2 mins ago', amount: 500 },
  { id: '2', type: 'user_register', message: 'New user: Emeka from Port Harcourt registered', time: '8 mins ago' },
  { id: '3', type: 'ticket_purchase', message: 'Ayomide from Abuja purchased 10 tickets for ₦5M Mega Jackpot', time: '14 mins ago', amount: 5000 },
  { id: '4', type: 'draw_complete', message: 'Toyota Camry 2025 draw completed — Winner: Blessing O.', time: '1 hour ago' },
  { id: '5', type: 'ticket_purchase', message: 'Segun from Ibadan purchased 2 tickets for iPhone 16 Pro Max', time: '2 hours ago', amount: 500 },
  { id: '6', type: 'withdrawal', message: 'User Chidi O. requested ₦50,000 withdrawal', time: '3 hours ago', amount: 50000 },
];
const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'warning', title: 'Campaign Ending Soon', message: '₦500,000 Weekly Draw ends in 3 days — 1,153 tickets unsold', time: '2h ago', read: false },
  { id: '2', type: 'info', title: 'New Registration', message: '47 new users registered today', time: '4h ago', read: false },
  { id: '3', type: 'success', title: 'Draw Completed', message: 'Toyota Camry 2025 winner selected successfully', time: '1d ago', read: true },
  { id: '4', type: 'error', title: 'Failed Withdrawal', message: 'Chidi O. withdrawal failed — insufficient balance', time: '2d ago', read: true },
];
const MOCK_WINNERS: Winner[] = [
  { id: '1', name: 'Blessing O.', prize: 'Toyota Camry 2025', campaign: 'camp-002', date: '2026-03-21', amount: 15000000 },
  { id: '2', name: 'Chidi Okafor', prize: '₦1,000,000 Cash', campaign: 'camp-weekly-003', date: '2026-03-14', amount: 1000000 },
  { id: '3', name: 'Ngozi M.', prize: 'MacBook Air M3', campaign: 'camp-tech-001', date: '2026-03-07', amount: 1500000 },
  { id: '4', name: 'Emeka A.', prize: 'iPhone 16 Pro Max', campaign: 'camp-gadget-002', date: '2026-02-28', amount: 1200000 },
];

const ACTIVITY_ICONS: Record<string, string> = {
  ticket_purchase: '🎟️',
  user_register: '👤',
  draw_complete: '🏆',
  campaign_created: '📋',
  withdrawal: '💸',
};
const NOTIF_ICONS: Record<string, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  success: '✅',
  error: '❌',
};

export default function AdminPage() {
  const { user, token, logout, isLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'overview' | 'campaigns' | 'users' | 'create' | 'winners' | 'settings'>('overview');

  // Redirect non-admins and unauthenticated users to admin login
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, isLoading, router]);
  const [stats, setStats] = useState<DashboardStats>({ total_users: 0, total_campaigns: 0, total_tickets: 0, total_revenue: 0 });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawLoading, setDrawLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [activity, setActivity] = useState<ActivityEvent[]>(MOCK_ACTIVITY);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(2);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    weeklyDrawDay: 'Friday',
    weeklyDrawTime: '21:00',
    urgencyBannerActive: true,
    urgencyBannerEndDate: '2026-03-28',
    registrationsOpen: true,
    minTicketPrice: 50,
    maxTicketPerUser: 50,
  });

  // Create campaign form
  const [form, setForm] = useState({
    title: '', description: '', image_url: '', ticket_price: '', total_tickets: '', end_date: '', prize_amount: '',
  });
  const [creating, setCreating] = useState(false);

  // Edit campaign
  const [editForm, setEditForm] = useState<Partial<Campaign>>({});

  // Load data when authenticated as admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      return;
    }
    loadData();
  }, [user, token]);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [s, c, u] = await Promise.all([
        getAdminDashboard(),
        getCampaigns(),
        getAdminUsers(),
      ]);
      setStats({
        ...(s || {}),
        total_users: Array.isArray(u) ? u.length : (s?.total_users || 0),
        total_campaigns: Array.isArray(c) ? c.length : (s?.total_campaigns || 0),
        active_campaigns: Array.isArray(c) ? c.filter((x: any) => x.status === 'active').length : 0,
        total_winners: MOCK_WINNERS.length,
      } as DashboardStats);
      setCampaigns(Array.isArray(c) ? c : []);
      setUsers(Array.isArray(u) ? u : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setCreating(true);
    try {
      await createCampaign({
        title: form.title,
        description: form.description,
        image_url: form.image_url,
        ticket_price: parseFloat(form.ticket_price),
        max_tickets: parseInt(form.total_tickets),
        end_date: form.end_date,
        prize_amount: parseFloat(form.prize_amount) || parseFloat(form.ticket_price) * parseInt(form.total_tickets),
      });
      setMsg('✅ Campaign created successfully!');
      setForm({ title: '', description: '', image_url: '', ticket_price: '', total_tickets: '', end_date: '', prize_amount: '' });
      loadData();
      setTab('campaigns');
    } catch {
      setMsg('❌ Failed to create campaign.');
    } finally {
      setCreating(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleDraw = async (campaignId: string) => {
    if (!token) return;
    if (!confirm('Trigger the draw for this campaign? A random winner will be selected.')) return;
    setDrawLoading(campaignId);
    try {
      await triggerDraw(campaignId);
      setMsg('🏆 Draw completed successfully!');
      loadData();
    } catch {
      setMsg('❌ Draw failed. Ensure tickets are sold.');
    } finally {
      setDrawLoading(null);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleEditSave = () => {
    if (!selectedCampaign) return;
    setCampaigns(prev => prev.map(c => c.id === selectedCampaign.id ? { ...c, ...editForm } : c));
    setMsg('✅ Campaign updated!');
    setSelectedCampaign(null);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'bg-green-100 text-green-700';
    if (status === 'ended' || status === 'completed') return 'bg-gray-100 text-gray-600';
    if (status === 'jackpot') return 'bg-purple-100 text-purple-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-deep-blue">Admin Command Center</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' • '}
              <span className="text-green-600 font-medium">System Online</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifPanel(!showNotifPanel); handleMarkAllRead(); }}
                className="relative bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <span className="text-lg">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotifPanel && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    className="absolute right-0 top-14 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <span className="font-semibold text-deep-blue text-sm">Notifications</span>
                      <button onClick={handleMarkAllRead} className="text-xs text-gold hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
                          <div className="flex items-start gap-2.5">
                            <span className="text-base mt-0.5">{NOTIF_ICONS[n.type]}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-deep-blue">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                              <p className="text-xs text-gray-300 mt-1">{n.time}</p>
                            </div>
                            {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 text-center">
                      <Link href="/admin?tab=settings" className="text-xs text-gold hover:underline font-medium" onClick={() => setShowNotifPanel(false)}>
                        View all notifications
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/dashboard" className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
              ← Public View
            </Link>
          </div>
        </motion.div>

        {/* ── Message ── */}
        <AnimatePresence>
          {msg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-4 mb-6 text-sm font-medium">
              {msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tab Navigation ── */}
        <div className="flex gap-1.5 mb-8 overflow-x-auto pb-1">
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'campaigns', label: '🎯 Campaigns' },
            { key: 'winners', label: '🏆 Winners' },
            { key: 'users', label: '👥 Users' },
            { key: 'create', label: '+ New Campaign' },
            { key: 'settings', label: '⚙️ Settings' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                tab === t.key
                  ? 'bg-deep-blue text-white shadow-lg shadow-blue-900/30'
                  : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200 shadow-sm'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="bg-white h-28 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <>
            {/* ═══════════════════════════════════════ OVERVIEW ═══════════════════════════════════════ */}
            {tab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Users', value: stats.total_users || 0, icon: '👥', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', sub: '+12 today', positive: true },
                    { label: 'Active Campaigns', value: stats.active_campaigns || 0, icon: '🎯', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', sub: `${stats.total_campaigns || 0} total`, positive: true },
                    { label: 'Tickets Sold', value: (stats.total_tickets || 0).toLocaleString(), icon: '🎟️', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', sub: `₦${((stats.total_tickets || 0) * 100).toLocaleString()} revenue`, positive: true },
                    { label: 'Total Winners', value: stats.total_winners || 0, icon: '🏆', color: 'from-gold/80 to-yellow-500', bg: 'bg-yellow-50', sub: 'All time', positive: true },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className={`${s.bg} p-4 pb-3`}>
                        <div className="text-2xl mb-1">{s.icon}</div>
                        <div className={`text-3xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</div>
                      </div>
                      <div className="p-3.5">
                        <div className="text-sm font-bold text-deep-blue">{s.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Live Activity Feed */}
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-deep-blue">Live Activity</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Real-time platform events</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-green-600 font-medium">Live</span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                      {activity.map(event => (
                        <div key={event.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                          <span className="text-lg mt-0.5 flex-shrink-0">{ACTIVITY_ICONS[event.type]}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 leading-relaxed">{event.message}</p>
                            <p className="text-xs text-gray-300 mt-1">{event.time}</p>
                          </div>
                          {event.amount && (
                            <span className="text-xs font-bold text-deep-blue bg-blue-50 px-2 py-1 rounded-lg flex-shrink-0">
                              ₦{event.amount.toLocaleString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <h3 className="font-bold text-deep-blue mb-3.5">Quick Actions</h3>
                      <div className="space-y-2.5">
                        <button onClick={() => { loadData(); setMsg('🔄 Stats refreshed!'); setTimeout(() => setMsg(''), 3000); }} className="w-full flex items-center gap-3 px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-sm font-medium text-blue-700">
                          <span>🔄</span> Refresh All Stats
                        </button>
                        <button onClick={() => { setTab('create'); setMsg('Ready to create new campaign'); setTimeout(() => setMsg(''), 3000); }} className="w-full flex items-center gap-3 px-3.5 py-2.5 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-sm font-medium text-green-700">
                          <span>🎯</span> Create Campaign
                        </button>
                        <button onClick={() => { setTab('campaigns'); }} className="w-full flex items-center gap-3 px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-sm font-medium text-purple-700">
                          <span>📊</span> Manage Campaigns
                        </button>
                        <button onClick={() => { setTab('settings'); }} className="w-full flex items-center gap-3 px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium text-gray-600">
                          <span>⚙️</span> System Settings
                        </button>
                      </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <h3 className="font-bold text-deep-blue mb-3.5">System Status</h3>
                      <div className="space-y-2.5">
                        {[
                          { label: 'API Server', ok: true, detail: 'Responding' },
                          { label: 'Database', ok: true, detail: 'Connected' },
                          { label: 'Paystack', ok: false, detail: 'Test mode' },
                          { label: 'Email Service', ok: false, detail: 'Not configured' },
                        ].map(item => (
                          <div key={item.label} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">{item.label}</p>
                              <p className="text-xs text-gray-400">{item.detail}</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.ok ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {item.ok ? '✓ OK' : '⚠ WARN'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaigns Progress Overview */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-bold text-deep-blue mb-4">Campaigns at a Glance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {campaigns.slice(0, 6).map(c => {
                      const pct = c.total_tickets > 0 ? Math.round((c.sold_tickets / c.total_tickets) * 100) : 0;
                      const daysLeft = Math.max(0, Math.ceil((new Date(c.end_date).getTime() - Date.now()) / 86400000));
                      return (
                        <div key={c.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedCampaign(c); setEditForm(c); }}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-deep-blue text-sm leading-tight line-clamp-2">{c.title}</h4>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${getStatusColor(c.status)}`}>{c.status}</span>
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>{c.sold_tickets}/{c.total_tickets} sold</span>
                              <span>{pct}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">{daysLeft}d left</span>
                            <span className="text-xs font-bold text-deep-blue">₦{Number(c.ticket_price).toLocaleString()}/ticket</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════ CAMPAIGNS ═══════════════════════════════════════ */}
            {tab === 'campaigns' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="space-y-3.5">
                  {campaigns.map(c => {
                    const pct = c.total_tickets > 0 ? Math.round((c.sold_tickets / c.total_tickets) * 100) : 0;
                    const daysLeft = Math.max(0, Math.ceil((new Date(c.end_date).getTime() - Date.now()) / 86400000));
                    const revenue = c.sold_tickets * c.ticket_price;
                    return (
                      <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-start gap-4">
                          {c.image_url && (
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="font-bold text-deep-blue">{c.title}</h4>
                                <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{c.description}</p>
                              </div>
                              <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${getStatusColor(c.status)}`}>{c.status}</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                              <div className="bg-slate-50 rounded-xl px-3 py-2">
                                <p className="text-xs text-gray-400">Prize Value</p>
                                <p className="text-sm font-bold text-deep-blue">₦{(c.prize_amount || revenue).toLocaleString()}</p>
                              </div>
                              <div className="bg-slate-50 rounded-xl px-3 py-2">
                                <p className="text-xs text-gray-400">Ticket Price</p>
                                <p className="text-sm font-bold text-deep-blue">₦{Number(c.ticket_price).toLocaleString()}</p>
                              </div>
                              <div className="bg-slate-50 rounded-xl px-3 py-2">
                                <p className="text-xs text-gray-400">Sold / Total</p>
                                <p className="text-sm font-bold text-deep-blue">{c.sold_tickets}/{c.total_tickets}</p>
                              </div>
                              <div className="bg-slate-50 rounded-xl px-3 py-2">
                                <p className="text-xs text-gray-400">Revenue</p>
                                <p className="text-sm font-bold text-green-600">₦{revenue.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                                <span>Progress</span>
                                <span>{pct}%</span>
                              </div>
                              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                                <span>{daysLeft} days left</span>
                                <span>Draws: {new Date(c.end_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <button
                              onClick={() => { setSelectedCampaign(c); setEditForm(c); }}
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-medium transition-colors"
                            >
                              Edit
                            </button>
                            {c.status === 'active' && (
                              <button
                                onClick={() => handleDraw(c.id)}
                                disabled={drawLoading === c.id || c.sold_tickets === 0}
                                className="text-xs bg-gold hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
                              >
                                {drawLoading === c.id ? 'Drawing...' : '🎲 Draw'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Campaign Edit Modal */}
                <AnimatePresence>
                  {selectedCampaign && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                      onClick={() => setSelectedCampaign(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                      >
                        <h3 className="text-xl font-extrabold text-deep-blue mb-5">Edit Campaign</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input value={editForm.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="input-field" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="input-field" rows={3} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price (₦)</label>
                              <input value={editForm.ticket_price || ''} onChange={e => setEditForm({ ...editForm, ticket_price: Number(e.target.value) })} className="input-field" type="number" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Max Tickets</label>
                              <input value={editForm.total_tickets || ''} onChange={e => setEditForm({ ...editForm, total_tickets: Number(e.target.value) })} className="input-field" type="number" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                              value={editForm.status || ''}
                              onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                              className="input-field"
                            >
                              <option value="active">Active</option>
                              <option value="ended">Ended</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Draw Date</label>
                              <input
                                type="datetime-local"
                                value={editForm.end_date ? editForm.end_date.slice(0, 16) : ''}
                                onChange={e => setEditForm({ ...editForm, end_date: new Date(e.target.value).toISOString() })}
                                className="input-field"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Prize Amount (₦)</label>
                              <input
                                value={editForm.prize_amount || ''}
                                onChange={e => setEditForm({ ...editForm, prize_amount: Number(e.target.value) })}
                                className="input-field"
                                type="number"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                          <button onClick={() => setSelectedCampaign(null)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-semibold transition-colors">
                            Cancel
                          </button>
                          <button onClick={handleEditSave} className="flex-1 py-3 bg-gold hover:bg-yellow-500 text-white rounded-xl font-semibold transition-colors">
                            Save Changes
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════ WINNERS ═══════════════════════════════════════ */}
            {tab === 'winners' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {MOCK_WINNERS.map((w, i) => (
                    <div key={w.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-black ${
                          i === 0 ? 'bg-gradient-to-br from-gold to-yellow-400 text-white' : 'bg-deep-blue text-white'
                        }`}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-deep-blue">{w.name}</h4>
                          <p className="text-sm text-gray-500">{w.prize}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-extrabold text-green-600">₦{w.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{new Date(w.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {MOCK_WINNERS.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-xl font-semibold text-deep-blue mb-2">No winners yet</h3>
                    <p className="text-gray-500">Winners will appear here after draws are completed.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════════════════════════════════════ USERS ═══════════════════════════════════════ */}
            {tab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-deep-blue">All Users</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{users.length} registered users</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-medium">
                        {users.filter((u: any) => u.role !== 'admin').length} players
                      </span>
                      <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full font-medium">
                        {users.filter((u: any) => u.role === 'admin').length} admins
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-100 bg-slate-50">
                          <th className="py-4 px-5 font-medium">Name</th>
                          <th className="py-4 px-5 font-medium">Email</th>
                          <th className="py-4 px-5 font-medium">Role</th>
                          <th className="py-4 px-5 font-medium">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-deep-blue to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {u.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <span className="font-medium text-deep-blue">{u.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 text-gray-500">{u.email}</td>
                            <td className="py-3.5 px-5">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'
                              }`}>{u.role}</span>
                            </td>
                            <td className="py-3.5 px-5 text-gray-400">{new Date(u.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-12 text-center text-gray-400">No users found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════ CREATE CAMPAIGN ═══════════════════════════════════════ */}
            {tab === 'create' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-2xl">
                  <h3 className="text-xl font-extrabold text-deep-blue mb-1">Create New Campaign</h3>
                  <p className="text-gray-400 text-sm mb-6">Fill in the campaign details. You can edit or cancel it later.</p>
                  <form onSubmit={handleCreate} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Campaign Title</label>
                        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. ₦5,000,000 Mega Jackpot" required />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} placeholder="Describe the prize..." required />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                        <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="https://images.unsplash.com/..." type="url" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Ticket Price (₦)</label>
                        <input value={form.ticket_price} onChange={e => setForm({ ...form, ticket_price: e.target.value })} className="input-field" type="number" min="50" step="50" placeholder="500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Prize Amount (₦)</label>
                        <input value={form.prize_amount} onChange={e => setForm({ ...form, prize_amount: e.target.value })} className="input-field" type="number" placeholder="5000000" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Tickets</label>
                        <input value={form.total_tickets} onChange={e => setForm({ ...form, total_tickets: e.target.value })} className="input-field" type="number" min="2" placeholder="10000" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Draw End Date</label>
                        <input value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="input-field" type="datetime-local" required />
                      </div>
                    </div>
                    <button type="submit" disabled={creating} className="w-full btn-primary py-3.5 disabled:opacity-60 font-semibold">
                      {creating ? 'Creating Campaign...' : '🎯 Create Campaign'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════ SETTINGS ═══════════════════════════════════════ */}
            {tab === 'settings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="max-w-2xl space-y-6">
                  {/* Urgency Banner / Draw Schedule */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-extrabold text-deep-blue mb-1">🎯 Draw Schedule</h3>
                    <p className="text-sm text-gray-400 mb-5">Controls the weekly draw timer shown on the homepage.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Weekly Draw Day</label>
                        <select value={settings.weeklyDrawDay} onChange={e => setSettings({ ...settings, weeklyDrawDay: e.target.value })} className="input-field">
                          {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Draw Time (WAT)</label>
                        <input value={settings.weeklyDrawTime} onChange={e => setSettings({ ...settings, weeklyDrawTime: e.target.value })} className="input-field" type="time" />
                      </div>
                    </div>
                    <div className="mt-4 p-3.5 bg-blue-50 rounded-xl">
                      <p className="text-sm text-blue-700">
                        <span className="font-semibold">Next draw:</span>{' '}
                        {(() => { const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']; const dayIdx = days.indexOf(settings.weeklyDrawDay); const today = new Date(); const todayIdx = today.getDay(); let daysUntil = (dayIdx - todayIdx + 7) % 7 || 7; const next = new Date(today); next.setDate(today.getDate() + daysUntil); return `${settings.weeklyDrawDay} at ${settings.weeklyDrawTime} WAT (${daysUntil === 1 ? 'Tomorrow' : `in ${daysUntil} days`})`; })()}
                      </p>
                    </div>
                  </div>

                  {/* Urgency Banner */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-extrabold text-deep-blue mb-1">🚨 Urgency Banner</h3>
                    <p className="text-sm text-gray-400 mb-5">Show the red urgency banner on the homepage.</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700">Banner Active</p>
                          <p className="text-xs text-gray-400">Show countdown banner on homepage</p>
                        </div>
                        <button
                          onClick={() => setSettings({ ...settings, urgencyBannerActive: !settings.urgencyBannerActive })}
                          className={`w-12 h-6 rounded-full transition-colors relative ${settings.urgencyBannerActive ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.urgencyBannerActive ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Banner End Date</label>
                        <input
                          type="datetime-local"
                          value={settings.urgencyBannerEndDate}
                          onChange={e => setSettings({ ...settings, urgencyBannerEndDate: e.target.value })}
                          className="input-field"
                          disabled={!settings.urgencyBannerActive}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Platform Settings */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-extrabold text-deep-blue mb-1">⚙️ Platform Settings</h3>
                    <p className="text-sm text-gray-400 mb-5">General platform controls.</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-700">Registrations Open</p>
                          <p className="text-xs text-gray-400">Allow new users to register</p>
                        </div>
                        <button
                          onClick={() => setSettings({ ...settings, registrationsOpen: !settings.registrationsOpen })}
                          className={`w-12 h-6 rounded-full transition-colors relative ${settings.registrationsOpen ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.registrationsOpen ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Ticket Price (₦)</label>
                          <input value={settings.minTicketPrice} onChange={e => setSettings({ ...settings, minTicketPrice: Number(e.target.value) })} className="input-field" type="number" min="50" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Tickets Per User</label>
                          <input value={settings.maxTicketPerUser} onChange={e => setSettings({ ...settings, maxTicketPerUser: Number(e.target.value) })} className="input-field" type="number" min="1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Paystack / API */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-extrabold text-deep-blue mb-1">💳 Payment & API</h3>
                    <p className="text-sm text-gray-400 mb-5">Payment provider configuration.</p>
                    <div className="space-y-4">
                      <div className="p-3.5 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <p className="text-sm text-yellow-800 font-medium">⚠️ Paystack is in Test Mode</p>
                        <p className="text-xs text-yellow-700 mt-1">Switch to live keys before launching. Configure in server .env file.</p>
                      </div>
                      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-800 font-medium">📡 NEXT_PUBLIC_API_URL</p>
                        <p className="text-xs text-blue-700 mt-1">Set this to your production backend URL when deploying.</p>
                      </div>
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="text-sm text-slate-700 font-medium">📦 Backend Status</p>
                        <p className="text-xs text-slate-500 mt-1">Deploy to Railway, Render, or Fly.io. Set SUPABASE_URL and SUPABASE_KEY in server .env.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => { setMsg('✅ Settings saved!'); setTimeout(() => setMsg(''), 4000); }}
                    className="w-full py-3.5 bg-deep-blue hover:bg-blue-900 text-white rounded-xl font-bold transition-colors"
                  >
                    Save All Settings
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
