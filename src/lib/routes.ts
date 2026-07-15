import { CURRENT_SEASON_ID, UPCOMING_SEASON_ID } from './data';
import type { HubTab } from '@/components/competition/tabs';

const UPCOMING_TABS = new Set<HubTab>(['geral', 'calendario', 'nomeacoes']);

export function competitionPath(tab: HubTab = 'geral', seasonId?: string) {
  const season = seasonId ?? (UPCOMING_TABS.has(tab) ? UPCOMING_SEASON_ID : CURRENT_SEASON_ID);
  return `/competicao/${season}?tab=${tab}`;
}

export const ROUTES = {
  home: '/',
  competition: competitionPath('geral'),
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
  admin: '/admin',
  login: '/login',
} as const;
