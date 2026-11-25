import AdminShell from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/auth';

export const metadata = { title: 'Administration', robots: { index: false } };

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return <AdminShell user={user}>{children}</AdminShell>;
}
