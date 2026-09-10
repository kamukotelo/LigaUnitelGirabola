'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Minus, Info, ShieldAlert, Award, Clock } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { getSeasonBenchmarkComparison, SEASON_2025_26_BASELINE } from '@/lib/season-baseline';
import { Match, getMatchDetail } from '@/lib/data';

interface SeasonBenchmarkCardProps {
  currentMatches: Match[];
}

export default function SeasonBenchmarkCard({ currentMatches }: SeasonBenchmarkCardProps) {
  const comparison = getSeasonBenchmarkComparison(currentMatches, (match) => {
    const detail = getMatchDetail(match);
    return { home: detail.homeStats, away: detail.awayStats };
  });

  return (
    <AnimatedCard
      variant="hud"
      className="p-5 sm:p-7 bg-gradient-to-br from-white/90 via-white/50 to-primary/5 dark:from-zinc-950/90 dark:via-zinc-900/60 dark:to-primary/10 border-zinc-200 dark:border-zinc-800 backdrop-blur-md rounded-2xl mb-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <h3 className="font-display text-base sm:text-lg text-foreground uppercase tracking-wider font-black flex items-center gap-2">
              <BarChart3 size={18} className="text-accent" />
              Métricas Base & Benchmark de Competição
            </h3>
          </div>
          <p className="text-xs text-zinc-500 font-mono">
            Comparativo oficial da temporada em curso (2026/27) face à época de referência (2025/26 · 240 jogos)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            <Clock size={11} /> 2025/26: 240 Jogos
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
            {comparison.matchesPlayed} Jogos Concluídos (2026/27)
          </span>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparison.items.map((item, idx) => {
          const isUp = item.trend === 'up';
          const isDown = item.trend === 'down';
          const isEqual = item.trend === 'equal';

          // Determinar cor do delta
          const badgeClass = isEqual
            ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
            : item.isPositive
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 rounded-xl p-4 flex flex-col justify-between hover:border-accent/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 font-mono">
                    {item.label}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${badgeClass}`}
                  >
                    {isUp && <TrendingUp size={11} />}
                    {isDown && <TrendingDown size={11} />}
                    {isEqual && <Minus size={11} />}
                    {item.diff > 0 ? `+${item.diffPercent.toFixed(1)}%` : isEqual ? '0.0%' : `${item.diffPercent.toFixed(1)}%`}
                  </span>
                </div>

                {/* Valores lado a lado */}
                <div className="flex items-baseline justify-between my-3">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-600 dark:text-zinc-300 block mb-0.5">
                      Atual 2026/27
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-foreground tracking-tight">
                      {item.currentDisplay}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-600 dark:text-zinc-300 block mb-0.5">
                      Base 2025/26
                    </span>
                    <span className="text-sm font-bold font-mono text-zinc-600 dark:text-zinc-300">
                      {item.baselineDisplay}
                    </span>
                  </div>
                </div>
              </div>

              {/* Barra comparativa visual */}
              <div className="pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-accent transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(10, (item.current / (Math.max(item.current, item.baseline) * 1.15)) * 100))}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-zinc-600 dark:text-zinc-300 font-mono mt-1.5 truncate" title={item.description}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Nota de rodapé da Métrica Base */}
      <div className="mt-5 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
        <Info size={13} className="text-primary flex-shrink-0" />
        <span>
          A época 2025/2026 consolidou 515 golos oficiais (2.15 g/j), 109 vitórias caseiras (45.4%) e 68 empates em 240 partidas homologadas, constituindo o padrão oficial apurado para aferição de progresso desportivo no Girabola.
        </span>
      </div>
    </AnimatedCard>
  );
}
