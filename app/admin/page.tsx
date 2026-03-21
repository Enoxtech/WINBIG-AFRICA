'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  getAdminDashboard,
  getAdminUsers,
  getAdminCampaigns,
  createAdminCampaign,
  drawWinner,
  getCampaigns,
} from '../api';

interface DashboardStats { total_users: number; total_campaigns: number; total_tickets: number; total_revenue: number; }
interface Campaign { id: string; title: string; ticket_price: number; total_tickets: number; sold_tickets: number; status: string; end_date: string; }
interface User { id: string; name: string; email: string; role: string; created_at: string; }

export default function AdminPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'dashboard' | 'campaigns' | 'users' | 'create'>('dashboard');
  const [stats, setStats] = useState<DashboardStats>({ total_users: 0, total_campaigns: 0, total_tickets: 0, total_revenue: 0 });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawLoading, setDrawLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  // Create campaign form
  const [form, setForm] = useState({
    title: '', description: '', image_url: '', ticket_price: '', total_tickets: '', end_date: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    loadData();
  }, [user, token]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [s, c, u] = await Promise.all([
        getAdminDashboard(token),
        getAdminCampaigns(token),
        getAdminUsers(token),
      ]);
      setStats(s || { total_users: 0, total_campaigns: 0, total_tickets: 0, total_revenue: 0 });
      setCampaigns(Array.isArray(c) ? c : []);
      setUsers(Array.isArray(u) ? u : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setCreating(true);
    try {
      await createAdminCampaign({
        title: form.title,
        description: form.description,
        image_url: form.image_url,
        ticket_price: parseFloat(form.ticket_price),
        total_tickets: parseInt(form.total_tickets),
        end_date: form.end_date,
      }, token);
      setMsg('✅ Campaign created successfully!');
      setForm({ title: '', description: '', image_url: '', ticket_price: '', total_tickets: '', end_date: '' });
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
      await drawWinner(campaignId, token);
      setMsg('🏆 Draw completed successfully!');
      loadData();
    } catch {
      setMsg('❌ Draw failed. Ensure tickets are sold.');
    } finally {
      setDrawLoading(null);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-extrabold text-deep-blue">Admin Panel</h1>
          <p className="text-gray-500 mt-1">Manage campaigns, users, and draws</p>
        </motion.div>

        {msg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-4 mb-6 text-sm">
            {msg}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {(['dashboard', 'campaigns', 'users', 'create'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                tab === t ? 'bg-deep-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {t === 'create' ? '+ New Campaign' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => <div key={i} className="bg-white h-28 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <>
            {tab === 'dashboard' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                  {[
                    { label: 'Total Users', value: stats.total_users, icon: '👥', color: 'bg-blue-50' },
                    { label: 'Campaigns', value: stats.total_campaigns, icon: '📋', color: 'bg-purple-50' },
                    { label: 'Tickets Sold', value: stats.total_tickets, icon: '🎟️', color: 'bg-orange-50' },
                    { label: 'Total Revenue', value: `₦${(stats.total_revenue || 0).toLocaleString()}`, icon: '💰', color: 'bg-green-50' },
                  ].map((s) => (
                    <div key={s.label} className={`${s.color} rounded-2xl p-6`}>
                      <div className="text-3xl mb-2">{s.icon}</div>
                      <div className="text-2xl font-extrabold text-deep-blue">{s.value}</div>
                      <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h3 className="font-semibold text-deep-blue mb-4">Recent Campaigns</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-100">
                          <th className="pb-3 font-medium">Campaign</th>
                          <th className="pb-3 font-medium">Price</th>
                          <th className="pb-3 font-medium">Sold</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">End Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.slice(0, 5).map((c) => (
                          <tr key={c.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-3 font-medium text-deep-blue">{c.title}</td>
                            <td className="py-3 text-gray-500">₦{Number(c.ticket_price).toLocaleString()}</td>
                            <td className="py-3 text-gray-500">{c.sold_tickets}/{c.total_tickets}</td>
                            <td className="py-3">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}>{c.status}</span>
                            </td>
                            <td className="py-3 text-gray-500">{new Date(c.end_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === 'campaigns' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="space-y-4">
                  {campaigns.map((c) => (
                    <div key={c.id} className="bg-white rounded-2xl shadow-card p-5 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-deep-blue truncate">{c.title}</h4>
                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-400">
                          <span>₦{Number(c.ticket_price).toLocaleString()}/ticket</span>
                          <span>•</span>
                          <span>{c.sold_tickets}/{c.total_tickets} sold</span>
                          <span>•</span>
                          <span>Ends {new Date(c.end_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                          c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>{c.status}</span>
                        {c.status === 'active' && (
                          <button
                            onClick={() => handleDraw(c.id)}
                            disabled={drawLoading === c.id || c.sold_tickets === 0}
                            className="text-xs bg-gold text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-yellow-500 disabled:opacity-50 transition-colors"
                          >
                            {drawLoading === c.id ? 'Drawing...' : '🎲 Draw Winner'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-100 bg-light-gray">
                        <th className="py-4 px-6 font-medium">Name</th>
                        <th className="py-4 px-6 font-medium">Email</th>
                        <th className="py-4 px-6 font-medium">Role</th>
                        <th className="py-4 px-6 font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-light-gray/50 transition-colors">
                          <td className="py-3.5 px-6 font-medium text-deep-blue">{u.name}</td>
                          <td className="py-3.5 px-6 text-gray-500">{u.email}</td>
                          <td className="py-3.5 px-6">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'
                            }`}>{u.role}</span>
                          </td>
                          <td className="py-3.5 px-6 text-gray-400">{new Date(u.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {tab === 'create' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 max-w-2xl">
                  <h3 className="text-xl font-bold text-deep-blue mb-6">Create New Campaign</h3>
                  <form onSubmit={handleCreate} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Campaign Title</label>
                      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. MacBook Pro 16" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={4} placeholder="Describe the prize..." required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                      <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="https://..." type="url" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Ticket Price (₦)</label>
                        <input value={form.ticket_price} onChange={(e) => setForm({ ...form, ticket_price: e.target.value })} className="input-field" type="number" min="100" step="100" placeholder="1000" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Tickets</label>
                        <input value={form.total_tickets} onChange={(e) => setForm({ ...form, total_tickets: e.target.value })} className="input-field" type="number" min="2" placeholder="100" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Draw End Date</label>
                      <input value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="input-field" type="datetime-local" required />
                    </div>
                    <button type="submit" disabled={creating} className="w-full btn-primary py-3.5 disabled:opacity-60">
                      {creating ? 'Creating...' : 'Create Campaign'}
                    </button>
                  </form>
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
