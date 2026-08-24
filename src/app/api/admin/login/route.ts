import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE, ADMIN_SESSION_MAX_AGE, sessionToken, verifyClubDirectionPasscode,
  verifyPasscode, type UserProfile,
} from '@/lib/admin-auth';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';

// POST /api/admin/login — valida a credencial de gestão (no servidor) e emite um
// cookie httpOnly de sessão. A senha nunca chega ao código do cliente.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'forbidden', message: 'Origem do pedido não autorizada.' }, { status: 403 });
  }

  const rateLimit = checkRateLimit(request, 'admin-login', 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'too_many_requests', message: 'Demasiadas tentativas. Tente novamente mais tarde.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

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

  const token = sessionToken(profile);
  if (!token) {
    return NextResponse.json(
      { error: 'server_misconfigured', message: 'Autenticação administrativa não configurada.' },
      { status: 503 },
    );
  }

  const res = NextResponse.json({ ok: true, profile });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return res;
}
