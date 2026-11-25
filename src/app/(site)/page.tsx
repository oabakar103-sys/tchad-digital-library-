import Link from 'next/link';
import Hero from '@/components/Hero';
import SectionHeader from '@/components/SectionHeader';
import BookGrid from '@/components/BookGrid';
import CategoryCard from '@/components/CategoryCard';
import { IconArrowRight, IconBook } from '@/components/icons';
import { getPublicStats, listAllBooks, listAuthors, listCategories, getSiteSettings } from '@/lib/store';
import { SITE } from '@/lib/constants';

export const metadata = {
  title: { absolute: `${SITE.name} — ${SITE.description}` },
  description: SITE.description,
  alternates: { canonical: '/' },
};
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [settings, stats, allBooks, authors, categories] = await Promise.all([
    getSiteSettings(),
    getPublicStats(),
    listAllBooks(),
    listAuthors(false),
    listCategories(true),
  ]);

  const published = allBooks.filter((b) => b.status === 'published');
  const featured = published.filter((b) => b.featured).slice(0, 4);
  const latest = [...published].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const tchadianAuthors = authors.filter((a) => a.tchadian).slice(0, 6);

  return (
    <>
      <Hero slogans={settings.slogans} title={settings.heroTitle} subtitle={settings.heroSubtitle} stats={stats} />

      <section className="container-x py-12">
        <SectionHeader title="Livres à la une" subtitle="Sélections de l'équipe éditoriale, plébiscitées par les lecteurs." href="/catalogue?sort=popular" />
        <BookGrid books={featured} authors={authors} categories={categories} />
      </section>

      <section className="container-x py-6">
        <SectionHeader title="Dernières nouveautés" subtitle="Les ouvrages récemment ajoutés au catalogue." href="/catalogue?sort=new" linkLabel="Voir les nouveautés" />
        <BookGrid books={latest} authors={authors} categories={categories} />
      </section>

      <section className="container-x py-12">
        <SectionHeader title="Catégories populaires" subtitle="Explorez le catalogue par thème." href="/categories" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="container-x py-6">
        <SectionHeader title="Auteurs tchadiens" subtitle="Plumes du Tchad, du passé à la scène contemporaine." href="/catalogue" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tchadianAuthors.map((a) => (
            <div key={a.id} className="card flex items-start gap-4 p-5">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-serif text-lg font-bold text-white"
                style={{ backgroundColor: a.accentColor }}
                aria-hidden
              >
                {a.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{a.name}</p>
                <p className="text-xs text-[var(--ink-soft)]">{a.country}{a.birthYear ? ` · né(e) ${a.birthYear}` : ''}</p>
                <p className="mt-2 line-clamp-3 text-sm text-[var(--ink-soft)]">{a.bio}</p>
                <p className="mt-2 text-xs font-medium" style={{ color: a.accentColor }}>
                  {a.bookCount ?? 0} livre{(a.bookCount ?? 0) > 1 ? 's' : ''} dans la bibliothèque
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-12">
        <div className="card overflow-hidden bg-tchad-blue-800 p-8 text-white sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <IconBook className="mx-auto mb-4 text-tchad-gold-300" width={36} height={36} />
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">Contribuez à la bibliothèque</h2>
            <p className="mt-3 text-sm leading-relaxed text-tchad-blue-100 sm:text-base">{settings.contributionText}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-gold">
                Proposer un ouvrage <IconArrowRight width={15} height={15} />
              </Link>
              <Link href="/catalogue" className="btn border border-white/30 text-white hover:bg-white/10">
                Parcourir le catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
