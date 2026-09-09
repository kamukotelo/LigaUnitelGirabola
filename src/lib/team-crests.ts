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
 * Indica se os emblemas estão bloqueados estritamente ou se permitem leitura da BD.
 * Quando false, a base de dados é lida com fallback automático para public/crests/.
 */
export const TEAM_CRESTS_LOCKED = false;
