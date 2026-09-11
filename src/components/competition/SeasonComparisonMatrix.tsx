'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Calendar, 
  Flame, 
  ArrowRightLeft,
  CheckCircle2,
  Trophy,
  Filter,
  Users,
  AlertTriangle
} from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';
import { 
  CURRENT_SEASON_SCORERS, 
  getCurrentSeasonCleanSheets,
  getCurrentSeasonDiscipline,
  getMatchDetail,
  getMatchesForSeason,
  getTeamFullName,
} from '@/lib/data';
import { 
  HISTORICAL_SCORERS_2025_26, 
  HISTORICAL_CLEAN_SHEETS_2025_26,
  HISTORICAL_MATCHES_2025_26,
  HISTORICAL_MATCH_STATS_2025_26,
} from '@/lib/historical-results-2025-26';

export type ComparisonCategory = 'jogos' | 'marcadores' | 'guardaredes' | 'disciplina';

export default function SeasonComparisonMatrix() {
  const [activeCategory, setActiveCategory] = useState<ComparisonCategory>('jogos');
  const [roundScope, setRoundScope] = useState<'all' | 'homologous'>('all');
  const [clubFilter, setClubFilter] = useState<string>('all');

  // Dados reais 2026/27 (atual apurado)
  const currentMatches = getMatchesForSeason('2026-27');
  const currentFinished = currentMatches.filter(m => m.status === 'finished');
  const maxCurrentRound = Math.max(...currentFinished.map(m => m.round), 1);

  // Filtragem de jogos homólogos ou totais
  const historicalMatchesFiltered = useMemo(() => {
    let matches = HISTORICAL_MATCHES_2025_26;
    if (roundScope === 'homologous') {
      matches = matches.filter(m => m.round <= maxCurrentRound);
    }
    if (clubFilter !== 'all') {
      matches = matches.filter(m => m.homeTeamId === clubFilter || m.awayTeamId === clubFilter);
    }
    return matches;
  }, [roundScope, maxCurrentRound, clubFilter]);

  const currentMatchesFiltered = useMemo(() => {
    let matches = currentFinished;
    if (clubFilter !== 'all') {
      matches = matches.filter(m => m.homeTeamId === clubFilter || m.awayTeamId === clubFilter);
    }
    return matches;
  }, [currentFinished, clubFilter]);

  // Cálculos Época 2025/26
  const nHist = historicalMatchesFiltered.length || 1;
  const histGoals = historicalMatchesFiltered.reduce((sum, m) => sum + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0);
  const histGpm = (histGoals / nHist).toFixed(2);
  const histHomeWins = historicalMatchesFiltered.filter(m => (m.homeScore ?? 0) > (m.awayScore ?? 0)).length;
  const histHomeWinPct = ((histHomeWins / nHist) * 100).toFixed(1);
  const histDraws = historicalMatchesFiltered.filter(m => (m.homeScore ?? 0) === (m.awayScore ?? 0)).length;
  const histDrawPct = ((histDraws / nHist) * 100).toFixed(1);
  const histAwayWins = historicalMatchesFiltered.filter(m => (m.homeScore ?? 0) < (m.awayScore ?? 0)).length;
  const histAwayWinPct = ((histAwayWins / nHist) * 100).toFixed(1);

  // Cálculos Época 2026/27
  const nCurr = currentMatchesFiltered.length || 1;
  const currentGoals = currentMatchesFiltered.reduce((sum, m) => sum + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0);
  const currentGpm = (currentGoals / nCurr).toFixed(2);
  const currentHomeWins = currentMatchesFiltered.filter(m => (m.homeScore ?? 0) > (m.awayScore ?? 0)).length;
  const currentHomeWinPct = ((currentHomeWins / nCurr) * 100).toFixed(1);
  const currentDraws = currentMatchesFiltered.filter(m => (m.homeScore ?? 0) === (m.awayScore ?? 0)).length;
  const currentDrawPct = ((currentDraws / nCurr) * 100).toFixed(1);
  const currentAwayWins = currentMatchesFiltered.filter(m => (m.homeScore ?? 0) < (m.awayScore ?? 0)).length;
  const currentAwayWinPct = ((currentAwayWins / nCurr) * 100).toFixed(1);

  // Jogadores - Melhores Marcadores com filtro de clube
  const topHistoricalScorers = useMemo(() => {
    let list = HISTORICAL_SCORERS_2025_26;
    if (clubFilter !== 'all') {
      list = list.filter(p => p.teamId === clubFilter);
    }
    return list.slice(0, 5);
  }, [clubFilter]);

  const topCurrentScorers = useMemo(() => {
    const list = clubFilter === 'all'
      ? [...CURRENT_SEASON_SCORERS]
      : CURRENT_SEASON_SCORERS.filter((p) => p.teamId === clubFilter);
    return list.slice(0, 5);
  }, [clubFilter]);

  // Guarda-redes com filtro de clube
  const historicalCleanSheets = useMemo(() => {
    let list = HISTORICAL_CLEAN_SHEETS_2025_26;
    if (clubFilter !== 'all') {
      list = list.filter(p => p.teamId === clubFilter);
    }
    return list.slice(0, 5);
  }, [clubFilter]);

  const currentCleanSheets = useMemo(() => {
    let list = getCurrentSeasonCleanSheets();
    if (clubFilter !== 'all') {
      list = list.filter(p => p.teamId === clubFilter);
    }
    return list.slice(0, 5);
  }, [clubFilter]);

  // Disciplina 2025/26
  const histCards = useMemo(() => {
    let yellow = 0;
    let red = 0;
    for (const m of historicalMatchesFiltered) {
      const s = HISTORICAL_MATCH_STATS_2025_26[m.id];
      if (!s) continue;
      if (clubFilter === 'all') {
        yellow += (s.home.yellowCards ?? 0) + (s.away.yellowCards ?? 0);
        red += (s.home.redCards ?? 0) + (s.away.redCards ?? 0);
      } else {
        if (m.homeTeamId === clubFilter) {
          yellow += s.home.yellowCards ?? 0;
          red += s.home.redCards ?? 0;
        }
        if (m.awayTeamId === clubFilter) {
          yellow += s.away.yellowCards ?? 0;
          red += s.away.redCards ?? 0;
        }
      }
    }
    return {
      yellow,
      red,
      total: yellow + red,
      ypm: (yellow / nHist).toFixed(2),
      rpm: (red / nHist).toFixed(2),
    };
  }, [historicalMatchesFiltered, clubFilter, nHist]);

  // Disciplina 2026/27 (apurada através dos relatórios oficiais das partidas)
  const currentCards = useMemo(() => {
    let yellow = 0;
    let red = 0;
    for (const m of currentMatchesFiltered) {
      const stats = getMatchDetail(m);
      if (clubFilter === 'all') {
        yellow += (stats.homeStats.yellowCards ?? 0) + (stats.awayStats.yellowCards ?? 0);
        red += (stats.homeStats.redCards ?? 0) + (stats.awayStats.redCards ?? 0);
      } else {
        if (m.homeTeamId === clubFilter) {
          yellow += stats.homeStats.yellowCards ?? 0;
          red += stats.homeStats.redCards ?? 0;
        }
        if (m.awayTeamId === clubFilter) {
          yellow += stats.awayStats.yellowCards ?? 0;
          red += stats.awayStats.redCards ?? 0;
        }
      }
    }
    return {
      yellow,
      red,
      total: yellow + red,
      ypm: (yellow / nCurr).toFixed(2),
      rpm: (red / nCurr).toFixed(2),
    };
  }, [currentMatchesFiltered, clubFilter, nCurr]);

  const topHistoricalDiscipline = useMemo(() => {
    const players = [
      { id: 'yc-1', name: 'Moisés', club: 'Estrela 1.º de Maio', teamId: 'primeiromaio', yellow: 9, red: 2 },
      { id: 'yc-2', name: 'Singongo', club: 'Desportivo da Lunda-Sul', teamId: 'lundasul', yellow: 8, red: 0 },
      { id: 'yc-3', name: 'Ludy', club: 'Desportivo da Huíla', teamId: 'desphuila', yellow: 8, red: 0 },
      { id: 'yc-4', name: 'Chimito', club: 'Recreativo do Libolo', teamId: 'libolo', yellow: 8, red: 1 },
      { id: 'yc-5', name: 'Cahilo', club: 'Sagrada Esperança', teamId: 'sagrada', yellow: 7, red: 1 },
      { id: 'yc-6', name: 'Marcos', club: 'FC de Cabinda', teamId: 'cabinda', yellow: 7, red: 0 },
      { id: 'yc-7', name: 'Venâncio', club: 'CD 1.º de Agosto', teamId: 'dago', yellow: 7, red: 0 },
      { id: 'yc-8', name: 'Deybi Flores', club: 'Petro de Luanda', teamId: 'petro', yellow: 6, red: 0 },
    ];
    let list = players;
    if (clubFilter !== 'all') {
      list = list.filter(p => p.teamId === clubFilter);
    }
    return list.slice(0, 5);
  }, [clubFilter]);

  const topCurrentDiscipline = useMemo(() => {
    let list = getCurrentSeasonDiscipline().map(p => ({
      id: p.id,
      name: p.name,
      club: p.club,
      teamId: p.teamId,
      yellow: p.yellowCards,
      red: p.redCards,
    }));
    if (clubFilter !== 'all') {
      list = list.filter(p => p.teamId === clubFilter);
    }
    return list.slice(0, 5);
  }, [clubFilter]);

  const categories = [
    { key: 'jogos', label: '🏟️ Jogos & Resultados Oficiais', icon: Calendar },
    { key: 'marcadores', label: '⚽ Melhores Marcadores', icon: Flame },
    { key: 'guardaredes', label: '🧤 Guarda-Redes (Baliza a Zero)', icon: Shield },
    { key: 'disciplina', label: '🟨 Cartões & Disciplina', icon: AlertTriangle },
  ];

  // Lista de clubes comuns
  const commonClubs = [
    { id: 'all', name: 'Todos os Clubes' },
    { id: 'petro', name: 'Petro de Luanda' },
    { id: 'dago', name: '1.º de Agosto' },
    { id: 'wiliete', name: 'Wiliete de Benguela' },
    { id: 'sagrada', name: 'Sagrada Esperança' },
    { id: 'desphuila', name: 'Desportivo da Huíla' },
    { id: 'interclube', name: 'GD Interclube' },
    { id: 'kabuscorp', name: 'Kabuscorp SC' },
    { id: 'bravos', name: 'Bravos do Maquis' },
    { id: 'lundasul', name: 'Desportivo da Lunda-Sul' },
    { id: 'lobito', name: 'Académica do Lobito' },
    { id: 'libolo', name: 'Recreativo do Libolo' },
    { id: 'saosalvador', name: 'São Salvador' },
    { id: 'primeiromaio', name: '1.º de Maio' },
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

      {/* Barra de Filtros do Comparador */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-100/60 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6">
        {/* Filtro de Escopo: Temporada Completa vs Homólogo */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold flex items-center gap-1">
            <Filter size={11} /> Escopo:
          </span>
          <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5 bg-white dark:bg-zinc-950">
            <button
              onClick={() => setRoundScope('all')}
              className={`px-3 py-1 text-[11px] font-mono font-bold rounded-md transition-all ${
                roundScope === 'all'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
              }`}
            >
              Época Completa (30J)
            </button>
            <button
              onClick={() => setRoundScope('homologous')}
              className={`px-3 py-1 text-[11px] font-mono font-bold rounded-md transition-all ${
                roundScope === 'homologous'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
              }`}
            >
              Homólogo (Até J{maxCurrentRound})
            </button>
          </div>
        </div>

        {/* Filtro por Clube */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Clube:</span>
          <select
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
            className="bg-white dark:bg-zinc-950 text-foreground border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-accent"
          >
            {commonClubs.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
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
            key={`jogos-${roundScope}-${clubFilter}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna 2025/2026 */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-3">
                  <span className="font-bold text-xs uppercase font-mono text-zinc-600 dark:text-zinc-400">
                    Época 2025/2026 {roundScope === 'homologous' ? `(Até J${maxCurrentRound})` : '(Concluída)'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold">
                    {historicalMatchesFiltered.length} Jogos
                  </span>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Golos Totais:</span>
                    <span className="font-bold text-foreground">{histGoals} golos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Média de Golos / Jogo:</span>
                    <span className="font-bold text-foreground">{histGpm} g/j</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Distribuição:</span>
                    <span className="font-bold text-foreground">
                      {histHomeWins}V Casa ({histHomeWinPct}%) · {histDraws}E ({histDrawPct}%) · {histAwayWins}V Fora ({histAwayWinPct}%)
                    </span>
                  </div>
                  {clubFilter === 'all' && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Campeão Oficial:</span>
                      <span className="font-bold text-accent flex items-center gap-1"><Trophy size={12} /> Petro de Luanda (72 pts)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Coluna 2026/2027 */}
              <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20">
                <div className="flex items-center justify-between pb-3 border-b border-primary/20 mb-3">
                  <span className="font-bold text-xs uppercase font-mono text-primary">
                    Época 2026/2027 {roundScope === 'homologous' ? `(Até J${maxCurrentRound})` : '(Em Curso)'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                    {currentMatchesFiltered.length} Jogos Concluídos
                  </span>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Golos Totais:</span>
                    <span className="font-bold text-foreground">{currentGoals} golos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Média de Golos / Jogo:</span>
                    <span className="font-bold text-foreground">{currentGpm} g/j</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Distribuição:</span>
                    <span className="font-bold text-foreground">
                      {currentHomeWins}V Casa ({currentHomeWinPct}%) · {currentDraws}E ({currentDrawPct}%) · {currentAwayWins}V Fora ({currentAwayWinPct}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Diferença Homóloga de Eficácia:</span>
                    <span className={`font-bold ${Number(currentGpm) >= Number(histGpm) ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {Number(currentGpm) >= Number(histGpm)
                        ? `▲ +${(Number(currentGpm) - Number(histGpm)).toFixed(2)} g/j mais eficaz`
                        : `▼ ${(Number(currentGpm) - Number(histGpm)).toFixed(2)} g/j`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeCategory === 'marcadores' && (
          <motion.div
            key={`marcadores-${clubFilter}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* 2025/26 Marcadores */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase font-mono text-zinc-600 dark:text-zinc-400 block mb-3">
                Top Goleadores Oficiais (2025/2026) {clubFilter !== 'all' ? `— ${clubFilter.toUpperCase()}` : ''}
              </span>
              <div className="space-y-2">
                {topHistoricalScorers.length > 0 ? (
                  topHistoricalScorers.map((s, idx) => (
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
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 font-mono py-4 text-center">Sem marcadores registados para este filtro.</p>
                )}
              </div>
            </div>

            {/* 2026/27 Marcadores */}
            <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20">
              <span className="text-xs font-bold uppercase font-mono text-primary block mb-3">
                Top Goleadores Fichas Recebidas (2026/2027) {clubFilter !== 'all' ? `— ${clubFilter.toUpperCase()}` : ''}
              </span>
              <div className="space-y-2">
                {topCurrentScorers.length > 0 ? (
                  topCurrentScorers.map((s, idx) => (
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
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 font-mono py-4 text-center">Sem marcadores registados para este filtro.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeCategory === 'guardaredes' && (
          <motion.div
            key={`guardaredes-${clubFilter}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* 2025/26 Clean Sheets */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase font-mono text-zinc-600 dark:text-zinc-400 block mb-3">
                Top Guarda-Redes Sem Sofrer Golos (2025/2026) {clubFilter !== 'all' ? `— ${clubFilter.toUpperCase()}` : ''}
              </span>
              <div className="space-y-2">
                {historicalCleanSheets.length > 0 ? (
                  historicalCleanSheets.map((gk, idx) => (
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
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 font-mono py-4 text-center">Sem registos para este filtro.</p>
                )}
              </div>
            </div>

            {/* 2026/27 Clean Sheets */}
            <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20">
              <span className="text-xs font-bold uppercase font-mono text-primary block mb-3">
                Guarda-Redes Sem Sofrer Golos (2026/2027) {clubFilter !== 'all' ? `— ${clubFilter.toUpperCase()}` : ''}
              </span>
              <div className="space-y-2">
                {currentCleanSheets.length > 0 ? (
                  currentCleanSheets.map((gk, idx) => (
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
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 font-mono py-4 text-center">Sem registos para este filtro.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeCategory === 'disciplina' && (
          <motion.div
            key={`disciplina-${roundScope}-${clubFilter}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Comparação Geral de Disciplina */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 2025/26 Cartões */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase font-mono text-zinc-600 dark:text-zinc-400">
                    2025/2026 {roundScope === 'homologous' ? `(Até J${maxCurrentRound})` : '(30J)'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">{historicalMatchesFiltered.length} jogos</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-foreground">{histCards.total}</span>
                  <span className="text-xs font-mono text-zinc-500">cartões totais</span>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">🟨 Cartões Amarelos:</span>
                    <span className="font-bold text-foreground">{histCards.yellow} <span className="text-zinc-400 font-normal">({histCards.ypm}/j)</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">🟥 Cartões Vermelhos:</span>
                    <span className="font-bold text-foreground">{histCards.red} <span className="text-zinc-400 font-normal">({histCards.rpm}/j)</span></span>
                  </div>
                </div>
              </div>

              {/* 2026/27 Cartões */}
              <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase font-mono text-primary">
                    2026/2027 (Época Atual — Fichas Oficiais)
                  </span>
                  <span className="text-[10px] font-mono text-primary/70">{currentMatchesFiltered.length} jogos</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-primary">{currentCards.total}</span>
                  <span className="text-xs font-mono text-zinc-500">cartões totais</span>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-primary/20 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">🟨 Cartões Amarelos:</span>
                    <span className="font-bold text-foreground">{currentCards.yellow} <span className="text-primary font-normal">({currentCards.ypm}/j)</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">🟥 Cartões Vermelhos:</span>
                    <span className="font-bold text-foreground">{currentCards.red} <span className="text-primary font-normal">({currentCards.rpm}/j)</span></span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-zinc-500">Variação de Amarelos/Jogo:</span>
                    <span className={`font-bold ${Number(currentCards.ypm) <= Number(histCards.ypm) ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {Number(currentCards.ypm) <= Number(histCards.ypm)
                        ? `▼ ${(Number(currentCards.ypm) - Number(histCards.ypm)).toFixed(2)} (mais disciplinado)`
                        : `▲ +${(Number(currentCards.ypm) - Number(histCards.ypm)).toFixed(2)} (mais advertido)`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Listas de Jogadores com Mais Cartões */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 2025/26 Jogadores */}
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase font-mono text-zinc-600 dark:text-zinc-400 block mb-3">
                  Mais Advertidos (2025/2026) {clubFilter !== 'all' ? `— ${clubFilter.toUpperCase()}` : ''}
                </span>
                <div className="space-y-2">
                  {topHistoricalDiscipline.length > 0 ? (
                    topHistoricalDiscipline.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 text-center font-bold text-xs text-zinc-400 font-mono">{idx + 1}</span>
                          <TeamCrest teamId={p.teamId} size={24} />
                          <div>
                            <p className="text-xs font-bold text-foreground">{p.name}</p>
                            <p className="text-[10px] text-zinc-500 font-mono">{p.club}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {p.yellow} 🟨
                          </span>
                          {p.red > 0 && (
                            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              {p.red} 🟥
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-500 font-mono py-4 text-center">Sem registos para este filtro.</p>
                  )}
                </div>
              </div>

              {/* 2026/27 Jogadores */}
              <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20">
                <span className="text-xs font-bold uppercase font-mono text-primary block mb-3">
                  Cartões Atribuídos nas Súmulas (2026/2027) {clubFilter !== 'all' ? `— ${clubFilter.toUpperCase()}` : ''}
                </span>
                <div className="space-y-2">
                  {topCurrentDiscipline.length > 0 ? (
                    topCurrentDiscipline.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 text-center font-bold text-xs text-primary font-mono">{idx + 1}</span>
                          <TeamCrest teamId={p.teamId} size={24} />
                          <div>
                            <p className="text-xs font-bold text-foreground">{p.name}</p>
                            <p className="text-[10px] text-zinc-500 font-mono">{p.club}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {p.yellow} 🟨
                          </span>
                          {p.red > 0 && (
                            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              {p.red} 🟥
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-500 font-mono py-4 text-center">Sem registos para este filtro.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedCard>
  );
}
