// Embargo das escalações: o line up de cada jogo só é público a partir de 1 h
// antes do início, mesmo que já esteja carregado (pedido da DCE, 13/10/2026 —
// a Zsports usa-o no grafismo dos jogos transmitidos). Vale para os registos em
// src/data/jogos e para as escalações confirmadas no painel.

export const LINEUP_EMBARGO_MINUTES = 60;

/** Instante (ms) a partir do qual o line up é público, ou `undefined` sem data válida. */
export function lineupPublicFrom(kickoff: string | undefined): number | undefined {
  const start = kickoff ? Date.parse(kickoff) : Number.NaN;
  return Number.isFinite(start) ? start - LINEUP_EMBARGO_MINUTES * 60_000 : undefined;
}

/**
 * Um jogo em direto ou terminado mostra sempre o line up; um jogo por disputar
 * só a partir de 1 h antes da hora marcada. Sem data válida não há embargo.
 */
export function isLineupPublic(
  match: { date?: string; status?: string },
  now: number = Date.now(),
): boolean {
  if (match.status === 'live' || match.status === 'finished') return true;
  const from = lineupPublicFrom(match.date);
  return from === undefined || now >= from;
}
