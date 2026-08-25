'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, Users, Activity, Award, BarChart3,
  Goal, ArrowLeftRight, Flag, Trophy, Clock, Tv
} from 'lucide-react';
import { MatchDetail, Team, LineupPlayer, MatchTeamStats, PitchPosition, getMatchOfficials, getMatchBroadcast, getTeamById, isMatchDateOfficial } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';
import { ROUTES } from '@/lib/routes';

interface MatchDetailClientProps {
  detail: MatchDetail;
  homeTeam?: Team;
  awayTeam?: Team;
}

const ratingColor = (r: number) =>
  r >= 8 ? '#22c55e' : r >= 7 ? '#00F5FF' : r >= 6 ? '#F9C304' : '#ef4444';

const POS_LABEL: Record<PitchPosition, string> = {
  GK: 'Guarda-redes', DEF: 'Defesas', MID: 'Médios', FWD: 'Avançados',
};

function PlayerName({ p }: { p: LineupPlayer }) {
  return p.playerId ? (
    <Link href={`/players/${p.playerId}`} className="hover:text-accent transition-colors">
      {p.name}
    </Link>
  ) : (
    <span>{p.name}</span>
  );
}

// ── Aba: Estatísticas (barras comparativas) ────────────────────────
function StatBar({ label, home, away, suffix = '' }: { label: string; home: number; away: number; suffix?: string }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  const homeWins = home >= away;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between font-mono text-xs">
        <span className={`font-bold ${homeWins ? 'text-foreground' : 'text-zinc-500'}`}>{home}{suffix}</span>
        <span className="text-zinc-500 uppercase text-[10px] tracking-wider">{label}</span>
        <span className={`font-bold ${!homeWins ? 'text-foreground' : 'text-zinc-500'}`}>{away}{suffix}</span>
      </div>
      <div className="flex gap-1 h-2">
        <div className="flex-1 flex justify-end">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${homePct}%` }} transition={{ duration: 0.7 }}
            className={`h-full rounded-l-full ${homeWins ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-700'}`}
          />
        </div>
        <div className="flex-1">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${100 - homePct}%` }} transition={{ duration: 0.7 }}
            className={`h-full rounded-r-full ${!homeWins ? 'bg-accent' : 'bg-zinc-300 dark:bg-zinc-700'}`}
          />
        </div>
      </div>
    </div>
  );
}

function UnpublishedStat({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200/60 pb-3 font-mono text-xs last:border-b-0 last:pb-0 dark:border-zinc-800/60">
      <span className="text-zinc-500">—</span>
      <span className="text-zinc-500 uppercase text-[10px] tracking-wider">{label}</span>
      <span className="text-zinc-500">—</span>
    </div>
  );
}

function StatsTab({ home, away, isFinished, officialStatKeys }: { home: MatchTeamStats; away: MatchTeamStats; isFinished: boolean; officialStatKeys: (keyof MatchTeamStats)[] }) {
  if (!isFinished) {
    return (
      <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-10 text-center">
        <Clock size={28} className="text-accent mx-auto mb-4" />
        <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
          Estatísticas disponíveis após a realização do jogo.
        </p>
      </AnimatedCard>
    );
  }
  const published = new Set(officialStatKeys);
  const allRows: { key: keyof MatchTeamStats; label: string; h: number; a: number; suffix?: string }[] = [
    { key: 'possession', label: 'Posse de bola', h: home.possession, a: away.possession, suffix: '%' },
    { key: 'shots', label: 'Remates', h: home.shots, a: away.shots },
    { key: 'shotsOnTarget', label: 'Remates à baliza', h: home.shotsOnTarget, a: away.shotsOnTarget },
    { key: 'passAccuracy', label: 'Precisão de passe', h: home.passAccuracy, a: away.passAccuracy, suffix: '%' },
    { key: 'passes', label: 'Passes', h: home.passes, a: away.passes },
    { key: 'corners', label: 'Cantos', h: home.corners, a: away.corners },
    { key: 'fouls', label: 'Faltas', h: home.fouls, a: away.fouls },
    { key: 'offsides', label: 'Foras de jogo', h: home.offsides, a: away.offsides },
    { key: 'saves', label: 'Defesas (GR)', h: home.saves, a: away.saves },
    { key: 'yellowCards', label: 'Cartões amarelos', h: home.yellowCards, a: away.yellowCards },
    { key: 'redCards', label: 'Cartões vermelhos', h: home.redCards, a: away.redCards },
  ];
  return (
    <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6 sm:p-8 space-y-5">
      {allRows.map((r) => (
        published.has(r.key)
          ? <StatBar key={r.key} label={r.label} home={r.h} away={r.a} suffix={r.suffix} />
          : <UnpublishedStat key={r.key} label={r.label} />
      ))}
      {published.size === 0 && (
        <p className="pt-2 text-center text-[10px] font-mono uppercase tracking-wider text-zinc-500">
          Valores oficiais ainda não publicados para este jogo.
        </p>
      )}
    </AnimatedCard>
  );
}

// ── Aba: Escalações ────────────────────────────────────────────────
function LineupColumn({ title, accent, lineup, isFinished, coach }: { title: string; accent: string; lineup: LineupPlayer[]; isFinished: boolean; coach?: string }) {
  const starters = lineup.filter(p => p.isStarter);
  const subs = lineup.filter(p => !p.isStarter);
  const groups: PitchPosition[] = ['GK', 'DEF', 'MID', 'FWD'];

  const Row = ({ p }: { p: LineupPlayer }) => (
    <div className="flex items-center justify-between py-2 border-b border-zinc-200/50 dark:border-zinc-900/50 font-mono text-xs">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-6 text-center text-zinc-500 flex-shrink-0">{p.number > 0 ? p.number : '—'}</span>
        <span className="text-zinc-800 dark:text-zinc-200 truncate"><PlayerName p={p} /></span>
      </div>
      {isFinished && p.rating > 0 && (
        <span
          className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0"
          style={{ color: ratingColor(p.rating), background: `${ratingColor(p.rating)}14`, border: `1px solid ${ratingColor(p.rating)}40` }}
        >
          {p.rating.toFixed(1)}
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
        <h4 className="font-display text-foreground uppercase tracking-wider text-sm">{title}</h4>
      </div>
      {coach && coach !== '—' && (
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Treinador: <span className="text-foreground">{coach}</span></p>
      )}
      <div>
        {groups.map((g) => {
          const players = starters.filter(p => p.position === g);
          if (!players.length) return null;
          return (
            <div key={g} className="mb-3">
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{POS_LABEL[g]}</p>
              {players.map((p, i) => <Row key={i} p={p} />)}
            </div>
          );
        })}
      </div>
      <div>
        <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Suplentes</p>
        {subs.map((p, i) => <Row key={i} p={p} />)}
      </div>
    </div>
  );
}

// ── Aba: Resumo (cronologia + destaque) ────────────────────────────
function EventIcon({ type }: { type: string }) {
  if (type === 'goal') return <Goal size={14} className="text-green-400" />;
  if (type === 'yellow') return <span className="w-3 h-4 rounded-[2px] bg-yellow-400 inline-block" />;
  if (type === 'red') return <span className="w-3 h-4 rounded-[2px] bg-red-500 inline-block" />;
  if (type === 'warning') return <Flag size={14} className="text-amber-500" />;
  if (type === 'sub') return <ArrowLeftRight size={14} className="text-accent" />;
  return null;
}

function SummaryTab({ detail }: { detail: MatchDetail }) {
  const { events, manOfTheMatch, attendance, referee, match } = detail;
  const publishedManOfTheMatch = match.status === 'finished' ? manOfTheMatch : undefined;
  const hasOfficialDate = isMatchDateOfficial(match);
  const officials = getMatchOfficials(match);
  const broadcaster = getMatchBroadcast(match);
  return (
    <div className="space-y-8">
      {/* Cronologia */}
      <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
        <h3 className="text-md font-display text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
          <Activity size={16} className="text-accent" /> Cronologia do Jogo
        </h3>
        {events.length === 0 ? (
          <p className="text-xs text-zinc-500 font-mono italic">Jogo agendado — sem eventos registados.</p>
        ) : (
          <div className="space-y-1">
            {events.map((e, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${e.team === 'home' ? 'flex-row' : 'flex-row-reverse text-right'}`}
              >
                {e.minute !== undefined && (
                  <span className="font-mono text-[11px] text-zinc-500 w-9 flex-shrink-0">{`${e.minute}'`}</span>
                )}
                <span className="flex-shrink-0"><EventIcon type={e.type} /></span>
                <div className={`flex flex-col ${e.team === 'away' ? 'items-end' : ''}`}>
                  <span className="font-mono text-xs text-foreground">
                    {e.playerId ? <Link href={`/players/${e.playerId}`} className="hover:text-accent transition-colors">{e.player}</Link> : e.player}
                    {e.detail && e.type !== 'yellow' && e.type !== 'red' && <span className="text-zinc-500"> · {e.detail}</span>}
                  </span>
                  {e.type === 'sub' && e.playerOut && (
                    <span className="font-mono text-[10px] text-zinc-600">↓ {e.playerOut}</span>
                  )}
                  {e.type === 'goal' && <span className="font-mono text-[10px] text-green-500/80 uppercase tracking-wider">Golo</span>}
                  {e.type === 'warning' && <span className="font-mono text-[10px] text-amber-500/80 uppercase tracking-wider">Advertência verbal</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </AnimatedCard>

      {/* Destaque + informações */}
      <div className={`grid grid-cols-1 gap-6 ${publishedManOfTheMatch ? 'sm:grid-cols-2' : ''}`}>
        {publishedManOfTheMatch && (
        <AnimatedCard variant="holographic" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
          <h3 className="text-md font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-primary" /> Homem do Jogo
          </h3>
          <div className="flex items-center gap-4">
            <div
              className="font-display text-3xl font-black w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ color: ratingColor(publishedManOfTheMatch.rating), background: `${ratingColor(publishedManOfTheMatch.rating)}12`, border: `1px solid ${ratingColor(publishedManOfTheMatch.rating)}40` }}
            >
              {publishedManOfTheMatch.rating.toFixed(1)}
            </div>
            <div>
              <p className="font-display text-foreground uppercase text-lg leading-tight">
                {publishedManOfTheMatch.playerId ? (
                  <Link href={`/players/${publishedManOfTheMatch.playerId}`} className="hover:text-accent transition-colors">{publishedManOfTheMatch.name}</Link>
                ) : publishedManOfTheMatch.name}
              </p>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                {publishedManOfTheMatch.team === 'home' ? match.homeTeam : match.awayTeam}
              </p>
            </div>
          </div>
        </AnimatedCard>
        )}

        <div className="bg-white/30 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 p-6 rounded-2xl space-y-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <MapPin size={14} className="text-zinc-600" /> <span className="text-zinc-700 dark:text-zinc-300">{match.stadium}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users size={14} className="text-zinc-600" /> <span className="text-zinc-700 dark:text-zinc-300">{attendance > 0 ? `${attendance.toLocaleString('pt-AO')} espetadores` : 'A definir'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Flag size={14} className="text-zinc-600" /> <span className="text-zinc-700 dark:text-zinc-300">Árbitro: {referee}</span>
          </div>
          <div className="flex items-start gap-3">
            <Flag size={14} className="text-zinc-600 mt-0.5" />
            <span className="text-zinc-600 dark:text-zinc-400">
              Assistentes: {officials.assistants[0]} · {officials.assistants[1]}
              <span className="block">4.º Árbitro: {officials.fourth}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Tv size={14} className="text-zinc-600" /> <span className="text-zinc-700 dark:text-zinc-300">Transmissão: {broadcaster}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={14} className="text-zinc-600" />
            <span className="text-zinc-700 dark:text-zinc-300">
              {new Date(match.date).toLocaleDateString('pt-AO', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}{hasOfficialDate ? '' : ' · Data provisória/editável'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

type TabKey = 'resumo' | 'estatisticas' | 'escalacoes';

export default function MatchDetailClient({
  detail, homeTeam: serverHome, awayTeam: serverAway,
}: MatchDetailClientProps) {
  const { match } = detail;
  const [activeTab, setActiveTab] = useState<TabKey>('resumo');

  // Os clubes são resolvidos no servidor, antes dos overrides do admin
  // carregarem; reavaliar aqui aplica nome, cores e estádio já editados.
  const homeTeam = getTeamById(match.homeTeamId) ?? serverHome;
  const awayTeam = getTeamById(match.awayTeamId) ?? serverAway;
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';
  const hasOfficialDate = isMatchDateOfficial(match);

  const homeColor = homeTeam?.colorsHex?.[0] ?? '#5C0F8B';
  const awayColor = awayTeam?.colorsHex?.[0] ?? '#E6540F';

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'resumo', label: 'Resumo', icon: Activity },
    { key: 'estatisticas', label: 'Estatísticas', icon: BarChart3 },
    { key: 'escalacoes', label: 'Escalações', icon: Users },
  ];

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
      <Link href={ROUTES.calendar} className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest mb-8 hover:-translate-x-1 transition-transform">
        <ArrowLeft size={14} /> Voltar ao Calendário
      </Link>

      {/* Placar */}
      <AnimatedCard variant="holographic" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200/80 dark:border-zinc-900/80 p-8 mb-8 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-1/2 h-full opacity-[0.07] pointer-events-none"
          style={{ background: `radial-gradient(circle at left, ${homeColor}, transparent 70%)` }}
        />
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-[0.07] pointer-events-none"
          style={{ background: `radial-gradient(circle at right, ${awayColor}, transparent 70%)` }}
        />

        <div className="flex flex-col items-center gap-2 mb-6 relative z-10">
          <span className="text-[9px] font-mono bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-full uppercase tracking-widest">
            Jornada {match.round} · {isFinished ? 'Terminado' : isLive ? `${match.liveMinute ?? ''}' · Em direto` : 'Agendado'}
          </span>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-2 flex-wrap justify-center">
            <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(match.date).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}{hasOfficialDate ? '' : ' · Provisória'}</span>
            <span className="flex items-center gap-1"><MapPin size={10} /> {match.stadium}</span>
            <span className="flex items-center gap-1 text-accent"><Tv size={10} /> {getMatchBroadcast(match)}</span>
          </span>
        </div>

        <div className="grid grid-cols-3 items-center gap-4 relative z-10">
          {/* Casa */}
          <Link href={homeTeam ? `/teams/${homeTeam.id}` : '#'} className="text-center group">
            <TeamCrest teamId={match.homeTeamId} size={80} className="mx-auto mb-3 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
            <p className="font-display text-foreground uppercase text-sm md:text-base leading-tight group-hover:text-accent transition-colors">{match.homeTeam}</p>
          </Link>

          {/* Resultado */}
          <div className="text-center">
            {isFinished || isLive ? (
              <div className="font-display text-5xl md:text-6xl font-black text-foreground tracking-tight">
                {match.homeScore}<span className="text-zinc-700 mx-2">:</span>{match.awayScore}
                {isLive && <span className="block mt-2 text-xs font-mono uppercase tracking-widest text-red-500">● Em direto</span>}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Clock size={22} className="text-accent animate-pulse" />
                <span className="font-mono text-zinc-600 dark:text-zinc-400 text-sm">VS</span>
              </div>
            )}
          </div>

          {/* Fora */}
          <Link href={awayTeam ? `/teams/${awayTeam.id}` : '#'} className="text-center group">
            <TeamCrest teamId={match.awayTeamId} size={80} className="mx-auto mb-3 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
            <p className="font-display text-foreground uppercase text-sm md:text-base leading-tight group-hover:text-accent transition-colors">{match.awayTeam}</p>
          </Link>
        </div>
      </AnimatedCard>

      {/* Abas */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-200/80 dark:border-zinc-900/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-4 py-3 font-mono text-[11px] uppercase tracking-widest transition-colors ${isActive ? 'text-foreground' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              <Icon size={14} className={isActive ? 'text-accent' : ''} /> {tab.label}
              {isActive && <motion.span layoutId="matchTabUnderline" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-accent" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'resumo' && <SummaryTab detail={detail} />}
          {activeTab === 'estatisticas' && <StatsTab home={detail.homeStats} away={detail.awayStats} isFinished={isFinished} officialStatKeys={detail.officialStatKeys} />}
          {activeTab === 'escalacoes' && (
            <>
              {!isFinished && !isLive && (
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">Onze provável</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <LineupColumn title={match.homeTeam} accent={homeColor} lineup={detail.homeLineup} isFinished={isFinished} coach={homeTeam?.coach} />
                <LineupColumn title={match.awayTeam} accent={awayColor} lineup={detail.awayLineup} isFinished={isFinished} coach={awayTeam?.coach} />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {!isFinished && (
        <p className="text-center text-[10px] font-mono text-amber-400/70 mt-8 flex items-center justify-center gap-2">
          <Award size={12} /> {isLive ? `Jogo em direto — resultado atualizado aos ${match.liveMinute ?? ''}'.` : 'Jogo agendado — estatísticas e eventos disponíveis após a realização.'}
        </p>
      )}
    </div>
  );
}
