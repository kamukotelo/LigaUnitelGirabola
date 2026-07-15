import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, isValidSession } from '@/lib/admin-auth';

// GET /api/admin/session — indica se o pedido traz um cookie de sessão válido.
export const dynamic = 'force-dynamic';

export async function GET() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return NextResponse.json({ authenticated: isValidSession(token) });
}
