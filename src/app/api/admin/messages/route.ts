import { NextResponse } from 'next/server';
import { apiGuard } from '@/lib/auth';
import { listMessages } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;
  return NextResponse.json({ messages: await listMessages() });
}
