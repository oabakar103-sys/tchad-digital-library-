import type { ReactNode } from 'react';
import { formatNumber } from '@/lib/utils';

interface Props {
  label: string;
  value: number;
  icon: ReactNode;
  hint?: string;
  accent?: 'blue' | 'gold' | 'red' | 'green';
}

const accents = {
  blue: 'bg-tchad-blue-50 text-tchad-blue-700 dark:bg-tchad-blue-900/50 dark:text-tchad-gold-200',
  gold: 'bg-tchad-gold-50 text-tchad-gold-800 dark:bg-tchad-gold-900/40 dark:text-tchad-gold-200',
  red: 'bg-tchad-red-50 text-tchad-red-700 dark:bg-tchad-red-900/40 dark:text-tchad-red-200',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200',
};

export default function StatCard({ label, value, icon, hint, accent = 'blue' }: Props) {
  return (
    <div className="card flex items-start gap-4 p-5">
      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${accents[accent]}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-[var(--ink-soft)]">{label}</p>
        <p className="mt-1 font-serif text-2xl font-bold">{formatNumber(value)}</p>
        {hint && <p className="mt-1 text-xs text-[var(--ink-soft)]">{hint}</p>}
      </div>
    </div>
  );
}
