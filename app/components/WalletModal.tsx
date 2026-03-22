'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';

const PRESET_AMOUNTS = [1000, 5000, 10000, 20000];

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { balance, credit } = useWallet();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // Load Paystack inline script
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.PaystackPop) {
      setScriptLoaded(true);
      return;
    }
    if (scriptRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError('Failed to load payment gateway. Please refresh and try again.');
    document.head.appendChild(script);
    scriptRef.current = script;
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setCustomAmount('');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  const selectPreset = (val: number) => {
    setAmount(String(val));
    setCustomAmount('');
  };

  const handleCustomChange = (val: string) => {
    const numeric = val.replace(/[^0-9]/g, '');
    setCustomAmount(numeric);
    setAmount(numeric);
  };

  const getEmail = () => {
    if (user?.email) return user.email;
    try {
      const stored = localStorage.getItem('user');
      if (stored) return JSON.parse(stored).email || '';
    } catch { /* ignore */ }
    return '';
  };

  const getUserId = () => {
    if (user?.id) return user.id;
    try {
      const stored = localStorage.getItem('user');
      if (stored) return JSON.parse(stored).id || '';
    } catch { /* ignore */ }
    return '';
  };

  const handleFund = async () => {
    setError('');
    const numAmount = parseInt(amount || customAmount, 10);

    if (!numAmount || numAmount < 100) {
      setError('Minimum funding amount is ₦100');
      return;
    }

    if (!scriptLoaded || !window.PaystackPop) {
      setError('Payment gateway not ready. Please refresh and try again.');
      return;
    }

    const email = getEmail();
    if (!email) {
      setError('Please log in to fund your wallet.');
      return;
    }

    setLoading(true);

    try {
      // Initialize payment with server
      const initRes = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numAmount,
          email,
          userId: getUserId(),
        }),
      });

      const initData = await initRes.json();

      if (!initRes.ok) {
        setError(initData.message || 'Failed to initialize payment');
        setLoading(false);
        return;
      }

      const { reference } = initData;

      // Open Paystack modal
      const paystack = new window.PaystackPop();
      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
        amount: numAmount * 100, // Convert to kobo
        email,
        reference,
        callback: (response: any) => {
          // Redirect to callback handler
          window.location.href = `/api/payments/callback?reference=${response.reference}`;
        },
        onClose: () => {
          setLoading(false);
          // User closed — do nothing, just reset
        },
        onCancel: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const formattedBalance = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(balance);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="bg-[#0B1F3A] rounded-3xl p-6 md:p-8 w-full max-w-md border border-gold/20 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-white">💰 Fund Wallet</h2>
                <p className="text-gray-400 text-sm mt-0.5">Add funds to buy raffle tickets</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Current Balance */}
            <div className="bg-black/20 rounded-2xl p-4 mb-6 border border-white/5">
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Current Balance</div>
              <div className="text-3xl font-black text-gold">{formattedBalance}</div>
            </div>

            {/* Amount Presets */}
            <div className="mb-4">
              <div className="text-gray-300 text-sm font-semibold mb-2">Select Amount</div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {PRESET_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    onClick={() => selectPreset(val)}
                    className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      amount === String(val) && !customAmount
                        ? 'bg-gold text-deep-blue border-gold'
                        : 'bg-white/5 border-gold/30 text-white hover:bg-gold/10'
                    }`}
                  >
                    ₦{new Intl.NumberFormat('en-NG').format(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <div className="text-gray-300 text-sm font-semibold mb-2">Or Enter Custom Amount</div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-black text-lg">₦</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={customAmount}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  placeholder="0"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white font-black text-xl placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div className="text-gray-500 text-xs mt-1.5">Minimum: ₦100</div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4 text-red-400 text-sm font-semibold overflow-hidden"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fund Button */}
            <button
              onClick={handleFund}
              disabled={loading || !amount || parseInt(amount, 10) < 100}
              className={`w-full py-4 rounded-xl font-black text-deep-blue text-base transition-all flex items-center justify-center gap-2 ${
                loading || !amount || parseInt(amount, 10) < 100
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gold hover:bg-gold/90 shadow-lg shadow-gold/20'
              }`}
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connecting to Paystack...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Fund with Paystack
                </>
              )}
            </button>

            <p className="text-gray-500 text-xs text-center mt-4">
              Secured by Paystack. Your card details are never stored here.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
