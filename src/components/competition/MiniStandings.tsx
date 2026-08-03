'use client';

import Link from 'next/link';
import { getStandingsForSeason } from '@/lib/data';
import TeamCrest from '@/components/ui/TeamCrest';

// Mini-classificação lateral persistente (estilo Liga Angola): lista
// compacta de todos os clubes com jogos (J) e pontos (P), visível ao lado
// de qualquer aba do hub de competição.
export default function MiniStandings({ seasonId }: { seasonId: string }) {
  const standings = getStandingsForSeason(seasonId);

  return (
    <aside className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
      {/* Cabeçalho EQUIPA · J · P */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/60">
        <span className="flex-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500">Equipa</span>
        <span className="w-6 text-center text-[10px] font-mono uppercase tracking-widest text-zinc-500">J</span>
        <span className="w-6 text-center text-[10px] font-mono uppercase tracking-widest text-primary font-bold">P</span>
      </div>

      <ol className="divide-y divide-zinc-200/70 dark:divide-zinc-900/70">
        {standings.map((row) => {
          const isCafChampions = row.position <= 2;
          const isCafConfederation = row.position === 3;
          const isRelegated = row.position >= 15;
          const marker = isCafChampions
            ? 'border-l-2 border-amber-500'
            : isCafConfederation
            ? 'border-l-2 border-blue-500'
            : isRelegated
            ? 'border-l-2 border-red-600'
            : 'border-l-2 border-transparent';

          return (
            <li key={row.teamId} className={marker}>
              <Link
                href={`/teams/${row.teamId}`}
                className="flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <span className="w-4 text-right text-[11px] font-mono font-bold text-zinc-500 flex-shrink-0">{row.position}</span>
                <TeamCrest teamId={row.teamId} size={22} className="flex-shrink-0" />
                <span className="flex-1 text-xs font-semibold text-foreground truncate">{row.teamName}</span>
                <span className="w-6 text-center text-[11px] font-mono text-zinc-600 dark:text-zinc-400">{row.played}</span>
                <span className="w-6 text-center text-[11px] font-mono font-extrabold text-primary dark:text-white">{row.points}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
