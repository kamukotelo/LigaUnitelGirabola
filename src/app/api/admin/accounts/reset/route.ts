import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getAdminSession, resetAdminAccount } from '@/lib/admin-auth';
import { validateNewPassword } from '@/lib/password-policy';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';

// POST /api/admin/accounts/reset — permite a um administrador repor a palavra-passe
// de uma das contas oficiais para a senha provisória ou definir uma nova diretamente.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'forbidden', message: 'Origem do pedido não autorizada.' }, { status: 403 });
  }

  const rateLimit = checkRateLimit(request, 'admin-accounts-reset', 10, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'too_many_requests', message: 'Demasiadas tentativas. Tente novamente mais tarde.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

  const store = await cookies();
  const session = getAdminSession(store.get(ADMIN_COOKIE)?.value);

  if (!session || session.profile !== 'admin') {
    return NextResponse.json(
      { error: 'unauthorized', message: 'Acesso reservado aos administradores.' },
      { status: 401 },
    );
  }

  let body: { email?: unknown; newPassword?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Corpo inválido.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email) {
    return NextResponse.json({ error: 'bad_request', message: 'Indique o e-mail da conta.' }, { status: 400 });
  }

  const newPassword = typeof body.newPassword === 'string' && body.newPassword.trim().length > 0
    ? body.newPassword.trim()
    : undefined;

  if (newPassword) {
    const policyError = validateNewPassword(newPassword);
    if (policyError) {
      return NextResponse.json({ error: 'weak_password', message: policyError }, { status: 422 });
    }
  }

  const result = await resetAdminAccount(email, newPassword);
  if (!result.ok) {
    if (result.error === 'account_not_found') {
      return NextResponse.json({ error: result.error, message: 'Conta de administrador não encontrada.' }, { status: 404 });
    }
    if (result.error === 'server_misconfigured') {
      return NextResponse.json({ error: result.error, message: 'Serviço de autenticação indisponível.' }, { status: 503 });
    }
    return NextResponse.json({ error: result.error, message: 'Não foi possível repor a palavra-passe.' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    email: result.email,
    provisional: result.provisional,
    message: result.provisional
      ? 'Palavra-passe reposta para a provisória (jabulani2026).'
      : 'Nova palavra-passe configurada com sucesso.',
  });
}
