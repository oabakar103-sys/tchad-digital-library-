import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/auth';
import { deleteAuthor, upsertAuthor } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;
  const { slug: id } = await params;
  const body = await req.json().catch(() => ({}));
  const row = await upsertAuthor(
    {
      id,
      slug: String(body.slug ?? id),
      name: String(body.name ?? ''),
      country: String(body.country ?? 'Tchad'),
      birthYear: body.birthYear ? Number(body.birthYear) : undefined,
      bio: String(body.bio ?? ''),
      tchadian: Boolean(body.tchadian),
      accentColor: String(body.accentColor ?? '#0f4f9e'),
    },
    id,
  );
  return NextResponse.json({ author: row });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await apiGuard(['super_admin']);
  if (session instanceof NextResponse) return session;
  const { slug: id } = await params;
  const ok = await deleteAuthor(id);
  if (!ok) return NextResponse.json({ error: 'Auteur introuvable.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
