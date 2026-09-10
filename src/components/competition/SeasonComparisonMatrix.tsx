'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Calendar, 
  Flame, 
  ArrowRightLeft,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';
import { 
  CURRENT_SEASON_SCORERS, 
  getCurrentSeasonCleanSheets, 
  getMatchesForSeason,
  getTeamFullName,
} from '@/lib/data';
import { 
  HISTORICAL_SCORERS_2025_26, 
  HISTORICAL_CLEAN_SHEETS_2025_26,
} from '@/lib/historical-results-2025-26';

export type ComparisonCategory = 'jogos' | 'marcadores' | 'guardaredes';

export default function SeasonComparisonMatrix() {
  const [activeCategory, setActiveCategory] = useState<ComparisonCategory>('jogos');

  // Dados reais 2026/27 (atual apurado)
  const currentMatches = getMatchesForSeason('2026-27');
  const currentFinished = currentMatches.filter(m => m.status === 'finished');
  const nCurr = currentFinished.length || 1;
  const currentGoals = currentFinished.reduce((sum, m) => sum + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0);
  const currentGpm = (currentGoals / nCurr).toFixed(2);
  const currentHomeWins = currentFinished.filter(m => (m.homeScore ?? 0) > (m.awayScore ?? 0)).length;
  const currentHomeWinPct = ((currentHomeWins / nCurr) * 100).toFixed(1);
  const currentDraws = currentFinished.filter(m => (m.homeScore ?? 0) === (m.awayScore ?? 0)).length;
  const currentDrawPct = ((currentDraws / nCurr) * 100).toFixed(1);
  const currentAwayWins = currentFinished.filter(m => (m.homeScore ?? 0) < (m.awayScore ?? 0)).length;
  const currentAwayWinPct = ((currentAwayWins / nCurr) * 100).toFixed(1);

  // Jogadores - Melhores Marcadores reais apurados
  const topCurrentScorers = CURRENT_SEASON_SCORERS.slice(0, 5);
  const topHistoricalScorers = HISTORICAL_SCORERS_2025_26.slice(0, 5);

  // Guarda-redes - Balizas a Zero apuradas
  const currentCleanSheets = getCurrentSeasonCleanSheets().slice(0, 5);
  const historicalCleanSheets = HISTORICAL_CLEAN_SHEETS_2025_26.slice(0, 5);

  const categories = [
    { key: 'jogos', label: '🏟️ Jogos & Resultados Oficiais', icon: Calendar },
    { key: 'marcadores', label: '⚽ Melhores Marcadores', icon: Flame },
    { key: 'guardaredes', label: '🧤 Guarda-Redes (Baliza a Zero)', icon: Shield },
  ];

  return (
    <AnimatedCard
      variant="hud"
      className="p-5 sm:p-7 bg-white/80 dark:bg-zinc-950/80 border-zinc-200 dark:border-zinc-800 backdrop-blur-md rounded-2xl mb-8"
    >
      {/* Header do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ArrowRightLeft className="text-accent" size={18} />
            <h3 className="font-display text-base sm:text-lg text-foreground uppercase tracking-wider font-black">
              Comparador Oficial entre Temporadas
            </h3>
          </div>
          <p className="text-xs text-zinc-500 font-mono">
            Dados 100% reais e apurados das fichas oficiais e classificações homologadas da FAF / ANCAF.
          </p>
        </div>

        {/* Badge estrita de dados reais */}
        <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold">
            <CheckCircle2 size={12} /> Apenas Dados Reais & Fichas Homologadas
          </span>
        </div>
      </div>

      {/* Tabs das Categorias */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-2">
        {categories.map(c => {
          const Icon = c.icon;
          const active = activeCategory === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key as ComparisonCategory)}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                active
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon size={14} />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo Dinâmico por Categoria */}
      <AnimatePresence mode="wait">
        {activeCategory === 'jogos' && (
          <motion.div
            key="jogos"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna 2025/2026 */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-3">
                  <span className="font-bold text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">Época 2025/2026 (Concluída)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold">240 Jogos Realizados</span>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Golos Totais Oficiais:</span>
                    <span className="font-bold text-foreground">515 golos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Média de Golos / Jogo:</span>
                    <span className="font-bold text-foreground">2.15 g/j</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Golos em Casa vs Fora:</span>
                    <span className="font-bold text-foreground">295 casa (57.3%) · 220 fora (42.7%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Distribuição de Resultados:</span>
                    <span className="font-bold text-foreground">109V Casa (45.4%) · 68E (28.3%) · 63V Fora (26.3%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Campeão Oficial:</span>
                    <span className="font-bold text-accent flex items-center gap-1"><Trophy size={12} /> Petro de Luanda (72 pts)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Melhor Defesa da Prova:</span>
                    <span className="font-bold text-foreground">Petro de Luanda (15 golos sofridos em 30J)</span>
                  </div>
                </div>
              </div>

              {/* Coluna 2026/2027 */}
              <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20">
                <div className="flex items-center justify-between pb-3 border-b border-primary/20 mb-3">
                  <span className="font-bold text-xs uppercase font-mono text-primary">Época 2026/2027 (Em Curso)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">{currentFinished.length} Jogos Concluídos</span>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Golos Totais Apurados:</span>
                    <span className="font-bold text-foreground">{currentGoals} golos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Média de Golos / Jogo:</span>
                    <span className="font-bold text-foreground">{currentGpm} g/j</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Distribuição de Resultados:</span>
                    <span className="font-bold text-foreground">{currentHomeWins}V Casa ({currentHomeWinPct}%) · {currentDraws}E ({currentDrawPct}%) · {currentAwayWins}V Fora ({currentAwayWinPct}%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Comparação com Época Anterior:</span>
                    <span className={`font-bold ${Number(currentGpm) >= 2.15 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {Number(currentGpm) >= 2.15 ? `▲ +${(Number(currentGpm) - 2.15).toFixed(2)} g/j mais eficaz` : `▼ ${(Number(currentGpm) - 2.15).toFixed(2)} g/j`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Fator Casa (Vitórias):</span>
                    <span className={`font-bold ${Number(currentHomeWinPct) >= 45.4 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {Number(currentHomeWinPct) >= 45.4 ? '▲ Maior domínio dos visitados' : '▼ Menor domínio caseiro'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeCategory === 'marcadores' && (
          <motion.div
            key="marcadores"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* 2025/26 Marcadores */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase font-mono text-zinc-600 dark:text-zinc-400 block mb-3">Top 5 Goleadores Oficiais (2025/2026)</span>
              <div className="space-y-2">
                {topHistoricalScorers.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-center font-bold text-xs text-zinc-400 font-mono">{idx + 1}</span>
                      <TeamCrest teamId={s.teamId} size={24} />
                      <div>
                        <p className="text-xs font-bold text-foreground">{s.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{getTeamFullName(s.teamId, s.teamId)}</p>
                      </div>
                    </div>
                    <span className="font-mono font-black text-sm text-foreground">{s.goals} <span className="text-[10px] font-normal text-zinc-500">golos</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2026/27 Marcadores */}
            <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20">
              <span className="text-xs font-bold uppercase font-mono text-primary block mb-3">Top Goleadores Fichas Recebidas (2026/2027)</span>
              <div className="space-y-2">
                {topCurrentScorers.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-center font-bold text-xs text-primary font-mono">{idx + 1}</span>
                      <TeamCrest teamId={s.teamId} size={24} />
                      <div>
                        <p className="text-xs font-bold text-foreground">{s.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{s.club}</p>
                      </div>
                    </div>
                    <span className="font-mono font-black text-sm text-primary">{s.goals} <span className="text-[10px] font-normal text-zinc-500">golos</span></span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeCategory === 'guardaredes' && (
          <motion.div
            key="guardaredes"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* 2025/26 Clean Sheets */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase font-mono text-zinc-600 dark:text-zinc-400 block mb-3">Top Guarda-Redes Sem Sofrer Golos (2025/2026)</span>
              <div className="space-y-2">
                {historicalCleanSheets.map((gk, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-center font-bold text-xs text-zinc-400 font-mono">{idx + 1}</span>
                      <TeamCrest teamId={gk.teamId} size={24} />
                      <div>
                        <p className="text-xs font-bold text-foreground">{gk.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{gk.club}</p>
                      </div>
                    </div>
                    <span className="font-mono font-black text-sm text-foreground">{gk.cleanSheets} <span className="text-[10px] font-normal text-zinc-500">jogos a zero</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2026/27 Clean Sheets */}
            <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20">
              <span className="text-xs font-bold uppercase font-mono text-primary block mb-3">Guarda-Redes Sem Sofrer Golos (2026/2027)</span>
              <div className="space-y-2">
                {currentCleanSheets.map((gk, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-center font-bold text-xs text-primary font-mono">{idx + 1}</span>
                      <TeamCrest teamId={gk.teamId} size={24} />
                      <div>
                        <p className="text-xs font-bold text-foreground">{gk.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{gk.club}</p>
                      </div>
                    </div>
                    <span className="font-mono font-black text-sm text-primary">{gk.cleanSheets} <span className="text-[10px] font-normal text-zinc-500">jogos a zero</span></span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedCard>
  );
}
