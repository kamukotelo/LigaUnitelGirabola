import { ROUTES } from '@/lib/routes';

// Centralized Route and Menu configuration for Futibool engine

export const PAGES = {
  home: {
    path: ROUTES.home,
    title: 'Home',
  },
  competition: {
    path: ROUTES.competition,
    title: 'Competição',
  },
  teams: {
    path: ROUTES.teams,
    title: 'Equipas',
  },
  news: {
    path: ROUTES.news,
    title: 'Notícias',
  },
  ligatv: {
    path: ROUTES.ligaTv,
    title: 'Liga TV',
  },
  contact: {
    path: ROUTES.contact,
    title: 'Contacto',
  }
};

export const NAV_LINKS = [
  { label: 'Início', path: ROUTES.home, match: ROUTES.home },
  { label: 'Jogos', path: ROUTES.calendar, match: '/competicao', tab: 'calendario' },
  { label: 'Classificação', path: ROUTES.standings, match: '/competicao', tab: 'classificacao' },
  { label: 'Estatísticas', path: ROUTES.stats, match: '/competicao', tab: 'estatisticas' },
  { label: 'Equipas', path: ROUTES.teams, match: ROUTES.teams },
  { label: 'Notícias', path: ROUTES.news, match: ROUTES.news },
  { label: 'Liga TV', path: ROUTES.ligaTv, match: ROUTES.ligaTv },
];
