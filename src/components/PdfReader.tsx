'use client';

import { useEffect, useRef, useState } from 'react';
import type { Author, Book, Category } from '@/types';
import { formatFileSize } from '@/lib/utils';
import { IconDownload, IconEye, IconFilePdf } from '@/components/icons';

interface Props {
  book: Book;
  author: Author | null;
  category: Category | null;
}

const DEMO_PAGES = 9;

export default function PdfReader({ book, author, category }: Props) {
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const frameRef = useRef<HTMLDivElement>(null);

  const total = book.pdfUrl ? book.pages : Math.min(DEMO_PAGES, Math.max(5, Math.round(book.pages / 18)));
  const go = (p: number) => setPage(Math.min(total, Math.max(1, p)));

  // Historique de lecture local (reprise dans « Ma bibliothèque »)
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('tdl:history') ?? '[]') as Array<{ slug: string; title: string; at: string }>;
      const next = [
        { slug: book.slug, title: book.title, at: new Date().toISOString() },
        ...raw.filter((h) => h.slug !== book.slug),
      ].slice(0, 20);
      localStorage.setItem('tdl:history', JSON.stringify(next));
    } catch {
      /* stockage indisponible */
    }
  }, [book.slug, book.title]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) frameRef.current?.requestFullscreen?.();
    else document.exitFullscreen();
  };

  const paragraphs = [book.summary, 'Ce texte de démonstration illustre la mise en page du lecteur intégré. En production, chaque page provient du fichier PDF réel stocké dans Supabase Storage et affiché avec le moteur pdf.js (zoom, navigation par page, pleine écran).', 'Les ouvrages sont optimisés pour la lecture mobile : couverture compressée, texte sélectionnable, progression de lecture mémorisée dans le navigateur pour reprendre la lecture où l\u2019on s\u2019est arrêté.'];

  return (
    <div ref={frameRef} className="mx-auto max-w-4xl">
      <div className="card sticky top-16 z-20 flex flex-wrap items-center gap-2 p-3">
        <button type="button" onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))} className="btn-outline !px-3 !py-1.5 text-xs" aria-label="Réduire le zoom">−</button>
        <span className="w-14 text-center text-xs font-semibold">{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => setZoom((z) => Math.min(2, z + 0.15))} className="btn-outline !px-3 !py-1.5 text-xs" aria-label="Augmenter le zoom">+</button>

        <span className="mx-1 hidden h-6 w-px bg-[var(--line)] sm:block" />

        <button type="button" onClick={() => go(page - 1)} disabled={page <= 1} className="btn-outline !px-3 !py-1.5 text-xs">Préc.</button>
        <span className="text-xs tabular-nums">
          Page <input value={page} onChange={(e) => go(Number(e.target.value))} className="w-12 rounded border border-[var(--line)] px-1 py-0.5 text-center text-xs" /> / {total}
        </span>
        <button type="button" onClick={() => go(page + 1)} disabled={page >= total} className="btn-outline !px-3 !py-1.5 text-xs">Suiv.</button>

        <span className="mx-1 hidden h-6 w-px bg-[var(--line)] sm:block" />

        <button type="button" onClick={toggleFullscreen} className="btn-outline !px-3 !py-1.5 text-xs">Plein écran</button>
        <a href={`/api/download/${book.slug}`} className="btn-primary !px-3 !py-1.5 text-xs">
          <IconDownload width={13} height={13} /> Télécharger
        </a>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl bg-[#d8d2c2] p-3 sm:p-6">
        {book.pdfUrl ? (
          <iframe
            src={`${book.pdfUrl}#page=${page}&zoom=${Math.round(zoom * 100)}`}
            title={`Lecture de ${book.title}`}
            className="min-h-[70vh] w-full rounded-lg bg-white"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          />
        ) : (
          <article
            className="mx-auto bg-white text-[#1f2937] shadow-soft transition-all"
            style={{ width: `${zoom * 100}%`, maxWidth: `${zoom * 640}px`, minHeight: '62vh' }}
          >
            <header className="border-b border-stone-200 px-8 pb-5 pt-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500">{category?.name ?? 'Livre'}</p>
              <h1 className="mt-2 font-serif text-2xl font-bold text-stone-900">{book.title}</h1>
              <p className="mt-1 text-sm text-stone-600">{author?.name ?? 'Auteur inconnu'} · {book.year}</p>
            </header>
            <div className="space-y-4 px-8 py-6 text-justify text-[15px] leading-7">
              {paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-tchad-blue-700' : ''}>
                  {p}
                </p>
              ))}
              <p className="text-sm italic text-stone-500">— Chapitre {page} sur {total} (aperçu de démonstration)</p>
            </div>
            <footer className="flex items-center justify-between border-t border-stone-200 px-8 py-4 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1"><IconFilePdf width={13} height={13} /> {formatFileSize(book.fileSizeKb)}</span>
              <span>Page {page} / {total}</span>
            </footer>
          </article>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-[var(--ink-soft)]">
        <IconEye width={14} height={14} /> Lecture hors ligne possible après téléchargement du PDF sur votre appareil.
      </div>
    </div>
  );
}
