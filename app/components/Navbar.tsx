'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import WalletModal from './WalletModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { balance } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [campOpen, setCampOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const campRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (campRef.current && !campRef.current.contains(e.target as Node)) setCampOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const campaignCategories = [
    { href: '/campaigns?filter=active', label: '🔴 Active Now', sub: 'Enter before draw' },
    { href: '/campaigns?filter=mega', label: '💰 Mega Jackpot', sub: 'Biggest prizes' },
    { href: '/campaigns?filter=upcoming', label: '📅 Coming Soon', sub: 'Get early access' },
    { href: '/campaigns?filter=completed', label: '🏆 Past Winners', sub: 'See who won' },
  ];

  const notifications = [
    { id: 1, text: '🎉 Chioma A. from Lagos won ₦500,000!', time: '2h ago' },
    { id: 2, text: '🚗 Toyota Camry draw happening in 2h — enter now!', time: '2h ago' },
    { id: 3, text: '🎉 Emeka N. from Abuja won Toyota Camry 2025!', time: '5h ago' },
    { id: 4, text: '✨ New campaign: ₦1,000,000 Weekend Special', time: '1d ago' },
  ];

  const formattedBalance = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(balance);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-deep-blue/95 backdrop-blur-md shadow-lg shadow-black/20 py-1.5'
            : 'bg-deep-blue/80 backdrop-blur-sm py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center shadow-lg shadow-gold/30 group-hover:shadow-gold/50 transition-shadow"
              >
                <span className="text-deep-blue font-black text-base">W</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="font-black text-lg text-white tracking-tight">
                  WIN<span className="text-gold">BIG</span>
                </span>
                <span className="block text-[9px] text-gold/70 -mt-1 tracking-widest uppercase font-semibold">Africa</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Campaigns dropdown */}
              <div ref={campRef} className="relative">
                <button
                  onMouseEnter={() => setCampOpen(true)}
                  onClick={() => setCampOpen(!campOpen)}
                  className="flex items-center gap-1.5 text-gray-200 hover:text-gold transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  🎟️ Campaigns
                  <motion.svg animate={{ rotate: campOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
                    className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {campOpen && (
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onMouseLeave={() => setCampOpen(false)}
                      className="absolute top-full left-0 mt-1 w-64 bg-deep-blue border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      {campaignCategories.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setCampOpen(false)}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                        >
                          <span className="text-lg">{cat.label.split(' ')[0]}</span>
                          <div>
                            <div className="text-white font-medium text-sm">{cat.label.split(' ').slice(1).join(' ')}</div>
                            <div className="text-gray-400 text-xs">{cat.sub}</div>
                          </div>
                        </Link>
                      ))}
                      <div className="bg-gold/10 px-4 py-3">
                        <Link href="/campaigns" onClick={() => setCampOpen(false)}
                          className="text-gold text-xs font-semibold hover:text-yellow-300 transition-colors">
                          → View All Campaigns
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                { href: '/#how-it-works', label: '❓ How It Works' },
                { href: '/#winners', label: '🏆 Winners' },
                { href: '/about', label: 'ℹ️ About' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-200 hover:text-gold transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Live Draw pill */}
              <Link href="/campaigns" className="hidden lg:flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold px-3 py-1 rounded-full hover:bg-red-500/30 transition-colors">
                <motion.span
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-red-500 rounded-full"
                />
                Live Draw
              </Link>

              {/* Notifications (logged in) */}
              {hydrated && user && (
                <div ref={notifRef} className="relative hidden lg:block">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative text-gray-200 hover:text-gold transition-colors p-2 rounded-lg hover:bg-white/5"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-deep-blue" />
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                      >
                        <div className="bg-deep-blue px-4 py-3 flex items-center justify-between">
                          <span className="text-white font-semibold text-sm">Notifications</span>
                          <span className="text-gold text-xs">{notifications.length} new</span>
                        </div>
                        {notifications.map((n) => (
                          <div key={n.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                            <p className="text-gray-700 text-sm">{n.text}</p>
                            <p className="text-gray-400 text-xs mt-1">{n.time}</p>
                          </div>
                        ))}
                        <div className="px-4 py-3 text-center">
                          <Link href="/dashboard" onClick={() => setNotifOpen(false)}
                            className="text-gold text-xs font-semibold hover:text-deep-blue transition-colors">
                            View Dashboard →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Auth */}
              {hydrated && user ? (
                <div className="hidden lg:flex items-center gap-2">
                  {/* Wallet Balance */}
                  <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-xl px-3 py-1.5">
                    <span className="text-gold font-black text-sm">💰 {formattedBalance}</span>
                    <button
                      onClick={() => setWalletModalOpen(true)}
                      className="text-xs text-gold/70 hover:text-gold font-semibold transition-colors"
                      title="Fund Wallet"
                    >
                      + Add
                    </button>
                  </div>

                  <Link href="/dashboard">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-200 hover:text-gold transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5"
                    >
                      📊 Dashboard
                    </motion.span>
                  </Link>
                  <Link href="/campaigns">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(212,175,55,0.4)' }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gold text-deep-blue font-bold text-sm px-4 py-2 rounded-xl"
                    >
                      🎟️ Buy Ticket
                    </motion.button>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-red-400 transition-colors text-xs font-medium"
                    title="Logout"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : hydrated ? (
                <div className="hidden lg:flex items-center gap-2">
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-200 hover:text-gold transition-colors text-sm font-medium px-4 py-2"
                    >
                      Log In
                    </motion.button>
                  </Link>
                  <Link href="/register">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(212,175,55,0.4)' }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gold text-deep-blue font-bold text-sm px-5 py-2 rounded-xl"
                    >
                      Sign Up Free
                    </motion.button>
                  </Link>
                </div>
              ) : null}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <motion.span
                    animate={mobileOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-0.5 bg-white origin-center"
                  />
                  <motion.span
                    animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-0.5 bg-white"
                  />
                  <motion.span
                    animate={mobileOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-0.5 bg-white origin-center"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-deep-blue/98 backdrop-blur-md border-t border-white/10"
            >
              <div className="px-4 py-4 space-y-1">
                <div className="px-3 py-2 text-gold text-xs font-bold uppercase tracking-wider">Menu</div>
                {[
                  { href: '/campaigns', label: '🎟️ All Campaigns' },
                  { href: '/campaigns?filter=active', label: '🔴 Active Now' },
                  { href: '/campaigns?filter=mega', label: '💰 Mega Jackpot' },
                  { href: '/#how-it-works', label: '❓ How It Works' },
                  { href: '/#winners', label: '🏆 Winners' },
                  { href: '/about', label: 'ℹ️ About' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 text-gray-300 hover:text-gold hover:bg-white/5 transition-colors px-3 py-2.5 rounded-lg text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}

                {hydrated && user ? (
                  <>
                    {/* Mobile Wallet Balance */}
                    <div className="flex items-center justify-between bg-black/20 border border-white/10 rounded-xl px-4 py-3 mx-3 mb-2">
                      <div>
                        <div className="text-gray-400 text-xs">Wallet Balance</div>
                        <div className="text-gold font-black text-lg">{formattedBalance}</div>
                      </div>
                      <button
                        onClick={() => { setWalletModalOpen(true); setMobileOpen(false); }}
                        className="bg-gold text-deep-blue font-bold text-xs px-4 py-2 rounded-xl"
                      >
                        + Fund
                      </button>
                    </div>
                    <div className="border-t border-white/10 pt-3 mt-3">
                      <div className="px-3 py-2 text-gold text-xs font-bold uppercase tracking-wider">My Account</div>
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-gray-300 hover:text-gold hover:bg-white/5 transition-colors px-3 py-2.5 rounded-lg text-sm font-medium">📊 Dashboard</Link>
                      <Link href="/campaigns" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-gray-300 hover:text-gold hover:bg-white/5 transition-colors px-3 py-2.5 rounded-lg text-sm font-medium">🎟️ Buy Tickets</Link>
                    </div>
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left text-red-400 hover:bg-red-500/10 transition-colors px-3 py-2.5 rounded-lg text-sm font-medium mt-1">
                      🚪 Logout
                    </button>
                  </>
                ) : hydrated ? (
                  <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center text-gray-300 font-medium px-4 py-2.5 rounded-xl border border-white/20 hover:border-gold/50 transition-colors text-sm">Log In</Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="block text-center bg-gold text-deep-blue font-bold px-4 py-2.5 rounded-xl text-sm">Sign Up Free 🎉</Link>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Wallet Modal */}
      <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </>
  );
}
