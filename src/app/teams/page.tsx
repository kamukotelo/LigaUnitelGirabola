'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, MapPin, Tag, Award, Zap } from 'lucide-react';
import { getTeams } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';

export default function TeamsPage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Page Header */}
      <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-accent animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
              EQUIPAS_OFICIAIS
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display text-foreground uppercase leading-none">
            Clubes da <span className="text-primary italic">Liga Unitel Girabola</span>
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 font-mono uppercase tracking-wider">
            Lista das 16 equipas participantes na Liga Unitel Girabola
          </p>
        </div>
        <Link
          href="/teams/presenca-digital"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          <Globe size={14} /> Presença Digital
        </Link>
      </div>

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {getTeams().map((team, idx) => {
          // Highlight first-class traditional clubs (Petro, 1º de Agosto, Kabuscorp, Sagrada, Interclube, Wiliete)
          const isGiant = ['petro', 'dago', 'kabuscorp', 'sagrada', 'interclube', 'wiliete'].includes(team.id);

          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.02 }}
              className="h-full"
            >
              <Link href={`/teams/${team.id}`} className="block h-full cursor-pointer">
                <AnimatedCard
                  variant={isGiant ? 'holographic' : 'hud'}
                  className="bg-zinc-100/30 dark:bg-zinc-950/30 hover:bg-white/40 dark:hover:bg-zinc-900/40 border-zinc-200 dark:border-zinc-900 h-full flex flex-col justify-between"
                >
                  {/* Header: Team Crest / Nickname */}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <TeamCrest teamId={team.id} size={64} className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                        Fundado em {team.founded}
                      </span>
                    </div>

                    {/* Names */}
                    <h3 className="text-xl font-display text-foreground font-black uppercase leading-snug truncate" title={team.name}>
                      {team.name}
                    </h3>
                    <p className="text-[10px] text-accent font-mono tracking-widest uppercase mb-4">
                      {team.shortName}
                    </p>
                  </div>

                  {/* Details List */}
                  <div className="space-y-2.5 pt-4 border-t border-zinc-200/60 dark:border-zinc-900/60 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-zinc-600 flex-shrink-0" />
                      <span className="truncate">{team.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={13} className="text-zinc-600 flex-shrink-0" />
                      <span className="truncate" title={team.stadium}>{team.stadium}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag size={13} className="text-accent flex-shrink-0" />
                      <span className="truncate font-bold text-accent/80 uppercase tracking-wide">{team.nickname ?? team.shortName}</span>
                    </div>
                  </div>

                  {/* Footer Colors */}
                  <div className="mt-5 pt-3 border-t border-zinc-200/40 dark:border-zinc-900/40 flex justify-between items-center text-[9px] font-mono text-zinc-500">
                    <span>CORES:</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-bold uppercase">{team.colors}</span>
                  </div>
                </AnimatedCard>
              </Link>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
