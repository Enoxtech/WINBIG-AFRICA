import { NextResponse } from 'next/server';
import { FALLBACK_CAMPAIGNS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(FALLBACK_CAMPAIGNS);
}
