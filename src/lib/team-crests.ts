// ════════════════════════════════════════════════════════════════════════
// EMBLEMAS DOS CLUBES E LOGÓTIPOS DA MARCA — FONTE ÚNICA E BLOQUEADA
// ────────────────────────────────────────────────────────────────────────
// Os 16 emblemas vivem em `public/crests/` e só mudam por alteração de código.
// A base de dados, os overrides da consola e o `logoUrl` dos dados são
// ignorados para TODOS os clubes: em 09/09 e 13/09 foram estas fontes, e um
// deploy feito a partir de uma cópia antiga, que trocaram emblemas sozinhos.
//
// O conteúdo de cada ficheiro está fixado por SHA-256 em
// `scripts/verify-brand-assets.mjs`, que corre antes de cada build. Para
// trocar um emblema: substituir o ficheiro, atualizar o hash nesse script e
// publicar. Qualquer outra via falha o build.
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

/** Emblemas fixados em código: a BD e a consola não os podem substituir. */
export const TEAM_CRESTS_LOCKED = true;

/** Logótipos da marca (Girabola, ANCAF) fixados em `public/`: a consola não os troca. */
export const BRAND_LOGOS_LOCKED = true;

/** Todos os clubes do registo estão protegidos. */
export function isTeamCrestProtected(teamId: string): boolean {
  return Object.prototype.hasOwnProperty.call(TEAM_CRESTS, teamId.toLowerCase());
}

/**
 * Emblema a mostrar. Os `candidates` (override da consola, BD, `logoUrl`) ficam
 * na assinatura só por compatibilidade e nunca são usados: se o ficheiro oficial
 * falhar, mostra-se a sigla do clube, nunca outro emblema.
 */
export function resolveTeamCrest(
  teamId: string,
  candidates: readonly (string | undefined)[],
  failedSources: Readonly<Record<string, boolean>> = {},
): string | undefined {
  void candidates;
  const canonical = getTeamCrest(teamId);
  return canonical && !failedSources[canonical] ? canonical : undefined;
}
