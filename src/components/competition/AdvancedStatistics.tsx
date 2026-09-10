'use client';

import { useMemo } from 'react';
import { Activity, BarChart3, Clock3, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import {
  computeStandings,
  getCurrentSeasonCleanSheets,
  getCurrentSeasonGoalHauls,
  getCurrentSeasonPer90,
  getMatchDetail,
  getMatchOfficials,
  getMatchesForSeason,
  getTeamFullName,
  hasPublishedMatchEvents,
  UPCOMING_SEASON_ID,
  type Match,
} from '@/lib/data';
import SeasonBenchmarkCard from './SeasonBenchmarkCard';

function scoreAtHalfTime(match: Match): [number, number] | null {
  const parts = match.halfTimeScore?.match(/^(\d+)\s*[-–:]\s*(\d+)$/);
  return parts ? [Number(parts[1]), Number(parts[2])] : null;
}

function resultPoints(gf: number, ga: number) {
  return gf > ga ? 3 : gf === ga ? 1 : 0;
}

export default function AdvancedStatistics({ seasonId }: { seasonId: string }) {
  const analytics = useMemo(() => {
    const finished = getMatchesForSeason(seasonId).filter((match) => match.status === 'finished');
    const standings = computeStandings(finished);
    const teamMetrics = standings.map((row) => ({
      ...row,
      efficiency: row.played ? (row.points / (row.played * 3)) * 100 : 0,
      goalsForAverage: row.played ? row.goalsFor / row.played : 0,
      goalsAgainstAverage: row.played ? row.goalsAgainst / row.played : 0,
    }));

    const rounds = [...new Set(finished.map((match) => match.round))].sort((a, b) => a - b);
    const roundMetrics = rounds.map((round) => {
      const matches = finished.filter((match) => match.round === round);
      const goals = matches.reduce((sum, match) => sum + match.homeScore + match.awayScore, 0);
      return { round, matches: matches.length, goals, average: matches.length ? goals / matches.length : 0 };
    });

    const evolution = rounds.map((round) => ({
      round,
      leaders: computeStandings(finished.filter((match) => match.round <= round)).slice(0, 3),
    }));

    const intervalLabels = ['0–15', '16–30', '31–45+', '46–60', '61–75', '76–90+'];
    const goalIntervals = intervalLabels.map((label) => ({ label, goals: 0 }));
    for (const match of finished.filter(hasPublishedMatchEvents)) {
      for (const event of getMatchDetail(match).events) {
        if (event.type !== 'goal' || event.minute === undefined) continue;
        const minute = Math.max(1, event.minute);
        const index = minute <= 15 ? 0 : minute <= 30 ? 1 : minute <= 45 ? 2 : minute <= 60 ? 3 : minute <= 75 ? 4 : 5;
        goalIntervals[index].goals += 1;
      }
    }

    const refereeMap = new Map<string, { matches: number; yellow: number; red: number }>();
    for (const match of finished) {
      const referee = getMatchOfficials(match).referee;
      if (!referee || referee === 'A definir') continue;
      const detail = getMatchDetail(match);
      const official = new Set(detail.officialStatKeys);
      const row = refereeMap.get(referee) ?? { matches: 0, yellow: 0, red: 0 };
      row.matches += 1;
      if (official.has('yellowCards')) row.yellow += detail.homeStats.yellowCards + detail.awayStats.yellowCards;
      if (official.has('redCards')) row.red += detail.homeStats.redCards + detail.awayStats.redCards;
      refereeMap.set(referee, row);
    }
    const referees = [...refereeMap.entries()]
      .map(([name, values]) => ({ name, ...values }))
      .sort((a, b) => b.matches - a.matches || b.yellow + b.red - (a.yellow + a.red));

    const attendanceMatches = finished.filter((match) => typeof match.attendance === 'number' && match.attendance > 0);
    const attendanceByTeam = new Map<string, { total: number; matches: number }>();
    const attendanceByStadium = new Map<string, { total: number; matches: number }>();
    for (const match of attendanceMatches) {
      const team = attendanceByTeam.get(match.homeTeamId) ?? { total: 0, matches: 0 };
      team.total += match.attendance!; team.matches += 1; attendanceByTeam.set(match.homeTeamId, team);
      const stadium = attendanceByStadium.get(match.stadium) ?? { total: 0, matches: 0 };
      stadium.total += match.attendance!; stadium.matches += 1; attendanceByStadium.set(match.stadium, stadium);
    }
    const attendanceTeams = [...attendanceByTeam.entries()].map(([teamId, row]) => ({
      label: getTeamFullName(teamId, teamId), total: row.total, average: row.total / row.matches,
    })).sort((a, b) => b.total - a.total);
    const attendanceStadiums = [...attendanceByStadium.entries()].map(([label, row]) => ({
      label, total: row.total, average: row.total / row.matches,
    })).sort((a, b) => b.total - a.total);

    const swings = new Map<string, { recovered: number; lost: number }>();
    for (const match of finished) {
      const half = scoreAtHalfTime(match);
      if (!half) continue;
      for (const side of ['home', 'away'] as const) {
        const teamId = side === 'home' ? match.homeTeamId : match.awayTeamId;
        const halfPoints = resultPoints(side === 'home' ? half[0] : half[1], side === 'home' ? half[1] : half[0]);
        const finalPoints = resultPoints(side === 'home' ? match.homeScore : match.awayScore, side === 'home' ? match.awayScore : match.homeScore);
        const row = swings.get(teamId) ?? { recovered: 0, lost: 0 };
        if (finalPoints > halfPoints) row.recovered += finalPoints - halfPoints;
        if (finalPoints < halfPoints) row.lost += halfPoints - finalPoints;
        swings.set(teamId, row);
      }
    }

    // Golos, assistências e minutos contados nos mesmos jogos, para o rácio por
    // 90 minutos não misturar jornadas com e sem escalação oficial publicada.
    const playerRates = seasonId === UPCOMING_SEASON_ID ? getCurrentSeasonPer90() : [];

    const cleanSheets = seasonId === UPCOMING_SEASON_ID
      ? getCurrentSeasonCleanSheets().map((row) => ({ ...row, percentage: row.appearances ? (row.cleanSheets / row.appearances) * 100 : 0 }))
      : [];

    const goalHauls = seasonId === UPCOMING_SEASON_ID ? getCurrentSeasonGoalHauls() : [];

    return { finished, teamMetrics, roundMetrics, evolution, goalIntervals, referees, attendanceTeams, attendanceStadiums, swings, playerRates, cleanSheets, goalHauls };
  }, [seasonId]);

  if (analytics.finished.length === 0) return null;
  const maxGoals = Math.max(1, ...analytics.goalIntervals.map((row) => row.goals));
  const swingRows = [...analytics.swings.entries()].map(([teamId, row]) => ({ teamId, ...row }))
    .filter((row) => row.recovered || row.lost).sort((a, b) => b.recovered - a.recovered || b.lost - a.lost);

  return (
    <section className="mt-14 space-y-6" aria-labelledby="advanced-statistics-title">
      {seasonId === UPCOMING_SEASON_ID && (
        <SeasonBenchmarkCard currentMatches={getMatchesForSeason(seasonId)} />
      )}

      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent">12 indicadores automáticos</p>
        <h2 id="advanced-statistics-title" className="mt-2 font-display text-2xl font-black uppercase text-foreground">
          {seasonId === UPCOMING_SEASON_ID ? 'Análise avançada da época em curso' : 'Análise consolidada da época 2025/2026 (Métrica Base)'}
        </h2>
        <p className="mt-2 max-w-3xl text-xs text-zinc-500">
          {seasonId === UPCOMING_SEASON_ID
            ? 'Calculada apenas com jogos terminados e informação oficialmente disponível.'
            : 'Consolidado estatístico oficial da temporada 2025/2026 (240 partidas). Padrão oficial ANCAF.'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analytics.teamMetrics.slice(0, 4).map((team) => (
          <AnimatedCard key={team.teamId} variant="hud" className="p-5">
            <p className="truncate text-xs font-bold uppercase text-foreground">{team.teamName}</p>
            <p className="mt-3 text-3xl font-black text-accent">{team.efficiency.toFixed(1)}%</p>
            <p className="text-[9px] font-mono uppercase text-zinc-500">Aproveitamento</p>
            <p className="mt-3 text-[10px] text-zinc-500">Forma: {team.form.map((item) => item === 'W' ? 'V' : item === 'D' ? 'E' : 'D').join(' · ') || '—'}</p>
            <p className="mt-1 text-[10px] text-zinc-500">Médias: {team.goalsForAverage.toFixed(2)} marcados · {team.goalsAgainstAverage.toFixed(2)} sofridos</p>
          </AnimatedCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Rendimento individual por 90'" icon={<TrendingUp size={16} />}>
          <Table
            headers={['Jogador', 'G+A', 'Minutos', 'G/90', 'A/90']}
            rows={analytics.playerRates.slice(0, 8).map((row) => [row.name, String(row.contributions), `${row.minutesPlayed}'`, row.goalsPer90.toFixed(2), row.assistsPer90.toFixed(2)])}
            empty="Aguardam-se fichas com escalação e substituições oficiais."
          />
        </Panel>
        <Panel title="Balizas limpas" icon={<ShieldCheck size={16} />}>
          <Table headers={['Guarda-redes', 'Jogos', 'Sem sofrer', '%']} rows={analytics.cleanSheets.slice(0, 8).map((row) => [row.name, String(row.appearances), String(row.cleanSheets), `${row.percentage.toFixed(1)}%`])} empty="Aguardam-se escalações oficiais suficientes." />
        </Panel>
        <Panel title="Golos múltiplos no mesmo jogo" icon={<Activity size={16} />}>
          <Table
            headers={['Jogador', '2 · Doblete', '3 · Hat-trick', '4 · Poker', '5 · Manita', 'Mais de 5']}
            rows={analytics.goalHauls.slice(0, 8).map((row) => [row.name, String(row.braces), String(row.hatTricks), String(row.pokers), String(row.manitas), String(row.overFive)])}
            empty="Nenhum jogador marcou duas ou mais vezes no mesmo jogo oficial."
          />
        </Panel>
        <Panel title="Estatísticas por jornada" icon={<BarChart3 size={16} />}>
          <Table headers={['Jornada', 'Jogos', 'Golos', 'Média']} rows={analytics.roundMetrics.map((row) => [`J${row.round}`, String(row.matches), String(row.goals), row.average.toFixed(2)])} />
        </Panel>
        <Panel title="Evolução da liderança" icon={<Activity size={16} />}>
          <Table headers={['Jornada', '1.º', '2.º', '3.º']} rows={analytics.evolution.map((row) => [`J${row.round}`, ...row.leaders.map((team) => team.teamName)])} />
        </Panel>
        <Panel title="Golos por intervalo" icon={<Clock3 size={16} />}>
          <div className="space-y-3">{analytics.goalIntervals.map((row) => <div key={row.label}><div className="mb-1 flex justify-between text-[10px] font-mono"><span>{row.label}</span><span>{row.goals}</span></div><div className="h-2 rounded bg-zinc-200 dark:bg-zinc-800"><div className="h-2 rounded bg-primary" style={{ width: `${(row.goals / maxGoals) * 100}%` }} /></div></div>)}</div>
        </Panel>
        <Panel title="Arbitragem e disciplina" icon={<ShieldCheck size={16} />}>
          <Table headers={['Árbitro', 'Jogos', 'Amarelos', 'Vermelhos']} rows={analytics.referees.slice(0, 8).map((row) => [row.name, String(row.matches), String(row.yellow), String(row.red)])} empty="Sem nomeações oficiais suficientes." />
        </Panel>
        <Panel title="Público por clube e estádio" icon={<Users size={16} />}>
          <Table headers={['Clube anfitrião', 'Total', 'Média']} rows={analytics.attendanceTeams.slice(0, 4).map((row) => [row.label, row.total.toLocaleString('pt-AO'), Math.round(row.average).toLocaleString('pt-AO')])} empty="Assistências ainda não publicadas." />
          {analytics.attendanceStadiums[0] && <p className="mt-4 text-[10px] text-zinc-500">Estádio com maior total: <strong className="text-foreground">{analytics.attendanceStadiums[0].label}</strong> · {analytics.attendanceStadiums[0].total.toLocaleString('pt-AO')}</p>}
        </Panel>
        <Panel title="Pontos recuperados e perdidos" icon={<TrendingUp size={16} />}>
          <Table headers={['Equipa', 'Recuperados', 'Perdidos']} rows={swingRows.slice(0, 8).map((row) => [getTeamFullName(row.teamId, row.teamId), String(row.recovered), String(row.lost)])} empty="Aguardam-se resultados oficiais ao intervalo." />
        </Panel>
      </div>
    </section>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <AnimatedCard variant="hud" className="p-6"><h3 className="mb-5 flex items-center gap-2 font-display text-sm uppercase text-foreground"><span className="text-accent">{icon}</span>{title}</h3>{children}</AnimatedCard>;
}

function Table({ headers, rows, empty = 'Sem dados oficiais disponíveis.' }: { headers: string[]; rows: string[][]; empty?: string }) {
  if (!rows.length) return <p className="text-xs text-zinc-500">{empty}</p>;
  return <div className="overflow-x-auto"><table className="w-full min-w-[420px] text-left text-[10px]"><thead><tr className="border-b border-zinc-200 font-mono uppercase text-zinc-500 dark:border-zinc-800">{headers.map((header) => <th key={header} className="pb-2 pr-3">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row[0]}-${index}`} className="border-b border-zinc-200/60 dark:border-zinc-800/60">{row.map((cell, cellIndex) => <td key={`${cellIndex}-${cell}`} className={`py-2.5 pr-3 ${cellIndex === 0 ? 'font-semibold text-foreground' : 'font-mono text-zinc-500'}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
