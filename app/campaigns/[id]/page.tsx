'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CountdownTimer from '../../components/CountdownTimer';
import { getCampaign, purchaseTickets } from '../../api';
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
    if (!agreed) { setError('Please agree to the Terms & Conditions before purchasing.'); return; }
    setError('');
    setBuying(true);
    try {
      const data = await purchaseTickets(id as string, quantity, token);
      if (data.error) setError(data.error);
      else { setSuccess(true); setTimeout(() => setSuccess(false), 5000); load(); }
    } catch { setError('Purchase failed. Please try again.'); }
    finally { setBuying(false); }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `🎉 I just entered to win "${campaign?.title}" on WINBIG AFRICA! Tickets from just ₦${campaign?.ticket_price?.toLocaleString()}. Could this be your lucky day too?\n\n`;

  const shareOnWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`, '_blank');
  const shareOnX = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');

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
  const maxQty = Math.min(remaining, 10);

  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* LEFT */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-card p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-extrabold text-deep-blue">{campaign.title}</h1>
                {/* Share Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={shareOnWhatsApp}
                    title="Share on WhatsApp"
                    className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-green-600 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={shareOnX}
                    title="Share on X"
                    className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white text-sm hover:bg-gray-800 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </motion.button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {campaign.status === 'active' && <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">🟢 Live</span>}
                {isEnded && <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">🏁 Ended</span>}
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">🎟️ {remaining} tickets left</span>
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
                    <div className="font-bold text-deep-blue text-sm">{new Date(campaign.end_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Purchase Box */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-card p-6 md:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-deep-blue mb-6">Enter This Campaign</h2>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{sold} sold</span>
                  <span className="font-medium text-deep-blue">{percent.toFixed(0)}% filled</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full" />
                </div>
                <div className="text-xs text-gray-400 mt-1.5 text-right">{remaining} tickets remaining</div>
              </div>

              {campaign.status === 'active' && (
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">Draw countdown</div>
                  <CountdownTimer targetDate={campaign.end_date} />
                </div>
              )}

              {isEnded && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-sm font-semibold text-green-700">Winner Selected</div>
                  <div className="text-xs text-green-600 mt-1">Congratulations to the lucky winner!</div>
                </div>
              )}

              {!isEnded && (
                <>
                  {/* Animated Quantity Selector */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tickets</label>
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#D4AF37' }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-deep-blue font-black text-lg hover:bg-gold hover:text-white transition-colors"
                      >
                        −
                      </motion.button>
                      <div className="w-20 text-center">
                        <motion.span
                          key={quantity}
                          initial={{ y: -8, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="text-2xl font-black text-deep-blue block"
                        >
                          {quantity}
                        </motion.span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#D4AF37' }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                        disabled={quantity >= maxQty}
                        className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-deep-blue font-black text-lg hover:bg-gold hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        +
                      </motion.button>
                      <span className="text-gray-400 text-sm ml-1">max {maxQty}</span>
                    </div>
                  </div>

                  {/* Live Price Update */}
                  <motion.div
                    key={totalCost}
                    initial={{ scale: 1.05, color: '#D4AF37' }}
                    animate={{ scale: 1, color: '#0B1F3A' }}
                    transition={{ duration: 0.3 }}
                    className="bg-light-gray rounded-xl p-4 mb-5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Ticket price × {quantity}</span>
                      <span className="font-black text-deep-blue text-2xl">₦{totalCost.toLocaleString()}</span>
                    </div>
                    {quantity > 1 && (
                      <div className="text-xs text-gold font-medium mt-1">Saving more with more tickets!</div>
                    )}
                  </motion.div>

                  <div className="mb-5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-gold" />
                      <span className="text-xs text-gray-500 leading-relaxed">
                        I agree to the{' '}
                        <Link href="/terms" className="text-gold hover:underline">Terms & Conditions</Link> and{' '}
                        <Link href="/privacy" className="text-gold hover:underline">Privacy Policy</Link>.
                        I understand this is a raffle and I may not win.
                      </span>
                    </label>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4">{error}</div>
                  )}

                  <AnimatePresence>
                    {success && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3 mb-4 text-center">
                        🎉 Ticket(s) purchased! Check your dashboard.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {user ? (
                    <button onClick={handleBuy} disabled={buying || !agreed || remaining === 0} className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                      {buying ? 'Processing...' : `Buy ${quantity} Ticket${quantity > 1 ? 's' : ''} — ₦${totalCost.toLocaleString()}`}
                    </button>
                  ) : (
                    <Link href="/login" className="block w-full btn-primary py-4 text-lg text-center">Login to Purchase</Link>
                  )}
                </>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                {['🔒 Secure payment processing', '🎲 Fair random winner selection', '📊 100% transparent draws'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-gray-400"><span>{item}</span></div>
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
