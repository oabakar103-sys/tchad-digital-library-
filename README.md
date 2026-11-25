# Tchad Digital Library

Bibliothèque en ligne **100 % française**, pensée pour le public tchadien et la diaspora :
des milliers de livres francophones en PDF, lus en ligne ou téléchargés, légers même sur
faible connexion, avec mode clair/sombre, PWA installable, lecteur PDF intégré et
espace administrateur complet.

> *« Le Tchad lit. Le monde découvre. »*

---

## 1. Stack technique

| Couche | Choix |
|---|---|
| Framework | **Next.js 15 (App Router, React 19, TypeScript)** |
| Styles | **Tailwind CSS 3** (thème couleurs drapeau tchadien, mode sombre) |
| Base de données | **PostgreSQL / Supabase** (schéma fourni : `supabase/schema.sql`) |
| Fichiers PDF | **Supabase Storage** (bucket privé `pdfs`, URL signée ; équivalent S3 possible) |
| Couvertures | Génération automatique (couverture SVG de repli ; production : extraction de la 1re page via pdf.js + sharp) |
| Authentification admin | Session signée HMAC en mode démo ; **Supabase Auth** en production (voir §6) |
| PWA | Manifest + Service Worker (cache du shell, PDF mis en cache à la lecture) |
| Déploiement | **Vercel** (application Next.js) + **Supabase** (BDD + Storage) |

Le site fonctionne **sans aucune base** en mode démo : les 20 livres fictifs sont lus
depuis `src/data/*.json`, les écritures de l'admin sont sauvegardées dans `data-runtime/`.

---

## 2. Démarrage rapide

### Prérequis
- Node.js ≥ 18.18 (testé avec Node 22)
- npm ≥ 9

### Installation
```bash
cd tchad-digital-library
npm install
cp .env.example .env.local      # optionnel en mode démo
npm run dev
```
Site : <http://localhost:3000>

### Build de production locale
```bash
npm run build
npm start
```

### Comptes administrateur de test (MODE DÉMO)

| Rôle | E-mail | Mot de passe |
|---|---|---|
| Super admin (tout accès, suppressions) | `superadmin@tchaddigital.td` | `Admin@2026` |
| Éditeur (création/édition livres, catégories, auteurs) | `editeur@tchaddigital.td` | `Editeur@2026` |

Connexion : <http://localhost:3000/admin/login>
> Ces identifiants sont fictifs et réservés à la démonstration. En production, remplacez
> ce vérificateur par Supabase Auth (§6) et ne stockez jamais de mots de passe en clair.

---

## 3. Parcours utilisateur public

- **Accueil `/`** : bandeau héros avec rotation des 7 slogans, recherche centrale avec
  suggestions automatiques, compteurs animés (livres, téléchargements, lecteurs,
  catégories), livres à la une, nouveautés, catégories populaires, section auteurs
  tchadiens, appel à contribuer.
- **Catalogue `/catalogue`** : grille filtrable (catégorie, auteur, année, langue,
  popularité), tri (popularité, nouveautés, titre, note, année), pagination.
- **Fiche livre `/livre/[slug]`** : couverture, métadonnées, résumé, note, boutons
  *Lire en ligne* et *Télécharger le PDF*, favoris / « À lire plus tard », partage
  WhatsApp / Facebook / X, livres similaires, données structurées JSON-LD `Book`.
- **Lecteur `/lire/[slug]`** : zoom avant/arrière, navigation par page, plein écran,
  bouton de téléchargement, historique de lecture local.
- **Recherche `/recherche?q=`** et suggestions instantanées (`/api/recherche`).
- **Catégories** : page index et page par thème (`/categories/[slug]`).
- **Pages** : À propos, Contact (formulaire protégé par limitation de débit et
  anti-spam), FAQ (accordéon), Mentions légales & droits d'auteur, **Ma bibliothèque**
  (favoris, liste de lecture, historique, notes — stockage local, synchronisation
  Supabase Auth prévue).

---

## 4. Espace administrateur `/admin`

Porte d'entrée protégée (middleware + garde serveur par rôle).

| Section | Fonctions |
|---|---|
| Tableau de bord | Cartes de stats, graphique 12 mois (téléchargements/vues), livres les plus lus |
| Livres | Tableau filtrable, création/édition, brouillon/publié, *À la une*, nouveauté, **import en masse de plusieurs PDF**, glisser-déposer du fichier, couleur de couverture, suppression (super admin) |
| Catégories | CRUD, couleur, slug, description |
| Auteurs | CRUD, nationalité, auteur tchadien mis en avant, biographie |
| Contenu | Modification sans code des slogans, titre/sous-titre du héros, textes « À propos », coordonnées, couleurs, réseaux sociaux, mode maintenance |
| Utilisateurs | Liste, rôles, blocage / réactivation (super admin) |
| Avis | Modération : approuver, rejeter, remettre en attente |
| Messages | Boîte de réception du formulaire de contact : nouveau / lu / répondu |

Rôles : **`super_admin`** (tout, suppressions, utilisateurs, contenu) et **`editor`**
( catalogue, modération).

---

## 5. Structure du projet

```
tchad-digital-library/
├── README.md
├── package.json / next.config.mjs / tailwind.config.ts / tsconfig.json
├── .env.example
├── public/
│   ├── manifest.webmanifest        # PWA
│   ├── sw.js                       # Service Worker (cache + hors-ligne)
│   ├── icons/                      # logo SVG (any + maskable)
│   └── livres/.gitkeep
├── supabase/schema.sql             # schéma PostgreSQL + RLS + index
├── scripts/seed.mjs                # import des données démo vers Supabase
├── src/
│   ├── app/
│   │   ├── layout.tsx              # thème, PWA, métadonnées globales
│   │   ├── globals.css
│   │   ├── sitemap.ts / robots.ts
│   │   ├── (site)/                 # pages publiques (Header/Footer)
│   │   │   ├── page.tsx            # accueil
│   │   │   ├── catalogue/ livre/[slug]/ lire/[slug]/ categories/[slug]/
│   │   │   ├── recherche/ a-propos/ contact/ faq/ mentions-legales/ bibliotheque/
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   └── (dashboard)/        # shell admin + 8 sections
│   │   └── api/                    # routes REST publiques + /api/admin/*
│   ├── components/                 # UI publique + admin + lecteur + PWA
│   ├── lib/                        # store (démo ↔ Supabase), auth, sécurité, SEO
│   ├── data/                       # 20 livres, auteurs, catégories, settings, avis…
│   └── types/                      # types TypeScript partagés
└── data-runtime/                   # écritures démo (généré, ignoré par git)
```

---

## 6. Passage de la démo à Supabase (production)

1. **Créer le projet** sur <https://supabase.com> ; copier l'URL et la clé `service_role`.
2. **Base** : exécuter `supabase/schema.sql` dans l'éditeur SQL.
3. **Fichiers `.env.local`** :
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<projet>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon>
   SUPABASE_SERVICE_ROLE_KEY=<service_role>
   AUTH_SECRET=<openssl rand -hex 32>
   ```
4. **Seed** : `npm run seed` insère catégories, auteurs, 20 livres, avis, profils, messages.
5. **Storage** : créer deux buckets publics/privés via la console :
   - `pdfs` (privé) : PDF accessibles par **URL signée 15 minutes** (route `/api/download/[slug]`).
   - `covers` (public) : miniatures générées depuis la 1re page du PDF.
6. **Auth** (recommandé) : activer Supabase Auth, créer les rôles dans `public.profiles`,
   puis remplacer `src/lib/auth.ts` (`login()`) par la vérification `supabase.auth.verifyOtp`
   / session cookie ; la structure des routes admin ne change pas.
7. **Déploiement Vercel** :
   - Import du dépôt, framework **Next.js** détecté automatiquement.
   - Variables d'environnement identiques à `.env.local` (marquer la clé service_role sensibile).
   - Build : `npm run build` (défaut), sortie gérée par Vercel.
   - Domaine personnalisé + HTTPS automatique ; rediriger `/admin` par la mise en place
     de l'authentification Supabase en production.

Le store (`src/lib/store.ts`) bascule automatiquement vers Supabase REST dès que les
variables sont présentes, sans modifier les pages.

---

## 7. Sécurité

- En-têtes HTTP stricts (`next.config.mjs`) : CSP, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `X-Content-Type-Options`.
- Session admin : cookie **HttpOnly**, `SameSite=Lax`, signature HMAC-SHA256, expiration 8 h.
- Garde par rôle dans chaque route API et page admin ; suppression réservée au super admin.
- Limitation de débit en mémoire sur le téléchargement et le formulaire de contact
  (à remplacer par Redis/Upstash en multi-instances).
- Validation et nettoyage HTML des messages de contact ; champ honeypot anti-spam.
- Pas de mot de passe en base en mode démo ; production = Supabase Auth + rôles en base.
- PDFs en bucket privé + URL signée ; IP de téléchargement hachée dans `download_logs`.
- Politique RLS fournie dans `schema.sql` : lecture publique des seuls livres publiés.

---

## 8. SEO et performance

- Métadonnées par page (`title`, description, canonical, Open Graph, Twitter Card).
- Données structurées `schema.org/Book` sur chaque fiche.
- `sitemap.xml` dynamique (pages + livres + catégories) et `robots.txt` interdisant `/admin`, `/api`, `/lire`.
- Couvertures SVG légères, pagination, pas de poids inutile ; Service Worker de pré-cache
  du shell pour les connexions faibles ; lecteur page par page.

---

## 9. API REST (résumé)

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/livres?category=&author=&year=&language=&sort=&q=&page=` | Catalogue public paginé |
| GET | `/api/livres/[slug]` | Fiche livre (incrémente les vues) |
| GET | `/api/recherche?q=` | Suggestions titre / auteur / catégorie |
| GET | `/api/stats` | Compteurs publics |
| POST | `/api/contact` | Formulaire (rate limité) |
| GET | `/api/download/[slug]` | Compteur + téléchargement (démo : fiche texte ; prod : PDF signé) |
| POST | `/api/admin/auth/login` · `POST /api/admin/auth/logout` | Session admin |
| GET/POST | `/api/admin/livres` · GET/PATCH/DELETE `/api/admin/livres/[slug]` · POST `/api/admin/livres/import` | CRUD + import masse |
| GET/POST | `/api/admin/categories` · PATCH/DELETE `[slug]` | CRUD catégories |
| GET/POST | `/api/admin/auteurs` · PATCH/DELETE `[slug]` | CRUD auteurs |
| GET/PATCH | `/api/admin/contenu` | Réglages du site |
| GET/PATCH | `/api/admin/messages/[slug]` · `/api/admin/avis/[slug]` · `/api/admin/utilisateurs/[slug]` | Modération |

---

## 10. Données de démonstration

20 livres fictifs couvrant : littérature africaine, romans, poésie, histoire, droit,
sciences politiques, économie, agriculture, éducation, religion, santé, jeunesse ;
16 auteurs (dont 11 tchadiens), 12 catégories, avis, messages et utilisateurs de test.
Aucun auteur réel n'est utilisé ; les noms sont inventés pour la démo.

---

## 11. Personnalisation rapide

- **Couleurs** : `tailwind.config.ts` (`tchad.blue / gold / red`) et `data/settings.json`.
- **Slogans** : section Contenu de l'admin, champ « Slogans en rotation » (un par ligne).
- **Typographie** : empilements serif/sans dans `tailwind.config.ts` (Fraunces/Inter
  avec replis système hors réseau).
- **Logo** : `src/components/Logo.tsx` et `public/icons/icon.svg`.

---

## 12. Licence et droits

Code de la plateforme : licence MIT. Les contenus littéraires de démonstration sont
fictifs et fournis pour tester le site ; en production, chaque ouvrage est diffusé
avec l'autorisation de ses ayants droit ou sous licence libre (voir `/mentions-legales`).

---

### Roadmap suggérée
- [ ] Comptes lecteurs Supabase Auth + synchronisation des favoris/notes.
- [ ] Lecteur pdf.js avec position de page sauvée par compte.
- [ ] Extraction automatique de la 1re page en couverture (pdf.js + sharp).
- [ ] Recherche plein texte PostgreSQL (`tsvector` / trigrammes) et filtre par licence.
- [ ] Version arabe tchadienne / haoussa / sar du contenu pédagogique.
