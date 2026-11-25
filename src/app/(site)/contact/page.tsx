import ContactForm from '@/components/ContactForm';
import { getSiteSettings } from '@/lib/store';
import { pageMeta } from '@/lib/seo';
import { IconMessage } from '@/components/icons';

export const metadata = pageMeta({
  title: 'Contact',
  description: 'Proposez un ouvrage, signalez un problème ou échangez avec l\u2019équipe de Tchad Digital Library.',
  path: '/contact',
});
export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <div className="container-x py-10">
      <h1 className="section-title">Contact & propositions de livres</h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--ink-soft)]">
        Vous écrivez, enseignez, numérisez des ouvrages anciens ou représentez une bibliothèque ? Écrivez-nous : chaque proposition est lue par l\u2019équipe éditoriale.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <ContactForm />
        <aside className="card h-fit space-y-4 p-6">
          <h2 className="flex items-center gap-2 font-semibold"><IconMessage width={18} height={18} /> Coordonnées</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="label">E-mail</dt>
              <dd><a className="text-tchad-blue-600 hover:underline dark:text-tchad-gold-300" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></dd>
            </div>
            <div>
              <dt className="label">Téléphone / WhatsApp</dt>
              <dd><a className="text-tchad-blue-600 hover:underline dark:text-tchad-gold-300" href={`tel:${settings.contactPhone.replace(/\s/g, '')}`}>{settings.contactPhone}</a></dd>
            </div>
            <div>
              <dt className="label">Adresse</dt>
              <dd className="text-[var(--ink-soft)]">{settings.contactAddress}</dd>
            </div>
          </dl>
          <div className="rounded-xl bg-[var(--surface-soft)] p-4 text-xs leading-relaxed text-[var(--ink-soft)]">
            <strong className="text-[var(--ink)]">Guide de dépôt :</strong> envoyez le PDF (titre, auteur, résumé, année, catégorie visée). Nous vérifions les droits, préparons la couverture et publions ou renvoyons nos questions.
          </div>
        </aside>
      </div>
    </div>
  );
}
