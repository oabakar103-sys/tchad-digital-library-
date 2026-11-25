/**
 * Couche d'accès aux données (serveur uniquement).
 *
 * Deux modes automatiques :
 *  - MODE DEMO (par défaut) : lit les graines de `src/data/*.json` et écrit les
 *    modifications administrateur dans `data-runtime/*.json` (surcharge locale).
 *  - MODE SUPABASE : si `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
 *    sont définis, l'ensemble passe par l'API REST de Supabase (voir schéma SQL
 *    dans `supabase/schema.sql`).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import type {
  Author,
  Book,
  BookFilters,
  Category,
  ContactMessage,
  DashboardStats,
  Paginated,
  Review,
  SiteSettings,
  SiteUser,
} from '@/types';
import { PER_PAGE } from '@/lib/constants';
import { pseudoRandom, slugify } from '@/lib/utils';

import seedBooks from '@/data/books.json';
import seedCategories from '@/data/categories.json';
import seedAuthors from '@/data/authors.json';
import seedReviews from '@/data/reviews.json';
import seedUsers from '@/data/users.json';
import seedMessages from '@/data/messages.json';
import seedSettings from '@/data/settings.json';

const BOOKS = seedBooks as unknown as Book[];
const CATEGORIES = seedCategories as unknown as Category[];
const AUTHORS = seedAuthors as unknown as Author[];
const REVIEWS = seedReviews as unknown as Review[];
const USERS = seedUsers as unknown as SiteUser[];
const MESSAGES = seedMessages as unknown as ContactMessage[];
const SETTINGS = seedSettings as unknown as SiteSettings;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_SERVICE);

const RT_DIR = path.join(process.cwd(), 'data-runtime');

/* ------------------------------------------------------------------ */
/* Lecture / écriture des fichiers (mode démo)                          */
/* ------------------------------------------------------------------ */

async function loadRows<T>(file: string, seed: T[]): Promise<T[]> {
  if (USE_SUPABASE) return sbSelect<T>(file.replace('.json', ''));
  try {
    const raw = await fs.readFile(path.join(RT_DIR, file), 'utf8');
    return JSON.parse(raw) as T[];
  } catch {
    return seed;
  }
}

async function saveRows(file: string, rows: unknown[]): Promise<void> {
  await fs.mkdir(RT_DIR, { recursive: true });
  await fs.writeFile(path.join(RT_DIR, file), JSON.stringify(rows, null, 2), 'utf8');
}

async function loadSettings(): Promise<SiteSettings> {
  if (USE_SUPABASE) {
    const rows = await sbSelect<SiteSettings>('settings');
    if (rows[0]) return rows[0];
  }
  try {
    const raw = await fs.readFile(path.join(RT_DIR, 'settings.json'), 'utf8');
    const parsed: unknown = JSON.parse(raw);
    return (Array.isArray(parsed) ? parsed[0] : parsed) as SiteSettings;
  } catch {
    return SETTINGS;
  }
}

async function saveSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await loadSettings();
  const next = { ...current, ...patch };
  if (USE_SUPABASE) {
    await sbUpsert('settings', { id: 'main', ...next });
    return next;
  }
  await saveRows('settings.json', [next]);
  return next;
}

/* ------------------------------------------------------------------ */
/* Client REST Supabase (best-effort, schéma dans supabase/schema.sql) */
/* ------------------------------------------------------------------ */

async function sbSelect<T>(table: string, query = 'select=*'): Promise<T[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: SUPABASE_SERVICE!,
      Authorization: `Bearer ${SUPABASE_SERVICE}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Supabase ${table} ${res.status}`);
  return (await res.json()) as T[];
}

async function sbUpsert(table: string, row: Record<string, unknown>): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE!,
      Authorization: `Bearer ${SUPABASE_SERVICE}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(row),
  });
}

/* ------------------------------------------------------------------ */
/* Aides internes                                                       */
/* ------------------------------------------------------------------ */

const normalize = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

function sortBooks(books: Book[], sort?: BookFilters['sort']): Book[] {
  const arr = [...books];
  switch (sort) {
    case 'popular':
      return arr.sort((a, b) => b.downloads - a.downloads);
    case 'new':
      return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'title':
      return arr.sort((a, b) => a.title.localeCompare(b.title, 'fr'));
    case 'rating':
      return arr.sort((a, b) => b.rating - a.rating);
    case 'year':
      return arr.sort((a, b) => b.year - a.year);
    default:
      return arr.sort((a, b) => b.featured === a.featured ? b.downloads - a.downloads : a.featured ? -1 : 1);
  }
}

/* ------------------------------------------------------------------ */
/* Lectures publiques                                                   */
/* ------------------------------------------------------------------ */

export async function listBooks(filters: BookFilters = {}, includeDrafts = false): Promise<Paginated<Book>> {
  let books = await loadRows<Book>('books.json', BOOKS);
  if (!includeDrafts) books = books.filter((b) => b.status === 'published');

  if (filters.category) books = books.filter((b) => b.categoryId === filters.category || b.slug === filters.category);
  if (filters.author) books = books.filter((b) => b.authorId === filters.author || b.slug === filters.author);
  if (filters.year) books = books.filter((b) => String(b.year) === filters.year);
  if (filters.language) books = books.filter((b) => normalize(b.language).includes(normalize(filters.language!)));
  if (filters.q) {
    const q = normalize(filters.q);
    const authors = await listAuthors();
    books = books.filter((b) => {
      const author = authors.find((a) => a.id === b.authorId);
      const haystack = normalize(`${b.title} ${b.summary} ${b.tags.join(' ')} ${author?.name ?? ''}`);
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
  }

  books = sortBooks(books, filters.sort);

  const perPage = filters.perPage ?? PER_PAGE;
  const page = Math.max(1, filters.page ?? 1);
  const total = books.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;

  return {
    items: books.slice(start, start + perPage),
    total,
    page,
    perPage,
    totalPages,
  };
}

export async function listAllBooks(): Promise<Book[]> {
  return loadRows<Book>('books.json', BOOKS);
}

export async function getBookBySlug(slug: string, includeDrafts = false): Promise<Book | null> {
  const books = await loadRows<Book>('books.json', BOOKS);
  const book = books.find((b) => b.slug === slug) ?? null;
  if (!book) return null;
  if (!includeDrafts && book.status !== 'published') return null;
  return book;
}

export async function listCategories(withCounts = true): Promise<Category[]> {
  const categories = await loadRows<Category>('categories.json', CATEGORIES);
  if (!withCounts) return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const books = await loadRows<Book>('books.json', BOOKS);
  return [...categories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({ ...c, bookCount: books.filter((b) => b.categoryId === c.id && b.status === 'published').length }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await listCategories(false);
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function listAuthors(withCounts = true): Promise<Author[]> {
  const authors = await loadRows<Author>('authors.json', AUTHORS);
  if (!withCounts) return authors;
  const books = await loadRows<Book>('books.json', BOOKS);
  return authors
    .map((a) => ({ ...a, bookCount: books.filter((b) => b.authorId === a.id).length }))
    .sort((a, b) => b.bookCount - a.bookCount || a.name.localeCompare(b.name, 'fr'));
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const authors = await loadRows<Author>('authors.json', AUTHORS);
  return authors.find((a) => a.slug === slug) ?? null;
}

export async function getSimilarBooks(book: Book, limit = 4): Promise<Book[]> {
  const all = await loadRows<Book>('books.json', BOOKS);
  return all
    .filter((b) => b.id !== book.id && b.status === 'published')
    .sort((a, b) => {
      const sameCatA = a.categoryId === book.categoryId ? 1 : 0;
      const sameCatB = b.categoryId === book.categoryId ? 1 : 0;
      return sameCatB - sameCatA || b.rating - a.rating;
    })
    .slice(0, limit);
}

export async function searchSuggestions(q: string, limit = 8): Promise<{ type: string; label: string; href: string; sub?: string }[]> {
  if (!q.trim()) return [];
  const books = await listBooks({ q, perPage: limit }, true);
  const authors = await listAuthors();
  const categories = await listCategories(false);
  const results: { type: string; label: string; href: string; sub?: string }[] = books.items.map((b) => ({
    type: 'Livre',
    label: b.title,
    href: `/livre/${b.slug}`,
    sub: 'Auteur',
  }));
  authors
    .filter((a) => normalize(a.name).includes(normalize(q)))
    .slice(0, 3)
    .forEach((a) => results.push({ type: 'Auteur', label: a.name, href: `/catalogue?auteur=${a.slug}`, sub: a.country }));
  categories
    .filter((c) => normalize(c.name).includes(normalize(q)))
    .slice(0, 3)
    .forEach((c) => results.push({ type: 'Catégorie', label: c.name, href: `/categories/${c.slug}` }));
  return results.slice(0, limit);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return loadSettings();
}

/* ------------------------------------------------------------------ */
/* Statistiques publiques + tableau de bord admin                       */
/* ------------------------------------------------------------------ */

export async function getPublicStats() {
  const books = await listBooks({ perPage: 1000 });
  const categories = await listCategories(false);
  const authors = await listAuthors(false);
  const downloads = books.items.reduce((sum, b) => sum + b.downloads, 0);
  const views = books.items.reduce((sum, b) => sum + b.views, 0);
  const readers = Math.round(views / 3.4);
  return {
    books: books.total,
    downloads,
    readers,
    categories: categories.length,
    authors: authors.length,
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const books = await loadRows<Book>('books.json', BOOKS);
  const categories = await loadRows<Category>('categories.json', CATEGORIES);
  const authors = await loadRows<Author>('authors.json', AUTHORS);
  const reviews = await loadRows<Review>('reviews.json', REVIEWS);
  const messages = await loadRows<ContactMessage>('messages.json', MESSAGES);

  const now = new Date();
  const downloadsByMonth = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const base = Math.round(pseudoRandom(key) * 900 + 220);
    return {
      month: d.toLocaleDateString('fr-FR', { month: 'short' }),
      downloads: base,
      views: Math.round(base * 2.6),
    };
  });

  const topBooks = [...books]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 6)
    .map((b) => ({ slug: b.slug, title: b.title, authorId: b.authorId, downloads: b.downloads, views: b.views }));

  return {
    totalBooks: books.length,
    totalDownloads: books.reduce((s, b) => s + b.downloads, 0),
    totalReaders: Math.round(books.reduce((s, b) => s + b.views, 0) / 3.4),
    totalCategories: categories.length,
    totalAuthors: authors.length,
    pendingReviews: reviews.filter((r) => r.status === 'pending').length,
    newMessages: messages.filter((m) => m.status === 'new').length,
    downloadsByMonth,
    topBooks,
  };
}

/* ------------------------------------------------------------------ */
/* Mutations administrateur                                             */
/* ------------------------------------------------------------------ */

type BookInput = Omit<Book, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'downloads' | 'views' | 'rating' | 'ratingCount'> &
  Partial<Pick<Book, 'id' | 'slug' | 'downloads' | 'views' | 'rating' | 'ratingCount'>>;

export async function upsertBook(input: BookInput, existingSlug?: string): Promise<Book> {
  const books = await loadRows<Book>('books.json', BOOKS);
  const slug = input.slug && !existingSlug ? slugify(input.slug) : existingSlug ?? slugify(input.title);
  const idx = existingSlug ? books.findIndex((b) => b.slug === existingSlug) : books.findIndex((b) => b.slug === slug);
  const now = new Date().toISOString();

  if (idx >= 0) {
    const updated: Book = {
      ...books[idx],
      ...input,
      slug,
      updatedAt: now,
    };
    books[idx] = updated;
    await saveRows('books.json', books);
    return updated;
  }

  const book: Book = {
    id: input.id ?? `bk-${String(books.length + 1).padStart(3, '0')}`,
    slug,
    downloads: 0,
    views: 0,
    rating: 0,
    ratingCount: 0,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  books.push(book);
  await saveRows('books.json', books);
  return book;
}

export async function deleteBook(slug: string): Promise<boolean> {
  const books = await loadRows<Book>('books.json', BOOKS);
  const next = books.filter((b) => b.slug !== slug);
  if (next.length === books.length) return false;
  await saveRows('books.json', next);
  return true;
}

export async function bulkImportBooks(records: Array<Partial<BookInput> & { title: string; authorId: string; categoryId: string }>): Promise<number> {
  let count = 0;
  for (const rec of records) {
    await upsertBook({
      title: rec.title,
      authorId: rec.authorId,
      categoryId: rec.categoryId,
      summary: rec.summary ?? 'Résumé en attente de rédaction par l\u2019équipe éditoriale.',
      year: rec.year ?? new Date().getFullYear(),
      pages: rec.pages ?? 0,
      fileSizeKb: rec.fileSizeKb ?? 0,
      language: rec.language ?? 'Français',
      status: rec.status ?? 'draft',
      featured: false,
      isNew: true,
      tags: rec.tags ?? [],
      coverColor: rec.coverColor ?? '#0f4f9e',
      coverUrl: rec.coverUrl ?? null,
      pdfUrl: rec.pdfUrl ?? null,
    });
    count++;
  }
  return count;
}

export async function upsertCategory(input: Category, existingId?: string): Promise<Category> {
  const rows = await loadRows<Category>('categories.json', CATEGORIES);
  if (existingId) {
    const idx = rows.findIndex((c) => c.id === existingId);
    if (idx >= 0) {
      rows[idx] = { ...rows[idx], ...input };
      await saveRows('categories.json', rows);
      return rows[idx];
    }
  }
  const row = { ...input, id: input.id ?? `cat-${slugify(input.slug || input.name)}`, sortOrder: input.sortOrder ?? rows.length + 1 };
  rows.push(row);
  await saveRows('categories.json', rows);
  return row;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const rows = await loadRows<Category>('categories.json', CATEGORIES);
  const next = rows.filter((c) => c.id !== id);
  if (next.length === rows.length) return false;
  await saveRows('categories.json', next);
  return true;
}

export async function upsertAuthor(input: Author, existingId?: string): Promise<Author> {
  const rows = await loadRows<Author>('authors.json', AUTHORS);
  if (existingId) {
    const idx = rows.findIndex((a) => a.id === existingId);
    if (idx >= 0) {
      rows[idx] = { ...rows[idx], ...input };
      await saveRows('authors.json', rows);
      return rows[idx];
    }
  }
  const row = { ...input, id: input.id ?? `au-${slugify(input.name)}`, slug: input.slug || slugify(input.name) };
  rows.push(row);
  await saveRows('authors.json', rows);
  return row;
}

export async function deleteAuthor(id: string): Promise<boolean> {
  const rows = await loadRows<Author>('authors.json', AUTHORS);
  const next = rows.filter((a) => a.id !== id);
  if (next.length === rows.length) return false;
  await saveRows('authors.json', next);
  return true;
}

export async function listReviews(): Promise<Review[]> {
  return loadRows<Review>('reviews.json', REVIEWS);
}

export async function setReviewStatus(id: string, status: Review['status']): Promise<boolean> {
  const rows = await loadRows<Review>('reviews.json', REVIEWS);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return false;
  rows[idx] = { ...rows[idx], status };
  await saveRows('reviews.json', rows);
  return true;
}

export async function listUsers(): Promise<SiteUser[]> {
  return loadRows<SiteUser>('users.json', USERS);
}

export async function setUserStatus(id: string, status: SiteUser['status']): Promise<boolean> {
  const rows = await loadRows<SiteUser>('users.json', USERS);
  const idx = rows.findIndex((u) => u.id === id);
  if (idx < 0) return false;
  rows[idx] = { ...rows[idx], status };
  await saveRows('users.json', rows);
  return true;
}

export async function listMessages(): Promise<ContactMessage[]> {
  return loadRows<ContactMessage>('messages.json', MESSAGES);
}

export async function createMessage(input: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<ContactMessage> {
  const rows = await loadRows<ContactMessage>('messages.json', MESSAGES);
  const message: ContactMessage = {
    ...input,
    id: `msg-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  rows.unshift(message);
  await saveRows('messages.json', rows);
  return message;
}

export async function setMessageStatus(id: string, status: ContactMessage['status']): Promise<boolean> {
  const rows = await loadRows<ContactMessage>('messages.json', MESSAGES);
  const idx = rows.findIndex((m) => m.id === id);
  if (idx < 0) return false;
  rows[idx] = { ...rows[idx], status };
  await saveRows('messages.json', rows);
  return true;
}

export async function recordDownload(slug: string): Promise<number> {
  const books = await loadRows<Book>('books.json', BOOKS);
  const idx = books.findIndex((b) => b.slug === slug);
  if (idx < 0) return 0;
  books[idx] = { ...books[idx], downloads: books[idx].downloads + 1, updatedAt: new Date().toISOString() };
  await saveRows('books.json', books);
  return books[idx].downloads;
}

export async function recordView(slug: string): Promise<void> {
  const books = await loadRows<Book>('books.json', BOOKS);
  const idx = books.findIndex((b) => b.slug === slug);
  if (idx < 0) return;
  books[idx] = { ...books[idx], views: books[idx].views + 1 };
  await saveRows('books.json', books);
}

export { saveSettings };
