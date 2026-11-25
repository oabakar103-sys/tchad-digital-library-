'use client';

import { useEffect, useMemo, useState } from 'react';
import seedBooks from '@/data/books.json';
import type { Review } from '@/types';

const BOOK_TITLES = new Map((seedBooks as { id: string; title: string }[]).map((b) => [b.id, b.title]));

type Filter = 'all' | 'pending' | 'approved' | 'rejected';

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<Filter>('pending');

  const load = () =>
    fetch('/api/admin/avis')
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: Review['status']) => {
    await fetch(`/api/admin/avis/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const filtered = useMemo(() => reviews.filter((r) => filter === 'all' || r.status === filter), [reviews, filter]);
  const counts = {
    pending: reviews.filter((r) => r.status === 'pending').length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    rejected: reviews.filter((r) => r.status === 'rejected').length,
  };

  const chips: { id: Filter; label: string; count?: number }[] = [
    { id: 'pending', label: 'En attente', count: counts.pending },
    { id: 'approved', label: 'Approuvés', count: counts.approved },
    { id: 'rejected', label: 'Rejetés', count: counts.rejected },
    { id: 'all', label: 'Tout' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={filter === c.id ? 'btn-primary !text-xs' : 'btn-outline !text-xs'}
          >
            {c.label}{typeof c.count === 'number' ? ` (${c.count})` : ''}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-sm">{r.readerName} <span className="text-xs text-[var(--ink-soft)]">· {r.readerEmail}</span></p>
                <p className="text-xs text-[var(--ink-soft)]">
                  {BOOK_TITLES.get(r.bookId) ?? r.bookId} · note {r.rating}/5 · {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <span className={`chip ${
                r.status === 'approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                : r.status === 'rejected' ? 'bg-tchad-red-50 text-tchad-red-700 dark:bg-tchad-red-900/30 dark:text-tchad-red-200'
                : 'bg-tchad-gold-50 text-tchad-gold-800 dark:bg-tchad-gold-900/30 dark:text-tchad-gold-200'
              }`}>
                {r.status === 'approved' ? 'Approuvé' : r.status === 'rejected' ? 'Rejeté' : 'En attente'}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{r.comment}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setStatus(r.id, 'approved')} className="btn-primary !px-3 !py-1.5 text-xs">Approuver</button>
              <button type="button" onClick={() => setStatus(r.id, 'rejected')} className="btn-danger !px-3 !py-1.5 text-xs">Rejeter</button>
              {r.status !== 'pending' && (
                <button type="button" onClick={() => setStatus(r.id, 'pending')} className="btn-outline !px-3 !py-1.5 text-xs">Remettre en attente</button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="card p-8 text-center text-sm text-[var(--ink-soft)]">Aucun avis dans cette catégorie.</p>}
      </div>
    </div>
  );
}
