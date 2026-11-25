'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconSearch } from '@/components/icons';

interface Suggestion {
  type: string;
  label: string;
  href: string;
  sub?: string;
}

export default function SearchBar({
  initial = '',
  large = false,
  autoFocus = false,
}: {
  initial?: string;
  large?: boolean;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [focused, setFocused] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/recherche?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
      } catch {
        setSuggestions([]);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submit = (value?: string) => {
    const query = (value ?? q).trim();
    if (!query) return;
    router.push(`/recherche?q=${encodeURIComponent(query)}`);
    setFocused(false);
  };

  return (
    <div ref={boxRef} className={`relative w-full ${large ? 'max-w-2xl' : 'max-w-md'}`}>
      <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 shadow-soft focus-within:ring-2 focus-within:ring-tchad-gold-400">
        <IconSearch className="shrink-0 text-[var(--ink-soft)]" />
        <input
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder="Rechercher un titre, un auteur, un mot-clé…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--ink-soft)]"
          aria-label="Rechercher dans la bibliothèque"
        />
        <button type="button" onClick={() => submit()} className="btn-gold shrink-0 !rounded-full !px-4 !py-1.5 text-xs">
          Rechercher
        </button>
      </div>

      {focused && suggestions.length > 0 && (
        <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-card)] shadow-soft">
          {suggestions.map((s, i) => (
            <li key={`${s.href}-${i}`}>
              <button
                type="button"
                onClick={() => {
                  router.push(s.href);
                  setFocused(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm hover:bg-[var(--surface-soft)]"
              >
                <span>
                  <span className="font-medium">{s.label}</span>
                  {s.sub && <span className="ml-2 text-xs text-[var(--ink-soft)]">{s.sub}</span>}
                </span>
                <span className="chip bg-tchad-blue-50 text-tchad-blue-700 dark:bg-tchad-blue-900/60 dark:text-tchad-gold-200">{s.type}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
