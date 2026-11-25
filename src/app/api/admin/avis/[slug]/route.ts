import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/auth';
import { setReviewStatus } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;
  const { slug: id } = await params;
  const body = await req.json().catch(() => ({}));
  if (!['pending', 'approved', 'rejected'].includes(body.status)) {
    return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
  }
  const ok = await setReviewStatus(id, body.status);
  if (!ok) return NextResponse.json({ error: 'Avis introuvable.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
