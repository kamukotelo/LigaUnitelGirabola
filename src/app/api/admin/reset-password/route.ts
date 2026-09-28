import { NextResponse } from 'next/server';
import {
  consumePasswordReset, isPasswordResetTokenValid,
  resetAdminPasswordWithRecoveryKey, verifyRecoveryKey, OFFICIAL_ADMIN_ACCOUNTS,
} from '@/lib/admin-auth';
import { validateNewPassword } from '@/lib/password-policy';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';

// POST /api/admin/reset-password — define a palavra-passe nova. Suporta:
// 1. Link recebido por e-mail (via token de uso único)
// 2. Chave de Segurança ANCAF (via recoveryKey + e-mail de administrador oficial)
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

  let body: { token?: unknown; email?: unknown; recoveryKey?: unknown; newPassword?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Pedido inválido.' }, { status: 400 });
  }

  const token = typeof body.token === 'string' ? body.token.trim() : '';
  const recoveryKey = typeof body.recoveryKey === 'string' ? body.recoveryKey.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

  // ── FLUXO A: Chave de Segurança ANCAF ─────────────────────────────
  if (recoveryKey) {
    if (!verifyRecoveryKey(recoveryKey)) {
      return NextResponse.json({ error: 'invalid_key', message: 'Chave de segurança ANCAF inválida.' }, { status: 401 });
    }
    if (!email || !OFFICIAL_ADMIN_ACCOUNTS[email]) {
      return NextResponse.json({ error: 'unauthorized_account', message: 'E-mail não reconhecido como administrador oficial.' }, { status: 403 });
    }

    // Sondagem de validade da chave
    if (body.newPassword === undefined) {
      return NextResponse.json({ valid: true, mode: 'recovery_key' });
    }

    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
    const policyError = validateNewPassword(newPassword);
    if (policyError) {
      return NextResponse.json({ error: 'weak_password', message: policyError }, { status: 422 });
    }

    const result = await resetAdminPasswordWithRecoveryKey(email, newPassword, recoveryKey);
    if (!result.ok) {
      return NextResponse.json({ error: result.error, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, email: result.email, mode: 'recovery_key' });
  }

  // ── FLUXO B: Link com Token Criptográfico ─────────────────────────
  if (!token) {
    return NextResponse.json({ error: 'invalid_request', message: 'Forneça um link de recuperação ou a Chave de Segurança ANCAF.' }, { status: 400 });
  }

  // Sondagem de validade do token
  if (body.newPassword === undefined) {
    return NextResponse.json({ valid: await isPasswordResetTokenValid(token), mode: 'token' });
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
        { error: result.error, message: 'O link expirou ou já foi usado. Peça um novo ou utilize a Chave de Segurança.' },
        { status: 400 },
      );
    }
    if (result.error === 'server_misconfigured') {
      return NextResponse.json({ error: result.error, message: 'Autenticação não configurada no servidor.' }, { status: 503 });
    }
    return NextResponse.json({ error: result.error, message: 'Não foi possível atualizar a palavra-passe.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, email: result.email, mode: 'token' });
}
