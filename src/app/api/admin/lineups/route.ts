import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getAdminSession } from '@/lib/admin-auth';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';
import { getMatchById, getPlayersByTeam, getTeamById, getTeamStaff, getMatchOfficials } from '@/lib/data';
import {
  getMatchLineups, saveMatchLineup, sanitizeLineupPlayers, toSlotPosition, type LineupSlot,
} from '@/lib/match-lineups';

export const dynamic = 'force-dynamic';

function suggestedCoach(teamId: string): string {
  const staff = getTeamStaff(teamId);
  const head = staff.find((m) => /treinador principal|head coach/i.test(m.role))
    ?? staff.find((m) => /treinador/i.test(m.role) && !/adjunto|guarda/i.test(m.role));
  return head?.name ?? getTeamById(teamId)?.coach ?? '';
}

function squadOptions(teamId: string) {
  return getPlayersByTeam(teamId).map((p) => ({
    id: p.id,
    name: p.name,
    fullName: p.fullName ?? p.name,
    position: toSlotPosition(p.position),
    positionLabel: p.position,
    jerseyNumber: p.jerseyNumber ?? 0,
    nationality: p.nationality ?? '',
  }));
}

// GET /api/admin/lineups?matchId=... — devolve o jogo, os planteis e as
// escalações já confirmadas (se existirem).
export async function GET(request: Request) {
  const session = getAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!session || session.profile !== 'admin') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const matchId = new URL(request.url).searchParams.get('matchId')?.trim();
  if (!matchId) return NextResponse.json({ error: 'bad_request', message: 'matchId em falta.' }, { status: 400 });

  const match = getMatchById(matchId);
  if (!match) return NextResponse.json({ error: 'not_found', message: 'Jogo não encontrado.' }, { status: 404 });

  const stored = await getMatchLineups(matchId);
  const officials = getMatchOfficials(match);

  const forSide = (side: 'home' | 'away', teamId: string) => ({
    side,
    teamId,
    teamName: side === 'home' ? match.homeTeam : match.awayTeam,
    suggestedCoach: suggestedCoach(teamId),
    squad: squadOptions(teamId),
    lineup: stored.find((l) => l.teamId === teamId && l.side === side) ?? null,
  });

  return NextResponse.json({
    match: {
      id: match.id, round: match.round, date: match.date, stadium: match.stadium,
      homeTeamId: match.homeTeamId, awayTeamId: match.awayTeamId,
      homeTeam: match.homeTeam, awayTeam: match.awayTeam, status: match.status,
    },
    officials,
    home: forSide('home', match.homeTeamId),
    away: forSide('away', match.awayTeamId),
  });
}

// POST /api/admin/lineups — confirma a escalação de um lado do jogo.
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  const rl = checkRateLimit(request, 'admin-lineups', 40, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'too_many_requests' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } });
  }

  const session = getAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!session || session.profile !== 'admin') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { matchId?: unknown; teamId?: unknown; side?: unknown; players?: unknown; coach?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const matchId = typeof body.matchId === 'string' ? body.matchId.trim() : '';
  const teamId = typeof body.teamId === 'string' ? body.teamId.trim() : '';
  const side = body.side === 'home' || body.side === 'away' ? body.side : null;
  const coach = typeof body.coach === 'string' ? body.coach.trim() || null : null;
  const players: LineupSlot[] = sanitizeLineupPlayers(body.players);

  const match = matchId ? getMatchById(matchId) : undefined;
  if (!match || !side) {
    return NextResponse.json({ error: 'bad_request', message: 'Jogo ou lado inválido.' }, { status: 400 });
  }
  const expectedTeam = side === 'home' ? match.homeTeamId : match.awayTeamId;
  if (teamId !== expectedTeam) {
    return NextResponse.json({ error: 'bad_request', message: 'A equipa não corresponde ao lado do jogo.' }, { status: 400 });
  }

  const starters = players.filter((p) => p.isStarter);
  if (starters.length !== 11) {
    return NextResponse.json(
      { error: 'invalid_lineup', message: `O onze inicial tem de ter exatamente 11 jogadores (tem ${starters.length}).` },
      { status: 422 },
    );
  }
  if (starters.filter((p) => p.position === 'GK').length !== 1) {
    return NextResponse.json({ error: 'invalid_lineup', message: 'O onze inicial tem de ter um (e só um) guarda-redes.' }, { status: 422 });
  }
  if (players.filter((p) => p.isCaptain).length > 1) {
    return NextResponse.json({ error: 'invalid_lineup', message: 'Só pode haver um capitão.' }, { status: 422 });
  }

  const result = await saveMatchLineup({ matchId, teamId, side, players, coach, confirmedBy: session.email });
  if (!result.ok) {
    return NextResponse.json({ error: 'write_failed', message: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
