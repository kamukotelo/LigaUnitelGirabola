import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getAdminSession } from '@/lib/admin-auth';
import { getMatchById, getMatchOfficials } from '@/lib/data';
import { getMatchLineups } from '@/lib/match-lineups';
import { buildMatchSheetPdf } from '@/lib/match-sheet-pdf';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// GET /api/admin/match-sheet/<matchId> — ficha "Constituição das Equipas" em
// PDF preenchível, a partir dos onzes já confirmados na consola.
export async function GET(_request: Request, ctx: { params: Promise<{ matchId: string }> }) {
  const session = getAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!session || session.profile !== 'admin') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { matchId } = await ctx.params;
  const match = getMatchById(matchId);
  if (!match) return NextResponse.json({ error: 'not_found', message: 'Jogo não encontrado.' }, { status: 404 });

  const lineups = await getMatchLineups(matchId);
  const home = lineups.find((l) => l.side === 'home');
  const away = lineups.find((l) => l.side === 'away');

  const missing: string[] = [];
  if (!home || home.players.filter((p) => p.isStarter).length !== 11) missing.push(match.homeTeam);
  if (!away || away.players.filter((p) => p.isStarter).length !== 11) missing.push(match.awayTeam);
  if (missing.length) {
    return NextResponse.json(
      { error: 'lineup_incomplete', message: `Confirme o onze inicial de: ${missing.join(' e ')}.` },
      { status: 409 },
    );
  }

  const pdf = await buildMatchSheetPdf({
    matchId,
    round: match.round,
    date: match.date,
    stadium: match.stadium,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    home: { players: home!.players, coach: home!.coach },
    away: { players: away!.players, coach: away!.coach },
    officials: getMatchOfficials(match),
  });

  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ficha-${matchId}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
