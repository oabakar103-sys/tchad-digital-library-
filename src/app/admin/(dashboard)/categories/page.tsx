import { requireAdmin } from '@/lib/auth';
import CategoriesManager from '@/components/admin/CategoriesManager';

export const metadata = { title: 'Catégories', robots: { index: false } };

export default async function AdminCategoriesPage() {
  await requireAdmin();
  return <CategoriesManager />;
}
