import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ADMIN_COOKIE, ADMIN_SESSION_MAX_AGE, changeAdminPassword, getAdminSession, sessionToken,
} from '@/lib/admin-auth';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';

// POST /api/admin/change-password — define uma palavra-passe nova para o
// administrador da sessão atual e limpa a obrigação de troca. Reemite o
// cookie de sessão sem a marca `mustChangePassword`.
export const dynamic = 'force-dynamic';

const TEMP_PASSWORD = 'jabulani2026';
const MIN_LENGTH = 10;

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'forbidden', message: 'Origem do pedido não autorizada.' }, { status: 403 });
  }

  const rateLimit = checkRateLimit(request, 'admin-change-password', 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'too_many_requests', message: 'Demasiadas tentativas. Tente novamente mais tarde.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

  const store = await cookies();
  const session = getAdminSession(store.get(ADMIN_COOKIE)?.value);
  if (!session || session.email === 'legacy@local') {
    return NextResponse.json(
      { error: 'unauthorized', message: 'Sessão inválida. Volte a autenticar-se.' },
      { status: 401 },
    );
  }

  let body: { currentPassword?: unknown; newPassword?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Corpo inválido.' }, { status: 400 });
  }

  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

  if (newPassword.length < MIN_LENGTH) {
    return NextResponse.json(
      { error: 'weak_password', message: `A nova palavra-passe tem de ter pelo menos ${MIN_LENGTH} caracteres.` },
      { status: 422 },
    );
  }
  if (newPassword === TEMP_PASSWORD) {
    return NextResponse.json(
      { error: 'weak_password', message: 'Escolha uma palavra-passe diferente da provisória.' },
      { status: 422 },
    );
  }
  if (newPassword === currentPassword) {
    return NextResponse.json(
      { error: 'weak_password', message: 'A nova palavra-passe tem de ser diferente da atual.' },
      { status: 422 },
    );
  }

  const result = await changeAdminPassword(session.email, currentPassword, newPassword);
  if (!result.ok) {
    if (result.error === 'invalid_credentials') {
      return NextResponse.json({ error: result.error, message: 'Palavra-passe atual incorreta.' }, { status: 401 });
    }
    if (result.error === 'server_misconfigured') {
      return NextResponse.json({ error: result.error, message: 'Autenticação não configurada no servidor.' }, { status: 503 });
    }
    return NextResponse.json({ error: result.error, message: 'Não foi possível atualizar a palavra-passe.' }, { status: 500 });
  }

  const token = sessionToken({
    email: session.email,
    name: session.name,
    profile: session.profile,
    mustChangePassword: false,
  });

  const res = NextResponse.json({ ok: true });
  if (token) {
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: ADMIN_SESSION_MAX_AGE,
    });
  }
  return res;
}
