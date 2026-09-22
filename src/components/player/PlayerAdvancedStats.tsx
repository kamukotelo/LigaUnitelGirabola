'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  Clock3,
  Crosshair,
  Flame,
  Home,
  Plane,
  ShieldCheck,
  SquareStack,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Player, PlayerAdvancedStats as PlayerAdvancedStatsData, getPlayerAdvancedStats } from '@/lib/data';

const ROLE_LABEL: Record<PlayerAdvancedStatsData['log'][number]['role'], string> = {
  starter: 'Titular',
  substitute: 'Suplente utilizado',
  unused: 'Não utilizado',
  unknown: 'Trocas por publicar',
};

const ROLE_CLASS: Record<PlayerAdvancedStatsData['log'][number]['role'], string> = {
  starter: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  substitute: 'bg-accent/10 text-accent border-accent/20',
  unused: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  unknown: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
};

const OUTCOME_CLASS = {
  win: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  draw: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/25',
  loss: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
} as const;

const OUTCOME_LETTER = { win: 'V', draw: 'E', loss: 'D' } as const;

/** Caixa de um indicador. `hint` explica sempre de onde sai o número. */
function Metric({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/40 p-3 sm:p-3.5">
      <span className="block text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-zinc-500">{label}</span>
      <span
        className="mt-1 block font-display text-xl sm:text-2xl font-black leading-none text-foreground"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </span>
      {hint && <span className="mt-1 block text-[8px] sm:text-[9px] font-mono text-zinc-500">{hint}</span>}
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-4 sm:mb-5">
      <h4 className="flex items-center gap-2 font-display text-xs uppercase text-foreground sm:text-sm">
        {icon} {title}
      </h4>
      <p className="mt-0.5 text-[9px] font-mono text-zinc-500 sm:text-[10px]">{subtitle}</p>
    </div>
  );
}

export default function PlayerAdvancedStats({ player }: { player: Player }) {
  const stats = useMemo(() => getPlayerAdvancedStats(player.id), [player.id]);

  if (!stats) {
    return (
      <div className="flex items-start gap-3.5 rounded-2xl border border-zinc-500/20 bg-zinc-500/5 p-6">
        <AlertTriangle className="mt-0.5 shrink-0 text-zinc-500" size={18} />
        <p className="text-xs text-zinc-500">
          Este atleta ainda não consta de nenhuma ficha de jogo oficial desta época. A estatística avançada
          aparece assim que a Direção de Competições publicar uma escalação em que ele figure.
        </p>
      </div>
    );
  }

  const maxPhaseGoals = Math.max(1, ...stats.goalPhases.map((phase) => phase.goals));
  const maxOpponentGoals = Math.max(1, ...stats.goalsByOpponent.map((row) => row.goals));
  const minutesPending = stats.matchesPlayed - stats.matchesWithMinutes;
  const form = [...stats.log].filter((entry) => entry.role === 'starter' || entry.role === 'substitute').slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── 1. CARTÃO DE RENDIMENTO ─────────────────────────────────── */}
      <AnimatedCard variant="hud" className="border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 sm:p-6">
        <SectionTitle
          icon={<Activity size={15} className="shrink-0 text-accent" />}
          title="Rendimento na época"
          subtitle={`Apurado em ${stats.coverage.matchesWithSheet} de ${stats.coverage.teamMatchesFinished} jogos já disputados pelo clube`}
        />

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
          <Metric
            label="Jogos"
            value={stats.matchesPlayed}
            hint={`${stats.starts} titular · ${stats.benchAppearances} do banco`}
          />
          <Metric
            label="Minutos"
            value={stats.matchesWithMinutes > 0 ? `${stats.minutesPlayed}'` : '—'}
            hint={
              stats.matchesWithMinutes > 0
                ? `média ${Math.round(stats.averageMinutes ?? 0)}' em ${stats.matchesWithMinutes} jogos`
                : 'cronologia por publicar'
            }
          />
          <Metric
            label="Golos"
            value={stats.goals}
            accent={stats.goals > 0 ? '#F9C304' : undefined}
            hint={
              stats.penaltyGoals > 0
                ? `${stats.penaltyGoals} de grande penalidade`
                : stats.ownGoals > 0
                ? `${stats.ownGoals} ${stats.ownGoals === 1 ? 'autogolo' : 'autogolos'}`
                : 'sem penáltis convertidos'
            }
          />
          <Metric
            label="Golos / 90'"
            value={stats.goalsPer90 !== undefined ? stats.goalsPer90.toFixed(2) : '—'}
            hint={stats.goalsPer90 !== undefined ? 'sobre os minutos reais' : 'menos de 90 minutos apurados'}
          />
          <Metric
            label="Minutos por golo"
            value={stats.minutesPerGoal !== undefined ? `${Math.round(stats.minutesPerGoal)}'` : '—'}
            hint={stats.minutesPerGoal !== undefined ? 'frequência de finalização' : 'ainda sem golo apurado'}
          />
          <Metric
            label="Disciplina"
            value={
              <span className="flex items-center gap-2">
                <span className="text-amber-500">{stats.yellow}</span>
                <span className="text-zinc-400 text-base">/</span>
                <span className="text-rose-500">{stats.red}</span>
              </span>
            }
            hint="amarelos / vermelhos"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-zinc-200/70 pt-3 text-[9px] font-mono uppercase tracking-wider text-zinc-500 dark:border-zinc-800/70 sm:text-[10px]">
          <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-emerald-600 dark:text-emerald-400">
            {stats.wins} V
          </span>
          <span className="rounded-lg border border-zinc-500/25 bg-zinc-500/10 px-2 py-1">{stats.draws} E</span>
          <span className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-rose-600 dark:text-rose-400">
            {stats.losses} D
          </span>
          {stats.isGoalkeeper && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-accent/20 bg-accent/10 px-2 py-1 text-accent">
              <ShieldCheck size={11} /> {stats.cleanSheets} {stats.cleanSheets === 1 ? 'baliza inviolada' : 'balizas invioladas'}
            </span>
          )}
          {stats.unusedBench > 0 && <span>{stats.unusedBench} no banco sem entrar</span>}
        </div>
      </AnimatedCard>

      {/* ── 2. FORMA RECENTE ────────────────────────────────────────── */}
      {form.length > 0 && (
        <AnimatedCard variant="hud" className="border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 sm:p-6">
          <SectionTitle
            icon={<TrendingUp size={15} className="shrink-0 text-accent" />}
            title="Últimos jogos"
            subtitle="Participação e contributo nas jornadas mais recentes com ficha publicada"
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {form.map((entry) => (
              <Link
                key={entry.matchId}
                href={`/matches/${entry.matchId}`}
                className="min-w-0 rounded-xl border border-zinc-200/80 bg-white/50 p-2.5 transition-colors hover:border-accent/40 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-3"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 sm:text-[9px]">
                    J{entry.round} {entry.venue === 'home' ? 'casa' : 'fora'}
                  </span>
                  <span
                    className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold ${OUTCOME_CLASS[entry.outcome]}`}
                  >
                    {OUTCOME_LETTER[entry.outcome]}
                  </span>
                </div>
                <span className="mt-1 block break-words text-[11px] font-bold uppercase leading-tight text-foreground">
                  {entry.opponent}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] text-zinc-500">
                  {entry.scoreFor}–{entry.scoreAgainst}
                  {entry.minutes !== undefined && ` · ${entry.minutes}'`}
                </span>
                {(entry.goals > 0 || entry.yellow > 0 || entry.red > 0) && (
                  <div className="mt-1.5 flex flex-wrap gap-1 font-mono text-[9px]">
                    {entry.goals > 0 && (
                      <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-bold text-amber-600 dark:text-amber-400">
                        {entry.goals}G
                      </span>
                    )}
                    {entry.yellow > 0 && (
                      <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-600 dark:text-amber-400">
                        {entry.yellow} CA
                      </span>
                    )}
                    {entry.red > 0 && (
                      <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-rose-600 dark:text-rose-400">CV</span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </AnimatedCard>
      )}

      {/* ── 3. GOLOS: MOMENTO, TERRENO E ADVERSÁRIOS ────────────────── */}
      {stats.goals > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <AnimatedCard variant="hud" className="border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 sm:p-6">
            <SectionTitle
              icon={<Clock3 size={15} className="shrink-0 text-accent" />}
              title="Quando marca"
              subtitle={
                stats.goalsWithMinute === stats.goals
                  ? 'Distribuição dos golos por períodos de 15 minutos'
                  : `${stats.goalsWithMinute} de ${stats.goals} golos têm minuto confirmado na ficha`
              }
            />
            <div className="space-y-2.5 sm:space-y-3">
              {stats.goalPhases.map((phase) => (
                <div key={phase.label} className="flex items-center gap-2 sm:gap-3">
                  <span className="w-12 shrink-0 font-mono text-[10px] font-bold text-foreground sm:w-14 sm:text-[11px]">
                    {phase.label}&apos;
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-900">
                    <div
                      className="h-full rounded bg-amber-500 transition-all duration-500"
                      style={{ width: `${(phase.goals / maxPhaseGoals) * 100}%` }}
                    />
                  </div>
                  <span className="w-5 shrink-0 text-right font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-400 sm:text-[11px]">
                    {phase.goals}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-zinc-200/70 pt-4 dark:border-zinc-800/70 sm:gap-3">
              <div className="min-w-0 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <Home size={11} className="shrink-0" /> Em casa
                </span>
                <span className="mt-1 block font-display text-xl font-black text-foreground sm:text-2xl">
                  {stats.homeGoals}
                </span>
                <span className="block font-mono text-[9px] text-zinc-500">
                  {stats.homeMatches} {stats.homeMatches === 1 ? 'jogo' : 'jogos'}
                </span>
              </div>
              <div className="min-w-0 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
                <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  <Plane size={11} className="shrink-0" /> Fora
                </span>
                <span className="mt-1 block font-display text-xl font-black text-foreground sm:text-2xl">
                  {stats.awayGoals}
                </span>
                <span className="block font-mono text-[9px] text-zinc-500">
                  {stats.awayMatches} {stats.awayMatches === 1 ? 'deslocação' : 'deslocações'}
                </span>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard variant="hud" className="border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 sm:p-6">
            <SectionTitle
              icon={<Crosshair size={15} className="shrink-0 text-accent" />}
              title="A quem marca"
              subtitle="Golos por adversário nesta edição do Girabola"
            />
            <div className="space-y-2.5">
              {stats.goalsByOpponent.map((row) => (
                <div key={row.teamId} className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href={`/teams/${row.teamId}`}
                    className="w-24 shrink-0 truncate text-[10px] font-bold uppercase text-foreground transition-colors hover:text-primary sm:w-32 sm:text-[11px]"
                  >
                    {row.team}
                  </Link>
                  <div className="h-2 flex-1 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-900">
                    <div
                      className="h-full rounded bg-primary transition-all duration-500"
                      style={{ width: `${(row.goals / maxOpponentGoals) * 100}%` }}
                    />
                  </div>
                  <span className="w-5 shrink-0 text-right font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-400 sm:text-[11px]">
                    {row.goals}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-zinc-200/70 pt-4 dark:border-zinc-800/70 sm:gap-3">
              <Metric
                label="Golos por jogo"
                value={stats.goalsPerMatch !== undefined ? stats.goalsPerMatch.toFixed(2) : '—'}
                hint={`em ${stats.matchesPlayed} ${stats.matchesPlayed === 1 ? 'jogo' : 'jogos'}`}
              />
              <Metric
                label="Jogos a marcar"
                value={stats.log.filter((entry) => entry.goals > 0).length}
                hint={`${stats.goalsByOpponent.length} ${stats.goalsByOpponent.length === 1 ? 'adversário' : 'adversários'} diferentes`}
              />
            </div>
          </AnimatedCard>
        </div>
      )}

      {/* ── 4. REGISTO JOGO A JOGO ──────────────────────────────────── */}
      <AnimatedCard variant="hud" className="border-zinc-200 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 sm:p-6">
        <SectionTitle
          icon={<SquareStack size={15} className="shrink-0 text-accent" />}
          title="Jogo a jogo"
          subtitle="Cada linha sai da escalação e da cronologia da ficha oficial dessa jornada"
        />

        <div className="space-y-2.5">
          {stats.log.map((entry) => (
            <div
              key={entry.matchId}
              className="rounded-xl border border-zinc-200/80 bg-white/50 p-3 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 rounded-lg border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    J{entry.round}
                  </span>
                  <Link
                    href={`/matches/${entry.matchId}`}
                    className="min-w-0 break-words text-[11px] font-bold uppercase text-foreground transition-colors hover:text-primary sm:text-xs"
                  >
                    {entry.venue === 'home' ? 'vs' : 'em'} {entry.opponent}
                  </Link>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 font-mono text-[10px]">
                  <span className={`rounded border px-1.5 py-0.5 font-bold ${OUTCOME_CLASS[entry.outcome]}`}>
                    {entry.scoreFor}–{entry.scoreAgainst}
                  </span>
                  <span className={`rounded border px-1.5 py-0.5 text-[9px] uppercase ${ROLE_CLASS[entry.role]}`}>
                    {ROLE_LABEL[entry.role]}
                  </span>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] text-zinc-500 sm:text-[10px]">
                {entry.minutes !== undefined ? (
                  <span className="inline-flex items-center gap-1 text-foreground">
                    <Timer size={11} className="shrink-0 text-zinc-500" /> {entry.minutes}&apos;
                  </span>
                ) : entry.role === 'unused' ? (
                  <span>Suplente não utilizado</span>
                ) : (
                  <span>Minutos por publicar</span>
                )}
                {entry.onMinute !== undefined && <span>Entrou ao {entry.onMinute}&apos;</span>}
                {entry.offMinute !== undefined && <span>Saiu ao {entry.offMinute}&apos;</span>}
                {entry.goals > 0 && (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                    <Target size={11} className="shrink-0" />
                    {entry.goals} {entry.goals === 1 ? 'golo' : 'golos'}
                    {entry.goalMinutes.length > 0 && ` (${entry.goalMinutes.map((m) => `${m}'`).join(', ')})`}
                  </span>
                )}
                {entry.ownGoals > 0 && (
                  <span className="text-rose-600 dark:text-rose-400">
                    {entry.ownGoals} {entry.ownGoals === 1 ? 'autogolo' : 'autogolos'}
                  </span>
                )}
                {entry.assists > 0 && <span className="text-accent">{entry.assists} ass.</span>}
                {entry.yellow > 0 && (
                  <span className="text-amber-600 dark:text-amber-400">
                    {entry.yellow} {entry.yellow === 1 ? 'amarelo' : 'amarelos'}
                  </span>
                )}
                {entry.red > 0 && <span className="font-bold text-rose-600 dark:text-rose-400">Vermelho</span>}
                {entry.cleanSheet && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck size={11} className="shrink-0" /> Baliza inviolada
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* ── 5. ORIGEM DOS DADOS ─────────────────────────────────────── */}
      <div className="flex items-start gap-3.5 rounded-2xl border border-zinc-500/20 bg-zinc-500/5 p-4 sm:p-6">
        <Flame className="mt-0.5 shrink-0 text-zinc-500" size={18} />
        <div className="min-w-0 text-[11px] leading-relaxed text-zinc-500">
          <p>
            Todos os números desta aba são calculados a partir das fichas oficiais já publicadas: escalação
            (titulares e suplentes), substituições, golos e cartões. Nada é estimado — onde a ficha ainda não
            publica um dado, o campo fica por preencher.
          </p>
          <p className="mt-1.5">
            Cobertura: {stats.coverage.matchesWithSheet} de {stats.coverage.teamMatchesFinished} jogos disputados pelo clube
            {minutesPending > 0 && ` · ${minutesPending} ${minutesPending === 1 ? 'jogo ainda sem' : 'jogos ainda sem'} cronologia de substituições para apurar minutos`}
            {stats.undeterminedRole > 0 && ` · ${stats.undeterminedRole} ${stats.undeterminedRole === 1 ? 'ficha sem trocas publicadas' : 'fichas sem trocas publicadas'}`}.
          </p>
        </div>
      </div>
    </div>
  );
}
