'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Award, Shield } from 'lucide-react';
import { TOP_SCORERS, TOP_ASSISTS, getPlayers } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState<'scorers' | 'assists'>('scorers');

  // Max values to calculate progress percentage
  const maxGoals = Math.max(...TOP_SCORERS.map((p) => p.goals));
  const maxAssists = Math.max(...TOP_ASSISTS.map((p) => p.assists));

  const players = activeTab === 'scorers' ? TOP_SCORERS : TOP_ASSISTS;

  const allPlayersList = getPlayers();
  const leaderPlayerStats = TOP_SCORERS[0];
  const leaderPlayerFull = allPlayersList.find(p => p.id === leaderPlayerStats.id);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={14} className="text-accent animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
            ESTATISTICAS_DA_LIGA
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display text-foreground uppercase leading-none">
          Líderes de <span className="text-primary italic">Rendimento</span>
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 font-mono uppercase tracking-wider">
          Jogadores em destaque na temporada 2025/2026 do futebol angolano
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-900 mb-8 max-w-md">
        <button
          onClick={() => setActiveTab('scorers')}
          className={`flex-1 py-4 text-center text-xs font-mono uppercase tracking-wider font-extrabold border-b-2 transition-all duration-200 ${
            activeTab === 'scorers'
              ? 'text-accent border-accent bg-accent/5'
              : 'text-zinc-500 border-transparent hover:text-foreground hover:bg-white/5'
          }`}
        >
          ⚽ Melhores Marcadores
        </button>
        <button
          onClick={() => setActiveTab('assists')}
          className={`flex-1 py-4 text-center text-xs font-mono uppercase tracking-wider font-extrabold border-b-2 transition-all duration-200 ${
            activeTab === 'assists'
              ? 'text-accent border-accent bg-accent/5'
              : 'text-zinc-500 border-transparent hover:text-foreground hover:bg-white/5'
          }`}
        >
          🎯 Assistências
        </button>
      </div>

      {/* Statistics List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main List Container */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {players.map((player, idx) => {
                const isLeader = idx === 0;
                const value = activeTab === 'scorers' ? player.goals : player.assists;
                const maxValue = activeTab === 'scorers' ? maxGoals : maxAssists;
                const percent = Math.round((value / maxValue) * 100);

                return (
                  <AnimatedCard
                    key={player.id}
                    variant={isLeader ? 'holographic' : 'hud'}
                    className="bg-zinc-100/30 dark:bg-zinc-950/30 border-zinc-200/60 dark:border-zinc-900/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    
                    {/* Rank, Name & Club */}
                    <div className="flex items-center gap-4 min-w-0 md:min-w-[250px] w-full md:w-auto">
                      <span className={`text-2xl font-display font-black w-8 text-center flex-shrink-0 ${
                        isLeader ? 'text-accent animate-pulse' : 'text-zinc-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="text-foreground font-bold uppercase text-md flex items-center gap-2">
                          <Link href={`/players/${player.id}`} className="hover:text-primary transition-colors">
                            {player.name}
                          </Link>
                          {isLeader && (
                            <span className="text-[9px] font-mono bg-accent/20 text-accent border border-accent/40 px-2 py-0.5 rounded-full uppercase">
                              Líder
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <Shield size={10} className="text-zinc-600" />
                          {player.club} · {player.position}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar Meter */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-1.5 uppercase">
                        <span>Percentual sobre líder</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/80 dark:bg-zinc-900/80 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                          className={`h-full rounded-full ${
                            isLeader 
                              ? 'bg-gradient-to-r from-primary to-accent' 
                              : 'bg-primary'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Score Value Display */}
                    <div className="text-center md:text-right pl-4">
                      <span className={`text-4xl font-display font-black tracking-tighter ${
                        isLeader ? 'text-accent' : 'text-foreground'
                      }`}>
                        {value}
                      </span>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">
                        {activeTab === 'scorers' ? 'Golos' : 'Assistências'}
                      </p>
                    </div>

                  </AnimatedCard>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Info Box Sidebar */}
        <div className="space-y-6">
          
          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Flame size={16} className="text-accent" /> Perfil em Foco
            </h3>
            
            <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="p-4 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <h4 className="font-bold text-foreground text-md uppercase">
                  <Link href={`/players/${leaderPlayerStats.id}`} className="hover:text-primary transition-colors">
                    {leaderPlayerStats.name}
                  </Link>
                </h4>
                <p className="text-accent font-mono text-[10px] mt-0.5">{leaderPlayerStats.club.toUpperCase()}</p>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono">
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-foreground font-bold block text-sm">{leaderPlayerStats.appearances}</span>
                    <span className="text-[8px] text-zinc-500 uppercase">Jogos</span>
                  </div>
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-accent font-bold block text-sm">{leaderPlayerStats.goals}</span>
                    <span className="text-[8px] text-zinc-500 uppercase">Golos</span>
                  </div>
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-foreground font-bold block text-sm">{leaderPlayerStats.assists}</span>
                    <span className="text-[8px] text-zinc-500 uppercase">Assists</span>
                  </div>
                </div>
              </div>
              <p>
                {leaderPlayerFull?.bio ?? 'Destaque ofensivo do campeonato.'}
              </p>
            </div>
          </AnimatedCard>

          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award size={16} className="text-accent" /> Troféu Bola de Ouro
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              A FAF (Federação Angolana de Futebol) atribui no final de cada época o prémio oficial de melhor marcador e melhor jogador da liga. A cerimónia oficial da época 2025/2026 está agendada para o mês de Julho em Luanda.
            </p>
          </AnimatedCard>

        </div>

      </div>

    </div>
  );
}
