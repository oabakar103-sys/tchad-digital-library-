import Link from 'next/link';
import { IconArrowRight, IconChevronDown } from '@/components/icons';

interface Props {
  page: number;
  totalPages: number;
  base: string;
  params?: Record<string, string | undefined>;
}

export default function Pagination({ page, totalPages, base, params = {} }: Props) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const url = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v && k !== 'page') url.set(k, v);
    });
    url.set('page', String(p));
    return `${base}?${url.toString()}`;
  };

  const pages: number[] = [];
  for (let p = Math.max(1, page - 2); p <= Math.min(totalPages, page + 2); p++) pages.push(p);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} className="btn-outline !px-3 !py-1.5 text-xs" aria-label="Page précédente">
          Précédent
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          aria-current={p === page ? 'page' : undefined}
          className={
            p === page
              ? 'inline-flex h-9 w-9 items-center justify-center rounded-lg bg-tchad-blue-600 text-white text-sm font-semibold'
              : 'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] text-sm hover:bg-[var(--surface-soft)]'
          }
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={hrefFor(page + 1)} className="btn-outline !px-3 !py-1.5 text-xs" aria-label="Page suivante">
          Suivant
          <IconArrowRight width={13} height={13} />
        </Link>
      )}
    </nav>
  );
}
