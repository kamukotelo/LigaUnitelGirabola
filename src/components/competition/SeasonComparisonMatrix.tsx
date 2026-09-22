'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
  CURRENT_SEASON_ID,
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
  HISTORICAL_DISCIPLINE_2025_26,
  HISTORICAL_MATCHES_2025_26,
  HISTORICAL_MATCH_STATS_2025_26,
} from '@/lib/historical-results-2025-26';

export type ComparisonCategory = 'jogos' | 'marcadores' | 'guardaredes' | 'disciplina';

/**
 * O clube é escolhido uma única vez, no filtro-mestre da aba de estatísticas,
 * e entra aqui como propriedade. O comparador tinha antes um seletor próprio,
 * com uma lista de clubes escrita à mão que já não incluía o CR Caála nem o FC
 * Luanda — duas equipas do plantel de 2026/2027.
 */
/** Época de arquivo que serve de termo de comparação. */
const BASELINE_SEASON_ID = '2025-26';

export default function SeasonComparisonMatrix({
  clubFilter = 'all',
  seasonId = CURRENT_SEASON_ID,
}: { clubFilter?: string; seasonId?: string }) {
  const [activeCategory, setActiveCategory] = useState<ComparisonCategory>('jogos');
  const [roundScope, setRoundScope] = useState<'all' | 'homologous'>('all');
  const clubLabel = clubFilter === 'all' ? '' : getTeamFullName(clubFilter, clubFilter);

  // A época escolhida no seletor do hub é a que fica em destaque aqui; a outra
  // passa a termo de comparação. Sem escolha, o destaque é o da época atual —
  // o comparador nunca abre com a época passada em primeiro plano.
  const focusIsCurrent = seasonId !== BASELINE_SEASON_ID;
  const focusSeasonLabel = focusIsCurrent ? '2026/2027' : '2025/2026';
  const referenceSeasonLabel = focusIsCurrent ? '2025/2026' : '2026/2027';
  const panelClass = (isFocus: boolean) => (isFocus
    ? 'bg-primary/5 dark:bg-primary/10 border-primary/20'
    : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800');
  const orderClass = (isFocus: boolean) => (isFocus ? 'order-first' : 'order-last');
  const headingClass = (isFocus: boolean) => (isFocus ? 'text-primary' : 'text-zinc-600 dark:text-zinc-400');
  const rankClass = (isFocus: boolean) => (isFocus ? 'text-primary' : 'text-zinc-400');
  const valueClass = (isFocus: boolean) => (isFocus ? 'text-primary' : 'text-foreground');

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

  // Disciplina 2025/26. A média por jogo divide pelos jogos cuja ficha publica
  // efetivamente os cartões — dividir pelo total de partidas diluía o valor com
  // jogos que não têm súmula disciplinar no arquivo.
  const histCards = useMemo(() => {
    let yellow = 0;
    let red = 0;
    let yellowMatches = 0;
    let redMatches = 0;
    for (const m of historicalMatchesFiltered) {
      const s = HISTORICAL_MATCH_STATS_2025_26[m.id];
      if (!s) continue;
      const hasYellow = s.keys.includes('yellowCards');
      const hasRed = s.keys.includes('redCards');
      if (!hasYellow && !hasRed) continue;
      if (hasYellow) yellowMatches += 1;
      if (hasRed) redMatches += 1;
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
      counted: Math.max(yellowMatches, redMatches),
      total: yellow + red,
      ypm: (yellow / (yellowMatches || 1)).toFixed(2),
      rpm: (red / (redMatches || 1)).toFixed(2),
    };
  }, [historicalMatchesFiltered, clubFilter]);

  // Disciplina 2026/27 (apurada através dos relatórios oficiais das partidas)
  const currentCards = useMemo(() => {
    let yellow = 0;
    let red = 0;
    let yellowMatches = 0;
    let redMatches = 0;
    for (const m of currentMatchesFiltered) {
      const stats = getMatchDetail(m);
      // Uma ficha pode publicar só os vermelhos (ou só os amarelos); cada
      // média tem por isso o seu próprio denominador.
      const hasYellow = stats.officialStatKeys.includes('yellowCards');
      const hasRed = stats.officialStatKeys.includes('redCards');
      if (!hasYellow && !hasRed) continue;
      if (hasYellow) yellowMatches += 1;
      if (hasRed) redMatches += 1;
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
      counted: Math.max(yellowMatches, redMatches),
      total: yellow + red,
      ypm: (yellow / (yellowMatches || 1)).toFixed(2),
      rpm: (red / (redMatches || 1)).toFixed(2),
    };
  }, [currentMatchesFiltered, clubFilter]);

  const topHistoricalDiscipline = useMemo(() => {
    const list = clubFilter === 'all'
      ? HISTORICAL_DISCIPLINE_2025_26
      : HISTORICAL_DISCIPLINE_2025_26.filter((p) => p.teamId === clubFilter);
    return list.slice(0, 5);
  }, [clubFilter]);

  // A coluna de 2025/2026 lista os mais advertidos (amarelos primeiro); a de
  // 2026/2027 vinha ordenada por vermelhos, o que colocava lado a lado dois
  // critérios diferentes — e um atleta com 0 amarelos no topo dos "advertidos".
  const topCurrentDiscipline = useMemo(() => {
    let list = getCurrentSeasonDiscipline()
      .slice()
      .sort((a, b) => b.yellowCards - a.yellowCards || b.redCards - a.redCards || a.name.localeCompare(b.name))
      .map(p => ({
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

  // As linhas de variação comparam sempre a época em foco com a outra, e não
  // 2026/2027 com 2025/2026 em fixo: trocar de época troca o sentido da leitura.
  const gpmDelta = Number(focusIsCurrent ? currentGpm : histGpm) - Number(focusIsCurrent ? histGpm : currentGpm);
  const gpmDeltaRow = (
    <div className="flex justify-between items-center">
      <span className="text-zinc-500">Diferença de Eficácia face a {referenceSeasonLabel}:</span>
      <span className={`font-bold ${gpmDelta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
        {gpmDelta >= 0
          ? `▲ +${gpmDelta.toFixed(2)} g/j mais eficaz`
          : `▼ ${gpmDelta.toFixed(2)} g/j`}
      </span>
    </div>
  );

  const ypmDelta = Number((focusIsCurrent ? currentCards : histCards).ypm) - Number((focusIsCurrent ? histCards : currentCards).ypm);
  const ypmDeltaRow = (
    <div className="flex justify-between items-center pt-1">
      <span className="text-zinc-500">Amarelos/Jogo face a {referenceSeasonLabel}:</span>
      <span className={`font-bold ${ypmDelta <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
        {ypmDelta <= 0
          ? `▼ ${ypmDelta.toFixed(2)} (mais disciplinado)`
          : `▲ +${ypmDelta.toFixed(2)} (mais advertido)`}
      </span>
    </div>
  );

  const categories = [
    { key: 'jogos', label: 'Jogos & Resultados', shortLabel: 'Jogos', icon: Calendar },
    { key: 'marcadores', label: 'Melhores Marcadores', shortLabel: 'Golos', icon: Flame },
    { key: 'guardaredes', label: 'Guarda-Redes (Balizas)', shortLabel: 'Balizas', icon: Shield },
    { key: 'disciplina', label: 'Cartões & Disciplina', shortLabel: 'Disciplina', icon: AlertTriangle },
  ];


  return (
    <AnimatedCard
      variant="hud"
      className="p-4 sm:p-7 bg-white/80 dark:bg-zinc-950/80 border-zinc-200 dark:border-zinc-800 backdrop-blur-md rounded-2xl mb-8"
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
            A época em destaque é a que está selecionada no topo da página.
          </p>
        </div>

        {/* Badge estrita de dados reais */}
        <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 font-bold">
            Em foco: {focusSeasonLabel}
          </span>
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

        {clubLabel && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-mono font-bold text-accent">
            <Users size={11} /> {clubLabel}
          </span>
        )}
      </div>

      {/* Tabs das Categorias */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-1.5 sm:gap-2">
        {categories.map(c => {
          const Icon = c.icon;
          const active = activeCategory === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key as ComparisonCategory)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${
                active
                  ? 'bg-accent text-zinc-950 shadow-sm font-black'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon size={14} />
              <span className="sm:hidden">{c.shortLabel}</span>
              <span className="hidden sm:inline">{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo Dinâmico por Categoria. Sem AnimatePresence: com `mode="wait"`
          o bloco novo só era montado depois de o anterior terminar a animação de
          saída, pelo que mudar de categoria — ou de clube no filtro do topo —
          deixava em ecrã os números da seleção anterior. */}
      <>
        {activeCategory === 'jogos' && (
          <motion.div
            key={`jogos-${seasonId}-${roundScope}-${clubFilter}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna 2025/2026 */}
              <div className={`p-4 rounded-xl border ${panelClass(!focusIsCurrent)} ${orderClass(!focusIsCurrent)}`}>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-3">
                  <span className={`font-bold text-xs uppercase font-mono ${headingClass(!focusIsCurrent)}`}>
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
                  {!focusIsCurrent && gpmDeltaRow}
                </div>
              </div>

              {/* Coluna 2026/2027 */}
              <div className={`p-4 rounded-xl border ${panelClass(focusIsCurrent)} ${orderClass(focusIsCurrent)}`}>
                <div className="flex items-center justify-between pb-3 border-b border-primary/20 mb-3">
                  <span className={`font-bold text-xs uppercase font-mono ${headingClass(focusIsCurrent)}`}>
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
                  {focusIsCurrent && gpmDeltaRow}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeCategory === 'marcadores' && (
          <motion.div
            key={`marcadores-${seasonId}-${clubFilter}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* 2025/26 Marcadores */}
            <div className={`p-4 rounded-xl border ${panelClass(!focusIsCurrent)} ${orderClass(!focusIsCurrent)}`}>
              <span className={`text-xs font-bold uppercase font-mono block mb-3 ${headingClass(!focusIsCurrent)}`}>
                Top Goleadores Oficiais (2025/2026) {clubLabel ? `— ${clubLabel}` : ''}
              </span>
              <div className="space-y-2">
                {topHistoricalScorers.length > 0 ? (
                  topHistoricalScorers.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 text-center font-bold text-xs font-mono ${rankClass(!focusIsCurrent)}`}>{idx + 1}</span>
                        <TeamCrest teamId={s.teamId} size={24} />
                        <div>
                          <p className="text-xs font-bold text-foreground">{s.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">{getTeamFullName(s.teamId, s.teamId)}</p>
                        </div>
                      </div>
                      <span className={`font-mono font-black text-sm ${valueClass(!focusIsCurrent)}`}>{s.goals} <span className="text-[10px] font-normal text-zinc-500">golos</span></span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 font-mono py-4 text-center">Sem marcadores registados para este filtro.</p>
                )}
              </div>
            </div>

            {/* 2026/27 Marcadores */}
            <div className={`p-4 rounded-xl border ${panelClass(focusIsCurrent)} ${orderClass(focusIsCurrent)}`}>
              <span className={`text-xs font-bold uppercase font-mono block mb-3 ${headingClass(focusIsCurrent)}`}>
                Top Goleadores Fichas Recebidas (2026/2027) {clubLabel ? `— ${clubLabel}` : ''}
              </span>
              <div className="space-y-2">
                {topCurrentScorers.length > 0 ? (
                  topCurrentScorers.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 text-center font-bold text-xs font-mono ${rankClass(focusIsCurrent)}`}>{idx + 1}</span>
                        <TeamCrest teamId={s.teamId} size={24} />
                        <div>
                          <p className="text-xs font-bold text-foreground">{s.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">{s.club}</p>
                        </div>
                      </div>
                      <span className={`font-mono font-black text-sm ${valueClass(focusIsCurrent)}`}>{s.goals} <span className="text-[10px] font-normal text-zinc-500">golos</span></span>
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
            key={`guardaredes-${seasonId}-${clubFilter}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* 2025/26 Clean Sheets */}
            <div className={`p-4 rounded-xl border ${panelClass(!focusIsCurrent)} ${orderClass(!focusIsCurrent)}`}>
              <span className={`text-xs font-bold uppercase font-mono block mb-3 ${headingClass(!focusIsCurrent)}`}>
                Top Guarda-Redes Sem Sofrer Golos (2025/2026) {clubLabel ? `— ${clubLabel}` : ''}
              </span>
              <div className="space-y-2">
                {historicalCleanSheets.length > 0 ? (
                  historicalCleanSheets.map((gk, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 text-center font-bold text-xs font-mono ${rankClass(!focusIsCurrent)}`}>{idx + 1}</span>
                        <TeamCrest teamId={gk.teamId} size={24} />
                        <div>
                          <p className="text-xs font-bold text-foreground">{gk.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">{gk.club}</p>
                        </div>
                      </div>
                      <span className={`font-mono font-black text-sm ${valueClass(!focusIsCurrent)}`}>{gk.cleanSheets} <span className="text-[10px] font-normal text-zinc-500">jogos a zero</span></span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 font-mono py-4 text-center">Sem registos para este filtro.</p>
                )}
              </div>
            </div>

            {/* 2026/27 Clean Sheets */}
            <div className={`p-4 rounded-xl border ${panelClass(focusIsCurrent)} ${orderClass(focusIsCurrent)}`}>
              <span className={`text-xs font-bold uppercase font-mono block mb-3 ${headingClass(focusIsCurrent)}`}>
                Guarda-Redes Sem Sofrer Golos (2026/2027) {clubLabel ? `— ${clubLabel}` : ''}
              </span>
              <div className="space-y-2">
                {currentCleanSheets.length > 0 ? (
                  currentCleanSheets.map((gk, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 text-center font-bold text-xs font-mono ${rankClass(focusIsCurrent)}`}>{idx + 1}</span>
                        <TeamCrest teamId={gk.teamId} size={24} />
                        <div>
                          <p className="text-xs font-bold text-foreground">{gk.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">{gk.club}</p>
                        </div>
                      </div>
                      <span className={`font-mono font-black text-sm ${valueClass(focusIsCurrent)}`}>{gk.cleanSheets} <span className="text-[10px] font-normal text-zinc-500">jogos a zero</span></span>
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
            key={`disciplina-${seasonId}-${roundScope}-${clubFilter}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Comparação Geral de Disciplina */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 2025/26 Cartões */}
              <div className={`p-4 rounded-xl border space-y-3 ${panelClass(!focusIsCurrent)} ${orderClass(!focusIsCurrent)}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold uppercase font-mono ${headingClass(!focusIsCurrent)}`}>
                    2025/2026 {roundScope === 'homologous' ? `(Até J${maxCurrentRound})` : '(30J)'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">{histCards.counted} jogos com súmula</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black font-mono ${valueClass(!focusIsCurrent)}`}>{histCards.total}</span>
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
                  {!focusIsCurrent && ypmDeltaRow}
                </div>
              </div>

              {/* 2026/27 Cartões */}
              <div className={`p-4 rounded-xl border space-y-3 ${panelClass(focusIsCurrent)} ${orderClass(focusIsCurrent)}`}>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold uppercase font-mono ${headingClass(focusIsCurrent)}`}>
                    2026/2027 (Época Atual — Fichas Oficiais)
                  </span>
                  <span className="text-[10px] font-mono text-primary/70">{currentCards.counted} de {currentMatchesFiltered.length} jogos com súmula</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black font-mono ${valueClass(focusIsCurrent)}`}>{currentCards.total}</span>
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
                  {focusIsCurrent && ypmDeltaRow}
                </div>
              </div>
            </div>

            {/* Listas de Jogadores com Mais Cartões */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 2025/26 Jogadores */}
              <div className={`p-4 rounded-xl border ${panelClass(!focusIsCurrent)} ${orderClass(!focusIsCurrent)}`}>
                <span className={`text-xs font-bold uppercase font-mono block mb-3 ${headingClass(!focusIsCurrent)}`}>
                  Mais Advertidos (2025/2026) {clubLabel ? `— ${clubLabel}` : ''}
                </span>
                <div className="space-y-2">
                  {topHistoricalDiscipline.length > 0 ? (
                    topHistoricalDiscipline.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 text-center font-bold text-xs font-mono ${rankClass(!focusIsCurrent)}`}>{idx + 1}</span>
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
              <div className={`p-4 rounded-xl border ${panelClass(focusIsCurrent)} ${orderClass(focusIsCurrent)}`}>
                <span className={`text-xs font-bold uppercase font-mono block mb-3 ${headingClass(focusIsCurrent)}`}>
                  Cartões Atribuídos nas Súmulas (2026/2027) {clubLabel ? `— ${clubLabel}` : ''}
                </span>
                <div className="space-y-2">
                  {topCurrentDiscipline.length > 0 ? (
                    topCurrentDiscipline.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-5 text-center font-bold text-xs font-mono ${rankClass(focusIsCurrent)}`}>{idx + 1}</span>
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
      </>
    </AnimatedCard>
  );
}
