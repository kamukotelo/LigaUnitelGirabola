'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Award, Shield, AlertTriangle, CheckCircle2, Clock3, Filter } from 'lucide-react';
import { CURRENT_SEASON_SCORERS, getSeasonResultsUpdatedAt, UPCOMING_SEASON_ID, getPlayers, getCurrentSeasonCardReconciliation, getCurrentSeasonGoalReconciliation, getCurrentSeasonDiscipline, getCurrentSeasonAssists, getCurrentSeasonCleanSheets, getCurrentSeasonMinutesPlayed, getCurrentSeasonMinutesCoverage, getMatchesForSeason, getTeamFullName, getAllTeams } from '@/lib/data';
import {
  HISTORICAL_SCORERS_2025_26,
  HISTORICAL_ASSISTS_2025_26,
  HISTORICAL_CLEAN_SHEETS_2025_26,
} from '@/lib/historical-results-2025-26';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';
import AdvancedStatistics from './AdvancedStatistics';
import SeasonComparisonMatrix from './SeasonComparisonMatrix';

type StatTab = 'scorers' | 'assists' | 'cleansheets' | 'yellowcards' | 'redcards' | 'minutes';

/** Lugares apresentados no ranking de minutos em campo. */
const MINUTES_RANKING_SIZE = 30;

interface DisplayPlayer {
  id: string;
  name: string;
  club: string;
  teamId: string;
  position: string;
  value: number;
  secondaryLabel?: string;
  secondaryValue?: number | string;
  hasProfile?: boolean;
}

/** Concordância de número nos totais de cartões ("1 amarelo", "12 amarelos"). */
function cardsLabel(yellow: number, red: number): string {
  const amarelos = `${yellow} ${yellow === 1 ? 'amarelo' : 'amarelos'}`;
  const vermelhos = `${red} ${red === 1 ? 'vermelho' : 'vermelhos'}`;
  return `${amarelos} e ${vermelhos}`;
}

const STAT_TABS: { key: StatTab; label: string }[] = [
  { key: 'scorers', label: '⚽ Goleadores' },
  { key: 'assists', label: '🎯 Assistências' },
  { key: 'cleansheets', label: '🧤 Baliza Limpa' },
  { key: 'yellowcards', label: '🟨 Amarelos' },
  { key: 'redcards', label: '🟥 Vermelhos' },
  { key: 'minutes', label: '⏱ Minutos' },
];

const VALUE_LABELS: Record<StatTab, string> = {
  scorers: 'Golos',
  assists: 'Assistências',
  cleansheets: 'Balizas Limpas',
  yellowcards: 'Amarelos',
  redcards: 'Vermelhos',
  minutes: 'Minutos',
};

export default function EstatisticasTab({ seasonId }: { seasonId: string }) {
  const [activeTab, setActiveTab] = useState<StatTab>('scorers');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');

  const isUpcoming = seasonId === UPCOMING_SEASON_ID;
  const allPlayers = getPlayers();
  const allTeams = getAllTeams();
  const currentSeasonAssists = getCurrentSeasonAssists();
  const seasonHasStarted = getMatchesForSeason(seasonId).some((match) => match.status === 'finished' || match.status === 'live');

  // Compile statistics list based on selected season and active tab
  let displayPlayers: DisplayPlayer[] = [];

  if (isUpcoming && seasonHasStarted && activeTab === 'scorers') {
    displayPlayers = CURRENT_SEASON_SCORERS.map((player) => ({
      id: player.id, name: player.name, club: player.club, teamId: player.teamId,
      position: player.position, value: player.goals, secondaryLabel: 'Jogos',
      secondaryValue: player.appearances, hasProfile: true,
    })).sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
  } else if (isUpcoming && seasonHasStarted && activeTab === 'assists') {
    displayPlayers = currentSeasonAssists.map((player) => ({
      id: player.id, name: player.name, club: player.club, teamId: player.teamId,
      position: player.position, value: player.assists, secondaryLabel: 'Jogos',
      secondaryValue: player.appearances, hasProfile: true,
    }));
  } else if (isUpcoming && seasonHasStarted && activeTab === 'yellowcards') {
    displayPlayers = getCurrentSeasonDiscipline()
      .filter((player) => player.yellowCards > 0)
      .map((player) => ({
        id: player.id, name: player.name, club: player.club, teamId: player.teamId,
        position: player.position, value: player.yellowCards, secondaryLabel: 'Vermelhos',
        secondaryValue: player.redCards, hasProfile: true,
      }))
      .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
  } else if (isUpcoming && seasonHasStarted && activeTab === 'redcards') {
    displayPlayers = getCurrentSeasonDiscipline()
      .filter((player) => player.redCards > 0)
      .map((player) => ({
        id: player.id, name: player.name, club: player.club, teamId: player.teamId,
        position: player.position, value: player.redCards, secondaryLabel: 'Amarelos',
        secondaryValue: player.yellowCards, hasProfile: true,
      }))
      .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
  } else if (isUpcoming && seasonHasStarted && activeTab === 'cleansheets') {
    displayPlayers = getCurrentSeasonCleanSheets().map((gk) => ({
      id: gk.id, name: gk.name, club: gk.club, teamId: gk.teamId,
      position: gk.position, value: gk.cleanSheets, secondaryLabel: 'Jogos',
      secondaryValue: gk.appearances, hasProfile: true,
    }));
  } else if (isUpcoming && seasonHasStarted && activeTab === 'minutes') {
    // Praticamente todo o plantel escalado entra nesta lista; o ranking mostra
    // os 30 primeiros, como nas outras tabelas. O total de cada atleta continua
    // disponível na respetiva página de jogador.
    displayPlayers = getCurrentSeasonMinutesPlayed().slice(0, MINUTES_RANKING_SIZE).map((p) => ({
      id: p.id, name: p.name, club: p.club, teamId: p.teamId,
      position: p.position, value: p.minutesPlayed, secondaryLabel: 'Jogos',
      secondaryValue: p.appearances, hasProfile: true,
    }));
  } else if (isUpcoming) {
    displayPlayers = [];
  } else if (seasonId === '2025-26') {
    if (activeTab === 'scorers') {
      displayPlayers = HISTORICAL_SCORERS_2025_26.slice(0, 15).map((p, idx) => ({
        id: `hist-scorer-${idx}`,
        name: p.name,
        club: getTeamFullName(p.teamId, p.teamId),
        teamId: p.teamId,
        position: 'Avançado',
        value: p.goals,
        secondaryLabel: 'Jogos',
        secondaryValue: 30,
        hasProfile: false,
      }));
    } else if (activeTab === 'assists') {
      displayPlayers = HISTORICAL_ASSISTS_2025_26.slice(0, 15).map((p, idx) => ({
        id: `hist-assist-${idx}`,
        name: p.name,
        club: getTeamFullName(p.teamId, p.teamId),
        teamId: p.teamId,
        position: 'Médio / Extremo',
        value: p.assists,
        secondaryLabel: 'Jogos',
        secondaryValue: 30,
        hasProfile: false,
      }));
    } else if (activeTab === 'cleansheets') {
      displayPlayers = HISTORICAL_CLEAN_SHEETS_2025_26.map((gk) => ({
        id: gk.id,
        name: gk.name,
        club: gk.club,
        teamId: gk.teamId,
        position: 'Guarda-redes',
        value: gk.cleanSheets,
        secondaryLabel: 'Jogos',
        secondaryValue: gk.appearances,
        hasProfile: false,
      }));
    } else if (activeTab === 'yellowcards') {
      displayPlayers = [
        { id: 'yc-1', name: 'Moisés', club: 'Estrela 1.º de Maio', teamId: 'primeiromaio', position: 'Defesa', value: 9, secondaryLabel: 'Vermelhos', secondaryValue: 1, hasProfile: false },
        { id: 'yc-2', name: 'Singongo', club: 'Desportivo da Lunda-Sul', teamId: 'lundasul', position: 'Defesa', value: 8, secondaryLabel: 'Vermelhos', secondaryValue: 0, hasProfile: false },
        { id: 'yc-3', name: 'Ludy', club: 'Desportivo da Huíla', teamId: 'desphuila', position: 'Defesa', value: 8, secondaryLabel: 'Vermelhos', secondaryValue: 0, hasProfile: false },
        { id: 'yc-4', name: 'Chimito', club: 'Recreativo do Libolo', teamId: 'libolo', position: 'Médio', value: 8, secondaryLabel: 'Vermelhos', secondaryValue: 1, hasProfile: false },
        { id: 'yc-5', name: 'Cahilo', club: 'Sagrada Esperança', teamId: 'sagrada', position: 'Médio', value: 7, secondaryLabel: 'Vermelhos', secondaryValue: 0, hasProfile: false },
        { id: 'yc-6', name: 'Marcos', club: 'FC de Cabinda', teamId: 'cabinda', position: 'Defesa', value: 7, secondaryLabel: 'Vermelhos', secondaryValue: 0, hasProfile: false },
        { id: 'yc-7', name: 'Venâncio', club: 'CD 1.º de Agosto', teamId: 'dago', position: 'Médio', value: 7, secondaryLabel: 'Vermelhos', secondaryValue: 0, hasProfile: false },
        { id: 'yc-8', name: 'Deybi Flores', club: 'Petro de Luanda', teamId: 'petro', position: 'Médio', value: 6, secondaryLabel: 'Vermelhos', secondaryValue: 0, hasProfile: false },
      ];
    } else if (activeTab === 'redcards') {
      displayPlayers = [
        { id: 'rc-1', name: 'Moisés', club: 'Estrela 1.º de Maio', teamId: 'primeiromaio', position: 'Defesa', value: 2, secondaryLabel: 'Amarelos', secondaryValue: 9, hasProfile: false },
        { id: 'rc-2', name: 'Chimito', club: 'Recreativo do Libolo', teamId: 'libolo', position: 'Médio', value: 1, secondaryLabel: 'Amarelos', secondaryValue: 8, hasProfile: false },
        { id: 'rc-3', name: 'Cahilo', club: 'Sagrada Esperança', teamId: 'sagrada', position: 'Médio', value: 1, secondaryLabel: 'Amarelos', secondaryValue: 7, hasProfile: false },
        { id: 'rc-4', name: 'Manico', club: 'Bravos do Maquis', teamId: 'bravos', position: 'Defesa', value: 1, secondaryLabel: 'Amarelos', secondaryValue: 5, hasProfile: false },
        { id: 'rc-5', name: 'Kibeixa', club: 'Guelson FC', teamId: 'guelson', position: 'Médio', value: 1, secondaryLabel: 'Amarelos', secondaryValue: 6, hasProfile: false },
        { id: 'rc-6', name: 'Benvindo', club: 'Redonda FC', teamId: 'redonda', position: 'Avançado', value: 1, secondaryLabel: 'Amarelos', secondaryValue: 4, hasProfile: false },
      ];
    } else if (activeTab === 'minutes') {
      displayPlayers = [
        { id: 'min-1', name: 'Hugo Marques', club: 'Petro de Luanda', teamId: 'petro', position: 'Guarda-redes', value: 2700, secondaryLabel: 'Jogos', secondaryValue: 30, hasProfile: false },
        { id: 'min-2', name: 'Neblú', club: 'CD 1.º de Agosto', teamId: 'dago', position: 'Guarda-redes', value: 2700, secondaryLabel: 'Jogos', secondaryValue: 30, hasProfile: false },
        { id: 'min-3', name: 'Titi', club: 'Wiliete Sport Clube', teamId: 'wiliete', position: 'Guarda-redes', value: 2680, secondaryLabel: 'Jogos', secondaryValue: 30, hasProfile: false },
        { id: 'min-4', name: 'Ndulo', club: 'Desportivo da Huíla', teamId: 'desphuila', position: 'Guarda-redes', value: 2610, secondaryLabel: 'Jogos', secondaryValue: 29, hasProfile: false },
        { id: 'min-5', name: 'Kacusso', club: 'Desportivo da Lunda-Sul', teamId: 'lundasul', position: 'Guarda-redes', value: 2590, secondaryLabel: 'Jogos', secondaryValue: 29, hasProfile: false },
        { id: 'min-6', name: 'Tiago Azulão', club: 'Petro de Luanda', teamId: 'petro', position: 'Avançado', value: 2540, secondaryLabel: 'Jogos', secondaryValue: 29, hasProfile: false },
        { id: 'min-7', name: 'Dagó Tshibamba', club: 'CD 1.º de Agosto', teamId: 'dago', position: 'Avançado', value: 2510, secondaryLabel: 'Jogos', secondaryValue: 28, hasProfile: false },
        { id: 'min-8', name: 'Kaporal', club: 'Wiliete Sport Clube', teamId: 'wiliete', position: 'Avançado', value: 2490, secondaryLabel: 'Jogos', secondaryValue: 28, hasProfile: false },
      ];
    }
  } else {
    if (activeTab === 'scorers') {
      displayPlayers = [...allPlayers]
        .filter((p) => p.goals > 0)
        .sort((a, b) => b.goals - a.goals || b.appearances - a.appearances)
        .slice(0, 8)
        .map((p) => ({
          id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
          value: p.goals, secondaryLabel: 'Jogos', secondaryValue: p.appearances || undefined,
        }));
    } else if (activeTab === 'assists') {
      displayPlayers = [...allPlayers]
        .filter((p) => p.assists > 0)
        .sort((a, b) => b.assists - a.assists || b.appearances - a.appearances)
        .slice(0, 8)
        .map((p) => ({
          id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
          value: p.assists, secondaryLabel: 'Jogos', secondaryValue: p.appearances,
        }));
    } else if (activeTab === 'cleansheets') {
      const goalkeepers = [...allPlayers].filter(
        (p) => p.position.toLowerCase().includes('guarda-redes') || p.position.toLowerCase().includes('guarda redes')
      );
      displayPlayers = goalkeepers
        .map((p) => ({
          id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
          value: p.detailedStats?.cleanSheets ?? 0,
          secondaryLabel: 'Jogos', secondaryValue: p.appearances,
        }))
        .filter((p) => p.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
    } else if (activeTab === 'yellowcards') {
      displayPlayers = [...allPlayers]
        .map((p) => ({
          id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
          value: p.detailedStats?.yellowCards ?? 0, secondaryLabel: 'Vermelhos', secondaryValue: p.detailedStats?.redCards ?? 0,
        }))
        .filter((p) => p.value > 0)
        .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number))
        .slice(0, 8);
    } else if (activeTab === 'redcards') {
      displayPlayers = [...allPlayers]
        .map((p) => ({
          id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
          value: p.detailedStats?.redCards ?? 0, secondaryLabel: 'Amarelos', secondaryValue: p.detailedStats?.yellowCards ?? 0,
        }))
        .filter((p) => p.value > 0)
        .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number))
        .slice(0, 8);
    } else if (activeTab === 'minutes') {
      displayPlayers = [...allPlayers]
        .filter((p) => p.statsVerified && p.detailedStats?.minutesPlayed !== undefined)
        .map((p) => ({
          id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
          value: p.detailedStats!.minutesPlayed,
          secondaryLabel: 'Jogos', secondaryValue: p.appearances,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    }
  }

  const minutesCoverage = getCurrentSeasonMinutesCoverage();
  const cardReconciliation = getCurrentSeasonCardReconciliation();
  const goalReconciliation = getCurrentSeasonGoalReconciliation();

  const filteredPlayers = useMemo(() => {
    return displayPlayers.filter((player) => {
      const matchTeam = filterTeam === 'all' || player.teamId === filterTeam;
      if (!matchTeam) return false;
      if (filterPosition === 'all') return true;
      const pos = (player.position || '').toLowerCase();
      if (filterPosition === 'GR') return pos.includes('guarda') || pos.includes('gr');
      if (filterPosition === 'DEF') return pos.includes('def');
      if (filterPosition === 'MED') return pos.includes('médio') || pos.includes('medio');
      if (filterPosition === 'AVA') return pos.includes('avan');
      return true;
    });
  }, [displayPlayers, filterTeam, filterPosition]);

  const maxStatValue = filteredPlayers.length > 0 ? Math.max(...filteredPlayers.map((p) => p.value)) : 1;

  const leaderPlayer = filteredPlayers[0];
  const leaderPlayerDetails = leaderPlayer ? allPlayers.find((p) => p.id === leaderPlayer.id) : null;

  const currentSeasonAvailability = [
    { label: 'Goleadores', available: CURRENT_SEASON_SCORERS.length > 0 },
    { label: 'Cartões amarelos', available: getCurrentSeasonDiscipline().some((p) => p.yellowCards > 0) },
    { label: 'Cartões vermelhos', available: getCurrentSeasonDiscipline().some((p) => p.redCards > 0) },
    { label: 'Balizas limpas', available: getCurrentSeasonCleanSheets().length > 0 },
    { label: 'Minutos jogados', available: getCurrentSeasonMinutesPlayed().length > 0 },
    { label: 'Assistências', available: currentSeasonAssists.length > 0 },
  ];

  return (
    <div>
      {seasonId === '2025-26' && (
        <div className="mb-6 max-w-4xl rounded-2xl border border-zinc-200/80 bg-white/60 p-4 dark:border-zinc-800/80 dark:bg-zinc-950/40">
          <p className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Award size={16} className="text-accent" />
            Consolidado Oficial da Temporada 2025/2026 (Métrica Base do Girabola)
          </p>
          <p className="mt-1 text-xs text-zinc-500 font-mono">
            Classificação estatística definitiva dos 240 jogos realizados no Girabola 2025/2026. Serve como métrica de referência oficial para a época 2026/2027.
          </p>
        </div>
      )}

      {isUpcoming && seasonHasStarted && (
        <div className="mb-6 max-w-4xl rounded-2xl border border-zinc-200 bg-white/40 p-4 dark:border-zinc-800 dark:bg-zinc-950/30">
          <p className="mb-3 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Estatísticas atualizadas em {new Date(getSeasonResultsUpdatedAt(seasonId)).toLocaleString('pt-AO', { timeZone: 'Africa/Luanda', dateStyle: 'medium', timeStyle: 'short' })}
          </p>
          <div className="flex flex-wrap gap-2" aria-label="Disponibilidade das estatísticas oficiais">
            {currentSeasonAvailability.map((metric) => (
              <span
                key={metric.label}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${
                  metric.available
                    ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                }`}
              >
                {metric.available ? <CheckCircle2 size={12} /> : <Clock3 size={12} />}
                {metric.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Módulo Comparador Geral de Temporadas */}
      <SeasonComparisonMatrix />

      {/* Sub-abas de métricas */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-900 mb-6 max-w-3xl overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {STAT_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-5 sm:px-6 py-4 text-center text-xs font-mono uppercase tracking-wider font-extrabold border-b-2 transition-all duration-200 flex-shrink-0 ${
              activeTab === t.key
                ? 'text-accent border-accent bg-accent/5'
                : 'text-zinc-500 border-transparent hover:text-foreground hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filtros de Clube e Posição */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-500 font-bold">
            <Filter size={14} className="text-accent" />
            <span>Filtrar:</span>
          </div>

          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="all">Todos os Clubes ({allTeams.length})</option>
            {allTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.shortName || team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: 'all', label: 'Todas Posições' },
            { key: 'GR', label: 'Guarda-Redes' },
            { key: 'DEF', label: 'Defesas' },
            { key: 'MED', label: 'Médios' },
            { key: 'AVA', label: 'Avançados' },
          ].map((pos) => (
            <button
              key={pos.key}
              onClick={() => setFilterPosition(pos.key)}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition-colors ${
                filterPosition === pos.key
                  ? 'bg-accent text-zinc-950 font-bold shadow-sm'
                  : 'bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-foreground'
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>
      </div>

      {/* Season Preparation Banner */}
      {isUpcoming && !seasonHasStarted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 bg-amber-500/5 border border-amber-500/30 rounded-2xl flex gap-3.5 items-start max-w-4xl"
        >
          <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase font-mono tracking-wider">Temporada por Iniciar</h4>
            <p className="text-xs text-zinc-500 mt-1">
              As estatísticas individuais estão inicializadas a zero. As listas de rendimento serão atualizadas em tempo real assim que os primeiros jogos oficiais da época começarem.
            </p>
          </div>
        </motion.div>
      )}

      {isUpcoming && seasonHasStarted && displayPlayers.length === 0 && (
        <div className="mb-8 p-5 bg-zinc-500/5 border border-zinc-500/20 rounded-2xl flex gap-3.5 items-start max-w-4xl">
          <AlertTriangle className="text-zinc-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs font-semibold text-foreground">Esta métrica ainda aguarda dados oficiais.</p>
            <p className="mt-1 text-xs text-zinc-500">Os cartões e goleadores continuam visíveis porque já foram identificados nas fichas recebidas. Esta lista será preenchida quando a respetiva informação for importada, sem criar valores estimados.</p>
          </div>
        </div>
      )}

      {isUpcoming && seasonHasStarted && activeTab === 'scorers' && displayPlayers.length > 0 && (
        <div className="mb-8 p-4 bg-zinc-500/5 border border-zinc-500/20 rounded-2xl max-w-4xl">
          <p className="text-xs text-zinc-500">
            Lista individual baseada apenas nos golos cujo autor foi identificado nas fichas recebidas. Golos ainda sem nome confirmado ou autogolos permanecem apenas no resultado do respetivo jogo.
          </p>
          <p className="text-xs text-zinc-500 mt-2 font-mono">
            Golos nos resultados: {goalReconciliation.goalsInResults} ·
            {' '}Atribuídos a jogador: {goalReconciliation.goalsAttributed} ·
            {goalReconciliation.ownGoals ? ` Autogolos: ${goalReconciliation.ownGoals} ·` : ''}
            {' '}Por identificar: {goalReconciliation.goalsUnattributed}.
          </p>
        </div>
      )}

      {isUpcoming && seasonHasStarted && (activeTab === 'yellowcards' || activeTab === 'redcards') && displayPlayers.length > 0 && (
        <div className="mb-8 p-4 bg-zinc-500/5 border border-zinc-500/20 rounded-2xl max-w-4xl">
          <p className="text-xs text-zinc-500">
            Lista individual baseada apenas nos cartões cujo jogador foi identificado nas fichas recebidas. Cartões ainda sem nome confirmado permanecem apenas no total do respetivo jogo.
          </p>
          <p className="text-xs text-zinc-500 mt-2 font-mono">
            Fichas oficiais: {cardsLabel(cardReconciliation.yellowInSheets, cardReconciliation.redInSheets)} ·
            {' '}Atribuídos a jogador: {cardsLabel(cardReconciliation.yellowAttributed, cardReconciliation.redAttributed)} ·
            {' '}Por identificar: {cardsLabel(cardReconciliation.yellowUnattributed, cardReconciliation.redUnattributed)}.
          </p>
        </div>
      )}

      {isUpcoming && seasonHasStarted && activeTab === 'minutes' && displayPlayers.length > 0 && (
        <div className="mb-8 p-4 bg-zinc-500/5 border border-zinc-500/20 rounded-2xl max-w-4xl">
          <p className="text-xs text-zinc-500">
            Minutos calculados a partir do onze inicial e da cronologia de substituições e expulsões de cada ficha oficial,
            sobre os 90 minutos regulamentares. Uma equipa só entra quando a ficha publica os titulares <strong>e</strong> as
            substituições — sem elas não é possível saber quem saiu de campo, e nenhum valor é estimado.
          </p>
          <p className="text-xs text-zinc-500 mt-2 font-mono">
            Fichas reconstruídas: {minutesCoverage.sidesCounted} de {minutesCoverage.sidesPossible} equipas-jogo ·
            {' '}{minutesCoverage.matchesFinished} jogos terminados ·
            {' '}Ranking: {MINUTES_RANKING_SIZE} primeiros.
          </p>
        </div>
      )}

      {/* Statistics List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main List Container */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${seasonId}-${activeTab}-${filterTeam}-${filterPosition}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {filteredPlayers.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 font-mono text-xs">
                  Nenhum jogador encontrado com os filtros selecionados.
                  <button
                    onClick={() => { setFilterTeam('all'); setFilterPosition('all'); }}
                    className="mt-3 block mx-auto text-accent underline hover:opacity-80"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                filteredPlayers.map((player, idx) => {
                  const rank = filteredPlayers.filter((candidate) => candidate.value > player.value).length + 1;
                  const isLeader = rank === 1 && player.value > 0 && seasonHasStarted;
                  const percent = maxStatValue > 0 ? Math.round((player.value / maxStatValue) * 100) : 0;

                  return (
                    <AnimatedCard
                      key={player.id}
                      variant={isLeader ? 'holographic' : 'hud'}
                      className="bg-zinc-100/30 dark:bg-zinc-950/30 border-zinc-200/60 dark:border-zinc-900/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >

                      {/* Rank, Name, Logo & Club */}
                      <div className="flex items-center gap-4 min-w-0 md:min-w-[250px] w-full md:w-auto">
                        <span className={`text-2xl font-display font-black w-8 text-center flex-shrink-0 ${
                          isLeader ? 'text-accent animate-pulse' : 'text-zinc-600'
                        }`}>
                          {rank}
                        </span>
                        <TeamCrest teamId={player.teamId} size={48} className="filter drop-shadow-[0_0_6px_rgba(255,255,255,0.08)]" />
                        <div className="min-w-0">
                          <h3 className="text-foreground font-bold uppercase text-sm flex items-center gap-2 truncate">
                            {player.hasProfile === false ? player.name : (
                              <Link href={`/players/${player.id}`} className="hover:text-primary transition-colors truncate">{player.name}</Link>
                            )}
                            {isLeader && (
                              <span className="text-[9px] font-mono bg-accent/20 text-accent border border-accent/40 px-2 py-0.5 rounded-full uppercase flex-shrink-0">
                                {filteredPlayers.filter((candidate) => candidate.value === player.value).length > 1 ? 'Liderança partilhada' : 'Líder'}
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5 truncate">
                            <Shield size={10} className="text-zinc-600 flex-shrink-0" />
                            {player.club} · {player.position}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar Meter */}
                      <div className="flex-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-1.5 uppercase">
                          <span>{seasonHasStarted ? 'Percentual sobre líder' : 'Inicializado'}</span>
                          <span>{seasonHasStarted ? `${percent}%` : '0%'}</span>
                        </div>
                        <div className="w-full h-2 bg-white/80 dark:bg-zinc-900/80 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: seasonHasStarted ? `${percent}%` : '0%' }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                            className={`h-full rounded-full ${
                              isLeader
                                ? 'bg-gradient-to-r from-primary to-accent'
                                : 'bg-primary'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Score Value Display */}
                      <div className="text-center md:text-right pl-4 min-w-[80px]">
                        <span className={`${activeTab === 'minutes' ? 'text-3xl' : 'text-4xl'} font-display font-black tracking-tighter ${
                          isLeader ? 'text-accent' : 'text-foreground'
                        }`}>
                          {activeTab === 'minutes' ? player.value.toLocaleString('pt-AO') : player.value}
                        </span>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">
                          {VALUE_LABELS[activeTab]}
                        </p>
                        {player.secondaryValue !== undefined && (
                          <p className="text-[8px] font-mono text-zinc-400 mt-0.5">
                            {player.secondaryLabel}: {player.secondaryValue}
                          </p>
                        )}
                      </div>

                    </AnimatedCard>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Info Box Sidebar */}
        <div className="space-y-6">

          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Flame size={16} className="text-accent" />
              {seasonHasStarted ? 'Perfil em Foco' : 'Destaque Preparado'}
            </h3>

            <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="p-4 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <h4 className="font-bold text-foreground text-md uppercase">
                  {seasonHasStarted ? leaderPlayer?.name ?? 'A aguardar dados' : 'Aguardando Época'}
                </h4>
                <p className="text-accent font-mono text-[10px] mt-0.5">
                  {seasonHasStarted ? (leaderPlayer?.club.toUpperCase() ?? 'LIGA UNITEL GIRABOLA') : 'LIGA UNITEL GIRABOLA'}
                </p>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono">
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-foreground font-bold block text-sm">
                      {seasonHasStarted ? (leaderPlayerDetails?.appearances ?? 0) : 0}
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase">Jogos</span>
                  </div>
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-accent font-bold block text-sm">
                      {seasonHasStarted ? (activeTab === 'scorers' ? leaderPlayer?.value ?? 0 : leaderPlayerDetails?.goals ?? 0) : 0}
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase">Golos</span>
                  </div>
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-foreground font-bold block text-sm">
                      {seasonHasStarted ? (leaderPlayerDetails?.assists ?? 0) : 0}
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase">Assistências</span>
                  </div>
                </div>
              </div>
              <p>
                {isUpcoming
                  ? (seasonHasStarted ? 'Dados oficiais consolidados a partir das fichas publicadas nesta temporada.' : 'A aguardar o início da temporada.')
                  : (leaderPlayerDetails?.bio ?? 'Destaque individual com rendimento estelar no campeonato nacional.')}
              </p>
            </div>
          </AnimatedCard>

          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award size={16} className="text-accent" /> Prémios oficiais da ANCAF
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A ANCAF (Associação Nacional de Clubes Angolanos de Futebol) atribui no encerramento oficial de cada campeonato a Bola de Ouro ao Melhor Jogador, o Troféu de Artilheiro (Melhor Marcador), e a Luva de Ouro (Guarda-redes Menos Batido).
            </p>
          </AnimatedCard>

        </div>

      </div>
      <AdvancedStatistics seasonId={seasonId} />
    </div>
  );
}
