import { notFound } from 'next/navigation';
import { getCategoryBySlug, listAuthors, listBooks } from '@/lib/store';
import BookGrid from '@/components/BookGrid';
import Pagination from '@/components/Pagination';
import { pageMeta } from '@/lib/seo';
import { PER_PAGE } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return pageMeta({ title: 'Catégorie introuvable', path: `/categories/${slug}` });
  return pageMeta({ title: category.name, description: category.description, path: `/categories/${slug}` });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page = Math.max(1, Number(sp.page) || 1);
  const [result, authors] = await Promise.all([
    listBooks({ category: category.id, page, perPage: PER_PAGE, sort: 'popular' }),
    listAuthors(false),
  ]);
  const categories = [category];

  return (
    <div className="container-x py-10">
      <header className="mb-8 flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-serif text-2xl font-bold text-white" style={{ backgroundColor: category.color }}>
          {category.name.charAt(0)}
        </span>
        <div>
          <h1 className="section-title">{category.name}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--ink-soft)]">{category.description}</p>
        </div>
      </header>
      <BookGrid books={result.items} authors={authors} categories={categories} />
      <Pagination page={result.page} totalPages={result.totalPages} base={`/categories/${slug}`} params={{}} />
    </div>
  );
}
