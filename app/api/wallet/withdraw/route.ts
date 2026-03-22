import { NextRequest, NextResponse } from 'next/server';

// Shared in-memory store — same pattern as wallet/route.ts
// For production, replace with actual DB

interface Transaction {
  id: string;
  type: 'withdraw';
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  accountNumber: string;
  bankName: string;
}

interface WalletData {
  balance: number;
  transactions: Transaction[];
}

const wallets = new Map<string, WalletData>();
const withdrawals = new Map<string, Transaction>();

function getWallet(key: string): WalletData {
  if (!wallets.has(key)) {
    wallets.set(key, { balance: 0, transactions: [] });
  }
  return wallets.get(key)!;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, accountNumber, bankName, email } = body;

    if (!amount || !accountNumber || !bankName) {
      return NextResponse.json(
        { message: 'Amount, account number, and bank name are required' },
        { status: 400 }
      );
    }

    const numAmount = Number(amount);
    if (numAmount < 1000) {
      return NextResponse.json(
        { message: 'Minimum withdrawal is ₦1,000' },
        { status: 400 }
      );
    }

    // Use email as key if available
    const key = email || 'anonymous';
    const wallet = getWallet(key);

    if (wallet.balance < numAmount) {
      return NextResponse.json(
        { message: 'Insufficient wallet balance' },
        { status: 400 }
      );
    }

    // Create pending withdrawal
    const withdrawal: Transaction = {
      id: `wd_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: 'withdraw',
      amount: -numAmount,
      description: `Withdrawal to ${bankName} (${accountNumber})`,
      date: new Date().toISOString(),
      status: 'pending',
      accountNumber,
      bankName,
    };

    // Deduct from balance immediately (funds are held)
    wallet.balance -= numAmount;
    wallet.transactions.unshift(withdrawal as any);
    wallets.set(key, wallet);

    // Store withdrawal separately for admin approval
    withdrawals.set(withdrawal.id, withdrawal);

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted and pending approval',
      withdrawalId: withdrawal.id,
      newBalance: wallet.balance,
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
