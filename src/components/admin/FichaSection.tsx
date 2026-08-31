'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { CheckCircle2, Loader2, FileDown, AlertTriangle, Users, Crown } from 'lucide-react';
import { getMatchesForSeason, UPCOMING_SEASON_ID } from '@/lib/data';

type SlotPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

interface SquadPlayer {
  id: string;
  name: string;
  fullName: string;
  position: SlotPosition | null;
  positionLabel: string;
  jerseyNumber: number;
  nationality: string;
}

interface Slot {
  playerId: string | null;
  name: string;
  number: number;
  position: SlotPosition | null;
  isStarter: boolean;
  isCaptain: boolean;
}

interface SideData {
  side: 'home' | 'away';
  teamId: string;
  teamName: string;
  suggestedCoach: string;
  squad: SquadPlayer[];
  lineup: { players: Slot[]; coach: string | null; confirmedAt: string | null } | null;
}

interface LineupsResponse {
  match: { id: string; round: number; date: string; stadium: string; homeTeam: string; awayTeam: string };
  officials: { referee: string; assistants: [string, string]; fourth: string };
  home: SideData;
  away: SideData;
}

const POS_ORDER: SlotPosition[] = ['GK', 'DEF', 'MID', 'FWD'];
const POS_LABEL: Record<SlotPosition, string> = { GK: 'Guarda-redes', DEF: 'Defesas', MID: 'Médios', FWD: 'Avançados' };

function panelClass(extra = '') {
  return `bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5 ${extra}`;
}

function SideEditor({
  data,
  matchId,
  onConfirmed,
}: {
  data: SideData;
  matchId: string;
  onConfirmed: () => void;
}) {
  // slot por playerId
  const initial = useMemo(() => {
    const map = new Map<string, Slot>();
    if (data.lineup) {
      for (const s of data.lineup.players) if (s.playerId) map.set(s.playerId, { ...s });
    }
    return map;
  }, [data.lineup]);

  // Reinicializado por via de `key` no componente pai quando a escalação muda.
  const [slots, setSlots] = useState<Map<string, Slot>>(initial);
  const [coach, setCoach] = useState(data.lineup?.coach ?? data.suggestedCoach);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const starters = [...slots.values()].filter((s) => s.isStarter);
  const subs = [...slots.values()].filter((s) => !s.isStarter && (s.number > 0 || s.name));

  const setRole = (p: SquadPlayer, role: 'starter' | 'sub' | 'out') => {
    setSlots((prev) => {
      const next = new Map(prev);
      if (role === 'out') {
        next.delete(p.id);
        return next;
      }
      const existing = next.get(p.id);
      next.set(p.id, {
        playerId: p.id,
        name: existing?.name ?? p.name,
        number: existing?.number ?? p.jerseyNumber ?? 0,
        position: existing?.position ?? p.position,
        isStarter: role === 'starter',
        isCaptain: existing?.isCaptain ?? false,
      });
      return next;
    });
  };

  const patchSlot = (id: string, patch: Partial<Slot>) => {
    setSlots((prev) => {
      const next = new Map(prev);
      const cur = next.get(id);
      if (!cur) return prev;
      if (patch.isCaptain) {
        for (const [k, v] of next) if (k !== id) next.set(k, { ...v, isCaptain: false });
      }
      next.set(id, { ...cur, ...patch });
      return next;
    });
  };

  const confirm = useCallback(async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/lineups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          teamId: data.teamId,
          side: data.side,
          coach,
          players: [...slots.values()],
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok) {
        setMsg({ kind: 'ok', text: 'Onze confirmado.' });
        onConfirmed();
      } else {
        setMsg({ kind: 'err', text: body?.message ?? 'Não foi possível guardar.' });
      }
    } catch {
      setMsg({ kind: 'err', text: 'Falha de ligação.' });
    } finally {
      setSaving(false);
    }
  }, [coach, data, matchId, slots, onConfirmed]);

  const byPos = useMemo(() => {
    const groups: Record<string, SquadPlayer[]> = { GK: [], DEF: [], MID: [], FWD: [], '?': [] };
    for (const p of data.squad) (groups[p.position ?? '?'] ??= []).push(p);
    return groups;
  }, [data.squad]);

  const gkCount = starters.filter((s) => s.position === 'GK').length;
  const valid = starters.length === 11 && gkCount === 1;

  return (
    <div className={panelClass('space-y-4')}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-foreground uppercase">{data.teamName}</h3>
          <p className="text-[11px] font-mono text-zinc-500">
            {data.side === 'home' ? 'Casa' : 'Visitante'}
          </p>
        </div>
        <div className="text-right">
          <span className={`font-mono text-sm font-bold ${valid ? 'text-emerald-500' : 'text-amber-500'}`}>
            {starters.length}/11
          </span>
          {data.lineup?.confirmedAt && (
            <p className="text-[10px] font-mono text-emerald-500 flex items-center gap-1 justify-end mt-0.5">
              <CheckCircle2 size={11} /> confirmado
            </p>
          )}
        </div>
      </div>

      <label className="block">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Treinador</span>
        <input
          value={coach}
          onChange={(e) => setCoach(e.target.value)}
          className="mt-1 w-full bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
        />
      </label>

      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {([...POS_ORDER, '?'] as (SlotPosition | '?')[]).map((pos) => {
          const list = byPos[pos] ?? [];
          if (!list.length) return null;
          return (
            <div key={pos}>
              <p className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold mb-1">
                {pos === '?' ? 'Posição por confirmar' : POS_LABEL[pos]}
              </p>
              <div className="space-y-1">
                {list.map((p) => {
                  const slot = slots.get(p.id);
                  const role = !slot ? 'out' : slot.isStarter ? 'starter' : 'sub';
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 rounded-lg border border-zinc-200/70 dark:border-zinc-800/70 bg-white/40 dark:bg-zinc-900/30 px-2 py-1.5"
                    >
                      <div className="flex gap-0.5">
                        {(['starter', 'sub', 'out'] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRole(p, r)}
                            className={`w-6 h-6 rounded text-[10px] font-mono font-bold transition-colors ${
                              role === r
                                ? r === 'starter'
                                  ? 'bg-emerald-500 text-white'
                                  : r === 'sub'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-zinc-400 text-white'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-foreground'
                            }`}
                            title={r === 'starter' ? 'Titular' : r === 'sub' ? 'Suplente' : 'Fora'}
                          >
                            {r === 'starter' ? 'T' : r === 'sub' ? 'S' : '✕'}
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        value={slot?.number || ''}
                        disabled={!slot}
                        onChange={(e) => patchSlot(p.id, { number: Number(e.target.value) || 0 })}
                        className="w-11 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded px-1 py-1 text-xs text-center text-foreground disabled:opacity-30 focus:outline-none focus:border-primary"
                        placeholder="#"
                      />
                      <input
                        value={slot?.name ?? p.name}
                        disabled={!slot}
                        onChange={(e) => patchSlot(p.id, { name: e.target.value })}
                        className="flex-1 min-w-0 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-xs text-foreground disabled:opacity-40 focus:outline-none focus:border-primary"
                        title={p.fullName}
                      />
                      <button
                        type="button"
                        disabled={!slot}
                        onClick={() => patchSlot(p.id, { isCaptain: !slot?.isCaptain })}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-colors disabled:opacity-20 ${
                          slot?.isCaptain ? 'bg-amber-400 text-black' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-amber-500'
                        }`}
                        title="Capitão"
                      >
                        <Crown size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="text-[11px] font-mono text-zinc-500">
          Titulares {starters.length}/11 · Suplentes {subs.length}
          {gkCount !== 1 && <span className="text-amber-500"> · falta o guarda-redes</span>}
        </p>
        <button
          type="button"
          onClick={confirm}
          disabled={!valid || saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
          Confirmar onze
        </button>
      </div>

      {msg && (
        <p
          className={`text-[11px] font-mono flex items-center gap-1.5 ${
            msg.kind === 'ok' ? 'text-emerald-500' : 'text-red-500'
          }`}
        >
          {msg.kind === 'ok' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
          {msg.text}
        </p>
      )}
    </div>
  );
}

export default function FichaSection() {
  const matches = useMemo(
    () => getMatchesForSeason(UPCOMING_SEASON_ID).slice().sort((a, b) => a.round - b.round || a.date.localeCompare(b.date)),
    [],
  );
  const rounds = useMemo(() => [...new Set(matches.map((m) => m.round))].sort((a, b) => a - b), [matches]);

  const [round, setRound] = useState(rounds[0] ?? 1);
  const [matchId, setMatchId] = useState('');
  const [data, setData] = useState<LineupsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roundMatches = matches.filter((m) => m.round === round);

  const load = useCallback(async (id: string) => {
    if (!id) {
      setData(null);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/lineups?matchId=${encodeURIComponent(id)}`, { cache: 'no-store' });
      const body = await res.json();
      if (res.ok) setData(body);
      else setError(body?.message ?? 'Não foi possível carregar o jogo.');
    } catch {
      setError('Falha de ligação.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (matchId) load(matchId);
  }, [matchId, load]);

  const bothConfirmed = Boolean(data?.home.lineup?.confirmedAt && data?.away.lineup?.confirmedAt);

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <Users size={14} className="text-accent" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">FICHA_DE_JOGO</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase leading-none">Constituição das Equipas</h2>
        <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
          Confirme os onze iniciais e suplentes das duas equipas e gere a ficha em PDF preenchível
          para enviar aos delegados. No documento aparecem apenas as alcunhas.
        </p>
      </div>

      <div className={panelClass('flex flex-wrap items-end gap-4')}>
        <label className="block">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Jornada</span>
          <select
            value={round}
            onChange={(e) => {
              setRound(Number(e.target.value));
              setMatchId('');
              setData(null);
            }}
            className="mt-1 block bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          >
            {rounds.map((r) => (
              <option key={r} value={r}>
                {r}.ª Jornada
              </option>
            ))}
          </select>
        </label>

        <label className="block flex-1 min-w-[240px]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Jogo</span>
          <select
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
            className="mt-1 block w-full bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">— escolher —</option>
            {roundMatches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.homeTeam} — {m.awayTeam}
              </option>
            ))}
          </select>
        </label>

        {data && (
          <button
            type="button"
            onClick={() => window.open(`/api/admin/match-sheet/${data.match.id}`, '_blank', 'noopener')}
            disabled={!bothConfirmed}
            className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 py-2 text-xs font-bold text-primary disabled:opacity-40"
            title={bothConfirmed ? 'Descarregar a ficha em PDF' : 'Confirme os dois onzes primeiro'}
          >
            <FileDown size={14} /> Ficha PDF
          </button>
        )}
      </div>

      {loading && (
        <p className="text-zinc-500 font-mono text-sm flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" /> A carregar...
        </p>
      )}
      {error && (
        <p className="text-red-500 font-mono text-sm flex items-center gap-2">
          <AlertTriangle size={14} /> {error}
        </p>
      )}

      {data && !loading && (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            <SideEditor
              key={`home-${data.match.id}-${data.home.lineup?.confirmedAt ?? 'novo'}`}
              data={data.home}
              matchId={data.match.id}
              onConfirmed={() => load(data.match.id)}
            />
            <SideEditor
              key={`away-${data.match.id}-${data.away.lineup?.confirmedAt ?? 'novo'}`}
              data={data.away}
              matchId={data.match.id}
              onConfirmed={() => load(data.match.id)}
            />
          </div>

          <div className={panelClass()}>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">Equipa de arbitragem (da nomeação)</p>
            <div className="grid gap-x-6 gap-y-1 text-sm text-foreground sm:grid-cols-2">
              <span><b className="text-zinc-500 font-mono text-xs">Árbitro:</b> {data.officials.referee}</span>
              <span><b className="text-zinc-500 font-mono text-xs">4.º árbitro:</b> {data.officials.fourth}</span>
              <span><b className="text-zinc-500 font-mono text-xs">Assistente 1:</b> {data.officials.assistants[0]}</span>
              <span><b className="text-zinc-500 font-mono text-xs">Assistente 2:</b> {data.officials.assistants[1]}</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              Vão pré-preenchidos na ficha (editáveis pelo delegado). Alterar em <b>Nomeações</b>.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
