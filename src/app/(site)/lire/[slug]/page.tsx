import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBookBySlug, listAuthors, listCategories } from '@/lib/store';
import PdfReader from '@/components/PdfReader';
import { IconArrowRight } from '@/components/icons';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  return {
    title: book ? `Lire : ${book.title}` : 'Lecture',
    robots: { index: false, follow: true },
  };
}

export default async function ReaderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  const [authors, categories] = await Promise.all([listAuthors(false), listCategories(false)]);
  const author = authors.find((a) => a.id === book.authorId) ?? null;
  const category = categories.find((c) => c.id === book.categoryId) ?? null;

  return (
    <div className="bg-[var(--surface-soft)] py-6">
      <div className="container-x mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={`/livre/${book.slug}`} className="inline-flex items-center gap-1 text-xs text-[var(--ink-soft)] hover:underline">
            <IconArrowRight width={12} height={12} className="rotate-180" /> Retour à la fiche
          </Link>
          <h1 className="mt-1 font-serif text-xl font-bold">{book.title}</h1>
          <p className="text-xs text-[var(--ink-soft)]">{author?.name} · {category?.name}</p>
        </div>
      </div>
      <PdfReader book={book} author={author} category={category} />
    </div>
  );
}
