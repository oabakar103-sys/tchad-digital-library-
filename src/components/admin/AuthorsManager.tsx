'use client';

import { useEffect, useState } from 'react';
import AuthorForm from '@/components/admin/AuthorForm';
import { IconTrash } from '@/components/icons';
import type { Author } from '@/types';

export default function AuthorsManager() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [editing, setEditing] = useState<Author | null>(null);

  const load = () =>
    fetch('/api/admin/auteurs')
      .then((r) => r.json())
      .then((d) => setAuthors(d.authors ?? []));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm('Supprimer cet auteur ? Ses livres devront être réaffectés.')) return;
    await fetch(`/api/admin/auteurs/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">Gestion des auteurs</h1>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div>
          <h2 className="mb-3 text-sm font-semibold">{editing ? 'Modifier l\u2019auteur' : 'Nouvel auteur'}</h2>
          <AuthorForm mode={editing ? 'edit' : 'create'} initial={editing ?? undefined} />
        </div>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-left text-xs uppercase tracking-wide text-[var(--ink-soft)]">
                <th className="p-3">Nom</th>
                <th className="p-3">Pays</th>
                <th className="p-3">Tchadien</th>
                <th className="p-3">Bio</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((a) => (
                <tr key={a.id} className="border-b border-[var(--line)]/60">
                  <td className="p-3 font-medium">
                    {a.name}
                    {a.tchadian && <span className="chip ml-2 bg-tchad-gold-100 text-tchad-gold-800 dark:bg-tchad-gold-900/30 dark:text-tchad-gold-200">TDL</span>}
                  </td>
                  <td className="p-3 text-[var(--ink-soft)]">{a.country}</td>
                  <td className="p-3">{a.birthYear ?? '—'}</td>
                  <td className="max-w-64 p-3 text-xs text-[var(--ink-soft)] line-clamp-2">{a.bio}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setEditing(a)} className="btn-outline !px-2.5 !py-1 text-xs">Modifier</button>
                      <button type="button" onClick={() => remove(a.id)} className="btn-outline !p-2 text-tchad-red-600" aria-label="Supprimer">
                        <IconTrash width={14} height={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
