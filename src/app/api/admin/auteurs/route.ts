import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/auth';
import { listAuthors, upsertAuthor } from '@/lib/store';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;
  return NextResponse.json({ authors: await listAuthors(false) });
}

export async function POST(req: NextRequest) {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;
  const body = await req.json().catch(() => null);
  if (!body?.name) return NextResponse.json({ error: 'Nom requis.' }, { status: 400 });
  const row = await upsertAuthor({
    id: `au-${slugify(body.name)}`,
    slug: slugify(body.slug || body.name),
    name: String(body.name),
    country: String(body.country ?? 'Tchad'),
    birthYear: body.birthYear ? Number(body.birthYear) : undefined,
    bio: String(body.bio ?? ''),
    tchadian: Boolean(body.tchadian),
    accentColor: String(body.accentColor ?? '#0f4f9e'),
  });
  return NextResponse.json({ author: row }, { status: 201 });
}
