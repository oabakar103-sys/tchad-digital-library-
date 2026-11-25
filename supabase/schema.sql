-- ============================================================================
-- Tchad Digital Library — schéma PostgreSQL / Supabase
-- À exécuter dans l'éditeur SQL de Supabase avant `npm run seed`.
-- Convention : horodatages UTC, slugs uniques, mots de passe jamais stockés
-- ici (comptes gérés par Supabase Auth ; ce schéma couvre les profils métier).
-- ============================================================================

-- Extensions utiles ----------------------------------------------------------------
create extension if not exists "pg_trgm";          -- recherche fuzzy sur titres/auteurs
create extension if not exists unaccent;            -- ignore accents dans la recherche

-- Catégories -----------------------------------------------------------------------
create table if not exists public.categories (
  id          text primary key,
  slug        text unique not null,
  name        text not null,
  description text default '',
  color       text default '#0f4f9e',
  icon        text default 'book-open',
  sort_order  int  default 99,
  created_at  timestamptz default now()
);

-- Auteurs --------------------------------------------------------------------------
create table if not exists public.authors (
  id          text primary key,
  slug        text unique not null,
  name        text not null,
  country     text default 'Tchad',
  birth_year  int,
  bio         text default '',
  tchadian    boolean default false,
  accent_color text default '#0f4f9e',
  created_at  timestamptz default now()
);

-- Livres ---------------------------------------------------------------------------
create table if not exists public.books (
  id            text primary key,
  slug          text unique not null,
  title         text not null,
  author_id     text references public.authors(id) on delete restrict,
  category_id   text references public.categories(id) on delete restrict,
  summary       text default '',
  year          int,
  pages         int default 0,
  file_size_kb  int default 0,
  language      text default 'Français',
  downloads     int default 0,
  views         int default 0,
  rating        numeric(2,1) default 0,
  rating_count  int default 0,
  status        text not null default 'draft' check (status in ('published','draft')),
  featured      boolean default false,
  is_new        boolean default false,
  tags          text[] default '{}',
  cover_color   text default '#0f4f9e',
  cover_url     text,
  pdf_url       text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists books_title_trgm on public.books using gin (title gin_trgm_ops);
create index if not exists books_summary_trgm on public.books using gin (summary gin_trgm_ops);
create index if not exists books_category_idx on public.books (category_id);
create index if not exists books_author_idx on public.books (author_id);
create index if not exists books_status_idx on public.books (status, created_at desc);

-- Profils (extension de Supabase Auth ; auth.users gère l'authentification) ---------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  name        text not null,
  role        text not null default 'reader' check (role in ('super_admin','editor','reader')),
  status      text not null default 'active' check (status in ('active','banned')),
  favorites   text[] default '{}',
  later       text[] default '{}',
  created_at  timestamptz default now()
);

-- Avis / notes ----------------------------------------------------------------------
create table if not exists public.reviews (
  id            text primary key,
  book_id       text references public.books(id) on delete cascade,
  reader_name   text not null,
  reader_email  text,
  rating        int check (rating between 1 and 5),
  comment       text not null,
  status        text default 'pending' check (status in ('pending','approved','rejected')),
  created_at    timestamptz default now()
);
create index if not exists reviews_status_idx on public.reviews (status);

-- Messages du formulaire de contact -------------------------------------------------
create table if not exists public.contact_messages (
  id          text primary key,
  name        text not null,
  email       text not null,
  subject     text default '',
  message     text not null,
  status      text default 'new' check (status in ('new','read','replied')),
  created_at  timestamptz default now()
);

-- Réglages du site (une seule ligne : id = 'main') ----------------------------------
create table if not exists public.settings (
  id          text primary key,
  data        jsonb not null,
  updated_at  timestamptz default now()
);

-- Journal des téléchargements (limitation, statistiques, audit) --------------------
create table if not exists public.download_logs (
  id          bigserial primary key,
  book_id     text references public.books(id) on delete set null,
  ip_hash     text,                 -- IP hachée (jamais stockée en clair)
  user_agent  text,
  created_at  timestamptz default now()
);
create index if not exists downloads_book_date_idx on public.download_logs (book_id, created_at desc);

-- Historique de lecture (lecteur connecté) -----------------------------------------
create table if not exists public.reading_history (
  id          bigserial primary key,
  profile_id  uuid references public.profiles(id) on delete cascade,
  book_id     text references public.books(id) on delete cascade,
  last_page   int default 1,
  updated_at  timestamptz default now(),
  unique (profile_id, book_id)
);

-- ============================================================================
-- Politiques RLS (Row Level Security)
-- Lectures publiques pour livres/catégories/auteurs ; écritures réservées aux
-- rôles serveur (clé service) ; profils et avis : lecture après modération.
-- ============================================================================
alter table public.categories enable row level security;
alter table public.authors    enable row level security;
alter table public.books      enable row level security;
alter table public.profiles   enable row level security;
alter table public.reviews    enable row level security;
alter table public.contact_messages enable row level security;
alter table public.settings   enable row level security;
alter table public.download_logs enable row level security;

create policy "lecture publique categories" on public.categories for select using (true);
create policy "lecture publique auteurs"    on public.authors    for select using (true);
create policy "lecture publique livres"     on public.books      for select using (status = 'published');
create policy "lecture avis approuves"      on public.reviews    for select using (status = 'approved');

-- Les écrituses passent par la clé service_role (bypass RLS côté serveur uniquement).
-- Aucune politique d'insertion anonyme : le formulaire contact appelle l'API serveur.

-- Storage bucket (console Supabase > Storage) :
--   bucket `pdfs`            : fichiers privés, accès par URL signée 15 min.
--   bucket `covers`          : miniatures publiques (1re page du PDF, 40 Ko max).
-- Politique `pdfs` : lecteur anonyme en lecture signée uniquement ; écriture service role.

-- Trigger de mise à jour automatique de updated_at ----------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger books_touch before update on public.books
for each row execute function public.touch_updated_at();
