import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBookBySlug, getSimilarBooks, listAuthors, listCategories } from '@/lib/store';
import CoverArt from '@/components/CoverArt';
import Rating from '@/components/Rating';
import BookGrid from '@/components/BookGrid';
import ShareButtons from '@/components/ShareButtons';
import BookShelfButtons from '@/components/BookShelfButtons';
import { IconDownload, IconEye, IconRead } from '@/components/icons';
import { bookJsonLd, pageMeta } from '@/lib/seo';
import { formatDate, formatFileSize, formatNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return pageMeta({ title: 'Livre introuvable', path: `/livre/${slug}` });
  return pageMeta({ title: book.title, description: book.summary.slice(0, 160), path: `/livre/${slug}`, type: 'article' });
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  const [authors, categories, similar] = await Promise.all([listAuthors(false), listCategories(false), getSimilarBooks(book)]);
  const author = authors.find((a) => a.id === book.authorId) ?? null;
  const category = categories.find((c) => c.id === book.categoryId) ?? null;
  const jsonLd = bookJsonLd(book, author, category);

  return (
    <div className="container-x py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-xs text-[var(--ink-soft)]">
        <Link href="/" className="hover:underline">Accueil</Link>
        <span className="mx-1">/</span>
        <Link href="/catalogue" className="hover:underline">Catalogue</Link>
        {category && (
          <>
            <span className="mx-1">/</span>
            <Link href={`/categories/${category.slug}`} className="hover:underline">{category.name}</Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div>
          <CoverArt
            seed={book.slug}
            title={book.title}
            authorName={author?.name ?? ''}
            color={book.coverColor}
            categoryName={category?.name}
            pages={book.pages}
            className="w-full rounded-xl shadow-soft"
          />
          <div className="mt-4 flex flex-col gap-2">
            <Link href={`/lire/${book.slug}`} className="btn-primary w-full">
              <IconRead width={16} height={16} /> Lire en ligne
            </Link>
            <a href={`/api/download/${book.slug}`} className="btn-gold w-full">
              <IconDownload width={16} height={16} /> Télécharger le PDF
            </a>
            <BookShelfButtons slug={book.slug} className="!flex-col !items-stretch" />
          </div>
        </div>

        <div>
          {category && (
            <Link href={`/categories/${category.slug}`}>
              <span className="chip mb-3" style={{ backgroundColor: `${category.color}1a`, color: category.color }}>
                {category.name}
              </span>
            </Link>
          )}
          <h1 className="font-serif text-3xl font-bold leading-tight">{book.title}</h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            par <span className="font-semibold text-[var(--ink)]">{author?.name ?? 'Auteur inconnu'}</span>
            {author?.country ? ` · ${author.country}` : ''} · {book.year}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Rating rating={book.rating} count={book.ratingCount} size={16} />
            <span className="inline-flex items-center gap-1 text-xs text-[var(--ink-soft)]"><IconDownload width={13} height={13} /> {formatNumber(book.downloads)} téléchargements</span>
            <span className="inline-flex items-center gap-1 text-xs text-[var(--ink-soft)]"><IconEye width={13} height={13} /> {formatNumber(book.views)} vues</span>
          </div>

          <h2 className="mt-8 text-lg font-semibold">Résumé</h2>
          <p className="mt-2 leading-relaxed text-[var(--ink-soft)]">{book.summary}</p>

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Pages', value: String(book.pages) },
              { label: 'Fichier', value: formatFileSize(book.fileSizeKb) },
              { label: 'Langue', value: book.language },
              { label: 'Année', value: String(book.year) },
            ].map((d) => (
              <div key={d.label} className="card p-3">
                <dt className="text-[11px] uppercase tracking-wide text-[var(--ink-soft)]">{d.label}</dt>
                <dd className="mt-1 text-sm font-semibold">{d.value}</dd>
              </div>
            ))}
          </dl>

          {book.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {book.tags.map((t) => (
                <Link key={t} href={`/catalogue?q=${encodeURIComponent(t)}`} className="chip bg-[var(--surface-soft)] text-[var(--ink-soft)] hover:underline">
                  #{t}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8">
            <ShareButtons title={book.title} path={`/livre/${book.slug}`} />
          </div>

          <p className="mt-6 text-xs text-[var(--ink-soft)]">
            Ajouté le {formatDate(book.createdAt)}. Droits conservés par l'auteur ; diffusion autorisée par la bibliothèque.
          </p>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="section-title mb-6">Livres similaires</h2>
          <BookGrid books={similar} authors={authors} categories={categories} />
        </section>
      )}
    </div>
  );
}
