'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Timer, Info, TrendingUp } from 'lucide-react';
import { getMatchTempoUtil, getTeamById, Match } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';
import { useOfficialCalendar } from '@/lib/use-official-calendar';

interface TempoUtilRow {
  match: Match;
  tempoUtil: number;
}

export default function TempoUtilTab({ seasonId }: { seasonId: string }) {
  const { matches } = useOfficialCalendar(seasonId);

  const rows: TempoUtilRow[] = matches
    .map((m) => ({ match: m, tempoUtil: getMatchTempoUtil(m) }))
    .filter((r): r is TempoUtilRow => r.tempoUtil !== null);

  if (rows.length === 0) {
    return (
      <div className="text-center py-16 max-w-xl mx-auto">
        <Timer size={32} className="mx-auto text-zinc-500 mb-4" />
        <h3 className="font-display text-foreground uppercase text-lg tracking-wider">Sem jogos disputados</h3>
        <p className="text-xs text-zinc-500 font-mono mt-2">
          O Tempo Útil (tempo efetivo de jogo) será calculado e publicado jornada a jornada assim que a época começar.
        </p>
      </div>
    );
  }

  const seasonAvg = rows.reduce((s, r) => s + r.tempoUtil, 0) / rows.length;
  const best = [...rows].sort((a, b) => b.tempoUtil - a.tempoUtil)[0];
  const worst = [...rows].sort((a, b) => a.tempoUtil - b.tempoUtil)[0];

  // Média por jornada
  const byRound = Array.from(
    rows.reduce((map, r) => {
      const list = map.get(r.match.round) ?? [];
      list.push(r.tempoUtil);
      map.set(r.match.round, list);
      return map;
    }, new Map<number, number[]>()).entries(),
  )
    .map(([round, list]) => ({ round, avg: list.reduce((a, b) => a + b, 0) / list.length }))
    .sort((a, b) => a.round - b.round);

  const maxRoundAvg = Math.max(...byRound.map((r) => r.avg));

  const topMatches = [...rows].sort((a, b) => b.tempoUtil - a.tempoUtil).slice(0, 10);

  const summary = [
    { label: 'Média da Época', value: `${seasonAvg.toFixed(1)}′` },
    { label: 'Jogo Mais Corrido', value: `${best.tempoUtil}′` },
    { label: 'Jogo Menos Corrido', value: `${worst.tempoUtil}′` },
    { label: 'Jogos Analisados', value: rows.length },
  ];

  return (
    <div className="space-y-8">
      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {summary.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Timer size={16} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl sm:text-2xl text-foreground font-black leading-none">{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1 truncate">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Média por jornada */}
        <div className="lg:col-span-2">
          <AnimatedCard variant="hud" className="p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
              <TrendingUp size={16} className="text-accent" /> Tempo Útil Médio por Jornada
            </h3>
            <div className="space-y-2.5">
              {byRound.map((r, i) => {
                const percent = Math.round((r.avg / maxRoundAvg) * 100);
                return (
                  <div key={r.round} className="flex items-center gap-3">
                    <span className="w-9 text-[10px] font-mono text-zinc-500 uppercase flex-shrink-0">J{r.round}</span>
                    <div className="flex-1 h-2.5 bg-white/80 dark:bg-zinc-900/80 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.02 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                    <span className="w-12 text-right text-xs font-mono font-bold text-foreground flex-shrink-0">{r.avg.toFixed(1)}′</span>
                  </div>
                );
              })}
            </div>
          </AnimatedCard>
        </div>

        {/* Ranking dos jogos mais corridos + nota metodológica */}
        <div className="space-y-6">
          <AnimatedCard variant="hud" className="p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Timer size={16} className="text-accent" /> Jogos Com Mais Tempo Útil
            </h3>
            <div className="space-y-3">
              {topMatches.map((r, idx) => (
                <Link key={r.match.id} href={`/matches/${r.match.id}`} className="flex items-center gap-2.5 group">
                  <span className={`w-5 text-center font-display font-black text-sm flex-shrink-0 ${idx === 0 ? 'text-accent' : 'text-zinc-600'}`}>{idx + 1}</span>
                  <TeamCrest teamId={r.match.homeTeamId} size={20} className="flex-shrink-0" />
                  <TeamCrest teamId={r.match.awayTeamId} size={20} className="flex-shrink-0" />
                  <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors truncate flex-1">
                    {getTeamById(r.match.homeTeamId)?.shortName ?? r.match.homeTeam} {r.match.score} {getTeamById(r.match.awayTeamId)?.shortName ?? r.match.awayTeam} · J{r.match.round}
                  </span>
                  <span className="text-xs font-mono font-bold text-foreground flex-shrink-0">{r.tempoUtil}′</span>
                </Link>
              ))}
            </div>
          </AnimatedCard>

          <AnimatedCard variant="hud" className="p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Info size={16} className="text-accent" /> O Que é o Tempo Útil?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              O Tempo Útil mede os minutos de bola efetivamente em jogo em cada partida, descontando paragens,
              substituições e faltas. É a métrica-padrão das ligas profissionais para avaliar o espetáculo:
              quanto maior o tempo útil, mais dinâmico foi o jogo.
            </p>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
