'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';

interface Props {
  mode: 'create' | 'edit';
  initial?: { id?: string; name: string; slug: string; country: string; birthYear?: number; bio: string; tchadian: boolean; accentColor: string };
}

export default function AuthorForm({ initial, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    country: initial?.country ?? 'Tchad',
    birthYear: initial?.birthYear ?? '',
    bio: initial?.bio ?? '',
    tchadian: initial?.tchadian ?? true,
    accentColor: initial?.accentColor ?? '#0f4f9e',
  });
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const slug = form.slug || slugify(form.name);
    const res = await fetch(mode === 'create' ? '/api/admin/auteurs' : `/api/admin/auteurs/${initial!.id}`, {
      method: mode === 'create' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, slug, birthYear: form.birthYear ? Number(form.birthYear) : null }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Erreur');
      return;
    }
    router.push('/admin/auteurs');
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="card max-w-2xl space-y-4 p-5">
      <div>
        <label className="label">Nom complet *</label>
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: mode === 'create' ? slugify(e.target.value) : form.slug })} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Pays</label>
          <input className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        </div>
        <div>
          <label className="label">Année de naissance</label>
          <input type="number" className="input" value={form.birthYear} onChange={(e) => setForm({ ...form, birthYear: e.target.value })} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.tchadian} onChange={(e) => setForm({ ...form, tchadian: e.target.checked })} />
        Auteur tchadien (mis en avant sur l'accueil)
      </label>
      <div>
        <label className="label">Biographie</label>
        <textarea className="input min-h-28" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      </div>
      {error && <p className="text-sm text-tchad-red-600">{error}</p>}
      <div className="flex gap-2">
        <button className="btn-primary" type="submit">{mode === 'create' ? 'Créer l\u2019auteur' : 'Enregistrer'}</button>
        <button type="button" onClick={() => router.push('/admin/auteurs')} className="btn-outline">Annuler</button>
      </div>
    </form>
  );
}
