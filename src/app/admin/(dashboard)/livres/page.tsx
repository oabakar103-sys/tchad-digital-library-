import { requireAdmin } from '@/lib/auth';
import BooksManager from '@/components/admin/BooksManager';

export const metadata = { title: 'Livres', robots: { index: false } };

export default async function AdminLivresPage() {
  await requireAdmin();
  return <BooksManager />;
}
