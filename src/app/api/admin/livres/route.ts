import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/auth';
import { listAllBooks, listAuthors, listCategories, upsertBook } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;

  const [books, authors, categories] = await Promise.all([listAllBooks(), listAuthors(false), listCategories(false)]);
  return NextResponse.json({ books, authors, categories });
}

export async function POST(req: NextRequest) {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;

  const body = await req.json().catch(() => null);
  if (!body?.title || !body?.authorId || !body?.categoryId) {
    return NextResponse.json({ error: 'Titre, auteur et catégorie requis.' }, { status: 400 });
  }

  const book = await upsertBook({
    title: String(body.title),
    authorId: String(body.authorId),
    categoryId: String(body.categoryId),
    summary: String(body.summary ?? ''),
    year: Number(body.year) || new Date().getFullYear(),
    pages: Number(body.pages) || 0,
    fileSizeKb: Number(body.fileSizeKb) || 0,
    language: String(body.language ?? 'Français'),
    status: body.status === 'published' ? 'published' : 'draft',
    featured: Boolean(body.featured),
    isNew: Boolean(body.isNew),
    tags: Array.isArray(body.tags) ? body.tags : [],
    coverColor: String(body.coverColor ?? '#0f4f9e'),
    coverUrl: body.coverUrl ?? null,
    pdfUrl: body.pdfUrl || null,
  });
  return NextResponse.json({ book }, { status: 201 });
}
