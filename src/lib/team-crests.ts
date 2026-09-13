// ════════════════════════════════════════════════════════════════════════
// EMBLEMAS DOS CLUBES — REGISTO CANÓNICO E FALLBACK OFICIAL
// ────────────────────────────────────────────────────────────────────────
// Ficheiros locais versionados em `public/crests/`.
// Quando a base de dados (Supabase ancaf_teams.logo_url) não tiver imagem,
// falhar ou estiver indisponível, o portal lê automaticamente deste registo.
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
  lundasul: '/crests/lundasul-official-20260812.png',
  libolo: '/crests/libolo.png',
  lobito: '/crests/lobito.png',
  saosalvador: '/crests/saosalvador.png',
  primeiromaio: '/crests/primeiromaio.png',
  fcluanda: '/crests/fcluanda.png',
  cabinda: '/crests/cabinda-official-20260812.png',
  caala: '/crests/caala-official-20260812.png',
});

/**
 * Caminho do emblema de um clube, ou `undefined` se o ID não estiver no
 * registo (nesse caso o portal desenha o crachá de reserva com a sigla).
 */
export function getTeamCrest(teamId: string): string | undefined {
  return TEAM_CRESTS[teamId.toLowerCase()];
}

/**
 * Indica se os emblemas estão bloqueados estritamente ou se permitem leitura da BD.
 * Quando false, a base de dados é lida com fallback automático para public/crests/.
 */
export const TEAM_CRESTS_LOCKED = false;

// Recuperados dos originais de 12/08/2026. Não recorrer à BD nem às
// versões antigas quando o Storage estiver indisponível (regressão 13/09).
export function isTeamCrestProtected(teamId: string): boolean {
  return ['cabinda', 'caala', 'lundasul'].includes(teamId.toLowerCase());
}

export function resolveTeamCrest(
  teamId: string,
  candidates: readonly (string | undefined)[],
  failedSources: Readonly<Record<string, boolean>> = {},
): string | undefined {
  const canonical = getTeamCrest(teamId);
  const sources = isTeamCrestProtected(teamId) ? [canonical] : [...candidates, canonical];
  return sources.find((source) => source && !failedSources[source]);
}
