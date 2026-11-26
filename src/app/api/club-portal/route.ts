import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, getAdminSession } from '@/lib/admin-auth';
import {
  CLUB_PORTAL_COOKIE, CLUB_SESSION_SECONDS, getClubPortalSession, revokeClubPortalSession, signInClub,
} from '@/lib/club-auth';
import { isClubCategory, MAX_CLUB_ATTACHMENT_BYTES } from '@/lib/club-submissions';
import { getNeonSql } from '@/lib/neon';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';

function error(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return error('Origem não autorizada.', 403);
  const limit = checkRateLimit(request, 'club-portal', 45, 15 * 60_000);
  if (!limit.allowed) return error('Demasiados pedidos. Tente mais tarde.', 429);

  const jar = await cookies();
  const token = jar.get(CLUB_PORTAL_COOKIE)?.value;
  const contentType = request.headers.get('content-type') ?? '';
  try {
    if (contentType.startsWith('application/json')) {
      const body = await request.json().catch(() => null);
      const username = typeof body?.username === 'string' ? body.username.trim().toUpperCase() : '';
      const password = typeof body?.password === 'string' ? body.password : '';
      if (!/^[A-Z0-9]{2,12}$/.test(username) || !password || Buffer.byteLength(password) > 72 || password.includes('\0')) {
        return error('Utilizador ou palavra-passe inválidos.', 401);
      }
      const sessionToken = await signInClub(username, password);
      if (!sessionToken) return error('Utilizador ou palavra-passe inválidos, ou limite de tentativas atingido.', 401);
      const response = NextResponse.json({ ok: true });
      response.cookies.set(CLUB_PORTAL_COOKIE, sessionToken, {
        httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict',
        path: '/', maxAge: CLUB_SESSION_SECONDS,
      });
      return response;
    }

    if (contentType.startsWith('application/x-www-form-urlencoded')) {
      const form = await request.formData().catch(() => null);
      if (form?.get('action') !== 'logout') return error('Pedido inválido.', 400);
      await revokeClubPortalSession(token);
      const response = NextResponse.redirect(new URL('/area-clubes', request.url), 303);
      response.cookies.delete(CLUB_PORTAL_COOKIE);
      return response;
    }

    if (!contentType.startsWith('multipart/form-data')) return error('Pedido inválido.', 400);
    const session = await getClubPortalSession(token);
    if (!session) return error('Inicie sessão para enviar documentos.', 401);
    if (Number(request.headers.get('content-length')) > MAX_CLUB_ATTACHMENT_BYTES + 50_000) {
      return error('O anexo não pode exceder 3 MB.', 413);
    }
    const form = await request.formData().catch(() => null);
    if (!form) return error('Pedido inválido.', 400);
    const category = String(form.get('category') ?? '');
    const subject = String(form.get('subject') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();
    const file = form.get('attachment');
    const attachment = file instanceof File && file.size > 0 ? file : null;
    if (!isClubCategory(category) || !subject || subject.length > 150 || message.length > 5000 || (!message && !attachment)) {
      return error('Preencha o assunto e acrescente uma mensagem ou um anexo.', 400);
    }
    if (attachment && attachment.size > MAX_CLUB_ATTACHMENT_BYTES) return error('O anexo não pode exceder 3 MB.', 413);
    if (attachment && !/\.(pdf|xlsx|docx|csv|png|jpe?g)$/i.test(attachment.name)) {
      return error('Use PDF, Excel, Word, CSV, PNG ou JPEG.', 400);
    }
    const filename = attachment?.name.replace(/[\u0000-\u001f\u007f/\\]/g, '_').slice(0, 180) ?? null;
    const bytes = attachment ? Buffer.from(await attachment.arrayBuffer()).toString('base64') : null;
    const [submission] = await getNeonSql()`
      insert into public.ancaf_club_submissions (team_id, username, category, subject, message, filename, attachment)
        values (${session.team_id}, ${session.username}, ${category}, ${subject}, ${message}, ${filename}, decode(${bytes}, 'base64'))
      returning id
    `;
    return NextResponse.json({ id: submission.id }, { status: 201 });
  } catch {
    console.error('[club-portal] Falha ao processar pedido.');
    return error('A Área de Clubes está temporariamente indisponível.', 503);
  }
}

export async function GET(request: Request) {
  const jar = await cookies();
  const admin = getAdminSession(jar.get(ADMIN_COOKIE)?.value);
  const isAdmin = admin?.profile === 'admin' && !admin.mustChangePassword;
  const club = isAdmin ? null : await getClubPortalSession(jar.get(CLUB_PORTAL_COOKIE)?.value);
  if (!isAdmin && !club) return error('Inicie sessão para descarregar anexos.', 403);
  const id = new URL(request.url).searchParams.get('anexo') ?? '';
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) return error('Anexo inválido.', 400);
  const [file] = await getNeonSql()`
    select filename, encode(attachment, 'base64') as data
    from public.ancaf_club_submissions where id = ${id} and attachment is not null
      and (${isAdmin}::boolean or team_id = ${club?.team_id ?? null})
  `;
  if (!file) return error('Anexo não encontrado.', 404);
  return new Response(new Uint8Array(Buffer.from(file.data, 'base64')), {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.filename).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16))}`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
