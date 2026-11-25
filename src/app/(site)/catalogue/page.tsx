import { Suspense } from 'react';
import { listAuthors, listBooks, listCategories } from '@/lib/store';
import CatalogueFilters from '@/components/CatalogueFilters';
import BookGrid from '@/components/BookGrid';
import Pagination from '@/components/Pagination';
import { pageMeta } from '@/lib/seo';
import { PER_PAGE } from '@/lib/constants';

export const metadata = pageMeta({
  title: 'Catalogue',
  description: 'Parcourez tous les livres francophones de la bibliothèque : filtres par catégorie, auteur, année, langue et popularité.',
  path: '/catalogue',
});
export const dynamic = 'force-dynamic';

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const [result, authors, categories, all] = await Promise.all([
    listBooks({
      category: sp.category,
      author: sp.author,
      year: sp.year,
      language: sp.language,
      sort: (sp.sort as 'popular' | 'new' | 'title' | 'rating' | 'year') ?? 'popular',
      q: sp.q,
      page,
      perPage: PER_PAGE,
    }),
    listAuthors(false),
    listCategories(false),
    listBooks({ perPage: 1000 }),
  ]);

  const years = [...new Set(all.items.map((b) => String(b.year)))].sort((a, b) => Number(b) - Number(a));
  const languages = [...new Set(all.items.map((b) => b.language))];

  return (
    <div className="container-x py-10">
      <header className="mb-6">
        <h1 className="section-title">Catalogue de la bibliothèque</h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          {result.total} livre{result.total > 1 ? 's' : ''} disponible{result.total > 1 ? 's' : ''} en lecture en ligne ou en PDF.
        </p>
      </header>

      <Suspense fallback={<div className="card p-4 text-sm text-[var(--ink-soft)]">Chargement des filtres…</div>}>
        <CatalogueFilters
          categories={categories.map((c) => ({ value: c.id, label: c.name }))}
          authors={authors.map((a) => ({ value: a.id, label: a.name }))}
          years={years.map((y) => ({ value: y, label: y }))}
          languages={languages.map((l) => ({ value: l, label: l }))}
        />
      </Suspense>

      <BookGrid books={result.items} authors={authors} categories={categories} />
      <Pagination page={result.page} totalPages={result.totalPages} base="/catalogue" params={sp} />
    </div>
  );
}
