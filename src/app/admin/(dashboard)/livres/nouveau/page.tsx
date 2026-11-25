import { requireAdmin } from '@/lib/auth';
import BookForm from '@/components/admin/BookForm';
import { listAuthors, listCategories } from '@/lib/store';

export const metadata = { title: 'Nouveau livre', robots: { index: false } };

export default async function NewBookPage() {
  await requireAdmin();
  const [authors, categories] = await Promise.all([listAuthors(false), listCategories(false)]);
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">Ajouter un livre</h1>
      <BookForm mode="create" initial={null} authors={authors} categories={categories} />
    </div>
  );
}
