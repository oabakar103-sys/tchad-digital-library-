import BookCard from '@/components/BookCard';
import type { Author, Book, Category } from '@/types';

interface Props {
  books: Book[];
  authors: Author[];
  categories: Category[];
  emptyLabel?: string;
}

export default function BookGrid({ books, authors, categories, emptyLabel = 'Aucun livre trouvé pour ces critères.' }: Props) {
  if (books.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 p-12 text-center">
        <p className="text-lg font-semibold">Aucun résultat</p>
        <p className="text-sm text-[var(--ink-soft)]">{emptyLabel}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          author={authors.find((a) => a.id === book.authorId) ?? null}
          category={categories.find((c) => c.id === book.categoryId) ?? null}
        />
      ))}
    </div>
  );
}
