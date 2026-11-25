'use client';

import { useState } from 'react';
import type { SiteSettings } from '@/types';

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState({
    siteName: settings.siteName,
    tagline: settings.tagline,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    aboutTitle: settings.aboutTitle,
    aboutText: settings.aboutText,
    contributionText: settings.contributionText,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    contactAddress: settings.contactAddress,
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    whatsapp: settings.social.whatsapp,
    facebook: settings.social.facebook,
    x: settings.social.x,
    youtube: settings.social.youtube,
    maintenanceMode: settings.maintenanceMode,
    slogans: settings.slogans.join('\n'),
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    setError('');
    const payload = {
      siteName: form.siteName,
      tagline: form.tagline,
      heroTitle: form.heroTitle,
      heroSubtitle: form.heroSubtitle,
      aboutTitle: form.aboutTitle,
      aboutText: form.aboutText,
      contributionText: form.contributionText,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      contactAddress: form.contactAddress,
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
      maintenanceMode: form.maintenanceMode,
      slogans: form.slogans.split('\n').map((s) => s.trim()).filter(Boolean),
      social: { whatsapp: form.whatsapp, facebook: form.facebook, x: form.x, youtube: form.youtube },
    };
    const res = await fetch('/api/admin/contenu', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Enregistrement impossible.");
      return;
    }
    setSaved(true);
  };

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
      <div className="card space-y-4 p-5">
        <h3 className="font-semibold">Identité et page d'accueil</h3>
        <div><label className="label">Nom du site</label><input className="input" value={form.siteName} onChange={(e) => set('siteName', e.target.value)} /></div>
        <div><label className="label">Slogan court (tagline)</label><input className="input" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} /></div>
        <div><label className="label">Titre du bandeau principal</label><input className="input" value={form.heroTitle} onChange={(e) => set('heroTitle', e.target.value)} /></div>
        <div><label className="label">Sous-titre du bandeau</label><textarea className="input min-h-20" value={form.heroSubtitle} onChange={(e) => set('heroSubtitle', e.target.value)} /></div>
        <div>
          <label className="label">Slogans en rotation (un par ligne)</label>
          <textarea className="input min-h-36" value={form.slogans} onChange={(e) => set('slogans', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Couleur principale</label><input type="color" className="input !h-10 !p-1" value={form.primaryColor} onChange={(e) => set('primaryColor', e.target.value)} /></div>
          <div><label className="label">Couleur d'accent</label><input type="color" className="input !h-10 !p-1" value={form.secondaryColor} onChange={(e) => set('secondaryColor', e.target.value)} /></div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card space-y-4 p-5">
          <h3 className="font-semibold">Page « À propos » et appel à contribuer</h3>
          <div><label className="label">Titre de la section</label><input className="input" value={form.aboutTitle} onChange={(e) => set('aboutTitle', e.target.value)} /></div>
          <div><label className="label">Texte « À propos »</label><textarea className="input min-h-32" value={form.aboutText} onChange={(e) => set('aboutText', e.target.value)} /></div>
          <div><label className="label">Texte d'appel à contribution</label><textarea className="input min-h-20" value={form.contributionText} onChange={(e) => set('contributionText', e.target.value)} /></div>
        </div>

        <div className="card space-y-4 p-5">
          <h3 className="font-semibold">Contact et réseaux</h3>
          <div><label className="label">E-mail de contact</label><input className="input" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} /></div>
          <div><label className="label">Téléphone</label><input className="input" value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} /></div>
          <div><label className="label">Adresse</label><input className="input" value={form.contactAddress} onChange={(e) => set('contactAddress', e.target.value)} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">WhatsApp</label><input className="input" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} /></div>
            <div><label className="label">Facebook</label><input className="input" value={form.facebook} onChange={(e) => set('facebook', e.target.value)} /></div>
            <div><label className="label">X (Twitter)</label><input className="input" value={form.x} onChange={(e) => set('x', e.target.value)} /></div>
            <div><label className="label">YouTube</label><input className="input" value={form.youtube} onChange={(e) => set('youtube', e.target.value)} /></div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.maintenanceMode} onChange={(e) => set('maintenanceMode', e.target.checked)} />
            Activer le mode maintenance (site public masqué)
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-primary" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer le contenu'}</button>
          {saved && <span className="text-sm text-emerald-700 dark:text-emerald-300">Contenu enregistré. Pensez à rafraîchir le site public.</span>}
          {error && <span className="text-sm text-tchad-red-600">{error}</span>}
        </div>
      </div>
    </form>
  );
}
