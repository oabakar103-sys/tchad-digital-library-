'use client';

import { useEffect, useState } from 'react';
import { ROLE_LABELS } from '@/lib/constants';
import type { SiteUser } from '@/types';

export default function UsersManager() {
  const [users, setUsers] = useState<SiteUser[]>([]);

  const load = () =>
    fetch('/api/admin/utilisateurs')
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []));

  useEffect(() => {
    load();
  }, []);

  const toggle = async (u: SiteUser) => {
    const status = u.status === 'active' ? 'banned' : 'active';
    await fetch(`/api/admin/utilisateurs/${u.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-[var(--line)] text-left text-xs uppercase tracking-wide text-[var(--ink-soft)]">
            <th className="p-3">Utilisateur</th>
            <th className="p-3">Rôle</th>
            <th className="p-3">Favoris / À lire</th>
            <th className="p-3">Inscription</th>
            <th className="p-3">Statut</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-[var(--line)]/60">
              <td className="p-3">
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-[var(--ink-soft)]">{u.email}</p>
              </td>
              <td className="p-3"><span className="chip bg-tchad-blue-50 text-tchad-blue-700 dark:bg-tchad-blue-900/50 dark:text-tchad-gold-200">{ROLE_LABELS[u.role] ?? u.role}</span></td>
              <td className="p-3 text-xs text-[var(--ink-soft)]">{u.favorites.length} / {u.later.length}</td>
              <td className="p-3 text-xs text-[var(--ink-soft)]">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
              <td className="p-3">
                <span className={`chip ${u.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' : 'bg-tchad-red-50 text-tchad-red-700 dark:bg-tchad-red-900/30 dark:text-tchad-red-200'}`}>
                  {u.status === 'active' ? 'Actif' : 'Bloqué'}
                </span>
              </td>
              <td className="p-3 text-right">
                {u.role !== 'super_admin' && (
                  <button type="button" onClick={() => toggle(u)} className={u.status === 'active' ? 'btn-outline !px-2.5 !py-1 text-xs text-tchad-red-600' : 'btn-primary !px-2.5 !py-1 text-xs'}>
                    {u.status === 'active' ? 'Bloquer' : 'Réactiver'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
