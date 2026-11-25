'use client';

import { useEffect, useRef, useState } from 'react';
import { formatNumber } from '@/lib/utils';

export default function Counter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(Math.round(value * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="text-center">
      <span ref={ref} className="block font-serif text-3xl sm:text-4xl font-bold text-tchad-blue-700 dark:text-tchad-gold-300">
        {formatNumber(display)}{suffix}
      </span>
      <span className="mt-1 block text-xs uppercase tracking-wider text-[var(--ink-soft)] sm:text-sm">{label}</span>
    </div>
  );
}
