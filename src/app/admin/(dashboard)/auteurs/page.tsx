import { requireAdmin } from '@/lib/auth';
import AuthorsManager from '@/components/admin/AuthorsManager';

export const metadata = { title: 'Auteurs', robots: { index: false } };

export default async function AdminAuteursPage() {
  await requireAdmin();
  return <AuthorsManager />;
}
