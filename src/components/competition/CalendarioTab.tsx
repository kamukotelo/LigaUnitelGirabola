'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Trophy, Target, CalendarDays, Flag, Tv } from 'lucide-react';
import { UPCOMING_SEASON_ID, getMatchesForSeason, getMatchBroadcast, getMatchOfficials, Match, TEAMS } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';
import { supabase } from '@/lib/supabase';
import CalendarioPlaneamento from './CalendarioPlaneamento';

type StatusFilter = 'all' | 'finished' | 'scheduled';
type CalendarFilters = {
  seasonId: string;
  selectedRound: number | 'all';
  filterStatus: StatusFilter;
  filterTeam: string;
  filterMonth: string;
};

const ANGOLA_TIME_ZONE = 'Africa/Luanda';

// Jornada mostrada por defeito: a próxima por disputar (ou, se a época estiver
// concluída, a última). Evita renderizar as 240 partidas de uma só vez — o
// utilizador pode sempre escolher "TODAS". Grande ganho de performance.
function getDefaultRound(seasonId: string): number | 'all' {
  const matches = getMatchesForSeason(seasonId);
  const rounds = Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);
  if (rounds.length === 0) return 'all';
  const nextRound = rounds.find((r) => matches.some((m) => m.round === r && m.status !== 'finished'));
  return nextRound ?? rounds[rounds.length - 1];
}

function getDefaultFilters(seasonId: string): CalendarFilters {
  return {
    seasonId,
    selectedRound: getDefaultRound(seasonId),
    filterStatus: 'all',
    filterTeam: 'all',
    filterMonth: 'all',
  };
}

function MatchCard({ match }: { match: Match }) {
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString('pt-AO', {
    day: '2-digit', month: 'short', year: 'numeric',
    timeZone: ANGOLA_TIME_ZONE,
  });
  const formattedTime = matchDate.toLocaleTimeString('pt-AO', {
    hour: '2-digit', minute: '2-digit',
    timeZone: ANGOLA_TIME_ZONE,
  });

  const homeTeamObj = TEAMS.find((t) => t.id === match.homeTeamId);
  const awayTeamObj = TEAMS.find((t) => t.id === match.awayTeamId);
  const homeAbbr = homeTeamObj?.shortName ?? match.homeTeam.substring(0, 3).toUpperCase();
  const awayAbbr = awayTeamObj?.shortName ?? match.awayTeam.substring(0, 3).toUpperCase();
  const broadcaster = getMatchBroadcast(match);
  const referee = getMatchOfficials(match).referee;

  return (
    <Link href={`/matches/${match.id}`} className="block h-full group">
      <AnimatedCard
        variant="hud"
        className="bg-zinc-100/30 dark:bg-zinc-950/30 hover:bg-white/30 dark:hover:bg-zinc-900/30 hover:border-accent/30 border-zinc-200 dark:border-zinc-900 relative p-5 sm:p-6 h-full flex flex-col justify-between cursor-pointer transition-colors"
      >
        {/* Top meta */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[9px] font-mono bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider">
            Jornada {match.round}
          </span>
          {isFinished ? (
            <span className="text-[9px] font-mono bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200/60 dark:border-zinc-800/60 px-2 py-0.5 rounded uppercase tracking-wider">
              Terminado
            </span>
          ) : isLive ? (
            <span className="text-[9px] font-mono bg-green-500/20 text-green-500 border border-green-500/40 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-pulse" /> Live
            </span>
          ) : (
            <span className="text-[9px] font-mono bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
              <Calendar size={10} /> Agendado
            </span>
          )}
        </div>

        {/* Scoreboard */}
        <div className="py-3 border-y border-zinc-200/60 dark:border-zinc-900/60 my-2 space-y-3">
          {/* Home Team Row */}
          <div className="flex items-center justify-between" title={match.homeTeam}>
            <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm md:text-base text-foreground min-w-0 flex-1">
              <TeamCrest teamId={match.homeTeamId} size={30} className="flex-shrink-0" />
              <span className="truncate">{homeAbbr}</span>
            </div>
            <span className="font-mono text-xs sm:text-sm font-black text-foreground ml-3 bg-primary/10 dark:bg-primary/20 border border-primary/20 px-2.5 py-0.5 rounded-lg select-none">
              {isFinished ? match.score?.split('-')[0] : '–'}
            </span>
          </div>

          {/* Away Team Row */}
          <div className="flex items-center justify-between" title={match.awayTeam}>
            <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm md:text-base text-foreground min-w-0 flex-1">
              <TeamCrest teamId={match.awayTeamId} size={30} className="flex-shrink-0" />
              <span className="truncate">{awayAbbr}</span>
            </div>
            <span className="font-mono text-xs sm:text-sm font-black text-foreground ml-3 bg-primary/10 dark:bg-primary/20 border border-primary/20 px-2.5 py-0.5 rounded-lg select-none">
              {isFinished ? match.score?.split('-')[1] : '–'}
            </span>
          </div>

          {!isFinished && (
            <div className="pt-1 flex items-center justify-center gap-1 font-mono text-[9px] font-bold text-zinc-500">
              <Clock size={10} className="text-accent animate-pulse" />
              <span>{formattedTime} · HORA DE LUANDA</span>
            </div>
          )}
        </div>

        {/* Bottom info: estádio, data/hora, transmissão e árbitro */}
        <div className="flex flex-col gap-2 mt-4 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-zinc-600 flex-shrink-0" />
            <span className="truncate">{match.stadium}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-zinc-600 flex-shrink-0" />
            <span>{formattedDate} · {formattedTime}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 min-w-0">
              <Tv size={12} className="text-accent flex-shrink-0" />
              <span className="truncate">{broadcaster}</span>
            </span>
            <span className="flex items-center gap-1.5 text-zinc-500 min-w-0" title={`Árbitro: ${referee}`}>
              <Flag size={11} className="flex-shrink-0" />
              <span className="truncate hidden sm:inline">{referee}</span>
            </span>
          </div>
        </div>
      </AnimatedCard>
    </Link>
  );
}

export default function CalendarioTab({ seasonId }: { seasonId: string }) {
  const [filterState, setFilterState] = useState<CalendarFilters>(() => getDefaultFilters(seasonId));
  const [dynamicMatches, setDynamicMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'lista' | 'planeamento'>('lista');
  const [syncMeta, setSyncMeta] = useState<{
    accessCode: string;
    technicalSeed: string;
    generatedAt: string;
  } | null>(null);

  const isUpcoming = seasonId === UPCOMING_SEASON_ID;
  const filters = filterState.seasonId === seasonId ? filterState : getDefaultFilters(seasonId);
  const { selectedRound, filterStatus, filterTeam, filterMonth } = filters;

  const updateFilters = (patch: Partial<Omit<CalendarFilters, 'seasonId'>>) => {
    setFilterState((current) => ({
      ...(current.seasonId === seasonId ? current : getDefaultFilters(seasonId)),
      ...patch,
      seasonId,
    }));
  };

  useEffect(() => {
    if (!isUpcoming) return;

    let cancelled = false;
    const fetchDynamicCalendar = () => {
      setLoading(true);
      fetch('/api/ancaf?format=matches')
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          if (data.matches) {
            setDynamicMatches(data.matches);
          }
          if (data.source) {
            setSyncMeta({
              accessCode: data.source.accessCode,
              technicalSeed: data.source.technicalSeed || data.source.accessCode,
              generatedAt: data.generatedAt || data.source.generatedAt || new Date().toISOString(),
            });
          }
        })
        .catch((err) => console.error('Erro ao buscar calendário dinâmico:', err))
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    fetchDynamicCalendar();

    // Reage em tempo real à publicação de um novo sorteio (FAF Calendar grava
    // a semente ativa em ancaf_configs) e busca o calendário atualizado sem
    // precisar de recarregar a página.
    const channel = supabase
      .channel('ancaf-active-seed')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'ancaf_configs', filter: 'key=eq.active_calendar_seed' },
        () => fetchDynamicCalendar(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [isUpcoming]);

  const MATCHES = isUpcoming && dynamicMatches.length > 0 ? dynamicMatches : getMatchesForSeason(seasonId);

  const rounds = Array.from(new Set(MATCHES.map((m) => m.round))).sort((a, b) => a - b);

  // Meses disponíveis (chave yyyy-mm, rótulo pt-AO), na ordem do calendário
  const months = Array.from(
    MATCHES.reduce((map, m) => {
      const key = m.date.slice(0, 7);
      if (!map.has(key)) {
        map.set(key, new Date(m.date).toLocaleDateString('pt-AO', { month: 'long', year: 'numeric', timeZone: ANGOLA_TIME_ZONE }));
      }
      return map;
    }, new Map<string, string>()).entries(),
  ).sort((a, b) => a[0].localeCompare(b[0]));

  // Resumo da época
  const finishedMatches = MATCHES.filter((m) => m.status === 'finished');
  const totalGoals = finishedMatches.reduce((s, m) => s + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0);
  const nextRound = rounds.find((r) => MATCHES.some((m) => m.round === r && m.status !== 'finished'));
  const playedRounds = rounds.filter((r) => MATCHES.filter((m) => m.round === r).every((m) => m.status === 'finished')).length;

  const seasonStats = [
    { label: 'Jornadas', value: `${playedRounds}/${rounds.length}`, icon: CalendarDays },
    { label: 'Jogos Disputados', value: finishedMatches.length, icon: Trophy },
    { label: 'Golos Marcados', value: totalGoals, icon: Target },
    { label: 'Próxima Jornada', value: nextRound ? `J${nextRound}` : '—', icon: Flag },
  ];

  const statusOptions: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'finished', label: 'Concluídos' },
    { key: 'scheduled', label: 'Agendados' },
  ];

  const matchesFilter = (m: Match) =>
    (filterStatus === 'all' || m.status === filterStatus) &&
    (filterTeam === 'all' || m.homeTeamId === filterTeam || m.awayTeamId === filterTeam) &&
    (filterMonth === 'all' || m.date.startsWith(filterMonth));

  // Jornadas visíveis + filtragem por estado/equipa/mês
  const visibleRounds = (selectedRound === 'all' ? rounds : [selectedRound])
    .map((round) => ({
      round,
      matches: MATCHES.filter((m) => m.round === round && matchesFilter(m)),
    }))
    .filter((g) => g.matches.length > 0);

  const hasResults = visibleRounds.length > 0;

  const selectClass = 'bg-zinc-100 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-primary w-full sm:w-auto';

  return (
    <div>
      {/* Seletor de Modo de Visualização */}
      <div className="flex justify-end mb-6">
        <div className="flex gap-1 bg-zinc-100/60 dark:bg-zinc-950/60 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
          <button
            onClick={() => setViewMode('lista')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              viewMode === 'lista'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
            }`}
          >
            Lista de Jogos
          </button>
          <button
            onClick={() => setViewMode('planeamento')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              viewMode === 'planeamento'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
            }`}
          >
            Grelha de Planeamento
          </button>
        </div>
      </div>

      {viewMode === 'planeamento' ? (
        <CalendarioPlaneamento />
      ) : (
        <>
          {/* Estado de sincronização do calendário */}
      {isUpcoming && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 bg-green-500/5 border border-green-500/35 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold font-mono text-green-400 uppercase tracking-widest">
              Calendário Oficial Ativo
            </span>
          </div>
          {syncMeta && (
            <div className="text-[11px] font-mono text-zinc-400 flex flex-wrap gap-x-4 gap-y-1">
              <span>
                Sorteio: <strong className="text-foreground font-semibold">#{syncMeta.accessCode}</strong>
              </span>
              <span>
                Semente: <strong className="text-foreground font-semibold">{syncMeta.technicalSeed}</strong>
              </span>
              <span>
                Sincronizado:{' '}
                <strong className="text-foreground font-semibold">
                  {new Date(syncMeta.generatedAt).toLocaleString('pt-AO', {
                    timeZone: ANGOLA_TIME_ZONE,
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Resumo da época */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {seasonStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl sm:text-2xl text-foreground font-black leading-none">{stat.value}</p>
                <p className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1 truncate">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra de filtros */}
      <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm mb-8 space-y-4">
        {/* Estado */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider sm:w-20 flex-shrink-0">Estado</span>
          <div className="flex gap-1.5 bg-zinc-100/60 dark:bg-zinc-950/60 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto">
            {statusOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => updateFilters({ filterStatus: opt.key })}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  filterStatus === opt.key ? 'bg-primary text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Equipa e Mês (estilo /calendar da Liga Angola) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider sm:w-20 flex-shrink-0">Equipa</span>
          <select value={filterTeam} onChange={(e) => updateFilters({ filterTeam: e.target.value })} className={selectClass}>
            <option value="all">Todas as equipas</option>
            {TEAMS.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider sm:w-12 sm:text-right flex-shrink-0">Mês</span>
          <select value={filterMonth} onChange={(e) => updateFilters({ filterMonth: e.target.value })} className={selectClass}>
            <option value="all">Todos os meses</option>
            {months.map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Jornadas (scroll horizontal) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider sm:w-20 flex-shrink-0">Jornada</span>
          <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => updateFilters({ selectedRound: 'all' })}
              className={`snap-start px-3 py-1.5 rounded-lg text-xs font-semibold font-mono whitespace-nowrap transition-all flex-shrink-0 ${
                selectedRound === 'all'
                  ? 'bg-accent text-black'
                  : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-foreground border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              TODAS
            </button>
            {rounds.map((round) => (
              <button
                key={round}
                onClick={() => updateFilters({ selectedRound: round })}
                className={`snap-start px-3 py-1.5 rounded-lg text-xs font-semibold font-mono whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedRound === round
                    ? 'bg-accent text-black'
                    : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-foreground border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                J{round}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Paginação de Jornada (Navegador Rápido) */}
      {selectedRound !== 'all' && (
        <div className="flex justify-between items-center bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm mb-6 font-mono text-xs select-none">
          <button
            onClick={() => updateFilters({ selectedRound: selectedRound - 1 })}
            disabled={selectedRound === 1}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-white/20 disabled:opacity-40 transition-colors flex items-center gap-1 font-bold text-foreground disabled:cursor-not-allowed"
          >
            ◀ Anterior
          </button>

          <div className="flex items-center gap-2">
            <span className="text-zinc-600 dark:text-zinc-400 font-extrabold uppercase">Jornada {selectedRound} de {rounds.length}</span>
            <button
              onClick={() => updateFilters({ selectedRound: 'all' })}
              className="text-[10px] bg-accent/10 hover:bg-accent/20 text-accent font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-accent/20 transition-colors"
            >
              Ver Todas
            </button>
          </div>

          <button
            onClick={() => updateFilters({ selectedRound: selectedRound + 1 })}
            disabled={selectedRound === rounds.length}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-white/20 disabled:opacity-40 transition-colors flex items-center gap-1 font-bold text-foreground disabled:cursor-not-allowed"
          >
            Próxima ▶
          </button>
        </div>
      )}

      {/* Lista de jogos agrupada por jornada */}
      {loading && MATCHES.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-500 font-mono">A carregar calendário...</p>
        </div>
      ) : hasResults ? (
        <div className="space-y-10">
          {visibleRounds.map((group) => {
            const groupDate = new Date(group.matches[0].date).toLocaleDateString('pt-AO', {
              day: '2-digit', month: 'long', year: 'numeric',
              timeZone: ANGOLA_TIME_ZONE,
            });
            return (
              <section key={group.round}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-display text-foreground uppercase text-lg tracking-wider">Jornada {group.round}</h2>
                  <span className="h-px flex-1 bg-gradient-to-r from-zinc-300 dark:from-zinc-800 to-transparent" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:block">{groupDate}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  <AnimatePresence mode="popLayout">
                    {group.matches.map((match) => (
                      <motion.div
                        key={match.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MatchCard match={match} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-zinc-500 font-mono">Nenhum jogo encontrado com os filtros selecionados.</p>
        </div>
      )}
        </>
      )}
    </div>
  );
}
