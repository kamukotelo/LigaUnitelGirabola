'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Filter,
  Trophy,
  Users,
  ArrowRightLeft,
  BarChart3,
  Crown,
  ChevronDown,
  Info,
  Target,
  Timer,
  Zap,
  Compass,
  Award,
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
type StatsPage = 'players' | 'comparison' | 'clubs';

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

/** Ícone nítido de bola de futebol oficial */
function SoccerBallIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <polygon points="12,7.5 14.5,9.5 13.5,12.5 10.5,12.5 9.5,9.5" fill="currentColor" />
      <line x1="12" y1="2" x2="12" y2="7.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="14.5" y1="9.5" x2="19.5" y2="8" stroke="currentColor" strokeWidth="1.6" />
      <line x1="13.5" y1="12.5" x2="17" y2="16.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="10.5" y1="12.5" x2="7" y2="16.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="9.5" y1="9.5" x2="4.5" y2="8" stroke="currentColor" strokeWidth="1.6" />
      <line x1="7" y1="16.5" x2="7" y2="21" stroke="currentColor" strokeWidth="1.6" />
      <line x1="17" y1="16.5" x2="17" y2="21" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Ícone de Luva de Guarda-Redes */
function GloveIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 14V6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6" />
      <path d="M10 12V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v8" />
      <path d="M14 12V6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v8" />
      <path d="M18 13.5V8a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v7c0 5-4 9-9 9H9c-3 0-5-2-5-5v-4.5c0-1.5 1-2.5 2.5-2.5h1" />
    </svg>
  );
}

/** Ícone de Cartão Amarelo */
function YellowCardIcon({ className = 'w-4 h-5' }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-[3px] bg-amber-400 border border-amber-500 shadow-sm shadow-amber-500/20 rotate-[-6deg] ${className}`}
      aria-hidden="true"
    />
  );
}

/** Ícone de Cartão Vermelho */
function RedCardIcon({ className = 'w-4 h-5' }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-[3px] bg-rose-600 border border-rose-700 shadow-sm shadow-rose-600/20 rotate-[-6deg] ${className}`}
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
 * Páginas dedicadas para evitar mistura:
 * 1. Jogadores (Golos, Assistências, Balizas, Cartões, Minutos)
 * 2. Comparador entre Temporadas
 * 3. Estatísticas de Clubes
 */
const STATS_PAGES = [
  { key: 'players', title: 'Jogadores & Goleadores', icon: SoccerBallIcon, label: 'Jogadores' },
  { key: 'comparison', title: 'Comparador de Temporadas', icon: ArrowRightLeft, label: 'Comparador' },
  { key: 'clubs', title: 'Estatísticas de Clubes', icon: BarChart3, label: 'Clubes' },
];

/**
 * Sub-abas de métricas puramente visuais focadas em ícones:
 * Bola = Golos
 * Alvo = Assistências
 * Luva = Balizas Limpas
 * Cartão Amarelo = Amarelos
 * Cartão Vermelho = Vermelhos
 * Cronômetro = Minutos
 */
const STAT_TABS: {
  key: StatTab;
  title: string;
  icon: (props: { className?: string }) => React.ReactNode;
}[] = [
  { key: 'scorers', title: 'Golos', icon: (p) => <SoccerBallIcon className={p.className ?? 'w-6 h-6'} /> },
  { key: 'assists', title: 'Assistências', icon: (p) => <Target className={p.className ?? 'w-6 h-6'} /> },
  { key: 'cleansheets', title: 'Balizas Limpas', icon: (p) => <GloveIcon className={p.className ?? 'w-6 h-6'} /> },
  { key: 'yellowcards', title: 'Cartões Amarelos', icon: (p) => <YellowCardIcon className={p.className ?? 'w-4 h-5'} /> },
  { key: 'redcards', title: 'Cartões Vermelhos', icon: (p) => <RedCardIcon className={p.className ?? 'w-4 h-5'} /> },
  { key: 'minutes', title: 'Minutos Jogados', icon: (p) => <Timer className={p.className ?? 'w-6 h-6'} /> },
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
  { key: 'all', label: 'Todos', icon: Users, title: 'Todas as Posições' },
  { key: 'GR', label: 'GR', icon: ShieldCheck, title: 'Guarda-Redes' },
  { key: 'DEF', label: 'DEF', icon: Shield, title: 'Defesas' },
  { key: 'MED', label: 'MED', icon: Compass, title: 'Médios' },
  { key: 'AVA', label: 'ATA', icon: Zap, title: 'Atacantes' },
];

export default function EstatisticasTab({ seasonId }: { seasonId: string }) {
  const [activePage, setActivePage] = useState<StatsPage>('players');
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
      if (filterPosition === 'AVA') return pos.includes('avan') || pos.includes('ata');
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
  const leaderAppearances = leaderPlayer?.secondaryLabel === 'Jogos' ? leaderPlayer.secondaryValue : undefined;

  const ActiveMetricIconRenderer = STAT_TABS.find((t) => t.key === activeTab)?.icon ?? ((p: { className?: string }) => <SoccerBallIcon className={p.className} />);

  return (
    <div className="space-y-6">
      {/* 1. SELETOR DE PÁGINAS DEDICADAS (EVITA MISTURA) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-zinc-100 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 w-full sm:w-fit">
        {STATS_PAGES.map((page) => {
          const PageIcon = page.icon;
          const active = activePage === page.key;
          return (
            <button
              key={page.key}
              onClick={() => setActivePage(page.key as StatsPage)}
              title={page.title}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-mono uppercase font-bold tracking-tight transition-all duration-200 ${
                active
                  ? 'bg-accent text-zinc-950 shadow-md shadow-accent/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-white/40 dark:hover:bg-zinc-800/50'
              }`}
            >
              <PageIcon className="w-4 h-4 flex-shrink-0" />
              <span>{page.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* PÁGINA 1: JOGADORES (GOLEADORES, ASSISTÊNCIAS, ETC.) - 100% VISUAL & ÍCONES */}
      {/* ========================================================================= */}
      {activePage === 'players' && (
        <div className="space-y-6">
          {/* BARRA DE FILTROS COMPACTA */}
          <div className="rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Seletor de Clube */}
              <div className="flex items-center gap-2.5 min-w-0">
                <Filter size={14} className="text-accent flex-shrink-0" />
                <select
                  value={activeTeam}
                  onChange={(e) => setFilterTeam(e.target.value)}
                  aria-label="Filtrar por clube"
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

              {/* Filtros de Posição Rápidos (Ícone + Sigla) */}
              <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {POSITION_FILTERS.map((pos) => {
                  const Icon = pos.icon;
                  const active = filterPosition === pos.key;
                  return (
                    <button
                      key={pos.key}
                      onClick={() => setFilterPosition(pos.key)}
                      title={pos.title}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition-all whitespace-nowrap ${
                        active
                          ? 'bg-accent text-zinc-950 shadow-xs'
                          : 'bg-zinc-200/70 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:text-foreground'
                      }`}
                    >
                      <Icon size={13} className="flex-shrink-0" />
                      <span>{pos.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {activeTeamName && (
              <p className="mt-2.5 text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
                Filtrado por: <strong className="text-foreground">{activeTeamName}</strong> (posições gerais mantidas).
              </p>
            )}
          </div>

          {/* SUB-ABAS DE MÉTRICAS: PURAMENTE ÍCONES (SÓ A BOLA, SÓ O CARTÃO, ETC.) */}
          <div className="flex items-center justify-between gap-2 p-2 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {STAT_TABS.map((t) => {
              const active = activeTab === t.key;
              const IconComponent = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  title={t.title}
                  aria-label={t.title}
                  className={`flex-1 min-w-[50px] sm:min-w-[64px] h-12 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-200 relative group ${
                    active
                      ? 'bg-accent text-zinc-950 shadow-md shadow-accent/20 ring-2 ring-accent scale-[1.03]'
                      : 'text-zinc-500 hover:text-foreground hover:bg-white/60 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <IconComponent className={active ? 'w-6 h-6' : 'w-5 h-5'} />
                  {active && (
                    <span className="absolute -bottom-1 w-2 h-2 bg-accent rotate-45" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Destaque do Líder Visual no Topo */}
          {leaderPlayer && seasonHasStarted && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-accent/15 via-accent/5 to-transparent border border-accent/30 relative overflow-hidden flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <TeamCrest teamId={leaderPlayer.teamId} size={44} className="drop-shadow-sm flex-shrink-0" />
                  <Crown size={14} className="text-amber-500 absolute -top-1.5 -right-1.5 drop-shadow-xs" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm sm:text-base text-foreground uppercase truncate">{leaderPlayer.name}</h4>
                  <p className="text-xs text-zinc-500 font-mono truncate">{leaderPlayer.club}</p>
                </div>
              </div>

              {/* Valor Grande + Ícone */}
              <div className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 px-4 py-2 rounded-xl border border-accent/30 shadow-xs flex-shrink-0">
                <span className="text-2xl sm:text-3xl font-display font-black text-accent leading-none">
                  {activeTab === 'minutes' ? leaderPlayer.value.toLocaleString('pt-AO') : leaderPlayer.value}
                </span>
                <ActiveMetricIconRenderer className="w-5 h-5 text-accent flex-shrink-0" />
                {leaderAppearances && (
                  <span className="text-[10px] font-mono text-zinc-400 pl-1 border-l border-zinc-300 dark:border-zinc-700">
                    {leaderAppearances}J
                  </span>
                )}
              </div>
            </div>
          )}

          {/* AVISO SE A ÉPOCA NÃO COMEÇOU */}
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

          {/* LISTA ULTRA-VISUAL DE JOGADORES (FOCADA EM ÍCONES) */}
          <motion.div
            key={`${seasonId}-${activeTab}-${activeTeam}-${filterPosition}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {visiblePlayers.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 font-mono text-xs">
                Nenhum atleta encontrado para estes filtros.
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
                const isClubBest = !isLeagueLeader && activeTeam !== 'all' && player.value === clubBestValue && player.value > 0 && seasonHasStarted;
                const percent = leagueMaxValue > 0 ? Math.round((player.value / leagueMaxValue) * 100) : 0;

                return (
                  <AnimatedCard
                    key={player.id}
                    variant={isLeagueLeader ? 'holographic' : 'hud'}
                    className="bg-white/60 dark:bg-zinc-950/50 border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden relative shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
                      {/* Rank + Escudo + Nome */}
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        {/* Posição Visual com Medalhas */}
                        <div className="w-6 text-center font-display font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0">
                          {rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/40 text-[11px] font-black">
                              1
                            </span>
                          ) : rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-300/20 text-zinc-300 border border-zinc-400/40 text-[11px] font-black">
                              2
                            </span>
                          ) : rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 text-[11px] font-black">
                              3
                            </span>
                          ) : (
                            <span className="text-zinc-500 font-mono text-xs">{rank}</span>
                          )}
                        </div>

                        {/* Escudo Oficial */}
                        <TeamCrest teamId={player.teamId} size={36} className="flex-shrink-0 drop-shadow-xs" />

                        {/* Nome do Jogador e Clube */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 truncate">
                            {player.hasProfile === false ? (
                              <span className="font-bold uppercase text-xs sm:text-sm text-foreground truncate">{player.name}</span>
                            ) : (
                              <Link href={`/players/${player.id}`} className="font-bold uppercase text-xs sm:text-sm text-foreground hover:text-primary transition-colors truncate">
                                {player.name}
                              </Link>
                            )}
                            {isLeagueLeader && <Crown size={12} className="text-amber-500 flex-shrink-0" />}
                            {isClubBest && (
                              <span className="text-[8px] font-mono bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.2 rounded-full uppercase flex-shrink-0">
                                Melhor do clube
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 font-mono flex items-center gap-1 truncate mt-0.5">
                            <span className="truncate">{player.club}</span>
                            {shown(player.position) && (
                              <span className="px-1 py-0.2 rounded bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold text-[9px] uppercase">
                                {player.position.slice(0, 3)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Valor Numérico Grande + Ícone da Métrica */}
                      <div className="text-right flex-shrink-0 pl-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className={`font-display font-black text-xl sm:text-2xl tracking-tight ${isLeagueLeader ? 'text-accent' : 'text-foreground'}`}>
                            {activeTab === 'minutes' ? player.value.toLocaleString('pt-AO') : player.value}
                          </span>
                          <ActiveMetricIconRenderer className="w-4 h-4 flex-shrink-0 text-accent" />
                        </div>
                        {player.secondaryValue !== undefined && (
                          <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                            {player.secondaryValue} {player.secondaryLabel === 'Jogos' ? 'J' : player.secondaryLabel?.slice(0, 3)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Barra sutil de eficácia relativa */}
                    <div className="h-[2px] bg-zinc-200/40 dark:bg-zinc-800/40 overflow-hidden">
                      <div
                        style={{ width: seasonHasStarted ? `${percent}%` : '0%' }}
                        className={`h-full ${isLeagueLeader ? 'bg-accent' : 'bg-primary'}`}
                      />
                    </div>
                  </AnimatedCard>
                );
              })
            )}
          </motion.div>

          {/* CRITÉRIOS OFICIAIS E RECONCILIAÇÃO (ACORDEÃO DISCRETO NO RODAPÉ) */}
          <details className="group overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/50 dark:border-zinc-800/80 dark:bg-zinc-900/30">
            <summary className="flex cursor-pointer list-none items-center justify-between p-3.5 text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 select-none">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-accent flex-shrink-0" />
                <span>Auditoria & Critérios Oficiais FAF/ANCAF</span>
              </div>
              <ChevronDown size={14} className="text-zinc-400 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="p-4 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs text-zinc-500 space-y-2 font-mono">
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
      {/* PÁGINA 2: COMPARADOR OFICIAL ENTRE TEMPORADAS (ISOLADO E SEM MISTURA)     */}
      {/* ========================================================================= */}
      {activePage === 'comparison' && (
        <SeasonComparisonMatrix clubFilter={activeTeam} seasonId={seasonId} />
      )}

      {/* ========================================================================= */}
      {/* PÁGINA 3: ANÁLISE COLETIVA AVANÇADA DE CLUBES                             */}
      {/* ========================================================================= */}
      {activePage === 'clubs' && (
        <AdvancedStatistics seasonId={seasonId} teamId={activeTeam === 'all' ? undefined : activeTeam} />
      )}
    </div>
  );
}
