import { NextResponse } from 'next/server';

const RAILWAY_URL = 'https://backend-production-9aa6.up.railway.app';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const res = await fetch(`${RAILWAY_URL}/api/campaigns/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) {
      if (res.status === 404) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      throw new Error('Failed to fetch campaign');
    }
    const data = await res.json();
    // Railway returns { value: {...} }, extract the value
    return NextResponse.json(data?.value ?? data);
  } catch (err) {
    return NextResponse.json({ error: 'Campaign unavailable' }, { status: 503 });
  }
}
