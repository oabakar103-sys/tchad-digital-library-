'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';
import {
  IconChart,
  IconDashboard,
  IconFolder,
  IconHome,
  IconMessage,
  IconNote,
  IconUsers,
  IconBook,
  IconFlag,
} from '@/components/icons';
import type { SessionUser } from '@/lib/auth';
import { ROLE_LABELS } from '@/lib/constants';

const NAV = [
  { href: '/admin', label: 'Tableau de bord', icon: IconDashboard, exact: true },
  { href: '/admin/livres', label: 'Gestion des livres', icon: IconBook },
  { href: '/admin/categories', label: 'Catégories', icon: IconFolder },
  { href: '/admin/auteurs', label: 'Auteurs', icon: IconUsers },
  { href: '/admin/contenu', label: 'Contenu du site', icon: IconFlag },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: IconUsers },
  { href: '/admin/avis', label: 'Avis & modération', icon: IconNote },
  { href: '/admin/messages', label: 'Messages reçus', icon: IconMessage },
];

export default function AdminShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-[var(--line)] bg-[var(--surface-soft)] lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center justify-between gap-3 p-4">
          <Logo withText={false} />
          <div>
            <p className="text-sm font-semibold leading-tight">Administration</p>
            <p className="text-[11px] text-[var(--ink-soft)]">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>
        <nav className="space-y-1 px-3 pb-4">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-tchad-blue-600 text-white'
                    : 'text-[var(--ink-soft)] hover:bg-[var(--surface-card)] hover:text-[var(--ink)]'
                }`}
              >
                <Icon width={17} height={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-2 border-t border-[var(--line)] p-4">
          <Link href="/" className="flex items-center gap-2 text-xs text-[var(--ink-soft)] hover:text-[var(--ink)]">
            <IconHome width={14} height={14} /> Retour au site public
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:px-6">
          <p className="text-sm text-[var(--ink-soft)]">
            Connecté : <span className="font-semibold text-[var(--ink)]">{user.name}</span> ({user.email})
          </p>
          <span className="chip bg-tchad-gold-100 text-tchad-gold-800 dark:bg-tchad-gold-900/40 dark:text-tchad-gold-200">
            <IconChart width={12} height={12} /> Espace sécurisé
          </span>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
