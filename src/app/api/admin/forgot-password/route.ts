import { NextResponse } from 'next/server';
import { createPasswordReset, PASSWORD_RESET_TTL_SECONDS } from '@/lib/admin-auth';
import { isAdminMailConfigured, sendPasswordResetEmail } from '@/lib/admin-mail';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';

// POST /api/admin/forgot-password — emite um link de recuperação e envia-o
// por e-mail. A resposta é sempre genérica: não revela se a conta existe.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'forbidden', message: 'Origem do pedido não autorizada.' }, { status: 403 });
  }

  const rateLimit = checkRateLimit(request, 'admin-forgot-password', 3, 30 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'too_many_requests', message: 'Demasiados pedidos. Tente novamente mais tarde.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Pedido inválido.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || email.length > 254) {
    return NextResponse.json({ error: 'bad_request', message: 'Introduza um e-mail válido.' }, { status: 400 });
  }

  // Se o serviço de e-mail não estiver configurado, informa o utilizador
  // para que possa utilizar a Chave de Segurança Master ANCAF sem ficar bloqueado.
  if (!isAdminMailConfigured()) {
    return NextResponse.json({
      ok: true,
      emailSent: false,
      canUseRecoveryKey: true,
      message: 'O envio automático de e-mails não está ativo. Utilize a Chave de Segurança ANCAF para redefinir a palavra-passe.',
    });
  }

  const reset = await createPasswordReset(email);
  if (reset) {
    const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || new URL(request.url).origin;
    const link = `${origin}/reset-password?token=${encodeURIComponent(reset.token)}`;
    const sent = await sendPasswordResetEmail(
      reset.email,
      reset.name,
      link,
      Math.round(PASSWORD_RESET_TTL_SECONDS / 60),
    );
    if (!sent.ok) {
      // Só o servidor fica a saber; ao cliente responde-se como nos restantes casos.
      console.error('[forgot-password] envio falhou:', sent.reason);
    }
  }

  // Resposta deliberadamente genérica: não revela se a conta existe.
  return NextResponse.json({ ok: true, emailSent: true, canUseRecoveryKey: true });
}
