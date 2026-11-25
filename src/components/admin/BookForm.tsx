'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Author, Book, Category } from '@/types';
import { IconFilePdf, IconPlus } from '@/components/icons';

const COLORS = ['#0f4f9e', '#082f66', '#c8102e', '#f2b200', '#7c5400', '#2f6cbf', '#85091e', '#062450', '#d19400', '#a67200'];

interface Props {
  mode: 'create' | 'edit';
  initial: Book | null;
  authors: Author[];
  categories: Category[];
}

export default function BookForm({ mode, initial, authors, categories }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: initial?.title ?? '',
    authorId: initial?.authorId ?? authors[0]?.id ?? '',
    categoryId: initial?.categoryId ?? categories[0]?.id ?? '',
    summary: initial?.summary ?? '',
    year: initial?.year ?? new Date().getFullYear(),
    pages: initial?.pages ?? 0,
    fileSizeKb: initial?.fileSizeKb ?? 0,
    language: initial?.language ?? 'Français',
    tags: initial?.tags.join(', ') ?? '',
    coverColor: initial?.coverColor ?? COLORS[0],
    status: initial?.status ?? 'draft',
    featured: initial?.featured ?? false,
    isNew: initial?.isNew ?? true,
    pdfUrl: initial?.pdfUrl ?? '',
  });

  const set = (k: keyof typeof form, v: string | number | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const pickFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles(Array.from(list).filter((f) => f.type === 'application/pdf' || f.name.endsWith('.pdf')));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.authorId || !form.categoryId) {
      setError('Titre, auteur et catégorie sont obligatoires.');
      return;
    }
    setSaving(true);

    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      pages: Number(form.pages) || 0,
      year: Number(form.year) || new Date().getFullYear(),
      fileSizeKb: Number(form.fileSizeKb) || files.reduce((s, f) => s + Math.round(f.size / 1024), 0),
      pdfFileName: files[0]?.name ?? null,
    };

    const res = await fetch(mode === 'create' ? '/api/admin/livres' : `/api/admin/livres/${initial!.slug}`, {
      method: mode === 'create' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Erreur lors de l\u2019enregistrement.');
      return;
    }
    router.push('/admin/livres');
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="card space-y-4 p-5">
        <div>
          <label className="label">Titre du livre *</label>
          <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Auteur *</label>
            <select className="input" value={form.authorId} onChange={(e) => set('authorId', e.target.value)}>
              {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Catégorie *</label>
            <select className="input" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Année de publication</label>
            <input type="number" className="input" value={form.year} onChange={(e) => set('year', e.target.value)} />
          </div>
          <div>
            <label className="label">Langue</label>
            <select className="input" value={form.language} onChange={(e) => set('language', e.target.value)}>
              <option>Français</option>
              <option>Français et arabe tchadien</option>
              <option>Français et anglais</option>
            </select>
          </div>
          <div>
            <label className="label">Nombre de pages</label>
            <input type="number" className="input" value={form.pages} onChange={(e) => set('pages', e.target.value)} />
          </div>
          <div>
            <label className="label">Taille du fichier (Ko, auto si PDF joint)</label>
            <input type="number" className="input" value={form.fileSizeKb} onChange={(e) => set('fileSizeKb', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Résumé / description</label>
          <textarea className="input min-h-32" value={form.summary} onChange={(e) => set('summary', e.target.value)} />
        </div>
        <div>
          <label className="label">Mots-clés (séparés par des virgules)</label>
          <input className="input" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="roman, Sahel, école" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-5">
          <h3 className="mb-3 text-sm font-semibold">Fichier PDF</h3>
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pickFiles(e.dataTransfer.files); }}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition ${drag ? 'border-tchad-blue-500 bg-tchad-blue-50 dark:bg-tchad-blue-900/30' : 'border-[var(--line)]'}`}
          >
            <IconFilePdf width={28} height={28} className="text-tchad-red-500" />
            <p className="text-sm font-medium">Glissez-déposez le PDF ici</p>
            <p className="text-xs text-[var(--ink-soft)]">ou</p>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => pickFiles(e.target.files)}
            />
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline !text-xs">
              <IconPlus width={13} height={13} />
              <span>Choisir un fichier</span>
            </button>
            {files.length > 0 && (
              <ul className="mt-2 w-full space-y-1 text-left text-xs">
                {files.map((f) => (
                  <li key={f.name} className="rounded bg-[var(--surface-soft)] px-2 py-1">
                    {f.name} — {(f.size / 1024).toFixed(0)} Ko
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[11px] text-[var(--ink-soft)]">
              En production : upload direct vers Supabase Storage ; la couverture est extraite automatiquement de la 1re page.
            </p>
          </div>
        </div>

        <div className="card space-y-4 p-5">
          <h3 className="text-sm font-semibold">Parution</h3>
          <label className="flex items-center justify-between text-sm">
            Statut
            <select className="input !w-auto !py-1.5" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> Mettre à la une
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isNew} onChange={(e) => set('isNew', e.target.checked)} /> Marquer comme nouveauté
          </label>
          <div>
            <p className="label">Couleur de couverture (générée automatiquement)</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('coverColor', c)}
                  aria-label={`Couleur ${c}`}
                  className={`h-7 w-7 rounded-full border-2 ${form.coverColor === c ? 'border-tchad-gold-500 ring-2 ring-tchad-gold-300' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {error && <p className="rounded-lg bg-tchad-red-50 px-3 py-2 text-sm text-tchad-red-700 dark:bg-tchad-red-900/30 dark:text-tchad-red-200">{error}</p>}

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Enregistrement…' : mode === 'create' ? 'Publier le livre' : 'Enregistrer les modifications'}</button>
          <button type="button" onClick={() => router.push('/admin/livres')} className="btn-outline">Annuler</button>
        </div>
      </div>
    </form>
  );
}
