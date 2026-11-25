'use client';

import { useEffect, useState } from 'react';
import type { ContactMessage } from '@/types';

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  new: { label: 'Nouveau', cls: 'bg-tchad-red-50 text-tchad-red-700 dark:bg-tchad-red-900/30 dark:text-tchad-red-200' },
  read: { label: 'Lu', cls: 'bg-tchad-gold-50 text-tchad-gold-800 dark:bg-tchad-gold-900/30 dark:text-tchad-gold-200' },
  replied: { label: 'Répondu', cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' },
};

export default function MessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  const load = () =>
    fetch('/api/admin/messages')
      .then((r) => r.json())
      .then((d) => setMessages(d.messages ?? []));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: ContactMessage['status']) => {
    await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="space-y-3">
      {messages.map((m) => {
        const s = STATUS_LABEL[m.status];
        const expanded = open === m.id;
        return (
          <div key={m.id} className="card p-4">
            <button type="button" onClick={() => setOpen(expanded ? null : m.id)} className="flex w-full flex-wrap items-center justify-between gap-3 text-left">
              <div className="min-w-0">
                <p className="font-medium text-sm">
                  {m.subject}
                  <span className={`chip ml-2 ${s.cls}`}>{s.label}</span>
                </p>
                <p className="text-xs text-[var(--ink-soft)]">{m.name} · {m.email} · {new Date(m.createdAt).toLocaleString('fr-FR')}</p>
              </div>
              <span className="text-xs text-tchad-blue-600 dark:text-tchad-gold-300">{expanded ? 'Fermer' : 'Ouvrir'}</span>
            </button>
            {expanded && (
              <div className="mt-3 border-t border-[var(--line)] pt-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink-soft)]">{m.message}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setStatus(m.id, 'read')} className="btn-outline !px-3 !py-1.5 text-xs">Marquer lu</button>
                  <button type="button" onClick={() => setStatus(m.id, 'replied')} className="btn-primary !px-3 !py-1.5 text-xs">Marquer répondu</button>
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent('Re : ' + m.subject)}`} className="btn-gold !px-3 !py-1.5 text-xs">Répondre par e-mail</a>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {messages.length === 0 && <p className="card p-8 text-center text-sm text-[var(--ink-soft)]">Aucun message.</p>}
    </div>
  );
}
