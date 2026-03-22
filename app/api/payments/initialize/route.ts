import { NextRequest, NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder';
const CALLBACK_URL = process.env.NEXT_PUBLIC_CALLBACK_URL || 'https://winbig-africa.vercel.app/api/payments/callback';

// In-memory store for payment references (MVP)
const paymentReferences = new Map<string, { amount: number; email: string; userId: string; status: string }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, email, userId } = body;

    if (!amount || !email) {
      return NextResponse.json(
        { message: 'Amount and email are required' },
        { status: 400 }
      );
    }

    if (amount < 100) {
      return NextResponse.json(
        { message: 'Minimum amount is ₦100' },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `winbig_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    // Store reference
    paymentReferences.set(reference, {
      amount,
      email,
      userId: userId || '',
      status: 'pending',
    });

    // Call Paystack to initialize transaction
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to kobo
        email,
        reference,
        callback_url: CALLBACK_URL,
        metadata: {
          userId: userId || '',
          type: 'wallet_funding',
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      console.error('Paystack init error:', paystackData);
      return NextResponse.json(
        { message: paystackData.message || 'Failed to initialize payment' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorizationUrl: paystackData.data.authorization_url,
      reference,
    });
  } catch (error) {
    console.error('Payment initialize error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export the store for use in callback
export { paymentReferences };
