import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateGirabolaCalendar } from '@/lib/ancaf-engine';
import {
  FAF_CALENDAR_SOURCE,
  SEASONS,
  UPCOMING_SEASON_ID,
  getTeamById,
  Match,
} from '@/lib/data';

// ── ENDPOINT ANCAF · GET /api/ancaf ──────────────────────────────────
// Serve o Calendário ANCAF 2026/2027 dinamicamente com base no seed
// guardado no Supabase (com fallback para a constante em data.ts).

export const dynamic = 'force-dynamic';

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

  // 1. Obter a semente ativa do Supabase (com fallback)
  let activeSeedStr = FAF_CALENDAR_SOURCE.accessCode;
  let dynamicSource = { ...FAF_CALENDAR_SOURCE };
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
    try {
      const { data, error } = await supabase
        .from('configs')
        .select('value, updated_at')
        .eq('key', 'active_calendar_seed')
        .single();
      
      if (data && !error) {
        activeSeedStr = data.value;
        dynamicSource = {
          ...FAF_CALENDAR_SOURCE,
          accessCode: activeSeedStr,
          generatedAt: data.updated_at || FAF_CALENDAR_SOURCE.generatedAt,
        };
      }
    } catch (err) {
      console.error('Erro ao ler semente do Supabase, usando fallback:', err);
    }
  }

  const activeSeed = Number(activeSeedStr) || 1357;

  // 2. Gerar calendário dinamicamente a partir da semente
  const matches = generateGirabolaCalendar(activeSeed, 2026, 'm27-');

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
