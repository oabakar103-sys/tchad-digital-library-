'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.website) return; // honeypot
    if (!form.name || !form.email || !form.message) {
      setError('Merci de renseigner votre nom, votre e-mail et votre message.');
      return;
    }
    setSending(true);
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSending(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Envoi impossible. Réessayez plus tard.');
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="card p-8 text-center">
        <p className="font-serif text-xl font-bold">Message envoyé. Merci !</p>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          L\u2019équipe de la bibliothèque répond généralement sous 48 heures ouvrées. Pour une proposition de livre, joignez si possible le PDF ou une description détaillée.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">Nom complet *</label>
          <input id="c-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="label" htmlFor="c-email">E-mail *</label>
          <input id="c-email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-subject">Sujet</label>
        <select id="c-subject" className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
          <option value="">Choisir un sujet…</option>
          <option>Proposer un livre / un PDF</option>
          <option>Devenir auteur partenaire</option>
          <option>Signaler une erreur ou un lien défaillant</option>
          <option>Question générale</option>
          <option>Partenariat institutionnel (école, bibliothèque, administration)</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="c-message">Message *</label>
        <textarea id="c-message" className="input min-h-36" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
      </div>
      {/* honeypot anti-spam, invisible */}
      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} aria-hidden />
      {error && <p className="rounded-lg bg-tchad-red-50 px-3 py-2 text-sm text-tchad-red-700 dark:bg-tchad-red-900/30 dark:text-tchad-red-200">{error}</p>}
      <button type="submit" disabled={sending} className="btn-primary">{sending ? 'Envoi…' : 'Envoyer le message'}</button>
    </form>
  );
}
