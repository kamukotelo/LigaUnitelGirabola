import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isAdminMailConfigured, sendClubAccessEmail } from '@/lib/admin-mail';
import {
  CLUB_COOKIE, CLUB_OTP_MINUTES, CLUB_SESSION_SECONDS, issueClubCode, revokeClubSession, verifyClubCode,
} from '@/lib/club-auth';
import { isNeonConfigured } from '@/lib/neon';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';

const unavailable = 'O acesso à Área de Clubes está temporariamente indisponível.';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ message: 'Origem do pedido não autorizada.' }, { status: 403 });
  }

  if (request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) {
    const form = await request.formData().catch(() => null);
    if (form?.get('action') !== 'logout') {
      return NextResponse.json({ message: 'Pedido inválido.' }, { status: 400 });
    }
    try {
      await revokeClubSession((await cookies()).get(CLUB_COOKIE)?.value);
      const response = NextResponse.redirect(new URL('/area-clubes', request.url), 303);
      response.cookies.delete(CLUB_COOKIE);
      return response;
    } catch {
      return NextResponse.json({ message: unavailable }, { status: 503 });
    }
  }

  const body = await request.json().catch(() => null);
  const action = body?.action;
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!['request', 'verify'].includes(action) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: 'Introduza um e-mail válido.' }, { status: 400 });
  }

  const rate = checkRateLimit(request, `club-access-${action}`, action === 'request' ? 15 : 40, 10 * 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ message: 'Demasiados pedidos. Tente novamente mais tarde.' }, {
      status: 429,
      headers: { 'Retry-After': String(rate.retryAfter) },
    });
  }

  if (!isNeonConfigured() || !process.env.ADMIN_SESSION_SECRET || (action === 'request' && !isAdminMailConfigured())) {
    return NextResponse.json({ message: unavailable }, { status: 503 });
  }

  try {
    if (action === 'request') {
      const code = await issueClubCode(email);
      if (code && !(await sendClubAccessEmail(email, code, CLUB_OTP_MINUTES))) {
        console.error('[club-access] Falha no envio do código.');
      }
      return NextResponse.json({ ok: true });
    }

    if (typeof body.code !== 'string' || !/^\d{6}$/.test(body.code)) {
      return NextResponse.json({ message: 'Introduza um código de 6 algarismos.' }, { status: 400 });
    }
    const token = await verifyClubCode(email, body.code);
    if (!token) {
      return NextResponse.json({ message: 'Código inválido ou expirado. Pode pedir um novo código.' }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set(CLUB_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: CLUB_SESSION_SECONDS,
    });
    return response;
  } catch {
    console.error('[club-access] Falha no serviço de autenticação dos clubes.');
    return NextResponse.json({ message: unavailable }, { status: 503 });
  }
}
