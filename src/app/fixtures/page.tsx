'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Zap, Clock, Trophy, Target, CalendarDays, Flag, Radio } from 'lucide-react';
import { SEASONS, CURRENT_SEASON_ID, UPCOMING_SEASON_ID, FAF_CALENDAR_SOURCE, getMatchesForSeason, Match, TEAMS } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';

type StatusFilter = 'all' | 'finished' | 'scheduled';

function MatchCard({ match }: { match: Match }) {
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';
  const formattedDate = new Date(match.date).toLocaleDateString('pt-AO', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const homeTeamObj = TEAMS.find((t) => t.id === match.homeTeamId);
  const awayTeamObj = TEAMS.find((t) => t.id === match.awayTeamId);
  const homeAbbr = homeTeamObj?.shortName ?? match.homeTeam.substring(0, 3).toUpperCase();
  const awayAbbr = awayTeamObj?.shortName ?? match.awayTeam.substring(0, 3).toUpperCase();

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

        {/* Scoreboard: Vertical layout for readability and responsiveness */}
        <div className="py-3 border-y border-zinc-200/60 dark:border-zinc-900/60 my-2 space-y-3">
          {/* Home Team Row */}
          <div className="flex items-center justify-between" title={match.homeTeam}>
            <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm md:text-base text-foreground min-w-0 flex-1">
              <TeamCrest teamId={match.homeTeamId} size={22} className="bg-white dark:bg-zinc-900 p-0.5 border border-zinc-200/60 dark:border-zinc-800/60 rounded flex-shrink-0" />
              <span className="truncate">{homeAbbr}</span>
            </div>
            {isFinished && (
              <span className="font-mono text-xs sm:text-sm font-black text-foreground ml-3 bg-primary/10 dark:bg-primary/20 border border-primary/20 px-2.5 py-0.5 rounded-lg select-none">
                {match.score?.split('-')[0]}
              </span>
            )}
          </div>

          {/* Away Team Row */}
          <div className="flex items-center justify-between" title={match.awayTeam}>
            <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm md:text-base text-foreground min-w-0 flex-1">
              <TeamCrest teamId={match.awayTeamId} size={22} className="bg-white dark:bg-zinc-900 p-0.5 border border-zinc-200/60 dark:border-zinc-800/60 rounded flex-shrink-0" />
              <span className="truncate">{awayAbbr}</span>
            </div>
            {isFinished && (
              <span className="font-mono text-xs sm:text-sm font-black text-foreground ml-3 bg-primary/10 dark:bg-primary/20 border border-primary/20 px-2.5 py-0.5 rounded-lg select-none">
                {match.score?.split('-')[1]}
              </span>
            )}
          </div>

          {!isFinished && (
            <div className="pt-1 flex items-center justify-center gap-1 font-mono text-[9px] font-bold text-zinc-500">
              <Clock size={10} className="text-accent animate-pulse" />
              <span>AGENDADO</span>
            </div>
          )}
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
  const [dynamicMatches, setDynamicMatches] = useState<Match[]>([]);
  const [dynamicSource, setDynamicSource] = useState(FAF_CALENDAR_SOURCE);
  const [loading, setLoading] = useState(false);

  const isUpcoming = seasonId === UPCOMING_SEASON_ID;

  useEffect(() => {
    if (isUpcoming) {
      setLoading(true);
      fetch('/api/ancaf?format=matches')
        .then((res) => res.json())
        .then((data) => {
          if (data.matches) {
            setDynamicMatches(data.matches);
          }
          if (data.source) {
            setDynamicSource(data.source);
          }
        })
        .catch((err) => console.error('Erro ao buscar calendário dinâmico:', err))
        .finally(() => setLoading(false));
    }
  }, [isUpcoming]);

  const MATCHES = isUpcoming && dynamicMatches.length > 0 ? dynamicMatches : getMatchesForSeason(seasonId);
  const seasonLabel = SEASONS.find((s) => s.id === seasonId)?.label ?? '';

  const rounds = Array.from(new Set(MATCHES.map((m) => m.round))).sort((a, b) => a - b);

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

  // Estruturar calendário para visualização rápida de datas
  const dynamicCalendar = Array.from(
    MATCHES.reduce((map, m) => {
      const r = map.get(m.round) ?? { round: m.round, dates: [], fixtures: [] };
      const day = m.date.split('T')[0];
      if (!r.dates.includes(day)) r.dates.push(day);
      r.fixtures.push([m.homeTeamId, m.awayTeamId]);
      map.set(m.round, r);
      return map;
    }, new Map<number, any>()).values(),
  ).sort((a, b) => a.round - b.round);

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
              Calendário sincronizado · {dynamicSource.system} · cód. {dynamicSource.accessCode}
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

      {/* Cronograma de Datas das Jornadas (apenas para a época por disputar) */}
      {isUpcoming && (
        <AnimatedCard variant="hud" className="mb-8 p-6 bg-primary/5 border border-primary/20">
          <details className="group cursor-pointer">
            <summary className="flex justify-between items-center font-display text-foreground uppercase text-xs sm:text-sm tracking-wider list-none select-none">
              <div className="flex items-center gap-2">
                <Radio size={14} className="text-accent animate-pulse" />
                <span>Organização: Datas das Jornadas (SISTEMA ANCAF CALENDAR)</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono transition-transform group-open:rotate-180">▼ CLIQUE PARA VER</span>
            </summary>
            {loading ? (
              <div className="mt-5 text-center text-xs font-mono text-zinc-500">A carregar calendário...</div>
            ) : (
              <div className="mt-5 pt-5 border-t border-zinc-200/60 dark:border-zinc-900/60 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                {dynamicCalendar.map((r) => {
                  const [yy, mm, dd] = r.dates[0].split('-');
                  return { round: r.round, date: `${dd}/${mm}/${yy.slice(2)}` };
                }).map((item) => (
                  <div key={item.round} className="flex items-center gap-1.5 hover:text-foreground transition-colors py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span>J{item.round} - {item.date}</span>
                  </div>
                ))}
              </div>
            )}
          </details>
        </AnimatedCard>
      )}

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

      {/* Paginação de Jornada (Navegador Rápido) */}
      {selectedRound !== 'all' && (
        <div className="flex justify-between items-center bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm mb-6 font-mono text-xs select-none">
          <button
            onClick={() => setSelectedRound(selectedRound - 1)}
            disabled={selectedRound === 1}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-white/20 disabled:opacity-40 transition-colors flex items-center gap-1 font-bold text-foreground disabled:cursor-not-allowed"
          >
            ◀ Anterior
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-zinc-600 dark:text-zinc-400 font-extrabold uppercase">Jornada {selectedRound} de {rounds.length}</span>
            <button 
              onClick={() => setSelectedRound('all')}
              className="text-[10px] bg-accent/10 hover:bg-accent/20 text-accent font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-accent/20 transition-colors"
            >
              Ver Todas
            </button>
          </div>

          <button
            onClick={() => setSelectedRound(selectedRound + 1)}
            disabled={selectedRound === rounds.length}
            className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-white/20 disabled:opacity-40 transition-colors flex items-center gap-1 font-bold text-foreground disabled:cursor-not-allowed"
          >
            Próxima ▶
          </button>
        </div>
      )}

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
