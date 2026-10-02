'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Scale,
  ArrowUpDown,
  Info,
  Award,
} from 'lucide-react';
import TeamCrest from '@/components/ui/TeamCrest';
import { computeDisciplineTable } from '@/lib/discipline-table';

interface DisciplineTableProps {
  seasonId: string;
}

export default function DisciplineTable({ seasonId }: DisciplineTableProps) {
  const [sortOrder, setSortOrder] = useState<'fairplay' | 'most_cards'>('fairplay');

  const summary = useMemo(() => computeDisciplineTable(seasonId, sortOrder), [seasonId, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Índice Disciplinar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Scale size={18} />
            </span>
            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-accent">
              Estatísticas Oficiais · Modelo zerozero / Liga Portugal
            </p>
          </div>
          <h2 className="mt-1 font-display text-xl sm:text-2xl font-black uppercase text-foreground">
            Classificação Geral do Índice Disciplinar
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Tabela de conduta disciplinar e Fair Play das equipas: 1 ponto por cartão amarelo,
            2 pontos por duplo amarelo e 3 pontos por cartão vermelho direto.
          </p>
        </div>

        {/* Alternador de Ordenação */}
        <div className="flex items-center gap-1 self-start sm:self-auto rounded-xl border border-zinc-200 bg-zinc-100/70 p-1 dark:border-zinc-800 dark:bg-zinc-950/70">
          <button
            onClick={() => setSortOrder('fairplay')}
            className={`flex min-h-10 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
              sortOrder === 'fairplay'
                ? 'bg-white text-emerald-700 shadow-xs dark:bg-zinc-800 dark:text-emerald-400'
                : 'text-zinc-600 hover:text-foreground dark:text-zinc-400'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Fair Play (Menos Pts)</span>
          </button>
          <button
            onClick={() => setSortOrder('most_cards')}
            className={`flex min-h-10 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all ${
              sortOrder === 'most_cards'
                ? 'bg-white text-rose-700 shadow-xs dark:bg-zinc-800 dark:text-rose-400'
                : 'text-zinc-600 hover:text-foreground dark:text-zinc-400'
            }`}
          >
            <ShieldAlert size={14} />
            <span>Mais Cartões</span>
          </button>
        </div>
      </div>

      {/* Mini-Cards de Destaque da Época */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Total de Cartões</span>
          <p className="mt-1 font-display text-2xl font-black text-foreground">{summary.totalCards}</p>
          <p className="mt-1 text-[11px] font-mono text-zinc-500">
            {summary.totalYellow} 🟨 · {summary.totalDoubleYellow} 🟨🟨 · {summary.totalDirectRed} 🟥
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs dark:border-zinc-800/80 dark:bg-zinc-950">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Média / Jogo</span>
          <p className="mt-1 font-display text-2xl font-black text-foreground">{summary.averageCardsPerMatch}</p>
          <p className="mt-1 text-[11px] font-mono text-zinc-500">cartões por partida realizada</p>
        </div>

        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-2xs dark:border-emerald-950 dark:bg-emerald-950/20">
          <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <Award size={12} /> Líder Fair Play
          </span>
          <p className="mt-1 font-display text-base font-black text-foreground truncate">
            {summary.mostDisciplined?.name ?? '—'}
          </p>
          <p className="mt-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
            {summary.mostDisciplined?.points ?? 0} pts · {summary.mostDisciplined?.pointsPerMatch ?? 0} pts/j
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-4 shadow-2xs dark:border-rose-950 dark:bg-rose-950/20">
          <span className="font-mono text-[10px] uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1">
            <ShieldAlert size={12} /> Mais Penalizada
          </span>
          <p className="mt-1 font-display text-base font-black text-foreground truncate">
            {summary.leastDisciplined?.name ?? '—'}
          </p>
          <p className="mt-1 text-[11px] font-mono text-rose-700 dark:text-rose-400 font-bold">
            {summary.leastDisciplined?.points ?? 0} pts · {summary.leastDisciplined?.pointsPerMatch ?? 0} pts/j
          </p>
        </div>
      </div>

      {/* Tabela do Índice Disciplinar */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/70 font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-900/40">
              <th className="py-3 pl-4 pr-2 text-center w-12">#</th>
              <th className="py-3 px-3">Equipa</th>
              <th className="py-3 px-2 text-center w-14" title="Jogos Disputados">J</th>
              <th className="py-3 px-2 text-center w-16" title="Cartões Amarelos (1 pt)">
                <span className="inline-flex items-center gap-1">
                  <span className="h-3 w-2 rounded-[1px] bg-amber-400 border border-amber-500" /> A
                </span>
              </th>
              <th className="py-3 px-2 text-center w-16" title="Duplos Amarelos (2 pts)">
                <span className="inline-flex items-center gap-0.5">
                  <span className="h-3 w-1.5 rounded-[1px] bg-amber-400 border border-amber-500" />
                  <span className="h-3 w-1.5 rounded-[1px] bg-amber-400 border border-amber-500" /> 2A
                </span>
              </th>
              <th className="py-3 px-2 text-center w-16" title="Vermelhos Diretos (3 pts)">
                <span className="inline-flex items-center gap-1">
                  <span className="h-3 w-2 rounded-[1px] bg-rose-600 border border-rose-700" /> VD
                </span>
              </th>
              <th className="py-3 px-2 text-center w-16 font-bold" title="Total de Cartões">Total</th>
              <th className="py-3 px-3 text-center w-24 bg-zinc-100/70 dark:bg-zinc-900/80 font-black text-foreground" title="Índice Disciplinar (Pontos)">
                Índice
              </th>
              <th className="py-3 pr-4 pl-2 text-center w-20" title="Média de Pontos por Jogo">Média/J</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
            {summary.rows.map((row, index) => {
              const isTopFairPlay = sortOrder === 'fairplay' && index < 3;
              return (
                <tr
                  key={row.teamId}
                  className="transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50"
                >
                  <td className="py-3 pl-4 pr-2 text-center font-mono">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                        isTopFairPlay
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'text-zinc-500'
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-semibold text-foreground">
                    <Link
                      href={`/teams/${row.teamId}`}
                      className="flex items-center gap-2.5 hover:text-accent transition-colors"
                    >
                      <TeamCrest teamId={row.teamId} size={24} className="shrink-0" />
                      <span className="truncate">{row.name}</span>
                    </Link>
                  </td>

                  <td className="py-3 px-2 text-center font-mono text-zinc-600 dark:text-zinc-400">
                    {row.played}
                  </td>

                  <td className="py-3 px-2 text-center font-mono text-amber-600 dark:text-amber-400 font-bold">
                    {row.yellow}
                  </td>

                  <td className="py-3 px-2 text-center font-mono text-amber-700 dark:text-amber-500 font-bold">
                    {row.doubleYellow}
                  </td>

                  <td className="py-3 px-2 text-center font-mono text-rose-600 dark:text-rose-400 font-bold">
                    {row.directRed}
                  </td>

                  <td className="py-3 px-2 text-center font-mono font-bold text-foreground">
                    {row.totalCards}
                  </td>

                  <td className="py-3 px-3 text-center font-mono font-black text-sm bg-zinc-100/50 dark:bg-zinc-900/60 text-foreground">
                    <span className="rounded-lg px-2 py-0.5 bg-zinc-200/70 dark:bg-zinc-800 text-foreground">
                      {row.points}
                    </span>
                  </td>

                  <td className="py-3 pr-4 pl-2 text-center font-mono text-zinc-500">
                    {row.pointsPerMatch.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rodapé explicativo do modelo regulamentar */}
      <div className="flex items-start gap-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-50/70 dark:bg-zinc-900/40 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
        <Info size={16} className="text-accent shrink-0 mt-0.5" />
        <p>
          <strong className="text-foreground">Regulamento do Índice Disciplinar (zerozero / Liga Portugal):</strong>{' '}
          Pontuação atribuída por sanção: Amarelo = 1 pt; 2.º Amarelo = 2 pts; Vermelho Direto = 3 pts. A ordenação
          oficial de Fair Play premeia a menor pontuação. Critérios de desempate: menor n.º de vermelhos diretos,
          menor n.º de duplos amarelos, menor n.º de amarelos e maior n.º de jogos realizados.
        </p>
      </div>
    </div>
  );
}
