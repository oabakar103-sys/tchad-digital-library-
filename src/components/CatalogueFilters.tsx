'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { IconFilter, IconClose } from '@/components/icons';

interface Option {
  value: string;
  label: string;
}

interface Props {
  categories: Option[];
  authors: Option[];
  years: Option[];
  languages: Option[];
}

export default function CatalogueFilters({ categories, authors, years, languages }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    router.push(`/catalogue?${next.toString()}`);
  };

  const reset = () => router.push('/catalogue');

  const selectCls = 'input !py-2 text-xs';
  const labels: Record<string, string> = { category: 'Catégorie', author: 'Auteur', year: 'Année', language: 'Langue', sort: 'Tri' };

  const fields: Array<{ key: string; options: Option[] }> = [
    { key: 'category', options: categories },
    { key: 'author', options: authors },
    { key: 'year', options: years },
    { key: 'language', options: languages },
    {
      key: 'sort',
      options: [
        { value: 'popular', label: 'Les plus téléchargés' },
        { value: 'new', label: 'Nouveautés' },
        { value: 'title', label: 'Titre A → Z' },
        { value: 'rating', label: 'Mieux notés' },
        { value: 'year', label: 'Année récente' },
      ],
    },
  ];

  const activeCount = fields.filter((f) => params.get(f.key)).length;

  return (
    <div className="card mb-6 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <IconFilter width={16} height={16} /> Filtres {activeCount > 0 && `(${activeCount})`}
        </span>
        {activeCount > 0 && (
          <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-xs text-tchad-red-600 hover:underline">
            <IconClose width={13} height={13} /> Réinitialiser
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="label !mb-1">{labels[f.key]}</span>
            <select value={params.get(f.key) ?? ''} onChange={(e) => update(f.key, e.target.value)} className={selectCls}>
              <option value="">Tous</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}
