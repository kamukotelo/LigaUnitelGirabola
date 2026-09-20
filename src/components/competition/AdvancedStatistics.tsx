'use client';

import { useMemo } from 'react';
import { Activity, BarChart3, Clock3, Home, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';
import {
  buildOfficialNameCanonicalizer,
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

/**
 * Minutos mínimos para entrar no ranking por 90'. Sem este corte, um suplente
 * com um golo em 45 minutos aparecia no topo com 2,00 G/90 — à frente de quem
 * marca todas as jornadas. Corresponde a dois jogos completos.
 */
const PER90_MIN_MINUTES = 180;

function scoreAtHalfTime(match: Match): [number, number] | null {
  const parts = match.halfTimeScore?.match(/^(\d+)\s*[-–:]\s*(\d+)$/);
  return parts ? [Number(parts[1]), Number(parts[2])] : null;
}

function resultPoints(gf: number, ga: number) {
  return gf > ga ? 3 : gf === ga ? 1 : 0;
}

export default function AdvancedStatistics({ seasonId, teamId }: { seasonId: string; teamId?: string }) {
  const analytics = useMemo(() => {
    const seasonFinished = getMatchesForSeason(seasonId).filter((match) => match.status === 'finished');
    // Com um clube selecionado, cada painel passa a ler apenas os jogos desse
    // clube. A classificação, essa, continua a ser calculada sobre a prova
    // inteira — é a única forma de a posição e o aproveitamento serem reais.
    const finished = teamId
      ? seasonFinished.filter((match) => match.homeTeamId === teamId || match.awayTeamId === teamId)
      : seasonFinished;

    const standings = computeStandings(seasonFinished);
    const allTeamMetrics = standings.map((row) => ({
      ...row,
      efficiency: row.played ? (row.points / (row.played * 3)) * 100 : 0,
      goalsForAverage: row.played ? row.goalsFor / row.played : 0,
      goalsAgainstAverage: row.played ? row.goalsAgainst / row.played : 0,
    }));
    const teamMetrics = teamId
      ? allTeamMetrics.filter((row) => row.teamId === teamId)
      : allTeamMetrics.slice(0, 4);

    const rounds = [...new Set(finished.map((match) => match.round))].sort((a, b) => a - b);
    const roundMetrics = rounds.map((round) => {
      const matches = finished.filter((match) => match.round === round);
      const goals = matches.reduce((sum, match) => sum + match.homeScore + match.awayScore, 0);
      return { round, matches: matches.length, goals, average: matches.length ? goals / matches.length : 0 };
    });

    // Sem clube: pódio por jornada. Com clube: a posição desse clube jornada a
    // jornada, que é a leitura útil de um percurso individual.
    const evolution = rounds.map((round) => {
      const table = computeStandings(seasonFinished.filter((match) => match.round <= round));
      if (!teamId) return { round, leaders: table.slice(0, 3).map((team) => team.teamName) };
      const index = table.findIndex((team) => team.teamId === teamId);
      const row = index >= 0 ? table[index] : undefined;
      return {
        round,
        leaders: row ? [`${index + 1}.º`, `${row.points} pts`, `${row.goalsFor}:${row.goalsAgainst}`] : ['—', '—', '—'],
      };
    });

    // Com clube, separa-se o que marcou do que sofreu em cada intervalo.
    const intervalLabels = ['0–15', '16–30', '31–45+', '46–60', '61–75', '76–90+'];
    const goalIntervals = intervalLabels.map((label) => ({ label, goals: 0, conceded: 0 }));
    for (const match of finished.filter(hasPublishedMatchEvents)) {
      for (const event of getMatchDetail(match).events) {
        if (event.type !== 'goal' || event.minute === undefined) continue;
        const minute = Math.max(1, event.minute);
        const index = minute <= 15 ? 0 : minute <= 30 ? 1 : minute <= 45 ? 2 : minute <= 60 ? 3 : minute <= 75 ? 4 : 5;
        const scorerTeam = event.team === 'home' ? match.homeTeamId : match.awayTeamId;
        if (teamId && scorerTeam !== teamId) goalIntervals[index].conceded += 1;
        else goalIntervals[index].goals += 1;
      }
    }

    // As fichas publicam por vezes o mesmo árbitro abreviado ou com outra
    // grafia; sem normalizar, a mesma pessoa ocupava duas linhas da tabela.
    const canonicalReferee = buildOfficialNameCanonicalizer(
      finished.map((match) => getMatchOfficials(match).referee).filter((name) => name && name !== 'A definir'),
    );
    const refereeMap = new Map<string, { matches: number; yellow: number; red: number }>();
    for (const match of finished) {
      const referee = getMatchOfficials(match).referee;
      if (!referee || referee === 'A definir') continue;
      const name = canonicalReferee(referee);
      const detail = getMatchDetail(match);
      const official = new Set(detail.officialStatKeys);
      const row = refereeMap.get(name) ?? { matches: 0, yellow: 0, red: 0 };
      row.matches += 1;
      if (official.has('yellowCards')) row.yellow += detail.homeStats.yellowCards + detail.awayStats.yellowCards;
      if (official.has('redCards')) row.red += detail.homeStats.redCards + detail.awayStats.redCards;
      refereeMap.set(name, row);
    }
    const referees = [...refereeMap.entries()]
      .map(([name, values]) => ({ name, ...values }))
      .sort((a, b) => b.matches - a.matches || b.yellow + b.red - (a.yellow + a.red));

    const attendanceMatches = finished.filter((match) => typeof match.attendance === 'number' && match.attendance > 0);
    const attendanceByTeam = new Map<string, { total: number; matches: number }>();
    const attendanceByStadium = new Map<string, { total: number; matches: number }>();
    for (const match of attendanceMatches) {
      // Só o anfitrião responde pela assistência; com clube selecionado isso
      // significa apenas os jogos em casa.
      if (teamId && match.homeTeamId !== teamId) continue;
      const team = attendanceByTeam.get(match.homeTeamId) ?? { total: 0, matches: 0 };
      team.total += match.attendance!; team.matches += 1; attendanceByTeam.set(match.homeTeamId, team);
      const stadium = attendanceByStadium.get(match.stadium) ?? { total: 0, matches: 0 };
      stadium.total += match.attendance!; stadium.matches += 1; attendanceByStadium.set(match.stadium, stadium);
    }
    const attendanceTeams = [...attendanceByTeam.entries()].map(([id, row]) => ({
      label: getTeamFullName(id, id), total: row.total, average: row.total / row.matches,
    })).sort((a, b) => b.total - a.total);
    const attendanceStadiums = [...attendanceByStadium.entries()].map(([label, row]) => ({
      label, total: row.total, average: row.total / row.matches,
    })).sort((a, b) => b.total - a.total);

    const swings = new Map<string, { recovered: number; lost: number }>();
    for (const match of finished) {
      const half = scoreAtHalfTime(match);
      if (!half) continue;
      for (const side of ['home', 'away'] as const) {
        const sideTeam = side === 'home' ? match.homeTeamId : match.awayTeamId;
        if (teamId && sideTeam !== teamId) continue;
        const halfPoints = resultPoints(side === 'home' ? half[0] : half[1], side === 'home' ? half[1] : half[0]);
        const finalPoints = resultPoints(side === 'home' ? match.homeScore : match.awayScore, side === 'home' ? match.awayScore : match.homeScore);
        const row = swings.get(sideTeam) ?? { recovered: 0, lost: 0 };
        if (finalPoints > halfPoints) row.recovered += finalPoints - halfPoints;
        if (finalPoints < halfPoints) row.lost += halfPoints - finalPoints;
        swings.set(sideTeam, row);
      }
    }

    // Golos, assistências e minutos contados nos mesmos jogos, para o rácio por
    // 90 minutos não misturar jornadas com e sem escalação oficial publicada.
    const isCurrent = seasonId === UPCOMING_SEASON_ID;
    const byTeam = <T extends { teamId: string }>(rows: T[]) => (teamId ? rows.filter((row) => row.teamId === teamId) : rows);

    const playerRates = isCurrent
      ? byTeam(getCurrentSeasonPer90()).filter((row) => row.minutesPlayed >= PER90_MIN_MINUTES)
      : [];

    const cleanSheets = isCurrent
      ? byTeam(getCurrentSeasonCleanSheets())
        .filter((row) => row.cleanSheets > 0)
        .map((row) => ({ ...row, percentage: row.appearances ? (row.cleanSheets / row.appearances) * 100 : 0 }))
      : [];

    const goalHauls = isCurrent ? byTeam(getCurrentSeasonGoalHauls()) : [];

    // Dossiê do clube: casa/fora, extremos e ritmo de golo, tudo derivado dos
    // mesmos jogos terminados que alimentam os painéis acima.
    const clubDossier = (() => {
      if (!teamId) return null;
      const split = (venue: 'home' | 'away' | 'all') => {
        const rows = finished.filter((match) => venue === 'all'
          || (venue === 'home' ? match.homeTeamId === teamId : match.awayTeamId === teamId));
        let won = 0, drawn = 0, lost = 0, scored = 0, conceded = 0;
        for (const match of rows) {
          const isHome = match.homeTeamId === teamId;
          const gf = isHome ? match.homeScore : match.awayScore;
          const ga = isHome ? match.awayScore : match.homeScore;
          scored += gf; conceded += ga;
          if (gf > ga) won += 1; else if (gf === ga) drawn += 1; else lost += 1;
        }
        const played = rows.length;
        return {
          played, won, drawn, lost, scored, conceded,
          points: won * 3 + drawn,
          efficiency: played ? ((won * 3 + drawn) / (played * 3)) * 100 : 0,
        };
      };

      const margins = finished.map((match) => {
        const isHome = match.homeTeamId === teamId;
        const gf = isHome ? match.homeScore : match.awayScore;
        const ga = isHome ? match.awayScore : match.homeScore;
        const opponent = getTeamFullName(isHome ? match.awayTeamId : match.homeTeamId, '');
        return { round: match.round, gf, ga, diff: gf - ga, opponent, venue: isHome ? 'casa' : 'fora' };
      });
      const best = margins.reduce<typeof margins[number] | null>((top, row) => (!top || row.diff > top.diff || (row.diff === top.diff && row.gf > top.gf) ? row : top), null);
      const worst = margins.reduce<typeof margins[number] | null>((low, row) => (!low || row.diff < low.diff || (row.diff === low.diff && row.ga > low.ga) ? row : low), null);

      let yellow = 0, red = 0, cardMatches = 0;
      for (const match of finished) {
        const detail = getMatchDetail(match);
        if (!detail.officialStatKeys.includes('yellowCards')) continue;
        cardMatches += 1;
        const side = match.homeTeamId === teamId ? detail.homeStats : detail.awayStats;
        yellow += side.yellowCards ?? 0;
        red += side.redCards ?? 0;
      }

      const all = split('all');
      return {
        all,
        home: split('home'),
        away: split('away'),
        best,
        worst,
        yellow,
        red,
        cardMatches,
        scoredIn: finished.filter((match) => (match.homeTeamId === teamId ? match.homeScore : match.awayScore) > 0).length,
        cleanSheetMatches: finished.filter((match) => (match.homeTeamId === teamId ? match.awayScore : match.homeScore) === 0).length,
        position: standings.findIndex((row) => row.teamId === teamId) + 1,
        tableSize: standings.length,
      };
    })();

    return { finished, teamMetrics, roundMetrics, evolution, goalIntervals, referees, attendanceTeams, attendanceStadiums, swings, playerRates, cleanSheets, goalHauls, clubDossier };
  }, [seasonId, teamId]);

  if (analytics.finished.length === 0) {
    if (!teamId) return null;
    return (
      <section className="mt-14">
        <AnimatedCard variant="hud" className="p-6">
          <p className="text-xs text-zinc-500">
            {getTeamFullName(teamId, teamId)} ainda não tem jogos terminados nesta época — a análise avançada fica disponível após a primeira partida.
          </p>
        </AnimatedCard>
      </section>
    );
  }

  const maxGoals = Math.max(1, ...analytics.goalIntervals.flatMap((row) => [row.goals, row.conceded]));
  const swingRows = [...analytics.swings.entries()].map(([id, row]) => ({ teamId: id, ...row }))
    .filter((row) => row.recovered || row.lost).sort((a, b) => b.recovered - a.recovered || b.lost - a.lost);
  const dossier = analytics.clubDossier;
  const teamName = teamId ? getTeamFullName(teamId, teamId) : null;

  return (
    <section className="mt-14 space-y-6" aria-labelledby="advanced-statistics-title">
      {seasonId === UPCOMING_SEASON_ID && !teamId && (
        <SeasonBenchmarkCard currentMatches={getMatchesForSeason(seasonId)} />
      )}

      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
          {teamName ? `Análise por clube · ${analytics.finished.length} jogos` : '12 indicadores automáticos'}
        </p>
        <h2 id="advanced-statistics-title" className="mt-2 font-display text-2xl font-black uppercase text-foreground">
          {teamName
            ? `${teamName} — análise avançada`
            : seasonId === UPCOMING_SEASON_ID ? 'Análise avançada da época em curso' : 'Análise consolidada da época 2025/2026 (Métrica Base)'}
        </h2>
        <p className="mt-2 max-w-3xl text-xs text-zinc-500">
          {teamName
            ? 'Todos os painéis abaixo estão restritos a este clube, calculados apenas com jogos terminados e informação oficialmente publicada.'
            : seasonId === UPCOMING_SEASON_ID
              ? 'Calculada apenas com jogos terminados e informação oficialmente disponível.'
              : 'Consolidado estatístico oficial da temporada 2025/2026 (240 partidas). Padrão oficial ANCAF.'}
        </p>
      </div>

      {dossier && teamId && (
        <AnimatedCard variant="hud" className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <TeamCrest teamId={teamId} size={44} />
            <div>
              <h3 className="font-display text-sm uppercase text-foreground">Dossiê do clube</h3>
              <p className="text-[10px] font-mono text-zinc-500">
                {dossier.position > 0 ? `${dossier.position}.º de ${dossier.tableSize} na classificação` : 'Sem posição apurada'} ·
                {' '}{dossier.all.points} pts em {dossier.all.played} jogos · Aproveitamento {dossier.all.efficiency.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Casa" value={`${dossier.home.won}V ${dossier.home.drawn}E ${dossier.home.lost}D`} hint={`${dossier.home.scored}:${dossier.home.conceded} golos · ${dossier.home.efficiency.toFixed(0)}%`} icon={<Home size={14} />} />
            <Metric label="Fora" value={`${dossier.away.won}V ${dossier.away.drawn}E ${dossier.away.lost}D`} hint={`${dossier.away.scored}:${dossier.away.conceded} golos · ${dossier.away.efficiency.toFixed(0)}%`} icon={<Activity size={14} />} />
            <Metric
              label="Ritmo de golo"
              value={`${(dossier.all.played ? dossier.all.scored / dossier.all.played : 0).toFixed(2)} marcados/j`}
              hint={`${(dossier.all.played ? dossier.all.conceded / dossier.all.played : 0).toFixed(2)} sofridos/j · marcou em ${dossier.scoredIn} de ${dossier.all.played}`}
              icon={<TrendingUp size={14} />}
            />
            <Metric
              label="Disciplina"
              value={dossier.cardMatches ? `${dossier.yellow} 🟨 · ${dossier.red} 🟥` : 'Sem súmula'}
              hint={dossier.cardMatches ? `${(dossier.yellow / dossier.cardMatches).toFixed(2)} amarelos/jogo · ${dossier.cardMatches} fichas` : 'Nenhuma ficha disciplinar publicada'}
              icon={<ShieldCheck size={14} />}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Metric label="Baliza a zero" value={`${dossier.cleanSheetMatches} jogos`} hint={`${dossier.all.played ? ((dossier.cleanSheetMatches / dossier.all.played) * 100).toFixed(0) : 0}% dos jogos terminados`} icon={<ShieldCheck size={14} />} />
            <Metric
              label="Melhor resultado"
              value={dossier.best ? `${dossier.best.gf}-${dossier.best.ga}` : '—'}
              hint={dossier.best ? `J${dossier.best.round} ${dossier.best.venue} · ${dossier.best.opponent}` : 'Sem jogos terminados'}
              icon={<TrendingUp size={14} />}
            />
            <Metric
              label="Pior resultado"
              value={dossier.worst ? `${dossier.worst.gf}-${dossier.worst.ga}` : '—'}
              hint={dossier.worst ? `J${dossier.worst.round} ${dossier.worst.venue} · ${dossier.worst.opponent}` : 'Sem jogos terminados'}
              icon={<Activity size={14} />}
            />
          </div>
        </AnimatedCard>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analytics.teamMetrics.map((team) => (
          <AnimatedCard key={team.teamId} variant="hud" className="p-5">
            <p className="truncate text-xs font-bold uppercase text-foreground">{team.teamName}</p>
            <p className="mt-3 text-3xl font-black text-accent">{team.efficiency.toFixed(1)}%</p>
            <p className="text-[11px] sm:text-[9px] font-mono uppercase text-zinc-500">Aproveitamento</p>
            <p className="mt-3 text-[10px] text-zinc-500">Forma: {team.form.map((item) => item === 'W' ? 'V' : item === 'D' ? 'E' : 'D').join(' · ') || '—'}</p>
            <p className="mt-1 text-[10px] text-zinc-500">Médias: {team.goalsForAverage.toFixed(2)} marcados · {team.goalsAgainstAverage.toFixed(2)} sofridos</p>
          </AnimatedCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={`Rendimento individual por 90' (mín. ${PER90_MIN_MINUTES}')`} icon={<TrendingUp size={16} />}>
          <Table
            headers={['Jogador', 'G+A', 'Minutos', 'G/90', 'A/90']}
            rows={analytics.playerRates.slice(0, 8).map((row) => [row.name, String(row.contributions), `${row.minutesPlayed}'`, row.goalsPer90.toFixed(2), row.assistsPer90.toFixed(2)])}
            empty={`Nenhum atleta com ${PER90_MIN_MINUTES} minutos reconstruídos a partir de fichas com escalação e substituições oficiais.`}
          />
        </Panel>
        <Panel title="Balizas limpas" icon={<ShieldCheck size={16} />}>
          <Table headers={['Guarda-redes', 'Jogos', 'Sem sofrer', '%']} rows={analytics.cleanSheets.slice(0, 8).map((row) => [row.name, String(row.appearances), String(row.cleanSheets), `${row.percentage.toFixed(1)}%`])} empty="Ainda sem balizas invioladas em jogos com escalação oficial." />
        </Panel>
        <Panel title="Golos múltiplos no mesmo jogo" icon={<Activity size={16} />}>
          <Table
            headers={['Jogador', '2 · Doblete', '3 · Hat-trick', '4 · Poker', '5 · Manita', 'Mais de 5']}
            rows={analytics.goalHauls.slice(0, 8).map((row) => [row.name, String(row.braces), String(row.hatTricks), String(row.pokers), String(row.manitas), String(row.overFive)])}
            empty="Nenhum jogador marcou duas ou mais vezes no mesmo jogo oficial."
          />
        </Panel>
        <Panel title={teamName ? 'Percurso jornada a jornada' : 'Estatísticas por jornada'} icon={<BarChart3 size={16} />}>
          <Table headers={['Jornada', 'Jogos', 'Golos', 'Média']} rows={analytics.roundMetrics.map((row) => [`J${row.round}`, String(row.matches), String(row.goals), row.average.toFixed(2)])} />
        </Panel>
        <Panel title={teamName ? 'Evolução na classificação' : 'Evolução da liderança'} icon={<Activity size={16} />}>
          <Table
            headers={teamName ? ['Jornada', 'Posição', 'Pontos', 'Golos'] : ['Jornada', '1.º', '2.º', '3.º']}
            rows={analytics.evolution.map((row) => [`J${row.round}`, ...row.leaders])}
          />
        </Panel>
        <Panel title={teamName ? 'Golos por intervalo (marcados e sofridos)' : 'Golos por intervalo'} icon={<Clock3 size={16} />}>
          <div className="space-y-3">
            {analytics.goalIntervals.map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex justify-between text-[10px] font-mono">
                  <span>{row.label}</span>
                  <span>{teamName ? `${row.goals} marcados · ${row.conceded} sofridos` : row.goals}</span>
                </div>
                <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-800"><div className="h-2 rounded bg-primary" style={{ width: `${(row.goals / maxGoals) * 100}%` }} /></div>
                {teamName && (
                  <div className="mt-1 h-2 rounded bg-zinc-200 dark:bg-zinc-800"><div className="h-2 rounded bg-rose-500/70" style={{ width: `${(row.conceded / maxGoals) * 100}%` }} /></div>
                )}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title={teamName ? 'Arbitragem dos jogos do clube' : 'Arbitragem e disciplina'} icon={<ShieldCheck size={16} />}>
          <Table headers={['Árbitro', 'Jogos', 'Amarelos', 'Vermelhos']} rows={analytics.referees.slice(0, 8).map((row) => [row.name, String(row.matches), String(row.yellow), String(row.red)])} empty="Sem nomeações oficiais suficientes." />
        </Panel>
        <Panel title={teamName ? 'Público em casa' : 'Público por clube e estádio'} icon={<Users size={16} />}>
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

function Metric({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
      <p className="flex items-center gap-1.5 text-[11px] sm:text-[9px] font-mono uppercase tracking-wide sm:tracking-wider text-zinc-500"><span className="text-accent">{icon}</span>{label}</p>
      <p className="mt-2 font-display text-lg font-black text-foreground">{value}</p>
      <p className="mt-1 text-[10px] font-mono text-zinc-500">{hint}</p>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <AnimatedCard variant="hud" className="p-6"><h3 className="mb-5 flex items-center gap-2 font-display text-sm uppercase text-foreground"><span className="text-accent">{icon}</span>{title}</h3>{children}</AnimatedCard>;
}

function Table({ headers, rows, empty = 'Sem dados oficiais disponíveis.' }: { headers: string[]; rows: string[][]; empty?: string }) {
  if (!rows.length) return <p className="text-xs text-zinc-500">{empty}</p>;
  return <div className="overflow-x-auto"><table className="w-full min-w-[420px] text-left text-[10px]"><thead><tr className="border-b border-zinc-200 font-mono uppercase text-zinc-500 dark:border-zinc-800">{headers.map((header) => <th key={header} className="pb-2 pr-3">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row[0]}-${index}`} className="border-b border-zinc-200/60 dark:border-zinc-800/60">{row.map((cell, cellIndex) => <td key={`${cellIndex}-${cell}`} className={`py-2.5 pr-3 ${cellIndex === 0 ? 'font-semibold text-foreground' : 'font-mono text-zinc-500'}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
