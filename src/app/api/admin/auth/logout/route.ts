import { NextResponse } from 'next/server';
import { buildSetCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json({ ok: true }, { headers: { 'Set-Cookie': buildSetCookie(null) } });
}
