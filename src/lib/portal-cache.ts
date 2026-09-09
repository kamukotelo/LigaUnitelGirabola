import 'server-only';
import { revalidateTag } from 'next/cache';

// ════════════════════════════════════════════════════════════════════════
// CACHE DO CONTEÚDO PÚBLICO — invalidado quando o admin publica
// ────────────────────────────────────────────────────────────────────────
// Até 2026-09-09 as rotas públicas (`/api/portal-data`, `/api/admin/overrides`,
// `/api/ancaf`) eram `force-dynamic` e o browser consumia-as com
// `cache: 'no-store'`. Cada visita ao portal disparava mais de uma dúzia de
// queries à base de dados, e o Realtime remandava tudo a cada alteração. Foi
// esse padrão — e não o volume de dados, que são ~270 linhas — que esgotou a
// quota do Supabase e deixou o site sem base de dados.
//
// Agora o instantâneo é calculado uma vez e servido de cache até alguém
// publicar na consola. Quem publica chama `revalidatePortalData()` e a
// próxima visita recalcula. Conteúdo que muda duas ou três vezes por semana
// não precisa de tocar na base de dados a cada visita.
// ════════════════════════════════════════════════════════════════════════

/** Etiqueta partilhada por tudo o que o portal público lê da base de dados. */
export const PORTAL_DATA_TAG = 'portal-data';

/**
 * Tempo máximo que um instantâneo pode ficar em cache sem ser recalculado.
 * É a rede de segurança para uma escrita que não passe pelas rotas da consola
 * (uma correção feita direto na base de dados, por exemplo) — o caminho normal
 * é a invalidação explícita, que é imediata.
 */
export const PORTAL_DATA_MAX_AGE_SECONDS = 300;

/**
 * Invalida o conteúdo público. Chamar em TODAS as rotas que escrevem algo que
 * o portal mostra — publicação de overrides, escalações, resultados,
 * sincronizações FCMS, automação de notícias.
 */
export function revalidatePortalData(): void {
  // `{ expire: 0 }` = expiração imediata, sem janela de conteúdo obsoleto: quem
  // publica quer ver a alteração já. (`updateTag`, que teria a mesma semântica,
  // só é permitido em Server Actions e rebenta em rotas de API; `revalidateTag`
  // sem segundo argumento está descontinuado no Next 16.)
  revalidateTag(PORTAL_DATA_TAG, { expire: 0 });
}
