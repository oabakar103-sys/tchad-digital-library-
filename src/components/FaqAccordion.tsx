'use client';

import { useState } from 'react';
import { IconChevronDown } from '@/components/icons';

export interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const active = open === i;
        return (
          <div key={i} className="card overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(active ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium"
              aria-expanded={active}
            >
              <span>{item.q}</span>
              <IconChevronDown className={`shrink-0 transition-transform ${active ? 'rotate-180' : ''}`} />
            </button>
            {active && <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--ink-soft)]">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
