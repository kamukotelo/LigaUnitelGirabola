'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Video, Newspaper, Ticket, Tv } from 'lucide-react';
import { getMatchBroadcast, getNewsArticles, Match } from '@/lib/data';
import TeamCrest from '@/components/ui/TeamCrest';
import { useOfficialCalendar } from '@/lib/use-official-calendar';

const ANGOLA_TIME_ZONE = 'Africa/Luanda';

// Cabeçalho de secção com faixa angular vermelha (estilo Liga Angola)
function BannerHeading({ icon: Icon, children }: { icon: typeof Video; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg rounded-bl-none mb-4 shadow-sm">
      <Icon size={15} />
      <h3 className="font-display uppercase tracking-wider text-sm">{children}</h3>
    </div>
  );
}

// Linha de jogo: nome casa (à direita) · emblema · resultado · emblema · nome fora
function FixtureRow({ match, highlight }: { match: Match; highlight: boolean }) {
  const isFinished = match.status === 'finished';
  const home = match.score?.split('-')[0] ?? '--';
  const away = match.score?.split('-')[1] ?? '--';

  return (
    <Link
      href={`/matches/${match.id}`}
      className={`grid grid-cols-[72px_1fr_auto_1fr] sm:grid-cols-[150px_1fr_auto_1fr_90px] items-center gap-2 sm:gap-4 px-3 sm:px-5 py-3.5 transition-colors ${
        highlight ? 'bg-primary/5' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900/40'
      }`}
    >
      <span className="flex items-center gap-1.5 truncate text-[10px] sm:text-xs font-bold text-zinc-600 dark:text-zinc-400" title={`Transmissão: ${getMatchBroadcast(match)}`}>
        <Tv size={13} className="flex-shrink-0 text-primary" /> {getMatchBroadcast(match)}
      </span>
      {/* Casa (nome à direita, emblema junto ao resultado) */}
      <div className="flex items-center justify-end gap-2.5 min-w-0">
        <span className="text-xs sm:text-sm font-semibold text-foreground truncate text-right">{match.homeTeam}</span>
        <TeamCrest teamId={match.homeTeamId} size={28} className="flex-shrink-0" />
      </div>

      {/* Resultado */}
      <div className="flex items-center gap-1.5 font-mono font-black text-sm sm:text-base text-foreground bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 flex-shrink-0">
        <span className="w-4 text-center">{isFinished ? home : '–'}</span>
        <span className="text-zinc-400 text-xs">:</span>
        <span className="w-4 text-center">{isFinished ? away : '–'}</span>
      </div>

      {/* Fora (emblema junto ao resultado, nome à esquerda) */}
      <div className="flex items-center gap-2.5 min-w-0">
        <TeamCrest teamId={match.awayTeamId} size={28} className="flex-shrink-0" />
        <span className="text-xs sm:text-sm font-semibold text-foreground truncate">{match.awayTeam}</span>
      </div>

      <span className="hidden sm:block text-right text-[10px] font-mono uppercase tracking-wider text-zinc-500">
        {new Date(match.date).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit', timeZone: ANGOLA_TIME_ZONE })}
      </span>
    </Link>
  );
}

export default function GeralTab({ seasonId }: { seasonId: string }) {
  const { matches, loading: loadingCalendar } = useOfficialCalendar(seasonId);
  const rounds = useMemo(() => Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b), [matches]);

  // Abre na próxima jornada por disputar; se todas terminadas, na última.
  const defaultRound = useMemo(() => {
    const next = rounds.find((r) => matches.some((m) => m.round === r && m.status !== 'finished'));
    return next ?? rounds[rounds.length - 1] ?? 1;
  }, [rounds, matches]);

  const [round, setRound] = useState<number>(defaultRound);
  const activeRound = rounds.includes(round) ? round : defaultRound;
  const roundMatches = matches.filter((m) => m.round === activeRound);

  // Agrupar por dia (rótulo estilo "DOM. 09 AGO")
  const byDay = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of roundMatches) {
      const key = m.date.slice(0, 10);
      (map.get(key) ?? map.set(key, []).get(key)!).push(m);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [roundMatches]);

  const dayLabel = (iso: string) =>
    new Date(iso + 'T12:00:00').toLocaleDateString('pt-AO', {
      weekday: 'short', day: '2-digit', month: 'short', timeZone: ANGOLA_TIME_ZONE,
    }).toUpperCase();

  const news = getNewsArticles().slice(0, 3);
  const highlightId = roundMatches.find((m) => ['petro', 'dago'].includes(m.homeTeamId) && ['petro', 'dago'].includes(m.awayTeamId))?.id
    ?? roundMatches.find((m) => m.homeTeamId === 'petro' || m.awayTeamId === 'petro')?.id;

  return (
    <div className="space-y-8">
      {loadingCalendar && (
        <p className="text-xs font-mono text-green-500 uppercase tracking-wider">A sincronizar jogos oficiais…</p>
      )}
      {/* Seletor de jornadas em pílulas */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {rounds.map((r) => (
          <button
            key={r}
            onClick={() => setRound(r)}
            className={`snap-start px-4 py-2 rounded-full text-[11px] font-bold font-mono uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 ${
              activeRound === r
                ? 'bg-accent text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-foreground border border-zinc-200 dark:border-zinc-800'
            }`}
          >
            Jornada {r}
          </button>
        ))}
      </div>

      {/* Nota de bilhética */}
      <p className="text-xs text-zinc-500 font-mono flex items-center gap-2">
        <Ticket size={13} className="text-accent" /> A gestão da bilhética é da responsabilidade de cada clube.
      </p>

      {/* Jogos da jornada agrupados por dia */}
      <div className="space-y-6">
        {byDay.map(([day, dayMatches]) => (
          <div key={day} className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="px-5 py-2.5 bg-zinc-100/70 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">{dayLabel(day)}</span>
            </div>
            <div className="divide-y divide-zinc-200/70 dark:divide-zinc-900/70">
              {dayMatches.map((m) => (
                <FixtureRow key={m.id} match={m} highlight={m.id === highlightId} />
              ))}
            </div>
          </div>
        ))}
        {byDay.length === 0 && (
          <p className="text-center py-10 text-zinc-500 font-mono text-sm">Sem jogos nesta jornada.</p>
        )}
      </div>

      {/* Últimos vídeos */}
      <div>
        <BannerHeading icon={Video}>Últimos Vídeos</BannerHeading>
        <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 backdrop-blur-sm">
          <span className="inline-block text-[10px] font-mono uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 rounded-lg px-3 py-1.5 mb-3">
            Liga Unitel Girabola · Época {seasonId}
          </span>
          <p className="text-sm text-zinc-500">Não existem vídeos disponíveis.</p>
        </div>
      </div>

      {/* Últimas notícias */}
      <div>
        <BannerHeading icon={Newspaper}>Últimas Notícias</BannerHeading>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {news.map((n) => (
            <Link key={n.id} href={`/news/${n.id}`} className="block bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 backdrop-blur-sm hover:border-accent/40 transition-colors group">
              <span className="text-[9px] font-mono text-accent uppercase tracking-widest">{n.category} · {n.date}</span>
              <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mt-2 line-clamp-3">{n.title}</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">{n.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
