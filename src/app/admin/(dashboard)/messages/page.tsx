import { requireAdmin } from '@/lib/auth';
import MessagesManager from '@/components/admin/MessagesManager';

export const metadata = { title: 'Messages', robots: { index: false } };

export default async function AdminMessagesPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Messages reçus</h1>
        <p className="text-sm text-[var(--ink-soft)]">Propositions de livres, signalements et demandes des lecteurs et partenaires.</p>
      </div>
      <MessagesManager />
    </div>
  );
}
