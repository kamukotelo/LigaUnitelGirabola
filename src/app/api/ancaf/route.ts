import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateGirabolaCalendar } from '@/lib/ancaf-engine';
import {
  ANCAF_CALENDAR_SOURCE,
  SEASONS,
  UPCOMING_SEASON_ID,
  getTeamById,
  Match,
} from '@/lib/data';

// ── ENDPOINT ANCAF · GET /api/ancaf ──────────────────────────────────
// Serve o calendário ANCAF 2026/2027 persistido exatamente como foi recebido
// do FAF Calendar. O gerador local existe apenas como fallback de arranque.

export const dynamic = 'force-dynamic';

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
  return {
    id: match.id,
    round: match.round,
    homeTeamId: match.home_team_id,
    awayTeamId: match.away_team_id,
    homeTeam: match.home_team,
    awayTeam: match.away_team,
    homeScore: match.home_score ?? 0,
    awayScore: match.away_score ?? 0,
    score: match.score ?? undefined,
    date: match.date,
    stadium: match.stadium,
    status: match.status,
  };
}

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

  // 1. Obter metadados e jogos persistidos do Supabase (com fallback).
  let activeSeedStr = ANCAF_CALENDAR_SOURCE.accessCode;
  let dynamicSource = { ...ANCAF_CALENDAR_SOURCE };
  let persistedMatches: Match[] = [];
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
    try {
      const [{ data: configs, error: configError }, { data: dbMatches, error: matchesError }] = await Promise.all([
        supabase
        .from('ancaf_configs')
        .select('key, value, updated_at')
        .in('key', ['active_calendar_index', 'active_calendar_seed']),
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
        activeSeedStr = seedConfig?.value ?? activeSeedStr;
        dynamicSource = {
          ...ANCAF_CALENDAR_SOURCE,
          accessCode: indexConfig?.value ?? ANCAF_CALENDAR_SOURCE.accessCode,
          generatedAt: indexConfig?.updated_at ?? seedConfig?.updated_at ?? ANCAF_CALENDAR_SOURCE.generatedAt,
        };
      }
      if (!matchesError && dbMatches?.length === 240) {
        persistedMatches = (dbMatches as DbMatch[]).map(fromDbMatch);
      }
    } catch (err) {
      console.error('Erro ao ler calendário do Supabase, usando fallback:', err);
    }
  }

  const activeSeed = Number(activeSeedStr) || 1357;

  const matches = persistedMatches.length === 240
    ? persistedMatches
    : generateGirabolaCalendar(activeSeed, 2026, 'm27-');

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
    season,
    teams: 16,
    generatedAt: dynamicSource.generatedAt,
  };

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
