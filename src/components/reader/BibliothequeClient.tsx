'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import CoverArt from '@/components/CoverArt';
import { IconNote, IconStar, IconTrash } from '@/components/icons';
import seedBooks from '@/data/books.json';
import seedAuthors from '@/data/authors.json';
import type { Book } from '@/types';

const BOOKS = seedBooks as unknown as Book[];
const AUTHORS = seedAuthors as unknown as { id: string; name: string }[];

type Tab = 'fav' | 'later' | 'history';
interface HistoryItem { slug: string; title: string; at: string }

function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '') as T;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage indisponible */
  }
}

export default function BibliothequeClient() {
  const [tab, setTab] = useState<Tab>('fav');
  const [favs, setFavs] = useState<string[]>([]);
  const [later, setLater] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    setFavs(read<string[]>('tdl:favorites', []));
    setLater(read<string[]>('tdl:later', []));
    setHistory(read<HistoryItem[]>('tdl:history', []));
    const stored = read<Record<string, string>>('tdl:notes', {});
    setNotes(stored);
  }, []);

  const bookBySlug = useMemo(() => new Map(BOOKS.map((b) => [b.slug, b])), []);
  const authorName = (id?: string) => AUTHORS.find((a) => a.id === id)?.name ?? 'Auteur';

  const remove = (key: 'tdl:favorites' | 'tdl:later', setter: (v: string[]) => void, slug: string) => {
    const next = (key === 'tdl:favorites' ? favs : later).filter((s) => s !== slug);
    write(key, next);
    setter(next);
  };

  const saveNote = (slug: string, value: string) => {
    const next = { ...notes, [slug]: value };
    setNotes(next);
    write('tdl:notes', next);
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'fav', label: 'Favoris', count: favs.length },
    { id: 'later', label: 'À lire plus tard', count: later.length },
    { id: 'history', label: 'Historique de lecture', count: history.length },
  ];

  const renderRow = (slug: string, opts?: { note?: boolean; onRemove?: () => void; historyTitle?: string; at?: string }) => {
    const book = bookBySlug.get(slug);
    const title = opts?.historyTitle ?? book?.title ?? slug;
    return (
      <div key={slug} className="card flex gap-4 p-4">
        {book ? (
          <Link href={`/livre/${slug}`} className="w-16 shrink-0">
            <CoverArt seed={book.slug} title={book.title} authorName={authorName(book.authorId)} color={book.coverColor} className="aspect-[2/3] w-full rounded" />
          </Link>
        ) : (
          <span className="flex w-16 shrink-0 items-center justify-center rounded bg-[var(--surface-soft)] text-xs text-[var(--ink-soft)]">PDF</span>
        )}
        <div className="min-w-0 flex-1">
          <Link href={`/livre/${slug}`} className="font-semibold hover:text-tchad-blue-600 dark:hover:text-tchad-gold-300">{title}</Link>
          <p className="text-xs text-[var(--ink-soft)]">{book ? authorName(book.authorId) : 'Fichier importé hors catalogue'}{opts?.at ? ` · lu le ${new Date(opts.at).toLocaleDateString('fr-FR')}` : ''}</p>
          {opts?.note && (
            <textarea
              className="input mt-2 min-h-16 text-xs"
              placeholder="Vos notes sur ce livre…"
              value={notes[slug] ?? ''}
              onChange={(e) => saveNote(slug, e.target.value)}
            />
          )}
        </div>
        {opts?.onRemove && (
          <button type="button" onClick={opts.onRemove} className="btn-outline !p-2 text-xs" aria-label="Retirer">
            <IconTrash width={14} height={14} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="section-title">Ma bibliothèque</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">
        Vos favoris, votre liste de lecture et votre historique sont conservés sur cet appareil. La synchronisation entre appareils sera proposée avec le compte lecteur (Supabase Auth).
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={tab === t.id ? 'btn-primary !text-xs' : 'btn-outline !text-xs'}
          >
            {t.id === 'fav' && <IconStar width={13} height={13} />}
            {t.id === 'later' && <IconNote width={13} height={13} />}
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {tab === 'fav' && (favs.length === 0 ? <Empty text="Aucun favori. Touchez « Ajouter aux favoris » sur une fiche livre." /> : favs.map((s) => renderRow(s, { note: true, onRemove: () => remove('tdl:favorites', setFavs, s) })))}
        {tab === 'later' && (later.length === 0 ? <Empty text="Votre liste « À lire plus tard » est vide." /> : later.map((s) => renderRow(s, { onRemove: () => remove('tdl:later', setLater, s) })))}
        {tab === 'history' && (history.length === 0 ? <Empty text="Vos dernières lectures apparaîtront ici." /> : history.map((h) => renderRow(h.slug, { historyTitle: h.title, at: h.at })))}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="card p-10 text-center text-sm text-[var(--ink-soft)]">{text}</div>;
}
