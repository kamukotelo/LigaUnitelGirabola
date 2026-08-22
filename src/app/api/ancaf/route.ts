import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { supabase } from '@/lib/supabase';
import {
  ANCAF_CALENDAR_SOURCE,
  CURRENT_SEASON_ID,
  getStandingsForSeason,
  MATCHES,
  SEASONS,
  TEAMS,
  TOP_SCORERS,
  UPCOMING_SEASON_ID,
  applyOfficialMatchSchedule,
  applyMatchOverrideMap,
  applySeasonHomeStadiums,
  getTeamById,
  Match,
  PLATFORM_MATCH_UPDATED_AT,
} from '@/lib/data';
import { PUBLISHED_ANCAF_CALENDAR_SOURCE, PUBLISHED_MATCHES_2026_27 } from '@/lib/published-ancaf-calendar';

// ── ENDPOINT ANCAF · GET /api/ancaf ──────────────────────────────────
// Serve o calendário ANCAF 2026/2027 persistido exatamente como foi recebido
// do FAF Calendar. O gerador local existe apenas como fallback de arranque.

export const dynamic = 'force-dynamic';

const DEFAULT_CAF_TEAM_IDS = ['petro', 'wiliete'];
const PLATFORM_CALENDAR_BASE_UPDATED_AT = PLATFORM_MATCH_UPDATED_AT;

function getCafTeamIds(): string[] {
  const configured = process.env.ANCAF_CAF_TEAM_IDS
    ?.split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  return configured?.length ? configured : DEFAULT_CAF_TEAM_IDS;
}

interface DbMatch {
  id: string;
  round: number;
  home_team_id: string;
  away_team_id: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  score: string | null;
  date: string;
  stadium: string;
  status: Match['status'];
}

function fromDbMatch(match: DbMatch): Match {
  const homeScore = Math.max(0, Math.trunc(match.home_score ?? 0));
  const awayScore = Math.max(0, Math.trunc(match.away_score ?? 0));
  return {
    id: match.id,
    round: match.round,
    homeTeamId: match.home_team_id,
    awayTeamId: match.away_team_id,
    homeTeam: match.home_team,
    awayTeam: match.away_team,
    homeScore,
    awayScore,
    score: match.status === 'finished' || match.status === 'live' ? `${homeScore}-${awayScore}` : undefined,
    date: match.date,
    stadium: match.stadium,
    status: match.status,
  };
}

function fingerprintMatches(matches: Match[]): string {
  return createHash('sha256')
    .update(JSON.stringify(matches.map(({ round, homeTeamId, awayTeamId, date }) => ({
      round,
      home_team_id: homeTeamId,
      away_team_id: awayTeamId,
      date: date.slice(0, 10),
    }))))
    .digest('hex');
}

const PUBLISHED_MATCHES_COMPARISON_FINGERPRINT = fingerprintMatches(PUBLISHED_MATCHES_2026_27);

function resolveFixture([homeId, awayId]: [string, string]) {
  const home = getTeamById(homeId);
  const away = getTeamById(awayId);
  return {
    homeTeamId: homeId,
    awayTeamId: awayId,
    homeTeam: home?.name ?? homeId,
    awayTeam: away?.name ?? awayId,
    stadium: home?.stadium ?? null,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') ?? 'calendar';
  const roundParam = searchParams.get('round');
  const matchIdParam = searchParams.get('id');

  // 1. Obter metadados e jogos persistidos do Supabase (com fallback).
  let activeSeedStr = ANCAF_CALENDAR_SOURCE.accessCode;
  let dynamicSource = {
    ...ANCAF_CALENDAR_SOURCE,
    championshipId: ANCAF_CALENDAR_SOURCE.accessCode,
    technicalSeed: PUBLISHED_ANCAF_CALENDAR_SOURCE.technicalSeed as string,
    fingerprint: PUBLISHED_ANCAF_CALENDAR_SOURCE.fingerprint as string,
  };
  let persistedMatches: Match[] = [];
  let calendarOverrides: Record<string, Partial<Match>> = {};
  let platformUpdatedAt = PLATFORM_CALENDAR_BASE_UPDATED_AT;
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
    try {
      const [{ data: configs, error: configError }, { data: dbMatches, error: matchesError }] = await Promise.all([
        supabase
        .from('ancaf_configs')
        .select('key, value, updated_at')
        .in('key', ['active_calendar_index', 'active_calendar_seed', 'active_calendar_fingerprint', 'override_calendar']),
        supabase
          .from('ancaf_matches')
          .select('id, round, home_team_id, away_team_id, home_team, away_team, home_score, away_score, score, date, stadium, status')
          .eq('season_id', '2026-27')
          .order('round')
          .order('id'),
      ]);
      
      if (!configError && configs) {
        const indexConfig = configs.find((config) => config.key === 'active_calendar_index');
        const seedConfig = configs.find((config) => config.key === 'active_calendar_seed');
        const fingerprintConfig = configs.find((config) => config.key === 'active_calendar_fingerprint');
        const overrideConfig = configs.find((config) => config.key === 'override_calendar');
        if (overrideConfig?.updated_at && new Date(overrideConfig.updated_at).getTime() > new Date(platformUpdatedAt).getTime()) {
          platformUpdatedAt = overrideConfig.updated_at;
        }
        if (overrideConfig?.value) {
          try {
            calendarOverrides = JSON.parse(overrideConfig.value) as Record<string, Partial<Match>>;
          } catch {
            calendarOverrides = {};
          }
        }
        
        const candidateMatches = !matchesError && dbMatches?.length === 240
          ? (dbMatches as DbMatch[]).map(fromDbMatch)
          : [];
        const matchesFingerprint = candidateMatches.length === 240
          ? fingerprintMatches(candidateMatches)
          : null;

        // Caso 1: As configurações na base de dados coincidem com o calendário oficial estático (Default/Arranque)
        const isOfficialStaticSource =
          indexConfig?.value === PUBLISHED_ANCAF_CALENDAR_SOURCE.accessCode &&
          seedConfig?.value === PUBLISHED_ANCAF_CALENDAR_SOURCE.technicalSeed &&
          fingerprintConfig?.value === PUBLISHED_ANCAF_CALENDAR_SOURCE.fingerprint;

        if (isOfficialStaticSource && matchesFingerprint === PUBLISHED_MATCHES_COMPARISON_FINGERPRINT) {
          activeSeedStr = seedConfig?.value ?? activeSeedStr;
          dynamicSource = {
            ...ANCAF_CALENDAR_SOURCE,
            accessCode: indexConfig?.value ?? ANCAF_CALENDAR_SOURCE.accessCode,
            championshipId: indexConfig?.value ?? ANCAF_CALENDAR_SOURCE.accessCode,
            technicalSeed: seedConfig?.value ?? PUBLISHED_ANCAF_CALENDAR_SOURCE.technicalSeed,
            fingerprint: fingerprintConfig?.value ?? PUBLISHED_ANCAF_CALENDAR_SOURCE.fingerprint,
            generatedAt: fingerprintConfig?.updated_at ?? indexConfig?.updated_at ?? seedConfig?.updated_at ?? ANCAF_CALENDAR_SOURCE.generatedAt,
          };
          persistedMatches = candidateMatches;
        }
        // Caso 2: Um novo sorteio foi feito (valores diferentes do oficial estático) e os jogos persitidos na DB estão completos e corretos
        else if (
          indexConfig?.value &&
          seedConfig?.value &&
          fingerprintConfig?.value &&
          matchesFingerprint === fingerprintConfig.value
        ) {
          activeSeedStr = seedConfig.value;
          dynamicSource = {
            ...ANCAF_CALENDAR_SOURCE,
            accessCode: indexConfig.value,
            championshipId: indexConfig.value,
            technicalSeed: seedConfig.value,
            fingerprint: fingerprintConfig.value,
            generatedAt: fingerprintConfig.updated_at ?? indexConfig.updated_at ?? seedConfig.updated_at ?? ANCAF_CALENDAR_SOURCE.generatedAt,
          };
          persistedMatches = candidateMatches;
        }
      }
    } catch (err) {
      console.error('Erro ao ler calendário do Supabase, usando fallback:', err);
    }
  }

  void activeSeedStr;

  const matches = applyMatchOverrideMap(
    applyOfficialMatchSchedule(applySeasonHomeStadiums(
      persistedMatches.length === 240
        ? persistedMatches
        : PUBLISHED_MATCHES_2026_27,
    )),
    calendarOverrides,
  );

  // A página de detalhe consulta exatamente a mesma coleção escolhida acima
  // (BD validada ou calendário oficial de fallback). Isto evita que um ID de
  // um novo sorteio abra o confronto antigo incluído no build.
  if (matchIdParam) {
    const match = matches.find((item) => item.id === matchIdParam);
    if (!match) {
      return NextResponse.json(
        { error: 'match_not_found', message: 'Jogo não encontrado no calendário ativo.' },
        { status: 404 },
      );
    }
    return NextResponse.json({ match, source: dynamicSource, generatedAt: dynamicSource.generatedAt });
  }

  // Validação do parâmetro round.
  let round: number | null = null;
  if (roundParam !== null) {
    const parsed = Number(roundParam);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > dynamicSource.rounds) {
      return NextResponse.json(
        {
          error: 'invalid_round',
          message: `O parâmetro "round" deve ser um inteiro entre 1 e ${dynamicSource.rounds}.`,
        },
        { status: 400 },
      );
    }
    round = parsed;
  }

  const season = SEASONS.find((s) => s.id === UPCOMING_SEASON_ID) ?? null;

  const meta = {
    source: dynamicSource,
    championshipId: dynamicSource.championshipId,
    season,
    teams: 16,
    generatedAt: dynamicSource.generatedAt,
    platformUpdatedAt,
  };

  // Contrato público consumido pelo portal institucional ancaf.co.ao.
  // Apenas jogos dos representantes CAF entram na faixa de resultados;
  // os restantes módulos continuam a ser fornecidos pela plataforma da Liga.
  if (format === 'portal') {
    const cafTeamIds = getCafTeamIds();
    const cafTeamSet = new Set(cafTeamIds);
    const activeResults = matches.filter((match) => match.status === 'finished');
    const resultPool = activeResults.length > 0 ? activeResults : MATCHES;
    const cafResults = resultPool
      .filter((match) =>
        match.status === 'finished' &&
        (cafTeamSet.has(match.homeTeamId) || cafTeamSet.has(match.awayTeamId)))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 12);
    const upcomingMatches = matches
      .filter((match) => match.status !== 'finished')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 8);

    return NextResponse.json({
      ...meta,
      integration: {
        consumer: 'https://www.ancaf.co.ao',
        provider: 'Liga Unitel Girabola',
        cafTeamIds,
      },
      cafTeams: cafTeamIds
        .map((teamId) => TEAMS.find((team) => team.id === teamId))
        .filter(Boolean),
      cafResults,
      standings: getStandingsForSeason(CURRENT_SEASON_ID),
      scorers: TOP_SCORERS,
      upcomingMatches,
    });
  }

  // Formato "matches": jogos já construídos com data/hora e estádio.
  if (format === 'matches') {
    const filteredMatches = round
      ? matches.filter((m) => m.round === round)
      : matches;
    return NextResponse.json({
      ...meta,
      count: filteredMatches.length,
      matches: filteredMatches,
    });
  }

  // Estruturar em SeasonRound
  interface SeasonRound {
    round: number;
    dates: string[];
    note?: string;
    fixtures: [string, string][];
  }

  const calendar: SeasonRound[] = Array.from(
    matches.reduce((map, m) => {
      const r = map.get(m.round) ?? { round: m.round, dates: [], fixtures: [] };
      const day = m.date.split('T')[0];
      if (!r.dates.includes(day)) r.dates.push(day);
      if (m.scheduleStatus === 'provisional') {
        r.note = 'Datas provisórias recebidas da API e sujeitas a edição pela Direção de Competições da ANCAF.';
      }
      r.fixtures.push([m.homeTeamId, m.awayTeamId]);
      map.set(m.round, r);
      return map;
    }, new Map<number, SeasonRound>()).values(),
  ).sort((a, b) => a.round - b.round);

  // Formato "calendar" (default): jornadas com confrontos resolvidos.
  const rounds = (round
    ? calendar.filter((r) => r.round === round)
    : calendar
  ).map((r) => ({
    round: r.round,
    dates: r.dates,
    note: r.note ?? null,
    fixtures: r.fixtures.map(resolveFixture),
  }));

  return NextResponse.json({
    ...meta,
    count: rounds.length,
    rounds,
  });
}
