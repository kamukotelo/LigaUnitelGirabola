// Definições das abas do hub de competição — módulo partilhado entre o
// server component da rota (validação do query param) e o client do hub.

export type HubTab = 'geral' | 'classificacao' | 'calendario' | 'estatisticas' | 'tempo-util' | 'nomeacoes';

export const HUB_TABS: { key: HubTab; label: string }[] = [
  { key: 'geral', label: 'Geral' },
  { key: 'classificacao', label: 'Classificação' },
  { key: 'calendario', label: 'Calendário' },
  { key: 'estatisticas', label: 'Estatísticas' },
  { key: 'tempo-util', label: 'Tempo Útil' },
  { key: 'nomeacoes', label: 'Nomeações' },
];
