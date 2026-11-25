import { NextRequest, NextResponse } from 'next/server';
import { apiGuard } from '@/lib/auth';
import { getSiteSettings, saveSettings } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;
  return NextResponse.json({ settings: await getSiteSettings() });
}

export async function PATCH(req: NextRequest) {
  const session = await apiGuard(['super_admin']);
  if (session instanceof NextResponse) return session;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Corps invalide.' }, { status: 400 });
  const settings = await saveSettings(body);
  return NextResponse.json({ settings });
}
