'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  CheckCircle2, Loader2, FileDown, AlertTriangle, Users, Crown, CalendarClock,
  ShieldCheck, ListChecks, ClipboardPen, History, Plus, Trash2, Save, Trophy,
} from 'lucide-react';
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

type OperationsTab = 'match' | 'lineups' | 'officials' | 'events' | 'report' | 'history';
type MatchEvent = {
  minute: number | null;
  type: 'goal' | 'yellow' | 'red' | 'warning' | 'sub';
  teamSide: 'home' | 'away';
  player: string;
  playerId?: string | null;
  assist?: string | null;
  playerOut?: string | null;
  detail?: string | null;
};
type OperationsData = {
  match: { id: string; date: string; stadium: string; status: 'scheduled' | 'live' | 'finished'; homeScore: number; awayScore: number; halfTimeScore: string; attendance: number; usefulTimeMinutes: number; broadcaster: string };
  officials: { referee: string; referee_category: string; assistant_1: string; assistant_2: string; fourth_official: string; commissioner: string };
  events: MatchEvent[];
  report: { summary: string; incidents: string; pitch_conditions: string; organisation_notes: string; status: 'draft' | 'review' | 'approved' };
  audit: { id: string; action: string; actor_email: string; created_at: string }[];
};

const tabs: { key: OperationsTab; label: string; icon: typeof Users }[] = [
  { key: 'match', label: 'Dados da partida', icon: CalendarClock },
  { key: 'lineups', label: 'Titulares e reservas', icon: Users },
  { key: 'officials', label: 'Oficiais', icon: ShieldCheck },
  { key: 'events', label: 'Placar e ocorrências', icon: ListChecks },
  { key: 'report', label: 'Relatório', icon: ClipboardPen },
  { key: 'history', label: 'Histórico', icon: History },
];

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

const inputClass = 'w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary dark:border-zinc-800 dark:bg-zinc-900/70';

function OperationsEditor({ matchId, tab, teamNames }: { matchId: string; tab: OperationsTab; teamNames: { home: string; away: string } }) {
  const [data, setData] = useState<OperationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/match-operations/${encodeURIComponent(matchId)}`, { cache: 'no-store' });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.message || 'Não foi possível carregar a ficha operacional.');
      setData(body);
    } catch (error) {
      setMessage({ ok: false, text: error instanceof Error ? error.message : 'Falha de ligação.' });
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    // A mudança de jogo exige um novo instantâneo do servidor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const save = async (section: 'match' | 'officials' | 'events' | 'report', value: unknown) => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/match-operations/${encodeURIComponent(matchId)}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section, value }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.message || 'Não foi possível guardar.');
      setMessage({ ok: true, text: 'Alterações guardadas e registadas no histórico.' });
      await load();
    } catch (error) {
      setMessage({ ok: false, text: error instanceof Error ? error.message : 'Falha de ligação.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !data) return <div className={panelClass('flex items-center gap-2 text-sm text-zinc-500')}><Loader2 size={15} className="animate-spin" /> A carregar ficha operacional…</div>;
  if (!data) return <div className={panelClass()}><p className="text-sm text-red-500">{message?.text || 'Dados indisponíveis.'}</p></div>;

  const patchMatch = (patch: Partial<OperationsData['match']>) => setData((current) => current ? { ...current, match: { ...current.match, ...patch } } : current);
  const patchOfficials = (patch: Partial<OperationsData['officials']>) => setData((current) => current ? { ...current, officials: { ...current.officials, ...patch } } : current);
  const patchReport = (patch: Partial<OperationsData['report']>) => setData((current) => current ? { ...current, report: { ...current.report, ...patch } } : current);
  const patchEvent = (index: number, patch: Partial<MatchEvent>) => setData((current) => current ? { ...current, events: current.events.map((item, i) => i === index ? { ...item, ...patch } : item) } : current);

  return (
    <div className="space-y-4">
      {message && (
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${message.ok ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600' : 'border-red-500/30 bg-red-500/10 text-red-500'}`}>
          {message.ok ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />} {message.text}
        </div>
      )}

      {tab === 'match' && (
        <div className={panelClass('space-y-5')}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Data e hora (Africa/Luanda)"><input type="datetime-local" value={data.match.date.slice(0, 16)} onChange={(e) => patchMatch({ date: `${e.target.value}:00+01:00` })} className={inputClass} /></Field>
            <Field label="Estádio"><input value={data.match.stadium} onChange={(e) => patchMatch({ stadium: e.target.value })} className={inputClass} /></Field>
            <Field label="Estado"><select value={data.match.status} onChange={(e) => patchMatch({ status: e.target.value as OperationsData['match']['status'] })} className={inputClass}><option value="scheduled">Programado</option><option value="live">Em direto</option><option value="finished">Terminado</option></select></Field>
            <Field label="Transmissão"><input value={data.match.broadcaster} onChange={(e) => patchMatch({ broadcaster: e.target.value })} className={inputClass} placeholder="Ex.: ZSports" /></Field>
            <Field label="Espectadores"><input type="number" min="0" value={data.match.attendance} onChange={(e) => patchMatch({ attendance: Number(e.target.value) })} className={inputClass} /></Field>
            <Field label="Tempo útil (minutos)"><input type="number" min="0" max="130" value={data.match.usefulTimeMinutes} onChange={(e) => patchMatch({ usefulTimeMinutes: Number(e.target.value) })} className={inputClass} /></Field>
          </div>
          <SaveButton saving={saving} onClick={() => save('match', data.match)} label="Guardar dados da partida" />
        </div>
      )}

      {tab === 'officials' && (
        <div className={panelClass('space-y-5')}>
          <div className="grid gap-4 md:grid-cols-2">
            {([
              ['referee', 'Árbitro'], ['referee_category', 'Categoria do árbitro'], ['assistant_1', '1.º árbitro assistente'],
              ['assistant_2', '2.º árbitro assistente'], ['fourth_official', 'Quarto árbitro'], ['commissioner', 'Comissário de jogo'],
            ] as const).map(([key, label]) => <Field key={key} label={label}><input value={data.officials[key] || ''} onChange={(e) => patchOfficials({ [key]: e.target.value })} className={inputClass} /></Field>)}
          </div>
          <SaveButton saving={saving} onClick={() => save('officials', data.officials)} label="Confirmar oficiais" />
        </div>
      )}

      {tab === 'events' && (
        <div className="space-y-4">
          <div className={panelClass('flex flex-col items-center gap-4 sm:flex-row sm:justify-center')}>
            <ScoreInput name={teamNames.home} value={data.match.homeScore} onChange={(homeScore) => patchMatch({ homeScore })} />
            <span className="text-2xl font-display text-zinc-400">:</span>
            <ScoreInput name={teamNames.away} value={data.match.awayScore} onChange={(awayScore) => patchMatch({ awayScore })} />
            <div className="sm:ml-5"><Field label="Intervalo"><input value={data.match.halfTimeScore} onChange={(e) => patchMatch({ halfTimeScore: e.target.value })} className={`${inputClass} w-28`} placeholder="0-0" /></Field></div>
            <SaveButton saving={saving} onClick={() => save('match', data.match)} label="Atualizar placar" />
          </div>
          <div className={panelClass('space-y-3')}>
            <div className="flex items-center justify-between gap-3"><h3 className="font-display text-lg uppercase text-foreground">Ocorrências</h3><button type="button" onClick={() => setData({ ...data, events: [...data.events, { minute: null, type: 'goal', teamSide: 'home', player: '' }] })} className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary"><Plus size={13} /> Adicionar</button></div>
            {data.events.length === 0 && <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-800">Ainda não existem ocorrências registadas.</p>}
            {data.events.map((event, index) => (
              <div key={index} className="grid gap-2 rounded-xl border border-zinc-200 bg-white/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40 md:grid-cols-[76px_130px_140px_1fr_1fr_38px]">
                <input aria-label="Minuto" type="number" min="0" max="130" value={event.minute ?? ''} onChange={(e) => patchEvent(index, { minute: e.target.value ? Number(e.target.value) : null })} className={inputClass} placeholder="Min." />
                <select aria-label="Tipo" value={event.type} onChange={(e) => patchEvent(index, { type: e.target.value as MatchEvent['type'] })} className={inputClass}><option value="goal">Golo</option><option value="yellow">Amarelo</option><option value="red">Vermelho</option><option value="sub">Substituição</option><option value="warning">Aviso</option></select>
                <select aria-label="Equipa" value={event.teamSide} onChange={(e) => patchEvent(index, { teamSide: e.target.value as MatchEvent['teamSide'] })} className={inputClass}><option value="home">{teamNames.home}</option><option value="away">{teamNames.away}</option></select>
                <input aria-label="Jogador" value={event.player} onChange={(e) => patchEvent(index, { player: e.target.value })} className={inputClass} placeholder="Jogador" />
                <input aria-label="Detalhe" value={event.detail ?? ''} onChange={(e) => patchEvent(index, { detail: e.target.value })} className={inputClass} placeholder={event.type === 'sub' ? 'Jogador que saiu' : 'Detalhe / motivo'} />
                <button type="button" aria-label="Remover ocorrência" onClick={() => setData({ ...data, events: data.events.filter((_, i) => i !== index) })} className="flex items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10"><Trash2 size={16} /></button>
              </div>
            ))}
            <SaveButton saving={saving} onClick={() => save('events', { events: data.events })} label="Guardar ocorrências" />
          </div>
        </div>
      )}

      {tab === 'report' && (
        <div className={panelClass('space-y-4')}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Estado do relatório"><select value={data.report.status} onChange={(e) => patchReport({ status: e.target.value as OperationsData['report']['status'] })} className={inputClass}><option value="draft">Rascunho</option><option value="review">Em revisão</option><option value="approved">Aprovado</option></select></Field>
            <Field label="Condições do relvado"><textarea rows={3} value={data.report.pitch_conditions} onChange={(e) => patchReport({ pitch_conditions: e.target.value })} className={inputClass} /></Field>
          </div>
          <Field label="Resumo da partida"><textarea rows={5} value={data.report.summary} onChange={(e) => patchReport({ summary: e.target.value })} className={inputClass} placeholder="Síntese factual do jogo…" /></Field>
          <Field label="Incidentes e disciplina"><textarea rows={4} value={data.report.incidents} onChange={(e) => patchReport({ incidents: e.target.value })} className={inputClass} placeholder="Incidentes, decisões disciplinares ou observações…" /></Field>
          <Field label="Notas de organização"><textarea rows={4} value={data.report.organisation_notes} onChange={(e) => patchReport({ organisation_notes: e.target.value })} className={inputClass} /></Field>
          <SaveButton saving={saving} onClick={() => save('report', data.report)} label="Guardar relatório" />
        </div>
      )}

      {tab === 'history' && (
        <div className={panelClass()}>
          <h3 className="mb-4 font-display text-lg uppercase text-foreground">Histórico de alterações</h3>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {data.audit.length === 0 && <p className="py-6 text-center text-sm text-zinc-500">Ainda não existem alterações auditadas neste jogo.</p>}
            {data.audit.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><div><p className="text-sm font-semibold capitalize text-foreground">{item.action}</p><p className="text-xs text-zinc-500">{item.actor_email}</p></div><time className="text-xs font-mono text-zinc-500">{new Date(item.created_at).toLocaleString('pt-AO')}</time></div>)}
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreInput({ name, value, onChange }: { name: string; value: number; onChange: (value: number) => void }) {
  return <label className="flex items-center gap-3"><span className="max-w-40 text-right text-sm font-semibold text-foreground">{name}</span><input aria-label={`Golos de ${name}`} type="number" min="0" value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} className="h-14 w-16 rounded-xl border border-zinc-200 bg-white text-center text-2xl font-bold text-foreground outline-none focus:border-primary dark:border-zinc-800 dark:bg-zinc-900" /></label>;
}

function SaveButton({ saving, onClick, label }: { saving: boolean; onClick: () => void; label: string }) {
  return <button type="button" disabled={saving} onClick={onClick} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}{saving ? 'A guardar…' : label}</button>;
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
  const [activeTab, setActiveTab] = useState<OperationsTab>('match');

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
              setActiveTab('match');
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
            onChange={(e) => {
              setMatchId(e.target.value);
              setActiveTab('match');
            }}
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
          <div className={panelClass('overflow-hidden !p-0')}>
            <div className="flex flex-col gap-5 border-b border-zinc-200 p-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary">{data.match.id} · {data.match.round}.ª jornada</p>
                <h3 className="mt-1 flex items-center gap-2 font-display text-xl uppercase text-foreground"><Trophy size={18} className="text-accent" /> {data.home.teamName} <span className="text-zinc-400">—</span> {data.away.teamName}</h3>
                <p className="mt-1 text-xs text-zinc-500">{new Date(data.match.date).toLocaleString('pt-AO')} · {data.match.stadium}</p>
              </div>
              <span className={`w-fit rounded-full px-3 py-1 text-[10px] font-mono font-bold uppercase ${bothConfirmed ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>{bothConfirmed ? 'Equipas confirmadas' : 'Preparação em curso'}</span>
            </div>
            <div className="flex overflow-x-auto px-2 pt-2">
              {tabs.map(({ key, label, icon: Icon }) => <button key={key} type="button" onClick={() => setActiveTab(key)} className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-[11px] font-mono font-semibold uppercase tracking-wide transition-colors ${activeTab === key ? 'border-primary bg-primary/5 text-primary' : 'border-transparent text-zinc-500 hover:text-foreground'}`}><Icon size={14} /> {label}</button>)}
            </div>
          </div>

          {activeTab === 'lineups' ? (
            <div className="grid gap-5 lg:grid-cols-2">
              <SideEditor key={`home-${data.match.id}-${data.home.lineup?.confirmedAt ?? 'novo'}`} data={data.home} matchId={data.match.id} onConfirmed={() => load(data.match.id)} />
              <SideEditor key={`away-${data.match.id}-${data.away.lineup?.confirmedAt ?? 'novo'}`} data={data.away} matchId={data.match.id} onConfirmed={() => load(data.match.id)} />
            </div>
          ) : (
            <OperationsEditor matchId={data.match.id} tab={activeTab} teamNames={{ home: data.home.teamName, away: data.away.teamName }} />
          )}
        </>
      )}
    </div>
  );
}
