import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';

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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'server_misconfigured', message: 'Recuperação indisponível.' }, { status: 503 });
  }

  const origin = new URL(request.url).origin;
  const authClient = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  await authClient.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/reset-password` });

  // Resposta deliberadamente genérica: não revela se a conta existe.
  return NextResponse.json({ ok: true });
}
