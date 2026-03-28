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
    // Railway returns { value: [...] }, normalize to array directly
    if (data?.value && Array.isArray(data.value)) {
      return NextResponse.json(data.value);
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Campaigns unavailable' }, { status: 503 });
  }
}
