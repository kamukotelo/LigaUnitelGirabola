'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CalendarDays, ShieldCheck, Users, Newspaper,
  LogOut, Save, RefreshCw, Database, Radio, Wifi, Trophy,
  Fingerprint, FileText, Plane, HeartPulse, Loader2, CheckCircle2,
  AlertTriangle, BadgeCheck, Search, Download, Home,
  Plus, Trash2, Pencil, Shirt, Flag, ImagePlus, Palette, Undo2, BarChart3, Sparkles, ExternalLink,
} from 'lucide-react';
import {
  MATCHES, TEAMS, PLAYERS, newsMock, getStandings, getNewsArticles,
  getPlayerFifaRecords, FIFA_CHECK_META, getTeamProfile,
  SEASONS, UPCOMING_SEASON_ID, ANCAF_CALENDAR_SOURCE, getMatchesForSeason,
  DEFAULT_SITE_SETTINGS, computeStandings, CURRENT_SEASON_ID,
  type Match, type FifaCheckKey, type Team, type NewsArticle, type Player,
  type TrophyEntry, type KitEntry, type BoardMember, type SiteSettings,
} from '@/lib/data';
import TeamCrest from '@/components/ui/TeamCrest';
import { readTeamOverrides, writeTeamOverrides, fileToLogoDataUrl } from '@/lib/team-overrides';
import { publishOverride, type OverrideSection } from '@/lib/portal-overrides';
import { supabase } from '@/lib/supabase';

// ── Configuração local (persistência local dos overrides do admin) ──────
// A autenticação é feita no servidor (ver AdminGuard + /api/admin/*); esta
// consola só é renderizada quando a sessão é válida.
const CAL_KEY = 'faf_calendar_overrides';
const SYNC_KEY = 'faf_calendar_last_sync';
const NEWS_KEY = 'faf_news_store';
const PLAYER_KEY = 'faf_player_overrides';
const NOMINATION_KEY = 'faf_nomination_overrides';
// Chave própria do rascunho de equipas. NÃO reutilizar `faf_team_overrides`
// (TEAM_OVERRIDES_KEY): esse guarda o mapa plano que alimenta a pré-visualização
// dos emblemas e as duas formas corromper-se-iam mutuamente.
const TEAM_KEY = 'faf_team_store';
const SITE_KEY = 'faf_site_settings';

type Section = 'dashboard' | 'site' | 'calendar' | 'competition' | 'fifa' | 'teams' | 'players' | 'news' | 'nominations' | 'logos';

// ════════════════════════════════════════════════════════════════════════
// RASCUNHO EDITÁVEL + GRAVAÇÃO EXPLÍCITA
// ────────────────────────────────────────────────────────────────────────
// Cada secção edita um rascunho local. Nada chega ao site público enquanto o
// utilizador não carregar em «Guardar alterações» — o que evita publicações
// acidentais a cada tecla e torna claro o que está por confirmar.
// ════════════════════════════════════════════════════════════════════════

/** Comunica ao painel-raiz se a secção aberta tem alterações por guardar. */
const DirtyContext = React.createContext<(dirty: boolean) => void>(() => {});

interface DraftController<T> {
  draft: T;
  setDraft: (next: T) => void;
  dirty: boolean;
  saving: boolean;
  savedAt: string | null;
  error: string | null;
  save: () => Promise<void>;
  publish: (next: T) => Promise<boolean>;
  discard: () => void;
}

function useEditorDraft<T>(section: OverrideSection, storageKey: string, initial: T): DraftController<T> {
  const [draft, setDraft] = useState<T>(initial);
  const [baseline, setBaseline] = useState<T>(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reportDirty = React.useContext(DirtyContext);

  // O estado publicado já foi semeado no localStorage pelo painel-raiz, por
  // isso ler daqui devolve o que está efetivamente no ar.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const stored = readJSON<T>(storageKey, initial);
    setDraft(stored);
    setBaseline(stored);
    /* eslint-enable react-hooks/set-state-in-effect */
    // `initial` é um valor de arranque estável por secção — não entra nas deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(baseline);

  useEffect(() => {
    reportDirty(dirty);
    return () => reportDirty(false);
  }, [dirty, reportDirty]);

  const publish = async (next: T): Promise<boolean> => {
    setSaving(true);
    setError(null);
    try {
      await publishOverride(section, next);
      localStorage.setItem(storageKey, JSON.stringify(next));
      setDraft(next);
      setBaseline(next);
      setSavedAt(new Date().toISOString());
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível publicar as alterações.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    await publish(draft);
  };

  const discard = () => {
    setDraft(baseline);
    setError(null);
  };

  return { draft, setDraft, dirty, saving, savedAt, error, save, publish, discard };
}

/**
 * Barra fixa de gravação — mostra quantas alterações estão por publicar e
 * concentra as ações de guardar/descartar/exportar de cada secção.
 */
function SaveBar<T>({
  ctl, pendingLabel, onExport, onResetAll, extra,
}: {
  ctl: DraftController<T>;
  pendingLabel: string;
  onExport?: () => void;
  onResetAll?: () => void;
  extra?: React.ReactNode;
}) {
  const { dirty, saving, savedAt, error, save, discard } = ctl;
  return (
    <div className="sticky top-2 z-30 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/85 backdrop-blur px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
            {dirty ? (
              <span className="inline-flex items-center gap-1.5 text-amber-500">
                <AlertTriangle size={12} /> {pendingLabel} por guardar
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-green-500">
                <CheckCircle2 size={12} /> Tudo publicado
              </span>
            )}
          </p>
          {savedAt && !dirty && (
            <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
              Publicado às {new Date(savedAt).toLocaleTimeString('pt-AO')} · visível para todos os visitantes
            </p>
          )}
          {error && <p className="text-[10px] font-mono text-red-400 mt-0.5">{error}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {extra}
          {onResetAll && (
            <button
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-colors"
            >
              <RefreshCw size={12} /> Repor tudo
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] uppercase tracking-widest hover:text-foreground transition-colors"
            >
              <Download size={12} /> Exportar
            </button>
          )}
          <button
            onClick={discard}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-[10px] uppercase tracking-widest hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Undo2 size={12} /> Descartar
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-mono text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            {saving ? 'A guardar…' : 'Guardar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

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

function makeAdminId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

interface MatchOverride {
  date?: string;
  scheduleStatus?: Match['scheduleStatus'];
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
  const [section, setSection] = useState<Section>('dashboard');
  const [seeded, setSeeded] = useState(false);
  // Alterações por guardar na secção aberta — usado para avisar antes de
  // trocar de secção, sair da consola ou fechar o separador.
  const [dirty, setDirty] = useState(false);
  const reportDirty = React.useCallback((d: boolean) => setDirty(d), []);

  useEffect(() => {
    // Semeia o localStorage com os overrides publicados no servidor, para que a
    // consola edite sobre o estado atual (evita sobrescrever o que já está
    // publicado com o estado local vazio de um novo dispositivo).
    let cancelled = false;
    fetch('/api/admin/overrides', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.overrides) return;
        const o = data.overrides as Record<string, unknown>;
        if (o.calendar) localStorage.setItem(CAL_KEY, JSON.stringify(o.calendar));
        if (o.news) localStorage.setItem(NEWS_KEY, JSON.stringify(o.news));
        if (o.players) localStorage.setItem(PLAYER_KEY, JSON.stringify(o.players));
        if (o.nominations) localStorage.setItem(NOMINATION_KEY, JSON.stringify(o.nominations));
        if (o.teams) localStorage.setItem(TEAM_KEY, JSON.stringify(o.teams));
        if (o.site) localStorage.setItem(SITE_KEY, JSON.stringify(o.site));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setSeeded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Aviso do navegador ao fechar/recarregar com alterações por publicar.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  /** Só troca de secção depois de confirmar o descarte de alterações pendentes. */
  const goToSection = (next: Section) => {
    if (section === next) return;
    if (dirty && !window.confirm('Tem alterações por guardar nesta secção. Sair sem guardar?')) return;
    setDirty(false);
    setSection(next);
  };

  const logout = async () => {
    // Termina a sessão no servidor (apaga o cookie httpOnly) e volta ao portal.
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignora falhas de rede — segue para a página inicial de qualquer forma.
    }
    window.location.href = '/';
  };

  if (!seeded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500 font-mono text-xs uppercase tracking-widest">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          A carregar estado publicado...
        </div>
      </div>
    );
  }

  // Navegação agrupada por domínio — a consola cresceu e uma lista corrida
  // deixava de deixar claro onde cada tipo de informação se edita.
  const navGroups: { title: string; items: { key: Section; label: string; icon: React.ElementType }[] }[] = [
    {
      title: 'Geral',
      items: [{ key: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard }],
    },
    {
      title: 'Identidade',
      items: [
        { key: 'site', label: 'Site e Marca', icon: Palette },
        { key: 'logos', label: 'Logótipos', icon: ImagePlus },
      ],
    },
    {
      title: 'Competição',
      items: [
        { key: 'calendar', label: 'Calendário · ANCAF', icon: CalendarDays },
        { key: 'competition', label: 'Jogos e Classificação', icon: BarChart3 },
        { key: 'nominations', label: 'Nomeações', icon: Flag },
      ],
    },
    {
      title: 'Entidades',
      items: [
        { key: 'teams', label: 'Equipas', icon: Users },
        { key: 'players', label: 'Jogadores', icon: Shirt },
      ],
    },
    {
      title: 'Conteúdos e Conformidade',
      items: [
        { key: 'news', label: 'Notícias', icon: Newspaper },
        { key: 'fifa', label: 'FIFA Connect', icon: ShieldCheck },
      ],
    },
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
            {dirty && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono text-[10px] uppercase tracking-widest">
                <AlertTriangle size={12} /> Por guardar
              </span>
            )}
            <Link
              href="/"
              target="_blank"
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
          {/* Navegação lateral, agrupada por domínio */}
          <nav className="flex lg:flex-col gap-4 overflow-x-auto pb-2 lg:pb-0">
            {navGroups.map((group) => (
              <div key={group.title} className="flex lg:flex-col gap-1.5 flex-shrink-0">
                <p className="hidden lg:block text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 px-1 mb-0.5">
                  {group.title}
                </p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = section === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => goToSection(item.key)}
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
              </div>
            ))}
          </nav>

          {/* Conteúdo */}
          <div className="min-w-0">
            {/* key={section} remonta e reproduz a animação de entrada a cada troca.
                Sem AnimatePresence mode="wait" (evita deadlock da animação de saída). */}
            <DirtyContext.Provider value={reportDirty}>
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {section === 'dashboard' && <DashboardSection onGo={goToSection} />}
                {section === 'site' && <SiteSection />}
                {section === 'calendar' && <CalendarSection />}
                {section === 'competition' && <CompetitionSection />}
                {section === 'fifa' && <FifaSection />}
                {section === 'teams' && <TeamsSection />}
                {section === 'players' && <PlayersSection />}
                {section === 'nominations' && <NominationsSection />}
                {section === 'news' && <NewsSection />}
                {section === 'logos' && <LogosSection />}
              </motion.div>
            </DirtyContext.Provider>
          </div>
        </div>
      </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button onClick={() => onGo('site')} className="text-left bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 hover:border-accent/40 rounded-2xl p-5 transition-colors group">
          <Palette size={18} className="text-accent mb-3" />
          <p className="font-display text-foreground uppercase tracking-wider text-sm">Site e Marca</p>
          <p className="text-[11px] font-mono text-zinc-500 mt-1">Cores, textos, contactos e SEO</p>
        </button>
        <button onClick={() => onGo('logos')} className="text-left bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 hover:border-accent/40 rounded-2xl p-5 transition-colors group">
          <ImagePlus size={18} className="text-accent mb-3" />
          <p className="font-display text-foreground uppercase tracking-wider text-sm">Logótipos</p>
          <p className="text-[11px] font-mono text-zinc-500 mt-1">Marca oficial e emblemas dos clubes</p>
        </button>
        <button onClick={() => onGo('calendar')} className="text-left bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 hover:border-accent/40 rounded-2xl p-5 transition-colors group">
          <CalendarDays size={18} className="text-accent mb-3" />
          <p className="font-display text-foreground uppercase tracking-wider text-sm">Definir Calendário</p>
          <p className="text-[11px] font-mono text-zinc-500 mt-1">Gerir jornadas via ANCAF_CALENDAR</p>
        </button>
        <button onClick={() => onGo('competition')} className="text-left bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 hover:border-accent/40 rounded-2xl p-5 transition-colors group">
          <BarChart3 size={18} className="text-accent mb-3" />
          <p className="font-display text-foreground uppercase tracking-wider text-sm">Jogos e Classificação</p>
          <p className="text-[11px] font-mono text-zinc-500 mt-1">Atualizar golos, resultados e tabela</p>
        </button>
        <button onClick={() => onGo('news')} className="text-left bg-zinc-100/40 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 hover:border-accent/40 rounded-2xl p-5 transition-colors group">
          <Newspaper size={18} className="text-accent mb-3" />
          <p className="font-display text-foreground uppercase tracking-wider text-sm">Rever Notícias</p>
          <p className="text-[11px] font-mono text-zinc-500 mt-1">Validar, editar e publicar rapidamente</p>
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
  const [publishedMatches, setPublishedMatches] = useState<Match[]>([]);
  const seasonMatches = useMemo(
    () => (isUpcoming && publishedMatches.length === 240 ? publishedMatches : getMatchesForSeason(seasonId)),
    [isUpcoming, publishedMatches, seasonId],
  );
  const rounds = useMemo(() => Array.from(new Set(seasonMatches.map((m) => m.round))).sort((a, b) => a - b), [seasonMatches]);
  const [round, setRound] = useState<number>(1);
  const ctl = useEditorDraft<Overrides>('calendar', CAL_KEY, {});
  const overrides = ctl.draft;
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [dynamicSource, setDynamicSource] = useState<{
    system: string; accessCode: string; technicalSeed?: string; fingerprint?: string;
    season: string; generatedAt: string; rounds: number; matches: number;
  }>(ANCAF_CALENDAR_SOURCE);

  const loadOfficialCalendar = () => fetch('/api/ancaf?format=matches')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (data.source) setDynamicSource(data.source);
      if (Array.isArray(data.matches) && data.matches.length === 240) setPublishedMatches(data.matches);
      return data;
    });

  // Carregar a última sincronização e o calendário oficial servido pela API.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setLastSync(localStorage.getItem(SYNC_KEY));
    /* eslint-enable react-hooks/set-state-in-effect */

    // O Admin usa os mesmos 240 jogos que o portal público serve. Não gera
    // uma agenda paralela no browser a partir de uma seed guardada localmente.
    loadOfficialCalendar()
      .catch((err) => console.error('Erro ao buscar semente do calendário:', err));
  }, []);

  const update = (id: string, patch: MatchOverride) => {
    ctl.setDraft({ ...overrides, [id]: { ...overrides[id], ...patch } });
  };

  const resetRound = (ids: string[]) => {
    const next = { ...overrides };
    ids.forEach((id) => delete next[id]);
    ctl.setDraft(next);
  };

  const sync = () => {
    setSyncing(true);
    loadOfficialCalendar()
      .then(() => {
        const stamp = new Date().toISOString();
        localStorage.setItem(SYNC_KEY, stamp);
        setLastSync(stamp);
      })
      .catch((err) => console.error('Erro de sincronização:', err))
      .finally(() => {
        setSyncing(false);
      });
  };

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

      <SaveBar
        ctl={ctl}
        pendingLabel={`${editedCount} jogo(s) alterado(s)`}
        onExport={exportCalendar}
        onResetAll={editedCount > 0 ? () => ctl.setDraft({}) : undefined}
      />

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
                  <>Calendário {dynamicSource.season} · ID do campeonato <span className="text-green-400">{dynamicSource.accessCode}</span> · seed <span className="text-green-400">{dynamicSource.technicalSeed ?? '—'}</span></>
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

      {/* Identidade imutável do calendário que a API está efetivamente a servir. */}
      {isUpcoming && (
        <Panel className="border-accent/20 bg-accent/[0.03]">
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-display text-foreground uppercase tracking-wider text-sm flex items-center gap-2">
                <Fingerprint size={14} className="text-accent" /> Calendário Oficial Publicado
              </p>
              <p className="text-[11px] font-mono text-zinc-500 mt-1">Os confrontos vêm de /api/ancaf. As datas só são oficiais quando publicadas pela Direção de Competições em blocos de cinco jornadas.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3"><span className="block text-zinc-500 text-[10px] uppercase">ID do campeonato</span><strong className="text-foreground">{dynamicSource.accessCode}</strong></div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3"><span className="block text-zinc-500 text-[10px] uppercase">Seed técnica</span><strong className="text-foreground">{dynamicSource.technicalSeed ?? '—'}</strong></div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3"><span className="block text-zinc-500 text-[10px] uppercase">Fingerprint</span><strong className="text-foreground break-all text-[10px]">{dynamicSource.fingerprint ?? '—'}</strong></div>
            </div>
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
                <li>• Confrontos e mando vêm do sorteio ANCAF (n.º {dynamicSource.accessCode}, seed {dynamicSource.technicalSeed ?? '—'}); as datas são confirmadas em <strong className="text-foreground">blocos de cinco jornadas</strong>.</li>
                <li>• O <strong className="text-foreground">resultado só fica editável</strong> quando o estado do jogo é «Terminado».</li>
                <li>• As alterações só ficam visíveis no site <strong className="text-foreground">depois de «Guardar alterações»</strong>; até lá são um rascunho neste navegador.</li>
              </ul>
            </div>

            {/* Restrições */}
            <div>
              <p className="flex items-center gap-1.5 text-amber-400 uppercase tracking-widest text-[10px] mb-2">
                <AlertTriangle size={12} /> Restrições
              </p>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <li>• Não alterar os <strong className="text-foreground">confrontos/equipas</strong> de uma jornada (quebra o equilíbrio do sorteio a duas voltas).</li>
                <li>• Não publicar datas futuras sem um <strong className="text-foreground">quadro ou comunicado oficial</strong> da Direção de Competições.</li>
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
                <li>• Depois de guardar, a alteração é <strong className="text-foreground">pública e imediata</strong> para todos os visitantes — exporte em JSON antes de mexer em massa.</li>
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
                    onChange={(e) => update(m.id, { date: localInputToIso(e.target.value), scheduleStatus: 'official' })}
                    className="admin-input"
                  />
                </Field>
                <Field label="Publicação da data">
                  <select
                    value={m.scheduleStatus ?? 'official'}
                    onChange={(e) => update(m.id, { scheduleStatus: e.target.value as Match['scheduleStatus'] })}
                    className="admin-input"
                  >
                    <option value="official">Data oficial</option>
                    <option value="provisional">Provisória/editável</option>
                  </select>
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
                    placeholder="A definir na semana do jogo"
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

// ════════════════════════════════════════════════════════════════════════
// SECÇÃO: SITE E MARCA (identidade global do portal)
// ════════════════════════════════════════════════════════════════════════
function SiteSection() {
  const ctl = useEditorDraft<Partial<SiteSettings>>('site', SITE_KEY, {});
  const site: SiteSettings = { ...DEFAULT_SITE_SETTINGS, ...ctl.draft };
  const set = (patch: Partial<SiteSettings>) => ctl.setDraft({ ...ctl.draft, ...patch });
  const changedCount = Object.keys(ctl.draft).filter(
    (k) => ctl.draft[k as keyof SiteSettings] !== DEFAULT_SITE_SETTINGS[k as keyof SiteSettings],
  ).length;

  const colorFields: { key: keyof SiteSettings; label: string }[] = [
    { key: 'primaryLight', label: 'Primária · tema claro' },
    { key: 'accentLight', label: 'Acento · tema claro' },
    { key: 'primaryDark', label: 'Primária · tema escuro' },
    { key: 'accentDark', label: 'Acento · tema escuro' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={Palette} subtitle="IDENTIDADE_DO_PORTAL" title="Site e Marca" />
      <SaveBar
        ctl={ctl}
        pendingLabel={`${changedCount} campo(s) alterado(s)`}
        onExport={() => downloadJSON('identidade-site.json', site)}
        onResetAll={Object.keys(ctl.draft).length > 0 ? () => ctl.setDraft({}) : undefined}
      />

      <Panel className="space-y-4">
        <h3 className="text-sm font-display text-foreground uppercase tracking-wider flex items-center gap-2">
          <FileText size={15} className="text-accent" /> Textos institucionais e SEO
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Nome do site"><input className="admin-input" value={site.siteName} onChange={(e) => set({ siteName: e.target.value })} /></Field>
          <Field label="Slogan"><input className="admin-input" value={site.tagline} onChange={(e) => set({ tagline: e.target.value })} /></Field>
          <div className="sm:col-span-2">
            <Field label="Descrição SEO do portal (meta description)">
              <input className="admin-input" value={site.metaDescription} onChange={(e) => set({ metaDescription: e.target.value })} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Descrição do rodapé">
              <textarea className="admin-input" value={site.footerDescription} onChange={(e) => set({ footerDescription: e.target.value })} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Aviso de direitos (rodapé)">
              <input className="admin-input" value={site.copyright} onChange={(e) => set({ copyright: e.target.value })} />
            </Field>
          </div>
        </div>
      </Panel>

      <Panel className="space-y-4">
        <h3 className="text-sm font-display text-foreground uppercase tracking-wider flex items-center gap-2">
          <Radio size={15} className="text-accent" /> Contactos e redes sociais
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Field label="Email principal"><input className="admin-input" value={site.contactEmail} onChange={(e) => set({ contactEmail: e.target.value })} /></Field>
          <Field label="Email de suporte/TI"><input className="admin-input" value={site.supportEmail} onChange={(e) => set({ supportEmail: e.target.value })} /></Field>
          <Field label="Telefone principal"><input className="admin-input" value={site.contactPhone} onChange={(e) => set({ contactPhone: e.target.value })} /></Field>
          <Field label="Telefone secundário"><input className="admin-input" placeholder="+244 …" value={site.contactPhone2} onChange={(e) => set({ contactPhone2: e.target.value })} /></Field>
          <div className="sm:col-span-2">
            <Field label="Morada oficial"><input className="admin-input" value={site.contactAddress} onChange={(e) => set({ contactAddress: e.target.value })} /></Field>
          </div>
          <Field label="Facebook (URL)"><input className="admin-input" placeholder="https://…" value={site.facebookUrl} onChange={(e) => set({ facebookUrl: e.target.value })} /></Field>
          <Field label="Instagram (URL)"><input className="admin-input" placeholder="https://…" value={site.instagramUrl} onChange={(e) => set({ instagramUrl: e.target.value })} /></Field>
          <Field label="YouTube (URL)"><input className="admin-input" placeholder="https://…" value={site.youtubeUrl} onChange={(e) => set({ youtubeUrl: e.target.value })} /></Field>
          <Field label="Twitter / X (URL)"><input className="admin-input" placeholder="https://…" value={site.twitterUrl} onChange={(e) => set({ twitterUrl: e.target.value })} /></Field>
        </div>
        <p className="text-[10px] font-mono text-zinc-500">Redes sem URL preenchido não são exibidas no rodapé do site.</p>
      </Panel>

      <Panel className="space-y-4">
        <h3 className="text-sm font-display text-foreground uppercase tracking-wider flex items-center gap-2">
          <Palette size={15} className="text-accent" /> Paleta de cores da marca
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {colorFields.map(({ key, label }) => (
            <Field key={key} label={label}>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={site[key] as string}
                  onChange={(e) => set({ [key]: e.target.value } as Partial<SiteSettings>)}
                  className="h-9 w-14 rounded bg-transparent border border-zinc-700 cursor-pointer flex-shrink-0"
                />
                <input
                  className="admin-input"
                  value={site[key] as string}
                  onChange={(e) => set({ [key]: e.target.value } as Partial<SiteSettings>)}
                />
              </div>
            </Field>
          ))}
        </div>
        <p className="text-[10px] font-mono text-zinc-500">
          Aplicadas como variáveis CSS globais (<span className="text-foreground">--primary</span> e <span className="text-foreground">--accent</span>) em todo o portal em tempo real.
        </p>
      </Panel>

      <AdminInputStyles />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECÇÃO: EQUIPAS (edição total dos clubes)
// ════════════════════════════════════════════════════════════════════════
// Forma publicada dos overrides de equipa — tem de coincidir com o que
// `getTeams()` (data.ts) espera, senão o site público ignora as edições.
type TeamsStore = { overrides: Record<string, Partial<Team>>; added: Team[]; removed: string[] };
const EMPTY_TEAMS_STORE: TeamsStore = { overrides: {}, added: [], removed: [] };

function TeamsSection() {
  const standings = useMemo(() => getStandings(), []);
  const posByTeam = useMemo(() => new Map(standings.map((s) => [s.teamId, s])), [standings]);
  const ctl = useEditorDraft<TeamsStore>('teams', TEAM_KEY, EMPTY_TEAMS_STORE);
  const store = { ...EMPTY_TEAMS_STORE, ...ctl.draft };
  const overrides = store.overrides;
  const [openId, setOpenId] = useState<string | null>(null);

  const [logoError, setLogoError] = useState<string | null>(null);
  const [logoSaving, setLogoSaving] = useState<string | null>(null);
  const [logoSavedId, setLogoSavedId] = useState<string | null>(null);

  // Espelha o rascunho no registo local que alimenta os emblemas em tempo real
  // (TeamCrest), para que a pré-visualização acompanhe a edição.
  useEffect(() => {
    try {
      writeTeamOverrides(overrides);
    } catch {
      // Quota do localStorage esgotada — só afeta a pré-visualização local. A
      // gravação real (servidor) continua a reportar o erro pelo seu caminho.
      console.warn('Sem espaço local para pré-visualizar os emblemas.');
    }
  }, [overrides]);

  const setOverrides = (next: Record<string, Partial<Team>>) => ctl.setDraft({ ...store, overrides: next });
  const update = (id: string, patch: Partial<Team>) => {
    if (store.added.some((team) => team.id === id)) {
      ctl.setDraft({ ...store, added: store.added.map((team) => team.id === id ? { ...team, ...patch } : team) });
      return;
    }
    setOverrides({ ...overrides, [id]: { ...overrides[id], ...patch } });
  };
  const resetTeam = (id: string) => { const n = { ...overrides }; delete n[id]; setOverrides(n); };
  const merged = (t: Team): Team => ({ ...t, ...overrides[t.id] });
  const visibleTeams = [...store.added, ...TEAMS]
    .filter((team) => !store.removed.includes(team.id))
    .map(merged);
  const editedCount = Object.keys(overrides).length + store.added.length + store.removed.length;

  const addTeam = () => {
    const id = makeAdminId('clube');
    const team: Team = {
      id, name: 'Novo clube', shortName: 'NOV', city: 'Luanda', stadium: 'Por definir',
      stadiumCapacity: 0, founded: new Date().getFullYear(), colors: 'Por definir', coach: 'Por definir',
      colorsHex: ['#5C0F8B', '#E6540F'],
    };
    ctl.setDraft({ ...store, added: [team, ...store.added] });
    setOpenId(id);
  };

  const removeTeam = (id: string) => {
    if (!window.confirm('Remover este clube do portal? A alteração só será definitiva depois de guardar.')) return;
    if (store.added.some((team) => team.id === id)) {
      ctl.setDraft({ ...store, added: store.added.filter((team) => team.id !== id) });
    } else {
      const nextOverrides = { ...overrides };
      delete nextOverrides[id];
      ctl.setDraft({ ...store, overrides: nextOverrides, removed: [...new Set([...store.removed, id])] });
    }
    setOpenId(null);
  };

  // Persiste o logótipo GLOBALMENTE (Supabase). O upload devolve um URL público
  // que substitui o override local (mais leve que o data URL e canónico).
  const persistLogoToServer = async (teamId: string, logoUrl: string | null) => {
    setLogoSaving(teamId);
    setLogoError(null);
    try {
      const res = await fetch('/api/teams/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Autorização via cookie de sessão (enviado automaticamente); a senha
        // já não vive no código do cliente.
        body: JSON.stringify({ teamId, logoUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Falha ao guardar no servidor.');
      // Alinha o override local com o que ficou no servidor.
      update(teamId, { logoUrl: data.logoUrl ?? undefined });
      setLogoSavedId(teamId);
      setTimeout(() => setLogoSavedId((cur) => (cur === teamId ? null : cur)), 2500);
    } catch (e) {
      setLogoError(e instanceof Error ? e.message : 'Falha ao guardar o logótipo no servidor.');
    } finally {
      setLogoSaving((cur) => (cur === teamId ? null : cur));
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={Users} subtitle="GESTÃO_DE_CLUBES" title="Equipas" />
      <SaveBar
        ctl={ctl}
        pendingLabel={`${editedCount} clube(s) alterado(s)`}
        onExport={() => downloadJSON('clubes-ancaf.json', visibleTeams)}
        onResetAll={editedCount > 0 ? () => ctl.setDraft(EMPTY_TEAMS_STORE) : undefined}
        extra={
          <button onClick={addTeam} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent/10 border border-accent/40 text-accent font-mono text-[10px] uppercase tracking-widest hover:bg-accent/20 transition-colors">
            <Plus size={12} /> Novo clube
          </button>
        }
      />
      <p className="text-[11px] font-mono text-zinc-500 -mt-2">
        Nome, cidade, estádio, capacidade, treinador, cores, palmarés e órgãos sociais são publicados ao guardar.
        O <strong className="text-foreground">emblema</strong> é enviado para o servidor no momento do upload.
      </p>

      <div className="space-y-3">
        {visibleTeams.map((base) => {
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
                  <button onClick={() => removeTeam(base.id)} className="text-zinc-500 hover:text-red-400 transition-colors" title="Remover clube"><Trash2 size={14} /></button>
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
                  <Field label="Apelido / alcunha"><input className="admin-input" placeholder="Ex.: Gorilas do Norte" value={t.nickname ?? ''} onChange={(e) => update(base.id, { nickname: e.target.value || undefined })} /></Field>
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
                <div className="mt-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-900/60">
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <ImagePlus size={12} /> Emblema / Logótipo
                  </span>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-shrink-0 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-black/40 p-2">
                      <TeamCrest teamId={base.id} size={56} />
                    </div>
                    <div className="flex-1 min-w-[220px] space-y-2">
                      <label className={`inline-flex w-fit items-center gap-1.5 px-3 py-2 rounded-xl bg-accent/10 border border-accent/40 text-accent font-mono text-[10px] uppercase tracking-widest transition-colors ${logoSaving === base.id ? 'opacity-60 cursor-wait' : 'hover:bg-accent/20 cursor-pointer'}`}>
                        <ImagePlus size={12} /> Carregar imagem
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={logoSaving === base.id}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await fileToLogoDataUrl(file);
                              update(base.id, { logoUrl: url });    // pré-visualização instantânea
                              await persistLogoToServer(base.id, url); // persiste globalmente
                            } catch {
                              setLogoError('Não foi possível processar a imagem.');
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <input
                        className="admin-input"
                        placeholder="ou colar URL do logótipo (https://…)"
                        defaultValue={t.logoUrl && !t.logoUrl.startsWith('data:') ? t.logoUrl : ''}
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          const current = t.logoUrl && !t.logoUrl.startsWith('data:') ? t.logoUrl : '';
                          if (val === current) return;
                          update(base.id, { logoUrl: val || undefined }); // pré-visualização
                          persistLogoToServer(base.id, val || null);      // persiste globalmente
                        }}
                      />
                      <p className="text-[9px] font-mono text-zinc-500">
                        PNG/JPG/SVG · redimensionado automaticamente. Guardado no servidor — aplica-se a todos os visitantes.
                      </p>
                      {logoSaving === base.id && (
                        <p className="text-[10px] font-mono text-accent flex items-center gap-1.5"><Loader2 size={11} className="animate-spin" /> A guardar no servidor…</p>
                      )}
                      {logoSavedId === base.id && logoSaving !== base.id && (
                        <p className="text-[10px] font-mono text-green-400 flex items-center gap-1.5"><CheckCircle2 size={11} /> Emblema publicado globalmente.</p>
                      )}
                    </div>
                    {overrides[base.id]?.logoUrl && (
                      <button
                        onClick={() => { update(base.id, { logoUrl: undefined }); persistLogoToServer(base.id, null); }}
                        disabled={logoSaving === base.id}
                        className="self-start inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw size={12} /> Repor emblema
                      </button>
                    )}
                  </div>
                  {logoError && <p className="text-[10px] font-mono text-red-400 mt-2">{logoError}</p>}
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
  const ctl = useEditorDraft<Record<string, NominationOverride>>('nominations', NOMINATION_KEY, {});
  const overrides = ctl.draft;

  const update = (id: string, patch: NominationOverride) =>
    ctl.setDraft({ ...overrides, [id]: { ...overrides[id], ...patch } });

  const matches = useMemo(() => getMatchesForSeason(seasonId), [seasonId]);
  const rounds = useMemo(() => Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b), [matches]);
  const roundMatches = matches.filter((m) => m.round === round);
  const editedCount = Object.keys(overrides).length;

  // Mantém os campos vazios até à nomeação oficial publicada pelo administrador.
  const resolved = (m: Match) => {
    const o = overrides[m.id] ?? {};
    return {
      referee: o.referee ?? m.referee ?? '',
      assistants: o.assistants ?? ['', ''] as [string, string],
      fourth: o.fourth ?? '',
    };
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={Flag} subtitle="CONSELHO_DE_ARBITRAGEM" title="Nomeações" />
      <SaveBar
        ctl={ctl}
        pendingLabel={`${editedCount} nomeação(ões) alterada(s)`}
        onExport={() => downloadJSON('nomeacoes-ancaf.json', matches.map((m) => ({ matchId: m.id, round: m.round, homeTeam: m.homeTeam, awayTeam: m.awayTeam, ...resolved(m) })))}
        onResetAll={editedCount > 0 ? () => ctl.setDraft({}) : undefined}
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
                  <input className="admin-input" placeholder="A definir" value={nom.referee} onChange={(e) => update(m.id, { referee: e.target.value })} />
                </Field>
                <Field label="1.º Assistente">
                  <input className="admin-input" placeholder="A definir" value={nom.assistants[0]} onChange={(e) => update(m.id, { assistants: [e.target.value, nom.assistants[1]] })} />
                </Field>
                <Field label="2.º Assistente">
                  <input className="admin-input" placeholder="A definir" value={nom.assistants[1]} onChange={(e) => update(m.id, { assistants: [nom.assistants[0], e.target.value] })} />
                </Field>
                <Field label="4.º Árbitro">
                  <input className="admin-input" placeholder="A definir" value={nom.fourth} onChange={(e) => update(m.id, { fourth: e.target.value })} />
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
interface PlayersStore {
  overrides: Record<string, Partial<Player>>;
  added: Player[];
  removed: string[];
}
const EMPTY_PLAYERS_STORE: PlayersStore = { overrides: {}, added: [], removed: [] };

function PlayersSection() {
  const ctl = useEditorDraft<PlayersStore>('players', PLAYER_KEY, EMPTY_PLAYERS_STORE);
  const rawStore = ctl.draft as PlayersStore | Record<string, Partial<Player>>;
  const store: PlayersStore = 'overrides' in rawStore || 'added' in rawStore || 'removed' in rawStore
    ? { ...EMPTY_PLAYERS_STORE, ...rawStore } as PlayersStore
    : { ...EMPTY_PLAYERS_STORE, overrides: rawStore };
  const overrides = store.overrides;
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>(PLAYERS[0]?.id ?? '');

  const update = (id: string, patch: Partial<Player>) => {
    if (store.added.some((player) => player.id === id)) {
      ctl.setDraft({ ...store, added: store.added.map((player) => player.id === id ? { ...player, ...patch } : player) });
      return;
    }
    ctl.setDraft({ ...store, overrides: { ...overrides, [id]: { ...overrides[id], ...patch } } });
  };
  const resetPlayer = (id: string) => {
    const next = { ...overrides };
    delete next[id];
    ctl.setDraft({ ...store, overrides: next });
  };
  const merged = (p: Player): Player => ({ ...p, ...overrides[p.id] });
  const allPlayers = [...store.added, ...PLAYERS]
    .filter((player) => !store.removed.includes(player.id))
    .map(merged);
  const editedCount = Object.keys(overrides).length + store.added.length + store.removed.length;

  const addPlayer = () => {
    const team = TEAMS[0];
    const id = makeAdminId('jogador');
    const player: Player = {
      id, name: 'Novo jogador', club: team?.name ?? 'Sem clube', teamId: team?.id ?? '',
      position: 'Avançado', goals: 0, assists: 0, appearances: 0, jerseyNumber: 0,
      age: 18, nationality: 'Angola', height: '1,75 m',
      attributes: { pace: 50, shooting: 50, passing: 50, dribbling: 50, defending: 50, physical: 50 },
    };
    ctl.setDraft({ ...store, added: [player, ...store.added] });
    setSelectedId(id);
  };

  const removePlayer = (id: string) => {
    if (!window.confirm('Remover este jogador do portal? A alteração só será definitiva depois de guardar.')) return;
    if (store.added.some((player) => player.id === id)) {
      ctl.setDraft({ ...store, added: store.added.filter((player) => player.id !== id) });
    } else {
      const nextOverrides = { ...overrides };
      delete nextOverrides[id];
      ctl.setDraft({ ...store, overrides: nextOverrides, removed: [...new Set([...store.removed, id])] });
    }
    setSelectedId(allPlayers.find((player) => player.id !== id)?.id ?? '');
  };

  const filtered = allPlayers.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  const baseSel = allPlayers.find((p) => p.id === selectedId) ?? filtered[0] ?? allPlayers[0];

  if (!baseSel) return null;
  const sel = merged(baseSel);
  const selEdited = !!overrides[baseSel.id] || store.added.some((player) => player.id === baseSel.id);

  const numField = (label: string, key: 'jerseyNumber' | 'age' | 'goals' | 'assists' | 'appearances', value: number) => (
    <Field label={label}>
      <input type="number" min={0} className="admin-input" value={value} onChange={(e) => update(baseSel.id, { [key]: Number(e.target.value) })} />
    </Field>
  );

  return (
    <div className="space-y-6">
      <SectionHeader icon={Shirt} subtitle="GESTÃO_DE_PLANTÉIS" title="Jogadores" />
      <SaveBar
        ctl={ctl}
        pendingLabel={`${editedCount} jogador(es) alterado(s)`}
        onExport={() => downloadJSON('jogadores-ancaf.json', allPlayers)}
        onResetAll={editedCount > 0 ? () => ctl.setDraft(EMPTY_PLAYERS_STORE) : undefined}
        extra={
          <button onClick={addPlayer} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent/10 border border-accent/40 text-accent font-mono text-[10px] uppercase tracking-widest hover:bg-accent/20 transition-colors">
            <Plus size={12} /> Novo jogador
          </button>
        }
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
            <div className="flex items-center gap-3">
              {selEdited && !store.added.some((player) => player.id === baseSel.id) && (
                <button onClick={() => resetPlayer(baseSel.id)} className="text-[10px] font-mono text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-widest">Repor</button>
              )}
              <button onClick={() => removePlayer(baseSel.id)} className="text-[10px] font-mono text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest">Remover</button>
            </div>
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
// SECÇÃO: JOGOS, GOLOS, RESULTADOS E CLASSIFICAÇÃO
// ════════════════════════════════════════════════════════════════════════
function CompetitionSection() {
  const [seasonId, setSeasonId] = useState(CURRENT_SEASON_ID);
  const [round, setRound] = useState(1);
  const ctl = useEditorDraft<Overrides>('calendar', CAL_KEY, {});
  const matches = useMemo(() => getMatchesForSeason(seasonId), [seasonId]);
  const mergedMatches = useMemo(() => matches.map((match) => ({ ...match, ...(ctl.draft[match.id] ?? {}) })), [matches, ctl.draft]);
  const rounds = useMemo(() => Array.from(new Set(matches.map((match) => match.round))).sort((a, b) => a - b), [matches]);
  const standings = useMemo(() => computeStandings(mergedMatches), [mergedMatches]);
  const roundMatches = mergedMatches.filter((match) => match.round === round);
  const editedInSeason = matches.filter((match) => ctl.draft[match.id]).length;

  const update = (match: Match, patch: MatchOverride) => {
    const current = ctl.draft[match.id] ?? {};
    const next = { ...current, ...patch };
    if (typeof next.homeScore === 'number' || typeof next.awayScore === 'number') {
      const homeScore = next.homeScore ?? match.homeScore;
      const awayScore = next.awayScore ?? match.awayScore;
      next.homeScore = homeScore;
      next.awayScore = awayScore;
      next.score = `${homeScore}-${awayScore}`;
    }
    ctl.setDraft({ ...ctl.draft, [match.id]: next });
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={BarChart3} subtitle="GESTÃO_DA_COMPETIÇÃO" title="Jogos e Classificação" />
      <SaveBar
        ctl={ctl}
        pendingLabel={`${editedInSeason} jogo(s) alterado(s) nesta época`}
        onExport={() => downloadJSON(`competicao-${seasonId}.json`, { matches: mergedMatches, standings })}
      />

      <Panel className="border-accent/20 bg-accent/[0.03]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Época">
            <select className="admin-input" value={seasonId} onChange={(event) => { setSeasonId(event.target.value); setRound(1); }}>
              {SEASONS.map((season) => <option key={season.id} value={season.id}>{season.label}</option>)}
            </select>
          </Field>
          <Field label="Jornada">
            <select className="admin-input" value={round} onChange={(event) => setRound(Number(event.target.value))}>
              {rounds.map((value) => <option key={value} value={value}>Jornada {value}</option>)}
            </select>
          </Field>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
            <span className="block text-[9px] font-mono uppercase tracking-widest text-zinc-500">Atualização automática</span>
            <strong className="text-sm text-green-500">A classificação acompanha os resultados</strong>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_.85fr] gap-5 items-start">
        <div className="space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Resultados · Jornada {round}</p>
          {roundMatches.map((match) => {
            const edited = Boolean(ctl.draft[match.id]);
            return (
              <Panel key={match.id} className={edited ? 'border-accent/40' : ''}>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{match.homeTeam} × {match.awayTeam}</p>
                    <p className="text-[10px] font-mono text-zinc-500 mt-1">{new Date(match.date).toLocaleString('pt-AO')}{match.scheduleStatus === 'provisional' ? ' · Data provisória/editável' : ''} · {match.stadium}</p>
                  </div>
                  {edited && <button className="text-[9px] font-mono uppercase text-red-400" onClick={() => { const next = { ...ctl.draft }; delete next[match.id]; ctl.setDraft(next); }}>Repor</button>}
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                  <Field label={match.homeTeam}>
                    <input aria-label={`Golos de ${match.homeTeam}`} type="number" min={0} className="admin-input text-center text-xl font-bold" value={match.homeScore} onChange={(event) => update(match, { homeScore: Math.max(0, Number(event.target.value)), status: 'finished' })} />
                  </Field>
                  <span className="pb-3 text-zinc-500 font-mono">—</span>
                  <Field label={match.awayTeam}>
                    <input aria-label={`Golos de ${match.awayTeam}`} type="number" min={0} className="admin-input text-center text-xl font-bold" value={match.awayScore} onChange={(event) => update(match, { awayScore: Math.max(0, Number(event.target.value)), status: 'finished' })} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <Field label="Estado">
                    <select className="admin-input" value={match.status} onChange={(event) => update(match, { status: event.target.value as Match['status'] })}>
                      <option value="scheduled">Agendado</option><option value="live">Ao vivo</option><option value="finished">Terminado</option>
                    </select>
                  </Field>
                  <Field label="Data e hora"><input type="datetime-local" className="admin-input" value={isoToLocalInput(match.date)} onChange={(event) => update(match, { date: localInputToIso(event.target.value), scheduleStatus: 'official' })} /></Field>
                  <Field label="Publicação da data">
                    <select className="admin-input" value={match.scheduleStatus ?? 'official'} onChange={(event) => update(match, { scheduleStatus: event.target.value as Match['scheduleStatus'] })}>
                      <option value="official">Data oficial</option><option value="provisional">Provisória/editável</option>
                    </select>
                  </Field>
                </div>
              </Panel>
            );
          })}
        </div>

        <Panel className="xl:sticky xl:top-24 overflow-hidden p-0">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-900">
            <h3 className="font-display uppercase text-sm text-foreground">Classificação recalculada</h3>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">Pré-visualização antes da publicação</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[9px] font-mono uppercase text-zinc-500 bg-zinc-100/50 dark:bg-zinc-900/50"><tr><th className="p-2 text-left">#</th><th className="p-2 text-left">Clube</th><th className="p-2">J</th><th className="p-2">DG</th><th className="p-2">Pts</th></tr></thead>
              <tbody>{standings.map((row) => <tr key={row.teamId} className="border-t border-zinc-200/60 dark:border-zinc-900/60"><td className="p-2 font-mono text-zinc-500">{row.position}</td><td className="p-2 font-medium max-w-44 truncate">{row.teamName}</td><td className="p-2 text-center font-mono">{row.played}</td><td className="p-2 text-center font-mono">{row.goalDifference}</td><td className="p-2 text-center font-bold text-primary">{row.points}</td></tr>)}</tbody>
            </table>
          </div>
        </Panel>
      </div>
      <AdminInputStyles />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECÇÃO: NOTÍCIAS (criar · editar · remover)
// ════════════════════════════════════════════════════════════════════════
interface NewsStore { overrides: Record<string, Partial<NewsArticle>>; added: NewsArticle[]; deleted: string[]; }

const NEWS_STATUS_LABELS: Record<NonNullable<NewsArticle['status']>, string> = {
  draft: 'Rascunho',
  pending_review: 'A validar',
  published: 'Publicada',
  rejected: 'Rejeitada',
};

function validNewsSource(value?: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function NewsSection() {
  // O painel parte do arquivo completo; a filtragem de rascunhos acontece
  // apenas nos getters usados pelo portal público.
  const base = useMemo(() => newsMock, []);
  const ctl = useEditorDraft<NewsStore>('news', NEWS_KEY, { overrides: {}, added: [], deleted: [] });
  const store = ctl.draft;
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | NonNullable<NewsArticle['status']>>('all');
  const [automationRunning, setAutomationRunning] = useState(false);
  const [automationMessage, setAutomationMessage] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const persist = ctl.setDraft;
  const updateArt = (id: string, patch: Partial<NewsArticle>) =>
    persist({ ...store, overrides: { ...store.overrides, [id]: { ...store.overrides[id], ...patch } } });
  const addArt = () => {
    const id = `news-custom-${Date.now()}`;
    const now = new Date();
    const art: NewsArticle = {
      id, title: 'Nova notícia', category: 'Geral', date: now.toLocaleDateString('pt-AO'),
      isoDate: now.toISOString().slice(0, 10), summary: '', content: '', status: 'draft',
      author: '', sourceName: '', sourceUrl: '', verifiedBy: '',
    };
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
  const visibleList = list.filter((article) => {
    const status = article.status ?? 'published';
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    const needle = query.trim().toLocaleLowerCase('pt');
    return matchesStatus && (!needle || `${article.title} ${article.summary} ${article.sourceName ?? ''}`.toLocaleLowerCase('pt').includes(needle));
  });
  const isAddedId = (id: string) => store.added.some((a) => a.id === id);
  const editedCount = Object.keys(store.overrides).length + store.added.length + store.deleted.length;
  const publishArticle = async (article: NewsArticle, completeEditorialFields = false) => {
    const now = new Date().toISOString();
    const patch: Partial<NewsArticle> = {
      status: 'published',
      reviewedAt: now,
      publishedAt: now,
      ...(completeEditorialFields ? {
        author: article.author?.trim() || 'Redação Liga Unitel Girabola',
        sourceName: article.sourceName?.trim() || 'Fonte indicada na ligação',
        verifiedBy: article.verifiedBy?.trim() || 'Admin ANCAF',
      } : {}),
    };
    const next: NewsStore = {
      ...store,
      overrides: {
        ...store.overrides,
        [article.id]: { ...store.overrides[article.id], ...patch },
      },
    };

    setPublishingId(article.id);
    setAutomationMessage(null);
    const published = await ctl.publish(next);
    setPublishingId(null);
    setAutomationMessage(
      published
        ? `“${article.title}” foi validada e publicada no site.`
        : `Não foi possível publicar “${article.title}”. Verifique o erro apresentado acima.`,
    );
  };
  const fetchWithAi = async () => {
    setAutomationRunning(true);
    setAutomationMessage(null);
    try {
      const response = await fetch('/api/admin/news/automation', { method: 'POST', credentials: 'same-origin' });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Não foi possível buscar notícias.');
      const incoming = (data.articles ?? []) as NewsArticle[];
      const known = new Set(list.map((article) => article.sourceUrl).filter(Boolean));
      const fresh = incoming.filter((article) => !known.has(article.sourceUrl));
      persist({ ...store, added: [...fresh, ...store.added] });
      setAutomationMessage(fresh.length ? `${fresh.length} notícia(s) adicionada(s) à revisão.` : 'Nenhuma notícia nova encontrada.');
    } catch (error) {
      setAutomationMessage(error instanceof Error ? error.message : 'Erro na automação.');
    } finally {
      setAutomationRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader icon={Newspaper} subtitle="GESTÃO_DE_CONTEÚDOS" title="Notícias" />
      <SaveBar
        ctl={ctl}
        pendingLabel={`${editedCount} alteração(ões) em ${list.length} notícias`}
        onExport={() => downloadJSON('noticias-ancaf.json', list)}
        onResetAll={editedCount > 0 ? () => persist({ overrides: {}, added: [], deleted: [] }) : undefined}
        extra={
          <>
            <button onClick={fetchWithAi} disabled={automationRunning} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-500 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50">
              {automationRunning ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} {automationRunning ? 'A pesquisar…' : 'Buscar com IA'}
            </button>
            <button onClick={addArt} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent/10 border border-accent/40 text-accent font-mono text-[10px] uppercase tracking-widest hover:bg-accent/20 transition-colors">
              <Plus size={12} /> Nova
            </button>
          </>
        }
      />

      <Panel className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search size={14} className="absolute left-3 top-3 text-zinc-500" /><input className="admin-input pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar título, resumo ou fonte…" /></div>
          <select className="admin-input sm:w-48" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
            <option value="all">Todos os estados</option><option value="pending_review">A validar</option><option value="draft">Rascunhos</option><option value="published">Publicadas</option><option value="rejected">Rejeitadas</option>
          </select>
        </div>
        {automationMessage && <p className="text-[10px] font-mono text-violet-500 mt-3">{automationMessage}</p>}
      </Panel>

      <div className="space-y-3">
        {visibleList.map((n) => {
          const isOpen = openId === n.id;
          const added = isAddedId(n.id);
          const edited = !!store.overrides[n.id] || added;
          const status = n.status ?? 'published';
          const readyForReview = Boolean(n.title.trim() && n.summary.trim() && n.content?.trim() && n.author?.trim() && n.sourceName?.trim() && validNewsSource(n.sourceUrl));
          const readyToPublish = readyForReview && Boolean(n.verifiedBy?.trim());
          const quickPublishReady = Boolean(n.title.trim() && n.summary.trim() && n.content?.trim() && validNewsSource(n.sourceUrl));
          const quickPublish = async () => {
            if (!quickPublishReady) {
              setOpenId(n.id);
              return;
            }
            await publishArticle(n, true);
          };
          return (
            <Panel key={n.id} className={edited ? 'border-accent/30' : ''}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[9px] font-mono bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider">{n.category}</span>
                  <span className={`ml-2 text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-wider border ${status === 'published' ? 'text-green-500 border-green-500/30 bg-green-500/10' : status === 'pending_review' ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' : status === 'rejected' ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-zinc-500 border-zinc-500/30 bg-zinc-500/10'}`}>{NEWS_STATUS_LABELS[status]}</span>
                  {added && <span className="ml-2 text-[8px] font-mono text-accent uppercase tracking-widest">novo</span>}
                  <p className="text-sm text-foreground font-semibold mt-2 truncate">{n.title}</p>
                  <p className="text-[11px] font-mono text-zinc-500 mt-1 line-clamp-2">{n.summary}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {n.sourceUrl && <a href={n.sourceUrl} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-accent" title="Abrir fonte"><ExternalLink size={14} /></a>}
                  {status !== 'published' && <button disabled={publishingId !== null} onClick={quickPublish} title={quickPublishReady ? 'Validar e publicar imediatamente no site' : 'Abra para preencher o conteúdo e a ligação da fonte'} className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[9px] font-mono uppercase disabled:opacity-50 disabled:cursor-wait ${quickPublishReady ? 'border-green-500/30 bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'border-amber-500/30 bg-amber-500/10 text-amber-500'}`}>{publishingId === n.id ? <Loader2 size={11} className="animate-spin" /> : <ShieldCheck size={11} />} {publishingId === n.id ? 'A publicar…' : quickPublishReady ? 'Publicar no site' : 'Completar'}</button>}
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
                  <Field label="Data da notícia"><input type="date" className="admin-input" value={n.isoDate} onChange={(e) => updateArt(n.id, { isoDate: e.target.value, date: e.target.value ? new Date(`${e.target.value}T12:00:00`).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' }) : '' })} /></Field>
                  <Field label="Autor / Redação"><input className="admin-input" value={n.author ?? ''} onChange={(e) => updateArt(n.id, { author: e.target.value })} placeholder="Nome do jornalista ou redação" /></Field>
                  <div className="sm:col-span-2"><Field label="Resumo"><textarea className="admin-input" value={n.summary} onChange={(e) => updateArt(n.id, { summary: e.target.value })} /></Field></div>
                  <div className="sm:col-span-2"><Field label="Conteúdo"><textarea className="admin-input" style={{ minHeight: 140 }} value={n.content ?? ''} onChange={(e) => updateArt(n.id, { content: e.target.value })} /></Field></div>
                  <Field label="Fonte da informação"><input className="admin-input" value={n.sourceName ?? ''} onChange={(e) => updateArt(n.id, { sourceName: e.target.value })} placeholder="Ex.: Comunicado oficial do clube" /></Field>
                  <Field label="Ligação da fonte"><input type="url" className="admin-input" value={n.sourceUrl ?? ''} onChange={(e) => updateArt(n.id, { sourceUrl: e.target.value })} placeholder="https://..." /></Field>
                  <Field label="Validado por"><input className="admin-input" value={n.verifiedBy ?? ''} onChange={(e) => updateArt(n.id, { verifiedBy: e.target.value })} placeholder="Nome do responsável editorial" /></Field>
                  <label className="flex items-center gap-2 self-end min-h-10 text-xs text-zinc-600 dark:text-zinc-400">
                    <input type="checkbox" checked={n.aiAssisted ?? false} onChange={(e) => updateArt(n.id, { aiAssisted: e.target.checked })} className="h-4 w-4 accent-[var(--accent)]" />
                    Texto produzido com assistência de IA
                  </label>
                  <div className="flex flex-wrap items-end gap-2">
                    {status !== 'pending_review' && status !== 'published' && (
                      <button disabled={!readyForReview} onClick={() => updateArt(n.id, { status: 'pending_review' })} className="px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px] font-mono uppercase disabled:opacity-40 disabled:cursor-not-allowed">Enviar para validação</button>
                    )}
                    {status !== 'published' && (
                      <button disabled={!readyToPublish || publishingId !== null} onClick={() => publishArticle(n)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-green-500/30 bg-green-500/10 text-green-500 text-[10px] font-mono uppercase disabled:opacity-40 disabled:cursor-not-allowed">{publishingId === n.id ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} />} {publishingId === n.id ? 'A publicar no site…' : 'Validar e publicar no site'}</button>
                    )}
                    {status === 'published' && (
                      <button onClick={() => updateArt(n.id, { status: 'draft', publishedAt: undefined })} className="px-3 py-2 rounded-xl border border-zinc-500/30 bg-zinc-500/10 text-zinc-500 text-[10px] font-mono uppercase">Retirar do portal</button>
                    )}
                    {status === 'pending_review' && (
                      <button onClick={() => updateArt(n.id, { status: 'rejected' })} className="px-3 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] font-mono uppercase">Rejeitar</button>
                    )}
                  </div>
                  {!readyForReview && <p className="sm:col-span-2 text-[10px] font-mono text-amber-500">Para validar, preencha título, resumo, conteúdo, autor, fonte e uma ligação válida da fonte.</p>}
                  {n.reviewedAt && <p className="sm:col-span-2 text-[10px] font-mono text-zinc-500">Última validação: {new Date(n.reviewedAt).toLocaleString('pt-AO')} {n.verifiedBy ? `por ${n.verifiedBy}` : ''}</p>}
                </div>
              )}
            </Panel>
          );
        })}
        {visibleList.length === 0 && <p className="text-center py-10 text-zinc-600 font-mono text-sm">Nenhuma notícia corresponde ao filtro.</p>}
      </div>
      <AdminInputStyles />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECÇÃO: LOGÓTIPOS (Gestão centralizada de todos os logótipos)
// ════════════════════════════════════════════════════════════════════════
function LogosSection() {
  const [brandLogos, setBrandLogos] = useState<Record<string, { value: string; updated_at?: string }>>({});
  const [brandSaving, setBrandSaving] = useState<string | null>(null);
  const [brandSavedId, setBrandSavedId] = useState<string | null>(null);
  const [brandError, setBrandError] = useState<string | null>(null);

  // Estados dos Clubes. Arranca do registo local existente para não apagar as
  // edições em curso na secção «Equipas» ao gravar um emblema.
  const [overrides, setOverrides] = useState<Record<string, Partial<Team>>>({});
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setOverrides(readTeamOverrides());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  const [teamData, setTeamData] = useState<Record<string, { logoUrl?: string; updated_at?: string }>>({});
  const [logoSaving, setLogoSaving] = useState<string | null>(null);
  const [logoSavedId, setLogoSavedId] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  // Formata a data/hora para exibição legível
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Padrão do sistema';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return 'Padrão do sistema';
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `Atualizado em: ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} às ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    } catch {
      return 'Padrão do sistema';
    }
  };

  // Carregar dados de marca e clubes
  useEffect(() => {
    const loadConfigs = async () => {
      const { data } = await supabase
        .from('ancaf_configs')
        .select('key, value, updated_at')
        .in('key', ['logo_vertical', 'logo_horizontal', 'logo_horizontal_white', 'logo_ancaf']);
      if (data) {
        const map: Record<string, { value: string; updated_at?: string }> = {};
        for (const row of data) {
          map[row.key] = { value: row.value, updated_at: row.updated_at };
        }
        setBrandLogos(map);
      }
    };

    const loadTeamsData = async () => {
      const { data } = await supabase
        .from('ancaf_teams')
        .select('id, logo_url, updated_at');
      if (data) {
        const map: Record<string, { logoUrl?: string; updated_at?: string }> = {};
        for (const row of data) {
          map[row.id] = { logoUrl: row.logo_url || undefined, updated_at: row.updated_at };
        }
        setTeamData(map);
      }
    };

    loadConfigs();
    loadTeamsData();
  }, []);

  const persistBrandLogo = async (key: string, logoUrl: string | null) => {
    setBrandSaving(key);
    setBrandError(null);
    try {
      const res = await fetch('/api/admin/logos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, logoUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Falha ao guardar no servidor.');
      
      setBrandLogos(prev => {
        const next = { ...prev };
        if (data.logoUrl) {
          next[key] = { value: data.logoUrl, updated_at: new Date().toISOString() };
        } else {
          delete next[key];
        }
        return next;
      });
      setBrandSavedId(key);
      setTimeout(() => setBrandSavedId(cur => cur === key ? null : cur), 2500);
    } catch (e) {
      setBrandError(e instanceof Error ? e.message : 'Falha ao guardar o logótipo no servidor.');
    } finally {
      setBrandSaving(null);
    }
  };

  const persistTeamLogo = (next: Record<string, Partial<Team>>) => {
    writeTeamOverrides(next);
    setOverrides(next);
  };

  const updateTeamLogo = (id: string, patch: Partial<Team>) => {
    persistTeamLogo({ ...overrides, [id]: { ...overrides[id], ...patch } });
  };

  const persistLogoToServer = async (teamId: string, logoUrl: string | null) => {
    setLogoSaving(teamId);
    setLogoError(null);
    try {
      const res = await fetch('/api/teams/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, logoUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Falha ao guardar no servidor.');
      updateTeamLogo(teamId, { logoUrl: data.logoUrl ?? undefined });
      setTeamData(prev => ({
        ...prev,
        [teamId]: { logoUrl: data.logoUrl || undefined, updated_at: new Date().toISOString() }
      }));
      setLogoSavedId(teamId);
      setTimeout(() => setLogoSavedId(cur => cur === teamId ? null : cur), 2500);
    } catch (e) {
      setLogoError(e instanceof Error ? e.message : 'Falha ao guardar o emblema no servidor.');
    } finally {
      setLogoSaving(null);
    }
  };

  const getBrandLogoUrl = (key: 'logo_vertical' | 'logo_horizontal' | 'logo_horizontal_white' | 'logo_ancaf') => {
    return brandLogos[key]?.value || (
      key === 'logo_vertical' ? '/logo-girabola.png' :
      key === 'logo_horizontal' ? '/logo-girabola-horizontal.png' :
      key === 'logo_horizontal_white' ? '/logo-girabola-horizontal-white.png' :
      '/logo-ancaf.png'
    );
  };

  const brandItems = [
    { key: 'logo_vertical', label: 'Logótipo Principal (Vertical)', desc: 'Marca d\'água animada e holograma de fundo.' },
    { key: 'logo_horizontal', label: 'Logótipo Horizontal (Tema Claro)', desc: 'Cabeçalho e rodapé em fundo claro.' },
    { key: 'logo_horizontal_white', label: 'Logótipo Horizontal (Tema Escuro)', desc: 'Cabeçalho e rodapé em fundo escuro.' },
    { key: 'logo_ancaf', label: 'Logótipo Institucional (ANCAF)', desc: 'Menu institucional e ecrã de login.' },
  ] as const;

  return (
    <div className="space-y-10">
      <SectionHeader icon={ImagePlus} subtitle="IDENTIDADE_VISUAL" title="Gestão de Logótipos" />

      {/* ── SECÇÃO 1: LOGÓTIPOS DE MARCA ── */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2">Logótipos do Portal (Identidade Visual)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brandItems.map((item) => {
            const currentUrl = getBrandLogoUrl(item.key);
            const isEdited = !!brandLogos[item.key];
            const isSaving = brandSaving === item.key;
            const isSaved = brandSavedId === item.key;

            return (
              <Panel key={item.key} className="flex flex-col gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{item.label}</h4>
                  <p className="text-[10px] font-mono text-zinc-500 mt-0.5">{item.desc}</p>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-black/30 p-2 flex items-center justify-center flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentUrl}
                      alt={item.label}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent/10 border border-accent/40 text-accent font-mono text-[10px] uppercase tracking-widest transition-colors ${isSaving ? 'opacity-60 cursor-wait' : 'hover:bg-accent/20 cursor-pointer'}`}>
                      <ImagePlus size={12} /> Carregar imagem
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isSaving}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await fileToLogoDataUrl(file, 512); // Logotipos de marca podem ser maiores
                            await persistBrandLogo(item.key, url);
                          } catch {
                            setBrandError('Erro ao ler a imagem.');
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>

                    <input
                      className="admin-input"
                      placeholder="ou colar URL externa (https://…)"
                      defaultValue={brandLogos[item.key]?.value || ''}
                      onBlur={(e) => {
                        const val = e.target.value.trim();
                        if (val === (brandLogos[item.key]?.value || '')) return;
                        persistBrandLogo(item.key, val || null);
                      }}
                    />

                    <p className="text-[9px] font-mono text-zinc-500">
                      {formatDateTime(brandLogos[item.key]?.updated_at)}
                    </p>

                    {isSaving && (
                      <p className="text-[9px] font-mono text-accent flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> A guardar...</p>
                    )}
                    {isSaved && !isSaving && (
                      <p className="text-[9px] font-mono text-green-400 flex items-center gap-1"><CheckCircle2 size={10} /> Atualizado globalmente.</p>
                    )}
                  </div>

                  {isEdited && (
                    <button
                      onClick={() => persistBrandLogo(item.key, null)}
                      disabled={isSaving}
                      className="self-start inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[9px] uppercase tracking-wider hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      title="Repor padrão de fábrica"
                    >
                      <RefreshCw size={10} /> Repor
                    </button>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
        {brandError && <p className="text-xs font-mono text-red-400">{brandError}</p>}
      </div>

      {/* ── SECÇÃO 2: EMBLEMAS DE CLUBES ── */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2">Emblemas das Equipas (Atualização Rápida)</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEAMS.map((base) => {
            const overrideEntry = overrides[base.id];
            const isEdited = !!overrideEntry?.logoUrl;
            const isSaving = logoSaving === base.id;
            const isSaved = logoSavedId === base.id;

            return (
              <Panel key={base.id} className="flex flex-col justify-between gap-3 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <TeamCrest teamId={base.id} size={56} className="bg-white/40 dark:bg-zinc-900/30 p-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80" />
                    {isEdited && (
                      <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[8px] font-mono font-bold px-1 rounded uppercase">
                        editado
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground truncate max-w-[150px]">{base.name}</h4>
                    <p className="text-[10px] font-mono text-zinc-500">{base.shortName}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`inline-flex w-full items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-accent/5 border border-accent/25 text-accent font-mono text-[9px] uppercase tracking-wider transition-colors ${isSaving ? 'opacity-60 cursor-wait' : 'hover:bg-accent/10 cursor-pointer'}`}>
                    <ImagePlus size={10} /> Enviar Ficheiro
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isSaving}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const url = await fileToLogoDataUrl(file);
                          updateTeamLogo(base.id, { logoUrl: url });
                          await persistLogoToServer(base.id, url);
                        } catch {
                          setLogoError('Erro ao ler imagem.');
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>

                  <input
                    className="admin-input text-center text-[10px]"
                    placeholder="ou URL externa"
                    defaultValue={overrideEntry?.logoUrl && !overrideEntry.logoUrl.startsWith('data:') ? overrideEntry.logoUrl : ''}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      const current = overrideEntry?.logoUrl && !overrideEntry.logoUrl.startsWith('data:') ? overrideEntry.logoUrl : '';
                      if (val === current) return;
                      updateTeamLogo(base.id, { logoUrl: val || undefined });
                      persistLogoToServer(base.id, val || null);
                    }}
                  />

                  <div className="text-[8px] font-mono text-zinc-400 mt-1 min-h-[12px] truncate">
                    {formatDateTime(teamData[base.id]?.updated_at)}
                  </div>

                  <div className="flex items-center justify-center gap-2 min-h-[14px]">
                    {isSaving && (
                      <span className="text-[8px] font-mono text-accent flex items-center gap-0.5"><Loader2 size={8} className="animate-spin" /> A guardar...</span>
                    )}
                    {isSaved && !isSaving && (
                      <span className="text-[8px] font-mono text-green-400 flex items-center gap-0.5"><CheckCircle2 size={8} /> Guardado</span>
                    )}
                    {isEdited && !isSaving && (
                      <button
                        onClick={() => {
                          updateTeamLogo(base.id, { logoUrl: undefined });
                          persistLogoToServer(base.id, null);
                        }}
                        className="text-[8px] font-mono text-red-400 hover:underline uppercase"
                      >
                        Repor Original
                      </button>
                    )}
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
        {logoError && <p className="text-xs font-mono text-red-400 mt-2 text-center">{logoError}</p>}
      </div>
    </div>
  );
}
