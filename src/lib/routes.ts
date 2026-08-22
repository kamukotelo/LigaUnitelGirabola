import { CURRENT_SEASON_ID } from './data';
import type { HubTab } from '@/components/competition/tabs';

export function competitionPath(tab: HubTab = 'calendario', seasonId?: string) {
  const season = seasonId ?? CURRENT_SEASON_ID;
  return `/competicao/${season}?tab=${tab}`;
}

export const ROUTES = {
  home: '/',
  competition: competitionPath('calendario'),
  standings: competitionPath('classificacao'),
  calendar: competitionPath('calendario'),
  stats: competitionPath('estatisticas'),
  nominations: competitionPath('nomeacoes'),
  teams: '/teams',
  news: '/news',
  ligaTv: '/ligatv',
  contact: '/contact',
  terms: '/termos',
  privacy: '/privacidade',
  admin: '/adminancaf2026',
  login: '/login',
} as const;
