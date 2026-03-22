'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const { user } = useAuth();
  const { balance, refreshWallet } = useWallet();
  const [amount, setAmount] = useState(1000);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleWithdraw = async () => {
    if (!user || !bankName || !accountNumber || !accountName) return;
    if (amount < 1000) {
      setMessage({ type: 'error', text: 'Minimum withdrawal is ₦1,000' });
      return;
    }
    if (amount > balance) {
      setMessage({ type: 'error', text: 'Insufficient balance' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          bankName,
          accountNumber,
          accountName,
        }),
      });

      if (!res.ok) throw new Error('Withdrawal failed');

      setMessage({ type: 'success', text: 'Withdrawal request submitted! You will be contacted shortly.' });
      setAmount(1000);
      setBankName('');
      setAccountNumber('');
      setAccountName('');
      refreshWallet();
    } catch {
      setMessage({ type: 'error', text: 'Failed to submit withdrawal request' });
    } finally {
      setLoading(false);
    }
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

        <h2 className="text-2xl font-bold text-gold mb-2">Withdraw Funds</h2>
        <p className="text-gray-400 text-sm mb-6">Minimum: ₦1,000</p>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1000}
              className="w-full bg-[#0f3460] border border-[#eab308]/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Bank Name</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full bg-[#0f3460] border border-[#eab308]/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
              placeholder="e.g. First Bank"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              maxLength={10}
              className="w-full bg-[#0f3460] border border-[#eab308]/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
              placeholder="10-digit account number"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Account Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full bg-[#0f3460] border border-[#eab308]/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
              placeholder="Your account name"
            />
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={loading || amount < 1000 || !bankName || !accountNumber || !accountName}
          className="w-full mt-6 bg-gold hover:bg-gold/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-xl transition-colors"
        >
          {loading ? 'Processing...' : 'Submit Withdrawal Request'}
        </button>
      </div>
    </div>
  );
}
