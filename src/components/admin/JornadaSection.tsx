'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarClock, Loader2, CheckCircle2, Circle, Flag, Users, FileDown, BarChart3, CalendarDays, ArrowRight, Pencil,
} from 'lucide-react';
import { getMatchesForSeason, UPCOMING_SEASON_ID, type Match } from '@/lib/data';
import EditMatchModal from '@/components/admin/EditMatchModal';

type AdminSection = 'calendar' | 'nominations' | 'ficha' | 'competition';

interface RoundMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  stadium: string;
  dateOfficial: boolean;
  hasNominations: boolean;
  lineupsConfirmed: boolean;
  finished: boolean;
  score: string | null;
  hasEvents: boolean;
}

const STEPS: Array<{
  key: keyof Pick<RoundMatch, 'dateOfficial' | 'hasNominations' | 'lineupsConfirmed' | 'finished' | 'hasEvents'>;
  label: string;
  icon: typeof Flag;
  section: AdminSection;
}> = [
  { key: 'dateOfficial', label: 'Data & estádio', icon: CalendarDays, section: 'calendar' },
  { key: 'hasNominations', label: 'Arbitragem', icon: Flag, section: 'nominations' },
  { key: 'lineupsConfirmed', label: 'Escalações', icon: Users, section: 'ficha' },
  { key: 'finished', label: 'Resultado', icon: BarChart3, section: 'competition' },
  { key: 'hasEvents', label: 'Eventos', icon: FileDown, section: 'ficha' },
];

export default function JornadaSection({ onGo }: { onGo: (s: AdminSection) => void }) {
  const rounds = useMemo(
    () => [...new Set(getMatchesForSeason(UPCOMING_SEASON_ID).map((m) => m.round))].sort((a, b) => a - b),
    [],
  );
  const [round, setRound] = useState(() => {
    const matches = getMatchesForSeason(UPCOMING_SEASON_ID);
    return matches.find((m) => m.status !== 'finished')?.round ?? rounds[rounds.length - 1] ?? 1;
  });
  const [matches, setMatches] = useState<RoundMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMatch, setEditMatch] = useState<Match | null>(null);
  const [editMatchNum, setEditMatchNum] = useState<number>(1);

  const allSeasonMatches = useMemo(() => getMatchesForSeason(UPCOMING_SEASON_ID), []);

  const handleOpenEdit = (m: RoundMatch) => {
    const full = allSeasonMatches.find((match) => match.id === m.id);
    if (full) {
      const idx = allSeasonMatches.findIndex((match) => match.id === m.id);
      setEditMatch(full);
      setEditMatchNum(idx + 1);
    }
  };

  const handleSaveMatch = async (matchId: string, patch: Partial<Match>) => {
    const res = await fetch('/api/admin/overrides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'calendar',
        value: {
          [matchId]: {
            date: patch.date,
            stadium: patch.stadium,
            round: patch.round,
            homeTeamId: patch.homeTeamId,
            awayTeamId: patch.awayTeamId,
            homeTeam: patch.homeTeam,
            awayTeam: patch.awayTeam,
            scheduleStatus: patch.scheduleStatus || 'official',
          },
        },
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || 'Não foi possível gravar a alteração.');
    }
    try {
      const stored = JSON.parse(localStorage.getItem('faf_calendar_overrides') || '{}');
      stored[matchId] = {
        ...(stored[matchId] || {}),
        date: patch.date,
        stadium: patch.stadium,
        round: patch.round,
        homeTeamId: patch.homeTeamId,
        awayTeamId: patch.awayTeamId,
        homeTeam: patch.homeTeam,
        awayTeam: patch.awayTeam,
        scheduleStatus: patch.scheduleStatus || 'official',
      };
      localStorage.setItem('faf_calendar_overrides', JSON.stringify(stored));
    } catch {}
    await load(round);
  };

  const load = useCallback(async (r: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/round-status?round=${r}`, { cache: 'no-store' });
      const body = await res.json();
      setMatches(res.ok ? (body.matches ?? []) : []);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(round);
  }, [round, load]);

  const done = (m: RoundMatch, key: (typeof STEPS)[number]['key']) => Boolean(m[key]);
  const roundProgress = matches.length
    ? Math.round(
        (matches.reduce((n, m) => n + STEPS.filter((s) => done(m, s.key)).length, 0) / (matches.length * STEPS.length)) * 100,
      )
    : 0;

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <CalendarClock size={14} className="text-accent" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">FLUXO_POR_JORNADA</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase leading-none">Jornada</h2>
        <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
          Estado de preparação de cada jogo da jornada. Cada passo abre a secção onde se completa.
        </p>
      </div>

      <div className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5 flex flex-wrap items-center gap-4">
        <label className="block">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Jornada</span>
          <select
            value={round}
            onChange={(e) => setRound(Number(e.target.value))}
            className="mt-1 block bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          >
            {rounds.map((r) => (
              <option key={r} value={r}>{r}.ª Jornada</option>
            ))}
          </select>
        </label>
        <div className="flex-1 min-w-[160px]">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Progresso da jornada</span>
            <span className="font-bold text-foreground">{roundProgress}%</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${roundProgress}%` }} />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-zinc-500 font-mono text-sm flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" /> A carregar...
        </p>
      ) : (
        <div className="space-y-3">
          {matches.map((m) => (
            <div
              key={m.id}
              className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="font-display text-sm text-foreground uppercase">
                  {m.homeTeam} <span className="text-zinc-400">—</span> {m.awayTeam}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500">
                    {m.score ? <b className="text-foreground">{m.score}</b> : new Date(m.date).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(m)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-500 hover:text-foreground hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    title="Editar partida"
                  >
                    <Pencil size={11} /> Editar
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {STEPS.map((s) => {
                  const ok = done(m, s.key);
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => onGo(s.section)}
                      className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[11px] font-mono transition-colors ${
                        ok
                          ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-foreground hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                      title={`Abrir ${s.label}`}
                    >
                      {ok ? <CheckCircle2 size={13} className="shrink-0" /> : <Circle size={13} className="shrink-0" />}
                      <Icon size={12} className="shrink-0 opacity-60" />
                      <span className="truncate">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {!matches.length && <p className="text-zinc-500 font-mono text-sm">Sem jogos nesta jornada.</p>}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {(['calendar', 'nominations', 'ficha', 'competition'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onGo(s)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-foreground"
          >
            {s === 'calendar' ? 'Calendário' : s === 'nominations' ? 'Nomeações' : s === 'ficha' ? 'Ficha de jogo' : 'Jogos e classificação'}
            <ArrowRight size={12} />
          </button>
        ))}
      </div>

      <EditMatchModal
        isOpen={Boolean(editMatch)}
        match={editMatch}
        matchNumber={editMatchNum}
        onClose={() => setEditMatch(null)}
        onSave={handleSaveMatch}
      />
    </div>
  );
}
