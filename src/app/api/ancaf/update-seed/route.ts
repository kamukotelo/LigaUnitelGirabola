import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { TEAMS } from '@/lib/data';
import { PUBLISHED_ANCAF_CALENDAR_SOURCE } from '@/lib/published-ancaf-calendar';

const SYNC_TOKEN = process.env.ANCAF_SYNC_TOKEN;

export const dynamic = 'force-dynamic';

const FAF_TO_PORTAL_TEAM_ID: Record<string, string> = {
  sao_salvador: 'saosalvador',
  petro_luanda: 'petro',
  acad_lobito: 'lobito',
  wiliete_benguela: 'wiliete',
  rec_libolo: 'libolo',
  d_agosto: 'dago',
  fc_cabinda: 'cabinda',
  d_huila: 'desphuila',
  cr_caala: 'caala',
  bravos_maquis: 'bravos',
  fc_luanda: 'fcluanda',
  kabuscorp_palanca: 'kabuscorp',
  interclube: 'interclube',
  cd_lunda_sul: 'lundasul',
  estrela_1_maio: 'primeiromaio',
  sagrada_esperanca: 'sagrada',
};

// Tem de coincidir exatamente com a fonte oficial da pool FAF 2026/27:
// jornadas CAF + abertura/fecho de volta. J14 é permitida e J5 é proibida.
const FORBIDDEN_CLASSIC_ROUNDS = new Set([1, 2, 3, 4, 5, 7, 8, 12, 13, 15, 16, 17, 18, 19, 20, 21, 25, 26, 29, 30]);

interface IncomingMatch {
  round?: unknown;
  homeTeamId?: unknown;
  awayTeamId?: unknown;
  date?: unknown;
}

function officialPublishedResponse(
  parsedCalendarIndex: number,
  parsedTechnicalSeed: number,
  fingerprint: string,
) {
  if (
    String(parsedCalendarIndex) !== PUBLISHED_ANCAF_CALENDAR_SOURCE.accessCode ||
    String(parsedTechnicalSeed) !== PUBLISHED_ANCAF_CALENDAR_SOURCE.technicalSeed ||
    fingerprint !== PUBLISHED_ANCAF_CALENDAR_SOURCE.fingerprint
  ) {
    return null;
  }

  return NextResponse.json({
    status: 'ok',
    message: 'Calendário oficial publicado no portal LigaUnitel com sucesso.',
    championshipId: String(parsedCalendarIndex),
    calendarIndex: String(parsedCalendarIndex),
    technicalSeed: String(parsedTechnicalSeed),
    fingerprint,
    persisted: { database: false, officialSource: true, matches_count: 240 },
  });
}

function normaliseCalendar(matches: unknown) {
  if (!Array.isArray(matches) || matches.length !== 240) {
    throw new Error('O calendário deve conter exatamente 240 jogos');
  }

  const portalTeams = new Map(TEAMS.map((team) => [team.id, team]));
  const rounds = new Map<number, Set<string>>();
  const pairings = new Map<string, string[]>();

  const normalised = matches.map((raw, index) => {
    const match = raw as IncomingMatch;
    const round = Number(match.round);
    const homeTeamId = FAF_TO_PORTAL_TEAM_ID[String(match.homeTeamId)] ?? String(match.homeTeamId);
    const awayTeamId = FAF_TO_PORTAL_TEAM_ID[String(match.awayTeamId)] ?? String(match.awayTeamId);
    const home = portalTeams.get(homeTeamId);
    const away = portalTeams.get(awayTeamId);
    const date = String(match.date);

    if (!Number.isInteger(round) || round < 1 || round > 30) {
      throw new Error(`Jornada inválida no jogo ${index + 1}`);
    }
    if (!home || !away || homeTeamId === awayTeamId) {
      throw new Error(`Clubes inválidos no jogo ${index + 1}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`Data inválida no jogo ${index + 1}`);
    }

    const roundTeams = rounds.get(round) ?? new Set<string>();
    if (roundTeams.has(homeTeamId) || roundTeams.has(awayTeamId)) {
      throw new Error(`Um clube aparece mais de uma vez na Jornada ${round}`);
    }
    roundTeams.add(homeTeamId);
    roundTeams.add(awayTeamId);
    rounds.set(round, roundTeams);

    const pairKey = [homeTeamId, awayTeamId].sort().join(':');
    const orientations = pairings.get(pairKey) ?? [];
    orientations.push(`${homeTeamId}:${awayTeamId}`);
    pairings.set(pairKey, orientations);

    return {
      round,
      homeTeamId,
      awayTeamId,
      homeTeam: home.name,
      awayTeam: away.name,
      date: `${date}T15:00:00+01:00`,
      stadium: home.stadium,
    };
  });

  const completeRounds = rounds.size === 30 && Array.from(rounds.values()).every((teams) => teams.size === 16);
  const completePairings = pairings.size === 120 && Array.from(pairings.values()).every(
    (orientations) => orientations.length === 2 && orientations[0] !== orientations[1],
  );
  if (!completeRounds || !completePairings) {
    throw new Error('O calendário não forma 30 jornadas completas em casa e fora');
  }

  const classicRounds = normalised
    .filter((match) => new Set([match.homeTeamId, match.awayTeamId]).has('petro') &&
      new Set([match.homeTeamId, match.awayTeamId]).has('dago'))
    .map((match) => match.round);
  if (classicRounds.some((round) => FORBIDDEN_CLASSIC_ROUNDS.has(round))) {
    throw new Error(`O clássico Petro de Luanda–1.º de Agosto não pode ocorrer nas jornadas reservadas: ${classicRounds.join(' e ')}`);
  }

  for (let round = 1; round <= 30; round++) {
    const occupiedStadiums = new Set<string>();
    for (const match of normalised.filter((item) => item.round === round)) {
      if (occupiedStadiums.has(match.stadium)) {
        throw new Error(`Conflito de estádio partilhado na Jornada ${round}: ${match.stadium}`);
      }
      occupiedStadiums.add(match.stadium);
    }
  }

  for (const teamId of portalTeams.keys()) {
    const sequence = normalised
      .filter((match) => match.homeTeamId === teamId || match.awayTeamId === teamId)
      .sort((a, b) => a.round - b.round)
      .map((match) => match.homeTeamId === teamId ? 'casa' : 'fora');
    for (let index = 2; index < sequence.length; index++) {
      if (sequence[index] === sequence[index - 1] && sequence[index] === sequence[index - 2]) {
        throw new Error(`Mando desequilibrado: ${teamId} tem mais de 2 jogos seguidos em ${sequence[index]}`);
      }
    }
  }

  return normalised.sort((a, b) => a.round - b.round);
}

export async function POST(request: Request) {
  try {
    if (!SYNC_TOKEN) {
      return NextResponse.json(
        { error: 'server_misconfigured', message: 'ANCAF_SYNC_TOKEN não configurado' },
        { status: 503 },
      );
    }

    // 1. Authenticate Request
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'unauthorized', message: 'Token de autorização em falta' }, { status: 401 });
    }

    const token = authHeader.substring(7).trim();
    if (token !== SYNC_TOKEN) {
      return NextResponse.json({ error: 'unauthorized', message: 'Token de autorização inválido' }, { status: 401 });
    }

    // 2. Parse Body
    const { calendarIndex, technicalSeed, seasonId, matches } = await request.json();
    const parsedCalendarIndex = Number(calendarIndex);
    const parsedTechnicalSeed = Number(technicalSeed);
    if (
      !Number.isSafeInteger(parsedCalendarIndex) ||
      parsedCalendarIndex < 1 ||
      parsedCalendarIndex > 8000 ||
      !Number.isSafeInteger(parsedTechnicalSeed) ||
      parsedTechnicalSeed <= 0 ||
      seasonId !== '2026-27'
    ) {
      return NextResponse.json({ error: 'bad_request', message: 'Metadados do sorteio inválidos' }, { status: 400 });
    }

    let matches2026_27: ReturnType<typeof normaliseCalendar>;
    try {
      matches2026_27 = normaliseCalendar(matches);
    } catch (error) {
      return NextResponse.json(
        { error: 'bad_request', message: error instanceof Error ? error.message : String(error) },
        { status: 400 },
      );
    }

    const dbMatches = matches2026_27.map((m, index) => ({
      id: `m27-${m.round}-${(index % 8) + 1}`,
      season_id: '2026-27',
      round: m.round,
      home_team_id: m.homeTeamId,
      away_team_id: m.awayTeamId,
      home_team: m.homeTeam,
      away_team: m.awayTeam,
      home_score: 0,
      away_score: 0,
      score: null,
      date: m.date,
      stadium: m.stadium,
      status: 'scheduled'
    }));
    // IMPORTANTE: o fingerprint tem de usar a data só com o dia (YYYY-MM-DD),
    // porque a coluna `date` é timestamptz e o Postgres normaliza o fuso ao
    // reler — a rota de leitura (GET /api/ancaf, fingerprintMatches) já usa
    // date.slice(0,10). Se gravarmos aqui com a data+hora completa, o
    // fingerprint guardado NUNCA coincide com o recalculado na leitura, e um
    // sorteio novo é descartado (o portal volta a mostrar o calendário nº1).
    const fingerprint = createHash('sha256')
      .update(JSON.stringify(dbMatches.map(({ round, home_team_id, away_team_id, date }) => ({
        round,
        home_team_id,
        away_team_id,
        date: date.slice(0, 10),
      }))))
      .digest('hex');

    const officialResponse = officialPublishedResponse(parsedCalendarIndex, parsedTechnicalSeed, fingerprint);
    // Mesmo quando o pedido coincide com o fallback estático, persistimos os
    // 240 jogos se a base estiver configurada. Caso contrário, um calendário
    // dinâmico anterior continuaria ativo e o endpoint devolveria um falso
    // sucesso. O fallback só é usado em ambientes realmente sem Supabase.
    let client: ReturnType<typeof getSupabaseAdmin>;
    try {
      client = getSupabaseAdmin();
    } catch (error) {
      if (officialResponse) return officialResponse;
      throw error;
    }

    // Os jogos são a fonte de verdade. A configuração ativa só muda depois de
    // os 240 registos terem sido persistidos e verificados.
    const { error: matchErrorAncaf } = await client.from('ancaf_matches').upsert(dbMatches, { onConflict: 'id' });
    if (matchErrorAncaf) {
      console.error('Falha ao inserir jogos na tabela ancaf_matches:', matchErrorAncaf.message);
      return NextResponse.json(
        { error: 'database_error', message: 'Não foi possível guardar o calendário oficial' },
        { status: 503 },
      );
    }

    const { error: matchErrorLiga } = await client.from('liga_matches').upsert(dbMatches, { onConflict: 'id' });
    if (matchErrorLiga) {
      console.error('Falha ao inserir jogos na tabela liga_matches:', matchErrorLiga.message);
    }

    const { count, error: verifyError } = await client
      .from('ancaf_matches')
      .select('id', { count: 'exact', head: true })
      .eq('season_id', '2026-27');
    if (verifyError || count !== 240) {
      return NextResponse.json(
        { error: 'database_error', message: `Persistência incompleta: ${count ?? 0}/240 jogos` },
        { status: 503 },
      );
    }

    const updatedAt = new Date().toISOString();
    const configRows = [
      { key: 'active_calendar_index', value: String(parsedCalendarIndex), updated_at: updatedAt },
      { key: 'active_calendar_seed', value: String(parsedTechnicalSeed), updated_at: updatedAt },
      { key: 'active_calendar_fingerprint', value: fingerprint, updated_at: updatedAt },
    ];
    const { error: configError } = await client.from('ancaf_configs').upsert(configRows, { onConflict: 'key' });
    if (configError) {
      return NextResponse.json(
        { error: 'database_error', message: 'Não foi possível ativar o calendário persistido' },
        { status: 503 },
      );
    }
    await client.from('liga_configs').upsert(configRows, { onConflict: 'key' });

    return NextResponse.json({
      status: 'ok',
      message: 'Calendário oficial atualizado e povoado com sucesso para 2026/2027',
      championshipId: String(parsedCalendarIndex),
      calendarIndex: String(parsedCalendarIndex),
      technicalSeed: String(parsedTechnicalSeed),
      fingerprint,
      persisted: { database: true, matches_count: count },
    });

  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'server_error', message: err instanceof Error ? err.message : 'Erro interno no servidor' },
      { status: 500 },
    );
  }
}
