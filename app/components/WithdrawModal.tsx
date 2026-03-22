'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const { balance, withdraw: requestWithdraw } = useWallet();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setAccountNumber('');
      setBankName('');
      setError('');
      setSuccess('');
      setLoading(false);
    }
  }, [isOpen]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const getEmail = () => {
    if (user?.email) return user.email;
    try {
      const stored = localStorage.getItem('user');
      if (stored) return JSON.parse(stored).email || '';
    } catch { /* ignore */ }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const numAmount = parseInt(amount.replace(/,/g, ''), 10);

    // Validation
    if (!numAmount || numAmount < 1000) {
      setError('Minimum withdrawal is ₦1,000');
      triggerShake();
      return;
    }
    if (numAmount > balance) {
      setError('Insufficient wallet balance');
      triggerShake();
      return;
    }
    if (!accountNumber || accountNumber.length < 10) {
      setError('Enter a valid account number');
      triggerShake();
      return;
    }
    if (!bankName.trim()) {
      setError('Enter your bank name');
      triggerShake();
      return;
    }

    setLoading(true);

    const result = await requestWithdraw(numAmount, accountNumber, bankName);

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2500);
    } else {
      setError(result.message);
      triggerShake();
    }

    setLoading(false);
  };

  const formattedBalance = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(balance);

  const handleAmountChange = (val: string) => {
    const numeric = val.replace(/[^0-9]/g, '');
    setAmount(numeric);
  };

  const maxAmount = () => {
    setAmount(String(balance));
  };

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
                <h2 className="text-xl font-black text-white">🏧 Withdraw Winnings</h2>
                <p className="text-gray-400 text-sm mt-0.5">Transfer to your bank account</p>
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
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Available Balance</div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-black text-gold">{formattedBalance}</div>
                {balance >= 1000 && (
                  <button
                    onClick={maxAmount}
                    className="text-xs text-gold/70 hover:text-gold font-semibold border border-gold/30 px-3 py-1 rounded-lg transition-colors"
                  >
                    MAX
                  </button>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="text-gray-300 text-sm font-semibold mb-2 block">Amount (₦)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-black text-lg">₦</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white font-black text-lg placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div className="text-gray-500 text-xs mt-1">Minimum withdrawal: ₦1,000</div>
              </div>

              {/* Bank Name */}
              <div>
                <label className="text-gray-300 text-sm font-semibold mb-2 block">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. First Bank, Opay, Kuda"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white font-semibold placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="text-gray-300 text-sm font-semibold mb-2 block">Account Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  placeholder="10-digit account number"
                  maxLength={10}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white font-black text-lg tracking-widest placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-colors font-mono"
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-semibold overflow-hidden"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm font-semibold overflow-hidden"
                  >
                    ✓ {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !!success}
                className={`w-full py-4 rounded-xl font-black text-deep-blue text-base transition-all flex items-center justify-center gap-2 ${
                  loading || success
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
                    Processing...
                  </>
                ) : success ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Request Submitted!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Request Withdrawal
                  </>
                )}
              </button>
            </form>

            <p className="text-gray-500 text-xs text-center mt-4">
              Withdrawals are processed within 24–48 hours.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
