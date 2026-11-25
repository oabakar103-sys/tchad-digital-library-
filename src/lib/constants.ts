export const SITE = {
  name: 'Tchad Digital Library',
  shortName: 'TDL',
  description:
    "Bibliothèque en ligne francophone dédiée au Tchad et à sa diaspora : romans, histoire, droit, sciences, éducation et jeunesse en PDF.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'fr-FR',
  author: 'Tchad Digital Library',
};

export const SLOGANS_FALLBACK = [
  'Le Tchad lit. Le monde découvre.',
  'Mille livres, un seul clic.',
  'Lire, c\u2019est semer pour demain.',
  'Un peuple qui lit est un peuple qui avance.',
  'Votre bibliothèque, partout, tout le temps.',
  'Du baobab aux pages : le savoir sans frontières.',
  'Le savoir n\u2019a pas de frontières, ouvrez la porte.',
];

export const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/categories', label: 'Catégories' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
];

export const PER_PAGE = 12;

// Comptes de démonstration (MODE DEMO, sans Supabase Auth).
// En production, ces comptes proviennent de Supabase Auth (ou NextAuth) avec
// mots de passe hashés et rôles gérés en base. Voir README section « Sécurité ».
export const DEMO_ADMINS = [
  {
    email: 'superadmin@tchaddigital.td',
    password: 'Admin@2026',
    name: 'Super Administrateur',
    role: 'super_admin' as const,
  },
  {
    email: 'editeur@tchaddigital.td',
    password: 'Editeur@2026',
    name: 'Éditeur Catalogue',
    role: 'editor' as const,
  },
];

export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super admin',
  editor: 'Éditeur',
  reader: 'Lecteur',
};
