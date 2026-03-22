import { NextRequest, NextResponse } from 'next/server';

interface WalletData {
  balance: number;
}

const wallets = new Map<string, WalletData>();

function getWallet(key: string): WalletData {
  if (!wallets.has(key)) {
    wallets.set(key, { balance: 0 });
  }
  return wallets.get(key)!;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, email, userId, description } = body;

    if (!amount) {
      return NextResponse.json({ message: 'Amount required' }, { status: 400 });
    }

    const numAmount = Number(amount);
    if (numAmount <= 0) {
      return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
    }

    const key = userId || email || 'anonymous';
    const wallet = getWallet(key);

    if (wallet.balance < numAmount) {
      return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
    }

    wallet.balance -= numAmount;

    return NextResponse.json({
      success: true,
      balance: wallet.balance,
      description: description || 'Ticket purchase',
    });
  } catch (error) {
    console.error('Wallet deduct error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
