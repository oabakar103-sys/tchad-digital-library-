import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/auth';
import { deleteBook, getBookBySlug, upsertBook } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;
  const { slug } = await params;
  const book = await getBookBySlug(slug, true);
  if (!book) return NextResponse.json({ error: 'Livre introuvable.' }, { status: 404 });
  return NextResponse.json({ book });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;
  const { slug } = await params;
  const existing = await getBookBySlug(slug, true);
  if (!existing) return NextResponse.json({ error: 'Livre introuvable.' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const book = await upsertBook(
    {
      title: String(body.title ?? existing.title),
      authorId: String(body.authorId ?? existing.authorId),
      categoryId: String(body.categoryId ?? existing.categoryId),
      summary: String(body.summary ?? existing.summary),
      year: Number(body.year) || existing.year,
      pages: Number(body.pages) || existing.pages,
      fileSizeKb: Number(body.fileSizeKb) || existing.fileSizeKb,
      language: String(body.language ?? existing.language),
      status: body.status === 'published' || body.status === 'draft' ? body.status : existing.status,
      featured: typeof body.featured === 'boolean' ? body.featured : existing.featured,
      isNew: typeof body.isNew === 'boolean' ? body.isNew : existing.isNew,
      tags: Array.isArray(body.tags) ? body.tags : existing.tags,
      coverColor: String(body.coverColor ?? existing.coverColor),
      coverUrl: body.coverUrl ?? existing.coverUrl,
      pdfUrl: body.pdfUrl ?? existing.pdfUrl,
    },
    slug,
  );
  return NextResponse.json({ book });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await apiGuard(['super_admin']);
  if (session instanceof NextResponse) return session;
  const { slug } = await params;
  const ok = await deleteBook(slug);
  if (!ok) return NextResponse.json({ error: 'Livre introuvable.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
