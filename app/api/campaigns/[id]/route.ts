import { NextResponse } from 'next/server';
import { FALLBACK_CAMPAIGNS } from '@/lib/mockData';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campaign = FALLBACK_CAMPAIGNS.find(c => c.id === id);
  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }
  return NextResponse.json(campaign);
}
