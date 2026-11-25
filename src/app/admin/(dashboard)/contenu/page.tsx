import { requireAdmin } from '@/lib/auth';
import { getSiteSettings } from '@/lib/store';
import SettingsForm from '@/components/admin/SettingsForm';

export const metadata = { title: 'Contenu du site', robots: { index: false } };

export default async function AdminContenuPage() {
  await requireAdmin(['super_admin']);
  const settings = await getSiteSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Contenu du site</h1>
        <p className="text-sm text-[var(--ink-soft)]">Slogans, textes d\u2019accueil, couleurs et coordonnées — modifiables sans toucher au code.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
