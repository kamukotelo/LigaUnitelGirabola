import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE, ADMIN_SESSION_MAX_AGE, sessionToken, verifyClubDirectionPasscode,
  verifyPasscode, type UserProfile,
} from '@/lib/admin-auth';

// POST /api/admin/login — valida a credencial de gestão (no servidor) e emite um
// cookie httpOnly de sessão. A senha nunca chega ao código do cliente.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: { passcode?: unknown; profile?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Corpo inválido.' }, { status: 400 });
  }

  const profile: UserProfile = body.profile === 'club_direction' ? 'club_direction' : 'admin';
  const valid = profile === 'club_direction'
    ? verifyClubDirectionPasscode(body.passcode)
    : verifyPasscode(body.passcode);

  if (!valid) {
    return NextResponse.json({ error: 'unauthorized', message: 'Código de acesso inválido.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, profile });
  res.cookies.set(ADMIN_COOKIE, sessionToken(profile), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return res;
}
