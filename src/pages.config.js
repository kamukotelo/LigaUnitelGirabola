// Centralized Route and Menu configuration for Futibool engine

export const PAGES = {
  home: {
    path: '/',
    title: 'Home',
  },
  competition: {
    path: '/competicao',
    title: 'Competição',
  },
  teams: {
    path: '/teams',
    title: 'Equipas',
  },
  news: {
    path: '/news',
    title: 'Notícias',
  },
  ligatv: {
    path: '/ligatv',
    title: 'LigaTV',
  },
  contact: {
    path: '/contact',
    title: 'Contacto',
  }
};

export const NAV_LINKS = [
  { label: 'Início', path: '/' },
  { label: 'Competição', path: '/competicao' },
  { label: 'Equipas', path: '/teams' },
  { label: 'Notícias', path: '/news' },
  { label: 'LigaTV', path: '/ligatv' },
  { label: 'Contacto', path: '/contact' },
];
