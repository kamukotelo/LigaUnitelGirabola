'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CalendarDays, ShieldCheck, Users, Newspaper,
  Lock, LogOut, Save, RefreshCw, Database, Radio, Wifi, Trophy,
  Fingerprint, FileText, Plane, HeartPulse, Loader2, CheckCircle2,
  AlertTriangle, BadgeCheck, Search, Download, Home, Eye, EyeOff,
  Plus, Trash2, Pencil, Shirt, Flag,
} from 'lucide-react';
import {
  MATCHES, TEAMS, PLAYERS, getStandings, getNewsArticles,
  getPlayerFifaRecords, FIFA_CHECK_META, getTeamProfile, getMatchOfficials,
  SEASONS, UPCOMING_SEASON_ID, ANCAF_CALENDAR_SOURCE, getMatchesForSeason,
  type Match, type FifaCheckKey, type Team, type NewsArticle, type Player,
  type TrophyEntry, type KitEntry, type BoardMember,
} from '@/lib/data';
import TeamCrest from '@/components/ui/TeamCrest';
import { generateGirabolaCalendar } from '@/lib/ancaf-engine';

// ── Configuração local (gate de demonstração / persistência local) ──────
const PASSCODE = 'ancaf2026';
const AUTH_KEY = 'faf_admin_authed';
const CAL_KEY = 'faf_calendar_overrides';
const SYNC_KEY = 'faf_calendar_last_sync';
const SEED_KEY = 'ancaf_calendar_seed';
const TEAM_KEY = 'faf_team_overrides';
const NEWS_KEY = 'faf_news_store';
const PLAYER_KEY = 'faf_player_overrides';
const NOMINATION_KEY = 'faf_nomination_overrides';

type Section = 'dashboard' | 'calendar' | 'fifa' | 'teams' | 'players' | 'news' | 'nominations';

// ── Utilitário genérico de persistência local (overrides do admin) ───────
function readJSON<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; }
  catch { return fallback; }
}
function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

interface MatchOverride {
  date?: string;
  stadium?: string;
  status?: Match['status'];
  homeScore?: number;
  awayScore?: number;
  score?: string;
  referee?: string;
  broadcaster?: string;
  attendance?: number;
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
  const [dynamicSource, setDynamicSource] = useState(ANCAF_CALENDAR_SOURCE);

  useEffect(() => {
    // Leitura segura de armazenamento do browser apenas no cliente (evita mismatch de hidratação).
    /* eslint-disable react-hooks/set-state-in-effect */
    setAuthed(sessionStorage.getItem(AUTH_KEY) === '1');
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Buscar dados reais da semente no arranque
    fetch('/api/ancaf')
      .then((res) => res.json())
      .then((data) => {
        if (data.source) {
          setDynamicSource(data.source);
        }
      })
      .catch((err) => console.error('Erro ao buscar semente do calendário no painel:', err));
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
    { key: 'players', label: 'Jogadores', icon: ShieldCheck },
    { key: 'nominations', label: 'Nomeações', icon: Flag },
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
                CONSOLA_ADMINISTRATIVA_FAF
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display text-foreground uppercase leading-none">
              Gestão da <span className="text-primary italic">Plataforma</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase tracking-widest hover:text-foreground hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
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
                      : 'bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:border-zinc-200 dark:hover:border-zinc-800'
                  }`}
                >
                  <Icon size={15} /> {item.label}
                </button>
              );
            })}
          </nav>

          {/* Conteúdo */}
          <div className="min-w-0">
            {/* key={section} remonta e reproduz a animação de entrada a cada troca.
                Sem AnimatePresence mode="wait" (evita deadlock da animação de saída). */}
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {section === 'dashboard' && <DashboardSection onGo={setSection} />}
              {section === 'calendar' && <CalendarSection />}
              {section === 'fifa' && <FifaSection />}
              {section === 'teams' && <TeamsSection />}
              {section === 'players' && <PlayersSection />}
              {section === 'nominations' && <NominationsSection />}
              {section === 'news' && <NewsSection />}
            </motion.div>
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
        className="w-full max-w-sm bg-zinc-100/60 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-8 backdrop-blur-md"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent">
            <Lock size={20} />
          </div>
          <div>
            <h1 className="font-display text-foreground uppercase tracking-wider text-lg leading-none">Área Restrita</h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Acesso Administrativo FAF</p>
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
            className={`w-full bg-zinc-100 dark:bg-black/50 border rounded-xl py-3 pl-4 pr-11 text-sm text-foreground font-mono outline-none transition-colors ${
              error ? 'border-red-500/60' : 'border-zinc-200 dark:border-zinc-800 focus:border-accent'
            }`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
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
          Ambiente de demonstração · credencial: <span className="text-zinc-600 dark:text-zinc-400">ancaf2026</span>
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
      <h2 className="text-2xl md:text-3xl font-display text-foreground uppercase leading-none">{title}</h2>
    </div>
  );
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 ${className}`}>{children}</div>
  );
}

function ConnectionBadge({ icon: Icon, label, endpoint, ok = true }: { icon: React.ElementType; label: string; endpoint: string; ok?: boolean }) {
  return (
    <div className="flex items-center gap-3 bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-zinc-900 rounded-xl p-4">
      <div className={`p-2 rounded-lg ${ok ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs text-zinc-800 dark:text-zinc-200 truncate">{label}</p>
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
  const [dynamicSource, setDynamicSource] = useState(ANCAF_CALENDAR_SOURCE);

  useEffect(() => {
    fetch('/api/ancaf')
      .then((res) => res.json())
      .then((data) => {
        if (data.source) {
          setDynamicSource(data.source);
        }
      })
      .catch((err) => console.error('Erro ao buscar semente no dashboard:', err));
  }, []);

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
        <h3 className="text-sm font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Radio size={15} className="text-accent" /> Estado das Ligações
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ConnectionBadge icon={CalendarDays} label="ANCAF_CALENDAR" endpoint={`${dynamicSource.season} · cód. ${dynamicSource.accessCode}`} />
          <ConnectionBadge icon={Database} label="Base de Dados" endpoint="armazenamento · multimédia" />
          <ConnectionBadge icon={Wifi} label="FIFA Connect" endpoint="conformidade · elegibilidade" />
        </div>
      </Panel>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5">
              <Icon size={16} className="text-zinc-600 mb-3" />
              <p className="font-display text-3xl font-black text-foreground leading-none">{k.value}</p>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-2">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Atalhos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onClick={() => onGo('calendar')} className="text-left bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 hover:border-accent/40 rounded-2xl p-5 transition-colors group">
          <CalendarDays size={18} className="text-accent mb-3" />
          <p className="font-display text-foreground uppercase tracking-wider text-sm">Definir Calendário</p>
          <p className="text-[11px] font-mono text-zinc-500 mt-1">Gerir jornadas via ANCAF_CALENDAR</p>
        </button>
        <button onClick={() => onGo('fifa')} className="text-left bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 hover:border-accent/40 rounded-2xl p-5 transition-colors group">
          <ShieldCheck size={18} className="text-accent mb-3" />
          <p className="font-display text-foreground uppercase tracking-wider text-sm">Gerir FIFA Connect</p>
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
  const [seasonId, setSeasonId] = useState<string>(UPCOMING_SEASON_ID);
  const isUpcoming = seasonId === UPCOMING_SEASON_ID;

  // Chave do sorteio (seed). Determina o calendário da época futura: chaves
  // diferentes ⇒ calendários diferentes (todos cumprem as regras ANCAF).
  const [seed, setSeed] = useState<number>(Number(ANCAF_CALENDAR_SOURCE.accessCode) || 1357);
  const [seedInput, setSeedInput] = useState<string>(String(ANCAF_CALENDAR_SOURCE.accessCode));

  // A época futura é gerada no cliente a partir da chave (resultados diversos);
  // a época concluída mantém o histórico consolidado.
  const seasonMatches = useMemo(
    () => (isUpcoming ? generateGirabolaCalendar(seed, 2026, 'm27-') : getMatchesForSeason(seasonId)),
    [isUpcoming, seasonId, seed],
  );
  const rounds = useMemo(() => Array.from(new Set(seasonMatches.map((m) => m.round))).sort((a, b) => a - b), [seasonMatches]);
  const [round, setRound] = useState<number>(1);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [dynamicSource, setDynamicSource] = useState(ANCAF_CALENDAR_SOURCE);

  // Carregar persistência local e dados da semente
  useEffect(() => {
    // Carregar persistência local apenas no cliente (evita mismatch de hidratação).
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(CAL_KEY);
      if (raw) setOverrides(JSON.parse(raw));
    } catch { /* ignorar */ }
    setLastSync(localStorage.getItem(SYNC_KEY));
    const storedSeed = localStorage.getItem(SEED_KEY);
    if (storedSeed && Number.isFinite(Number(storedSeed))) {
      setSeed(Number(storedSeed));
      setSeedInput(storedSeed);
    }
    /* eslint-enable react-hooks/set-state-in-effect */

    // Buscar dados reais da semente
    fetch('/api/ancaf')
      .then((res) => res.json())
      .then((data) => {
        if (data.source) {
          setDynamicSource(data.source);
        }
      })
      .catch((err) => console.error('Erro ao buscar semente do calendário:', err));
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
    fetch('/api/ancaf')
      .then((res) => res.json())
      .then((data) => {
        if (data.source) {
          setDynamicSource(data.source);
        }
        const stamp = new Date().toISOString();
        localStorage.setItem(SYNC_KEY, stamp);
        setLastSync(stamp);
      })
      .catch((err) => console.error('Erro de sincronização:', err))
      .finally(() => {
        setSyncing(false);
      });
  };

  // Aplica uma nova chave de sorteio (regenera o calendário no cliente).
  const applySeed = (value: number) => {
    const s = Math.max(0, Math.floor(value));
    setSeed(s);
    setSeedInput(String(s));
    localStorage.setItem(SEED_KEY, String(s));
    setRound(1);
    setSavedAt(new Date().toISOString());
  };
  const randomSeed = () => applySeed(Math.floor(Math.random() * 8000) + 1); // 1..8000

  const merged = (m: Match): Match => ({ ...m, ...overrides[m.id] });
  const roundMatches = seasonMatches.filter((m) => m.round === round).map(merged);
  const editedCount = Object.keys(overrides).length;
  const seasonLabel = SEASONS.find((s) => s.id === seasonId)?.label ?? '';

  const exportCalendar = () => {
    const data = seasonMatches.map(merged);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faf-calendar-${seasonId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={CalendarDays} subtitle="DEFINIÇÃO_DO_CALENDÁRIO" title="Calendário · ANCAF_CALENDAR" />

      {/* Seletor de época */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mr-1">Época:</span>
        {SEASONS.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSeasonId(s.id); setRound(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
              seasonId === s.id
                ? 'bg-primary text-white border-primary'
                : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-foreground'
            }`}
          >
            {s.label}
            <span className={`ml-2 text-[9px] uppercase ${seasonId === s.id ? 'text-white/70' : 'text-zinc-500'}`}>
              {s.status === 'completed' ? 'Concluída' : 'Por disputar'}
            </span>
          </button>
        ))}
      </div>

      {/* Painel de ligação ANCAF_CALENDAR */}
      <Panel>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
              <Radio size={20} className={syncing ? 'animate-pulse' : ''} />
            </div>
            <div>
              <p className="font-display text-foreground uppercase tracking-wider text-sm flex items-center gap-2">
                ANCAF_CALENDAR
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Conectado
                </span>
              </p>
              <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                {isUpcoming ? (
                  <>Calendário {dynamicSource.season} · chave do sorteio <span className="text-green-400">{seed}</span></>
                ) : (
                  <>Época {seasonLabel} · resultados consolidados</>
                )}
              </p>
              <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                Última sincronização: {lastSync ? new Date(lastSync).toLocaleString('pt-AO') : new Date(dynamicSource.generatedAt).toLocaleString('pt-AO')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCalendar}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase tracking-widest hover:text-foreground transition-colors"
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

      {/* Chave do sorteio — só na época por disputar */}
      {isUpcoming && (
        <Panel className="border-accent/20 bg-accent/[0.03]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="font-display text-foreground uppercase tracking-wider text-sm flex items-center gap-2">
                <RefreshCw size={14} className="text-accent" /> Chave do Sorteio
              </p>
              <p className="text-[11px] font-mono text-zinc-500 mt-1 max-w-md">
                Cada chave gera um calendário diferente (mesma chave ⇒ sempre o mesmo). Todos cumprem as regras ANCAF (≤2 jogos seguidos casa/fora, 2 voltas, 15/15).
              </p>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); applySeed(Number(seedInput) || 0); }}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <input
                type="number"
                min={0}
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                className="admin-input w-28 text-center"
                placeholder="ex.: 1357"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-accent/10 border border-accent/40 text-accent font-mono text-[11px] uppercase tracking-widest hover:bg-accent/20 transition-colors"
              >
                <CheckCircle2 size={13} /> Aplicar
              </button>
              <button
                type="button"
                onClick={randomSeed}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/40 text-primary font-mono text-[11px] uppercase tracking-widest hover:bg-primary/20 transition-colors"
              >
                <RefreshCw size={13} /> Sortear
              </button>
            </form>
          </div>
        </Panel>
      )}

      {/* Seletor de jornada */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 uppercase mr-1">Jornada:</span>
        {rounds.map((r) => (
          <button
            key={r}
            onClick={() => setRound(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              round === r ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-foreground border border-zinc-200 dark:border-zinc-800'
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

      {/* Nota de revisão — o que está acautelado, restrições e consequências */}
      <Panel className="border-amber-500/20 bg-amber-500/[0.03]">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none select-none">
            <span className="flex items-center gap-2 font-display text-foreground uppercase tracking-wider text-xs sm:text-sm">
              <ShieldCheck size={15} className="text-amber-400" />
              Antes de confirmar — o que está acautelado nesta revisão
            </span>
            <span className="text-[10px] text-zinc-500 font-mono transition-transform group-open:rotate-180">▼</span>
          </summary>

          <div className="mt-4 pt-4 border-t border-amber-500/15 grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] leading-relaxed font-mono">
            {/* Acautelado */}
            <div>
              <p className="flex items-center gap-1.5 text-green-400 uppercase tracking-widest text-[10px] mb-2">
                <CheckCircle2 size={12} /> Acautelado
              </p>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <li>• Confrontos, mando e datas vêm do sorteio ANCAF (chave {seed}); o editor <strong className="text-foreground">não os recalcula</strong>.</li>
                <li>• O <strong className="text-foreground">resultado só fica editável</strong> quando o estado do jogo é «Terminado».</li>
                <li>• As alterações ficam <strong className="text-foreground">apenas neste navegador</strong> e não reescrevem o calendário oficial nem a classificação publicada.</li>
              </ul>
            </div>

            {/* Restrições */}
            <div>
              <p className="flex items-center gap-1.5 text-amber-400 uppercase tracking-widest text-[10px] mb-2">
                <AlertTriangle size={12} /> Restrições
              </p>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <li>• Não alterar os <strong className="text-foreground">confrontos/equipas</strong> de uma jornada (quebra o equilíbrio do sorteio a duas voltas).</li>
                <li>• Datas devem manter-se <strong className="text-foreground">dentro do calendário ANCAF</strong> (J1 22/08/26 … J30 15/05/27).</li>
                <li>• Evitar «Terminado» sem resultado válido, ou resultado sem marcar «Terminado».</li>
              </ul>
            </div>

            {/* Consequências */}
            <div>
              <p className="flex items-center gap-1.5 text-red-400 uppercase tracking-widest text-[10px] mb-2">
                <AlertTriangle size={12} /> Se ocorrerem
              </p>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <li>• A <strong className="text-foreground">classificação deixa de coincidir</strong> com os jogos (a tabela é derivada dos resultados).</li>
                <li>• Jogos fora das datas oficiais aparecem <strong className="text-foreground">desalinhados do cronograma</strong> ANCAF.</li>
                <li>• Limpar os dados do navegador <strong className="text-foreground">apaga as edições locais</strong> — exporte em JSON antes (botão «Exportar»).</li>
              </ul>
            </div>
          </div>
        </details>
      </Panel>

      {/* Editor de jogos */}
      <div className="space-y-3">
        {roundMatches.map((m) => {
          const isEdited = !!overrides[m.id];
          const finished = m.status === 'finished';
          return (
            <Panel key={m.id} className={isEdited ? 'border-accent/30' : ''}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-mono bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider">
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
                <Field label="Árbitro principal">
                  <input
                    type="text"
                    placeholder="Nomeação automática"
                    value={m.referee ?? ''}
                    onChange={(e) => update(m.id, { referee: e.target.value || undefined })}
                    className="admin-input"
                  />
                </Field>
                <Field label="Transmissão TV">
                  <input
                    type="text"
                    placeholder="Atribuição automática"
                    value={m.broadcaster ?? ''}
                    onChange={(e) => update(m.id, { broadcaster: e.target.value || undefined })}
                    className="admin-input"
                  />
                </Field>
                <Field label="Assistência (espectadores)">
                  <input
                    type="number"
                    min={0}
                    disabled={!finished}
                    placeholder="Estimada"
                    value={m.attendance ?? ''}
                    onChange={(e) => update(m.id, { attendance: e.target.value === '' ? undefined : Number(e.target.value) })}
                    className="admin-input disabled:opacity-40"
                  />
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
          <div key={s.label} className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-4">
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
                    filter === f.k ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:text-foreground'
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
                    active ? 'bg-accent/5 border-accent/40' : 'bg-zinc-100 dark:bg-black/40 border-zinc-200 dark:border-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-800'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm text-foreground font-semibold truncate">{r.player.name}</p>
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
    <div className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 h-fit lg:sticky lg:top-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-foreground uppercase tracking-wider text-sm">{record.player.name}</h3>
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

      <div className="space-y-2.5 pt-4 border-t border-zinc-200/60 dark:border-zinc-900/60">
        {FIFA_CHECK_META.map((check, idx) => {
          const Icon = CHECK_ICONS[check.key];
          const passed = record.status.checks[check.key];
          const isAuditing = phase === 'processing' && activeStep === idx;
          const isAudited = (phase === 'processing' && activeStep > idx) || phase === 'validated' || phase === 'idle';
          return (
            <div
              key={check.key}
              className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                isAuditing ? 'bg-cyan-500/5 border-cyan-500/30' : 'bg-zinc-100 dark:bg-black/40 border-zinc-200 dark:border-zinc-900'
              }`}
            >
              <span className="flex items-center gap-2.5 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
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

      <div className="mt-5 pt-5 border-t border-zinc-200/60 dark:border-zinc-900/60">
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
                <p className="font-display text-foreground uppercase tracking-wider text-xs">Certificado Emitido</p>
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

// ── Estilos partilhados dos inputs do admin (injetados por secção) ───────
function AdminInputStyles() {
  return (
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
      textarea.admin-input { resize: vertical; min-height: 72px; line-height: 1.5; }
    `}</style>
  );
}

// Barra de estado/ações reutilizada pelos editores (gravação + exportar + repor).
function EditorToolbar({
  editedLabel, savedAt, onExport, onReset, extra,
}: {
  editedLabel: string;
  savedAt: string | null;
  onExport: () => void;
  onReset?: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-[11px] font-mono text-zinc-500 inline-flex items-center gap-2">
        {editedLabel}
        {savedAt && (
          <span className="text-green-400 inline-flex items-center gap-1">
            <Save size={11} /> {new Date(savedAt).toLocaleTimeString('pt-AO')}
          </span>
        )}
      </span>
      <div className="flex items-center gap-2">
        {extra}
        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-colors"
          >
            <RefreshCw size={12} /> Repor tudo
          </button>
        )}
        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] uppercase tracking-widest hover:text-foreground transition-colors"
        >
          <Download size={12} /> Exportar
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECÇÃO: EQUIPAS (edição total dos clubes)
// ════════════════════════════════════════════════════════════════════════
function TeamsSection() {
  const standings = useMemo(() => getStandings(), []);
  const posByTeam = useMemo(() => new Map(standings.map((s) => [s.teamId, s])), [standings]);
  const [overrides, setOverrides] = useState<Record<string, Partial<Team>>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setOverrides(readJSON<Record<string, Partial<Team>>>(TEAM_KEY, {}));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const persist = (next: Record<string, Partial<Team>>) => {
    setOverrides(next);
    localStorage.setItem(TEAM_KEY, JSON.stringify(next));
    setSavedAt(new Date().toISOString());
  };
  const update = (id: string, patch: Partial<Team>) => persist({ ...overrides, [id]: { ...overrides[id], ...patch } });
  const resetTeam = (id: string) => { const n = { ...overrides }; delete n[id]; persist(n); };
  const merged = (t: Team): Team => ({ ...t, ...overrides[t.id] });
  const editedCount = Object.keys(overrides).length;

  return (
    <div className="space-y-6">
      <SectionHeader icon={Users} subtitle="GESTÃO_DE_CLUBES" title="Equipas" />
      <EditorToolbar
        editedLabel={editedCount > 0 ? `${editedCount} clube(s) com alterações locais` : 'Sem alterações locais'}
        savedAt={savedAt}
        onExport={() => downloadJSON('clubes-ancaf.json', TEAMS.map(merged))}
        onReset={editedCount > 0 ? () => persist({}) : undefined}
      />

      <div className="space-y-3">
        {TEAMS.map((base) => {
          const t = merged(base);
          const s = posByTeam.get(base.id);
          const isOpen = openId === base.id;
          const isEdited = !!overrides[base.id];
          const hex = t.colorsHex ?? ['#888888', '#cccccc'];
          return (
            <Panel key={base.id} className={isEdited ? 'border-accent/30' : ''}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <TeamCrest teamId={base.id} size={40} />
                    <span className="absolute -bottom-1 -right-1 flex rounded overflow-hidden border border-white/40 dark:border-black/40">
                      <span className="w-1.5 h-2.5" style={{ background: hex[0] }} />
                      <span className="w-1.5 h-2.5" style={{ background: hex[1] ?? hex[0] }} />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {t.name} <span className="text-zinc-500 font-mono text-[11px]">{t.shortName}</span>
                      {isEdited && <span className="ml-2 text-[8px] font-mono text-accent uppercase tracking-widest">editado</span>}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-600 truncate">{t.city} · {t.stadium} · {s?.points ?? 0} pts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {isEdited && (
                    <button onClick={() => resetTeam(base.id)} className="text-[10px] font-mono text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-widest">Repor</button>
                  )}
                  <button onClick={() => setOpenId(isOpen ? null : base.id)} className="inline-flex items-center gap-1.5 text-[10px] font-mono text-accent hover:text-accent/80 transition-colors uppercase tracking-widest">
                    <Pencil size={12} /> {isOpen ? 'Fechar' : 'Editar'}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-900/60">
                  <Field label="Nome do clube"><input className="admin-input" value={t.name} onChange={(e) => update(base.id, { name: e.target.value })} /></Field>
                  <Field label="Sigla"><input className="admin-input" maxLength={4} value={t.shortName} onChange={(e) => update(base.id, { shortName: e.target.value.toUpperCase() })} /></Field>
                  <Field label="Cidade"><input className="admin-input" value={t.city} onChange={(e) => update(base.id, { city: e.target.value })} /></Field>
                  <Field label="Estádio"><input className="admin-input" value={t.stadium} onChange={(e) => update(base.id, { stadium: e.target.value })} /></Field>
                  <Field label="Capacidade"><input type="number" min={0} className="admin-input" value={t.stadiumCapacity} onChange={(e) => update(base.id, { stadiumCapacity: Number(e.target.value) })} /></Field>
                  <Field label="Ano de fundação"><input type="number" className="admin-input" value={t.founded} onChange={(e) => update(base.id, { founded: Number(e.target.value) })} /></Field>
                  <Field label="Treinador"><input className="admin-input" value={t.coach} onChange={(e) => update(base.id, { coach: e.target.value })} /></Field>
                  <Field label="Denominação oficial"><input className="admin-input" placeholder={t.name} value={t.officialName ?? ''} onChange={(e) => update(base.id, { officialName: e.target.value || undefined })} /></Field>
                  <Field label="Presidente"><input className="admin-input" value={t.president ?? ''} onChange={(e) => update(base.id, { president: e.target.value || undefined })} /></Field>
                  <Field label="Site oficial"><input className="admin-input" placeholder="https://…" value={t.website ?? ''} onChange={(e) => update(base.id, { website: e.target.value || undefined })} /></Field>
                  <Field label="Cores (descrição)"><input className="admin-input" value={t.colors} onChange={(e) => update(base.id, { colors: e.target.value })} /></Field>
                  <Field label="Paleta (principal · secundária)">
                    <div className="flex gap-2 items-center">
                      <input type="color" value={hex[0]} onChange={(e) => update(base.id, { colorsHex: [e.target.value, hex[1] ?? hex[0]] })} className="h-9 w-14 rounded bg-transparent border border-zinc-700 cursor-pointer" />
                      <input type="color" value={hex[1] ?? hex[0]} onChange={(e) => update(base.id, { colorsHex: [hex[0], e.target.value] })} className="h-9 w-14 rounded bg-transparent border border-zinc-700 cursor-pointer" />
                    </div>
                  </Field>
                </div>
              )}

              {isOpen && (
                <TeamProfileEditor teamId={base.id} team={t} onUpdate={(patch) => update(base.id, patch)} />
              )}
            </Panel>
          );
        })}
      </div>
      <AdminInputStyles />
    </div>
  );
}

// ── Editor de perfil institucional: palmarés, equipamentos e órgãos sociais ──
function TeamProfileEditor({ teamId, team, onUpdate }: { teamId: string; team: Team; onUpdate: (patch: Partial<Team>) => void }) {
  const profile = getTeamProfile(teamId);
  const palmares: TrophyEntry[] = team.palmares ?? profile?.palmares ?? [];
  const kits: KitEntry[] = team.kits ?? profile?.kits ?? [];
  const board: BoardMember[] = team.board ?? profile?.board ?? [];

  const patchAt = <T,>(arr: T[], i: number, patch: Partial<T>): T[] => arr.map((x, idx) => (idx === i ? { ...x, ...patch } : x));
  const removeAt = <T,>(arr: T[], i: number): T[] => arr.filter((_, idx) => idx !== i);

  const rowBtn = 'p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors flex-shrink-0';
  const addBtn = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent font-mono text-[10px] uppercase tracking-widest hover:bg-accent/20 transition-colors';

  return (
    <div className="mt-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-900/60 space-y-6">

      {/* Palmarés */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest flex items-center gap-1.5"><Trophy size={12} /> Palmarés</span>
          <button className={addBtn} onClick={() => onUpdate({ palmares: [...palmares, { title: '', count: 1 }] })}>
            <Plus size={11} /> Troféu
          </button>
        </div>
        {palmares.length === 0 && <p className="text-[10px] font-mono text-zinc-500 italic">Sem títulos registados.</p>}
        {palmares.map((trophy, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <input className="admin-input flex-1 min-w-[140px]" placeholder="Título" value={trophy.title} onChange={(e) => onUpdate({ palmares: patchAt(palmares, i, { title: e.target.value }) })} />
            <input type="number" min={0} className="admin-input w-16 text-center" value={trophy.count} onChange={(e) => onUpdate({ palmares: patchAt(palmares, i, { count: Number(e.target.value) }) })} />
            <input className="admin-input flex-1 min-w-[140px]" placeholder="Épocas (ex.: 2025/26, 2023/24)" value={(trophy.seasons ?? []).join(', ')} onChange={(e) => onUpdate({ palmares: patchAt(palmares, i, { seasons: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }) })} />
            <button className={rowBtn} onClick={() => onUpdate({ palmares: removeAt(palmares, i) })} aria-label="Remover troféu"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>

      {/* Equipamentos */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest flex items-center gap-1.5"><Shirt size={12} /> Equipamentos</span>
          <button className={addBtn} onClick={() => onUpdate({ kits: [...kits, { label: '', colors: ['#5C0F8B', '#E6540F'] }] })}>
            <Plus size={11} /> Equipamento
          </button>
        </div>
        {kits.map((kit, i) => {
          const colors = kit.colors.length > 0 ? kit.colors : ['#5C0F8B', '#E6540F'];
          return (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input className="admin-input flex-1 min-w-[140px]" placeholder="Ex.: Principal, Alternativo" value={kit.label} onChange={(e) => onUpdate({ kits: patchAt(kits, i, { label: e.target.value }) })} />
              <input type="color" value={colors[0]} onChange={(e) => onUpdate({ kits: patchAt(kits, i, { colors: [e.target.value, colors[1] ?? colors[0]] }) })} className="h-9 w-14 rounded bg-transparent border border-zinc-700 cursor-pointer flex-shrink-0" />
              <input type="color" value={colors[1] ?? colors[0]} onChange={(e) => onUpdate({ kits: patchAt(kits, i, { colors: [colors[0], e.target.value] }) })} className="h-9 w-14 rounded bg-transparent border border-zinc-700 cursor-pointer flex-shrink-0" />
              <button className={rowBtn} onClick={() => onUpdate({ kits: removeAt(kits, i) })} aria-label="Remover equipamento"><Trash2 size={13} /></button>
            </div>
          );
        })}
      </div>

      {/* Órgãos sociais / direção */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-accent uppercase tracking-widest flex items-center gap-1.5"><Users size={12} /> Órgãos Sociais</span>
          <button className={addBtn} onClick={() => onUpdate({ board: [...board, { role: '', name: '' }] })}>
            <Plus size={11} /> Membro
          </button>
        </div>
        {board.length === 0 && <p className="text-[10px] font-mono text-zinc-500 italic">Sem membros registados.</p>}
        {board.map((member, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <input className="admin-input flex-1 min-w-[120px]" placeholder="Cargo (ex.: Presidente)" value={member.role} onChange={(e) => onUpdate({ board: patchAt(board, i, { role: e.target.value }) })} />
            <input className="admin-input flex-1 min-w-[140px]" placeholder="Nome" value={member.name} onChange={(e) => onUpdate({ board: patchAt(board, i, { name: e.target.value }) })} />
            <button className={rowBtn} onClick={() => onUpdate({ board: removeAt(board, i) })} aria-label="Remover membro"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>

    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECÇÃO: NOMEAÇÕES DE ARBITRAGEM (por jornada)
// ════════════════════════════════════════════════════════════════════════
interface NominationOverride {
  referee?: string;
  assistants?: [string, string];
  fourth?: string;
}

function NominationsSection() {
  const [seasonId, setSeasonId] = useState<string>(UPCOMING_SEASON_ID);
  const [round, setRound] = useState<number>(1);
  const [overrides, setOverrides] = useState<Record<string, NominationOverride>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setOverrides(readJSON<Record<string, NominationOverride>>(NOMINATION_KEY, {}));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const persist = (next: Record<string, NominationOverride>) => {
    setOverrides(next);
    localStorage.setItem(NOMINATION_KEY, JSON.stringify(next));
    setSavedAt(new Date().toISOString());
  };
  const update = (id: string, patch: NominationOverride) => persist({ ...overrides, [id]: { ...overrides[id], ...patch } });

  const matches = useMemo(() => getMatchesForSeason(seasonId), [seasonId]);
  const rounds = useMemo(() => Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b), [matches]);
  const roundMatches = matches.filter((m) => m.round === round);
  const editedCount = Object.keys(overrides).length;

  // Combina nomeação derivada (getMatchOfficials) com os overrides do admin.
  const resolved = (m: Match) => {
    const base = getMatchOfficials(m);
    const o = overrides[m.id] ?? {};
    return {
      referee: o.referee ?? base.referee,
      assistants: o.assistants ?? base.assistants,
      fourth: o.fourth ?? base.fourth,
    };
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={Flag} subtitle="CONSELHO_DE_ARBITRAGEM" title="Nomeações" />
      <EditorToolbar
        editedLabel={editedCount > 0 ? `${editedCount} nomeação(ões) com alterações locais` : 'Sem alterações locais'}
        savedAt={savedAt}
        onExport={() => downloadJSON('nomeacoes-ancaf.json', matches.map((m) => ({ matchId: m.id, round: m.round, homeTeam: m.homeTeam, awayTeam: m.awayTeam, ...resolved(m) })))}
        onReset={editedCount > 0 ? () => persist({}) : undefined}
      />

      {/* Seletores de época e jornada */}
      <Panel>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex-shrink-0">Época</span>
          <div className="flex gap-1.5">
            {SEASONS.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSeasonId(s.id); setRound(1); }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-widest transition-colors ${seasonId === s.id ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:text-foreground'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {rounds.map((r) => (
            <button
              key={r}
              onClick={() => setRound(r)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-widest whitespace-nowrap flex-shrink-0 transition-colors ${round === r ? 'bg-accent text-black' : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:text-foreground'}`}
            >
              J{r}
            </button>
          ))}
        </div>
      </Panel>

      {/* Editor de nomeações da jornada */}
      <div className="space-y-3">
        {roundMatches.map((m) => {
          const nom = resolved(m);
          const isEdited = !!overrides[m.id];
          return (
            <Panel key={m.id} className={isEdited ? 'border-accent/30' : ''}>
              <div className="flex items-center gap-3 mb-4">
                <TeamCrest teamId={m.homeTeamId} size={24} />
                <span className="text-xs font-semibold text-foreground">{m.homeTeam} vs {m.awayTeam}</span>
                <TeamCrest teamId={m.awayTeamId} size={24} />
                {isEdited && <span className="text-[8px] font-mono text-accent uppercase tracking-widest">editado</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Field label="Árbitro principal">
                  <input className="admin-input" value={nom.referee} onChange={(e) => update(m.id, { referee: e.target.value })} />
                </Field>
                <Field label="1.º Assistente">
                  <input className="admin-input" value={nom.assistants[0]} onChange={(e) => update(m.id, { assistants: [e.target.value, nom.assistants[1]] })} />
                </Field>
                <Field label="2.º Assistente">
                  <input className="admin-input" value={nom.assistants[1]} onChange={(e) => update(m.id, { assistants: [nom.assistants[0], e.target.value] })} />
                </Field>
                <Field label="4.º Árbitro">
                  <input className="admin-input" value={nom.fourth} onChange={(e) => update(m.id, { fourth: e.target.value })} />
                </Field>
              </div>
            </Panel>
          );
        })}
      </div>
      <AdminInputStyles />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECÇÃO: JOGADORES (edição de plantéis)
// ════════════════════════════════════════════════════════════════════════
function PlayersSection() {
  const [overrides, setOverrides] = useState<Record<string, Partial<Player>>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>(PLAYERS[0]?.id ?? '');

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setOverrides(readJSON<Record<string, Partial<Player>>>(PLAYER_KEY, {}));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const persist = (next: Record<string, Partial<Player>>) => {
    setOverrides(next);
    localStorage.setItem(PLAYER_KEY, JSON.stringify(next));
    setSavedAt(new Date().toISOString());
  };
  const update = (id: string, patch: Partial<Player>) => persist({ ...overrides, [id]: { ...overrides[id], ...patch } });
  const resetPlayer = (id: string) => { const n = { ...overrides }; delete n[id]; persist(n); };
  const merged = (p: Player): Player => ({ ...p, ...overrides[p.id] });
  const editedCount = Object.keys(overrides).length;

  const filtered = PLAYERS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  const baseSel = PLAYERS.find((p) => p.id === selectedId) ?? filtered[0] ?? PLAYERS[0];

  if (!baseSel) return null;
  const sel = merged(baseSel);
  const selEdited = !!overrides[baseSel.id];

  const numField = (label: string, key: 'jerseyNumber' | 'age' | 'goals' | 'assists' | 'appearances', value: number) => (
    <Field label={label}>
      <input type="number" min={0} className="admin-input" value={value} onChange={(e) => update(baseSel.id, { [key]: Number(e.target.value) })} />
    </Field>
  );

  return (
    <div className="space-y-6">
      <SectionHeader icon={Shirt} subtitle="GESTÃO_DE_PLANTÉIS" title="Jogadores" />
      <EditorToolbar
        editedLabel={editedCount > 0 ? `${editedCount} jogador(es) com alterações locais` : 'Sem alterações locais'}
        savedAt={savedAt}
        onExport={() => downloadJSON('jogadores-ancaf.json', PLAYERS.map(merged))}
        onReset={editedCount > 0 ? () => persist({}) : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* Lista + pesquisa */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar jogador…" className="admin-input pl-9" />
          </div>
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filtered.map((p) => {
              const active = baseSel.id === p.id;
              const edited = !!overrides[p.id];
              const m = merged(p);
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
                    active ? 'bg-accent/5 border-accent/40' : 'bg-zinc-100 dark:bg-black/40 border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm text-foreground font-semibold truncate">
                      {m.name} {edited && <span className="text-[8px] font-mono text-accent uppercase tracking-widest">editado</span>}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase truncate">{m.club} · {m.position}</p>
                  </div>
                  <span className="flex-shrink-0 font-mono text-xs text-zinc-500">#{m.jerseyNumber}</span>
                </button>
              );
            })}
            {filtered.length === 0 && <p className="text-center py-10 text-zinc-600 font-mono text-sm">Nenhum jogador encontrado.</p>}
          </div>
        </div>

        {/* Editor do jogador selecionado */}
        <div className="bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 h-fit lg:sticky lg:top-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-foreground uppercase tracking-wider text-sm truncate">{sel.name}</h3>
            {selEdited && (
              <button onClick={() => resetPlayer(baseSel.id)} className="text-[10px] font-mono text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-widest">Repor</button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Field label="Nome"><input className="admin-input" value={sel.name} onChange={(e) => update(baseSel.id, { name: e.target.value })} /></Field></div>
            <div className="col-span-2">
              <Field label="Clube">
                <select
                  className="admin-input"
                  value={sel.teamId}
                  onChange={(e) => { const tm = TEAMS.find((x) => x.id === e.target.value); update(baseSel.id, { teamId: e.target.value, club: tm?.name ?? sel.club }); }}
                >
                  {TEAMS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Posição"><input className="admin-input" value={sel.position} onChange={(e) => update(baseSel.id, { position: e.target.value })} /></Field>
            {numField('Nº camisola', 'jerseyNumber', sel.jerseyNumber)}
            <Field label="Nacionalidade"><input className="admin-input" value={sel.nationality} onChange={(e) => update(baseSel.id, { nationality: e.target.value })} /></Field>
            {numField('Idade', 'age', sel.age)}
            {numField('Golos', 'goals', sel.goals)}
            {numField('Assistências', 'assists', sel.assists)}
            {numField('Jogos', 'appearances', sel.appearances)}
          </div>
        </div>
      </div>
      <AdminInputStyles />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECÇÃO: NOTÍCIAS (criar · editar · remover)
// ════════════════════════════════════════════════════════════════════════
interface NewsStore { overrides: Record<string, Partial<NewsArticle>>; added: NewsArticle[]; deleted: string[]; }

function NewsSection() {
  const base = useMemo(() => getNewsArticles(), []);
  const [store, setStore] = useState<NewsStore>({ overrides: {}, added: [], deleted: [] });
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setStore(readJSON<NewsStore>(NEWS_KEY, { overrides: {}, added: [], deleted: [] }));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const persist = (next: NewsStore) => {
    setStore(next);
    localStorage.setItem(NEWS_KEY, JSON.stringify(next));
    setSavedAt(new Date().toISOString());
  };
  const updateArt = (id: string, patch: Partial<NewsArticle>) =>
    persist({ ...store, overrides: { ...store.overrides, [id]: { ...store.overrides[id], ...patch } } });
  const addArt = () => {
    const id = `news-custom-${Date.now()}`;
    const art: NewsArticle = { id, title: 'Nova notícia', category: 'Geral', date: new Date().toISOString(), summary: '', content: '' };
    persist({ ...store, added: [art, ...store.added] });
    setOpenId(id);
  };
  const deleteArt = (id: string, isAdded: boolean) => {
    if (isAdded) persist({ ...store, added: store.added.filter((a) => a.id !== id) });
    else persist({ ...store, deleted: [...store.deleted, id] });
    if (openId === id) setOpenId(null);
  };

  const list = [...store.added, ...base]
    .filter((a) => !store.deleted.includes(a.id))
    .map((a) => ({ ...a, ...store.overrides[a.id] }));
  const isAddedId = (id: string) => store.added.some((a) => a.id === id);
  const editedCount = Object.keys(store.overrides).length + store.added.length + store.deleted.length;

  return (
    <div className="space-y-6">
      <SectionHeader icon={Newspaper} subtitle="GESTÃO_DE_CONTEÚDOS" title="Notícias" />
      <EditorToolbar
        editedLabel={editedCount > 0 ? `${editedCount} alteração(ões) local(is) · ${list.length} notícias` : `${list.length} notícias`}
        savedAt={savedAt}
        onExport={() => downloadJSON('noticias-ancaf.json', list)}
        onReset={editedCount > 0 ? () => persist({ overrides: {}, added: [], deleted: [] }) : undefined}
        extra={
          <button onClick={addArt} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent/10 border border-accent/40 text-accent font-mono text-[10px] uppercase tracking-widest hover:bg-accent/20 transition-colors">
            <Plus size={12} /> Nova
          </button>
        }
      />

      <div className="space-y-3">
        {list.map((n) => {
          const isOpen = openId === n.id;
          const added = isAddedId(n.id);
          const edited = !!store.overrides[n.id] || added;
          return (
            <Panel key={n.id} className={edited ? 'border-accent/30' : ''}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[9px] font-mono bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider">{n.category}</span>
                  {added && <span className="ml-2 text-[8px] font-mono text-accent uppercase tracking-widest">novo</span>}
                  <p className="text-sm text-foreground font-semibold mt-2 truncate">{n.title}</p>
                  <p className="text-[11px] font-mono text-zinc-500 mt-1 line-clamp-2">{n.summary}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button onClick={() => deleteArt(n.id, added)} className="text-zinc-500 hover:text-red-400 transition-colors" title="Remover"><Trash2 size={14} /></button>
                  <button onClick={() => setOpenId(isOpen ? null : n.id)} className="inline-flex items-center gap-1.5 text-[10px] font-mono text-accent hover:text-accent/80 transition-colors uppercase tracking-widest">
                    <Pencil size={12} /> {isOpen ? 'Fechar' : 'Editar'}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-900/60">
                  <Field label="Título"><input className="admin-input" value={n.title} onChange={(e) => updateArt(n.id, { title: e.target.value })} /></Field>
                  <Field label="Categoria"><input className="admin-input" value={n.category} onChange={(e) => updateArt(n.id, { category: e.target.value })} /></Field>
                  <div className="sm:col-span-2"><Field label="Data"><input className="admin-input" value={n.date} onChange={(e) => updateArt(n.id, { date: e.target.value })} /></Field></div>
                  <div className="sm:col-span-2"><Field label="Resumo"><textarea className="admin-input" value={n.summary} onChange={(e) => updateArt(n.id, { summary: e.target.value })} /></Field></div>
                  <div className="sm:col-span-2"><Field label="Conteúdo"><textarea className="admin-input" style={{ minHeight: 140 }} value={n.content ?? ''} onChange={(e) => updateArt(n.id, { content: e.target.value })} /></Field></div>
                </div>
              )}
            </Panel>
          );
        })}
        {list.length === 0 && <p className="text-center py-10 text-zinc-600 font-mono text-sm">Sem notícias. Use «Nova» para criar.</p>}
      </div>
      <AdminInputStyles />
    </div>
  );
}
