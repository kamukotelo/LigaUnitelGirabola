import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE, ADMIN_SESSION_MAX_AGE, authenticateAdminUser, sessionToken, verifyClubDirectionPasscode,
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

  let body: { email?: unknown; password?: unknown; passcode?: unknown; profile?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Corpo inválido.' }, { status: 400 });
  }

  const account = await authenticateAdminUser(body.email, body.password);
  const profile: UserProfile = body.profile === 'club_direction' ? 'club_direction' : 'admin';
  const legacyValid = !body.email && (profile === 'club_direction'
    ? verifyClubDirectionPasscode(body.passcode)
    : verifyPasscode(body.passcode));

  if (!account && !legacyValid) {
    return NextResponse.json({ error: 'unauthorized', message: 'E-mail ou palavra-passe inválidos.' }, { status: 401 });
  }

  const token = account ? sessionToken(account) : sessionToken(profile);
  if (!token) {
    return NextResponse.json(
      { error: 'server_misconfigured', message: 'Autenticação administrativa não configurada.' },
      { status: 503 },
    );
  }

  const res = NextResponse.json({ ok: true, profile: account?.profile ?? profile, user: account ?? null });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return res;
}
