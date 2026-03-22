'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface WalletState {
  balance: number;
  loading: boolean;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: 'fund' | 'withdraw' | 'purchase' | 'win';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletContextType extends WalletState {
  fundWallet: (amount: number) => Promise<void>;
  withdraw: (amount: number, accountNumber: string, bankName: string) => Promise<{ success: boolean; message: string }>;
  deduct: (amount: number, description: string) => Promise<boolean>;
  credit: (amount: number, description: string, type: Transaction['type']) => void;
  getBalance: () => number;
  refreshBalance: () => Promise<void>;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

const STORAGE_KEY = 'winbig_wallet';
const TRANSACTIONS_KEY = 'winbig_transactions';

function getUserKey(): string {
  if (typeof window === 'undefined') return 'anonymous';
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      return `user_${parsed.id || parsed.email}`;
    } catch {
      return `user_${token?.slice(-8) || 'anon'}`;
    }
  }
  return `user_${token?.slice(-8) || 'anon'}`;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const userKey = getUserKey();
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${userKey}`);
      const txStored = localStorage.getItem(`${TRANSACTIONS_KEY}_${userKey}`);
      if (stored) {
        const data = JSON.parse(stored);
        setBalance(data.balance ?? 0);
      }
      if (txStored) {
        setTransactions(JSON.parse(txStored));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (loading) return;
    const userKey = getUserKey();
    localStorage.setItem(`${STORAGE_KEY}_${userKey}`, JSON.stringify({ balance }));
    localStorage.setItem(`${TRANSACTIONS_KEY}_${userKey}`, JSON.stringify(transactions));
  }, [balance, transactions, loading]);

  const refreshBalance = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const res = await fetch('/api/wallet', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance ?? 0);
      }
    } catch {
      // Keep local balance on error
    } finally {
      setLoading(false);
    }
  }, []);

  const fundWallet = useCallback(async (_amount: number) => {
    // This is called before Paystack opens — actual credit happens in callback
    // No-op here, the callback route will credit the wallet
  }, []);

  const credit = useCallback((amount: number, description: string, type: Transaction['type']) => {
    const tx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type,
      amount,
      description,
      date: new Date().toISOString(),
      status: 'completed',
    };
    setBalance(prev => prev + amount);
    setTransactions(prev => [tx, ...prev]);
  }, []);

  const deduct = useCallback(async (amount: number, description: string): Promise<boolean> => {
    const currentBalance = balance;
    if (currentBalance < amount) return false;

    const tx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: 'purchase',
      amount: -amount,
      description,
      date: new Date().toISOString(),
      status: 'completed',
    };
    setBalance(prev => prev - amount);
    setTransactions(prev => [tx, ...prev]);
    return true;
  }, [balance]);

  const withdraw = useCallback(async (
    amount: number,
    accountNumber: string,
    bankName: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      let email = '';
      try { email = JSON.parse(user || '{}').email || ''; } catch { /* ignore */ }

      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ amount, accountNumber, bankName, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || 'Withdrawal failed' };
      }

      // Deduct from local balance
      const tx: Transaction = {
        id: `wd_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        type: 'withdraw',
        amount: -amount,
        description: `Withdrawal to ${bankName} (${accountNumber})`,
        date: new Date().toISOString(),
        status: 'pending',
      };
      setBalance(prev => prev - amount);
      setTransactions(prev => [tx, ...prev]);

      return { success: true, message: data.message || 'Withdrawal request submitted' };
    } catch (err) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }, [balance]);

  const getBalance = useCallback(() => balance, [balance]);

  return (
    <WalletContext.Provider value={{
      balance,
      loading,
      transactions,
      fundWallet,
      withdraw,
      deduct,
      credit,
      getBalance,
      refreshBalance,
      refreshWallet: refreshBalance,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    // Return safe defaults for components rendered outside WalletProvider (e.g. during static prerender)
    return {
      balance: 0,
      loading: false,
      transactions: [],
      fundWallet: async () => {},
      withdraw: async () => ({ success: false, message: 'Not connected' }),
      deduct: async () => false,
      credit: () => {},
      getBalance: () => 0,
      refreshBalance: async () => {},
      refreshWallet: async () => {},
    };
  }
  return ctx;
}
