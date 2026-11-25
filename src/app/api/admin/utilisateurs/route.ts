import { NextResponse } from 'next/server';
import { apiGuard } from '@/lib/auth';
import { listUsers } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await apiGuard();
  if (session instanceof NextResponse) return session;
  return NextResponse.json({ users: await listUsers() });
}
