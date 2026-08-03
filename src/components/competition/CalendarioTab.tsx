'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Trophy, Target, CalendarDays, Flag, X } from 'lucide-react';
import { UPCOMING_SEASON_ID, getMatchesForSeason, getAllTeams, Match } from '@/lib/data';
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

function CalendarMatchRow({ match, selectedTeamId }: { match: Match; selectedTeamId: string | null }) {
  const isFinished = match.status === 'finished';
  const matchDate = new Date(match.date);
  const formattedTime = matchDate.toLocaleTimeString('pt-AO', {
    hour: '2-digit', minute: '2-digit',
    timeZone: ANGOLA_TIME_ZONE,
  });
  const selected = selectedTeamId !== null && (match.homeTeamId === selectedTeamId || match.awayTeamId === selectedTeamId);
  const muted = selectedTeamId !== null && !selected;
  const homeScore = isFinished ? match.homeScore : '—';
  const awayScore = isFinished ? match.awayScore : '—';

  return (
    <Link
      href={`/matches/${match.id}`}
      className={`group grid grid-cols-[minmax(0,1fr)_30px] items-center gap-x-2 gap-y-1 border-b border-zinc-200/80 px-2.5 py-2 text-[10px] transition-all last:border-b-0 dark:border-zinc-800/80 sm:text-[11px] ${
        muted ? 'opacity-30 grayscale hover:opacity-75 hover:grayscale-0' : 'hover:bg-red-50 dark:hover:bg-red-950/20'
      }`}
      title={`${match.homeTeam} — ${match.awayTeam} · ${formattedTime}`}
    >
      <span className={`min-w-0 whitespace-nowrap text-left font-condensed font-semibold leading-tight ${selected ? 'font-extrabold text-red-600 dark:text-red-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
        {match.homeTeam}
      </span>
      <span className="text-center font-mono font-bold text-zinc-500">{homeScore}</span>
      <span className={`min-w-0 whitespace-nowrap text-left font-condensed font-semibold leading-tight ${selected ? 'font-extrabold text-red-600 dark:text-red-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
        {match.awayTeam}
      </span>
      <span className="text-center font-mono font-bold text-zinc-500">{awayScore}</span>
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
      fetch('/api/ancaf?format=matches', { cache: 'no-store' })
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

  const participantIds = new Set(MATCHES.flatMap((match) => [match.homeTeamId, match.awayTeamId]));
  const seasonTeams = getAllTeams().filter((team) => participantIds.has(team.id));

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
    (filterMonth === 'all' || m.date.startsWith(filterMonth));

  const selectedTeam = filterTeam === 'all' ? null : seasonTeams.find((team) => team.id === filterTeam) ?? null;

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
      {/* Capa e seletor visual de equipa */}
      <section className="mb-8 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-primary/15 via-white/60 to-accent/10 dark:from-primary/20 dark:via-zinc-950/80 dark:to-accent/10">
        <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-primary">Calendário oficial · {seasonId}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl uppercase tracking-wide text-foreground">
              {selectedTeam ? `Jogos do ${selectedTeam.name}` : 'Liga Unitel Girabola'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              {selectedTeam
                ? 'Os jogos desta equipa estão destacados. As restantes partidas continuam visíveis em segundo plano.'
                : 'Escolha um emblema para destacar todos os jogos dessa equipa ao longo do calendário.'}
            </p>
          </div>
          <div className="flex min-h-28 items-center justify-center">
            {selectedTeam ? (
              <TeamCrest teamId={selectedTeam.id} size={112} className="drop-shadow-xl" />
            ) : (
              <Image src="/logo-ancaf.png" alt="ANCAF" width={132} height={132} className="h-28 w-auto object-contain drop-shadow-xl" />
            )}
          </div>
        </div>
        <div className="border-t border-zinc-200/70 dark:border-zinc-800/70 bg-white/45 dark:bg-zinc-950/35 p-4 sm:p-5">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => updateFilters({ filterTeam: 'all' })}
              aria-label="Mostrar todas as equipas"
              className={`relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border transition-all ${filterTeam === 'all' ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'border-zinc-200 bg-white/60 opacity-60 hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-900/60'}`}
            >
              <Image src="/logo-ancaf.png" alt="Todas" width={42} height={42} className="h-10 w-10 object-contain" />
            </button>
            {seasonTeams.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => updateFilters({ filterTeam: team.id })}
                aria-label={`Destacar jogos do ${team.name}`}
                title={team.name}
                className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border transition-all ${filterTeam === team.id ? 'border-primary bg-primary/10 ring-2 ring-primary/20 scale-105' : 'border-zinc-200 bg-white/60 opacity-60 hover:scale-105 hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-900/60'}`}
              >
                <TeamCrest teamId={team.id} size={38} />
              </button>
            ))}
            {selectedTeam && (
              <button type="button" onClick={() => updateFilters({ filterTeam: 'all' })} className="ml-1 flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-mono uppercase text-zinc-500 hover:text-foreground">
                <X size={13} /> Limpar
              </button>
            )}
          </div>
        </div>
      </section>
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
                ID do Campeonato: <strong className="text-foreground font-semibold">#{syncMeta.accessCode}</strong>
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

        {/* Mês — a equipa é escolhida visualmente pelos emblemas acima */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider sm:w-20 flex-shrink-0">Mês</span>
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {visibleRounds.map((group) => {
            const orderedMatches = [...group.matches].sort((a, b) => a.date.localeCompare(b.date));
            const firstDate = new Date(orderedMatches[0].date).toLocaleDateString('pt-AO', {
              day: '2-digit', month: '2-digit', year: 'numeric', timeZone: ANGOLA_TIME_ZONE,
            });
            const lastDate = new Date(orderedMatches[orderedMatches.length - 1].date).toLocaleDateString('pt-AO', {
              day: '2-digit', month: '2-digit', year: 'numeric', timeZone: ANGOLA_TIME_ZONE,
            });
            return (
              <motion.section
                key={group.round}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(group.round * 0.015, 0.25) }}
                className="overflow-hidden rounded-[10px] border-[3px] border-zinc-800 bg-[#fffdf8] shadow-[0_5px_0_rgba(24,24,27,0.85)] dark:border-zinc-950 dark:bg-zinc-100"
              >
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 bg-gradient-to-b from-red-500 to-red-700 px-2.5 py-2 text-white">
                  <span className="font-mono text-[8px] font-bold tracking-tight">{firstDate}</span>
                  <h2 className="whitespace-nowrap font-display text-sm font-black uppercase tracking-tight sm:text-base">
                    {group.round}.ª Jornada
                  </h2>
                  <span className="text-right font-mono text-[8px] font-bold tracking-tight">{lastDate}</span>
                </div>
                <div className="px-1.5 py-1 text-zinc-900">
                  {orderedMatches.map((match) => (
                    <CalendarMatchRow
                      key={match.id}
                      match={match}
                      selectedTeamId={filterTeam === 'all' ? null : filterTeam}
                    />
                  ))}
                </div>
              </motion.section>
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
