'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  Award,
  Clock3,
  Flame,
  Home,
  MapPin,
  Plane,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import {
  Team,
  Match,
  StandingEntry,
  getMatchDetail,
  hasPublishedMatchEvents,
  getCurrentSeasonCleanSheets,
  getCurrentSeasonPer90,
  getTeamFullName,
} from '@/lib/data';

interface TeamAdvancedStatsProps {
  team: Team;
  matches: Match[];
  standing?: StandingEntry;
  seasonId: string;
}

function scoreAtHalfTime(match: Match): [number, number] | null {
  const parts = match.halfTimeScore?.match(/^(\d+)\s*[-–:]\s*(\d+)$/);
  return parts ? [Number(parts[1]), Number(parts[2])] : null;
}

function resultPoints(gf: number, ga: number) {
  return gf > ga ? 3 : gf === ga ? 1 : 0;
}

export default function TeamAdvancedStats({
  team,
  matches,
  standing,
  seasonId,
}: TeamAdvancedStatsProps) {
  const stats = useMemo(() => {
    // 1. Filtrar partidas terminadas do clube
    const finished = matches.filter(
      (m) =>
        (m.homeTeamId === team.id || m.awayTeamId === team.id) &&
        m.status === 'finished',
    );

    if (finished.length === 0) {
      return null;
    }

    // 2. Desempenho Casa vs. Fora
    const splitPerformance = (venue: 'home' | 'away') => {
      const rows = finished.filter((m) =>
        venue === 'home' ? m.homeTeamId === team.id : m.awayTeamId === team.id,
      );
      let won = 0;
      let drawn = 0;
      let lost = 0;
      let scored = 0;
      let conceded = 0;

      for (const m of rows) {
        const isHome = m.homeTeamId === team.id;
        const gf = isHome ? m.homeScore : m.awayScore;
        const ga = isHome ? m.awayScore : m.homeScore;
        scored += gf;
        conceded += ga;
        if (gf > ga) won += 1;
        else if (gf === ga) drawn += 1;
        else lost += 1;
      }

      const played = rows.length;
      const points = won * 3 + drawn;
      const maxPossiblePoints = played * 3;
      const efficiency = maxPossiblePoints > 0 ? (points / maxPossiblePoints) * 100 : 0;

      return {
        played,
        won,
        drawn,
        lost,
        scored,
        conceded,
        points,
        efficiency,
        avgScored: played > 0 ? scored / played : 0,
        avgConceded: played > 0 ? conceded / played : 0,
      };
    };

    const homePerf = splitPerformance('home');
    const awayPerf = splitPerformance('away');

    // 3. Golos por Intervalo de 15 Minutos
    const intervalLabels = ['0–15', '16–30', '31–45+', '46–60', '61–75', '76–90+'];
    const goalIntervals = intervalLabels.map((label) => ({
      label,
      scored: 0,
      conceded: 0,
    }));

    for (const match of finished.filter(hasPublishedMatchEvents)) {
      const detail = getMatchDetail(match);
      for (const event of detail.events) {
        if (event.type !== 'goal' || event.minute === undefined) continue;
        const minute = Math.max(1, event.minute);
        const index =
          minute <= 15 ? 0 : minute <= 30 ? 1 : minute <= 45 ? 2 : minute <= 60 ? 3 : minute <= 75 ? 4 : 5;
        const isTeamScorer = (event.team === 'home' ? match.homeTeamId : match.awayTeamId) === team.id;
        if (isTeamScorer) {
          goalIntervals[index].scored += 1;
        } else {
          goalIntervals[index].conceded += 1;
        }
      }
    }

    const maxIntervalGoals = Math.max(
      1,
      ...goalIntervals.flatMap((row) => [row.scored, row.conceded]),
    );

    // 4. Pontos Recuperados e Perdidos (Swings ao Intervalo vs Final)
    let pointsRecovered = 0;
    let pointsLost = 0;
    let swingMatchesCount = 0;

    for (const match of finished) {
      const half = scoreAtHalfTime(match);
      if (!half) continue;
      swingMatchesCount += 1;
      const isHome = match.homeTeamId === team.id;
      const halfGf = isHome ? half[0] : half[1];
      const halfGa = isHome ? half[1] : half[0];
      const finalGf = isHome ? match.homeScore : match.awayScore;
      const finalGa = isHome ? match.awayScore : match.homeScore;

      const halfPts = resultPoints(halfGf, halfGa);
      const finalPts = resultPoints(finalGf, finalGa);

      if (finalPts > halfPts) {
        pointsRecovered += finalPts - halfPts;
      } else if (finalPts < halfPts) {
        pointsLost += halfPts - finalPts;
      }
    }

    const netResilience = pointsRecovered - pointsLost;

    // 5. Público & Assistência no Estádio Oficial
    const homeMatches = finished.filter((m) => m.homeTeamId === team.id);
    const attendanceMatches = homeMatches.filter(
      (m) => typeof m.attendance === 'number' && m.attendance > 0,
    );
    const totalAttendance = attendanceMatches.reduce(
      (sum, m) => sum + (m.attendance ?? 0),
      0,
    );
    const avgAttendance =
      attendanceMatches.length > 0 ? totalAttendance / attendanceMatches.length : 0;
    const peakMatch = attendanceMatches.reduce<Match | null>(
      (max, m) => (!max || (m.attendance ?? 0) > (max.attendance ?? 0) ? m : max),
      null,
    );
    const estimatedOccupancy =
      team.stadiumCapacity > 0 && avgAttendance > 0
        ? (avgAttendance / team.stadiumCapacity) * 100
        : 0;

    // 6. Consistência Ofensiva e Defensiva
    const scoredInMatches = finished.filter(
      (m) => (m.homeTeamId === team.id ? m.homeScore : m.awayScore) > 0,
    ).length;
    const cleanSheetMatches = finished.filter(
      (m) => (m.homeTeamId === team.id ? m.awayScore : m.homeScore) === 0,
    ).length;

    const scoringRate =
      finished.length > 0 ? (scoredInMatches / finished.length) * 100 : 0;
    const cleanSheetRate =
      finished.length > 0 ? (cleanSheetMatches / finished.length) * 100 : 0;

    // 7. Extremos da Temporada (Maior vitória e Maior desaire)
    const margins = finished.map((match) => {
      const isHome = match.homeTeamId === team.id;
      const gf = isHome ? match.homeScore : match.awayScore;
      const ga = isHome ? match.awayScore : match.homeScore;
      const opponentId = isHome ? match.awayTeamId : match.homeTeamId;
      const opponentName = getTeamFullName(opponentId, isHome ? match.awayTeam : match.homeTeam);
      return {
        round: match.round,
        gf,
        ga,
        diff: gf - ga,
        opponent: opponentName,
        venue: isHome ? 'casa' : 'fora',
        matchId: match.id,
      };
    });

    const wins = margins.filter((m) => m.diff > 0);
    const losses = margins.filter((m) => m.diff < 0);

    const bestWin = wins.reduce<typeof margins[number] | null>(
      (top, row) => (!top || row.diff > top.diff || (row.diff === top.diff && row.gf > top.gf) ? row : top),
      null,
    );

    const worstLoss = losses.reduce<typeof margins[number] | null>(
      (worst, row) => (!worst || row.diff < worst.diff || (row.diff === worst.diff && row.ga > worst.ga) ? row : worst),
      null,
    );

    // 8. Disciplina Oficial por Jogo
    let totalYellow = 0;
    let totalRed = 0;
    let cardMatches = 0;

    for (const match of finished) {
      const detail = getMatchDetail(match);
      if (detail.officialStatKeys.includes('yellowCards')) {
        cardMatches += 1;
        const side = match.homeTeamId === team.id ? detail.homeStats : detail.awayStats;
        totalYellow += side.yellowCards ?? 0;
        totalRed += side.redCards ?? 0;
      }
    }

    const avgYellow = cardMatches > 0 ? totalYellow / cardMatches : 0;
    const avgRed = cardMatches > 0 ? totalRed / cardMatches : 0;

    // 9. Destaques Individuais do Clube
    const clubCleanSheets = getCurrentSeasonCleanSheets().filter(
      (c) => c.teamId === team.id && c.cleanSheets > 0,
    );
    const clubPer90 = getCurrentSeasonPer90()
      .filter((p) => p.teamId === team.id && p.minutesPlayed >= 90)
      .slice(0, 5);

    return {
      finishedCount: finished.length,
      homePerf,
      awayPerf,
      goalIntervals,
      maxIntervalGoals,
      pointsRecovered,
      pointsLost,
      netResilience,
      swingMatchesCount,
      attendanceMatchesCount: attendanceMatches.length,
      totalAttendance,
      avgAttendance,
      peakMatch,
      estimatedOccupancy,
      scoredInMatches,
      cleanSheetMatches,
      scoringRate,
      cleanSheetRate,
      bestWin,
      worstLoss,
      cardMatches,
      totalYellow,
      totalRed,
      avgYellow,
      avgRed,
      clubCleanSheets,
      clubPer90,
    };
  }, [matches, team.id, team.stadiumCapacity]);

  if (!stats) {
    return (
      <AnimatedCard variant="hud" className="p-8 text-center bg-white/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800">
        <Activity size={32} className="text-zinc-400 mx-auto mb-3 animate-pulse" />
        <h4 className="text-sm font-display uppercase tracking-wider text-foreground">
          Análise Avançada em Atualização
        </h4>
        <p className="mt-1 text-xs text-zinc-500 max-w-md mx-auto font-mono">
          Os dados avançados deste clube serão calculados e exibidos assim que forem homologados os primeiros jogos terminados da temporada.
        </p>
      </AnimatedCard>
    );
  }

  return (
    <div className="space-y-8">
      {/* Título da Secção de Métricas Avançadas */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-semibold block mb-1">
          Dossiê Oficial · {stats.finishedCount} {stats.finishedCount === 1 ? 'Jogo Analisado' : 'Jogos Analisados'}
        </span>
        <h3 className="text-xl font-display text-foreground uppercase tracking-wide flex items-center gap-2">
          <Activity size={20} className="text-accent" /> Análise Avançada da Época
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono mt-1">
          Indicadores de rendimento competitivos extraídos das súmulas oficiais da competição.
        </p>
      </div>

      {/* ── 1. DESEMPENHO CASA VS FORA ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Desempenho em Casa */}
        <AnimatedCard variant="hud" className="p-6 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Home size={16} />
              </span>
              <div>
                <h4 className="font-display text-sm uppercase text-foreground">Em Casa</h4>
                <p className="text-[10px] font-mono text-zinc-500">
                  {stats.homePerf.played} {stats.homePerf.played === 1 ? 'partida' : 'partidas'} no seu estádio
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-display font-black text-emerald-600 dark:text-emerald-400">
                {stats.homePerf.efficiency.toFixed(0)}%
              </span>
              <span className="block text-[9px] font-mono text-zinc-500 uppercase">Aproveitamento</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center font-mono py-3 border-y border-zinc-200/70 dark:border-zinc-800/70 text-xs">
            <div>
              <span className="text-[9px] text-zinc-500 block uppercase">V</span>
              <span className="font-bold text-foreground text-sm">{stats.homePerf.won}</span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 block uppercase">E</span>
              <span className="font-bold text-foreground text-sm">{stats.homePerf.drawn}</span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 block uppercase">D</span>
              <span className="font-bold text-foreground text-sm">{stats.homePerf.lost}</span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 block uppercase">Pontos</span>
              <span className="font-bold text-accent text-sm">{stats.homePerf.points}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
            <span>Golos: <strong className="text-foreground">{stats.homePerf.scored}</strong> marcados · <strong className="text-foreground">{stats.homePerf.conceded}</strong> sofridos</span>
            <span className="text-[10px] text-zinc-500">{stats.homePerf.avgScored.toFixed(1)} / {stats.homePerf.avgConceded.toFixed(1)} por j</span>
          </div>
        </AnimatedCard>

        {/* Desempenho Fora */}
        <AnimatedCard variant="hud" className="p-6 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Plane size={16} />
              </span>
              <div>
                <h4 className="font-display text-sm uppercase text-foreground">Fora de Portas</h4>
                <p className="text-[10px] font-mono text-zinc-500">
                  {stats.awayPerf.played} {stats.awayPerf.played === 1 ? 'deslocação' : 'deslocações'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-display font-black text-blue-600 dark:text-blue-400">
                {stats.awayPerf.efficiency.toFixed(0)}%
              </span>
              <span className="block text-[9px] font-mono text-zinc-500 uppercase">Aproveitamento</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center font-mono py-3 border-y border-zinc-200/70 dark:border-zinc-800/70 text-xs">
            <div>
              <span className="text-[9px] text-zinc-500 block uppercase">V</span>
              <span className="font-bold text-foreground text-sm">{stats.awayPerf.won}</span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 block uppercase">E</span>
              <span className="font-bold text-foreground text-sm">{stats.awayPerf.drawn}</span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 block uppercase">D</span>
              <span className="font-bold text-foreground text-sm">{stats.awayPerf.lost}</span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 block uppercase">Pontos</span>
              <span className="font-bold text-accent text-sm">{stats.awayPerf.points}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
            <span>Golos: <strong className="text-foreground">{stats.awayPerf.scored}</strong> marcados · <strong className="text-foreground">{stats.awayPerf.conceded}</strong> sofridos</span>
            <span className="text-[10px] text-zinc-500">{stats.awayPerf.avgScored.toFixed(1)} / {stats.awayPerf.avgConceded.toFixed(1)} por j</span>
          </div>
        </AnimatedCard>
      </div>

      {/* ── 2. GOLOS POR INTERVALO & RESILIÊNCIA ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição de Golos por Intervalo de 15 Minutos */}
        <AnimatedCard variant="hud" className="p-6 lg:col-span-2 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h4 className="font-display text-sm uppercase text-foreground flex items-center gap-2">
                <Clock3 size={16} className="text-accent" /> Golos por Intervalo (15 Minutos)
              </h4>
              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                Distribuição temporal de quando a equipa marca e quando sofre golos
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" /> Marcados
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500" /> Sofridos
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {stats.goalIntervals.map((row) => (
              <div key={row.label} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-foreground text-[11px] w-14">{row.label}&apos;</span>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      +{row.scored} {row.scored === 1 ? 'marcado' : 'marcados'}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-700">·</span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">
                      -{row.conceded} {row.conceded === 1 ? 'sofrido' : 'sofridos'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Barra de Golos Marcados */}
                  <div className="h-2 rounded bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500 rounded"
                      style={{
                        width: `${stats.maxIntervalGoals > 0 ? (row.scored / stats.maxIntervalGoals) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  {/* Barra de Golos Sofridos */}
                  <div className="h-2 rounded bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 transition-all duration-500 rounded"
                      style={{
                        width: `${stats.maxIntervalGoals > 0 ? (row.conceded / stats.maxIntervalGoals) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Resiliência e Reviravoltas */}
        <AnimatedCard variant="hud" className="p-6 flex flex-col justify-between bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800">
          <div>
            <h4 className="font-display text-sm uppercase text-foreground flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-accent" /> Resiliência & Reviravoltas
            </h4>
            <p className="text-[10px] font-mono text-zinc-500 mb-6">
              Pontos disputados entre o resultado ao intervalo e o apito final
            </p>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Pontos Recuperados
                </span>
                <span className="text-2xl font-display font-black text-foreground block mt-1">
                  +{stats.pointsRecovered} <span className="text-xs font-mono font-normal text-zinc-500">PTS</span>
                </span>
                <p className="text-[9px] font-mono text-zinc-500 mt-1">
                  Resgatados de empates ou desvantagens após o intervalo
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5">
                <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                  Pontos Desperdiçados
                </span>
                <span className="text-2xl font-display font-black text-foreground block mt-1">
                  -{stats.pointsLost} <span className="text-xs font-mono font-normal text-zinc-500">PTS</span>
                </span>
                <p className="text-[9px] font-mono text-zinc-500 mt-1">
                  Cedidos após estar em vantagem ao intervalo
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-mono text-xs">
            <span className="text-zinc-500">Saldo Líquido de Reação:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-xs ${
                stats.netResilience > 0
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : stats.netResilience < 0
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'bg-zinc-200/50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {stats.netResilience > 0 ? `+${stats.netResilience}` : stats.netResilience} pts
            </span>
          </div>
        </AnimatedCard>
      </div>

      {/* ── 3. PÚBLICO, ESTÁDIO & CONSISTÊNCIA ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Assistência no Estádio */}
        <div className="bg-white/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <p className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
            <Users size={14} className="text-accent" /> Média de Público
          </p>
          <p className="font-display text-2xl font-black text-foreground">
            {stats.avgAttendance > 0 ? Math.round(stats.avgAttendance).toLocaleString('pt-AO') : '—'}
          </p>
          <p className="text-[10px] font-mono text-zinc-500 mt-1">
            {stats.attendanceMatchesCount > 0
              ? `em ${stats.attendanceMatchesCount} jogos com assistência oficial`
              : 'Aguardam-se dados oficiais'}
          </p>
          {stats.peakMatch && (
            <p className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 text-[9px] font-mono text-zinc-500">
              Pico: <strong className="text-foreground">{stats.peakMatch.attendance?.toLocaleString('pt-AO')}</strong> (J{stats.peakMatch.round})
            </p>
          )}
        </div>

        {/* Regularidade Ofensiva */}
        <div className="bg-white/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <p className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
            <Flame size={14} className="text-accent" /> Jogos a Marcar
          </p>
          <p className="font-display text-2xl font-black text-foreground">
            {stats.scoringRate.toFixed(0)}%
          </p>
          <p className="text-[10px] font-mono text-zinc-500 mt-1">
            marcou em {stats.scoredInMatches} de {stats.finishedCount} jogos
          </p>
          <div className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 text-[9px] font-mono text-zinc-500 flex justify-between">
            <span>Média por jogo:</span>
            <strong className="text-foreground">
              {(standing && stats.finishedCount > 0 ? standing.goalsFor / stats.finishedCount : 0).toFixed(2)}
            </strong>
          </div>
        </div>

        {/* Balizas a Zero (Clean Sheets) */}
        <div className="bg-white/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <p className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
            <ShieldCheck size={14} className="text-accent" /> Balizas Invioladas
          </p>
          <p className="font-display text-2xl font-black text-foreground">
            {stats.cleanSheetRate.toFixed(0)}%
          </p>
          <p className="text-[10px] font-mono text-zinc-500 mt-1">
            {stats.cleanSheetMatches} de {stats.finishedCount} jogos sem sofrer
          </p>
          <div className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 text-[9px] font-mono text-zinc-500 flex justify-between">
            <span>Média sofrida:</span>
            <strong className="text-foreground">
              {(standing && stats.finishedCount > 0 ? standing.goalsAgainst / stats.finishedCount : 0).toFixed(2)}
            </strong>
          </div>
        </div>

        {/* Disciplina Média por Jogo */}
        <div className="bg-white/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <p className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
            <ShieldAlert size={14} className="text-accent" /> Disciplina por Jogo
          </p>
          <p className="font-display text-2xl font-black text-foreground">
            {stats.cardMatches > 0 ? `${stats.avgYellow.toFixed(1)} 🟨` : '—'}
          </p>
          <p className="text-[10px] font-mono text-zinc-500 mt-1">
            {stats.cardMatches > 0
              ? `${stats.avgRed.toFixed(2)} vermelhos/jogo (${stats.cardMatches} súmulas)`
              : 'Sem súmulas disciplinares'}
          </p>
          <div className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 text-[9px] font-mono text-zinc-500 flex justify-between">
            <span>Total registado:</span>
            <strong className="text-foreground">{stats.totalYellow}A · {stats.totalRed}V</strong>
          </div>
        </div>
      </div>

      {/* ── 4. EXTREMOS DA TEMPORADA ───────────────────────────────────── */}
      {(stats.bestWin || stats.worstLoss) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.bestWin && (
            <AnimatedCard variant="hud" className="p-5 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800">
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-2">
                <Trophy size={12} /> Maior Vitória da Época
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-display text-lg uppercase text-foreground font-black">
                    {stats.bestWin.gf} - {stats.bestWin.ga}
                  </h5>
                  <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-0.5">
                    vs {stats.bestWin.opponent} ({stats.bestWin.venue === 'casa' ? 'Casa' : 'Fora'})
                  </p>
                </div>
                <Link
                  href={`/matches/${stats.bestWin.matchId}`}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[10px] font-mono uppercase text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors"
                >
                  Jornada {stats.bestWin.round}
                </Link>
              </div>
            </AnimatedCard>
          )}

          {stats.worstLoss && (
            <AnimatedCard variant="hud" className="p-5 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800">
              <span className="text-[9px] font-mono text-rose-600 dark:text-rose-400 uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-2">
                <TrendingDown size={12} /> Maior Desaire da Época
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-display text-lg uppercase text-foreground font-black">
                    {stats.worstLoss.gf} - {stats.worstLoss.ga}
                  </h5>
                  <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-0.5">
                    vs {stats.worstLoss.opponent} ({stats.worstLoss.venue === 'casa' ? 'Casa' : 'Fora'})
                  </p>
                </div>
                <Link
                  href={`/matches/${stats.worstLoss.matchId}`}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[10px] font-mono uppercase text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors"
                >
                  Jornada {stats.worstLoss.round}
                </Link>
              </div>
            </AnimatedCard>
          )}
        </div>
      )}

      {/* ── 5. DESTAQUES INDIVIDUAIS DO CLUBE ─────────────────────────── */}
      {(stats.clubCleanSheets.length > 0 || stats.clubPer90.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Guarda-redes e Balizas Invioladas */}
          {stats.clubCleanSheets.length > 0 && (
            <AnimatedCard variant="hud" className="p-6 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800">
              <h4 className="font-display text-sm uppercase text-foreground flex items-center gap-2 mb-4">
                <Shield size={16} className="text-accent" /> Guarda-redes · Jogos Sem Sofrer
              </h4>
              <div className="space-y-3">
                {stats.clubCleanSheets.map((keeper) => {
                  const pct = keeper.appearances > 0 ? (keeper.cleanSheets / keeper.appearances) * 100 : 0;
                  return (
                    <div
                      key={keeper.id}
                      className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 flex items-center justify-between"
                    >
                      <div>
                        <Link
                          href={`/players/${keeper.id}`}
                          className="font-bold text-xs uppercase text-foreground hover:text-primary transition-colors"
                        >
                          {keeper.name}
                        </Link>
                        <span className="block text-[9px] font-mono text-zinc-500">
                          {keeper.appearances} {keeper.appearances === 1 ? 'jogo disputado' : 'jogos disputados'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-display font-black text-accent">
                          {keeper.cleanSheets} {keeper.cleanSheets === 1 ? 'jogo a zero' : 'jogos a zero'}
                        </span>
                        <span className="block text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          {pct.toFixed(0)}% de eficácia
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AnimatedCard>
          )}

          {/* Rendimento por 90 Minutos */}
          {stats.clubPer90.length > 0 && (
            <AnimatedCard variant="hud" className="p-6 bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800">
              <h4 className="font-display text-sm uppercase text-foreground flex items-center gap-2 mb-4">
                <Award size={16} className="text-accent" /> Rendimento por 90 Minutos
              </h4>
              <div className="space-y-3">
                {stats.clubPer90.map((player) => (
                  <div
                    key={player.id}
                    className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 flex items-center justify-between"
                  >
                    <div>
                      <Link
                        href={`/players/${player.id}`}
                        className="font-bold text-xs uppercase text-foreground hover:text-primary transition-colors"
                      >
                        {player.name}
                      </Link>
                      <span className="block text-[9px] font-mono text-zinc-500">
                        {player.minutesPlayed} min · {player.goals}G {player.assists > 0 ? `+ ${player.assists}A` : ''}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-display font-black text-foreground">
                        {player.goalsPer90.toFixed(2)} <span className="text-[10px] font-mono text-zinc-500">G/90&apos;</span>
                      </span>
                      {player.assistsPer90 > 0 && (
                        <span className="block text-[9px] font-mono text-accent">
                          {player.assistsPer90.toFixed(2)} A/90&apos;
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedCard>
          )}
        </div>
      )}
    </div>
  );
}
