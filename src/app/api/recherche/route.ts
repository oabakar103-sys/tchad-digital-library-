import { NextRequest, NextResponse } from 'next/server';
import { searchSuggestions } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const suggestions = await searchSuggestions(q);
  return NextResponse.json({ suggestions });
}
