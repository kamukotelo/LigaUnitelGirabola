// ════════════════════════════════════════════════════════════════════════
// REGISTO ÚNICO POR JOGO
// ────────────────────────────────────────────────────────────────────────
// Cada jogo da época vive num só ficheiro (src/data/jogos/<época>/<id>.ts)
// com tudo o que se sabe dele: agenda, resultado, arbitragem, escalações,
// eventos e estatísticas. A camada de dados (src/lib/data.ts) lê apenas estes
// registos, e tudo o resto é derivado deles — calendário, ficha de jogo,
// classificação, marcadores, cartões, minutos, API pública e seeds SQL.
//
// Fluxo: editar o ficheiro do jogo → `npm run jogos -- publicar`.
// Ver src/data/jogos/LEIA-ME.md.
// ════════════════════════════════════════════════════════════════════════

import type { LineupPlayer, MatchEventDetail, MatchTeamStats } from '../../lib/data';

/** Entrada de escalação; a nota (`rating`) é opcional porque as fichas oficiais não a publicam. */
export type MatchRecordLineupPlayer = Omit<LineupPlayer, 'rating'> & { rating?: number };

export interface MatchRecord {
  id: string;
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  /** Agenda efetiva. Sem `broadcaster`, o jogo é anunciado na Rádio 5. */
  schedule: {
    date: string;
    stadium: string;
    /** Jogo oficialmente adiado, ainda sem nova data confirmada. */
    postponed?: boolean;
    /** `official` só depois de publicado em comunicado ou mapa oficial. */
    scheduleStatus: 'official' | 'provisional';
    /** Apenas transmissões televisivas (ex.: 'Zsports'). Nunca 'Rádio 5'. */
    broadcaster?: string;
  };
  /** Ausente enquanto o jogo não começou. */
  result?: {
    status: 'live' | 'finished';
    homeScore: number;
    awayScore: number;
    halfTimeScore?: string;
    liveMinute?: number;
    attendance?: number;
    usefulTimeMinutes?: number;
    /** Instante editorial da última confirmação deste jogo. */
    updatedAt: string;
  };
  officials?: {
    referee?: string;
    assistants?: [string, string];
    fourth?: string;
    /** Delegado de jogo. */
    commissioner?: string;
  };
  coaches?: { home?: string; away?: string };
  lineups?: { home: MatchRecordLineupPlayer[]; away: MatchRecordLineupPlayer[] };
  events?: MatchEventDetail[];
  stats?: { home: Partial<MatchTeamStats>; away: Partial<MatchTeamStats>; keys: (keyof MatchTeamStats)[] };
}

/**
 * Totais da época calculados a partir dos registos de jogo. Vivem no ficheiro
 * gerado `derivados.ts` (ver computeSeasonDerivedStats em src/lib/data.ts).
 */
export interface SeasonDerivedStats {
  scorers: readonly {
    id: string;
    name: string;
    club: string;
    teamId: string;
    position: string;
    goals: number;
    appearances: number;
  }[];
  cards: Readonly<Record<string, { yellow: number; red: number }>>;
  ownGoals: number;
}

/** Identidade tipada: dá autocompletar e validação de tipos ao editar um jogo. */
export function defineMatch(record: MatchRecord): MatchRecord {
  return record;
}
