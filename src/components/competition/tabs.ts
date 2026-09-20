// Definições das abas do hub de competição — módulo partilhado entre o
// server component da rota (validação do query param) e o client do hub.

export type HubTab = 'geral' | 'classificacao' | 'calendario' | 'estatisticas' | 'tempo-util' | 'nomeacoes';

export const HUB_TABS: { key: HubTab; label: string; shortLabel: string }[] = [
  { key: 'geral', label: 'Geral', shortLabel: 'Geral' },
  { key: 'classificacao', label: 'Classificação', shortLabel: 'Tabela' },
  { key: 'calendario', label: 'Calendário', shortLabel: 'Jogos' },
  { key: 'estatisticas', label: 'Estatísticas', shortLabel: 'Stats' },
  { key: 'tempo-util', label: 'Tempo Útil', shortLabel: 'Tempo' },
  { key: 'nomeacoes', label: 'Nomeações', shortLabel: 'Árbitros' },
];
