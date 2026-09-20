import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getAdminSession } from '@/lib/admin-auth';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';
import { getNeonSql } from '@/lib/neon';
import { revalidatePortalData } from '@/lib/portal-cache';
import { validateMatchFile, parseFcmsPdfBytes, type MatchFilePayload } from '@/lib/match-file-parser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'forbidden', message: 'Origem não autorizada.' }, { status: 403 });
  const rl = checkRateLimit(request, 'admin-match-file-load', 40, 15 * 60 * 1000);
  if (!rl.allowed) return NextResponse.json({ error: 'too_many_requests', message: 'Demasiados pedidos. Tente mais tarde.' }, { status: 429 });
  const session = getAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!session || session.profile !== 'admin') return NextResponse.json({ error: 'unauthorized', message: 'Sessão de administração inválida.' }, { status: 401 });

  let rawPayload: unknown;
  let targetMatchId: string | null = null;
  const contentType = request.headers.get('content-type') || '';
  try {
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');
      const target = form.get('targetMatchId');
      targetMatchId = typeof target === 'string' ? target : null;
      if (!(file instanceof File)) return NextResponse.json({ error: 'bad_request', message: 'Nenhum ficheiro recebido.' }, { status: 400 });
      if (file.size > MAX_FILE_BYTES) return NextResponse.json({ error: 'payload_too_large', message: 'O ficheiro excede o limite de 10 MB.' }, { status: 413 });
      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') rawPayload = await parseFcmsPdfBytes(new Uint8Array(await file.arrayBuffer()));
      else if (file.name.toLowerCase().endsWith('.json') || file.type === 'application/json') rawPayload = JSON.parse(await file.text());
      else return NextResponse.json({ error: 'bad_request', message: 'Formato não suportado. Envie um ficheiro .json ou .pdf do FCMS.' }, { status: 400 });
    } else {
      const body = await request.json();
      rawPayload = body.payload ?? body;
      targetMatchId = typeof body.targetMatchId === 'string' ? body.targetMatchId : null;
    }
  } catch (error) {
    return NextResponse.json({ error: 'parse_error', message: `Erro ao ler o ficheiro: ${(error as Error).message}` }, { status: 400 });
  }

  const validation = validateMatchFile(rawPayload);
  if (new URL(request.url).searchParams.get('preview') === '1') return NextResponse.json({ ok: true, validation });
  if (!validation.valido) return NextResponse.json({ error: 'validation_failed', message: 'O ficheiro contém erros e não pode ser publicado.', validation }, { status: 422 });

  const matchId = targetMatchId || validation.matchId;
  if (!matchId) return NextResponse.json({ error: 'match_not_found', message: 'Selecione o jogo de destino.' }, { status: 422 });
  const sql = getNeonSql();
  const matches = await sql.query('select home_team_id, away_team_id from public.ancaf_matches where id = $1', [matchId]) as Array<{ home_team_id: string; away_team_id: string }>;
  const match = matches[0];
  if (!match) return NextResponse.json({ error: 'match_not_found', message: `Jogo ${matchId} não encontrado.` }, { status: 404 });

  const payload: MatchFilePayload = { ...validation.payloadNormalizado, matchId };
  if (payload.equipas.casa.id !== match.home_team_id || payload.equipas.fora.id !== match.away_team_id) {
    return NextResponse.json({ error: 'fixture_mismatch', message: 'As equipas do ficheiro não correspondem ao jogo de destino. Nenhum dado foi alterado.' }, { status: 409 });
  }

  let result: unknown;
  try {
    const rows = await sql.query(
      'select public.ancaf_publish_match_file($1, $2, $3::jsonb) as result',
      [matchId, session.email, JSON.stringify(payload)],
    ) as Array<{ result: unknown }>;
    result = rows[0]?.result;
  } catch (error) {
    return NextResponse.json({ error: 'publish_failed', message: `Nenhum dado foi alterado: ${(error as Error).message}` }, { status: 500 });
  }

  revalidatePortalData();
  return NextResponse.json({ ok: true, message: `Jogo ${matchId} atualizado com sucesso no site!`, matchId, score: `${payload.resultado.casa}-${payload.resultado.fora}`, summary: result });
}
