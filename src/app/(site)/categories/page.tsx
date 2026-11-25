import { listCategories } from '@/lib/store';
import CategoryCard from '@/components/CategoryCard';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ title: 'Catégories', description: 'Toutes les thématiques de la bibliothèque : littérature, droit, sciences, éducation, jeunesse…', path: '/categories' });
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await listCategories(true);
  return (
    <div className="container-x py-10">
      <h1 className="section-title">Catégories du catalogue</h1>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">Parcourez le savoir par thématique, du roman jeunesse au droit et aux sciences appliquées.</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
