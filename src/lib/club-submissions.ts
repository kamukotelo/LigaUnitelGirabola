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

export const CLUB_STATUSES = {
  recebido: 'Recebido',
  analise: 'Em análise',
  corrigir: 'A corrigir',
  concluido: 'Concluído',
} as const;

export type ClubStatus = keyof typeof CLUB_STATUSES;
export const CLUB_FIELDS = {
  season: 'Época',
  level: 'Escalão',
  round: 'Jornada',
  match: 'Jogo',
  staff: 'Equipa ou função',
  record: 'Registo a corrigir',
} as const;

export const CATEGORY_FIELDS: Record<ClubCategory, (keyof typeof CLUB_FIELDS)[]> = {
  jogadores: ['season', 'level'],
  jogos: ['round', 'match'],
  staff: ['season', 'staff'],
  alteracoes: ['record'],
  informacoes: [],
  solicitacoes: [],
  sugestoes: [],
};

export const MAX_CLUB_FILES = 5;
export const CLUB_ID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export interface ClubRequest {
  id: string;
  category: ClubCategory;
  subject: string;
  message: string;
  filename: string | null;
  created_at: string;
  status: ClubStatus;
  assigned_to: string | null;
  details: Partial<Record<keyof typeof CLUB_FIELDS, string>>;
  revision: number;
  files: { id: string; filename: string; revision: number }[];
  updates: { id: string; author: 'ancaf' | 'clube'; status: ClubStatus; message: string; created_at: string }[];
}
