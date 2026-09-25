'use client';

import React, { useMemo } from 'react';
import {
  Clock3, ShieldCheck, Flame, Zap, ArrowRightLeft,
  Target, Activity, Shield, Award, AlertCircle
} from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import {
  Player, Team, getMatchesForSeason, getMatchDetail, UPCOMING_SEASON_ID
} from '@/lib/data';

interface PlayerAdvancedStatsProps {
  player: Player;
  team?: Team;
  seasonId?: string;
}

const norm = (s?: string) => (s ? s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() : '');

export default function PlayerAdvancedStats({
  player,
  team,
  seasonId = UPCOMING_SEASON_ID,
}: PlayerAdvancedStatsProps) {
  const isGoalkeeper = player.position.toLowerCase().includes('guarda');

  const stats = useMemo(() => {
    const matches = getMatchesForSeason(seasonId).filter((m) => m.status === 'finished');

    const intervals = [
      { label: '0–15', scored: 0, conceded: 0 },
      { label: '16–30', scored: 0, conceded: 0 },
      { label: '31–45+', scored: 0, conceded: 0 },
      { label: '46–60', scored: 0, conceded: 0 },
      { label: '61–75', scored: 0, conceded: 0 },
      { label: '76–90+', scored: 0, conceded: 0 },
    ];

    let appearances = 0;
    let starts = 0;
    let subIn = 0;
    let fullMatches = 0;
    let homeMatches = 0;
    let awayMatches = 0;
    let minutesSum = 0;

    // GK specific
    let cleanSheets = 0;
    let goalsConceded = 0;
    let firstHalfConceded = 0;
    let secondHalfConceded = 0;
    let homeConceded = 0;
    let awayConceded = 0;
    let homeCleanSheets = 0;
    let awayCleanSheets = 0;

    // Outfield specific
    let goalsScored = 0;
    let assistsCount = 0;
    let firstHalfGoals = 0;
    let secondHalfGoals = 0;
    let homeGoals = 0;
    let awayGoals = 0;
    let penalties = 0;
    let matchOpeners = 0;

    const pNorm = norm(player.name);

    for (const match of matches) {
      const isHome = match.homeTeamId === player.teamId;
      const isAway = match.awayTeamId === player.teamId;
      if (!isHome && !isAway) continue;

      const detail = getMatchDetail(match);
      const lineup = isHome ? detail.homeLineup : detail.awayLineup;
      const mySide = isHome ? 'home' : 'away';
      const oppSide = isHome ? 'away' : 'home';

      const entry = lineup.find((p) => p.playerId === player.id || norm(p.name) === pNorm);
      const subInEvent = detail.events.find(
        (e) => e.team === mySide && e.type === 'sub' && (e.playerId === player.id || norm(e.player) === pNorm)
      );
      const wasStarter = !!(entry && entry.isStarter);
      const wasSubIn = !!subInEvent;

      const hadEvent = detail.events.some(
        (e) => e.team === mySide && (e.playerId === player.id || norm(e.player) === pNorm)
      );

      if (!wasStarter && !wasSubIn && !hadEvent) continue;

      appearances += 1;
      if (wasStarter) starts += 1;
      if (wasSubIn) subIn += 1;
      if (isHome) homeMatches += 1;
      else awayMatches += 1;

      const subOutEvent = detail.events.find(
        (e) => e.team === mySide && e.type === 'sub' && e.playerOut && norm(e.playerOut) === pNorm
      );
      const redCardEvent = detail.events.find(
        (e) => e.team === mySide && e.type === 'red' && (e.playerId === player.id || norm(e.player) === pNorm)
      );

      const startMin = wasStarter ? 0 : (subInEvent?.minute ?? 46);
      const endMin = subOutEvent?.minute ?? redCardEvent?.minute ?? 90;
      const matchMins = Math.max(1, Math.min(90, endMin) - Math.min(90, startMin));
      minutesSum += matchMins;

      if (wasStarter && !subOutEvent && !redCardEvent) {
        fullMatches += 1;
      }

      if (isGoalkeeper) {
        const oppScore = isHome ? match.awayScore : match.homeScore;
        goalsConceded += oppScore;
        if (oppScore === 0) {
          cleanSheets += 1;
          if (isHome) homeCleanSheets += 1;
          else awayCleanSheets += 1;
        }
        if (isHome) homeConceded += oppScore;
        else awayConceded += oppScore;

        for (const e of detail.events) {
          if (e.team === oppSide && e.type === 'goal' && e.minute !== undefined) {
            if (e.minute >= startMin && e.minute <= endMin) {
              const m = Math.min(Math.max(1, e.minute), 90);
              const idx = m <= 15 ? 0 : m <= 30 ? 1 : m <= 45 ? 2 : m <= 60 ? 3 : m <= 75 ? 4 : 5;
              intervals[idx].conceded += 1;
              if (m <= 45) firstHalfConceded += 1;
              else secondHalfConceded += 1;
            }
          }
        }
      } else {
        let teamScoredFirstInMatch = false;
        for (const e of detail.events) {
          if (e.team === mySide && e.type === 'goal') {
            const isPlayerGoal =
              !e.ownGoal &&
              !e.detail?.toLowerCase().includes('autogolo') &&
              (e.playerId === player.id || norm(e.player) === pNorm);

            if (isPlayerGoal) {
              goalsScored += 1;
              if (!teamScoredFirstInMatch) matchOpeners += 1;
              if (isHome) homeGoals += 1;
              else awayGoals += 1;
              if (e.detail?.toLowerCase().includes('penal')) penalties += 1;

              if (e.minute !== undefined) {
                const m = Math.min(Math.max(1, e.minute), 90);
                const idx = m <= 15 ? 0 : m <= 30 ? 1 : m <= 45 ? 2 : m <= 60 ? 3 : m <= 75 ? 4 : 5;
                intervals[idx].scored += 1;
                if (m <= 45) firstHalfGoals += 1;
                else secondHalfGoals += 1;
              }
            }
            teamScoredFirstInMatch = true;
          }

          if (e.team === mySide && e.type === 'goal' && e.assist && norm(e.assist) === pNorm) {
            assistsCount += 1;
          }
        }
      }
    }

    const maxIntervalValue = Math.max(
      1,
      ...intervals.map((i) => (isGoalkeeper ? i.conceded : i.scored))
    );

    return {
      isGk: isGoalkeeper,
      appearances,
      starts,
      subIn,
      fullMatches,
      homeMatches,
      awayMatches,
      minutesSum,
      avgMinutesPerMatch: appearances > 0 ? Math.round(minutesSum / appearances) : 0,
      intervals,
      maxIntervalValue,
      ...(isGoalkeeper
        ? {
            cleanSheets,
            goalsConceded,
            cleanSheetRate: appearances > 0 ? Math.round((cleanSheets / appearances) * 100) : 0,
            goalsConcededPerMatch: appearances > 0 ? (goalsConceded / appearances).toFixed(2) : '0.00',
            minutesPerConceded: goalsConceded > 0 ? Math.round(minutesSum / goalsConceded) : null,
            firstHalfConceded,
            secondHalfConceded,
            homeConceded,
            awayConceded,
            homeCleanSheets,
            awayCleanSheets,
          }
        : {
            goalsScored,
            assistsCount,
            contributions: goalsScored + assistsCount,
            minutesPerGoal: goalsScored > 0 ? Math.round(minutesSum / goalsScored) : null,
            minutesPerContribution:
              goalsScored + assistsCount > 0 ? Math.round(minutesSum / (goalsScored + assistsCount)) : null,
            goalsPer90: minutesSum > 0 ? ((goalsScored * 90) / minutesSum).toFixed(2) : '0.00',
            contributionsPer90:
              minutesSum > 0 ? (((goalsScored + assistsCount) * 90) / minutesSum).toFixed(2) : '0.00',
            firstHalfGoals,
            secondHalfGoals,
            homeGoals,
            awayGoals,
            penalties,
            matchOpeners,
          }),
    };
  }, [player.id, player.name, player.teamId, seasonId, isGoalkeeper]);

  const hasActivity = stats.appearances > 0;

  return (
    <section className="space-y-6 mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800" aria-label="Análise Avançada da Época">
      {/* ── Cabeçalho Oficial da Análise Avançada ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-100/60 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className="text-accent shrink-0" />
            <h3 className="font-display text-base sm:text-lg font-black uppercase text-foreground tracking-wide">
              Análise Avançada da Época
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs font-mono text-zinc-600 dark:text-zinc-400">
            Indicadores de rendimento competitivos extraídos das súmulas oficiais da competição.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono uppercase tracking-wider font-semibold">
            <ShieldCheck size={12} /> Súmulas Oficiais FAF/ANCAF
          </span>
        </div>
      </div>

      {/* ── Distribuição de Golos por Intervalo (15 Minutos) ── */}
      <AnimatedCard variant="hud" className="p-5 sm:p-6 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h4 className="font-display text-sm sm:text-base font-extrabold uppercase text-foreground flex items-center gap-2">
              <Clock3 size={16} className="text-accent shrink-0" />
              {isGoalkeeper
                ? 'Golos Sofridos por Intervalo (15 Minutos)'
                : 'Golos por Intervalo (15 Minutos)'}
            </h4>
            <p className="text-[10px] sm:text-[11px] font-mono text-zinc-500 mt-0.5">
              {isGoalkeeper
                ? 'Distribuição temporal de quando o guarda-redes sofre golos durante os seus minutos na baliza'
                : 'Distribuição temporal dos golos marcados pelo atleta ao longo dos 90 minutos'}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            {isGoalkeeper ? (
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Sofridos
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Marcados
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3.5">
          {stats.intervals.map((row) => {
            const count = isGoalkeeper ? row.conceded : row.scored;
            const pct = stats.maxIntervalValue > 0 ? (count / stats.maxIntervalValue) * 100 : 0;

            return (
              <div key={row.label} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-foreground text-[11px] w-16">{row.label}&apos;</span>
                  <div className="flex items-center gap-2">
                    {count > 0 ? (
                      isGoalkeeper ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded text-[10px] border border-rose-500/20">
                          -{count} {count === 1 ? 'sofrido' : 'sofridos'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] border border-emerald-500/20">
                          +{count} {count === 1 ? 'marcado' : 'marcados'}
                        </span>
                      )
                    ) : (
                      <span className="text-zinc-500 text-[10px]">0</span>
                    )}
                  </div>
                </div>

                <div className="h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isGoalkeeper ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Estado vazio amigável */}
        {isGoalkeeper && stats.goalsConceded === 0 && hasActivity && (
          <div className="mt-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={16} className="shrink-0" />
            <span>Guarda-redes invicto: nenhuma baliza violada na presente temporada oficial.</span>
          </div>
        )}
        {!isGoalkeeper && (stats.goalsScored ?? 0) === 0 && (
          <div className="mt-5 p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <AlertCircle size={16} className="shrink-0 text-accent" />
            <span>Sem golos registados nas súmulas oficiais da presente temporada até à data.</span>
          </div>
        )}
      </AnimatedCard>

      {/* ── Painéis de Indicadores de Rendimento Competitivo ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isGoalkeeper ? (
          <>
            {/* GK Card 1: Eficácia de Baliza */}
            <AnimatedCard variant="hud" className="p-5 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Eficácia Baliza</span>
                  <Shield size={16} className="text-emerald-500" />
                </div>
                <div className="text-3xl font-display font-black text-foreground">
                  {stats.cleanSheetRate}%
                </div>
                <p className="text-[10px] font-mono text-zinc-500 mt-1">Jogos sem sofrer golos</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900/80 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Balizas Limpas:</span>
                  <span className="font-bold text-foreground">{stats.cleanSheets} de {stats.appearances}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Média Sofridos/Jogo:</span>
                  <span className="font-bold text-foreground">{stats.goalsConcededPerMatch}</span>
                </div>
              </div>
            </AnimatedCard>

            {/* GK Card 2: Minutos / Golo Sofrido */}
            <AnimatedCard variant="hud" className="p-5 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Resistência</span>
                  <Target size={16} className="text-accent" />
                </div>
                <div className="text-3xl font-display font-black text-primary">
                  {stats.goalsConceded === 0
                    ? 'Invicto'
                    : stats.minutesPerConceded !== null
                    ? `${stats.minutesPerConceded}'`
                    : '—'}
                </div>
                <p className="text-[10px] font-mono text-zinc-500 mt-1">
                  {stats.goalsConceded === 0 ? `${stats.minutesSum}' sem sofrer` : 'Minutos por golo sofrido'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900/80 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total Sofridos:</span>
                  <span className="font-bold text-foreground">{stats.goalsConceded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Minutos em Campo:</span>
                  <span className="font-bold text-foreground">{stats.minutesSum}&apos;</span>
                </div>
              </div>
            </AnimatedCard>

            {/* GK Card 3: Distribuição por Parte */}
            <AnimatedCard variant="hud" className="p-5 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Solidez por Parte</span>
                  <Clock3 size={16} className="text-primary" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center my-2">
                  <div className="p-2 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/60">
                    <span className="text-lg font-display font-bold text-foreground">{stats.firstHalfConceded}</span>
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase">1.ª Parte</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/60">
                    <span className="text-lg font-display font-bold text-foreground">{stats.secondHalfConceded}</span>
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase">2.ª Parte</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-900/80 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Fase Crítica:</span>
                  <span className="font-bold text-foreground">
                    {stats.goalsConceded === 0
                      ? 'Inviolado'
                      : stats.firstHalfConceded > stats.secondHalfConceded
                      ? '1.ª Parte'
                      : stats.secondHalfConceded > stats.firstHalfConceded
                      ? '2.ª Parte'
                      : 'Equilibrada'}
                  </span>
                </div>
              </div>
            </AnimatedCard>

            {/* GK Card 4: Fator Casa vs Fora */}
            <AnimatedCard variant="hud" className="p-5 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Casa vs Fora</span>
                  <ArrowRightLeft size={16} className="text-accent" />
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Casa ({stats.homeMatches}j):</span>
                    <span className="font-bold text-foreground">
                      {stats.homeCleanSheets} clean sheets · -{stats.homeConceded}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Fora ({stats.awayMatches}j):</span>
                    <span className="font-bold text-foreground">
                      {stats.awayCleanSheets} clean sheets · -{stats.awayConceded}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900/80 text-[11px] font-mono flex justify-between">
                <span className="text-zinc-500">Jogos Completos:</span>
                <span className="font-bold text-foreground">{stats.fullMatches} de {stats.appearances}</span>
              </div>
            </AnimatedCard>
          </>
        ) : (
          <>
            {/* Outfield Card 1: Eficiência Goleadora */}
            <AnimatedCard variant="hud" className="p-5 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Eficiência</span>
                  <Flame size={16} className="text-accent" />
                </div>
                <div className="text-3xl font-display font-black text-foreground">
                  {stats.minutesPerGoal ? `${stats.minutesPerGoal}'` : '—'}
                </div>
                <p className="text-[10px] font-mono text-zinc-500 mt-1">Minutos por golo marcado</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900/80 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Golos por 90&apos;:</span>
                  <span className="font-bold text-foreground">{stats.goalsPer90}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Participações/90&apos;:</span>
                  <span className="font-bold text-foreground">{stats.contributionsPer90}</span>
                </div>
              </div>
            </AnimatedCard>

            {/* Outfield Card 2: Participações em Golo */}
            <AnimatedCard variant="hud" className="p-5 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Decisão & Aportação</span>
                  <Target size={16} className="text-primary" />
                </div>
                <div className="text-3xl font-display font-black text-primary">
                  {stats.contributions}
                </div>
                <p className="text-[10px] font-mono text-zinc-500 mt-1">
                  Participações ({stats.goalsScored}G + {stats.assistsCount}A)
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900/80 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Minutos p/ Participação:</span>
                  <span className="font-bold text-foreground">
                    {stats.minutesPerContribution ? `${stats.minutesPerContribution}'` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Abridores de Marcador:</span>
                  <span className="font-bold text-foreground">{stats.matchOpeners}</span>
                </div>
              </div>
            </AnimatedCard>

            {/* Outfield Card 3: Distribuição por Parte */}
            <AnimatedCard variant="hud" className="p-5 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Golos por Parte</span>
                  <Clock3 size={16} className="text-accent" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center my-2">
                  <div className="p-2 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/60">
                    <span className="text-lg font-display font-bold text-foreground">{stats.firstHalfGoals}</span>
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase">1.ª Parte</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/60">
                    <span className="text-lg font-display font-bold text-foreground">{stats.secondHalfGoals}</span>
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase">2.ª Parte</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-900/80 text-[11px] font-mono flex justify-between">
                <span className="text-zinc-500">Grandes Penalidades:</span>
                <span className="font-bold text-foreground">{stats.penalties}</span>
              </div>
            </AnimatedCard>

            {/* Outfield Card 4: Fator Casa vs Fora */}
            <AnimatedCard variant="hud" className="p-5 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Casa vs Fora</span>
                  <ArrowRightLeft size={16} className="text-accent" />
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Em Casa ({stats.homeMatches}j):</span>
                    <span className="font-bold text-foreground">{stats.homeGoals} golos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Fora de Casa ({stats.awayMatches}j):</span>
                    <span className="font-bold text-foreground">{stats.awayGoals} golos</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900/80 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Titularidades:</span>
                  <span className="font-bold text-foreground">{stats.starts} de {stats.appearances}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Média Minutos/Jogo:</span>
                  <span className="font-bold text-foreground">{stats.avgMinutesPerMatch}&apos;</span>
                </div>
              </div>
            </AnimatedCard>
          </>
        )}
      </div>
    </section>
  );
}
