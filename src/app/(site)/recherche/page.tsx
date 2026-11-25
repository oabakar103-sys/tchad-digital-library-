import { listAuthors, listBooks, listCategories } from '@/lib/store';
import BookGrid from '@/components/BookGrid';
import SearchBar from '@/components/SearchBar';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ title: 'Recherche', description: 'Recherchez par titre, auteur ou mot-clé.', path: '/recherche' });
export const dynamic = 'force-dynamic';

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? '').trim();
  const [result, authors, categories] = await Promise.all([
    listBooks({ q, perPage: 24 }),
    listAuthors(false),
    listCategories(false),
  ]);

  return (
    <div className="container-x py-10">
      <h1 className="section-title">Recherche</h1>
      <div className="mt-4 max-w-2xl">
        <SearchBar initial={q} />
      </div>

      {q ? (
        <div className="mt-8">
          <p className="mb-4 text-sm text-[var(--ink-soft)]">
            {result.total} résultat{result.total > 1 ? 's' : ''} pour « <strong className="text-[var(--ink)]">{q}</strong> ».
          </p>
          <BookGrid books={result.items} authors={authors} categories={categories} emptyLabel="Essayez un autre titre, un nom d'auteur ou un mot-clé (ex. : sorgho, droit, poésie)." />
        </div>
      ) : (
        <p className="mt-8 text-sm text-[var(--ink-soft)]">Tapez au moins un mot pour lancer la recherche intelligente (titre, auteur, résumé, mots-clés).</p>
      )}
    </div>
  );
}
