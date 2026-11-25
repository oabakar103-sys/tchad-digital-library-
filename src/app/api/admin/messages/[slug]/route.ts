import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/auth';
import { setMessageStatus } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;
  const { slug: id } = await params;
  const body = await req.json().catch(() => ({}));
  if (!['new', 'read', 'replied'].includes(body.status)) {
    return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
  }
  const ok = await setMessageStatus(id, body.status);
  if (!ok) return NextResponse.json({ error: 'Message introuvable.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
