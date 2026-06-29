// ═══════════════════════════════════════════════════════════════════════
// MOTOR ANCAF_CALENDAR — port fiel do algoritmo de sorteio do sistema oficial
// (ancaf-calendar). O calendário do Girabola NÃO é escrito à mão: é gerado
// deterministicamente a partir do número do sorteio (seed). Mudar o seed
// reproduz exatamente o calendário correspondente do ANCAF.
//
// Algoritmo replicado do ANCAF:
//   • PRNG mulberry32(seed)
//   • baralhamento Fisher-Yates das equipas
//   • 1.ª volta pelo método do círculo (round-robin), mando alternado por jornada
//   • 2.ª volta ASSIMÉTRICA: as equipas são novamente baralhadas (mesmo PRNG),
//     garantindo a inversão de mando face à 1.ª volta (não é volta espelhada)
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

// Sorteio (apenas confrontos + jornadas + mando). Réplica fiel da função do ANCAF.
function drawFixtures(clubs: DrawClub[], isAsymmetric: boolean, rng: () => number): DrawFixture[] {
  if (clubs.length < 2) return [];
  const teams = [...clubs];
  // Fisher-Yates
  for (let i = teams.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [teams[i], teams[j]] = [teams[j], teams[i]];
  }
  const c = teams.length;       // 16
  const legRounds = c - 1;      // 15
  const perRound = c / 2;       // 8
  const fixtures: DrawFixture[] = [];

  // 1.ª volta (jornadas 1..15)
  for (let e = 0; e < legRounds; e++) {
    const round = e + 1;
    for (let s = 0; s < perRound; s++) {
      const li = (e + s) % (c - 1);
      let fi = (c - 1 - s + e) % (c - 1);
      if (s === 0) fi = c - 1;
      const a = teams[li], b = teams[fi];
      const homeFirst = e % 2 === 0;
      fixtures.push({ round, homeId: homeFirst ? a.id : b.id, awayId: homeFirst ? b.id : a.id });
    }
  }

  // 2.ª volta (jornadas 16..30) — assimétrica: novo baralhamento + inversão de mando
  const firstLeg = [...fixtures];
  if (isAsymmetric) {
    const reshuffled = [...teams];
    for (let i = reshuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [reshuffled[i], reshuffled[j]] = [reshuffled[j], reshuffled[i]];
    }
    for (let e = 0; e < legRounds; e++) {
      const round = legRounds + e + 1;
      for (let s = 0; s < perRound; s++) {
        const li = (e + s) % (c - 1);
        let fi = (c - 1 - s + e) % (c - 1);
        if (s === 0) fi = c - 1;
        let home = reshuffled[li], away = reshuffled[fi];
        // garantir mando invertido face à 1.ª volta
        const prev = firstLeg.find(
          (m) => (m.homeId === home.id && m.awayId === away.id) || (m.homeId === away.id && m.awayId === home.id),
        );
        if (prev && prev.homeId === home.id) { const t = home; home = away; away = t; }
        fixtures.push({ round, homeId: home.id, awayId: away.id });
      }
    }
  } else {
    // volta espelhada (mando trocado)
    for (const m of firstLeg) {
      fixtures.push({ round: m.round + legRounds, homeId: m.awayId, awayId: m.homeId });
    }
  }
  return fixtures;
}

// ── Plantel oficial do Girabola 2026/2027 (ordem do sorteio ANCAF) ──────
// As 16 equipas reutilizam os clubes já definidos em TEAMS (data.ts), incl.
// os promovidos FC Cabinda, CR Caála, FC Luanda e 1.º de Maio.
const DRAW_ROSTER: DrawClub[] = [
  { id: 'petro', name: 'Petro de Luanda', stadium: 'Estádio 11 de Novembro' },
  { id: 'dago', name: '1.º de Agosto', stadium: 'Estádio 22 de Junho' },
  { id: 'sagrada', name: 'Sagrada Esperança', stadium: 'Estádio Sagrada Esperança' },
  { id: 'wiliete', name: 'Wiliete de Benguela', stadium: 'Estádio Nacional de Ombaka' },
  { id: 'kabuscorp', name: 'Kabuscorp', stadium: 'Estádio dos Coqueiros' },
  { id: 'interclube', name: 'Interclube', stadium: 'Estádio 22 de Junho' },
  { id: 'desphuila', name: 'Desportivo da Huíla', stadium: 'Estádio da Tundavala' },
  { id: 'bravos', name: 'Bravos do Maquis', stadium: 'Estádio Mundunduleno' },
  { id: 'cabinda', name: 'FC Cabinda', stadium: 'Estádio Nacional do Chiazi' },
  { id: 'lobito', name: 'Académica do Lobito', stadium: 'Estádio do Buraco' },
  { id: 'libolo', name: 'Recreativo do Libolo', stadium: 'Estádio Municipal de Calulo' },
  { id: 'saosalvador', name: 'São Salvador do Kongo', stadium: 'Estádio Álvaro Buta' },
  { id: 'lundasul', name: 'Desportivo da Lunda Sul', stadium: 'Estádio das Mangueiras' },
  { id: 'caala', name: 'CR Caála', stadium: 'Estádio Municipal da Caála' },
  { id: 'fcluanda', name: 'FC Luanda', stadium: 'Campo da Cidadela' },
  { id: 'primeiromaio', name: '1.º de Maio', stadium: 'Estádio Municipal do Lobito' },
];

// As 16 equipas de 2026/2027 já estão todas definidas em TEAMS (data.ts),
// pelo que não há clubes adicionais a registar. Mantido por compatibilidade
// com ALL_TEAMS (data.ts), que faz [...TEAMS, ...PROMOTED_2026_27_TEAMS].
export const PROMOTED_2026_27_TEAMS: Team[] = [];

const KICKOFFS = ['15:00', '16:00', '17:30', '19:00'];
const NAME_BY_ID = new Map(DRAW_ROSTER.map((c) => [c.id, c.name]));
const STADIUM_BY_ID = new Map(DRAW_ROSTER.map((c) => [c.id, c.stadium]));

// Gera o calendário completo do Girabola a partir do número do sorteio ANCAF.
export function generateGirabolaCalendar(seed: number, year: number, idPrefix = 'm27-'): Match[] {
  const fixtures = drawFixtures(DRAW_ROSTER, true, mulberry32(seed));
  const base = new Date(year, 9, 4); // base de datas do ANCAF: 4 de outubro
  const perRound = DRAW_ROSTER.length / 2;
  const legRounds = DRAW_ROSTER.length - 1;
  const secondLegBase = new Date(base.getTime());
  secondLegBase.setDate(base.getDate() + legRounds * 7 + 14);

  let counter = 1;
  return fixtures.map((fx) => {
    const inSecondLeg = fx.round > legRounds;
    const legBase = inSecondLeg ? secondLegBase : base;
    const idxInLeg = inSecondLeg ? fx.round - legRounds - 1 : fx.round - 1;
    const idxInRound = (counter - 1) % perRound;
    const d = new Date(legBase.getTime());
    d.setDate(legBase.getDate() + idxInLeg * 7);
    if (idxInRound >= perRound / 2) d.setDate(d.getDate() + 1); // 2.º bloco no dia seguinte
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
