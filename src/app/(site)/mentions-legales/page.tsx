import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Mentions légales & droits d\u2019auteur',
  description: 'Éditeur, hébergement, propriété intellectuelle, données personnelles et conditions d\u2019utilisation de Tchad Digital Library.',
  path: '/mentions-legales',
});

const sections = [
  {
    title: '1. Éditeur du site',
    body: [
      'Le site « Tchad Digital Library » est publié par l\u2019association/équipe de portage du projet bibliothèque numérique francophone dédiée au Tchad et à sa diaspora (adresse : N\u2019Djaména, Tchad — BP 11 456 ; e-mail : contact@tchaddigitallibrary.org).',
      'Directeur de la publication : responsable éditorial désigné par l\u2019équipe de gouvernance. Le site est une œuvre collective ; chaque fiche livre indique son auteur et ses conditions de diffusion.',
    ],
  },
  {
    title: '2. Hébergement',
    body: [
      'Application déployée sur Vercel (serverless, région configurable) ; base de données PostgreSQL et stockage des fichiers PDF sur Supabase (équivalent : AWS S3). Les sauvegardes sont quotidiennes et chiffrées en transit (HTTPS/TLS).',
      'Les fichiers PDF sont placés dans un bucket privé ; les accès de téléchargement passent par des URL signées à durée limitée, ce qui limite le lien direct et le partage non maîtrisé.',
    ],
  },
  {
    title: '3. Propriété intellectuelle et droits d\u2019auteur',
    body: [
      'Les livres publiés relèvent de trois régimes : (a) dépôt autorisé par l\u2019auteur ou ses ayants droit ; (b) licences libres (Creative Commons et licences équivalentes) ; (c) domaines publics ou textes pédagogiques fournis par des partenaires institutionnels.',
      'Toute reproduction hors du site, toute revente ou toute modification d\u2019un ouvrage protégé est interdite sans accord écrit des détenteurs des droits. Les marques, couvertures originales et logos appartiennent à leurs auteurs respectifs.',
      'Signalement : toute personne estimant qu\u2019un fichier porte atteinte à ses droits peut écrire à contact@tchaddigitallibrary.org ; le document est retiré sans délai le temps de l\u2019instruction.',
    ],
  },
  {
    title: '4. Données personnelles',
    body: [
      'Les données collectées (formulaire de contact, compte lecteur, favoris et historique) servent exclusivement au fonctionnement du service : réponse aux messages, personnalisation de la lecture, modération des avis.',
      'Conformément aux principes RGPD et aux législations nationales applicables, vous disposez d\u2019un droit d\u2019accès, de rectification, d\u2019effacement et d\u2019opposition : exercez-le par e-mail à contact@tchaddigitallibrary.org. Les messages de contact sont conservés 24 mois ; les comptes supprimés sont anonymisés.',
      'Aucune publicité ciblée, aucune revente de données à des tiers. Les avis publiés sont modérés avant mise en ligne.',
    ],
  },
  {
    title: '5. Cookies et application (PWA)',
    body: [
      'Le site utilise uniquement des cookies techniques : préférence d\u2019affichage (clair/sombre), session administrateur, jeton de mesure de fréquentation anonymisé. L\u2019application installée (PWA) met en cache les pages et permet la lecture hors ligne des PDF téléchargés ; aucun traceur publicitaire n\u2019est inclus.',
    ],
  },
  {
    title: '6. Sécurité et responsabilité',
    body: [
      'L\u2019administration est protégée par authentification, rôles limités (super admin, éditeur), en-têtes de sécurité (CSP, X-Frame-Options, Referrer-Policy) et limitation de débit sur les téléchargements et le formulaire de contact.',
      'La bibliothèque ne garantit pas l\u2019exhaustivité absolue des contenus : les fiches sont corrigées à mesure des signalements. Les liens externes et contenus de tiers engagent la responsabilité de leurs éditeurs.',
    ],
  },
  {
    title: '7. Code source',
    body: [
      'Le code de la plateforme est distribué sous licence libre (MIT) dans son projet dédié. Les contenus littéraires restent soumis aux droits propres à chaque ouvrage et ne sont pas couverts par cette licence.',
    ],
  },
];

export default function MentionsLegalesPage() {
  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="section-title">Mentions légales & droits d\u2019auteur</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">Dernière mise à jour : novembre 2026.</p>
      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-serif text-lg font-bold">{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{p}</p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
