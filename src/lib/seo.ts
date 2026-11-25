import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';
import type { Author, Book, Category } from '@/types';

export function pageMeta(opts: { title?: string; description?: string; path?: string; type?: 'website' | 'article' }): Metadata {
  const title = opts.title
    ? opts.title.includes(SITE.name)
      ? opts.title
      : `${opts.title} — ${SITE.name}`
    : `${SITE.name} — ${SITE.description}`;
  const description =
    opts.description ??
    "Bibliothèque numérique francophone du Tchad et de la diaspora : livres PDF à lire en ligne et à télécharger.";
  const url = `${SITE.url}${opts.path ?? '/'}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: 'fr_FR',
      type: opts.type ?? 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function bookJsonLd(book: Book, author: Author | null, category: Category | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    url: `${SITE.url}/livre/${book.slug}`,
    author: author ? { '@type': 'Person', name: author.name, nationality: author.country } : undefined,
    genre: category?.name,
    datePublished: String(book.year),
    numberOfPages: book.pages,
    inLanguage: 'fr',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: book.rating,
      reviewCount: book.ratingCount,
    },
    description: book.summary,
  };
}
