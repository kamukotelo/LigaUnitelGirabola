import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getAdminSession, resetAdminAccount, OFFICIAL_ADMIN_ACCOUNTS } from '@/lib/admin-auth';
import { validateNewPassword } from '@/lib/password-policy';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';

// POST /api/admin/accounts/reset — repõe ou altera a palavra-passe de uma conta
// oficial ANCAF a partir da consola (exige perfil 'admin').
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'forbidden', message: 'Origem do pedido não autorizada.' }, { status: 403 });
  }

  const rateLimit = checkRateLimit(request, 'admin-accounts-reset', 10, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'too_many_requests', message: 'Demasiados pedidos. Tente novamente mais tarde.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

  const store = await cookies();
  const session = getAdminSession(store.get(ADMIN_COOKIE)?.value);
  if (!session || session.profile !== 'admin') {
    return NextResponse.json({ error: 'unauthorized', message: 'Sessão administrativa necessária.' }, { status: 401 });
  }

  let body: { targetEmail?: unknown; action?: unknown; newPassword?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Corpo inválido.' }, { status: 400 });
  }

  const targetEmail = typeof body.targetEmail === 'string' ? body.targetEmail.trim().toLowerCase() : '';
  const action = body.action === 'custom' ? 'custom' : 'default';
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

  if (!targetEmail || !OFFICIAL_ADMIN_ACCOUNTS[targetEmail]) {
    return NextResponse.json({ error: 'bad_request', message: 'Conta oficial não reconhecida.' }, { status: 400 });
  }

  if (action === 'custom') {
    const policyError = validateNewPassword(newPassword);
    if (policyError) {
      return NextResponse.json({ error: 'weak_password', message: policyError }, { status: 422 });
    }
  }

  const result = await resetAdminAccount(targetEmail, action, action === 'custom' ? newPassword : undefined);
  if (!result.ok) {
    return NextResponse.json({ error: 'update_failed', message: result.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    targetEmail,
    action,
    message: action === 'default'
      ? `Palavra-passe de ${targetEmail} reposta para jabulani2026 com troca obrigatória no próximo acesso.`
      : `Nova palavra-passe definida com sucesso para ${targetEmail}.`,
  });
}
