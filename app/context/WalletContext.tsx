'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface Transaction {
  id: string;
  type: 'purchase' | 'win' | 'deposit' | 'referral' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  deduct: (amount: number, description: string) => Promise<boolean>;
  credit: (amount: number, description: string, type: Transaction['type']) => void;
  setBalance: (balance: number) => void;
  refreshWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  // Sync balance + transactions from real backend
  const fetchWallet = useCallback(async () => {
    const storedToken = token || localStorage.getItem('wb_token');
    if (!storedToken) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/wallet`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (res.ok) {
        const wallet = await res.json();
        setBalance(Number(wallet.balance) || 0);
        setTransactions(Array.isArray(wallet.recent_transactions) ? wallet.recent_transactions : []);
      }
    } catch (e) {
      console.error('fetchWallet error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [token, API_BASE]);

  // Call backend to deduct, then refresh balance
  const deduct = useCallback(async (amount: number, description: string): Promise<boolean> => {
    const storedToken = token || localStorage.getItem('wb_token');
    if (!storedToken) return false;

    try {
      const res = await fetch(`${API_BASE}/api/wallet/deduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ amount, description }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        console.error(data.error || 'Deduct failed');
        return false;
      }
      // Refresh from backend
      await fetchWallet();
      return true;
    } catch (err) {
      console.error('Deduct error:', err);
      return false;
    }
  }, [token, API_BASE, fetchWallet]);

  // Call backend to add funds (refunds, winnings)
  const credit = useCallback((amount: number, description: string, type: Transaction['type']) => {
    const storedToken = token || localStorage.getItem('wb_token');
    if (storedToken) {
      fetch(`${API_BASE}/api/wallet/credit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ amount, description, type }),
      }).then(() => fetchWallet()).catch(console.error);
    }
  }, [token, API_BASE, fetchWallet]);

  const refreshWallet = useCallback(() => fetchWallet(), [fetchWallet]);

  return (
    <WalletContext.Provider value={{ balance, transactions, isLoading, deduct, credit, setBalance, refreshWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
}
