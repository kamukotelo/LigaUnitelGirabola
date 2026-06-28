'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Zap, Clock, Trophy, Target, CalendarDays, Flag, Radio } from 'lucide-react';
import { SEASONS, CURRENT_SEASON_ID, UPCOMING_SEASON_ID, FAF_CALENDAR_SOURCE, getMatchesForSeason, Match } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';

type StatusFilter = 'all' | 'finished' | 'scheduled';

function MatchCard({ match }: { match: Match }) {
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';
  const formattedDate = new Date(match.date).toLocaleDateString('pt-AO', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

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
        <div className="flex items-center justify-between gap-1.5 py-4 border-y border-zinc-200/60 dark:border-zinc-900/60 my-2">
          <div className="flex-1 text-right font-bold text-xs sm:text-sm md:text-base text-foreground truncate" title={match.homeTeam}>
            {match.homeTeam}
          </div>
          {isFinished ? (
            <div className="px-2 py-1.5 sm:px-3 sm:py-2 bg-primary/10 border border-primary/20 rounded-xl font-mono text-base sm:text-lg font-black text-foreground text-center min-w-[3.5rem] sm:min-w-[4.5rem] flex justify-center items-center select-none shadow-[inset_0_0_15px_rgba(210,21,21,0.05)]">
              {match.score}
            </div>
          ) : (
            <div className="px-2 py-1.5 sm:px-3 sm:py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-[9px] sm:text-[10px] font-bold text-zinc-600 dark:text-zinc-400 text-center min-w-[3.5rem] sm:min-w-[4.5rem] flex flex-col justify-center items-center">
              <Clock size={10} className="mb-0.5 text-accent animate-pulse" /> VS
            </div>
          )}
          <div className="flex-1 text-left font-bold text-xs sm:text-sm md:text-base text-foreground truncate" title={match.awayTeam}>
            {match.awayTeam}
          </div>
        </div>

        {/* Bottom info */}
        <div className="flex flex-col gap-2 mt-4 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-zinc-600 flex-shrink-0" />
            <span className="truncate">{match.stadium}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-zinc-600 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </AnimatedCard>
    </Link>
  );
}

export default function FixturesPage() {
  const [seasonId, setSeasonId] = useState<string>(CURRENT_SEASON_ID);
  const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  const isUpcoming = seasonId === UPCOMING_SEASON_ID;
  const MATCHES = getMatchesForSeason(seasonId);
  const seasonLabel = SEASONS.find((s) => s.id === seasonId)?.label ?? '';

  const rounds = Array.from(new Set(MATCHES.map((m) => m.round))).sort((a, b) => a - b);

  // Resumo da época
  const finishedMatches = MATCHES.filter((m) => m.status === 'finished');
  const totalGoals = finishedMatches.reduce((s, m) => s + m.homeScore + m.awayScore, 0);
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

  // Jornadas visíveis + filtragem por estado
  const visibleRounds = (selectedRound === 'all' ? rounds : [selectedRound])
    .map((round) => ({
      round,
      matches: MATCHES.filter(
        (m) => m.round === round && (filterStatus === 'all' || m.status === filterStatus)
      ),
    }))
    .filter((g) => g.matches.length > 0);

  const hasResults = visibleRounds.length > 0;

  return (
    <div className="py-10 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Cabeçalho */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={14} className="text-accent animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
            CALENDARIO_E_RESULTADOS
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display text-foreground uppercase leading-none">
          Jogos e <span className="text-primary italic">Resultados</span>
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 font-mono uppercase tracking-wider">
          {isUpcoming
            ? `Época Girabola ${seasonLabel} · calendário oficial por disputar`
            : `Época Girabola ${seasonLabel} · percurso completo e próximos embates`}
        </p>

        {/* Seletor de época */}
        <div className="flex flex-wrap items-center gap-2 mt-5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mr-1">Época</span>
          {SEASONS.map((s) => {
            const active = s.id === seasonId;
            return (
              <button
                key={s.id}
                onClick={() => { setSeasonId(s.id); setSelectedRound('all'); setFilterStatus('all'); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
                  active
                    ? 'bg-primary text-white border-primary'
                    : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-foreground'
                }`}
              >
                {s.label}
                <span className={`ml-2 text-[9px] uppercase ${active ? 'text-white/70' : 'text-zinc-500'}`}>
                  {s.status === 'completed' ? 'Concluída' : 'Por disputar'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Proveniência FAF_CALENDAR (apenas na época por disputar) */}
        {isUpcoming && (
          <div className="mt-4 inline-flex items-center gap-2.5 bg-green-500/5 border border-green-500/30 rounded-xl px-3.5 py-2">
            <Radio size={14} className="text-green-400" />
            <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest">
              Calendário sincronizado · {FAF_CALENDAR_SOURCE.system} · cód. {FAF_CALENDAR_SOURCE.accessCode}
            </span>
          </div>
        )}
      </div>

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
                onClick={() => setFilterStatus(opt.key)}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  filterStatus === opt.key ? 'bg-primary text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jornadas (scroll horizontal) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider sm:w-20 flex-shrink-0">Jornada</span>
          <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setSelectedRound('all')}
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
                onClick={() => setSelectedRound(round)}
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

      {/* Lista de jogos agrupada por jornada */}
      {hasResults ? (
        <div className="space-y-10">
          {visibleRounds.map((group) => {
            const groupDate = new Date(group.matches[0].date).toLocaleDateString('pt-AO', {
              day: '2-digit', month: 'long', year: 'numeric',
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
    </div>
  );
}
