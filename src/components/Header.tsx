'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { IconClose, IconMenu } from '@/components/icons';
import { NAV_LINKS } from '@/lib/constants';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--surface)]/85 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" onClick={() => setOpen(false)} aria-label="Accueil">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-tchad-blue-50 text-tchad-blue-700 dark:bg-tchad-blue-900/60 dark:text-tchad-gold-200'
                    : 'text-[var(--ink-soft)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/bibliotheque" className="btn-outline hidden sm:inline-flex !py-2 text-xs">
            Ma bibliothèque
          </Link>
          <Link href="/admin/login" className="btn-primary hidden sm:inline-flex !py-2 text-xs">
            Espace admin
          </Link>
          <button
            type="button"
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)]"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-[var(--line)] px-4 py-3 space-y-1" aria-label="Menu mobile">
          {NAV_LINKS.map((link) => (
            <button key={link.href} onClick={() => go(link.href)} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-[var(--surface-soft)]">
              {link.label}
            </button>
          ))}
          <div className="flex gap-2 pt-2">
            <button onClick={() => go('/bibliotheque')} className="btn-outline flex-1 text-xs">Ma bibliothèque</button>
            <button onClick={() => go('/admin/login')} className="btn-primary flex-1 text-xs">Espace admin</button>
          </div>
        </nav>
      )}
    </header>
  );
}
