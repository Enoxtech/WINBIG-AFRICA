'use client';

import { useState, useEffect } from 'react';
import { getWallet, getTransactions, requestWithdrawal, requestDeposit } from '../../api';

interface WalletData {
  userId: string;
  balance: number;
  totalWon: number;
  totalWithdrawn: number;
  totalSpent: number;
  bonusBalance: number;
  lastWon?: { amount: number; date: string; campaign: string };
}

interface Transaction {
  id: string;
  type: 'win' | 'deposit' | 'withdraw' | 'ticket' | 'bonus';
  amount: number;
  description: string;
  date: string;
  status: string;
}

export default function WalletClient({ userId }: { userId: string }) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawBank, setWithdrawBank] = useState('');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawName, setWithdrawName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    Promise.all([
      getWallet(userId),
      getTransactions(userId)
    ]).then(([w, t]) => {
      setWallet(w as WalletData);
      setTransactions((t as any).transactions || []);
      setLoading(false);
    });
  }, [userId]);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) < 100) return;
    setProcessing(true);
    try {
      await requestDeposit({ userId, amount: parseFloat(depositAmount), paymentReference: 'PSK_' + Date.now() });
      setSuccessMsg(`₦${parseFloat(depositAmount).toLocaleString()} deposit initiated! Check your Paystack dashboard to complete payment.`);
      setShowDepositModal(false);
      setDepositAmount('');
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawBank || !withdrawAccount || !withdrawName) return;
    if (parseFloat(withdrawAmount) > (wallet?.balance || 0)) {
      setSuccessMsg('Insufficient balance.');
      return;
    }
    setProcessing(true);
    try {
      await requestWithdrawal({ userId, amount: parseFloat(withdrawAmount), bankName: withdrawBank, accountNumber: withdrawAccount, accountName: withdrawName });
      setSuccessMsg(`₦${parseFloat(withdrawAmount).toLocaleString()} withdrawal request submitted!`);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawBank('');
      setWithdrawAccount('');
      setWithdrawName('');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-gray-800/50 rounded-xl" />
          <div className="h-24 bg-gray-800/50 rounded-xl" />
          <div className="h-24 bg-gray-800/50 rounded-xl" />
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'win': return 'text-green-400';
      case 'deposit': return 'text-blue-400';
      case 'withdraw': return 'text-yellow-400';
      case 'ticket': return 'text-red-400';
      case 'bonus': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'win': return '🎉';
      case 'deposit': return '💰';
      case 'withdraw': return '🏦';
      case 'ticket': return '🎟️';
      case 'bonus': return '🎁';
      default: return '💳';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success message */}
      {successMsg && (
        <div className="bg-green-900/30 border border-green-600 text-green-300 px-4 py-3 rounded-xl text-sm">
          {successMsg}
        </div>
      )}

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-900/60 to-purple-900/60 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400 text-sm">Available Balance</span>
          <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full">Main Wallet</span>
        </div>
        <div className="text-4xl font-bold text-white mb-1">
          ₦{wallet?.balance?.toLocaleString() || '0'}
        </div>
        <div className="text-gray-400 text-sm">
          + ₦{wallet?.bonusBalance?.toLocaleString() || '0'} bonus balance
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowDepositModal(true)}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>↓</span> Deposit
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>↑</span> Withdraw
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-white/5">
          <div className="text-gray-400 text-xs mb-1">Total Won</div>
          <div className="text-xl font-bold text-green-400">₦{wallet?.totalWon?.toLocaleString() || '0'}</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-white/5">
          <div className="text-gray-400 text-xs mb-1">Withdrawn</div>
          <div className="text-xl font-bold text-yellow-400">₦{wallet?.totalWithdrawn?.toLocaleString() || '0'}</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-white/5">
          <div className="text-gray-400 text-xs mb-1">Total Spent</div>
          <div className="text-xl font-bold text-red-400">₦{wallet?.totalSpent?.toLocaleString() || '0'}</div>
        </div>
      </div>

      {/* Last Win */}
      {wallet?.lastWon && (
        <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-4">
          <div className="text-xs text-green-400 mb-1">🎉 Last Win</div>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-white font-semibold">₦{wallet.lastWon.amount.toLocaleString()}</div>
              <div className="text-gray-400 text-xs">{wallet.lastWon.campaign}</div>
            </div>
            <div className="text-gray-500 text-xs">{formatDate(wallet.lastWon.date)}</div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div>
        <h3 className="text-white font-semibold mb-3">Transaction History</h3>
        <div className="space-y-2">
          {transactions.map((txn) => (
            <div key={txn.id} className="bg-gray-800/40 rounded-xl p-4 flex items-center gap-3 border border-white/5">
              <div className="text-2xl">{getTypeIcon(txn.type)}</div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{txn.description}</div>
                <div className="text-gray-500 text-xs">{formatDate(txn.date)}</div>
              </div>
              <div className={`text-sm font-semibold ${getTypeColor(txn.type)}`}>
                {txn.type === 'ticket' ? '-' : '+'}₦{Math.abs(txn.amount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-white/10">
            <h3 className="text-white text-lg font-bold mb-4">Deposit Funds</h3>
            <div className="mb-4">
              <label className="text-gray-400 text-sm block mb-2">Amount (₦)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount"
                min="100"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div className="text-gray-400 text-xs mb-4">
              Payment via Paystack • Instant crediting
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={processing || !depositAmount || parseFloat(depositAmount) < 100}
                className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-xl transition-all"
              >
                {processing ? 'Processing...' : 'Continue to Paystack'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-white/10">
            <h3 className="text-white text-lg font-bold mb-4">Withdraw Funds</h3>
            <div className="mb-3">
              <label className="text-gray-400 text-sm block mb-2">Amount (₦)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                max={wallet?.balance}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div className="mb-3">
              <label className="text-gray-400 text-sm block mb-2">Bank Name</label>
              <input
                type="text"
                value={withdrawBank}
                onChange={(e) => setWithdrawBank(e.target.value)}
                placeholder="e.g. First Bank of Nigeria"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div className="mb-3">
              <label className="text-gray-400 text-sm block mb-2">Account Number</label>
              <input
                type="text"
                value={withdrawAccount}
                onChange={(e) => setWithdrawAccount(e.target.value)}
                placeholder="10-digit account number"
                maxLength={10}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div className="mb-4">
              <label className="text-gray-400 text-sm block mb-2">Account Name</label>
              <input
                type="text"
                value={withdrawName}
                onChange={(e) => setWithdrawName(e.target.value)}
                placeholder="As on your bank account"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div className="text-gray-400 text-xs mb-4">
              Withdrawals are processed within 24-48 hours
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={processing || !withdrawAmount || !withdrawBank || !withdrawAccount || !withdrawName}
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-xl transition-all"
              >
                {processing ? 'Processing...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
