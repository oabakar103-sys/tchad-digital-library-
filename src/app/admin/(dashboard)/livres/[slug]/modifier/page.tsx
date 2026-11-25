import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import BookForm from '@/components/admin/BookForm';
import { getBookBySlug, listAuthors, listCategories } from '@/lib/store';

export const metadata = { title: 'Modifier le livre', robots: { index: false } };

export default async function EditBookPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const book = await getBookBySlug(slug, true);
  if (!book) notFound();
  const [authors, categories] = await Promise.all([listAuthors(false), listCategories(false)]);
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">Modifier : {book.title}</h1>
      <BookForm mode="edit" initial={book} authors={authors} categories={categories} />
    </div>
  );
}
