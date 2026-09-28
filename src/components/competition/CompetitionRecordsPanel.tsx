'use client';

import { Fragment, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Flag, Shield, UserRound, Users } from 'lucide-react';
import TeamCrest from '@/components/ui/TeamCrest';
import { getSeasonResultsUpdatedAt, getTeamById } from '@/lib/data';
import { computeCompetitionRecords, type RecordItem, type RecordRow, type RecordSection } from '@/lib/competition-records';

// Resumo estatístico da competição no formato zerozero: bloco de globais e
// quadros de recordes (Equipas · Jogadores · Árbitros · Treinadores), cada um
// com o recordista, o número de empatados (+N) e o ranking completo em
// "Detalhes".

const SECTION_ICONS: Record<RecordSection['key'], typeof Shield> = {
  equipas: Shield,
  jogadores: Users,
  arbitros: Flag,
  treinadores: UserRound,
};

const DETAIL_SIZE = 10;

function formatValue(value: number, decimals?: number) {
  return decimals
    ? value.toLocaleString('pt-AO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : value.toLocaleString('pt-AO');
}

function unitLabel(item: RecordItem, value: number) {
  return value === 1 && !item.decimals ? item.unit[0] : item.unit[1];
}

function percent(part: number, total: number) {
  return total ? `${Math.round((part / total) * 100)}%` : '0%';
}

function RowName({ row, item, strong = false }: { row: RecordRow; item: RecordItem; strong?: boolean }) {
  const className = `truncate ${strong ? 'font-semibold text-foreground' : 'text-zinc-700 dark:text-zinc-300'}`;
  if (item.entity === 'team') {
    return (
      <Link href={`/teams/${row.id}`} className={`${className} hover:text-accent transition-colors`}>
        {row.name}
      </Link>
    );
  }
  if (row.href) {
    return (
      <Link href={row.href} className={`${className} hover:text-accent transition-colors`}>
        {row.name}
      </Link>
    );
  }
  return <span className={className}>{row.name}</span>;
}

function ClubTag({ teamId }: { teamId?: string }) {
  if (!teamId) return null;
  return (
    <Link
      href={`/teams/${teamId}`}
      className="shrink-0 text-[11px] text-zinc-500 hover:text-accent dark:text-zinc-400 transition-colors"
    >
      [{getTeamById(teamId)?.name ?? teamId}]
    </Link>
  );
}

function RecordDetails({ item }: { item: RecordItem }) {
  const rows = item.rows.slice(0, DETAIL_SIZE);
  return (
    <div className="border-t border-zinc-200/80 bg-zinc-50/70 px-3 py-2 dark:border-zinc-800/70 dark:bg-zinc-900/40 sm:px-4">
      <ol className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
        {rows.map((row) => {
          const rank = item.rows.findIndex((candidate) => candidate.value === row.value) + 1;
          return (
            <li key={row.id} className="flex items-center gap-2 py-1.5 text-xs">
              <span className="w-5 shrink-0 text-center font-mono text-zinc-400">{rank}</span>
              {row.teamId && <TeamCrest teamId={row.teamId} size={16} />}
              <span className="flex min-w-0 flex-1 items-center gap-1.5">
                <RowName row={row} item={item} />
                {item.entity !== 'team' && <ClubTag teamId={row.teamId} />}
              </span>
              <span className="shrink-0 font-display font-bold text-foreground">{formatValue(row.value, item.decimals)}</span>
            </li>
          );
        })}
      </ol>
      {item.rows.length > DETAIL_SIZE && (
        <p className="pt-1.5 text-[10px] font-mono text-zinc-500">
          Top {DETAIL_SIZE} de {item.rows.length}
        </p>
      )}
    </div>
  );
}

function RecordTable({ section }: { section: RecordSection }) {
  const [open, setOpen] = useState<string | null>(null);
  const Icon = SECTION_ICONS[section.key];

  return (
    <section id={`recordes-${section.key}`} className="scroll-mt-28 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <header className="flex items-center gap-2 border-b border-zinc-200/80 bg-zinc-50/80 px-3.5 py-2.5 dark:border-zinc-800/60 dark:bg-zinc-900/40 sm:px-4">
        <Icon size={15} className="text-accent" />
        <h4 className="font-display text-sm uppercase tracking-wider text-foreground">{section.label}</h4>
      </header>

      <div className="divide-y divide-zinc-200/70 dark:divide-zinc-800/50">
        {section.items.map((item) => {
          const leader = item.rows[0];
          const ties = leader ? item.rows.filter((row) => row.value === leader.value).length - 1 : 0;
          const isOpen = open === item.key;

          return (
            <Fragment key={item.key}>
              <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-0.5 px-3.5 py-2 text-xs sm:grid-cols-[170px_1fr_auto_auto] sm:px-4 sm:text-[13px]">
                <span className="col-span-2 text-[11px] font-mono uppercase tracking-wide text-zinc-500 dark:text-zinc-400 sm:col-span-1 sm:text-xs sm:normal-case sm:tracking-normal sm:font-sans sm:font-medium sm:text-zinc-600 sm:dark:text-zinc-400">
                  {item.label}
                </span>

                {leader ? (
                  <>
                    <span className="flex min-w-0 items-center gap-2">
                      {leader.teamId && <TeamCrest teamId={leader.teamId} size={18} />}
                      <RowName row={leader} item={item} strong />
                      {ties > 0 && (
                        <span className="shrink-0 rounded-full bg-accent/15 px-1.5 text-[10px] font-mono font-bold text-accent" title={`${ties} empatado(s) com o mesmo valor`}>
                          +{ties}
                        </span>
                      )}
                      {item.entity !== 'team' && <span className="hidden sm:inline"><ClubTag teamId={leader.teamId} /></span>}
                    </span>
                    <span className="whitespace-nowrap text-right">
                      <span className="font-display font-bold text-foreground">{formatValue(leader.value, item.decimals)}</span>{' '}
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{unitLabel(item, leader.value)}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : item.key)}
                      aria-expanded={isOpen}
                      className="col-span-2 inline-flex items-center justify-end gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-accent hover:underline sm:col-span-1"
                    >
                      Detalhes
                      <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </>
                ) : (
                  <span className="text-[11px] font-mono text-zinc-400 sm:col-span-3">Por publicar nas fichas oficiais</span>
                )}
              </div>
              {isOpen && leader && <RecordDetails item={item} />}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}

export default function CompetitionRecordsPanel({ seasonId }: { seasonId: string }) {
  const records = useMemo(() => computeCompetitionRecords(seasonId), [seasonId]);
  const { globals } = records;
  const updatedAt = new Date(getSeasonResultsUpdatedAt(seasonId)).toLocaleString('pt-AO', {
    timeZone: 'Africa/Luanda',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  if (globals.matches === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-xs font-mono text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/80">
        Ainda não há jogos terminados nesta época. O resumo estatístico é gerado a partir das primeiras fichas oficiais.
      </div>
    );
  }

  const globalCells: { label: string; value: string }[] = [
    { label: 'Jogos', value: String(globals.matches) },
    { label: 'Vitórias Casa', value: `${globals.homeWins} (${percent(globals.homeWins, globals.matches)})` },
    { label: 'Com −3 golos', value: `${globals.underThree} (${percent(globals.underThree, globals.matches)})` },
    { label: 'Golos', value: String(globals.goals) },
    { label: 'Vitórias Fora', value: `${globals.awayWins} (${percent(globals.awayWins, globals.matches)})` },
    { label: '3 ou mais golos', value: `${globals.threeOrMore} (${percent(globals.threeOrMore, globals.matches)})` },
    { label: 'Média', value: formatValue(globals.average, 2) },
    { label: 'Empates', value: `${globals.draws} (${percent(globals.draws, globals.matches)})` },
    {
      label: 'Resultado Típico',
      value: globals.typicalResult ? `${globals.typicalResult.score} (${globals.typicalResult.count} J)` : '—',
    },
  ];

  const outcomeBar = [
    { label: 'Casa', value: globals.homeWins, className: 'bg-emerald-500' },
    { label: 'Empate', value: globals.draws, className: 'bg-zinc-400' },
    { label: 'Fora', value: globals.awayWins, className: 'bg-sky-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <span className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-widest text-accent">
          Resumo estatístico · Recordes da época
        </span>
        <h3 className="text-lg font-display uppercase tracking-wide text-foreground sm:text-xl">Estatísticas da Competição</h3>
      </div>

      {/* Atalhos para os quadros */}
      <nav className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" aria-label="Quadros de recordes">
        {['globais', ...records.sections.map((section) => section.key)].map((key) => (
          <a
            key={key}
            href={`#recordes-${key}`}
            className="shrink-0 rounded-full border border-zinc-200 bg-zinc-100/80 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 hover:border-accent/50 hover:text-accent dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400"
          >
            {key === 'globais' ? 'Globais' : records.sections.find((section) => section.key === key)?.label}
          </a>
        ))}
      </nav>

      {/* Globais */}
      <section id="recordes-globais" className="scroll-mt-28 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <header className="border-b border-zinc-200/80 bg-zinc-50/80 px-3.5 py-2.5 dark:border-zinc-800/60 dark:bg-zinc-900/40 sm:px-4">
          <h4 className="font-display text-sm uppercase tracking-wider text-foreground">Globais</h4>
        </header>
        <dl className="grid grid-cols-1 divide-y divide-zinc-200/70 dark:divide-zinc-800/50 sm:grid-cols-3 sm:divide-y-0">
          {globalCells.map((cell) => (
            <div key={cell.label} className="flex items-baseline justify-between gap-3 px-3.5 py-2 sm:border-b sm:border-zinc-200/70 sm:px-4 sm:dark:border-zinc-800/50">
              <dt className="text-xs text-zinc-600 dark:text-zinc-400">{cell.label}</dt>
              <dd className="font-display text-sm font-bold text-foreground">{cell.value}</dd>
            </div>
          ))}
        </dl>
        <div className="px-3.5 py-3 sm:px-4">
          <div className="flex h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800" role="img" aria-label={`Vitórias em casa ${globals.homeWins}, empates ${globals.draws}, vitórias fora ${globals.awayWins}`}>
            {outcomeBar.map((part) => (
              <span key={part.label} className={part.className} style={{ width: percent(part.value, globals.matches) }} />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] font-mono text-zinc-500">
            {outcomeBar.map((part) => (
              <span key={part.label} className="flex items-center gap-1">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${part.className}`} />
                {part.label} {percent(part.value, globals.matches)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {records.sections.map((section) => (
        <RecordTable key={section.key} section={section} />
      ))}

      <p className="text-[10px] font-mono text-zinc-500">
        [Última atualização: {updatedAt}] · Recordes individuais apurados em {records.matchesWithEvents} de {globals.matches} jogos com ficha publicada.
      </p>
    </div>
  );
}
