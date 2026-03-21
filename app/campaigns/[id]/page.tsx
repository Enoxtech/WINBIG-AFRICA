'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CountdownTimer from '../../components/CountdownTimer';
import { getCampaign, purchaseTickets, getMyTickets } from '../../api';
import { useAuth } from '../../context/AuthContext';

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
  winner_id?: string;
}

export default function CampaignDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [recentEntries, setRecentEntries] = useState<string[]>([]);
  const [sold, setSold] = useState(0);

  const load = useCallback(async () => {
    try {
      const data = await getCampaign(id as string);
      setCampaign(data);
      setSold(data.sold_tickets || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (campaign?.status === 'active') {
      const interval = setInterval(async () => {
        try {
          const data = await getCampaign(id as string);
          setSold(data.sold_tickets || 0);
        } catch {}
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [campaign, id]);

  const remaining = campaign ? campaign.total_tickets - sold : 0;
  const percent = campaign ? Math.min((sold / campaign.total_tickets) * 100, 100) : 0;
  const totalCost = campaign ? Number(campaign.ticket_price) * quantity : 0;

  const handleBuy = async () => {
    if (!user || !token) return;
    if (!agreed) {
      setError('Please agree to the Terms & Conditions before purchasing.');
      return;
    }
    setError('');
    setBuying(true);
    try {
      const data = await purchaseTickets(id as string, quantity, token);
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
        load();
      }
    } catch {
      setError('Purchase failed. Please try again.');
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-deep-blue mb-4">Campaign Not Found</h2>
        <Link href="/campaigns" className="btn-primary">Browse Campaigns</Link>
      </div>
    );
  }

  const isEnded = campaign.status === 'completed' || remaining === 0;

  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* LEFT: Images & Info */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="relative h-64 md:h-80 lg:h-96 bg-gray-100">
                  {campaign.image_url ? (
                    <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-deep-blue to-matte-black flex items-center justify-center">
                      <span className="text-8xl">🎁</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-card p-6 md:p-8"
            >
              <h1 className="text-2xl md:text-3xl font-extrabold text-deep-blue mb-4">{campaign.title}</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {campaign.status === 'active' && (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">🟢 Live</span>
                )}
                {isEnded && (
                  <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">🏁 Ended</span>
                )}
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  🎟️ {remaining} tickets left
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{campaign.description}</p>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-deep-blue mb-3">Campaign Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-light-gray rounded-xl p-3">
                    <div className="text-gray-400 text-xs mb-1">Ticket Price</div>
                    <div className="font-bold text-deep-blue text-lg">₦{Number(campaign.ticket_price).toLocaleString()}</div>
                  </div>
                  <div className="bg-light-gray rounded-xl p-3">
                    <div className="text-gray-400 text-xs mb-1">Total Slots</div>
                    <div className="font-bold text-deep-blue text-lg">{campaign.total_tickets}</div>
                  </div>
                  <div className="bg-light-gray rounded-xl p-3">
                    <div className="text-gray-400 text-xs mb-1">Tickets Sold</div>
                    <div className="font-bold text-deep-blue text-lg">{sold}</div>
                  </div>
                  <div className="bg-light-gray rounded-xl p-3">
                    <div className="text-gray-400 text-xs mb-1">Draw Date</div>
                    <div className="font-bold text-deep-blue text-sm">
                      {new Date(campaign.end_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Purchase Box */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-card p-6 md:p-8 sticky top-24"
            >
              <h2 className="text-xl font-bold text-deep-blue mb-6">Enter This Campaign</h2>

              {/* Live Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{sold} sold</span>
                  <span className="font-medium text-deep-blue">{percent.toFixed(0)}% filled</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full"
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1.5 text-right">{remaining} tickets remaining</div>
              </div>

              {/* Countdown */}
              {campaign.status === 'active' && (
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">Draw countdown</div>
                  <CountdownTimer endDate={campaign.end_date} />
                </div>
              )}

              {/* Winner Display */}
              {isEnded && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-sm font-semibold text-green-700">Winner Selected</div>
                  <div className="text-xs text-green-600 mt-1">Congratulations to the lucky winner!</div>
                </div>
              )}

              {/* Purchase Form */}
              {!isEnded && (
                <>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tickets</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-deep-blue font-bold hover:bg-gray-200 transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={Math.min(remaining, 10)}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(remaining, parseInt(e.target.value) || 1)))}
                        className="input-field text-center w-20"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(remaining, quantity + 1))}
                        className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-deep-blue font-bold hover:bg-gray-200 transition-colors"
                      >
                        +
                      </button>
                      <span className="text-gray-400 text-sm ml-1">max {Math.min(remaining, 10)}</span>
                    </div>
                  </div>

                  <div className="bg-light-gray rounded-xl p-4 mb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Ticket price × {quantity}</span>
                      <span className="font-bold text-deep-blue text-xl">₦{totalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* T&C Checkbox — MANDATORY */}
                  <div className="mb-5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-gold"
                      />
                      <span className="text-xs text-gray-500 leading-relaxed">
                        I agree to the{' '}
                        <Link href="/legal/terms" target="_blank" className="text-gold hover:underline">Terms & Conditions</Link>{' '}
                        and{' '}
                        <Link href="/legal/refund" target="_blank" className="text-gold hover:underline">Refund Policy</Link>.
                        I understand this is a raffle and I may not win.
                      </span>
                    </label>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4">
                      {error}
                    </div>
                  )}

                  <AnimatePresence>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3 mb-4 text-center"
                      >
                        🎉 Ticket(s) purchased successfully! Check your dashboard.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {user ? (
                    <button
                      onClick={handleBuy}
                      disabled={buying || !agreed || remaining === 0}
                      className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {buying ? 'Processing...' : `Buy ${quantity} Ticket${quantity > 1 ? 's' : ''} — ₦${totalCost.toLocaleString()}`}
                    </button>
                  ) : (
                    <Link href="/login" className="block w-full btn-primary py-4 text-lg text-center">
                      Login to Purchase
                    </Link>
                  )}
                </>
              )}

              {/* Trust Signals */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                {[
                  '🔒 Secure payment processing',
                  '🎲 Fair random winner selection',
                  '📊 100% transparent draws',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
