// Retrato de tudo o que o portal calcula a partir da camada de dados: todas as
// funções exportadas sem argumentos, e para cada jogo a ficha, a arbitragem e a
// transmissão. Comparar dois retratos mostra o impacto real de uma alteração.
//
//   ROOT=<pasta do projeto> OUT=<ficheiro.json> npx tsx scripts/jogos/retrato.mts
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.env.ROOT ?? process.cwd();
const output = process.env.OUT;
if (!output) throw new Error('Indica o ficheiro de saída em OUT.');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const d: any = await import(pathToFileURL(path.join(root, 'src/lib/data.ts')).href);
const snapshot: Record<string, unknown> = {};
const capture = (read: () => unknown) => {
  try {
    return JSON.parse(JSON.stringify(read() ?? null));
  } catch (error) {
    return `ERRO: ${(error as Error).message}`;
  }
};

for (const [name, value] of Object.entries(d).sort(([a], [b]) => a.localeCompare(b))) {
  if (typeof value !== 'function') snapshot[`const:${name}`] = capture(() => value);
  else if (value.length === 0 && !/^(set|invalidate|compute)/.test(name)) snapshot[`fn:${name}`] = capture(() => value());
}

for (const season of ['2026-27', '2025-26']) {
  const matches = d.getMatchesForSeason(season);
  snapshot[`season:${season}:standings`] = capture(() => d.getStandingsForSeason(season));
  snapshot[`season:${season}:updatedAt`] = capture(() => d.getSeasonResultsUpdatedAt(season));
  snapshot[`season:${season}:activeRound`] = capture(() => d.getActiveSeasonRound(matches));
  for (const match of matches) {
    snapshot[`match:${match.id}`] = capture(() => ({
      match,
      detail: d.getMatchDetail(match),
      officials: d.getMatchOfficials(match),
      broadcast: d.getMatchBroadcast(match),
      tempoUtil: d.getMatchTempoUtil(match),
      hasEvents: d.hasPublishedMatchEvents(match),
      byId: d.getMatchById(match.id)?.date,
    }));
  }
}

for (const team of d.getAllTeams()) {
  snapshot[`team:${team.id}`] = capture(() => ({
    cards: d.getTeamCardTotalsFromSheets(team.id),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    players: d.getPlayersByTeam(team.id).map((player: any) => [player.id, player.goals, player.appearances]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    matches: d.getMatchesByTeam(team.id).map((match: any) => match.id),
  }));
}

for (const player of d.getPlayers()) {
  snapshot[`player:${player.id}`] = capture(() => ({ ficha: d.getPlayerFicha(player), minutes: d.getPlayerSeasonMinutes(player.id) }));
}

writeFileSync(output, JSON.stringify(snapshot));
