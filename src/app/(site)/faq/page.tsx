import FaqAccordion, { type FaqItem } from '@/components/FaqAccordion';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Questions fréquentes',
  description: 'Utilisation de la bibliothèque : lecture en ligne, téléchargement PDF, comptes, hors ligne, droits d\u2019auteur et contribution.',
  path: '/faq',
});

const ITEMS: FaqItem[] = [
  {
    q: 'Faut-il créer un compte pour lire des livres ?',
    a: 'Non. Le catalogue, la recherche, la lecture en ligne et le téléchargement des livres publiés sont accessibles sans inscription. Le compte gratuit (optionnel) permet de conserver ses favoris, sa liste « À lire plus tard », son historique de lecture et ses notes.',
  },
  {
    q: 'Comment lire un livre sur mon téléphone à faible débit ?',
    a: 'Ouvrez la fiche du livre et choisissez « Lire en ligne » : le lecteur affiche une page à la fois, avec zoom et navigation. Pour une consultation hors ligne, téléchargez le PDF : les fichiers sont optimisés et la bibliothèque peut s\u2019installer comme application (PWA) sur l\u2019écran d\u2019accueil.',
  },
  {
    q: 'D\u2019où viennent les livres et quels sont les droits ?',
    a: 'Trois sources : œuvres dont l\u2019auteur a confié la diffusion à la bibliothèque, textes sous licence libre (Creative Commons, domaine public) et ouvrages pédagogiques fournis par des partenaires établissements. Chaque fiche précise l\u2019auteur et l\u2019année ; la réutilisation hors site reste soumise aux droits de l\u2019auteur.',
  },
  {
    q: 'Comment proposer un livre ou un PDF ?',
    a: 'Utilisez la page Contact, choisissez « Proposer un livre / un PDF » et joignez le fichier ou décrivez l\u2019ouvrage. L\u2019équipe vérifie les droits, prépare une couverture, rédige le résumé et publie après validation. Les auteurs conservent la propriété de leur texte.',
  },
  {
    q: 'Puis-je signaler un livre illisible ou erroné ?',
    a: 'Oui : depuis la fiche du livre ou via Contact, signalez le titre et le problème (page manquante, lien défaillant, coquille). Les signalements sont traités par l\u2019équipe éditoriale et le fichier est remplacé si nécessaire.',
  },
  {
    q: 'Que deviennent mes favoris et mon historique ?',
    a: 'En mode visiteur, ils sont stockés localement dans votre navigateur (aucune transmission à un serveur). Avec un compte, ils peuvent être synchronisés entre appareils. Vous pouvez effacer ces données à tout moment depuis « Ma bibliothèque ».',
  },
  {
    q: 'Le site fonctionne-t-il sans connexion après installation ?',
    a: 'L\u2019application (PWA) met en cache la structure du site et les pages consultées. Les livres téléchargés en PDF restent lisibles hors ligne via votre lecteur de fichiers ou la bibliothèque de votre appareil.',
  },
  {
    q: 'Comment l\u2019éducation nationale ou une école peut-elle utiliser la bibliothèque ?',
    a: 'Les manuels et ressources pédagogiques sont utilisables en classe et en devoir. Les établissements peuvent écrire via Contact pour un partenariat : collections thématiques, listes de lecture par niveau et supports de téléchargement groupé.',
  },
];

export default function FaqPage() {
  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="section-title">Questions fréquentes</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">Tout ce qu\u2019il faut savoir pour lire, télécharger et contribuer.</p>
      <div className="mt-8">
        <FaqAccordion items={ITEMS} />
      </div>
    </div>
  );
}
