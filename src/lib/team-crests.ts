// ════════════════════════════════════════════════════════════════════════
// EMBLEMAS DOS CLUBES — REGISTO CANÓNICO E BLOQUEADO
// ────────────────────────────────────────────────────────────────────────
// Esta é a ÚNICA fonte de emblemas de clube do portal. Os ficheiros vivem em
// `public/crests/` e são servidos pelo próprio site — nunca a partir do
// Supabase Storage nem de qualquer URL externo.
//
// PORQUÊ BLOQUEADO
// Até 2026-09-09 o emblema era resolvido por uma cadeia de prioridades
// (override local do admin → `ancaf_teams.logo_url` no Supabase → `logoUrl`
// dos dados → ficheiro estático). Bastava o Supabase ficar indisponível — foi
// o que aconteceu quando o projeto excedeu a quota de egress — para os
// emblemas mudarem sozinhos aos olhos dos visitantes. Além disso, servir os
// emblemas do Storage a cada visita era precisamente o que consumia a quota.
//
// A partir daqui o emblema é imutável em runtime: só muda com uma alteração
// de código (trocar o ficheiro em `public/crests/` ou a linha respetiva
// abaixo) seguida de novo deploy.
// ════════════════════════════════════════════════════════════════════════

/**
 * Emblema oficial de cada clube, por ID do portal.
 * Cada caminho aponta para um ficheiro versionado em `public/crests/`.
 */
export const TEAM_CRESTS: Readonly<Record<string, string>> = Object.freeze({
  petro: '/crests/petro.png',
  wiliete: '/crests/wiliete.png',
  dago: '/crests/dago.png',
  desphuila: '/crests/desphuila.png',
  bravos: '/crests/bravos.png',
  kabuscorp: '/crests/kabuscorp.png',
  sagrada: '/crests/sagrada.jpg',
  interclube: '/crests/interclube.png',
  lundasul: '/crests/lundasul.png',
  libolo: '/crests/libolo.png',
  lobito: '/crests/lobito.png',
  saosalvador: '/crests/saosalvador.png',
  primeiromaio: '/crests/primeiromaio.png',
  fcluanda: '/crests/fcluanda.png',
  cabinda: '/crests/cabinda.png',
  caala: '/crests/caala.png',
});

/**
 * Caminho do emblema de um clube, ou `undefined` se o ID não estiver no
 * registo (nesse caso o portal desenha o crachá de reserva com a sigla).
 */
export function getTeamCrest(teamId: string): string | undefined {
  return TEAM_CRESTS[teamId.toLowerCase()];
}

/**
 * Sinaliza a toda a aplicação (incluindo a consola administrativa) que os
 * emblemas estão fixados em código e que uploads já não afetam o portal.
 */
export const TEAM_CRESTS_LOCKED = true;
