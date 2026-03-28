import { NextResponse } from 'next/server';

const RAILWAY_URL = 'https://backend-production-9aa6.up.railway.app';

export async function GET() {
  try {
    const res = await fetch(`${RAILWAY_URL}/api/campaigns`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch campaigns');
    const data = await res.json();
    // Railway returns { value: [...] }, normalize to { campaigns: [...] }
    const campaigns = data?.value ?? data;
    const arr = Array.isArray(campaigns) ? campaigns : (campaigns ? [campaigns] : []);
    return NextResponse.json({ campaigns: arr });
  } catch (err) {
    return NextResponse.json({ error: 'Campaigns unavailable' }, { status: 503 });
  }
}
