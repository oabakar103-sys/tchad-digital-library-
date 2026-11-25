import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/auth';
import { listCategories, upsertCategory } from '@/lib/store';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;
  return NextResponse.json({ categories: await listCategories(false) });
}

export async function POST(req: NextRequest) {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;
  const body = await req.json().catch(() => null);
  if (!body?.name) return NextResponse.json({ error: 'Nom requis.' }, { status: 400 });
  const row = await upsertCategory({
    id: `cat-${slugify(body.slug || body.name)}`,
    slug: slugify(body.slug || body.name),
    name: String(body.name),
    description: String(body.description ?? ''),
    color: String(body.color ?? '#0f4f9e'),
    icon: String(body.icon ?? 'book-open'),
    sortOrder: Number(body.sortOrder) || 99,
  });
  return NextResponse.json({ category: row }, { status: 201 });
}
