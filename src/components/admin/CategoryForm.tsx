'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';

interface Props {
  initial?: { id?: string; name: string; slug: string; description: string; color: string; icon: string };
  mode: 'create' | 'edit';
}

const PALETTE = ['#0f4f9e', '#c8102e', '#f2b200', '#7c5400', '#2f6cbf', '#85091e', '#062450', '#d19400'];

export default function CategoryForm({ initial, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    description: initial?.description ?? '',
    color: initial?.color ?? PALETTE[0],
    icon: initial?.icon ?? 'book-open',
  });
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const slug = form.slug || slugify(form.name);
    const res = await fetch(mode === 'create' ? '/api/admin/categories' : `/api/admin/categories/${initial!.id}`, {
      method: mode === 'create' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, slug }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Erreur');
      return;
    }
    router.push('/admin/categories');
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="card max-w-2xl space-y-4 p-5">
      <div>
        <label className="label">Nom de la catégorie *</label>
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: mode === 'create' ? slugify(e.target.value) : form.slug })} required />
      </div>
      <div>
        <label className="label">URL (slug)</label>
        <input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
      </div>
      <div>
        <label className="label">Description courte</label>
        <textarea className="input min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div>
        <span className="label">Couleur</span>
        <div className="flex flex-wrap gap-2">
          {PALETTE.map((c) => (
            <button key={c} type="button" onClick={() => setForm({ ...form, color: c })} aria-label={c} className={`h-7 w-7 rounded-full ${form.color === c ? 'ring-2 ring-offset-2 ring-tchad-gold-500' : ''}`} style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
      {error && <p className="text-sm text-tchad-red-600">{error}</p>}
      <div className="flex gap-2">
        <button className="btn-primary" type="submit">{mode === 'create' ? 'Créer la catégorie' : 'Enregistrer'}</button>
        <button type="button" onClick={() => router.push('/admin/categories')} className="btn-outline">Annuler</button>
      </div>
    </form>
  );
}
