'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Zap, Clock } from 'lucide-react';
import { MATCHES } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';

export default function FixturesPage() {
  const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'finished' | 'scheduled'>('all');

  // Filter logic
  const filteredMatches = MATCHES.filter((match) => {
    const roundMatch = selectedRound === 'all' ? true : match.round === selectedRound;
    const statusMatch = filterStatus === 'all' ? true : match.status === filterStatus;
    return roundMatch && statusMatch;
  });

  const rounds = Array.from(new Set(MATCHES.map((m) => m.round))).sort((a, b) => a - b);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={14} className="text-accent animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
            CALENDARIO_E_RESULTADOS
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display text-white uppercase leading-none">
          Jogos e <span className="text-primary italic">Resultados</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-2 font-mono uppercase tracking-wider">
          Acompanhe o percurso do Girabola 2025/2026 e próximos embates
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8 bg-zinc-900/40 p-4 border border-zinc-800/80 rounded-2xl backdrop-blur-sm">
        
        {/* Round Filter */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-mono text-zinc-400 uppercase mr-2">Filtrar Jornada:</span>
          <button
            onClick={() => setSelectedRound('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              selectedRound === 'all'
                ? 'bg-primary text-white border-b border-primary-light'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            TODAS
          </button>
          {rounds.map((round) => (
            <button
              key={round}
              onClick={() => setSelectedRound(round)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                selectedRound === round
                  ? 'bg-primary text-white border-b border-primary-light'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              JORNADA {round}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 items-center">
          <span className="text-xs font-mono text-zinc-400 uppercase mr-2">Estado:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'finished' | 'scheduled')}
            className="bg-zinc-950 text-zinc-300 border border-zinc-800 rounded-lg p-2 text-xs font-mono outline-none focus:border-accent"
          >
            <option value="all">TODOS</option>
            <option value="finished">CONCLUÍDOS</option>
            <option value="scheduled">AGENDADOS</option>
          </select>
        </div>
      </div>

      {/* Match List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => {
              const isFinished = match.status === 'finished';
              const isLive = match.status === 'live';
              const formattedDate = new Date(match.date).toLocaleDateString('pt-AO', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <motion.div
                  key={match.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatedCard
                    variant="hud"
                    className="bg-zinc-950/30 hover:bg-zinc-900/30 border-zinc-900 relative p-6 h-full flex flex-col justify-between"
                  >
                    {/* Top Meta info */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-mono bg-zinc-800/80 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider">
                        Jornada {match.round}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {isFinished ? (
                          <span className="text-[9px] font-mono bg-zinc-900 text-zinc-500 border border-zinc-800/60 px-2 py-0.5 rounded uppercase tracking-wider">
                            Terminado
                          </span>
                        ) : isLive ? (
                          <span className="text-[9px] font-mono bg-green-500/20 text-green-500 border border-green-500/40 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-pulse" />
                            Live
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                            <Calendar size={10} />
                            Agendado
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Scoreboard / Competitors */}
                    <div className="flex items-center justify-between py-4 border-y border-zinc-900/60 my-2">
                      <div className="flex-1 text-right pr-4 font-bold text-sm md:text-md text-white truncate" title={match.homeTeam}>
                        {match.homeTeam}
                      </div>

                      {/* Result Box */}
                      {isFinished ? (
                        <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl font-mono text-lg font-black text-white text-center w-20 flex justify-center items-center select-none shadow-[inset_0_0_15px_rgba(210,21,21,0.05)]">
                          {match.score}
                        </div>
                      ) : (
                        <div className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl font-mono text-[10px] font-bold text-zinc-400 text-center w-20 flex flex-col justify-center items-center">
                          <Clock size={12} className="mb-0.5 text-accent animate-pulse" />
                          VS
                        </div>
                      )}

                      <div className="flex-1 text-left pl-4 font-bold text-sm md:text-md text-white truncate" title={match.awayTeam}>
                        {match.awayTeam}
                      </div>
                    </div>

                    {/* Bottom Stadium / Date info */}
                    <div className="flex flex-col gap-2 mt-4 text-[11px] text-zinc-400 font-mono">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-zinc-600" />
                        <span className="truncate">{match.stadium}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-zinc-600" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </AnimatedCard>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-16">
              <p className="text-zinc-500 font-mono">Nenhum jogo encontrado com os filtros selecionados.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
