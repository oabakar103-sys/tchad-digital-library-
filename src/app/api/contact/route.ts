import { NextRequest, NextResponse } from 'next/server';
import { createMessage } from '@/lib/store';
import { hitRateLimit, rateHeaders } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

const sanitize = (value: unknown, max = 2000) =>
  String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, max);

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
  const limit = Number(process.env.RATE_LIMIT_CONTACT_PER_HOUR ?? 5);
  const rl = hitRateLimit(`contact:${ip}`, limit, 3_600_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Trop de messages depuis cette adresse. Réessayez dans une heure.' },
      { status: 429, headers: rateHeaders(rl, limit) },
    );
  }

  const body = await req.json().catch(() => null);
  const name = sanitize(body?.name, 120);
  const email = sanitize(body?.email, 160);
  const subject = sanitize(body?.subject, 160);
  const message = sanitize(body?.message, 4000);

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Champs invalides : nom, e-mail valide et message requis.' }, { status: 400 });
  }

  const created = await createMessage({ name, email, subject: subject || 'Sans objet', message });
  return NextResponse.json({ ok: true, id: created.id });
}
