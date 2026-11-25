'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import BulkImport from '@/components/admin/BulkImport';
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@/components/icons';
import type { Author, Book, Category } from '@/types';

interface Payload {
  books: Book[];
  authors: Author[];
  categories: Category[];
}

export default function BooksManager() {
  const [data, setData] = useState<Payload | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/admin/livres')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ books: [], authors: [], categories: [] }));
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.books.filter((b) => {
      const matchQ = !q || `${b.title} ${b.summary}`.toLowerCase().includes(q.toLowerCase());
      const matchS = !status || b.status === status;
      return matchQ && matchS;
    });
  }, [data, q, status]);

  const remove = async (slug: string) => {
    if (!confirm('Supprimer définitivement ce livre ? Cette action est irréversible.')) return;
    const res = await fetch(`/api/admin/livres/${slug}`, { method: 'DELETE' });
    if (res.ok) setData((d) => (d ? { ...d, books: d.books.filter((b) => b.slug !== slug) } : d));
  };

  if (!data) return <p className="text-sm text-[var(--ink-soft)]">Chargement du catalogue…</p>;

  const authorName = (id: string) => data.authors.find((a) => a.id === id)?.name ?? id;
  const categoryName = (id: string) => data.categories.find((c) => c.id === id)?.name ?? id;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold">Gestion des livres</h1>
          <p className="text-sm text-[var(--ink-soft)]">{data.books.length} fiche(s) au total.</p>
        </div>
        <Link href="/admin/livres/nouveau" className="btn-primary text-sm">
          <IconPlus width={15} height={15} /> Ajouter un livre
        </Link>
      </div>

      <BulkImport defaultAuthor={data.authors[0]?.id ?? ''} defaultCategory={data.categories[0]?.id ?? ''} />

      <div className="card flex flex-wrap items-center gap-3 p-4">
        <div className="relative flex-1 min-w-52">
          <IconSearch width={15} height={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher titre, résumé…" className="input !pl-9" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input !w-auto">
          <option value="">Tous les statuts</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] text-left text-xs uppercase tracking-wide text-[var(--ink-soft)]">
              <th className="p-3">Titre</th>
              <th className="p-3">Auteur</th>
              <th className="p-3">Catégorie</th>
              <th className="p-3">Année</th>
              <th className="p-3">Statut</th>
              <th className="p-3 text-right">Téléchargements</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-[var(--line)]/60 hover:bg-[var(--surface-soft)]">
                <td className="p-3">
                  <p className="font-medium">{b.title}</p>
                  <p className="text-xs text-[var(--ink-soft)]">{b.pages} pages · {b.fileSizeKb} Ko</p>
                </td>
                <td className="p-3 text-[var(--ink-soft)]">{authorName(b.authorId)}</td>
                <td className="p-3 text-[var(--ink-soft)]">{categoryName(b.categoryId)}</td>
                <td className="p-3">{b.year}</td>
                <td className="p-3">
                  <span className={`chip ${b.status === 'published' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' : 'bg-tchad-gold-50 text-tchad-gold-800 dark:bg-tchad-gold-900/30 dark:text-tchad-gold-200'}`}>
                    {b.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="p-3 text-right">{b.downloads.toLocaleString('fr-FR')}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/livres/${b.slug}/modifier`} className="btn-outline !p-2" aria-label="Modifier">
                      <IconEdit width={14} height={14} />
                    </Link>
                    <button type="button" onClick={() => remove(b.slug)} className="btn-outline !p-2 text-tchad-red-600" aria-label="Supprimer">
                      <IconTrash width={14} height={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-sm text-[var(--ink-soft)]">Aucun résultat.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
