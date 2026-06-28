import { NextResponse } from 'next/server';
import {
  FAF_CALENDAR_SOURCE,
  CALENDAR_2026_27,
  MATCHES_2026_27,
  SEASONS,
  UPCOMING_SEASON_ID,
  getTeamById,
} from '@/lib/data';

// ── ENDPOINT ANCAF · GET /api/ancaf ──────────────────────────────────
// Serve o Calendário ANCAF 2026/2027 (Proposta · sorteio nº 1357) para
// consumo do lado do site e por integrações externas.
//
// Parâmetros de query (todos opcionais):
//   ?round=N            → devolve apenas a jornada N (1..30)
//   ?format=matches     → devolve os jogos já construídos (objetos Match)
//   ?format=calendar    → devolve as jornadas com confrontos resolvidos (default)
//
// Exemplos:
//   /api/ancaf
//   /api/ancaf?round=9
//   /api/ancaf?format=matches
//   /api/ancaf?format=matches&round=1

// Lê parâmetros de query (round/format), por isso a rota é dinâmica.
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

  // Validação do parâmetro round.
  let round: number | null = null;
  if (roundParam !== null) {
    const parsed = Number(roundParam);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > FAF_CALENDAR_SOURCE.rounds) {
      return NextResponse.json(
        {
          error: 'invalid_round',
          message: `O parâmetro "round" deve ser um inteiro entre 1 e ${FAF_CALENDAR_SOURCE.rounds}.`,
        },
        { status: 400 },
      );
    }
    round = parsed;
  }

  const season = SEASONS.find((s) => s.id === UPCOMING_SEASON_ID) ?? null;

  const meta = {
    source: FAF_CALENDAR_SOURCE,
    season,
    teams: 16,
    generatedAt: FAF_CALENDAR_SOURCE.generatedAt,
  };

  // Formato "matches": jogos já construídos com data/hora e estádio.
  if (format === 'matches') {
    const matches = round
      ? MATCHES_2026_27.filter((m) => m.round === round)
      : MATCHES_2026_27;
    return NextResponse.json({
      ...meta,
      count: matches.length,
      matches,
    });
  }

  // Formato "calendar" (default): jornadas com confrontos resolvidos.
  const rounds = (round
    ? CALENDAR_2026_27.filter((r) => r.round === round)
    : CALENDAR_2026_27
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
