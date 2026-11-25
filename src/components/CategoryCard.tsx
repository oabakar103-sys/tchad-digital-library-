import Link from 'next/link';
import type { Category } from '@/types';

interface Props {
  category: Category;
  count?: number;
}

export default function CategoryCard({ category, count }: Props) {
  const total = count ?? category.bookCount ?? 0;
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="card group flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white"
        style={{ backgroundColor: category.color }}
        aria-hidden
      >
        <span className="font-serif text-lg font-bold">{category.name.charAt(0)}</span>
      </span>
      <span className="font-semibold">{category.name}</span>
      <span className="text-xs text-[var(--ink-soft)] line-clamp-2">{category.description}</span>
      <span className="mt-auto text-xs font-medium" style={{ color: category.color }}>
        {total} livre{total > 1 ? 's' : ''}
      </span>
    </Link>
  );
}
