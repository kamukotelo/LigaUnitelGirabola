export const CLUB_CATEGORIES = {
  jogadores: 'Listas de jogadores',
  jogos: 'Documentos de jogos',
  staff: 'Documentos do staff',
  alteracoes: 'Pedidos de alteração',
  informacoes: 'Informações',
  solicitacoes: 'Solicitações',
  sugestoes: 'Sugestões',
} as const;

export type ClubCategory = keyof typeof CLUB_CATEGORIES;
export const MAX_CLUB_ATTACHMENT_BYTES = 3_000_000;

export function isClubCategory(value: string): value is ClubCategory {
  return Object.hasOwn(CLUB_CATEGORIES, value);
}
