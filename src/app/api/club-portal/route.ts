import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, getAdminSession, OFFICIAL_ADMIN_ACCOUNTS } from '@/lib/admin-auth';
import {
  CLUB_PORTAL_COOKIE, CLUB_SESSION_SECONDS, getClubPortalSession, revokeClubPortalSession, signInClub,
} from '@/lib/club-auth';
import { CATEGORY_FIELDS, CLUB_ID_PATTERN, CLUB_STATUSES, isClubCategory, MAX_CLUB_ATTACHMENT_BYTES, MAX_CLUB_FILES } from '@/lib/club-submissions';
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
      if (form?.get('action') === 'review') {
        const admin = getAdminSession(jar.get(ADMIN_COOKIE)?.value);
        if (admin?.profile !== 'admin' || admin.mustChangePassword) return error('Acesso reservado à ANCAF.', 403);
        const id = String(form.get('id') ?? '');
        const status = String(form.get('status') ?? '');
        const assignee = String(form.get('assignee') ?? '') || null;
        const activity = String(form.get('activity') ?? '');
        const message = String(form.get('message') ?? '').trim();
        if (!CLUB_ID_PATTERN.test(id) || !Object.hasOwn(CLUB_STATUSES, status)
          || (assignee && !Object.hasOwn(OFFICIAL_ADMIN_ACCOUNTS, assignee))
          || !activity || activity.length > 64 || message.length > 5000 || (status === 'corrigir' && !message)) {
          return error('Verifique o estado, o responsável e a resposta. Indique as correcções quando aplicável.', 400);
        }
        const updated = await getNeonSql()`
          with review as (
            update public.ancaf_club_submissions
            set status = ${status}, assigned_to = ${assignee}, updated_at = now()
            where id = ${id} and coalesce(updated_at, created_at)::text = ${activity} returning id, revision
          )
          insert into public.ancaf_club_updates (submission_id, author, actor, status, revision, message)
          select id, 'ancaf', ${admin.email}, ${status}, revision, ${message} from review returning id
        `;
        return updated.length ? NextResponse.json({ ok: true }) : error('O pedido foi actualizado. Recarregue a página.', 409);
      }
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
    const id = String(form.get('id') ?? '');
    const category = String(form.get('category') ?? '');
    const subject = String(form.get('subject') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();
    const attachments = form.getAll('attachment').filter((file): file is File => file instanceof File && file.size > 0);
    if (attachments.length > MAX_CLUB_FILES || attachments.reduce((total, file) => total + file.size, 0) > MAX_CLUB_ATTACHMENT_BYTES) {
      return error('Pode enviar até cinco anexos, com 3 MB no total.', 413);
    }
    if (message.length > 5000 || (!message && !attachments.length)) return error('Acrescente uma mensagem ou um anexo.', 400);
    if (attachments.some((file) => !/\.(pdf|xlsx|docx|csv|png|jpe?g)$/i.test(file.name))) {
      return error('Use PDF, Excel, Word, CSV, PNG ou JPEG.', 400);
    }
    const files = JSON.stringify(await Promise.all(attachments.map(async (file) => ({
      filename: file.name.replace(/[\u0000-\u001f\u007f/\\]/g, '_').slice(0, 180),
      data: Buffer.from(await file.arrayBuffer()).toString('base64'),
    }))));
    const sql = getNeonSql();
    if (id) {
      if (!CLUB_ID_PATTERN.test(id)) return error('Referência inválida.', 400);
      const corrected = await sql`
        with correction as (
          update public.ancaf_club_submissions
          set revision = revision + 1, status = 'recebido', updated_at = now()
          where id = ${id} and team_id = ${session.team_id} and status = 'corrigir' returning id, revision
        ), log as (
          insert into public.ancaf_club_updates (submission_id, author, actor, status, revision, message)
          select id, 'clube', ${session.username}, 'recebido', revision, ${message} from correction
        ), uploaded as (
          insert into public.ancaf_club_files (submission_id, revision, filename, attachment)
          select id, revision, file.filename, decode(file.data, 'base64') from correction
          cross join jsonb_to_recordset(${files}::jsonb) as file(filename text, data text)
        )
        select id from correction
      `;
      return corrected.length ? NextResponse.json({ id }) : error('Este pedido não está disponível para correcção.', 409);
    }
    if (!isClubCategory(category) || !subject || subject.length > 150) return error('Preencha a categoria e o assunto.', 400);
    const details = Object.fromEntries(CATEGORY_FIELDS[category].map((field) => [field, String(form.get(field) ?? '').trim()]));
    if (Object.values(details).some((value) => !value || value.length > 150)
      || (details.round && !/^[1-9][0-9]{0,2}$/.test(details.round))) {
      return error('Preencha os dados da categoria. A jornada deve ser um número válido.', 400);
    }
    const [submission] = await sql`
      with submission as (
        insert into public.ancaf_club_submissions (team_id, username, category, subject, message, details)
        values (${session.team_id}, ${session.username}, ${category}, ${subject}, ${message}, ${JSON.stringify(details)}::jsonb)
        returning id
      ), uploaded as (
        insert into public.ancaf_club_files (submission_id, revision, filename, attachment)
        select id, 1, file.filename, decode(file.data, 'base64') from submission
        cross join jsonb_to_recordset(${files}::jsonb) as file(filename text, data text)
      )
      select id from submission
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
  if (!CLUB_ID_PATTERN.test(id)) return error('Anexo inválido.', 400);
  const [file] = await getNeonSql()`
    select filename, encode(attachment, 'base64') as data from (
      select f.filename, f.attachment from public.ancaf_club_files f
      join public.ancaf_club_submissions s on s.id = f.submission_id
      where f.id = ${id} and (${isAdmin}::boolean or s.team_id = ${club?.team_id ?? null})
      union all
      select filename, attachment from public.ancaf_club_submissions
      where id = ${id} and attachment is not null and (${isAdmin}::boolean or team_id = ${club?.team_id ?? null})
    ) attachments limit 1
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
