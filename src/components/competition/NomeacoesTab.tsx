'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Flag, Info } from 'lucide-react';
import { getRefereeNominations, getTeamById } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';

const ANGOLA_TIME_ZONE = 'Africa/Luanda';

export default function NomeacoesTab({ seasonId }: { seasonId: string }) {
  const nominations = useMemo(() => getRefereeNominations(seasonId), [seasonId]);
  const rounds = useMemo(
    () => Array.from(new Set(nominations.map((n) => n.round))).sort((a, b) => a - b),
    [nominations],
  );
  const [selectedRound, setSelectedRound] = useState<number>(rounds[0] ?? 1);

  const roundNominations = nominations.filter((n) => n.round === (rounds.includes(selectedRound) ? selectedRound : rounds[0]));

  if (nominations.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-500 font-mono">Ainda não há nomeações publicadas para esta época.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seletor de jornada */}
      <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider sm:w-20 flex-shrink-0">Jornada</span>
          <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {rounds.map((round) => (
              <button
                key={round}
                onClick={() => setSelectedRound(round)}
                className={`snap-start px-3 py-1.5 rounded-lg text-xs font-semibold font-mono whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedRound === round
                    ? 'bg-accent text-black'
                    : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-foreground border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                J{round}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabela de nomeações da jornada */}
        <div className="lg:col-span-2">
          <AnimatedCard variant="hud" className="p-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-900/40 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="py-4 px-4">Jogo</th>
                  <th className="py-4 px-3">Árbitro Principal</th>
                  <th className="py-4 px-3 hidden md:table-cell">Assistentes</th>
                  <th className="py-4 px-3 hidden sm:table-cell">4.º Árbitro</th>
                  <th className="py-4 px-3 text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900/60">
                {roundNominations.map((n) => {
                  const formattedDate = n.scheduleStatus === 'to_be_defined' ? 'Por definir' : new Date(n.date).toLocaleDateString('pt-AO', {
                    day: '2-digit', month: 'short',
                    timeZone: ANGOLA_TIME_ZONE,
                  });
                  return (
                    <tr key={n.matchId} className="hover:bg-zinc-100 dark:hover:bg-zinc-900/20 transition-colors">
                      <td className="py-4 px-4">
                        <Link href={`/matches/${n.matchId}`} className="flex items-center gap-2 group">
                          <TeamCrest teamId={n.homeTeamId} size={22} className="flex-shrink-0" />
                          <span className="text-[10px] font-mono text-zinc-500">vs</span>
                          <TeamCrest teamId={n.awayTeamId} size={22} className="flex-shrink-0" />
                          <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate hidden sm:inline">
                            {getTeamById(n.homeTeamId)?.shortName ?? n.homeTeam} — {getTeamById(n.awayTeamId)?.shortName ?? n.awayTeam}
                          </span>
                        </Link>
                      </td>
                      <td className="py-4 px-3">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Flag size={11} className="text-accent flex-shrink-0" />
                          {n.officials.referee}
                        </span>
                      </td>
                      <td className="py-4 px-3 hidden md:table-cell">
                        <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                          {n.officials.assistants[0]} · {n.officials.assistants[1]}
                        </span>
                      </td>
                      <td className="py-4 px-3 hidden sm:table-cell">
                        <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">{n.officials.fourth}</span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <span className="text-[11px] font-mono text-zinc-500 uppercase">{formattedDate}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </AnimatedCard>
        </div>

        {/* Nota institucional */}
        <div>
          <AnimatedCard variant="hud" className="p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Info size={16} className="text-accent" /> Nomeações de Arbitragem
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              As equipas de arbitragem de cada jornada são nomeadas pelo Conselho de Arbitragem da FAF
              e publicadas antes de cada ronda da Liga Unitel Girabola. Cada nomeação inclui o árbitro
              principal, os dois árbitros assistentes e o quarto árbitro.
            </p>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
