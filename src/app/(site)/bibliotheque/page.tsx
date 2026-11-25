import BibliothequeClient from '@/components/reader/BibliothequeClient';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Ma bibliothèque',
  description: 'Favoris, liste de lecture, historique et notes personnelles du lecteur.',
  path: '/bibliotheque',
});

export default function BibliothequePage() {
  return <BibliothequeClient />;
}
