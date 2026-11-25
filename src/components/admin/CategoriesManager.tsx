'use client';

import { useEffect, useState } from 'react';
import CategoryForm from '@/components/admin/CategoryForm';
import { IconTrash } from '@/components/icons';
import type { Category } from '@/types';

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);

  const load = () =>
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm('Supprimer cette catégorie ? Les livres associés devront être rattachés avant suppression.')) return;
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-bold">Gestion des catégories</h1>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div>
          <h2 className="mb-3 text-sm font-semibold">{editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
          <CategoryForm
            mode={editing ? 'edit' : 'create'}
            initial={editing ?? undefined}
          />
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-left text-xs uppercase tracking-wide text-[var(--ink-soft)]">
                <th className="p-3">Nom</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-[var(--line)]/60">
                  <td className="p-3">
                    <span className="inline-flex items-center gap-2 font-medium">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-[var(--ink-soft)]">/{c.slug}</td>
                  <td className="max-w-56 p-3 text-xs text-[var(--ink-soft)] line-clamp-2">{c.description}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setEditing(c)} className="btn-outline !px-2.5 !py-1 text-xs">Modifier</button>
                      <button type="button" onClick={() => remove(c.id)} className="btn-outline !p-2 text-tchad-red-600" aria-label="Supprimer">
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
