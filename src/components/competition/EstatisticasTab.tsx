'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  Clock3,
  Filter,
  Users,
  ChevronDown,
  Info,
  Compass,
  Zap,
  Search,
  X,
  Flame,
  Crown,
  ArrowRightLeft,
} from 'lucide-react';
import {
  CURRENT_SEASON_SCORERS,
  getSeasonResultsUpdatedAt,
  UPCOMING_SEASON_ID,
  getPlayers,
  getCurrentSeasonCardReconciliation,
  getCurrentSeasonGoalReconciliation,
  getCurrentSeasonDiscipline,
  getCurrentSeasonAssists,
  getCurrentSeasonCleanSheets,
  getCurrentSeasonMinutesPlayed,
  getCurrentSeasonMinutesCoverage,
  getMatchesForSeason,
  getTeamFullName,
  getSeasonTeams,
} from '@/lib/data';
import {
  HISTORICAL_SCORERS_2025_26,
  HISTORICAL_ASSISTS_2025_26,
  HISTORICAL_CLEAN_SHEETS_2025_26,
  HISTORICAL_DISCIPLINE_2025_26,
} from '@/lib/historical-results-2025-26';
import TeamCrest from '@/components/ui/TeamCrest';
import AdvancedStatistics from './AdvancedStatistics';
import SeasonComparisonMatrix from './SeasonComparisonMatrix';
import { shown } from '@/lib/display';

type StatTab = 'scorers' | 'assists' | 'cleansheets' | 'yellowcards' | 'redcards' | 'minutes';
type StatsView = 'jogadores' | 'equipas' | 'comparador';

const RANKING_SIZE = 30;
const HISTORICAL_RANKING_SIZE = 15;
const LEGACY_RANKING_SIZE = 8;

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

/** Ícone de Cartão Amarelo */
function YellowCardBadge({ className = 'w-3 h-4' }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-[2px] bg-amber-400 border border-amber-500 shadow-xs rotate-[-6deg] ${className}`}
      aria-hidden="true"
    />
  );
}

/** Ícone de Cartão Vermelho */
function RedCardBadge({ className = 'w-3 h-4' }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-[2px] bg-rose-600 border border-rose-700 shadow-xs rotate-[-6deg] ${className}`}
      aria-hidden="true"
    />
  );
}

/** Concordância de número nos totais de cartões */
function cardsLabel(yellow: number, red: number): string {
  const amarelos = `${yellow} ${yellow === 1 ? 'amarelo' : 'amarelos'}`;
  const vermelhos = `${red} ${red === 1 ? 'vermelho' : 'vermelhos'}`;
  return `${amarelos} e ${vermelhos}`;
}

/**
 * 1. Abas de Estatísticas: Jogadores e Equipas (O comparador tem aba própria no hub)
 */
const STATS_VIEWS: { key: StatsView; label: string }[] = [
  { key: 'jogadores', label: 'Jogadores' },
  { key: 'equipas', label: 'Equipas' },
];

/**
 * 2. Scroll de Métricas facilitado com ícone e texto
 */
const STAT_TABS: {
  key: StatTab;
  label: string;
  emoji: string;
  icon?: (props: { className?: string }) => React.ReactNode;
}[] = [
  { key: 'scorers', label: 'Golos', emoji: '⚽' },
  { key: 'assists', label: 'Assistências', emoji: '🎯' },
  { key: 'cleansheets', label: 'Balizas Limpas', emoji: '🧤' },
  { key: 'yellowcards', label: 'Cartões Amarelos', emoji: '🟨', icon: (p) => <YellowCardBadge className={p.className} /> },
  { key: 'redcards', label: 'Cartões Vermelhos', emoji: '🟥', icon: (p) => <RedCardBadge className={p.className} /> },
  { key: 'minutes', label: 'Minutos Jogados', emoji: '⏱️' },
];

/**
 * 3. Scroll de Posições facilitado estilo Sofascore
 */
const POSITION_FILTERS = [
  { key: 'all', label: 'Todas as posições' },
  { key: 'GR', label: 'Guarda-Redes' },
  { key: 'DEF', label: 'Defesas' },
  { key: 'MED', label: 'Médios' },
  { key: 'AVA', label: 'Avançados' },
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
  const [activeView, setActiveView] = useState<StatsView>('jogadores');
  const [activeTab, setActiveTab] = useState<StatTab>('scorers');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isUpcoming = seasonId === UPCOMING_SEASON_ID;
  const allPlayers = useMemo(() => getPlayers(), []);
  const seasonTeams = useMemo(() => getSeasonTeams(seasonId), [seasonId]);
  const currentSeasonAssists = useMemo(() => getCurrentSeasonAssists(), []);
  const seasonHasStarted = getMatchesForSeason(seasonId).some((match) => match.status === 'finished' || match.status === 'live');

  const activeTeam = seasonTeams.some((team) => team.id === filterTeam) ? filterTeam : 'all';
  const activeTeamName = activeTeam === 'all' ? null : getTeamFullName(activeTeam, activeTeam);

  // Líderes rápidos de cada métrica para os mini-cards do topo (Destaques da Temporada)
  const metricLeaders = useMemo(() => {
    let topScorer: DisplayPlayer | undefined;
    let topAssist: DisplayPlayer | undefined;
    let topCleanSheet: DisplayPlayer | undefined;
    let topMinutes: DisplayPlayer | undefined;
    let topCards: DisplayPlayer | undefined;

    if (isUpcoming && seasonHasStarted) {
      if (CURRENT_SEASON_SCORERS.length > 0) {
        const sorted = [...CURRENT_SEASON_SCORERS].sort((a, b) => b.goals - a.goals);
        topScorer = {
          id: sorted[0].id, name: sorted[0].name, club: sorted[0].club, teamId: sorted[0].teamId,
          position: sorted[0].position, value: sorted[0].goals, secondaryLabel: 'Jogos', secondaryValue: sorted[0].appearances,
        };
      }
      if (currentSeasonAssists.length > 0) {
        topAssist = {
          id: currentSeasonAssists[0].id, name: currentSeasonAssists[0].name, club: currentSeasonAssists[0].club,
          teamId: currentSeasonAssists[0].teamId, position: currentSeasonAssists[0].position, value: currentSeasonAssists[0].assists,
          secondaryLabel: 'Jogos', secondaryValue: currentSeasonAssists[0].appearances,
        };
      }
      const cs = getCurrentSeasonCleanSheets().filter((gk) => gk.cleanSheets > 0);
      if (cs.length > 0) {
        topCleanSheet = {
          id: cs[0].id, name: cs[0].name, club: cs[0].club, teamId: cs[0].teamId,
          position: cs[0].position, value: cs[0].cleanSheets, secondaryLabel: 'Jogos', secondaryValue: cs[0].appearances,
        };
      }
      const mins = getCurrentSeasonMinutesPlayed();
      if (mins.length > 0) {
        topMinutes = {
          id: mins[0].id, name: mins[0].name, club: mins[0].club, teamId: mins[0].teamId,
          position: mins[0].position, value: mins[0].minutesPlayed, secondaryLabel: 'Jogos', secondaryValue: mins[0].appearances,
        };
      }
      const disc = getCurrentSeasonDiscipline().filter((p) => p.yellowCards > 0);
      if (disc.length > 0) {
        topCards = {
          id: disc[0].id, name: disc[0].name, club: disc[0].club, teamId: disc[0].teamId,
          position: disc[0].position, value: disc[0].yellowCards, secondaryLabel: 'Vermelhos', secondaryValue: disc[0].redCards,
        };
      }
    } else if (seasonId === '2025-26') {
      if (HISTORICAL_SCORERS_2025_26.length > 0) {
        const s = HISTORICAL_SCORERS_2025_26[0];
        topScorer = { id: 'h-s-0', name: s.name, club: getTeamFullName(s.teamId, s.teamId), teamId: s.teamId, position: 'Avançado', value: s.goals };
      }
      if (HISTORICAL_ASSISTS_2025_26.length > 0) {
        const a = HISTORICAL_ASSISTS_2025_26[0];
        topAssist = { id: 'h-a-0', name: a.name, club: getTeamFullName(a.teamId, a.teamId), teamId: a.teamId, position: 'Médio', value: a.assists };
      }
      const cs = HISTORICAL_CLEAN_SHEETS_2025_26.filter((gk) => gk.cleanSheets > 0);
      if (cs.length > 0) {
        topCleanSheet = { id: cs[0].id, name: cs[0].name, club: cs[0].club, teamId: cs[0].teamId, position: 'Guarda-redes', value: cs[0].cleanSheets };
      }
      if (HISTORICAL_DISCIPLINE_2025_26.length > 0) {
        const d = HISTORICAL_DISCIPLINE_2025_26[0];
        topCards = { id: `h-d-${d.id}`, name: d.name, club: d.club, teamId: d.teamId, position: d.position, value: d.yellow };
      }
    } else {
      const scorers = [...allPlayers].filter((p) => p.goals > 0).sort((a, b) => b.goals - a.goals);
      if (scorers.length > 0) {
        topScorer = { id: scorers[0].id, name: scorers[0].name, club: scorers[0].club, teamId: scorers[0].teamId, position: scorers[0].position, value: scorers[0].goals };
      }
      const assists = [...allPlayers].filter((p) => p.assists > 0).sort((a, b) => b.assists - a.assists);
      if (assists.length > 0) {
        topAssist = { id: assists[0].id, name: assists[0].name, club: assists[0].club, teamId: assists[0].teamId, position: assists[0].position, value: assists[0].assists };
      }
    }

    return { topScorer, topAssist, topCleanSheet, topMinutes, topCards };
  }, [isUpcoming, seasonHasStarted, seasonId, allPlayers, currentSeasonAssists]);

  // Compilação dos dados estatísticos
  const { displayPlayers, rankingSize } = useMemo(() => {
    let displayPlayers: DisplayPlayer[] = [];
    let rankingSize = RANKING_SIZE;

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
      displayPlayers = getCurrentSeasonCleanSheets()
        .filter((gk) => gk.cleanSheets > 0)
        .map((gk) => ({
          id: gk.id, name: gk.name, club: gk.club, teamId: gk.teamId,
          position: gk.position, value: gk.cleanSheets, secondaryLabel: 'Jogos',
          secondaryValue: gk.appearances, hasProfile: true,
        }));
    } else if (isUpcoming && seasonHasStarted && activeTab === 'minutes') {
      displayPlayers = getCurrentSeasonMinutesPlayed().map((p) => ({
        id: p.id, name: p.name, club: p.club, teamId: p.teamId,
        position: p.position, value: p.minutesPlayed, secondaryLabel: 'Jogos',
        secondaryValue: p.appearances, hasProfile: true,
      }));
    } else if (isUpcoming) {
      displayPlayers = [];
    } else if (seasonId === '2025-26') {
      rankingSize = HISTORICAL_RANKING_SIZE;
      if (activeTab === 'scorers') {
        displayPlayers = HISTORICAL_SCORERS_2025_26.map((p, idx) => ({
          id: `hist-scorer-${idx}`,
          name: p.name,
          club: getTeamFullName(p.teamId, p.teamId),
          teamId: p.teamId,
          position: 'Avançado',
          value: p.goals,
          hasProfile: false,
        }));
      } else if (activeTab === 'assists') {
        displayPlayers = HISTORICAL_ASSISTS_2025_26.map((p, idx) => ({
          id: `hist-assist-${idx}`,
          name: p.name,
          club: getTeamFullName(p.teamId, p.teamId),
          teamId: p.teamId,
          position: 'Médio / Extremo',
          value: p.assists,
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
        displayPlayers = HISTORICAL_DISCIPLINE_2025_26.map((p) => ({
          id: `hist-yc-${p.id}`, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
          value: p.yellow, secondaryLabel: 'Vermelhos', secondaryValue: p.red, hasProfile: false,
        })).sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
      } else if (activeTab === 'redcards') {
        displayPlayers = HISTORICAL_DISCIPLINE_2025_26
          .filter((p) => p.red > 0)
          .map((p) => ({
            id: `hist-rc-${p.id}`, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
            value: p.red, secondaryLabel: 'Amarelos', secondaryValue: p.yellow, hasProfile: false,
          }))
          .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
      } else if (activeTab === 'minutes') {
        displayPlayers = [];
      }
    } else {
      rankingSize = LEGACY_RANKING_SIZE;
      if (activeTab === 'scorers') {
        displayPlayers = [...allPlayers]
          .filter((p) => p.goals > 0)
          .sort((a, b) => b.goals - a.goals || b.appearances - a.appearances)
          .map((p) => ({
            id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
            value: p.goals, secondaryLabel: 'Jogos', secondaryValue: p.appearances || undefined,
          }));
      } else if (activeTab === 'assists') {
        displayPlayers = [...allPlayers]
          .filter((p) => p.assists > 0)
          .sort((a, b) => b.assists - a.assists || b.appearances - a.appearances)
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
          .sort((a, b) => b.value - a.value);
      } else if (activeTab === 'yellowcards') {
        displayPlayers = [...allPlayers]
          .map((p) => ({
            id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
            value: p.detailedStats?.yellowCards ?? 0, secondaryLabel: 'Vermelhos', secondaryValue: p.detailedStats?.redCards ?? 0,
          }))
          .filter((p) => p.value > 0)
          .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
      } else if (activeTab === 'redcards') {
        displayPlayers = [...allPlayers]
          .map((p) => ({
            id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
            value: p.detailedStats?.redCards ?? 0, secondaryLabel: 'Amarelos', secondaryValue: p.detailedStats?.yellowCards ?? 0,
          }))
          .filter((p) => p.value > 0)
          .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
      } else if (activeTab === 'minutes') {
        displayPlayers = [...allPlayers]
          .filter((p) => p.statsVerified && p.detailedStats?.minutesPlayed !== undefined)
          .map((p) => ({
            id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
            value: p.detailedStats!.minutesPlayed,
            secondaryLabel: 'Jogos', secondaryValue: p.appearances,
          }))
          .sort((a, b) => b.value - a.value);
      }
    }

    return { displayPlayers, rankingSize };
  }, [isUpcoming, seasonHasStarted, activeTab, seasonId, allPlayers, currentSeasonAssists]);

  const minutesCoverage = getCurrentSeasonMinutesCoverage();
  const cardReconciliation = getCurrentSeasonCardReconciliation();
  const goalReconciliation = getCurrentSeasonGoalReconciliation();

  const leagueRankById = useMemo(() => {
    const ranks = new Map<string, number>();
    for (const player of displayPlayers) {
      ranks.set(player.id, displayPlayers.filter((candidate) => candidate.value > player.value).length + 1);
    }
    return ranks;
  }, [displayPlayers]);

  const filteredPlayers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return displayPlayers.filter((player) => {
      const matchTeam = activeTeam === 'all' || player.teamId === activeTeam;
      if (!matchTeam) return false;
      if (filterPosition !== 'all') {
        const pos = (player.position || '').toLowerCase();
        if (filterPosition === 'GR' && !(pos.includes('guarda') || pos.includes('gr'))) return false;
        if (filterPosition === 'DEF' && !pos.includes('def')) return false;
        if (filterPosition === 'MED' && !(pos.includes('médio') || pos.includes('medio'))) return false;
        if (filterPosition === 'AVA' && !(pos.includes('avan') || pos.includes('ata'))) return false;
      }
      if (q) {
        const matchName = player.name.toLowerCase().includes(q);
        const matchClub = player.club.toLowerCase().includes(q);
        return matchName || matchClub;
      }
      return true;
    });
  }, [displayPlayers, activeTeam, filterPosition, searchQuery]);

  const withoutPosition = useMemo(() => displayPlayers.filter((player) => {
    if (activeTeam !== 'all' && player.teamId !== activeTeam) return false;
    const pos = (player.position || '').toLowerCase();
    return !pos || pos.includes('por confirmar');
  }).length, [displayPlayers, activeTeam]);

  const visiblePlayers = filteredPlayers.slice(0, rankingSize);

  const clubBestValue = filteredPlayers.length > 0 ? Math.max(...filteredPlayers.map((p) => p.value)) : 0;

  const activeStatMeta = STAT_TABS.find((t) => t.key === activeTab) ?? STAT_TABS[0];

  const quickLeaderCards = [
    {
      key: 'scorers' as StatTab,
      label: 'Melhor Marcador',
      emoji: '⚽',
      player: metricLeaders.topScorer,
      valueSuffix: 'Golos',
      colorClass: 'text-amber-500 dark:text-amber-400',
      badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
    },
    {
      key: 'assists' as StatTab,
      label: 'Mais Assistências',
      emoji: '🎯',
      player: metricLeaders.topAssist,
      valueSuffix: 'Assist.',
      colorClass: 'text-sky-500 dark:text-sky-400',
      badgeClass: 'border-sky-500/30 bg-sky-500/10 text-sky-500',
    },
    {
      key: 'cleansheets' as StatTab,
      label: 'Luva de Ouro',
      emoji: '🧤',
      player: metricLeaders.topCleanSheet,
      valueSuffix: 'Balizas',
      colorClass: 'text-emerald-500 dark:text-emerald-400',
      badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
    },
    {
      key: 'minutes' as StatTab,
      label: 'Mais Utilizado',
      emoji: '⏱️',
      player: metricLeaders.topMinutes,
      valueSuffix: 'Min.',
      colorClass: 'text-indigo-400',
      badgeClass: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
    },
    {
      key: 'yellowcards' as StatTab,
      label: 'Mais Advertido',
      emoji: '🟨',
      player: metricLeaders.topCards,
      valueSuffix: 'Amarelos',
      colorClass: 'text-amber-400',
      badgeClass: 'border-amber-400/30 bg-amber-400/10 text-amber-400',
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* 1. NAVEGAÇÃO DE TOPO COMPACTA: JOGADORES | EQUIPAS + LINK DEDICADO PARA O COMPARADOR */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-zinc-950/80 dark:bg-zinc-900/90 rounded-full border border-zinc-800/80">
          {STATS_VIEWS.map((v) => {
            const active = activeView === v.key;
            return (
              <button
                key={v.key}
                onClick={() => setActiveView(v.key)}
                className={`px-4 py-1 rounded-full text-xs font-mono uppercase font-bold tracking-wider transition-all duration-200 ${
                  active
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>

        {/* Link direto para a página/aba dedicada do Comparador */}
        <Link
          href={`/competicao/${seasonId}?tab=comparador`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-zinc-400 hover:text-accent border border-zinc-800 hover:border-accent/40 bg-zinc-950/40 hover:bg-accent/5 transition-all"
        >
          <ArrowRightLeft size={13} className="text-accent" />
          <span className="hidden sm:inline">Comparador de Temporadas</span>
          <span className="sm:hidden">Comparador</span>
          <span className="text-accent">→</span>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: JOGADORES (FILTROS COMPACTOS & RESULTADOS IMEDIATOS)             */}
      {/* ========================================================================= */}
      {activeView === 'jogadores' && (
        <div className="space-y-2.5 sm:space-y-3">
          {/* 1. SCROLL DE MÉTRICAS (ESTILO SOFASCORE - PILLS HORIZONTAIS) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5 px-0.5">
            {STAT_TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 border ${
                    active
                      ? 'bg-accent text-zinc-950 border-accent font-bold shadow-xs'
                      : 'bg-zinc-900/90 dark:bg-zinc-950/80 text-zinc-300 dark:text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 2. BARRA COMPACTA: POSIÇÕES + CLUBE + PESQUISA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-950/60 border border-zinc-800/60 p-1.5 sm:p-2 rounded-xl">
            {/* Cápsulas de Posição */}
            <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {POSITION_FILTERS.map((pos) => {
                const active = filterPosition === pos.key;
                return (
                  <button
                    key={pos.key}
                    onClick={() => setFilterPosition(pos.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all duration-150 flex-shrink-0 border ${
                      active
                        ? 'bg-white text-zinc-950 border-white shadow-xs'
                        : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    {pos.label}
                  </button>
                );
              })}
            </div>

            {/* Filtro de Clube & Pesquisa Rápida */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <Filter size={12} className="text-accent flex-shrink-0" />
                <select
                  value={activeTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  aria-label="Filtrar por clube"
                  className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 py-1 text-xs font-medium text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent max-w-[150px] sm:max-w-[200px] truncate"
                >
                  <option value="all">Todos ({seasonTeams.length})</option>
                  {seasonTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name || team.shortName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Compacto de Pesquisa */}
              <div className="relative w-32 sm:w-44 flex-shrink-0">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-500">
                  <Search size={12} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar..."
                  className="w-full pl-7 pr-6 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    title="Limpar pesquisa"
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-zinc-500 hover:text-zinc-300"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Alerta de Pré-Época */}
          {isUpcoming && !seasonHasStarted && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-2.5 items-center text-xs text-amber-500"
            >
              <AlertTriangle className="text-amber-500 flex-shrink-0" size={15} />
              <span>Temporada por iniciar: as estatísticas serão computadas logo após as primeiras súmulas oficiais homologadas.</span>
            </motion.div>
          )}

          {/* 3. CARD CONTAINER DE RANKINGS DO SOFASCORE - IMEDIATAMENTE VISÍVEL */}
          <div className="bg-zinc-950/90 dark:bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
            {/* Cabeçalho do Bloco Sofascore */}
            <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-zinc-800/60 bg-zinc-900/40">
              <div className="flex items-center gap-2">
                <span className="text-base">{activeStatMeta.emoji}</span>
                <h3 className="font-bold text-xs sm:text-sm text-foreground">
                  Ranking · {activeStatMeta.label}
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-accent font-mono">
                {visiblePlayers.length} atletas
              </span>
            </div>

            {/* Lista dos Jogadores Estilo Sofascore */}
            <div className="divide-y divide-zinc-800/50">
              {visiblePlayers.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                  Nenhum jogador encontrado para estes filtros.
                  <button
                    onClick={() => { setFilterTeam('all'); setFilterPosition('all'); setSearchQuery(''); }}
                    className="mt-2 block mx-auto text-accent underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                visiblePlayers.map((player, idx) => {
                  const rank = leagueRankById.get(player.id) ?? idx + 1;
                  const isLeagueLeader = rank === 1 && player.value > 0 && seasonHasStarted;
                  const isClubBest = !isLeagueLeader && activeTeam !== 'all' && player.value === clubBestValue && player.value > 0 && seasonHasStarted;

                  return (
                    <div
                      key={player.id}
                      className="flex items-center justify-between gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-2.5 hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Posição no Ranking + Avatar com Mini-Escudo Sobreposto */}
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        {/* Número do Ranking */}
                        <span className={`w-4 sm:w-5 text-center text-xs font-mono font-bold flex-shrink-0 ${
                          rank === 1 ? 'text-accent font-black' : rank <= 3 ? 'text-zinc-200' : 'text-zinc-500'
                        }`}>
                          {rank}
                        </span>

                        <div className="relative flex-shrink-0">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-xs font-bold text-zinc-200 overflow-hidden shadow-xs">
                            {player.name.slice(0, 2).toUpperCase()}
                          </div>
                          {/* Mini escudo do clube sobreposto no canto inferior */}
                          <div className="absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-0.5 shadow-sm border border-zinc-800">
                            <TeamCrest teamId={player.teamId} size={14} />
                          </div>
                        </div>

                        {/* Nome do Jogador e Posição / Clube */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 truncate">
                            {player.hasProfile === false ? (
                              <span className="font-semibold text-xs sm:text-sm text-foreground truncate">{player.name}</span>
                            ) : (
                              <Link
                                href={`/players/${player.id}`}
                                className="font-semibold text-xs sm:text-sm text-foreground hover:text-accent transition-colors truncate"
                              >
                                {player.name}
                              </Link>
                            )}
                            {isLeagueLeader && (
                              <span className="text-[9px] font-mono bg-accent/20 text-accent border border-accent/40 px-1.5 py-0.2 rounded-full uppercase">
                                Líder
                              </span>
                            )}
                            {isClubBest && (
                              <span className="text-[9px] font-mono bg-primary/20 text-primary border border-primary/40 px-1.5 py-0.2 rounded-full uppercase">
                                Melhor do clube
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 truncate mt-0.5 font-sans">
                            <span>{shown(player.position) ? player.position : 'Atleta'}</span>
                            <span className="text-zinc-600">·</span>
                            <span className="truncate text-zinc-500">{player.club}</span>
                          </p>
                        </div>
                      </div>

                      {/* Score Numérico Alinhado à Direita */}
                      <div className="text-right flex-shrink-0 flex items-center gap-1.5 sm:gap-2 pl-2">
                        {isLeagueLeader ? (
                          <div className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-display font-black text-sm sm:text-base">
                            <span className="w-1.5 h-1.5 rounded-xs bg-emerald-500 inline-block" />
                            <span>{activeTab === 'minutes' ? player.value.toLocaleString('pt-AO') : player.value}</span>
                          </div>
                        ) : (
                          <div className="font-display font-bold text-sm sm:text-base text-foreground pr-1">
                            {activeTab === 'minutes' ? player.value.toLocaleString('pt-AO') : player.value}
                          </div>
                        )}
                        {player.secondaryValue !== undefined && (
                          <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                            ({player.secondaryValue} {player.secondaryLabel === 'Jogos' ? 'J' : player.secondaryLabel?.slice(0, 3)})
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Destaques Rápidos da Temporada (Colapsável Discreto após a lista) */}
          <details className="group overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/40">
            <summary className="flex cursor-pointer list-none items-center justify-between p-3 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 select-none">
              <div className="flex items-center gap-2">
                <Flame size={14} className="text-accent flex-shrink-0" />
                <span>Ver Destaques da Temporada (Líderes Rápidos)</span>
              </div>
              <ChevronDown size={14} className="text-zinc-400 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="p-3 border-t border-zinc-800/60">
              <div className="flex items-center gap-2.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 px-0.5">
                {quickLeaderCards.map((card) => {
                  const isCardActive = activeTab === card.key;
                  const hasPlayer = !!card.player;

                  return (
                    <button
                      key={card.key}
                      onClick={() => setActiveTab(card.key)}
                      className={`flex-shrink-0 min-w-[180px] sm:min-w-[200px] p-2.5 rounded-xl border text-left transition-all duration-200 relative overflow-hidden ${
                        isCardActive
                          ? 'border-accent bg-accent/10 shadow-sm ring-1 ring-accent/40'
                          : 'border-zinc-800/80 bg-zinc-950/80 hover:border-zinc-700 hover:bg-zinc-900/80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1">
                          <span>{card.emoji}</span>
                          <span>{card.label}</span>
                        </span>
                        {isCardActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        )}
                      </div>

                      {hasPlayer ? (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="relative flex-shrink-0">
                              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-200">
                                {card.player!.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-0.5 border border-zinc-800">
                                <TeamCrest teamId={card.player!.teamId} size={11} />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-foreground truncate">{card.player!.name}</p>
                              <p className="text-[10px] text-zinc-500 truncate">{card.player!.club}</p>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className={`font-display font-black text-base block leading-none ${card.colorClass}`}>
                              {card.key === 'minutes' ? card.player!.value.toLocaleString('pt-AO') : card.player!.value}
                            </span>
                            <span className="text-[8px] font-mono text-zinc-500 uppercase">
                              {card.valueSuffix}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-1 text-center text-xs text-zinc-600 font-mono">
                          A aguardar dados
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </details>

          {/* Critérios Oficiais e Reconciliação (Colapsável Discreto) */}
          <details className="group overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/40">
            <summary className="flex cursor-pointer list-none items-center justify-between p-3 text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 select-none">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-accent flex-shrink-0" />
                <span>Auditoria & Critérios Oficiais FAF/ANCAF</span>
              </div>
              <ChevronDown size={14} className="text-zinc-400 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="p-4 pt-1 border-t border-zinc-800/60 text-xs text-zinc-500 space-y-2 font-mono">
              <p>
                Estatísticas atualizadas em {new Date(getSeasonResultsUpdatedAt(seasonId)).toLocaleString('pt-AO', { timeZone: 'Africa/Luanda', dateStyle: 'medium', timeStyle: 'short' })} a partir das fichas oficiais da FAF/ANCAF.
              </p>
              {goalReconciliation.goalsUnattributed > 0 && (
                <p>
                  Golos em resultados: {goalReconciliation.goalsInResults} · Atribuídos a atleta: {goalReconciliation.goalsAttributed}
                  {goalReconciliation.ownGoals > 0 && ` · Autogolos: ${goalReconciliation.ownGoals}`} · Por identificar: {goalReconciliation.goalsUnattributed}.
                </p>
              )}
              <p>
                Cartões nas fichas: {cardsLabel(cardReconciliation.yellowInSheets, cardReconciliation.redInSheets)} · Atribuídos: {cardsLabel(cardReconciliation.yellowAttributed, cardReconciliation.redAttributed)}.
              </p>
              <p>
                Minutos calculados sobre 90&apos; regulamentares: {minutesCoverage.sidesCounted} de {minutesCoverage.sidesPossible} equipas-jogo apuradas ({minutesCoverage.matchesFinished} jogos finalizados).
              </p>
            </div>
          </details>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: EQUIPAS / ANÁLISE COLETIVA AVANÇADA                              */}
      {/* ========================================================================= */}
      {activeView === 'equipas' && (
        <AdvancedStatistics seasonId={seasonId} teamId={activeTeam === 'all' ? undefined : activeTeam} />
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: COMPARADOR (SUPORTE SECUNDÁRIO E SALVAGUARDA DE REGRESSÃO)       */}
      {/* ========================================================================= */}
      {activeView === 'comparador' && (
        <SeasonComparisonMatrix clubFilter={activeTeam} seasonId={seasonId} />
      )}
    </div>
  );
}
