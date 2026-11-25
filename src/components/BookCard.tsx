import Link from 'next/link';
import CoverArt from '@/components/CoverArt';
import Rating from '@/components/Rating';
import { IconDownload, IconEye } from '@/components/icons';
import { formatFileSize, formatNumber } from '@/lib/utils';
import type { Author, Book, Category } from '@/types';

interface Props {
  book: Book;
  author?: Author | null;
  category?: Category | null;
}

export default function BookCard({ book, author, category }: Props) {
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/livre/${book.slug}`} className="relative block">
        <CoverArt
          seed={book.slug}
          title={book.title}
          authorName={author?.name ?? 'Auteur inconnu'}
          color={book.coverColor}
          categoryName={category?.name}
          pages={book.pages}
          className="aspect-[2/3] w-full object-cover"
        />
        {book.featured && (
          <span className="chip absolute left-3 top-3 bg-tchad-gold-400 text-tchad-blue-950">À la une</span>
        )}
        {book.isNew && (
          <span className="chip absolute right-3 top-3 bg-tchad-red-500 text-white">Nouveau</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/livre/${book.slug}`} className="font-serif text-base font-bold leading-snug hover:text-tchad-blue-600 dark:hover:text-tchad-gold-300">
          {book.title}
        </Link>
        <p className="text-xs text-[var(--ink-soft)]">{author?.name ?? 'Auteur inconnu'} · {book.year}</p>
        <Rating rating={book.rating} count={book.ratingCount} />
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-[var(--ink-soft)]">
          <span className="inline-flex items-center gap-1"><IconDownload width={13} height={13} /> {formatNumber(book.downloads)}</span>
          <span className="inline-flex items-center gap-1"><IconEye width={13} height={13} /> {formatNumber(book.views)}</span>
          <span>{formatFileSize(book.fileSizeKb)}</span>
        </div>
      </div>
    </article>
  );
}
