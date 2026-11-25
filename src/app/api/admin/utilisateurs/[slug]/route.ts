import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/auth';
import { setUserStatus } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await apiGuard(['super_admin']);
  if (session instanceof NextResponse) return session;
  const { slug: id } = await params;
  const body = await req.json().catch(() => ({}));
  if (!['active', 'banned'].includes(body.status)) {
    return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
  }
  const ok = await setUserStatus(id, body.status);
  if (!ok) return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
