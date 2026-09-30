// Bloqueios da área administrativa (/adminancaf2026).
//
// Cada informação de um jogo tem um só sítio onde é editada:
// - jornada e equipas: sorteio oficial — nunca mudam no painel;
// - data, hora, estádio e transmissão: registo do jogo em src/data/jogos,
//   atualizado só a partir de comunicado ou mapa oficial da ANCAF;
// - resultado de um jogo encerrado (registo com `result.status: 'finished'`):
//   só muda no painel com um motivo escrito, que fica no histórico.
// O painel usa estas funções para mostrar os campos em só leitura e o
// servidor volta a aplicá-las, para que um pedido por fora do painel também
// seja recusado.
import { DRAW_FIXTURE_FIELDS, RECORD_SCHEDULE_FIELDS, getMatchRecord } from './data';

export const CLOSED_RESULT_FIELDS = ['homeScore', 'awayScore', 'score', 'halfTimeScore', 'status'] as const;
export const MIN_CORRECTION_REASON_LENGTH = 10;

const FIELD_LABELS: Record<string, string> = {
  round: 'jornada',
  homeTeamId: 'equipa da casa',
  awayTeamId: 'equipa visitante',
  homeTeam: 'equipa da casa',
  awayTeam: 'equipa visitante',
  date: 'data e hora',
  postponed: 'adiamento',
  stadium: 'estádio',
  scheduleStatus: 'estado da agenda',
  broadcaster: 'transmissão',
};

type Patch = Record<string, unknown>;
type PatchMap = Record<string, Patch>;

/** Jogo cuja agenda é fixada pelo registo em src/data/jogos. */
export function hasOfficialSchedule(matchId: string): boolean {
  return Boolean(getMatchRecord(matchId));
}

/** Documento oficial que fixou a agenda do jogo, quando registado. */
export function officialScheduleSource(matchId: string): string | undefined {
  return getMatchRecord(matchId)?.schedule.source;
}

/** Jogo encerrado: o registo já tem o resultado final do relatório do árbitro. */
export function isMatchClosed(matchId: string): boolean {
  return getMatchRecord(matchId)?.result?.status === 'finished';
}

function lockedFieldsFor(matchId: string): readonly string[] {
  return hasOfficialSchedule(matchId) ? [...DRAW_FIXTURE_FIELDS, ...RECORD_SCHEDULE_FIELDS] : DRAW_FIXTURE_FIELDS;
}

function sameValue(a: unknown, b: unknown): boolean {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

export interface CalendarScreening {
  /** Overrides sem os campos bloqueados, prontos a gravar. */
  value: PatchMap;
  /** Campos bloqueados que o pedido tentou mudar (ex.: "m27-7-5: estádio"). */
  blocked: string[];
  /** Jogos encerrados cujo resultado o pedido muda (exigem motivo). */
  closedResultChanges: string[];
}

/**
 * Compara os overrides pedidos (`next`) com os publicados (`previous`): tira os
 * campos bloqueados, lista as tentativas de os mudar e os jogos encerrados
 * cujo resultado muda. Valores iguais aos publicados não contam como mudança
 * (o painel reenvia o bloco inteiro a cada gravação).
 */
export function screenCalendarOverrides(next: PatchMap, previous: PatchMap = {}): CalendarScreening {
  const value: PatchMap = {};
  const blocked: string[] = [];
  const closedResultChanges: string[] = [];
  for (const [matchId, rawPatch] of Object.entries(next ?? {})) {
    if (!rawPatch || typeof rawPatch !== 'object' || Array.isArray(rawPatch)) continue;
    const before = previous?.[matchId] ?? {};
    const patch: Patch = { ...rawPatch };
    for (const field of lockedFieldsFor(matchId)) {
      if (!(field in patch)) continue;
      if (!sameValue(patch[field], before[field])) blocked.push(`${matchId}: ${FIELD_LABELS[field] ?? field}`);
      delete patch[field];
    }
    if (isMatchClosed(matchId) && CLOSED_RESULT_FIELDS.some((field) => field in patch && !sameValue(patch[field], before[field]))) {
      closedResultChanges.push(matchId);
    }
    if (Object.keys(patch).length) value[matchId] = patch;
  }
  return { value, blocked, closedResultChanges };
}

/** Tira os campos bloqueados sem os tratar como tentativa (limpeza de dados antigos). */
export function stripLockedCalendarFields(overrides: PatchMap): PatchMap {
  return screenCalendarOverrides(overrides, overrides).value;
}

export function lockedFieldsMessage(blocked: string[]): string {
  return 'Jornada, equipas, data, hora, estádio e transmissão vêm do sorteio e do mapa oficial da ANCAF e não se alteram no painel. '
    + `Pedido recusado: ${blocked.slice(0, 6).join('; ')}${blocked.length > 6 ? '…' : ''}.`;
}

export function correctionReasonMessage(matchIds: string[]): string {
  return `O resultado de um jogo encerrado só muda com um motivo (mínimo ${MIN_CORRECTION_REASON_LENGTH} caracteres), que fica no histórico. Jogos: ${matchIds.join(', ')}.`;
}

export function validCorrectionReason(reason: unknown): string | null {
  const text = typeof reason === 'string' ? reason.trim().slice(0, 500) : '';
  return text.length >= MIN_CORRECTION_REASON_LENGTH ? text : null;
}
