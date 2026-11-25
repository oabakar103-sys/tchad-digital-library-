import { NextRequest, NextResponse } from 'next/server';
import { buildSetCookie, createSessionToken, login } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? '').trim();
  const password = String(body?.password ?? '');

  if (!email || !password) {
    return NextResponse.json({ error: 'E-mail et mot de passe requis.' }, { status: 400 });
  }

  const session = await login(email, password);
  if (!session) {
    return NextResponse.json({ error: 'Identifiants invalides ou droits insuffisants.' }, { status: 401 });
  }

  const token = createSessionToken(session);
  return NextResponse.json(
    { user: session },
    { headers: { 'Set-Cookie': buildSetCookie(token) } },
  );
}
