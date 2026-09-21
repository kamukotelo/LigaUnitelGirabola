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
 * 1. Abas no topo estilo Sofascore (Pills arredondadas)
 */
const SOFASCORE_VIEWS: { key: StatsView; label: string }[] = [
  { key: 'jogadores', label: 'Jogadores' },
  { key: 'equipas', label: 'Equipas' },
  { key: 'comparador', label: 'Comparador' },
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

  const activeStatMeta = STAT_TABS.find((t) => t.key === activeTab) ?? STAT_TABS[0];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. NAVEGAÇÃO DE NÍVEL SUPERIOR ESTILO SOFASCORE: JOGADORES | EQUIPAS | COMPARADOR */}
      <div className="flex items-center gap-2 p-1 bg-zinc-950/80 dark:bg-zinc-900/90 rounded-full border border-zinc-800/80 w-fit">
        {SOFASCORE_VIEWS.map((v) => {
          const active = activeView === v.key;
          return (
            <button
              key={v.key}
              onClick={() => setActiveView(v.key)}
              className={`px-5 py-1.5 rounded-full text-xs uppercase font-extrabold tracking-wider transition-all duration-200 ${
                active
                  ? 'bg-white text-zinc-950 shadow-md shadow-white/10'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: JOGADORES (ESTILO SOFASCORE)                                     */}
      {/* ========================================================================= */}
      {activeView === 'jogadores' && (
        <div className="space-y-4">
          {/* 2. SCROLL FACILITADO DE POSIÇÕES (CÁPSULAS ESTILO SOFASCORE) */}
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 px-0.5">
            {POSITION_FILTERS.map((pos) => {
              const active = filterPosition === pos.key;
              return (
                <button
                  key={pos.key}
                  onClick={() => setFilterPosition(pos.key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 border ${
                    active
                      ? 'bg-white text-zinc-950 border-white shadow-xs font-bold'
                      : 'bg-zinc-900/90 dark:bg-zinc-950/80 text-zinc-300 dark:text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  {pos.label}
                </button>
              );
            })}
          </div>

          {/* 3. SCROLL FACILITADO DE MÉTRICAS COM ÍCONE + TEXTO (ESTILO SOFASCORE) */}
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 px-0.5">
            {STAT_TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 border ${
                    active
                      ? 'bg-accent text-zinc-950 border-accent font-bold shadow-md shadow-accent/15'
                      : 'bg-zinc-900/80 dark:bg-zinc-950/60 text-zinc-300 dark:text-zinc-400 border-zinc-800/80 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filtro Compacto de Clube (Opcional) */}
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-accent flex-shrink-0" />
              <select
                value={activeTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                aria-label="Filtrar por clube"
                className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1 text-xs font-medium text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="all">Todos os Clubes ({seasonTeams.length})</option>
                {seasonTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name || team.shortName}
                  </option>
                ))}
              </select>
            </div>

            {activeTeamName && (
              <span className="text-[11px] font-mono text-zinc-500 truncate">
                Filtro: <strong className="text-zinc-300">{activeTeamName}</strong>
              </span>
            )}
          </div>

          {/* Alerta de Pré-Época */}
          {isUpcoming && !seasonHasStarted && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex gap-3 items-center"
            >
              <AlertTriangle className="text-amber-500 flex-shrink-0" size={16} />
              <div className="text-xs">
                <strong className="text-foreground uppercase font-mono tracking-wider block">Temporada por Iniciar</strong>
                <p className="text-zinc-400 mt-0.5">As estatísticas individuais serão sincronizadas assim que as primeiras súmulas forem homologadas.</p>
              </div>
            </motion.div>
          )}

          {/* 4. CARD CONTAINER DE ESTATÍSTICA DO SOFASCORE */}
          <div className="bg-zinc-950/90 dark:bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
            {/* Cabeçalho do Bloco Sofascore */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-zinc-800/60 bg-zinc-900/40">
              <div className="flex items-center gap-2">
                <span className="text-base">{activeStatMeta.emoji}</span>
                <h3 className="font-bold text-sm sm:text-base text-foreground">
                  {activeStatMeta.label}
                </h3>
              </div>
              <span className="text-xs font-semibold text-accent font-mono">
                {visiblePlayers.length} atletas
              </span>
            </div>

            {/* Lista dos Jogadores Estilo Sofascore */}
            <div className="divide-y divide-zinc-800/50">
              {visiblePlayers.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                  Nenhum jogador encontrado para estes filtros.
                  <button
                    onClick={() => { setFilterTeam('all'); setFilterPosition('all'); }}
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
                      className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Avatar com Mini-Escudo Sobreposto (Sofascore) */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-xs font-bold text-zinc-200 overflow-hidden shadow-xs">
                            {player.name.slice(0, 2).toUpperCase()}
                          </div>
                          {/* Mini escudo do clube sobreposto no canto inferior */}
                          <div className="absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-0.5 shadow-sm border border-zinc-800">
                            <TeamCrest teamId={player.teamId} size={15} />
                          </div>
                        </div>

                        {/* Nome do Jogador e Posição / Clube */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 truncate">
                            {player.hasProfile === false ? (
                              <span className="font-semibold text-sm text-foreground truncate">{player.name}</span>
                            ) : (
                              <Link
                                href={`/players/${player.id}`}
                                className="font-semibold text-sm text-foreground hover:text-accent transition-colors truncate"
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
                          <p className="text-xs text-zinc-400 flex items-center gap-1.5 truncate mt-0.5 font-sans">
                            <span>{shown(player.position) ? player.position : 'Atleta'}</span>
                            <span className="text-zinc-600">·</span>
                            <span className="truncate text-zinc-500">{player.club}</span>
                          </p>
                        </div>
                      </div>

                      {/* Score Numérico Alinhado à Direita (Sofascore) */}
                      <div className="text-right flex-shrink-0 flex items-center gap-2 pl-3">
                        {isLeagueLeader ? (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-display font-black text-sm sm:text-base">
                            <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block" />
                            <span>{activeTab === 'minutes' ? player.value.toLocaleString('pt-AO') : player.value}</span>
                          </div>
                        ) : (
                          <div className="font-display font-bold text-base sm:text-lg text-foreground pr-1">
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

          {/* Critérios Oficiais e Reconciliação (Colapsável Discreto) */}
          <details className="group overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/40">
            <summary className="flex cursor-pointer list-none items-center justify-between p-3.5 text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 select-none">
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
      {/* VISTA 3: COMPARADOR OFICIAL ENTRE TEMPORADAS                              */}
      {/* ========================================================================= */}
      {activeView === 'comparador' && (
        <SeasonComparisonMatrix clubFilter={activeTeam} seasonId={seasonId} />
      )}
    </div>
  );
}
