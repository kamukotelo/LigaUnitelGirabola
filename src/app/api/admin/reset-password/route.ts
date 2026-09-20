import { NextResponse } from 'next/server';
import { consumePasswordReset, isPasswordResetTokenValid } from '@/lib/admin-auth';
import { validateNewPassword } from '@/lib/password-policy';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';

// POST /api/admin/reset-password — gasta o link recebido por e-mail e define
// a palavra-passe nova. Sem `newPassword`, apenas verifica se o link serve
// (o token vai no corpo, nunca em query string, para não ficar em registos).
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'forbidden', message: 'Origem do pedido não autorizada.' }, { status: 403 });
  }

  const rateLimit = checkRateLimit(request, 'admin-reset-password', 10, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'too_many_requests', message: 'Demasiadas tentativas. Tente novamente mais tarde.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

  let body: { token?: unknown; newPassword?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Pedido inválido.' }, { status: 400 });
  }

  const token = typeof body.token === 'string' ? body.token.trim() : '';
  if (!token) {
    return NextResponse.json({ error: 'invalid_token', message: 'Link de recuperação inválido.' }, { status: 400 });
  }

  // Sondagem de validade, feita pela página antes de mostrar o formulário.
  if (body.newPassword === undefined) {
    return NextResponse.json({ valid: await isPasswordResetTokenValid(token) });
  }

  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
  const policyError = validateNewPassword(newPassword);
  if (policyError) {
    return NextResponse.json({ error: 'weak_password', message: policyError }, { status: 422 });
  }

  const result = await consumePasswordReset(token, newPassword);
  if (!result.ok) {
    if (result.error === 'invalid_token') {
      return NextResponse.json(
        { error: result.error, message: 'O link expirou ou já foi usado. Peça um novo.' },
        { status: 400 },
      );
    }
    if (result.error === 'server_misconfigured') {
      return NextResponse.json({ error: result.error, message: 'Autenticação não configurada no servidor.' }, { status: 503 });
    }
    return NextResponse.json({ error: result.error, message: 'Não foi possível atualizar a palavra-passe.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
