import { NextResponse } from 'next/server';
import { getPublicStats } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = await getPublicStats();
  return NextResponse.json(stats);
}
