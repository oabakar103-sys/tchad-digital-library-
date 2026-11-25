import { NextResponse } from 'next/server';
import { getBookBySlug, listAuthors, listCategories, recordView } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return NextResponse.json({ error: 'Livre introuvable.' }, { status: 404 });
  const authors = await listAuthors(false);
  const author = authors.find((a) => a.id === book.authorId) ?? null;
  const categories = await listCategories(false);
  const category = categories.find((c) => c.id === book.categoryId) ?? null;
  void recordView(slug);
  return NextResponse.json({ book, author, category });
}
