import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, canAccessFifaConnect } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!canAccessFifaConnect(token)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  return NextResponse.json({ allowed: true });
}
