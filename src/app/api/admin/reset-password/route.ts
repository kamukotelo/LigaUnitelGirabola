import { NextResponse } from 'next/server';
import {
  consumePasswordReset,
  isPasswordResetTokenValid,
  resetAdminPasswordWithRecoveryKey,
  verifyRecoveryKey,
} from '@/lib/admin-auth';
import { validateNewPassword } from '@/lib/password-policy';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';

// POST /api/admin/reset-password — define a nova palavra-passe através de um
// link criptográfico recebido por e-mail OU através da Chave de Segurança ANCAF.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'forbidden', message: 'Origem do pedido não autorizada.' }, { status: 403 });
  }

  const rateLimit = checkRateLimit(request, 'admin-reset-password', 15, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'too_many_requests', message: 'Demasiadas tentativas. Tente novamente mais tarde.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

  let body: { token?: unknown; recoveryKey?: unknown; email?: unknown; newPassword?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Pedido inválido.' }, { status: 400 });
  }

  const token = typeof body.token === 'string' ? body.token.trim() : '';
  const recoveryKey = typeof body.recoveryKey === 'string' ? body.recoveryKey.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (!token && !recoveryKey) {
    return NextResponse.json(
      { error: 'invalid_request', message: 'Indique o link de recuperação ou a Chave de Segurança ANCAF.' },
      { status: 400 },
    );
  }

  // Modo 1: Chave de Segurança ANCAF (Master Recovery Key)
  if (recoveryKey) {
    if (!email) {
      return NextResponse.json({ error: 'missing_email', message: 'Indique o e-mail da conta.' }, { status: 400 });
    }

    // Sondagem de validade da chave
    if (body.newPassword === undefined) {
      return NextResponse.json({ valid: verifyRecoveryKey(recoveryKey) });
    }

    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
    const policyError = validateNewPassword(newPassword);
    if (policyError) {
      return NextResponse.json({ error: 'weak_password', message: policyError }, { status: 422 });
    }

    const result = await resetAdminPasswordWithRecoveryKey(email, recoveryKey, newPassword);
    if (!result.ok) {
      if (result.error === 'invalid_key') {
        return NextResponse.json({ error: result.error, message: 'Chave de Segurança ANCAF incorreta.' }, { status: 400 });
      }
      if (result.error === 'account_not_found') {
        return NextResponse.json({ error: result.error, message: 'Conta de administrador não encontrada.' }, { status: 404 });
      }
      if (result.error === 'server_misconfigured') {
        return NextResponse.json({ error: result.error, message: 'Serviço de autenticação indisponível.' }, { status: 503 });
      }
      return NextResponse.json({ error: result.error, message: 'Não foi possível atualizar a palavra-passe.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  // Modo 2: Token recebido por e-mail
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
