import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/auth';
import { deleteCategory, upsertCategory } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;
  const { slug: id } = await params;
  const body = await req.json().catch(() => ({}));
  const row = await upsertCategory(
    {
      id,
      slug: String(body.slug ?? id),
      name: String(body.name ?? ''),
      description: String(body.description ?? ''),
      color: String(body.color ?? '#0f4f9e'),
      icon: String(body.icon ?? 'book-open'),
      sortOrder: Number(body.sortOrder) || 99,
    },
    id,
  );
  return NextResponse.json({ category: row });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await apiGuard(['super_admin']);
  if (session instanceof NextResponse) return session;
  const { slug: id } = await params;
  const ok = await deleteCategory(id);
  if (!ok) return NextResponse.json({ error: 'Catégorie introuvable.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
