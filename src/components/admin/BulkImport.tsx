'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconFilePdf } from '@/components/icons';

export default function BulkImport({ defaultAuthor, defaultCategory }: { defaultAuthor: string; defaultCategory: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [authorId, setAuthorId] = useState(defaultAuthor);
  const [categoryId, setCategoryId] = useState(defaultCategory);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    setBusy(true);
    setMessage('');
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    form.append('authorId', authorId);
    form.append('categoryId', categoryId);
    const res = await fetch('/api/admin/livres/import', { method: 'POST', body: form });
    const data = await res.json();
    setBusy(false);
    if (res.ok) {
      setMessage(`${data.count} livre(s) importé(s) en brouillon. Vérifiez les métadonnées avant publication.`);
      setFiles([]);
      router.refresh();
    } else {
      setMessage(data.error ?? 'Import impossible.');
    }
  };

  return (
    <form onSubmit={submit} className="card p-5">
      <h3 className="mb-2 text-sm font-semibold">Import en masse de PDF</h3>
      <p className="mb-3 text-xs text-[var(--ink-soft)]">
        Sélectionnez plusieurs fichiers PDF d'un coup. Chaque fichier crée une fiche en brouillon ; le titre est extrait du nom de fichier.
      </p>
      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="label">Auteur par défaut</span>
          <input className="input" value={authorId} onChange={(e) => setAuthorId(e.target.value)} />
        </label>
        <label className="block">
          <span className="label">Catégorie par défaut</span>
          <input className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
        </label>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="hidden"
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
      />
      <button type="button" onClick={() => inputRef.current?.click()} className="btn-outline text-xs">
        <IconFilePdf width={14} height={14} /> Choisir des PDF ({files.length})
      </button>
      {files.length > 0 && (
        <ul className="mt-3 max-h-40 space-y-1 overflow-auto text-xs">
          {files.map((f) => (
            <li key={f.name} className="flex justify-between rounded bg-[var(--surface-soft)] px-2 py-1">
              <span className="truncate">{f.name}</span>
              <span className="text-[var(--ink-soft)]">{(f.size / 1024).toFixed(0)} Ko</span>
            </li>
          ))}
        </ul>
      )}
      <button type="submit" disabled={busy || files.length === 0} className="btn-primary mt-3 text-xs">
        {busy ? 'Import en cours…' : 'Importer les PDF'}
      </button>
      {message && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">{message}</p>}
    </form>
  );
}
