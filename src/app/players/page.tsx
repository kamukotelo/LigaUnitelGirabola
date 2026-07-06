'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Zap, User, ArrowUpRight } from 'lucide-react';
import { getPlayers, getTeams } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';

export default function PlayersPage() {
  const allPlayers = getPlayers();
  const allTeams = getTeams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');

  const positions = ['all', 'Guarda-redes', 'Defesa', 'Médio', 'Avançado'];

  const filteredPlayers = allPlayers.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === 'all' || player.teamId === selectedTeam;
    // Position match: check if substring since positions in data can be "Médio / Extremo", etc.
    const matchesPosition =
      selectedPosition === 'all' ||
      player.position.toLowerCase().includes(selectedPosition.toLowerCase());

    return matchesSearch && matchesTeam && matchesPosition;
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={14} className="text-accent animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
            ATLETAS_REGISTADOS
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display text-foreground uppercase leading-none">
          Jogadores do <span className="text-primary italic">Liga Unitel Girabola</span>
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 font-mono uppercase tracking-wider">
          Pesquise estatísticas, biografias e estados de registo dos atletas
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-primary transition-all font-mono"
            />
          </div>

          {/* Team Filter */}
          <div className="relative">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/60 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 focus:outline-none focus:border-primary transition-all font-mono"
            >
              <option value="all">TODOS OS CLUBES</option>
              {allTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Position Filter */}
          <div className="relative">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/60 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 focus:outline-none focus:border-primary transition-all font-mono"
            >
              <option value="all">TODAS AS POSIÇÕES</option>
              {positions.filter(p => p !== 'all').map((pos) => (
                <option key={pos} value={pos}>
                  {pos.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Players List Grid */}
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredPlayers.map((player, idx) => {
              const team = allTeams.find((t) => t.id === player.teamId);
              return (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.01 }}
                  className="h-full"
                >
                  <Link href={`/players/${player.id}`} className="block h-full cursor-pointer group">
                    <AnimatedCard
                      variant="hud"
                      className="bg-zinc-100/30 dark:bg-zinc-950/30 hover:bg-white/40 dark:hover:bg-zinc-900/40 border-zinc-200 dark:border-zinc-900 h-full flex flex-col justify-between animate-none"
                    >
                      <div>
                        {/* Header: Photo icon / Jersey Number */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-display text-lg text-primary select-none">
                            <User className="h-6 w-6 text-accent" />
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-black text-primary bg-primary/10 border border-primary/25 rounded-md px-2 py-0.5">
                              #{player.jerseyNumber}
                            </span>
                            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-1">
                              {player.position}
                            </div>
                          </div>
                        </div>

                        {/* Player name */}
                        <h3 className="text-md font-display text-foreground uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                          {player.name}
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 mt-1">
                          <Shield size={10} className="text-zinc-400" />
                          {team?.name ?? player.club}
                        </p>
                      </div>

                      {/* Stats Overview */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-900/60 text-center font-mono">
                        <div className="bg-white/50 dark:bg-black/20 p-1.5 rounded-lg border border-zinc-200/60 dark:border-zinc-900/60">
                          <span className="text-foreground font-black block text-xs">{player.goals}</span>
                          <span className="text-[8px] text-zinc-500 uppercase">Golos</span>
                        </div>
                        <div className="bg-white/50 dark:bg-black/20 p-1.5 rounded-lg border border-zinc-200/60 dark:border-zinc-900/60">
                          <span className="text-foreground font-black block text-xs">{player.appearances}</span>
                          <span className="text-[8px] text-zinc-500 uppercase">Jogos</span>
                        </div>
                      </div>

                      {/* Footer Link */}
                      <div className="mt-4 pt-3 border-t border-zinc-200/40 dark:border-zinc-900/40 flex justify-between items-center text-[9px] font-mono text-accent font-bold">
                        <span>ESTATÍSTICAS COMPLETAS</span>
                        <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </AnimatedCard>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16 bg-white/40 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <p className="text-zinc-500 font-mono">Nenhum jogador encontrado com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
}
