#!/usr/bin/env node
/**
 * Seed Supabase à partir des données de démonstration (src/data/*.json).
 *
 * Usage :
 *   cp .env.example .env.local  # renseigner NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY
 *   npm run seed
 *
 * Sans variables Supabase, le script explique simplement que le mode démo local
 * fonctionne sans base (les données sont lues depuis src/data/*.json).
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.log('ℹ  Variables Supabase absentes.');
  console.log('   Le site fonctionne en MODE DÉMO : données fictives lues depuis src/data/.');
  console.log('   Pour intégrer Supabase, renseigner .env.local puis relancer `npm run seed`.');
  process.exit(0);
}

const DATA_DIR = path.join(root, 'src', 'data');
const tables = [
  ['categories.json', 'categories'],
  ['authors.json', 'authors'],
  ['books.json', 'books'],
  ['users.json', 'profiles'],
  ['reviews.json', 'reviews'],
  ['messages.json', 'contact_messages'],
];

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  Prefer: 'resolution=merge-duplicates',
};

for (const [file, table] of tables) {
  const rows = JSON.parse(await readFile(path.join(DATA_DIR, file), 'utf8'));
  const res = await fetch(`${url}/rest/v1/${table}`, { method: 'POST', headers, body: JSON.stringify(rows) });
  console.log(`${table.padEnd(18)} ${res.status} (${rows.length} lignes)`);
  if (!res.ok) console.log(await res.text());
}

const settings = JSON.parse(await readFile(path.join(DATA_DIR, 'settings.json'), 'utf8'));
const res = await fetch(`${url}/rest/v1/settings`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ id: 'main', data: settings, updated_at: new Date().toISOString() }),
});
void res;
console.log(`settings          ${res.status}`);
console.log('✅ Seed terminé. Pensez à créer les buckets Storage `pdfs` et `covers` (voir README).');
