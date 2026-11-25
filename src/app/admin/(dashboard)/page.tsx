import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { getDashboardStats, listAuthors } from '@/lib/store';
import StatCard from '@/components/admin/StatCard';
import BarChart from '@/components/admin/BarChart';
import { IconBook, IconDownload, IconUsers, IconFolder, IconNote, IconMessage, IconPlus, IconArrowRight } from '@/components/icons';
import { formatNumber } from '@/lib/utils';

export const metadata = { title: 'Tableau de bord', robots: { index: false } };

export default async function AdminHomePage() {
  await requireAdmin();
  const [stats, authors] = await Promise.all([getDashboardStats(), listAuthors(false)]);
  const authorName = (id: string) => authors.find((a) => a.id === id)?.name ?? id;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold">Tableau de bord</h1>
          <p className="text-sm text-[var(--ink-soft)]">Vue d'ensemble du catalogue et de l'activité.</p>
        </div>
        <Link href="/admin/livres/nouveau" className="btn-primary text-sm">
          <IconPlus width={15} height={15} /> Nouveau livre
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Livres au catalogue" value={stats.totalBooks} icon={<IconBook width={20} height={20} />} accent="blue" hint={`${stats.totalCategories} catégories`} />
        <StatCard label="Téléchargements" value={stats.totalDownloads} icon={<IconDownload width={20} height={20} />} accent="gold" />
        <StatCard label="Lecteurs estimés" value={stats.totalReaders} icon={<IconUsers width={20} height={20} />} accent="green" />
        <StatCard label="Auteurs référencés" value={stats.totalAuthors} icon={<IconUsers width={20} height={20} />} accent="red" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Catégories" value={stats.totalCategories} icon={<IconFolder width={20} height={20} />} accent="blue" />
        <StatCard label="Avis en attente" value={stats.pendingReviews} icon={<IconNote width={20} height={20} />} accent="gold" hint="À modérer" />
        <StatCard label="Messages non lus" value={stats.newMessages} icon={<IconMessage width={20} height={20} />} accent="red" hint="Formulaire de contact" />
      </div>

      <BarChart data={stats.downloadsByMonth} />

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold">Les plus lus du moment</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-left text-xs uppercase tracking-wide text-[var(--ink-soft)]">
                <th className="pb-2 pr-4">Livre</th>
                <th className="pb-2 pr-4">Auteur</th>
                <th className="pb-2 pr-4 text-right">Téléchargements</th>
                <th className="pb-2 text-right">Vues</th>
              </tr>
            </thead>
            <tbody>
              {stats.topBooks.map((b) => (
                <tr key={b.slug} className="border-b border-[var(--line)]/60">
                  <td className="py-2.5 pr-4">
                    <Link href={`/livre/${b.slug}`} className="font-medium hover:underline">{b.title}</Link>
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--ink-soft)]">{authorName(b.authorId)}</td>
                  <td className="py-2.5 pr-4 text-right">{formatNumber(b.downloads)}</td>
                  <td className="py-2.5 text-right text-[var(--ink-soft)]">{formatNumber(b.views)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/livres" className="card flex items-center justify-between p-5 hover:shadow-soft">
          <span className="font-medium">Gérer les livres</span><IconArrowRight width={16} height={16} />
        </Link>
        <Link href="/admin/contenu" className="card flex items-center justify-between p-5 hover:shadow-soft">
          <span className="font-medium">Modifier slogans et textes</span><IconArrowRight width={16} height={16} />
        </Link>
        <Link href="/admin/messages" className="card flex items-center justify-between p-5 hover:shadow-soft">
          <span className="font-medium">Boîte de réception</span><IconArrowRight width={16} height={16} />
        </Link>
      </div>
    </div>
  );
}
