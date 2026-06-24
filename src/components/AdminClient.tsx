'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CalendarDays, ShieldCheck, Users, Newspaper,
  Lock, LogOut, Save, RefreshCw, Database, Radio, Wifi, Trophy,
  Fingerprint, FileText, Plane, HeartPulse, Loader2, CheckCircle2,
  AlertTriangle, BadgeCheck, Search, Download, Home, Eye, EyeOff,
} from 'lucide-react';
import {
  MATCHES, TEAMS, PLAYERS, getStandings, getNewsArticles,
  getPlayerFifaRecords, FIFA_CHECK_META,
  type Match, type FifaCheckKey,
} from '@/lib/data';

// ── Configuração local (gate de demonstração / persistência local) ──────
const PASSCODE = 'ancaf2026';
const AUTH_KEY = 'ancaf_admin_authed';
const CAL_KEY = 'ancaf_calendar_overrides';
const SYNC_KEY = 'ancaf_calendar_last_sync';

type Section = 'dashboard' | 'calendar' | 'fifa' | 'teams' | 'news';

interface MatchOverride {
  date?: string;
  stadium?: string;
  status?: Match['status'];
  homeScore?: number;
  awayScore?: number;
  score?: string;
}
type Overrides = Record<string, MatchOverride>;

const CHECK_ICONS: Record<FifaCheckKey, React.ElementType> = {
  identity: Fingerprint,
  contract: FileText,
  itc: Plane,
  insurance: HeartPulse,
};

// ── Utilitários de data para inputs datetime-local ──────────────────────
function isoToLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function localInputToIso(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toISOString();
}

// ════════════════════════════════════════════════════════════════════════
// RAIZ
// ════════════════════════════════════════════════════════════════════════
export default function AdminClient() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [section, setSection] = useState<Section>('dashboard');

  useEffect(() => {
    // Leitura segura de armazenamento do browser apenas no cliente (evita mismatch de hidratação).
    /* eslint-disable react-hooks/set-state-in-effect */
    setAuthed(sessionStorage.getItem(AUTH_KEY) === '1');
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  if (!ready) return null;
  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />;

  const navItems: { key: Section; label: string; icon: React.ElementType }[] = [
    { key: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { key: 'calendar', label: 'Calendário · ANCAF', icon: CalendarDays },
    { key: 'fifa', label: 'FIFA Connect', icon: ShieldCheck },
    { key: 'teams', label: 'Equipas', icon: Users },
    { key: 'news', label: 'Notícias', icon: Newspaper },
  ];

  return (
    <div className="min-h-screen relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho administrativo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-green-400 font-semibold">
                CONSOLA_ADMINISTRATIVA_ANCAF
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display text-white uppercase leading-none">
              Gestão da <span className="text-primary italic">Plataforma</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300 font-mono text-[11px] uppercase tracking-widest hover:text-white hover:border-zinc-700 transition-colors"
            >
              <Home size={13} /> Ver site
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[11px] uppercase tracking-widest hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={13} /> Sair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-6">
          {/* Navegação lateral */}
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = section === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setSection(item.key)}
                  className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl font-mono text-[11px] uppercase tracking-widest transition-colors text-left ${
                    active
                      ? 'bg-accent/10 border border-accent/40 text-accent'
                      : 'bg-zinc-950/40 border border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800'
                  }`}
                >
                  <Icon size={15} /> {item.label}
                </button>
              );
            })}
          </nav>

          {/* Conteúdo */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {section === 'dashboard' && <DashboardSection onGo={setSection} />}
                {section === 'calendar' && <CalendarSection />}
                {section === 'fifa' && <FifaSection />}
                {section === 'teams' && <TeamsSection />}
                {section === 'news' && <NewsSection />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// GATE DE ACESSO
// ════════════════════════════════════════════════════════════════════════
function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === PASSCODE) {
      sessionStorage.setItem(AUTH_KEY, '1');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative z-10">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-zinc-950/60 border border-zinc-900 rounded-2xl p-8 backdrop-blur-md"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent">
            <Lock size={20} />
          </div>
          <div>
            <h1 className="font-display text-white uppercase tracking-wider text-lg leading-none">Área Restrita</h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Acesso Administrativo ANCAF</p>
          </div>
        </div>

        <p className="text-xs text-zinc-500 font-mono my-6 leading-relaxed">
          Introduza a credencial de gestão para aceder à consola da plataforma.
        </p>

        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(false); }}
            placeholder="Credencial de acesso"
            autoFocus
            className={`w-full bg-black/50 border rounded-xl py-3 pl-4 pr-11 text-sm text-white font-mono outline-none transition-colors ${
              error ? 'border-red-500/60' : 'border-zinc-800 focus:border-accent'
            }`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && (
          <p className="text-[11px] font-mono text-red-400 mt-2 flex items-center gap-1.5">
            <AlertTriangle size={12} /> Credencial inválida.
          </p>
        )}

        <button
          type="submit"
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent/10 border border-accent/40 text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent/20 transition-colors"
        >
          <ShieldCheck size={14} /> Entrar
        </button>

        <p className="text-[10px] font-mono text-zinc-600 mt-5 text-center">
          Ambiente de demonstração · credencial: <span className="text-zinc-400">ancaf2026</span>
        </p>
      </motion.form>
    </div>
  );
}

// ── Componentes auxiliares de apresentação ──────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-accent" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">{subtitle}</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-display text-white uppercase leading-none">{title}</h2>
    </div>
  );
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 ${className}`}>{children}</div>
  );
}

function ConnectionBadge({ icon: Icon, label, endpoint, ok = true }: { icon: React.ElementType; label: string; endpoint: string; ok?: boolean }) {
  return (
    <div className="flex items-center gap-3 bg-black/40 border border-zinc-900 rounded-xl p-4">
      <div className={`p-2 rounded-lg ${ok ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs text-zinc-200 truncate">{label}</p>
        <p className="text-[10px] font-mono text-zinc-600 truncate">{endpoint}</p>
      </div>
      <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest ${ok ? 'text-green-400' : 'text-amber-400'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
        {ok ? 'Ativo' : 'Pendente'}
      </span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECÇÃO: PAINEL GERAL
// ════════════════════════════════════════════════════════════════════════
function DashboardSection({ onGo }: { onGo: (s: Section) => void }) {
  const fifaRecords = useMemo(() => getPlayerFifaRecords(), []);
  const eligible = fifaRecords.filter((r) => r.eligible).length;
  const finished = MATCHES.filter((m) => m.status === 'finished').length;
  const scheduled = MATCHES.filter((m) => m.status !== 'finished').length;

  const kpis = [
    { label: 'Equipas', value: TEAMS.length, icon: Users },
    { label: 'Jogadores', value: PLAYERS.length, icon: ShieldCheck },
    { label: 'Jogos Realizados', value: finished, icon: Trophy },
    { label: 'Jogos Agendados', value: scheduled, icon: CalendarDays },
    { label: 'Notícias', value: getNewsArticles().length, icon: Newspaper },
    { label: 'Elegíveis FIFA', value: `${eligible}/${fifaRecords.length}`, icon: BadgeCheck },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={LayoutDashboard} subtitle="VISÃO_GERAL" title="Painel de Controlo" />

      {/* Estado das ligações */}
      <Panel>
        <h3 className="text-sm font-display text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Radio size={15} className="text-accent" /> Estado das Ligações
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ConnectionBadge icon={CalendarDays} label="ANCAF_CALENDAR" endpoint="sync · calendário oficial" />
          <ConnectionBadge icon={Database} label="Base de Dados" endpoint="armazenamento · multimédia" />
          <ConnectionBadge icon={Wifi} label="FIFA Connect" endpoint="conformidade · elegibilidade" />
        </div>
      </Panel>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5">
              <Icon size={16} className="text-zinc-600 mb-3" />
              <p className="font-display text-3xl font-black text-white leading-none">{k.value}</p>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-2">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Atalhos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onClick={() => onGo('calendar')} className="text-left bg-zinc-950/40 border border-zinc-900 hover:border-accent/40 rounded-2xl p-5 transition-colors group">
          <CalendarDays size={18} className="text-accent mb-3" />
          <p className="font-display text-white uppercase tracking-wider text-sm">Definir Calendário</p>
          <p className="text-[11px] font-mono text-zinc-500 mt-1">Gerir jornadas via ANCAF_CALENDAR</p>
        </button>
        <button onClick={() => onGo('fifa')} className="text-left bg-zinc-950/40 border border-zinc-900 hover:border-accent/40 rounded-2xl p-5 transition-colors group">
          <ShieldCheck size={18} className="text-accent mb-3" />
          <p className="font-display text-white uppercase tracking-wider text-sm">Gerir FIFA Connect</p>
          <p className="text-[11px] font-mono text-zinc-500 mt-1">Validar elegibilidade dos jogadores</p>
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECÇÃO: CALENDÁRIO (ligação ANCAF_CALENDAR)
// ════════════════════════════════════════════════════════════════════════
function CalendarSection() {
  const rounds = useMemo(() => Array.from(new Set(MATCHES.map((m) => m.round))).sort((a, b) => a - b), []);
  const [round, setRound] = useState<number>(rounds[0] ?? 1);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Carregar persistência local
  useEffect(() => {
    // Carregar persistência local apenas no cliente (evita mismatch de hidratação).
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(CAL_KEY);
      if (raw) setOverrides(JSON.parse(raw));
    } catch { /* ignorar */ }
    setLastSync(localStorage.getItem(SYNC_KEY));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const persist = (next: Overrides) => {
    setOverrides(next);
    localStorage.setItem(CAL_KEY, JSON.stringify(next));
    setSavedAt(new Date().toISOString());
  };

  const update = (id: string, patch: MatchOverride) => {
    persist({ ...overrides, [id]: { ...overrides[id], ...patch } });
  };

  const resetRound = (ids: string[]) => {
    const next = { ...overrides };
    ids.forEach((id) => delete next[id]);
    persist(next);
  };

  const sync = () => {
    setSyncing(true);
    setTimeout(() => {
      const stamp = new Date().toISOString();
      localStorage.setItem(SYNC_KEY, stamp);
      setLastSync(stamp);
      setSyncing(false);
    }, 1600);
  };

  const merged = (m: Match): Match => ({ ...m, ...overrides[m.id] });
  const roundMatches = MATCHES.filter((m) => m.round === round).map(merged);
  const editedCount = Object.keys(overrides).length;

  const exportCalendar = () => {
    const data = MATCHES.map(merged);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ancaf-calendar.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={CalendarDays} subtitle="DEFINIÇÃO_DO_CALENDÁRIO" title="Calendário · ANCAF_CALENDAR" />

      {/* Painel de ligação ANCAF_CALENDAR */}
      <Panel>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
              <Radio size={20} className={syncing ? 'animate-pulse' : ''} />
            </div>
            <div>
              <p className="font-display text-white uppercase tracking-wider text-sm flex items-center gap-2">
                ANCAF_CALENDAR
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Conectado
                </span>
              </p>
              <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                Última sincronização: {lastSync ? new Date(lastSync).toLocaleString('pt-AO') : '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCalendar}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300 font-mono text-[11px] uppercase tracking-widest hover:text-white transition-colors"
            >
              <Download size={13} /> Exportar
            </button>
            <button
              onClick={sync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-accent/10 border border-accent/40 text-accent font-mono text-[11px] uppercase tracking-widest hover:bg-accent/20 transition-colors disabled:opacity-60"
            >
              <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'A sincronizar…' : 'Sincronizar'}
            </button>
          </div>
        </div>
      </Panel>

      {/* Seletor de jornada */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-zinc-400 uppercase mr-1">Jornada:</span>
        {rounds.map((r) => (
          <button
            key={r}
            onClick={() => setRound(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              round === r ? 'bg-primary text-white' : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Estado de gravação */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-zinc-500">
          {editedCount > 0 ? `${editedCount} jogo(s) com alterações locais` : 'Sem alterações locais'}
        </span>
        {savedAt && (
          <span className="inline-flex items-center gap-1.5 text-green-400">
            <Save size={12} /> Guardado {new Date(savedAt).toLocaleTimeString('pt-AO')}
          </span>
        )}
      </div>

      {/* Editor de jogos */}
      <div className="space-y-3">
        {roundMatches.map((m) => {
          const isEdited = !!overrides[m.id];
          const finished = m.status === 'finished';
          return (
            <Panel key={m.id} className={isEdited ? 'border-accent/30' : ''}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-mono bg-zinc-800/80 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider">
                  {m.homeTeam} vs {m.awayTeam}
                </span>
                {isEdited && (
                  <button
                    onClick={() => resetRound([m.id])}
                    className="text-[10px] font-mono text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-widest"
                  >
                    Repor
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Field label="Data e Hora">
                  <input
                    type="datetime-local"
                    value={isoToLocalInput(m.date)}
                    onChange={(e) => update(m.id, { date: localInputToIso(e.target.value) })}
                    className="admin-input"
                  />
                </Field>
                <Field label="Estádio">
                  <input
                    type="text"
                    value={m.stadium}
                    onChange={(e) => update(m.id, { stadium: e.target.value })}
                    className="admin-input"
                  />
                </Field>
                <Field label="Estado">
                  <select
                    value={m.status}
                    onChange={(e) => update(m.id, { status: e.target.value as Match['status'] })}
                    className="admin-input"
                  >
                    <option value="scheduled">Agendado</option>
                    <option value="live">Ao vivo</option>
                    <option value="finished">Terminado</option>
                  </select>
                </Field>
                <Field label="Resultado">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      disabled={!finished}
                      value={finished ? m.homeScore : ''}
                      onChange={(e) => update(m.id, { homeScore: Number(e.target.value), score: undefined })}
                      className="admin-input text-center disabled:opacity-40"
                    />
                    <span className="text-zinc-600 font-mono">:</span>
                    <input
                      type="number"
                      min={0}
                      disabled={!finished}
                      value={finished ? m.awayScore : ''}
                      onChange={(e) => update(m.id, { awayScore: Number(e.target.value), score: undefined })}
                      className="admin-input text-center disabled:opacity-40"
                    />
                  </div>
                </Field>
              </div>
            </Panel>
          );
        })}
      </div>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid #27272a;
          border-radius: 0.625rem;
          padding: 0.55rem 0.7rem;
          font-size: 0.78rem;
          font-family: var(--font-mono, monospace);
          color: #e4e4e7;
          outline: none;
          transition: border-color 0.15s;
        }
        .admin-input:focus { border-color: #00f5ff; }
        .admin-input::-webkit-calendar-picker-indicator { filter: invert(0.7); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">{label}</span>
      {children}
    </label>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECÇÃO: FIFA CONNECT (gestão administrativa)
// ════════════════════════════════════════════════════════════════════════
function FifaSection() {
  const records = useMemo(() => getPlayerFifaRecords(), []);
  const [filter, setFilter] = useState<'all' | 'eligible' | 'pending'>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>(records[0]?.player.id ?? '');

  const filtered = records.filter((r) => {
    const matchFilter = filter === 'all' || (filter === 'eligible' ? r.eligible : !r.eligible);
    const matchQuery = r.player.name.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  const selected = records.find((r) => r.player.id === selectedId) ?? filtered[0] ?? records[0];
  const eligibleCount = records.filter((r) => r.eligible).length;
  const conformity = records.length ? Math.round((eligibleCount / records.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <SectionHeader icon={ShieldCheck} subtitle="CONFORMIDADE_E_ELEGIBILIDADE" title="FIFA Connect" />

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Jogadores', value: records.length, color: '#a1a1aa' },
          { label: 'Elegíveis', value: eligibleCount, color: '#22c55e' },
          { label: 'Pendentes', value: records.length - eligibleCount, color: '#f59e0b' },
          { label: 'Conformidade', value: `${conformity}%`, color: '#00F5FF' },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4">
            <p className="font-display text-2xl font-black leading-none" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-2">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Lista */}
        <div className="space-y-3">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar jogador…"
                className="admin-input pl-9"
              />
            </div>
            <div className="flex gap-1.5">
              {([
                { k: 'all', l: 'Todos' },
                { k: 'eligible', l: 'Elegíveis' },
                { k: 'pending', l: 'Pendentes' },
              ] as const).map((f) => (
                <button
                  key={f.k}
                  onClick={() => setFilter(f.k)}
                  className={`px-3 py-2 rounded-lg text-[11px] font-mono uppercase tracking-widest transition-colors ${
                    filter === f.k ? 'bg-primary text-white' : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  {f.l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filtered.map((r) => {
              const active = selected?.player.id === r.player.id;
              return (
                <button
                  key={r.player.id}
                  onClick={() => setSelectedId(r.player.id)}
                  className={`w-full text-left flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
                    active ? 'bg-accent/5 border-accent/40' : 'bg-black/40 border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white font-semibold truncate">{r.player.name}</p>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase truncate">{r.player.club} · {r.player.position}</p>
                  </div>
                  <span className={`flex-shrink-0 inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-full border ${
                    r.eligible ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {r.eligible ? <BadgeCheck size={11} /> : <AlertTriangle size={11} />}
                    {r.eligible ? 'Elegível' : 'Pendente'}
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-center py-10 text-zinc-600 font-mono text-sm">Nenhum jogador encontrado.</p>
            )}
          </div>
        </div>

        {/* Detalhe / validador */}
        {selected && <FifaValidator key={selected.player.id} record={selected} />}
      </div>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid #27272a;
          border-radius: 0.625rem;
          padding: 0.55rem 0.7rem;
          font-size: 0.78rem;
          font-family: var(--font-mono, monospace);
          color: #e4e4e7;
          outline: none;
        }
        .admin-input:focus { border-color: #00f5ff; }
      `}</style>
    </div>
  );
}

function FifaValidator({ record }: { record: ReturnType<typeof getPlayerFifaRecords>[number] }) {
  const [phase, setPhase] = useState<'idle' | 'processing' | 'validated'>('idle');
  const [activeStep, setActiveStep] = useState(-1);

  const runValidation = () => {
    if (phase === 'processing') return;
    setPhase('processing');
    setActiveStep(0);
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      if (step >= FIFA_CHECK_META.length) {
        clearInterval(timer);
        setActiveStep(FIFA_CHECK_META.length);
        setTimeout(() => setPhase(record.eligible ? 'validated' : 'idle'), 600);
      } else {
        setActiveStep(step);
      }
    }, 750);
  };

  return (
    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 h-fit lg:sticky lg:top-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-white uppercase tracking-wider text-sm">{record.player.name}</h3>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest border ${
          phase === 'validated'
            ? 'bg-green-500/10 border-green-500/40 text-green-400'
            : phase === 'processing'
            ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
            : record.eligible ? 'bg-green-500/10 border-green-500/40 text-green-400' : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
        }`}>
          {phase === 'processing' ? <Loader2 size={11} className="animate-spin" /> : record.eligible ? <BadgeCheck size={11} /> : <AlertTriangle size={11} />}
          {phase === 'processing' ? 'A processar' : record.eligible ? 'Elegível' : 'Pendente'}
        </span>
      </div>
      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-5">
        {record.player.club} · Plataforma de Conformidade
      </p>

      <div className="space-y-2.5 pt-4 border-t border-zinc-900/60">
        {FIFA_CHECK_META.map((check, idx) => {
          const Icon = CHECK_ICONS[check.key];
          const passed = record.status.checks[check.key];
          const isAuditing = phase === 'processing' && activeStep === idx;
          const isAudited = (phase === 'processing' && activeStep > idx) || phase === 'validated' || phase === 'idle';
          return (
            <div
              key={check.key}
              className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                isAuditing ? 'bg-cyan-500/5 border-cyan-500/30' : 'bg-black/40 border-zinc-900'
              }`}
            >
              <span className="flex items-center gap-2.5 font-mono text-[11px] text-zinc-300">
                <Icon size={14} className="text-zinc-500" /> {check.label}
              </span>
              <span className="text-[10px] font-mono uppercase">
                {isAuditing ? (
                  <span className="text-cyan-300 flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> A auditar</span>
                ) : isAudited ? (
                  passed ? (
                    <span className="text-green-400 flex items-center gap-1.5"><CheckCircle2 size={13} /> Conforme</span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1.5"><AlertTriangle size={13} /> Pendente</span>
                  )
                ) : null}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-5 border-t border-zinc-900/60">
        <AnimatePresence mode="wait">
          {phase === 'validated' ? (
            <motion.div
              key="cert"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-green-500/5 border border-green-500/30"
            >
              <BadgeCheck size={28} className="text-green-400 flex-shrink-0" />
              <div>
                <p className="font-display text-white uppercase tracking-wider text-xs">Certificado Emitido</p>
                <p className="text-[10px] font-mono text-zinc-500">
                  Ref. FC-{record.player.id.toUpperCase().slice(0, 6)}-{new Date().getFullYear()}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={runValidation}
              disabled={phase === 'processing'}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent/10 border border-accent/40 text-accent font-mono text-[11px] uppercase tracking-widest hover:bg-accent/20 transition-colors disabled:opacity-60"
            >
              {phase === 'processing' ? (
                <><Loader2 size={13} className="animate-spin" /> A validar…</>
              ) : (
                <><ShieldCheck size={13} /> Validar Elegibilidade</>
              )}
            </motion.button>
          )}
        </AnimatePresence>
        {phase === 'idle' && !record.eligible && (
          <p className="text-[10px] font-mono text-amber-400/80 mt-3 text-center">
            Requisitos pendentes — elegibilidade não pode ser certificada.
          </p>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECÇÃO: EQUIPAS
// ════════════════════════════════════════════════════════════════════════
function TeamsSection() {
  const standings = useMemo(() => getStandings(), []);
  const posByTeam = new Map(standings.map((s) => [s.teamId, s]));

  return (
    <div className="space-y-6">
      <SectionHeader icon={Users} subtitle="CLUBES_PARTICIPANTES" title="Equipas" />
      <Panel className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                <th className="px-4 py-3">Clube</th>
                <th className="px-4 py-3 hidden sm:table-cell">Cidade</th>
                <th className="px-4 py-3 hidden md:table-cell">Estádio</th>
                <th className="px-4 py-3 hidden lg:table-cell">Treinador</th>
                <th className="px-4 py-3 text-right">Pts</th>
              </tr>
            </thead>
            <tbody>
              {TEAMS.map((t) => {
                const s = posByTeam.get(t.id);
                return (
                  <tr key={t.id} className="border-b border-zinc-900/50 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <Link href={`/teams/${t.id}`} className="text-sm text-white font-semibold hover:text-accent transition-colors">{t.name}</Link>
                      <p className="text-[10px] font-mono text-zinc-600">Fund. {t.founded}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-zinc-400 font-mono text-xs">{t.city}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-zinc-400 font-mono text-xs">{t.stadium}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-zinc-400 font-mono text-xs">{t.coach}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-bold text-white">{s?.points ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECÇÃO: NOTÍCIAS
// ════════════════════════════════════════════════════════════════════════
function NewsSection() {
  const news = useMemo(() => getNewsArticles(), []);
  return (
    <div className="space-y-6">
      <SectionHeader icon={Newspaper} subtitle="GESTÃO_DE_CONTEÚDOS" title="Notícias" />
      <div className="space-y-3">
        {news.map((n) => (
          <Panel key={n.id} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[9px] font-mono bg-zinc-800/80 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider">{n.category}</span>
              <p className="text-sm text-white font-semibold mt-2">{n.title}</p>
              <p className="text-[11px] font-mono text-zinc-500 mt-1 line-clamp-2">{n.summary}</p>
            </div>
            <span className="flex-shrink-0 text-[10px] font-mono text-zinc-600">
              {new Date(n.date).toLocaleDateString('pt-AO')}
            </span>
          </Panel>
        ))}
      </div>
    </div>
  );
}
