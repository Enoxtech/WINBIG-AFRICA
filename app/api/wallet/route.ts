import { NextRequest, NextResponse } from 'next/server';

// In-memory wallet store (MVP — replace with DB later)
interface WalletData {
  balance: number;
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

const wallets = new Map<string, WalletData>();

// Helper to get user key from token/email
function getUserKey(request: NextRequest): string {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  // Try to parse user from body for POST requests
  return token || 'anonymous';
}

function getWallet(key: string): WalletData {
  if (!wallets.has(key)) {
    wallets.set(key, { balance: 0, transactions: [] });
  }
  return wallets.get(key)!;
}

// GET /api/wallet — get balance
export async function GET(request: NextRequest) {
  try {
    const key = getUserKey(request);
    const wallet = getWallet(key);

    return NextResponse.json({
      balance: wallet.balance,
      transactions: wallet.transactions.slice(0, 20),
    });
  } catch (error) {
    console.error('Wallet GET error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST /api/wallet/fund — add funds (called after Paystack callback)
export async function POST(request: NextRequest) {
  try {
    // Detect which action based on URL or body
    const { pathname } = request.nextUrl;

    if (pathname.endsWith('/fund')) {
      return handleFund(request);
    } else if (pathname.endsWith('/withdraw')) {
      return handleWithdraw(request);
    } else if (pathname.endsWith('/deduct')) {
      return handleDeduct(request);
    }

    // Default: treat as fund
    return handleFund(request);
  } catch (error) {
    console.error('Wallet POST error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

async function handleFund(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { reference, amount, email, userId } = body;

  if (!amount || !reference) {
    return NextResponse.json({ message: 'Amount and reference required' }, { status: 400 });
  }

  const key = userId || email || reference;
  const wallet = getWallet(key);

  const tx: Transaction = {
    id: `fund_${reference}_${Date.now()}`,
    type: 'fund',
    amount: Number(amount),
    description: `Wallet funding via Paystack`,
    date: new Date().toISOString(),
    status: 'completed',
  };

  wallet.balance += Number(amount);
  wallet.transactions.unshift(tx);
  wallets.set(key, wallet);

  return NextResponse.json({
    success: true,
    balance: wallet.balance,
    transaction: tx,
  });
}

async function handleWithdraw(request: NextRequest) {
  const body = await request.json();
  const { amount, accountNumber, bankName, email } = body;

  if (!amount || !accountNumber || !bankName) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const key = email || getUserKey(request);
  const wallet = getWallet(key);

  if (wallet.balance < amount) {
    return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
  }

  const tx: Transaction = {
    id: `wd_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: 'withdraw',
    amount: -Number(amount),
    description: `Withdrawal to ${bankName} (${accountNumber})`,
    date: new Date().toISOString(),
    status: 'pending',
  };

  wallet.balance -= Number(amount);
  wallet.transactions.unshift(tx);
  wallets.set(key, wallet);

  return NextResponse.json({
    success: true,
    message: 'Withdrawal request submitted and pending approval',
    balance: wallet.balance,
  });
}

async function handleDeduct(request: NextRequest) {
  const body = await request.json();
  const { amount, description, email, userId } = body;

  if (!amount) {
    return NextResponse.json({ message: 'Amount required' }, { status: 400 });
  }

  const key = userId || email || getUserKey(request);
  const wallet = getWallet(key);

  if (wallet.balance < amount) {
    return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
  }

  const tx: Transaction = {
    id: `deduct_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: 'purchase',
    amount: -Number(amount),
    description: description || 'Ticket purchase',
    date: new Date().toISOString(),
    status: 'completed',
  };

  wallet.balance -= Number(amount);
  wallet.transactions.unshift(tx);
  wallets.set(key, wallet);

  return NextResponse.json({
    success: true,
    balance: wallet.balance,
  });
}
