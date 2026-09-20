'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Flame,
  Award,
  Shield,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Filter,
  Trophy,
  Sparkles,
  Users,
  Compass,
  ArrowRightLeft,
  BarChart3,
  Crown,
  ChevronDown,
  Info,
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
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';
import AdvancedStatistics from './AdvancedStatistics';
import SeasonComparisonMatrix from './SeasonComparisonMatrix';
import { shown } from '@/lib/display';

type StatTab = 'scorers' | 'assists' | 'cleansheets' | 'yellowcards' | 'redcards' | 'minutes';
type StatsView = 'rankings' | 'comparison' | 'advanced';

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

/** Ícone estilizado de bola de futebol */
function SoccerBallIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 7 14.85 9.07 13.76 12.43 10.24 12.43 9.15 9.07 12 7" fill="currentColor" fillOpacity="0.25" />
      <line x1="12" y1="2" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="22" />
      <line x1="2" y1="12" x2="7.2" y2="10.8" />
      <line x1="22" y1="12" x2="16.8" y2="10.8" />
      <line x1="4.93" y1="19.07" x2="9.15" y2="15.8" />
      <line x1="19.07" y1="19.07" x2="14.85" y2="15.8" />
    </svg>
  );
}

/** Ícone de Cartão Amarelo */
function YellowCardIcon({ className = 'w-3.5 h-4' }: { className?: string }) {
  return (
    <span className={`inline-block rounded-[3px] bg-amber-400 border border-amber-500/80 shadow-xs rotate-[-8deg] flex-shrink-0 ${className}`} aria-hidden="true" />
  );
}

/** Ícone de Cartão Vermelho */
function RedCardIcon({ className = 'w-3.5 h-4' }: { className?: string }) {
  return (
    <span className={`inline-block rounded-[3px] bg-rose-600 border border-rose-700/80 shadow-xs rotate-[-8deg] flex-shrink-0 ${className}`} aria-hidden="true" />
  );
}

/** Concordância de número nos totais de cartões */
function cardsLabel(yellow: number, red: number): string {
  const amarelos = `${yellow} ${yellow === 1 ? 'amarelo' : 'amarelos'}`;
  const vermelhos = `${red} ${red === 1 ? 'vermelho' : 'vermelhos'}`;
  return `${amarelos} e ${vermelhos}`;
}

const STATS_VIEWS: { key: StatsView; label: string; shortLabel: string; icon: typeof Trophy }[] = [
  { key: 'rankings', label: 'Rankings Individuais', shortLabel: 'Jogadores', icon: Trophy },
  { key: 'comparison', label: 'Comparador de Épocas', shortLabel: 'Comparador', icon: ArrowRightLeft },
  { key: 'advanced', label: 'Análise Coletiva', shortLabel: 'Clubes', icon: BarChart3 },
];

const STAT_TABS: {
  key: StatTab;
  label: string;
  shortLabel: string;
  icon: typeof SoccerBallIcon | typeof Sparkles | typeof ShieldCheck | typeof Clock3 | typeof YellowCardIcon | typeof RedCardIcon;
}[] = [
  { key: 'scorers', label: 'Melhores Marcadores', shortLabel: 'Golos', icon: SoccerBallIcon },
  { key: 'assists', label: 'Assistências', shortLabel: 'Assist.', icon: Sparkles },
  { key: 'cleansheets', label: 'Balizas Invioladas', shortLabel: 'Baliza', icon: ShieldCheck },
  { key: 'yellowcards', label: 'Cartões Amarelos', shortLabel: 'Amarelos', icon: YellowCardIcon },
  { key: 'redcards', label: 'Cartões Vermelhos', shortLabel: 'Vermelhos', icon: RedCardIcon },
  { key: 'minutes', label: 'Minutos Jogados', shortLabel: 'Minutos', icon: Clock3 },
];

const VALUE_LABELS: Record<StatTab, string> = {
  scorers: 'Golos',
  assists: 'Assistências',
  cleansheets: 'Balizas Limpas',
  yellowcards: 'Amarelos',
  redcards: 'Vermelhos',
  minutes: 'Minutos',
};

const POSITION_FILTERS = [
  { key: 'all', label: 'Todas Posições', shortLabel: 'Todos', icon: Users },
  { key: 'GR', label: 'Guarda-Redes', shortLabel: 'GR', icon: ShieldCheck },
  { key: 'DEF', label: 'Defesas', shortLabel: 'DEF', icon: Shield },
  { key: 'MED', label: 'Médios', shortLabel: 'MED', icon: Compass },
  { key: 'AVA', label: 'Avançados', shortLabel: 'AVA', icon: Flame },
];

export default function EstatisticasTab({ seasonId }: { seasonId: string }) {
  const [activeView, setActiveView] = useState<StatsView>('rankings');
  const [activeTab, setActiveTab] = useState<StatTab>('scorers');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');

  const isUpcoming = seasonId === UPCOMING_SEASON_ID;
  const allPlayers = useMemo(() => getPlayers(), []);
  const seasonTeams = useMemo(() => getSeasonTeams(seasonId), [seasonId]);
  const currentSeasonAssists = useMemo(() => getCurrentSeasonAssists(), []);
  const seasonHasStarted = getMatchesForSeason(seasonId).some((match) => match.status === 'finished' || match.status === 'live');

  const activeTeam = seasonTeams.some((team) => team.id === filterTeam) ? filterTeam : 'all';
  const activeTeamName = activeTeam === 'all' ? null : getTeamFullName(activeTeam, activeTeam);

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

  const leagueMaxValue = displayPlayers.length > 0 ? Math.max(...displayPlayers.map((p) => p.value)) : 0;
  const leagueRankById = useMemo(() => {
    const ranks = new Map<string, number>();
    for (const player of displayPlayers) {
      ranks.set(player.id, displayPlayers.filter((candidate) => candidate.value > player.value).length + 1);
    }
    return ranks;
  }, [displayPlayers]);

  const filteredPlayers = useMemo(() => {
    return displayPlayers.filter((player) => {
      const matchTeam = activeTeam === 'all' || player.teamId === activeTeam;
      if (!matchTeam) return false;
      if (filterPosition === 'all') return true;
      const pos = (player.position || '').toLowerCase();
      if (filterPosition === 'GR') return pos.includes('guarda') || pos.includes('gr');
      if (filterPosition === 'DEF') return pos.includes('def');
      if (filterPosition === 'MED') return pos.includes('médio') || pos.includes('medio');
      if (filterPosition === 'AVA') return pos.includes('avan');
      return true;
    });
  }, [displayPlayers, activeTeam, filterPosition]);

  const withoutPosition = useMemo(() => displayPlayers.filter((player) => {
    if (activeTeam !== 'all' && player.teamId !== activeTeam) return false;
    const pos = (player.position || '').toLowerCase();
    return !pos || pos.includes('por confirmar');
  }).length, [displayPlayers, activeTeam]);

  const visiblePlayers = filteredPlayers.slice(0, rankingSize);

  const clubBestValue = filteredPlayers.length > 0 ? Math.max(...filteredPlayers.map((p) => p.value)) : 0;
  const sharedClubBest = filteredPlayers.filter((p) => p.value === clubBestValue).length > 1;

  const leaderPlayer = visiblePlayers[0];
  const leaderPlayerDetails = leaderPlayer?.hasProfile === false
    ? null
    : leaderPlayer ? allPlayers.find((p) => p.id === leaderPlayer.id) ?? null : null;

  const leaderAppearances = leaderPlayer?.secondaryLabel === 'Jogos'
    ? leaderPlayer.secondaryValue
    : leaderPlayerDetails?.appearances;
  const leaderThirdLabel = leaderPlayer?.secondaryLabel && leaderPlayer.secondaryLabel !== 'Jogos'
    ? leaderPlayer.secondaryLabel
    : 'Assistências';
  const leaderThirdValue = leaderPlayer?.secondaryLabel && leaderPlayer.secondaryLabel !== 'Jogos'
    ? leaderPlayer.secondaryValue
    : leaderPlayerDetails?.assists;

  const currentSeasonAvailability = [
    { label: 'Golos', available: CURRENT_SEASON_SCORERS.length > 0, icon: SoccerBallIcon },
    { label: 'Amarelos', available: getCurrentSeasonDiscipline().some((p) => p.yellowCards > 0), icon: YellowCardIcon },
    { label: 'Vermelhos', available: getCurrentSeasonDiscipline().some((p) => p.redCards > 0), icon: RedCardIcon },
    { label: 'Balizas', available: getCurrentSeasonCleanSheets().some((gk) => gk.cleanSheets > 0), icon: ShieldCheck },
    { label: 'Minutos', available: getCurrentSeasonMinutesPlayed().length > 0, icon: Clock3 },
    { label: 'Assist.', available: currentSeasonAssists.length > 0, icon: Sparkles },
  ];

  const ActiveMetricIcon = STAT_TABS.find((t) => t.key === activeTab)?.icon ?? SoccerBallIcon;

  return (
    <div className="space-y-6">
      {/* 1. SELETOR DE MODO / VISUALIZAÇÃO PRINCIPAL (Jogadores vs Comparador vs Clubes) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-zinc-100 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 w-full sm:w-fit">
        {STATS_VIEWS.map((v) => {
          const Icon = v.icon;
          const active = activeView === v.key;
          return (
            <button
              key={v.key}
              onClick={() => setActiveView(v.key)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-mono uppercase font-bold tracking-tight transition-all duration-200 ${
                active
                  ? 'bg-accent text-zinc-950 shadow-md shadow-accent/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-white/40 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span className="sm:hidden">{v.shortLabel}</span>
              <span className="hidden sm:inline">{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. BARRA DE FILTROS GERAIS (Clube e Posições) */}
      <div className="rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Seletor de Clube com Ícone */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs font-mono uppercase text-zinc-500 font-bold flex items-center gap-1.5 flex-shrink-0">
              <Filter size={13} className="text-accent" />
              <span className="hidden xs:inline">Clube:</span>
            </span>

            <select
              value={activeTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              aria-label="Filtrar estatísticas por clube"
              className="w-full sm:w-auto rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">Todos os Clubes ({seasonTeams.length})</option>
              {seasonTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name || team.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Posição com Ícones Compactos (ativo quando em rankings) */}
          {activeView === 'rankings' && (
            <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-1 sm:pt-0">
              {POSITION_FILTERS.map((pos) => {
                const Icon = pos.icon;
                const active = filterPosition === pos.key;
                return (
                  <button
                    key={pos.key}
                    onClick={() => setFilterPosition(pos.key)}
                    title={pos.label}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono uppercase transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-accent text-zinc-950 font-black shadow-xs'
                        : 'bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-foreground'
                    }`}
                  >
                    <Icon size={12} className="flex-shrink-0" />
                    <span className="sm:hidden">{pos.shortLabel}</span>
                    <span className="hidden sm:inline">{pos.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {activeTeamName && (
          <p className="mt-2.5 text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            Clube filtrado: <strong className="text-foreground">{activeTeamName}</strong> (as posições refletem o ranking geral do campeonato).
          </p>
        )}
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: RANKINGS INDIVIDUAIS                                            */}
      {/* ========================================================================= */}
      {activeView === 'rankings' && (
        <div className="space-y-6">
          {/* SUB-ABAS DE MÉTRICAS (Focadas em Ícones) */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
            {STAT_TABS.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`min-h-[52px] sm:min-h-[58px] p-2 sm:p-2.5 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 sm:gap-1.5 relative overflow-hidden ${
                    active
                      ? 'border-accent bg-accent/10 text-accent font-black shadow-xs ring-1 ring-accent/30'
                      : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/30 text-zinc-500 hover:text-foreground hover:bg-white/80 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0 ${active ? 'text-accent' : 'text-zinc-500'}`} />
                  <span className="text-[11px] font-mono uppercase tracking-tight font-bold sm:hidden">
                    {t.shortLabel}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-tight font-bold hidden sm:inline truncate w-full text-center">
                    {t.label}
                  </span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Banner de Época por Iniciar */}
          {isUpcoming && !seasonHasStarted && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex gap-3 items-center"
            >
              <AlertTriangle className="text-amber-500 flex-shrink-0" size={18} />
              <div className="text-xs">
                <strong className="text-foreground uppercase font-mono tracking-wider block">Temporada por Iniciar</strong>
                <p className="text-zinc-500 mt-0.5">As estatísticas individuais serão atualizadas assim que as primeiras súmulas oficiais forem publicadas.</p>
              </div>
            </motion.div>
          )}

          {/* Banner de Métrica aguardando dados */}
          {isUpcoming && seasonHasStarted && displayPlayers.length === 0 && (
            <div className="p-4 bg-zinc-500/5 border border-zinc-500/20 rounded-2xl flex gap-3 items-center">
              <Clock3 className="text-zinc-500 flex-shrink-0" size={18} />
              <p className="text-xs text-zinc-500">Esta métrica ainda aguarda a homologação de súmulas oficiais da jornada atual.</p>
            </div>
          )}

          {/* NOTAS E METODOLOGIA OFICIAL (Colapsável em Accordion) */}
          <details className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/50 dark:border-zinc-800/80 dark:bg-zinc-900/30">
            <summary className="flex cursor-pointer list-none items-center justify-between p-3.5 text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 select-none">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-accent flex-shrink-0" />
                <span>Critérios Oficiais & Homologação de Dados</span>
              </div>
              <ChevronDown size={14} className="text-zinc-400 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="p-4 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs text-zinc-500 space-y-2.5 font-mono">
              {seasonId === '2025-26' ? (
                <p>
                  Classificação estatística definitiva dos 240 jogos realizados no Girabola 2025/2026. Serve como métrica de referência oficial para a época 2026/2027.
                </p>
              ) : (
                <>
                  <p>
                    Estatísticas atualizadas em {new Date(getSeasonResultsUpdatedAt(seasonId)).toLocaleString('pt-AO', { timeZone: 'Africa/Luanda', dateStyle: 'medium', timeStyle: 'short' })} a partir das fichas oficiais da FAF/ANCAF.
                  </p>
                  {activeTab === 'scorers' && goalReconciliation.goalsUnattributed > 0 && (
                    <p>
                      Golos em resultados: {goalReconciliation.goalsInResults} · Atribuídos a atleta: {goalReconciliation.goalsAttributed}
                      {goalReconciliation.ownGoals > 0 && ` · Autogolos: ${goalReconciliation.ownGoals}`} · Por identificar: {goalReconciliation.goalsUnattributed}.
                    </p>
                  )}
                  {(activeTab === 'yellowcards' || activeTab === 'redcards') && (
                    <p>
                      Cartões nas fichas: {cardsLabel(cardReconciliation.yellowInSheets, cardReconciliation.redInSheets)} · Atribuídos: {cardsLabel(cardReconciliation.yellowAttributed, cardReconciliation.redAttributed)}.
                    </p>
                  )}
                  {activeTab === 'minutes' && (
                    <p>
                      Minutos calculados sobre 90&apos; regulamentares: {minutesCoverage.sidesCounted} de {minutesCoverage.sidesPossible} equipas-jogo apuradas ({minutesCoverage.matchesFinished} jogos finalizados).
                    </p>
                  )}
                </>
              )}
            </div>
          </details>

          {/* CORPO PRINCIPAL: LISTA DE JOGADORES + SIDEBAR */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* COLUNA DOS JOGADORES */}
            <div className="lg:col-span-2 space-y-3">
              {filterPosition !== 'all' && withoutPosition > 0 && (
                <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                  {withoutPosition} {withoutPosition === 1 ? 'atleta sem posição oficial' : 'atletas sem posição oficial'} omitidos deste filtro.
                </p>
              )}

              {filteredPlayers.length > visiblePlayers.length && (
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-1">
                  <span>Top {visiblePlayers.length} de {filteredPlayers.length} atletas</span>
                  <span>{VALUE_LABELS[activeTab]}</span>
                </div>
              )}

              {/* CARD DE DESTAQUE DO LÍDER NO MOBILE */}
              {leaderPlayer && seasonHasStarted && (
                <div className="block lg:hidden p-3.5 rounded-2xl bg-gradient-to-r from-accent/15 via-accent/5 to-transparent border border-accent/30 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-accent font-mono text-[10px] font-black uppercase tracking-wider">
                      <Crown size={13} />
                      {activeTeam !== 'all' ? 'Destaque do Clube' : 'Líder do Campeonato'}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{VALUE_LABELS[activeTab]}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <TeamCrest teamId={leaderPlayer.teamId} size={40} className="flex-shrink-0 drop-shadow-sm" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-foreground uppercase truncate">{leaderPlayer.name}</h4>
                        <p className="text-[11px] text-zinc-500 font-mono truncate">{leaderPlayer.club}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 bg-white/80 dark:bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-accent/30">
                      <span className="text-2xl font-display font-black text-accent block leading-none">
                        {activeTab === 'minutes' ? leaderPlayer.value.toLocaleString('pt-AO') : leaderPlayer.value}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">
                        {leaderAppearances ? `${leaderAppearances}J` : VALUE_LABELS[activeTab]}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* LISTA DE JOGADORES */}
              <motion.div
                key={`${seasonId}-${activeTab}-${activeTeam}-${filterPosition}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2.5"
              >
                {visiblePlayers.length === 0 ? (
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
                  visiblePlayers.map((player, idx) => {
                    const rank = leagueRankById.get(player.id) ?? idx + 1;
                    const isLeagueLeader = rank === 1 && player.value > 0 && seasonHasStarted;
                    const sharedLead = displayPlayers.filter((candidate) => candidate.value === player.value).length > 1;
                    const isClubBest = !isLeagueLeader && activeTeam !== 'all' && player.value === clubBestValue && player.value > 0 && seasonHasStarted;
                    const percent = leagueMaxValue > 0 ? Math.round((player.value / leagueMaxValue) * 100) : 0;

                    return (
                      <AnimatedCard
                        key={player.id}
                        variant={isLeagueLeader ? 'holographic' : 'hud'}
                        className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200/70 dark:border-zinc-900/70 rounded-xl overflow-hidden relative"
                      >
                        {/* ---------------- MOBILE CARD (< sm) ---------------- */}
                        <div className="flex sm:hidden items-center justify-between gap-2.5 p-3 relative">
                          {/* Rank + Medalha */}
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 text-center font-display font-black text-xs flex items-center justify-center flex-shrink-0">
                              {rank === 1 ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/40 text-[10px] font-black">
                                  1
                                </span>
                              ) : rank === 2 ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-300/20 text-zinc-300 border border-zinc-400/40 text-[10px] font-black">
                                  2
                                </span>
                              ) : rank === 3 ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 text-[10px] font-black">
                                  3
                                </span>
                              ) : (
                                <span className="text-zinc-500 font-mono text-xs">{rank}</span>
                              )}
                            </div>

                            {/* Escudo */}
                            <TeamCrest teamId={player.teamId} size={32} className="flex-shrink-0 drop-shadow-xs" />

                            {/* Nome e Clube */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 truncate">
                                {player.hasProfile === false ? (
                                  <span className="font-bold uppercase text-xs text-foreground truncate">{player.name}</span>
                                ) : (
                                  <Link href={`/players/${player.id}`} className="font-bold uppercase text-xs text-foreground hover:text-primary transition-colors truncate">
                                    {player.name}
                                  </Link>
                                )}
                                {isLeagueLeader && <Crown size={11} className="text-accent flex-shrink-0" />}
                              </div>
                              <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 truncate mt-0.5">
                                <span className="truncate">{player.club}</span>
                                {shown(player.position) && (
                                  <span className="px-1 py-0.2 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold text-[8px] uppercase">
                                    {player.position.slice(0, 3)}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Valor e Info Secundária */}
                          <div className="text-right flex-shrink-0 pl-2">
                            <div className="flex items-center justify-end gap-1">
                              <span className={`font-display font-black text-lg tracking-tight ${isLeagueLeader ? 'text-accent' : 'text-foreground'}`}>
                                {activeTab === 'minutes' ? player.value.toLocaleString('pt-AO') : player.value}
                              </span>
                              <ActiveMetricIcon className="w-3.5 h-3.5 flex-shrink-0 text-accent" />
                            </div>
                            {player.secondaryValue !== undefined && (
                              <span className="text-[9px] font-mono text-zinc-400 block leading-tight">
                                {player.secondaryValue} {player.secondaryLabel === 'Jogos' ? 'J' : player.secondaryLabel?.slice(0, 3)}
                              </span>
                            )}
                          </div>

                          {/* Barra de progresso sutil no rodapé mobile */}
                          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-zinc-200/40 dark:bg-zinc-800/40 overflow-hidden">
                            <div
                              style={{ width: seasonHasStarted ? `${percent}%` : '0%' }}
                              className={`h-full ${isLeagueLeader ? 'bg-accent' : 'bg-primary'}`}
                            />
                          </div>
                        </div>

                        {/* ---------------- DESKTOP CARD (>= sm) ---------------- */}
                        <div className="hidden sm:flex sm:items-center justify-between gap-6 p-4 md:p-5">
                          {/* Rank, Crest & Identificação */}
                          <div className="flex items-center gap-4 min-w-0 md:min-w-[240px] w-full md:w-auto">
                            <span className={`text-2xl font-display font-black w-8 text-center flex-shrink-0 ${
                              isLeagueLeader ? 'text-accent animate-pulse' : 'text-zinc-500'
                            }`}>
                              {rank}
                            </span>
                            <TeamCrest teamId={player.teamId} size={44} className="filter drop-shadow-[0_0_6px_rgba(255,255,255,0.08)] flex-shrink-0" />
                            <div className="min-w-0">
                              <h3 className="text-foreground font-bold uppercase text-sm flex items-center gap-2 truncate">
                                {player.hasProfile === false ? player.name : (
                                  <Link href={`/players/${player.id}`} className="hover:text-primary transition-colors truncate">{player.name}</Link>
                                )}
                                {isLeagueLeader && (
                                  <span className="text-[9px] font-mono bg-accent/20 text-accent border border-accent/40 px-2 py-0.5 rounded-full uppercase flex-shrink-0">
                                    {sharedLead ? 'Liderança partilhada' : 'Líder'}
                                  </span>
                                )}
                                {isClubBest && (
                                  <span className="text-[9px] font-mono bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-full uppercase flex-shrink-0">
                                    {sharedClubBest ? 'Melhor do clube (part.)' : 'Melhor do clube'}
                                  </span>
                                )}
                              </h3>
                              <p className="text-xs text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5 truncate">
                                <Shield size={11} className="text-zinc-600 flex-shrink-0" />
                                {player.club}{shown(player.position) && ` · ${shown(player.position)}`}
                              </p>
                            </div>
                          </div>

                          {/* Barra de Progresso Central */}
                          <div className="flex-1 max-w-xs md:max-w-sm">
                            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-1.5 uppercase">
                              <span>Eficácia relativa</span>
                              <span>{seasonHasStarted ? `${percent}%` : '0%'}</span>
                            </div>
                            <div className="w-full h-2 bg-white/80 dark:bg-zinc-900/80 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden relative">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: seasonHasStarted ? `${percent}%` : '0%' }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.04 }}
                                className={`h-full rounded-full ${isLeagueLeader ? 'bg-gradient-to-r from-primary to-accent' : 'bg-primary'}`}
                              />
                            </div>
                          </div>

                          {/* Valor em Destaque */}
                          <div className="text-right pl-4 min-w-[90px]">
                            <div className="flex items-center justify-end gap-1.5">
                              <span className={`${activeTab === 'minutes' ? 'text-2xl' : 'text-3xl'} font-display font-black tracking-tighter ${
                                isLeagueLeader ? 'text-accent' : 'text-foreground'
                              }`}>
                                {activeTab === 'minutes' ? player.value.toLocaleString('pt-AO') : player.value}
                              </span>
                              <ActiveMetricIcon className="w-4 h-4 flex-shrink-0 text-accent" />
                            </div>
                            <p className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5">
                              {VALUE_LABELS[activeTab]}
                            </p>
                            {player.secondaryValue !== undefined && (
                              <p className="text-[9px] font-mono text-zinc-400 mt-0.5">
                                {player.secondaryLabel}: {player.secondaryValue}
                              </p>
                            )}
                          </div>
                        </div>
                      </AnimatedCard>
                    );
                  })
                )}
              </motion.div>
            </div>

            {/* COLUNA LATERAL: PERFIL EM FOCO (DESKTOP) E PRÉMIOS OFICIAIS */}
            <div className="space-y-6">
              {/* Card Perfil em Foco */}
              <AnimatedCard variant="hud" className="bg-zinc-100/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-900 p-5 rounded-2xl">
                <h3 className="text-sm font-display text-foreground uppercase tracking-wider mb-3 flex items-center gap-2 font-black">
                  <Flame size={15} className="text-accent" />
                  {seasonHasStarted ? 'Destaque da Métrica' : 'Aguardando Início'}
                </h3>

                <div className="space-y-3.5 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="p-3.5 bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl">
                    <h4 className="font-bold text-foreground text-sm uppercase">
                      {seasonHasStarted ? leaderPlayer?.name ?? 'A aguardar dados' : 'Aguardando Época'}
                    </h4>
                    <p className="text-accent font-mono text-[10px] mt-0.5">
                      {seasonHasStarted ? (leaderPlayer?.club.toUpperCase() ?? 'GIRABOLA') : 'GIRABOLA'}
                    </p>

                    <div className="grid grid-cols-3 gap-1.5 mt-3 text-center font-mono">
                      <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                        <span className="text-foreground font-bold block text-sm">
                          {seasonHasStarted ? (leaderAppearances ?? '—') : 0}
                        </span>
                        <span className="text-[8px] text-zinc-500 uppercase">Jogos</span>
                      </div>
                      <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                        <span className="text-accent font-bold block text-sm">
                          {seasonHasStarted ? (leaderPlayer ? leaderPlayer.value.toLocaleString('pt-AO') : '—') : 0}
                        </span>
                        <span className="text-[8px] text-zinc-500 uppercase">{VALUE_LABELS[activeTab]}</span>
                      </div>
                      <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                        <span className="text-foreground font-bold block text-sm">
                          {seasonHasStarted ? (leaderThirdValue ?? '—') : 0}
                        </span>
                        <span className="text-[8px] text-zinc-500 uppercase">{leaderThirdLabel}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed">
                    {activeTeamName && leaderPlayer
                      ? `Melhor marca do ${activeTeamName} nesta categoria.`
                      : isUpcoming
                        ? (seasonHasStarted ? 'Métricas apuradas com base nas súmulas oficiais.' : 'Aguardando pontapé de saída.')
                        : (leaderPlayerDetails?.bio ?? 'Desempenho individual consolidado no campeonato nacional.')}
                  </p>
                </div>
              </AnimatedCard>

              {/* Badges de Disponibilidade de Dados */}
              {isUpcoming && seasonHasStarted && (
                <div className="p-4 rounded-2xl bg-zinc-100/40 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-[11px] font-mono uppercase text-zinc-500 font-bold mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-accent" /> Disponibilidade Oficial
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {currentSeasonAvailability.map((m) => {
                      const Icon = m.icon;
                      return (
                        <div
                          key={m.label}
                          className={`flex items-center gap-1.5 p-1.5 rounded-lg text-[10px] font-mono font-bold uppercase border ${
                            m.available
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-400'
                          }`}
                        >
                          <Icon className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{m.label}</span>
                          <span className="ml-auto text-[9px]">{m.available ? '✓' : '—'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Prémios Oficiais ANCAF */}
              <AnimatedCard variant="hud" className="bg-zinc-100/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-900 p-4 rounded-2xl">
                <h4 className="text-xs font-display text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-2 font-black">
                  <Award size={14} className="text-accent" /> Galardões Oficiais ANCAF
                </h4>
                <div className="space-y-2 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="text-base">🥇</span>
                    <div>
                      <strong className="text-foreground block">Bola de Ouro</strong>
                      <span className="text-[9px] text-zinc-500">Melhor Jogador da Prova</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="text-base">👟</span>
                    <div>
                      <strong className="text-foreground block">Troféu Artilheiro</strong>
                      <span className="text-[9px] text-zinc-500">Melhor Marcador</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="text-base">🧤</span>
                    <div>
                      <strong className="text-foreground block">Luva de Ouro</strong>
                      <span className="text-[9px] text-zinc-500">Guarda-Redes Menos Batido</span>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: COMPARADOR OFICIAL ENTRE TEMPORADAS                              */}
      {/* ========================================================================= */}
      {activeView === 'comparison' && (
        <SeasonComparisonMatrix clubFilter={activeTeam} seasonId={seasonId} />
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: ANÁLISE COLETIVA AVANÇADA (Aproveitamento, Golos por Jornada)    */}
      {/* ========================================================================= */}
      {activeView === 'advanced' && (
        <AdvancedStatistics seasonId={seasonId} teamId={activeTeam === 'all' ? undefined : activeTeam} />
      )}
    </div>
  );
}
