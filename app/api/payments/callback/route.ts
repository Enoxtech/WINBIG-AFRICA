import { NextRequest, NextResponse } from 'next/server';
import { paymentReferences } from '../initialize/route';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');

    const ref = reference || trxref;

    if (!ref) {
      return NextResponse.redirect(new URL('/dashboard?payment=failed&reason=no_reference', request.url));
    }

    // Check if we already processed this reference
    const storedPayment = paymentReferences.get(ref);

    if (!storedPayment) {
      // Try to verify with Paystack anyway (edge case: server restarted)
      console.warn(`Reference ${ref} not found in memory store, verifying with Paystack...`);
    }

    // Verify payment with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData.status) {
      console.error('Paystack verify error:', verifyData);
      return NextResponse.redirect(new URL('/dashboard?payment=failed&reason=verification_failed', request.url));
    }

    const { data } = verifyData;

    // Check if already credited
    if (storedPayment?.status === 'completed') {
      return NextResponse.redirect(new URL('/dashboard?payment=already_processed', request.url));
    }

    // Credit the user's wallet
    // In production: update database. For MVP: wallet is credited via client-side context
    // The server-side credit is handled here for security
    const userId = data.metadata?.userId || storedPayment?.userId || '';
    const email = data.customer?.email || storedPayment?.email || '';
    const amount = (data.amount || storedPayment?.amount) / 100; // Convert from kobo

    // Update reference status
    if (storedPayment) {
      storedPayment.status = 'completed';
      paymentReferences.set(ref, storedPayment);
    }

    // Call wallet fund endpoint to credit the wallet server-side
    try {
      await fetch(`${request.nextUrl.origin}/api/wallet/fund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: ref,
          amount,
          email,
          userId,
        }),
      });
    } catch (fundError) {
      console.error('Failed to credit wallet:', fundError);
      // Continue anyway — user can retry or contact support
    }

    // Success redirect
    return NextResponse.redirect(new URL('/dashboard?payment=success', request.url));
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?payment=failed&reason=server_error', request.url));
  }
}
