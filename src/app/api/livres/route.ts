import { NextRequest, NextResponse } from 'next/server';
import { listBooks } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const result = await listBooks({
    category: sp.get('category') ?? undefined,
    author: sp.get('author') ?? undefined,
    year: sp.get('year') ?? undefined,
    language: sp.get('language') ?? undefined,
    sort: (sp.get('sort') as 'popular' | 'new' | 'title' | 'rating' | 'year') ?? undefined,
    q: sp.get('q') ?? undefined,
    page: sp.get('page') ? Number(sp.get('page')) : undefined,
    perPage: sp.get('perPage') ? Number(sp.get('perPage')) : undefined,
  });
  return NextResponse.json(result);
}
