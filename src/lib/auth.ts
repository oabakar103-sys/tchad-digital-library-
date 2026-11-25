import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import type { Role } from '@/types';
import { DEMO_ADMINS } from '@/lib/constants';

export interface SessionUser {
  email: string;
  name: string;
  role: Role;
}

export const SESSION_COOKIE = 'tdl_admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 heures

const SECRET =
  process.env.AUTH_SECRET || 'dev-secret-tchad-digital-library-a-renouveler-en-production-32octets';

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('hex');
}

export function createSessionToken(user: SessionUser): string {
  const exp = Date.now() + COOKIE_MAX_AGE * 1000;
  const payload = Buffer.from(JSON.stringify({ ...user, exp })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const given = Buffer.from(sig);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    return { email: data.email, name: data.name, role: data.role };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}

/** MODE DEMO : vérifie contre les comptes fictifs. En production, remplacer par
 *  Supabase Auth / NextAuth (voir README, section Authentification). */
export async function login(email: string, password: string): Promise<SessionUser | null> {
  const found = DEMO_ADMINS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!found) return null;
  return { email: found.email, name: found.name, role: found.role };
}

export function sessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  };
}

/** Sérialise l'en-tête Set-Cookie (sans dépendance externe). */
export function buildSetCookie(token: string | null): string {
  const base = `${SESSION_COOKIE}=${token ?? ''}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
  return token ? `${base}; Max-Age=${COOKIE_MAX_AGE}` : `${base}; Max-Age=0`;
}

/** Garde pour les pages admin (server components). Redirige vers la connexion. */
export async function requireAdmin(allowed: Role[] = ['super_admin', 'editor']): Promise<SessionUser> {
  const session = await getSession();
  if (!session || !allowed.includes(session.role)) {
    redirect('/admin/login');
  }
  return session as SessionUser;
}

/** Garde pour les routes API admin. Renvoie 401 JSON si non autorisé. */
export async function apiGuard(
  allowed: Role[] = ['super_admin', 'editor'],
): Promise<SessionUser | NextResponse> {
  const session = await getSession();
  if (!session || !allowed.includes(session.role)) {
    return NextResponse.json({ error: 'Non autorisé. Connexion administrateur requise.' }, { status: 401 });
  }
  return session;
}
