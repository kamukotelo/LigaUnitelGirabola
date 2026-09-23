import { after, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';
import { getNeonSql, isNeonConfigured } from '@/lib/neon';
import { ADMIN_COOKIE, getAdminSession } from '@/lib/admin-auth';
import { processCalendarUpdate } from '@/lib/match-update-automation';
import { isSameOriginRequest } from '@/lib/request-security';
import { PORTAL_DATA_TAG, PORTAL_DATA_MAX_AGE_SECONDS, revalidatePortalData } from '@/lib/portal-cache';

// ── Overrides de conteúdo publicados pela consola de administração ────────
// Guardados em `ancaf_configs` (chave/valor JSON) sob as chaves `override_*`.
// GET é público (o portal lê os overrides publicados); POST exige sessão de
// administração válida e escreve com o service_role.

// O GET é público e vive em cache (invalidado pelo POST); o POST continua a
// exigir sessão de administração e escreve com o service_role.
export const maxDuration = 60;

const SECTIONS = ['news', 'calendar', 'players', 'nominations', 'teams', 'site'] as const;
type Section = (typeof SECTIONS)[number];
const keyFor = (section: Section) => `override_${section}`;

async function loadOverrides(): Promise<Record<string, unknown>> {
  const overrides: Record<string, unknown> = {};
  try {
    const data = await getNeonSql().query(
      'select key, value from public.ancaf_configs where key = any($1::text[])',
      [SECTIONS.map(keyFor)],
    ) as { key: string; value: string }[];
    for (const row of data) {
      const section = row.key.replace(/^override_/, '');
      try {
        overrides[section] = JSON.parse(row.value);
      } catch {
        // valor corrompido — ignora a secção
      }
    }
  } catch {
    // Neon não configurado: devolve overrides vazios (o portal usa os dados base).
  }
  return overrides;
}

const getOverrides = unstable_cache(loadOverrides, ['portal-overrides'], {
  tags: [PORTAL_DATA_TAG],
  revalidate: PORTAL_DATA_MAX_AGE_SECONDS,
});

// GET /api/admin/overrides — devolve os overrides publicados (leitura pública,
// servida de cache e invalidada assim que o POST publica).
export async function GET() {
  return NextResponse.json({ overrides: await getOverrides() });
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

  if (!isNeonConfigured()) {
    return NextResponse.json(
      { error: 'server_misconfigured', message: 'Ligação ao Neon não configurada no servidor.' },
      { status: 503 },
    );
  }

  let sql;
  try {
    sql = getNeonSql();
  } catch {
    return NextResponse.json(
      { error: 'server_misconfigured', message: 'Neon não configurado no servidor.' },
      { status: 503 },
    );
  }

  const previousRows = section === 'calendar'
    ? await sql.query('select value from public.ancaf_configs where key = $1 limit 1', [keyFor('calendar')]) as { value: string }[]
    : [];

  let payloadValue = value;
  if (section === 'calendar' && previousRows[0]?.value) {
    try {
      const prev = JSON.parse(previousRows[0].value);
      if (prev && typeof prev === 'object' && !Array.isArray(prev) && typeof value === 'object' && value && !Array.isArray(value)) {
        payloadValue = { ...prev, ...value };
      }
    } catch {}
  }

  let serialized: string;
  try {
    serialized = JSON.stringify(payloadValue ?? {});
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Os dados enviados não são válidos.' }, { status: 400 });
  }
  if (serialized.length > 2_000_000) {
    return NextResponse.json({ error: 'payload_too_large', message: 'A secção excede o limite de 2 MB.' }, { status: 413 });
  }

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
        if (Number.isInteger(patch.round) && Number(patch.round) >= 1 && Number(patch.round) <= 30) row.round = patch.round;
        if (typeof patch.homeTeamId === 'string' && patch.homeTeamId) row.home_team_id = patch.homeTeamId;
        if (typeof patch.awayTeamId === 'string' && patch.awayTeamId) row.away_team_id = patch.awayTeamId;
        if (typeof patch.homeTeam === 'string' && patch.homeTeam) row.home_team = patch.homeTeam;
        if (typeof patch.awayTeam === 'string' && patch.awayTeam) row.away_team = patch.awayTeam;
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
      const beforeRows = await sql.query('select * from public.ancaf_matches where id = $1 limit 1', [matchId]) as Record<string, unknown>[];
      const before = beforeRows[0];
      if (!before) return NextResponse.json({ error: 'match_not_found', message: `Jogo ${matchId} não encontrado.` }, { status: 404 });
      const columns = Object.keys(row);
      const assignments = columns.map((name, index) => `${name} = $${index + 2}`).join(', ');
      try {
        await sql.query(`update public.ancaf_matches set ${assignments}, updated_at = timezone('utc', now()) where id = $1`, [matchId, ...columns.map((name) => row[name])]);
        await sql.query(
          `insert into public.ancaf_match_audit_log(match_id, actor_email, action, before_data, after_data)
           values ($1, $2, 'publish', $3::jsonb, $4::jsonb)`,
          [matchId, session.email, JSON.stringify(before), JSON.stringify({ ...before, ...row })],
        );
      } catch (matchError) {
        const message = matchError instanceof Error ? matchError.message : 'erro desconhecido';
        return NextResponse.json({ error: 'match_write_failed', message: `Não foi possível gravar o jogo ${matchId}: ${message}` }, { status: 500 });
      }
    }
  }

  try {
    await sql.query(
      `insert into public.ancaf_configs(key, value) values ($1, $2)
       on conflict(key) do update set value = excluded.value, updated_at = timezone('utc', now())`,
      [keyFor(section as Section), serialized],
    );
  } catch (error) {
    return NextResponse.json({ error: 'write_failed', message: error instanceof Error ? error.message : 'Erro de gravação.' }, { status: 500 });
  }

  // A publicação acabou de mudar o que o portal mostra: expira o instantâneo em
  // cache para que a próxima visita já veja o conteúdo novo.
  revalidatePortalData();

  if (section === 'calendar') {
    const previousValue = previousRows[0]?.value;
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
