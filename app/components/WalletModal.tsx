'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { initializePaystackPayment } from '../api';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { user } = useAuth();
  const { refreshWallet } = useWallet();
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const presetAmounts = [1000, 5000, 10000, 20000];

  const handlePaystackPayment = () => {
    if (!user) return;
    setLoading(true);
    setError('');

    initializePaystackPayment(user.email, amount)
      .then((data) => {
        if (data.data && data.data.authorization_url) {
          window.location.href = data.data.authorization_url;
        } else {
          setError('Failed to initialize payment');
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Payment initialization failed');
        setLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#eab308]/30 rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gold mb-6">Fund Wallet</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-3">Select Amount</label>
          <div className="grid grid-cols-2 gap-3">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                  amount === preset
                    ? 'bg-gold text-black'
                    : 'bg-[#0f3460] text-white hover:bg-[#0f3460]/80'
                }`}
              >
                ₦{preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">Or Enter Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={100}
            className="w-full bg-[#0f3460] border border-[#eab308]/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
            placeholder="Enter amount"
          />
        </div>

        <button
          onClick={handlePaystackPayment}
          disabled={loading || !amount || amount < 100}
          className="w-full bg-gold hover:bg-gold/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-xl transition-colors"
        >
          {loading ? 'Processing...' : `Pay ₦${amount.toLocaleString()} with Paystack`}
        </button>

        <p className="text-center text-gray-400 text-xs mt-4">
          Secure payment powered by Paystack
        </p>
      </div>
    </div>
  );
}
