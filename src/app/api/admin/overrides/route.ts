import { after, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { ADMIN_COOKIE, getAdminSession } from '@/lib/admin-auth';
import { processCalendarUpdate } from '@/lib/match-update-automation';
import { isSameOriginRequest } from '@/lib/request-security';

// ── Overrides de conteúdo publicados pela consola de administração ────────
// Guardados em `ancaf_configs` (chave/valor JSON) sob as chaves `override_*`.
// GET é público (o portal lê os overrides publicados); POST exige sessão de
// administração válida e escreve com o service_role.

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SECTIONS = ['news', 'calendar', 'players', 'nominations', 'teams', 'site'] as const;
type Section = (typeof SECTIONS)[number];
const keyFor = (section: Section) => `override_${section}`;

// GET /api/admin/overrides — devolve os overrides publicados (leitura pública).
export async function GET() {
  const overrides: Record<string, unknown> = {};
  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from('ancaf_configs')
      .select('key, value')
      .in('key', SECTIONS.map(keyFor));
    for (const row of (data ?? []) as { key: string; value: string }[]) {
      const section = row.key.replace(/^override_/, '');
      try {
        overrides[section] = JSON.parse(row.value);
      } catch {
        // valor corrompido — ignora a secção
      }
    }
  } catch {
    // Supabase não configurado: devolve overrides vazios (o portal usa os dados base).
  }
  return NextResponse.json({ overrides });
}

// POST /api/admin/overrides — publica o bloco de uma secção (exige sessão admin).
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'forbidden', message: 'Origem do pedido não autorizada.' }, { status: 403 });
  }
  const session = getAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!session || session.profile !== 'admin') {
    return NextResponse.json({ error: 'unauthorized', message: 'Sessão de administração inválida.' }, { status: 401 });
  }

  let body: { section?: unknown; value?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Corpo inválido.' }, { status: 400 });
  }

  const { section, value } = body;
  if (typeof section !== 'string' || !SECTIONS.includes(section as Section)) {
    return NextResponse.json({ error: 'bad_request', message: 'Secção desconhecida.' }, { status: 400 });
  }

  let serialized: string;
  try {
    serialized = JSON.stringify(value ?? {});
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Os dados enviados não são válidos.' }, { status: 400 });
  }
  if (serialized.length > 2_000_000) {
    return NextResponse.json({ error: 'payload_too_large', message: 'A secção excede o limite de 2 MB.' }, { status: 413 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceKey || serviceKey === 'your-supabase-service-role-key') {
    return NextResponse.json(
      { error: 'server_misconfigured', message: 'Chave de serviço do Supabase não configurada no servidor.' },
      { status: 503 },
    );
  }

  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: 'server_misconfigured', message: 'Supabase não configurado no servidor.' },
      { status: 503 },
    );
  }

  const previous = section === 'calendar'
    ? await admin.from('ancaf_configs').select('value').eq('key', keyFor('calendar')).maybeSingle()
    : null;

  // O calendário público continua a usar o bloco de overrides para reagir em
  // tempo real, mas a fonte operacional tem de ficar igualmente atualizada:
  // cada gravação do administrador sincroniza os campos essenciais da tabela
  // de jogos. Assim, ficha, resultados e futuras integrações partilham a
  // mesma data/estado que o calendário.
  if (section === 'calendar' && value && typeof value === 'object' && !Array.isArray(value)) {
    const rows = Object.entries(value as Record<string, Record<string, unknown>>)
      .filter(([matchId, patch]) => matchId && patch && typeof patch === 'object')
      .map(([matchId, patch]) => {
        const row: Record<string, unknown> = {};
        if (typeof patch.date === 'string') row.date = patch.date;
        if (typeof patch.stadium === 'string') row.stadium = patch.stadium;
        if (patch.status === 'scheduled' || patch.status === 'live' || patch.status === 'finished') row.status = patch.status;
        if (Number.isInteger(patch.homeScore) && Number(patch.homeScore) >= 0) row.home_score = patch.homeScore;
        if (Number.isInteger(patch.awayScore) && Number(patch.awayScore) >= 0) row.away_score = patch.awayScore;
        if (typeof patch.score === 'string') row.score = patch.score;
        else if (typeof row.home_score === 'number' && typeof row.away_score === 'number') row.score = `${row.home_score}-${row.away_score}`;
        if (typeof patch.halfTimeScore === 'string') row.half_time_score = patch.halfTimeScore || null;
        if (patch.scheduleStatus === 'official' || patch.scheduleStatus === 'provisional') row.schedule_status = patch.scheduleStatus;
        if (typeof patch.referee === 'string') row.referee = patch.referee || null;
        if (typeof patch.broadcaster === 'string') row.broadcaster = patch.broadcaster || null;
        if (Number.isInteger(patch.attendance) && Number(patch.attendance) >= 0) row.attendance = patch.attendance;
        if (Number.isInteger(patch.usefulTimeMinutes) && Number(patch.usefulTimeMinutes) >= 0 && Number(patch.usefulTimeMinutes) <= 120) row.useful_time_minutes = patch.usefulTimeMinutes;
        return { matchId, row };
      })
      .filter(({ row }) => Object.keys(row).length > 0);

    for (const { matchId, row } of rows) {
      const { data: before, error: readError } = await admin.from('ancaf_matches').select('*').eq('id', matchId).maybeSingle();
      if (readError || !before) return NextResponse.json({ error: 'match_not_found', message: `Jogo ${matchId} não encontrado.` }, { status: 404 });
      const { error: matchError } = await admin.from('ancaf_matches').update(row).eq('id', matchId);
      if (matchError) {
        return NextResponse.json({ error: 'match_write_failed', message: `Não foi possível gravar o jogo ${matchId}: ${matchError.message}` }, { status: 500 });
      }
      const { error: auditError } = await admin.from('ancaf_match_audit_log').insert({
        match_id: matchId, actor_email: session.email, action: 'publish', before_data: before, after_data: { ...before, ...row },
      });
      if (auditError) console.error('Falha ao auditar atualização de jogo:', auditError.message);
    }
  }

  const { error } = await admin
    .from('ancaf_configs')
    .upsert({ key: keyFor(section as Section), value: serialized }, { onConflict: 'key' });

  if (error) {
    return NextResponse.json({ error: 'write_failed', message: error.message }, { status: 500 });
  }
  if (section === 'calendar') {
    const previousValue = previous?.data?.value as string | null | undefined;
    after(async () => {
      await new Promise((resolve) => setTimeout(resolve, 15_000));
      try {
        await processCalendarUpdate(previousValue, value);
      } catch (automationError) {
        console.error('Falha na automação pós-jogo:', automationError);
      }
    });
  }

  return NextResponse.json({
    ok: true,
    automation: section === 'calendar' ? { scheduled: true, delaySeconds: 15 } : undefined,
  });
}
