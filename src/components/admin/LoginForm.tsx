'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { IconLock } from '@/components/icons';

interface DemoCred {
  email: string;
  password: string;
  label: string;
}

export default function LoginForm({ demoMode, demoCreds }: { demoMode: boolean; demoCreds: DemoCred[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? 'Identifiants invalides.');
      return;
    }
    router.push(params.get('from') ?? '/admin');
    router.refresh();
  };

  const fill = (c: DemoCred) => {
    setEmail(c.email);
    setPassword(c.password);
    setError('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface-soft)] p-4">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo />
          <h1 className="mt-2 font-serif text-2xl font-bold">Espace administrateur</h1>
          <p className="text-sm text-[var(--ink-soft)]">Connexion réservée au personnel de la bibliothèque.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Adresse e-mail</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" autoComplete="username" />
          </div>
          <div>
            <label className="label" htmlFor="password">Mot de passe</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" autoComplete="current-password" />
          </div>

          {error && <p className="rounded-lg bg-tchad-red-50 px-3 py-2 text-sm text-tchad-red-700 dark:bg-tchad-red-900/30 dark:text-tchad-red-200">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <IconLock width={15} height={15} /> {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        {demoMode && (
          <div className="mt-6 rounded-xl border border-dashed border-[var(--line)] p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">Comptes de démonstration</p>
            <div className="space-y-2">
              {demoCreds.map((c) => (
                <button key={c.email} type="button" onClick={() => fill(c)} className="block w-full rounded-lg bg-[var(--surface-soft)] px-3 py-2 text-left text-xs hover:bg-tchad-blue-50 dark:hover:bg-tchad-blue-900/40">
                  <span className="font-semibold">{c.label}</span>
                  <span className="block text-[var(--ink-soft)]">{c.email} · {c.password}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
