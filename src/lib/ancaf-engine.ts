// ═══════════════════════════════════════════════════════════════════════
// MOTOR ANCAF_CALENDAR — port fiel do algoritmo de sorteio do sistema oficial
// (ancaf-calendar). O calendário do Girabola NÃO é escrito à mão: é gerado
// deterministicamente a partir do número do sorteio (seed). Mudar o seed
// reproduz exatamente o calendário correspondente do ANCAF.
//
// Algoritmo replicado do ANCAF:
//   • PRNG mulberry32(seed)
//   • baralhamento Fisher-Yates das equipas
//   • 1.ª volta pelo método do círculo (round-robin) com atribuição de mando
//     de-Werra (minimização de "breaks") — REGRA ANCAF: nenhuma equipa joga
//     mais de 2 jogos seguidos em casa nem 2 seguidos fora.
//   • 2.ª volta ESPELHADA: mesmos confrontos, mando invertido. Preserva a
//     regra dos ≤2 consecutivos em toda a época (30 jornadas).
// ═══════════════════════════════════════════════════════════════════════
import type { Match, Team } from './data';

// PRNG determinístico (idêntico ao do ANCAF) — mesma seed ⇒ mesma sequência.
function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 1831565813);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface DrawClub { id: string; name: string; stadium: string; }
interface DrawFixture { round: number; homeId: string; awayId: string; }

// Sorteio (confrontos + jornadas + mando). O seed determina o baralhamento
// inicial; a atribuição de mando segue a regra de-Werra (≤2 jogos seguidos em
// casa/fora) e a 2.ª volta é espelhada.
function drawFixtures(clubs: DrawClub[], rng: () => number): DrawFixture[] {
  if (clubs.length < 2) return [];
  const teams = [...clubs];
  // Fisher-Yates (determinístico pelo seed)
  for (let i = teams.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [teams[i], teams[j]] = [teams[j], teams[i]];
  }
  const c = teams.length;       // 16
  const legRounds = c - 1;      // 15
  const perRound = c / 2;       // 8
  const fixtures: DrawFixture[] = [];

  // 1.ª volta (jornadas 1..15) — método do círculo + mando de-Werra.
  // A alternância do mando por paridade da jornada, com o jogo da equipa fixa
  // invertido, garante que nenhuma equipa faz mais de 2 jogos seguidos em
  // casa nem 2 seguidos fora.
  for (let e = 0; e < legRounds; e++) {
    const round = e + 1;
    for (let s = 0; s < perRound; s++) {
      const li = (e + s) % (c - 1);
      let fi = (c - 1 - s + e) % (c - 1);
      if (s === 0) fi = c - 1;
      const a = teams[li], b = teams[fi];
      // s === 0 é o jogo da equipa fixa (b): mando invertido face aos restantes.
      const aIsHome = s === 0 ? e % 2 !== 0 : e % 2 === 0;
      fixtures.push({
        round,
        homeId: aIsHome ? a.id : b.id,
        awayId: aIsHome ? b.id : a.id,
      });
    }
  }

  // 2.ª volta (jornadas 16..30) — ESPELHADA: mesmos confrontos, mando invertido.
  // Como o padrão de mando da 2.ª volta é o complemento exato da 1.ª, a regra
  // dos ≤2 jogos consecutivos mantém-se em toda a época.
  const firstLeg = [...fixtures];
  for (const m of firstLeg) {
    fixtures.push({ round: m.round + legRounds, homeId: m.awayId, awayId: m.homeId });
  }
  return fixtures;
}

// ── Plantel oficial do Girabola 2026/2027 (ordem do sorteio ANCAF) ──────
// São exatamente os mesmos 16 clubes já definidos em TEAMS (data.ts). Nomes e
// estádios espelham TEAMS (fonte única) para evitar divergências entre vistas.
const DRAW_ROSTER: DrawClub[] = [
  { id: 'petro', name: 'Petro de Luanda', stadium: 'Estádio 11 de Novembro' },
  { id: 'dago', name: '1.º de Agosto', stadium: 'Estádio França N’dalu' },
  { id: 'sagrada', name: 'Sagrada Esperança', stadium: 'Estádio do Sagrada Esperança' },
  { id: 'wiliete', name: 'Wiliete de Benguela', stadium: 'Estádio Nacional de Ombaka' },
  { id: 'kabuscorp', name: 'Kabuscorp', stadium: 'Estádio dos Coqueiros' },
  { id: 'interclube', name: 'Interclube', stadium: 'Estádio 22 de Junho' },
  { id: 'desphuila', name: 'Desportivo da Huíla', stadium: 'Estádio da Tundavala' },
  { id: 'bravos', name: 'Bravos do Maquis', stadium: 'Estádio Mundunduleno' },
  { id: 'cabinda', name: 'FC Cabinda', stadium: 'Estádio Nacional do Chiazi' },
  { id: 'lobito', name: 'Académica do Lobito', stadium: 'Estádio do Buraco' },
  { id: 'libolo', name: 'Recreativo do Libolo', stadium: 'Estádio Municipal de Calulo' },
  { id: 'saosalvador', name: 'São Salvador do Kongo', stadium: 'Estádio Álvaro Buta' },
  { id: 'lundasul', name: 'Desportivo da Lunda Sul', stadium: 'Estádio do Sagrada Esperança' },
  { id: 'caala', name: 'CR Caála', stadium: 'Estádio dos Mártires da Canhala' },
  { id: 'fcluanda', name: 'FC Luanda', stadium: 'Estádio França N’dalu' },
  { id: 'primeiromaio', name: '1.º de Maio', stadium: 'Estádio de São Filipe' },
];

// As 16 equipas de 2026/2027 são as mesmas de TEAMS (data.ts), pelo que não há
// clubes adicionais a registar. Mantido (lista vazia) por compatibilidade com
// ALL_TEAMS (data.ts), que faz [...TEAMS, ...PROMOTED_2026_27_TEAMS].
export const PROMOTED_2026_27_TEAMS: Team[] = [];

const KICKOFFS = ['15:00', '16:00', '17:30', '19:00'];
const NAME_BY_ID = new Map(DRAW_ROSTER.map((c) => [c.id, c.name]));
const STADIUM_BY_ID = new Map(DRAW_ROSTER.map((c) => [c.id, c.stadium]));

// Datas oficiais das 30 jornadas (Proposta ANCAF 2026/2027). O sorteio
// determina os CONFRONTOS e o MANDO; estas datas fixam QUANDO cada jornada
// se disputa (não é progressão semanal — há pausas CAF e de inverno).
// Formato [ano, mêsIndex(0-11), dia], jornada N em ROUND_DATES[N - 1].
const ROUND_DATES: readonly [number, number, number][] = [
  [2026, 7, 22], // J1  22/08/26
  [2026, 7, 29], // J2  29/08/26
  [2026, 8, 5],  // J3  05/09/26
  [2026, 8, 12], // J4  12/09/26
  [2026, 8, 19], // J5  19/09/26
  [2026, 9, 10], // J6  10/10/26
  [2026, 9, 17], // J7  17/10/26
  [2026, 9, 24], // J8  24/10/26
  [2026, 9, 31], // J9  31/10/26
  [2026, 10, 7], // J10 07/11/26
  [2026, 10, 21],// J11 21/11/26
  [2026, 10, 28],// J12 28/11/26
  [2026, 11, 5], // J13 05/12/26
  [2026, 11, 12],// J14 12/12/26
  [2026, 11, 19],// J15 19/12/26
  [2027, 0, 31], // J16 31/01/27
  [2027, 1, 6],  // J17 06/02/27
  [2027, 1, 13], // J18 13/02/27
  [2027, 1, 20], // J19 20/02/27
  [2027, 1, 27], // J20 27/02/27
  [2027, 2, 6],  // J21 06/03/27
  [2027, 2, 13], // J22 13/03/27
  [2027, 2, 20], // J23 20/03/27
  [2027, 3, 3],  // J24 03/04/27
  [2027, 3, 10], // J25 10/04/27
  [2027, 3, 17], // J26 17/04/27
  [2027, 3, 24], // J27 24/04/27
  [2027, 4, 1],  // J28 01/05/27
  [2027, 4, 8],  // J29 08/05/27
  [2027, 4, 15], // J30 15/05/27
];

// ── GARANTIA DAS REGRAS DO SORTEIO ──────────────────────────────────────
// Valida TODOS os invariantes do sorteio ANCAF. Lança erro (fail-fast) se
// alguma regra for violada — impede que um calendário inválido seja servido.
// É executado a cada geração (ver generateGirabolaCalendar), por isso qualquer
// alteração futura (nova seed, mudança de plantel/datas) que quebre uma regra
// falha imediatamente em vez de publicar dados errados.
export function assertDrawRules(fixtures: DrawFixture[], clubs: DrawClub[]): void {
  const errs: string[] = [];
  const n = clubs.length;
  const legRounds = n - 1;
  const totalRounds = legRounds * 2;
  const perRound = n / 2;
  const ids = clubs.map((c) => c.id);

  // R1 — número de equipas par e ≥ 2.
  if (n < 2 || n % 2 !== 0) errs.push(`número de equipas inválido: ${n} (deve ser par e ≥ 2)`);

  // R1 — contagem total de jogos e de jornadas.
  if (fixtures.length !== perRound * totalRounds) {
    errs.push(`total de jogos ${fixtures.length} ≠ esperado ${perRound * totalRounds}`);
  }
  const rounds = [...new Set(fixtures.map((f) => f.round))].sort((a, b) => a - b);
  if (rounds.length !== totalRounds || rounds[0] !== 1 || rounds[rounds.length - 1] !== totalRounds) {
    errs.push(`jornadas inválidas: ${rounds.length} (esperado ${totalRounds}, de 1 a ${totalRounds})`);
  }

  // Estruturas de apoio.
  const homeCount = new Map<string, number>();
  const awayCount = new Map<string, number>();
  const pairMeetings = new Map<string, DrawFixture[]>();
  const pairKey = (a: string, b: string) => [a, b].sort().join('|');

  for (let r = 1; r <= totalRounds; r++) {
    const rf = fixtures.filter((f) => f.round === r);
    // R1 — jogos por jornada.
    if (rf.length !== perRound) errs.push(`jornada ${r}: ${rf.length} jogos (esperado ${perRound})`);
    // R1/R2 — cada equipa aparece exatamente uma vez e não joga contra si própria.
    const seen = new Set<string>();
    for (const f of rf) {
      if (f.homeId === f.awayId) errs.push(`jornada ${r}: equipa joga contra si própria (${f.homeId})`);
      for (const t of [f.homeId, f.awayId]) {
        if (!ids.includes(t)) errs.push(`jornada ${r}: equipa desconhecida ${t}`);
        if (seen.has(t)) errs.push(`jornada ${r}: equipa ${t} aparece mais de uma vez`);
        seen.add(t);
      }
      homeCount.set(f.homeId, (homeCount.get(f.homeId) ?? 0) + 1);
      awayCount.set(f.awayId, (awayCount.get(f.awayId) ?? 0) + 1);
      const key = pairKey(f.homeId, f.awayId);
      (pairMeetings.get(key) ?? pairMeetings.set(key, []).get(key)!).push(f);
    }
    if (seen.size !== n) errs.push(`jornada ${r}: ${seen.size} equipas em campo (esperado ${n})`);
  }

  // R1 — cada equipa: 15 em casa, 15 fora, 30 no total.
  for (const id of ids) {
    const h = homeCount.get(id) ?? 0;
    const a = awayCount.get(id) ?? 0;
    if (h !== legRounds || a !== legRounds) {
      errs.push(`equipa ${id}: ${h} em casa / ${a} fora (esperado ${legRounds}/${legRounds})`);
    }
  }

  // R2 — cada par joga exatamente 2 vezes, com o mando trocado entre elas.
  const expectedPairs = (n * (n - 1)) / 2;
  if (pairMeetings.size !== expectedPairs) {
    errs.push(`confrontos distintos ${pairMeetings.size} ≠ esperado ${expectedPairs}`);
  }
  for (const [key, ms] of pairMeetings) {
    if (ms.length !== 2) { errs.push(`par ${key}: ${ms.length} jogos (esperado 2)`); continue; }
    if (ms[0].homeId === ms[1].homeId) errs.push(`par ${key}: mando não é trocado entre ida e volta`);
  }

  // R4 — 2.ª volta espelha a 1.ª (mesmo confronto, mando invertido).
  for (let r = 1; r <= legRounds; r++) {
    for (const f of fixtures.filter((x) => x.round === r)) {
      const rev = fixtures.find(
        (x) => x.round === r + legRounds && x.homeId === f.awayId && x.awayId === f.homeId,
      );
      if (!rev) errs.push(`jornada ${r + legRounds} não espelha corretamente a jornada ${r} (${f.homeId} vs ${f.awayId})`);
    }
  }

  // R3 — nenhuma equipa joga mais de 2 jogos seguidos em casa nem 2 seguidos fora.
  for (const id of ids) {
    const seq: ('C' | 'F')[] = [];
    for (let r = 1; r <= totalRounds; r++) {
      const f = fixtures.find((x) => x.round === r && (x.homeId === id || x.awayId === id));
      if (f) seq.push(f.homeId === id ? 'C' : 'F');
    }
    let run = 1;
    for (let i = 1; i < seq.length; i++) {
      run = seq[i] === seq[i - 1] ? run + 1 : 1;
      if (run > 2) { errs.push(`equipa ${id}: ${run} jogos seguidos ${seq[i] === 'C' ? 'em casa' : 'fora'} (máx. 2) — ${seq.join('')}`); break; }
    }
  }

  if (errs.length) {
    throw new Error(`[ANCAF] Sorteio viola as regras oficiais:\n - ${errs.join('\n - ')}`);
  }
}

// Gera o calendário completo do Girabola a partir do número do sorteio ANCAF.
// O parâmetro `year` é mantido por compatibilidade; as datas das jornadas são
// fixadas por ROUND_DATES (datas oficiais ANCAF 2026/2027).
export function generateGirabolaCalendar(seed: number, year: number, idPrefix = 'm27-'): Match[] {
  void year;
  const fixtures = drawFixtures(DRAW_ROSTER, mulberry32(seed));
  const perRound = DRAW_ROSTER.length / 2;

  // R6 — as datas oficiais têm de cobrir exatamente todas as jornadas.
  const totalRounds = (DRAW_ROSTER.length - 1) * 2;
  if (ROUND_DATES.length !== totalRounds) {
    throw new Error(`[ANCAF] ROUND_DATES tem ${ROUND_DATES.length} datas, mas são necessárias ${totalRounds} jornadas.`);
  }

  // GARANTIA: valida todos os invariantes do sorteio antes de construir os jogos.
  assertDrawRules(fixtures, DRAW_ROSTER);

  let counter = 1;
  return fixtures.map((fx) => {
    const [yy, mo, dd] = ROUND_DATES[fx.round - 1];
    const idxInRound = (counter - 1) % perRound;
    const d = new Date(yy, mo, dd);
    // Para manter a consistência com as datas das jornadas fornecidas, removemos o acréscimo de +1 dia
    // if (idxInRound >= perRound / 2) d.setDate(d.getDate() + 1);
    const [hh, mm] = KICKOFFS[idxInRound % KICKOFFS.length].split(':');
    d.setHours(Number(hh), Number(mm), 0, 0);
    return {
      id: `${idPrefix}${fx.round}-${counter++}`,
      homeTeamId: fx.homeId,
      awayTeamId: fx.awayId,
      homeTeam: NAME_BY_ID.get(fx.homeId) ?? fx.homeId,
      awayTeam: NAME_BY_ID.get(fx.awayId) ?? fx.awayId,
      homeScore: 0,
      awayScore: 0,
      score: undefined,
      date: d.toISOString(),
      stadium: STADIUM_BY_ID.get(fx.homeId) ?? '',
      status: 'scheduled' as const,
      round: fx.round,
    };
  });
}
