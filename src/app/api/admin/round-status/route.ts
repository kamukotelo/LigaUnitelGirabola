import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getAdminSession } from '@/lib/admin-auth';
import {
  getMatchesForSeason, getMatchOfficials, isMatchDateOfficial, UPCOMING_SEASON_ID, getMatchDetail,
} from '@/lib/data';
import { getMatchLineups } from '@/lib/match-lineups';

export const dynamic = 'force-dynamic';

// GET /api/admin/round-status?round=N — estado de preparação de cada jogo da
// jornada, para o assistente "Jornada" da consola.
export async function GET(request: Request) {
  const session = getAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!session || session.profile !== 'admin') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const round = Number(new URL(request.url).searchParams.get('round'));
  if (!Number.isInteger(round) || round < 1) {
    return NextResponse.json({ error: 'bad_request', message: 'round inválido.' }, { status: 400 });
  }

  const matches = getMatchesForSeason(UPCOMING_SEASON_ID).filter((m) => m.round === round);
  if (!matches.length) return NextResponse.json({ round, matches: [] });

  const rows = await Promise.all(
    matches.map(async (m) => {
      const officials = getMatchOfficials(m);
      const lineups = await getMatchLineups(m.id);
      const home = lineups.find((l) => l.side === 'home');
      const away = lineups.find((l) => l.side === 'away');
      const lineupsConfirmed =
        (home?.players.filter((p) => p.isStarter).length === 11) &&
        (away?.players.filter((p) => p.isStarter).length === 11);
      const detail = getMatchDetail(m);
      const finished = m.status === 'finished';
      const hasEvents = finished && detail.events.some((e) => e.type === 'goal' || e.type === 'yellow' || e.type === 'red' || e.type === 'sub');
      return {
        id: m.id,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        date: m.date,
        stadium: m.stadium,
        dateOfficial: isMatchDateOfficial(m),
        hasNominations: officials.referee !== 'A definir',
        lineupsConfirmed,
        finished,
        score: finished ? `${m.homeScore}-${m.awayScore}` : null,
        hasEvents,
      };
    }),
  );

  return NextResponse.json({ round, matches: rows });
}
