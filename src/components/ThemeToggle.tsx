'use client';

import { useEffect, useState } from 'react';
import { IconMoon, IconSun } from '@/components/icons';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('tdl-theme', next ? 'dark' : 'light');
    } catch {
      /* stockage indisponible : Ignorer */
    }
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] hover:bg-[var(--surface-soft)] transition ${className}`}
    >
      {dark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
    </button>
  );
}
