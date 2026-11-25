import Link from 'next/link';
import { getSiteSettings, getPublicStats } from '@/lib/store';
import { pageMeta } from '@/lib/seo';
import { IconBook, IconUsers, IconEye, IconFlag } from '@/components/icons';

export const metadata = pageMeta({
  title: 'À propos',
  description: 'La mission de Tchad Digital Library : rendre le savoir francophone accessible à tous, au Tchad et dans la diaspora.',
  path: '/a-propos',
});
export const dynamic = 'force-dynamic';

const VALUES = [
  { icon: IconBook, title: 'Accès libre et gratuit', text: 'Des ouvrages consultables sans compte obligatoire, conçus pour les connexions modestes : pages légères, couvertures optimisées, pagination.' },
  { icon: IconFlag, title: 'Mémoire tchadienne', text: 'Une place centrale pour les auteurs tchadiens, les ouvrages de référence nationale et la transmission du patrimoine écrit local.' },
  { icon: IconEye, title: 'Lecture mobile d\u2019abord', text: 'Lecteur intégré, mode hors ligne, installation de l\u2019application sur le téléphone : la bibliothèque suit le lecteur, partout.' },
  { icon: IconUsers, title: 'Communauté contributive', text: 'Auteurs, enseignants, bibliothécaires et lecteurs enrichissent ensemble le catalogue : dépôt simple, relecture éditoriale, droits respectés.' },
];

export default async function AProposPage() {
  const settings = await getSiteSettings();
  const stats = await getPublicStats();

  return (
    <div className="container-x py-10">
      <header className="max-w-3xl">
        <h1 className="section-title">{settings.aboutTitle}</h1>
        <p className="mt-4 leading-relaxed text-[var(--ink-soft)]">{settings.aboutText}</p>
      </header>

      <section className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Livres', value: stats.books },
          { label: 'Téléchargements', value: stats.downloads },
          { label: 'Lecteurs', value: stats.readers },
          { label: 'Auteurs', value: stats.authors },
        ].map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <p className="font-serif text-2xl font-bold text-tchad-blue-700 dark:text-tchad-gold-300">{s.value.toLocaleString('fr-FR')}</p>
            <p className="mt-1 text-xs text-[var(--ink-soft)]">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="section-title mb-6">Nos principes</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="card flex gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tchad-blue-50 text-tchad-blue-700 dark:bg-tchad-blue-900/50 dark:text-tchad-gold-200">
                <v.icon width={20} height={20} />
              </span>
              <div>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--ink-soft)]">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 card bg-tchad-blue-800 p-8 text-white sm:p-10">
        <h2 className="font-serif text-2xl font-bold">Participez au projet</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-tchad-blue-100">{settings.contributionText}</p>
        <Link href="/contact" className="btn-gold mt-6">Nous écrire</Link>
      </section>
    </div>
  );
}
