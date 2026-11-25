import { requireAdmin } from '@/lib/auth';
import ReviewsManager from '@/components/admin/ReviewsManager';

export const metadata = { title: 'Avis & modération', robots: { index: false } };

export default async function AdminAvisPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Avis & modération</h1>
        <p className="text-sm text-[var(--ink-soft)]">Les avis sont publiés après validation. Les contenus publicitaires ou insultants sont rejetés.</p>
      </div>
      <ReviewsManager />
    </div>
  );
}
