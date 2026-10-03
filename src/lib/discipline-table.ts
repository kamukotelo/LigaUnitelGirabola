// Classificação Geral do Índice Disciplinar da Liga Unitel Girabola
// Critério: Amarelo = 1 pt | Duplo Amarelo = 2 pts | Vermelho Direto = 3 pts.
// Menor pontuação lidera a classificação do Fair Play.

import {
  getMatchesForSeason,
  getMatchDetail,
  getSeasonTeams,
  getTeamById,
} from './data';

const SECOND_YELLOW = /segundo amarelo|duplo amarelo|2\.?º amarelo/i;

export interface TeamDisciplineRow {
  position: number;
  teamId: string;
  name: string;
  shortName: string;
  played: number;
  yellow: number;
  doubleYellow: number;
  directRed: number;
  totalCards: number;
  points: number;
  pointsPerMatch: number;
  cardsPerMatch: number;
}

export interface DisciplineSeasonSummary {
  seasonId: string;
  totalMatches: number;
  totalYellow: number;
  totalDoubleYellow: number;
  totalDirectRed: number;
  totalCards: number;
  averageCardsPerMatch: number;
  mostDisciplined?: TeamDisciplineRow;
  leastDisciplined?: TeamDisciplineRow;
  rows: TeamDisciplineRow[];
}

export function computeDisciplineTable(
  seasonId: string,
  sortOrder: 'fairplay' | 'most_cards' = 'fairplay',
): DisciplineSeasonSummary {
  const matches = getMatchesForSeason(seasonId).filter((m) => m.status === 'finished');
  const teams = getSeasonTeams(seasonId);

  const rawRows = teams.map((team) => {
    let played = 0;
    let yellow = 0;
    let doubleYellow = 0;
    let directRed = 0;

    for (const m of matches) {
      const isHome = m.homeTeamId === team.id;
      const isAway = m.awayTeamId === team.id;
      if (!isHome && !isAway) continue;
      played++;
      const side = isHome ? 'home' : 'away';
      const d = getMatchDetail(m);
      const sideEvents = d.events.filter((e) => e.team === side);
      const hasCardEvents = sideEvents.some((e) => e.type === 'yellow' || e.type === 'red');

      if (hasCardEvents) {
        for (const e of sideEvents) {
          if (e.type === 'yellow') {
            yellow++;
          } else if (e.type === 'red') {
            if (SECOND_YELLOW.test(e.detail ?? '')) {
              doubleYellow++;
            } else {
              directRed++;
            }
          }
        }
      } else {
        const stats = isHome ? d.homeStats : d.awayStats;
        const pub = d.officialStatKeys;
        const y = pub.includes('yellowCards') ? stats.yellowCards : 0;
        const r = pub.includes('redCards') ? stats.redCards : 0;
        yellow += y;
        directRed += r;
      }
    }

    const totalCards = yellow + doubleYellow + directRed;
    const points = yellow * 1 + doubleYellow * 2 + directRed * 3;
    const pointsPerMatch = played > 0 ? Math.round((points / played) * 100) / 100 : 0;
    const cardsPerMatch = played > 0 ? Math.round((totalCards / played) * 100) / 100 : 0;
    const t = getTeamById(team.id);

    return {
      position: 0,
      teamId: team.id,
      name: t?.name || team.name || team.shortName,
      shortName: t?.shortName || team.shortName,
      played,
      yellow,
      doubleYellow,
      directRed,
      totalCards,
      points,
      pointsPerMatch,
      cardsPerMatch,
    };
  });

  // Ordenação oficial Fair Play: menor pontuação lidera
  const fairPlaySorted = [...rawRows].sort((a, b) => {
    return (
      a.points - b.points ||
      a.directRed - b.directRed ||
      a.doubleYellow - b.doubleYellow ||
      a.yellow - b.yellow ||
      b.played - a.played ||
      a.name.localeCompare(b.name, 'pt')
    );
  });

  const rowsWithRank = fairPlaySorted.map((row, index) => ({
    ...row,
    position: index + 1,
  }));

  const finalRows = sortOrder === 'fairplay'
    ? rowsWithRank
    : [...rowsWithRank].sort((a, b) => {
        return (
          b.points - a.points ||
          b.directRed - a.directRed ||
          b.doubleYellow - a.doubleYellow ||
          b.yellow - a.yellow ||
          a.name.localeCompare(b.name, 'pt')
        );
      });

  const totalMatches = matches.length;
  const totalYellow = rawRows.reduce((acc, r) => acc + r.yellow, 0);
  const totalDoubleYellow = rawRows.reduce((acc, r) => acc + r.doubleYellow, 0);
  const totalDirectRed = rawRows.reduce((acc, r) => acc + r.directRed, 0);
  const totalCards = totalYellow + totalDoubleYellow + totalDirectRed;
  const averageCardsPerMatch = totalMatches > 0 ? Math.round((totalCards / totalMatches) * 100) / 100 : 0;

  return {
    seasonId,
    totalMatches,
    totalYellow,
    totalDoubleYellow,
    totalDirectRed,
    totalCards,
    averageCardsPerMatch,
    mostDisciplined: rowsWithRank[0],
    leastDisciplined: rowsWithRank[rowsWithRank.length - 1],
    rows: finalRows,
  };
}
