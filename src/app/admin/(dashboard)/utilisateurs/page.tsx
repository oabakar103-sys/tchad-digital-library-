import { requireAdmin } from '@/lib/auth';
import UsersManager from '@/components/admin/UsersManager';

export const metadata = { title: 'Utilisateurs', robots: { index: false } };

export default async function AdminUsersPage() {
  await requireAdmin(['super_admin']);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Utilisateurs</h1>
        <p className="text-sm text-[var(--ink-soft)]">Comptes lecteurs et comptes éditeurs. Le blocage interdit la publication des avis.</p>
      </div>
      <UsersManager />
    </div>
  );
}
