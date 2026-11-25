import Link from 'next/link';
import { IconArrowRight } from '@/components/icons';

interface Props {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}

export default function SectionHeader({ title, subtitle, href, linkLabel = 'Tout voir' }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[var(--ink-soft)]">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-tchad-blue-600 hover:text-tchad-blue-700 dark:text-tchad-gold-300">
          {linkLabel} <IconArrowRight width={15} height={15} />
        </Link>
      )}
    </div>
  );
}
