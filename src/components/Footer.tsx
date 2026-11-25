import Link from 'next/link';
import Logo from '@/components/Logo';
import { IconFacebook, IconWhatsapp, IconChart } from '@/components/icons';
import { getSiteSettings, listCategories } from '@/lib/store';

export default async function Footer() {
  const settings = await getSiteSettings();
  const categories = await listCategories(false);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-[var(--line)] bg-[var(--surface-soft)]">
      <div className="container-x grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">
            {settings.tagline}. Des livres francophones accessibles à tous, même sur faible connexion.
          </p>
          <div className="mt-4 flex gap-2">
            <a href={settings.social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-tchad-blue-600 text-white hover:bg-tchad-blue-700">
              <IconWhatsapp width={18} height={18} />
            </a>
            <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-tchad-blue-600 text-white hover:bg-tchad-blue-700">
              <IconFacebook width={18} height={18} />
            </a>
            <a href="/faq" aria-label="Aide" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-tchad-blue-600 text-white hover:bg-tchad-blue-700">
              <IconChart width={18} height={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--ink)]">Navigation</h3>
          <ul className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
            <li><Link href="/catalogue">Catalogue</Link></li>
            <li><Link href="/categories">Catégories</Link></li>
            <li><Link href="/a-propos">À propos</Link></li>
            <li><Link href="/contact">Proposer un livre</Link></li>
            <li><Link href="/faq">Questions fréquentes</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--ink)]">Catégories</h3>
          <ul className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/categories/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--ink)]">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
            <li>{settings.contactAddress}</li>
            <li><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></li>
            <li><a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`}>{settings.contactPhone}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--line)]">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-[var(--ink-soft)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {settings.siteName} — Tous droits des auteurs respectés. Livres diffusés avec autorisation ou dans le respect des licences libres.</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/contact">Droits d'auteur</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
