// Centralized Route and Menu configuration for Futibool engine

export const PAGES = {
  home: {
    path: '/',
    title: 'Home',
  },
  standings: {
    path: '/standings',
    title: 'Classificação',
  },
  fixtures: {
    path: '/fixtures',
    title: 'Calendário',
  },
  teams: {
    path: '/teams',
    title: 'Equipas',
  },
  stats: {
    path: '/stats',
    title: 'Estatísticas',
  },
  contact: {
    path: '/contact',
    title: 'Contacto',
  }
};

export const NAV_LINKS = [
  { label: 'Início', path: '/' },
  { label: 'Classificação', path: '/standings' },
  { label: 'Calendário', path: '/fixtures' },
  { label: 'Equipas', path: '/teams' },
  { label: 'Estatísticas', path: '/stats' },
  { label: 'Contacto', path: '/contact' },
];
