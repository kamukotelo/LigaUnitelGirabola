'use client';

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Trophy, Calendar, Shield, Zap, Activity, Flame, BarChart3, Clock, MapPin, Handshake, ListOrdered, Newspaper } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedCard from '@/components/ui/AnimatedCard';
import FuturisticButton from '@/components/ui/FuturisticButton';
import TeamCrest from '@/components/ui/TeamCrest';
import { getNewsArticles, getTeams, getMatches, getPlayers, getMatchesForSeason, STANDINGS, SEASONS, CURRENT_SEASON_ID, UPCOMING_SEASON_ID, TEAMS, type Match } from '@/lib/data';

const ANGOLA_TIME_ZONE = 'Africa/Luanda';

/* ── Animated Number Counter ─────────────────────────────────── */
function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, motionVal, value]);

  return (
    <motion.span ref={ref} className="tabular-nums font-display">
      {display}
    </motion.span>
  );
}

/* ── Particle Data Stream ─────────────────────────────────────── */
function DataParticles() {
  const chars = '01アイウエオカキクケコサシスセソタチツテト∑∂∆Ω≈◆▲●'.split('');
  const streams = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${(i / 8) * 100}%`,
    delay: i * 0.5,
    duration: 5 + (i % 3),
    char: chars[i % chars.length],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {streams.map((s) => (
        <motion.span
          key={s.id}
          className="absolute text-[9px] font-mono text-primary/30 select-none"
          style={{ left: s.left }}
          initial={{ y: '-10%', opacity: 0 }}
          animate={{ y: '110%', opacity: [0, 0.5, 0.5, 0] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'linear' }}
        >
          {s.char}
        </motion.span>
      ))}
    </div>
  );
}

/* ── Radar Sweep ─────────────────────────────────────────────── */
function RadarSweep() {
  return (
    <div className="relative w-28 h-28 rounded-full border border-primary/20 overflow-hidden">
      <div className="absolute inset-0 rounded-full border border-primary/10" />
      <div className="absolute inset-3 rounded-full border border-primary/15" />
      <div className="absolute inset-6 rounded-full border border-primary/20" />
      <motion.div
        className="absolute top-1/2 left-1/2 w-[50%] h-[1.5px] origin-left"
        style={{
          background: 'linear-gradient(90deg, rgba(209,32,138,0.9), transparent)',
          marginTop: '-0.75px',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
      </div>
    </div>
  );
}

/* ── Stylized Soccer Ball ─────────────────────────────────────── */
function SoccerBall({ size = 58 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="50" cy="50" r="46" fill="#FAFAFA" stroke="#0B0B12" strokeWidth="2.5" />
      <polygon points="50,36 63.3,45.7 58.2,61.3 41.8,61.3 36.7,45.7" fill="#0B0B12" />
      <g stroke="#0B0B12" strokeWidth="2.5" strokeLinecap="round">
        <line x1="50" y1="36" x2="50" y2="6" />
        <line x1="63.3" y1="45.7" x2="91" y2="36" />
        <line x1="58.2" y1="61.3" x2="74" y2="85" />
        <line x1="41.8" y1="61.3" x2="26" y2="85" />
        <line x1="36.7" y1="45.7" x2="9" y2="36" />
      </g>
      <g fill="#0B0B12">
        <circle cx="50" cy="9" r="4" />
        <circle cx="88" cy="38" r="4" />
        <circle cx="73" cy="83" r="4" />
        <circle cx="27" cy="83" r="4" />
        <circle cx="12" cy="38" r="4" />
      </g>
    </svg>
  );
}

/* ── Girabola / Angolan football animated scene ───────────────── */
function PitchOrbit() {
  // Cores da bandeira de Angola (vermelho, preto) + dourado do emblema
  const satellites = [
    { color: '#D21515', glow: 'rgba(210,21,21,0.85)' },
    { color: '#0B0B12', glow: 'rgba(255,255,255,0.35)' },
    { color: '#F9C304', glow: 'rgba(249,195,4,0.9)' },
  ];

  return (
    <div className="relative w-[320px] h-[340px] sm:w-[440px] sm:h-[460px] flex items-center justify-center select-none overflow-hidden" aria-hidden>
      {/* Glow base */}
      <div
        className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(210,21,21,0.28), rgba(249,195,4,0.12) 55%, transparent 72%)' }}
      />

      {/* Varredura radar */}
      <motion.div
        className="absolute w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] rounded-full"
        style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(249,195,4,0.20) 40deg, transparent 95deg)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      />

      {/* Linhas do campo (círculo central + meio-campo) */}
      <div className="absolute w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] rounded-full border border-primary/25" />
      <div className="absolute w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] rounded-full border border-accent/20" />
      <div className="absolute w-[110px] h-[110px] sm:w-[150px] sm:h-[150px] rounded-full border-2 border-foreground/20" />
      <div className="absolute w-[240px] sm:w-[340px] h-px bg-primary/20" />
      <div className="absolute w-px h-[240px] sm:h-[340px] bg-primary/10" />
      <div className="absolute w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_rgba(249,195,4,0.9)]" />

      {/* Brasão Girabola em marca-d'água */}
      <Image src="/logo-girabola.png" alt="" aria-hidden width={80} height={80} className="absolute w-20 h-20 sm:w-28 sm:h-28 object-contain opacity-[0.07]" />

      {/* Órbita da bola */}
      <motion.div
        className="absolute w-[240px] h-[240px] sm:w-[340px] sm:h-[340px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div
          className="absolute left-1/2 -top-3 sm:-top-4 -translate-x-1/2 drop-shadow-[0_0_14px_rgba(0,0,0,0.65)]"
          animate={{ rotate: -360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        >
          <SoccerBall size={42} />
        </motion.div>
      </motion.div>

      {/* Satélites nas cores de Angola */}
      <motion.div
        className="absolute w-[180px] h-[180px] sm:w-[250px] sm:h-[250px]"
        animate={{ rotate: -360 }}
        transition={{ duration: 13, repeat: Infinity, ease: 'linear' }}
      >
        {satellites.map((s, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 w-2 h-2 sm:w-3 sm:h-3 -ml-1 -mt-1 sm:-ml-1.5 sm:-mt-1.5 rounded-full"
            style={{
              backgroundColor: s.color,
              boxShadow: `0 0 12px ${s.glow}`,
              transform: `rotate(${i * 120}deg) translateY(-90px) sm:translateY(-125px)`,
            }}
          />
        ))}
      </motion.div>

      {/* Etiqueta */}
      <div className="absolute bottom-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-pulse" />
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/80">
          Liga Unitel Girabola · Angola
        </span>
      </div>
    </div>
  );
}

/* ── Compact Match Row (resultados / próximos jogos) ──────────── */
function MatchRow({ match }: { match: Match }) {
  const isFinished = match.status === 'finished';
  const matchDate = new Date(match.date);
  const dateLabel = matchDate.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', timeZone: ANGOLA_TIME_ZONE });
  const timeLabel = matchDate.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit', timeZone: ANGOLA_TIME_ZONE });
  const homeObj = TEAMS.find((t) => t.id === match.homeTeamId);
  const awayObj = TEAMS.find((t) => t.id === match.awayTeamId);
  const homeAbbr = homeObj?.shortName ?? match.homeTeam.substring(0, 3).toUpperCase();
  const awayAbbr = awayObj?.shortName ?? match.awayTeam.substring(0, 3).toUpperCase();

  return (
    <Link href={`/matches/${match.id}`} className="block group">
      <div className="flex items-center gap-3 py-3 px-3 sm:px-4 rounded-xl hover:bg-white/50 dark:hover:bg-zinc-900/50 border border-transparent hover:border-accent/30 transition-colors">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider w-10 flex-shrink-0">J{match.round}</span>

        {/* Home */}
        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
          <span className="truncate text-xs sm:text-sm font-bold text-foreground text-right">{homeAbbr}</span>
          <TeamCrest teamId={match.homeTeamId} size={26} className="flex-shrink-0" />
        </div>

        {/* Score / hora */}
        <div className="flex-shrink-0 w-16 text-center">
          {isFinished ? (
            <span className="font-mono font-black text-sm text-foreground bg-primary/10 border border-primary/20 rounded-lg px-2 py-0.5">
              {match.homeScore}-{match.awayScore}
            </span>
          ) : (
            <span className="font-mono text-[11px] text-accent font-bold">{timeLabel}</span>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <TeamCrest teamId={match.awayTeamId} size={26} className="flex-shrink-0" />
          <span className="truncate text-xs sm:text-sm font-bold text-foreground">{awayAbbr}</span>
        </div>

        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider w-10 flex-shrink-0 text-right hidden sm:block">{dateLabel}</span>
      </div>
    </Link>
  );
}

export default function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Dynamic statistics from helper functions
  const teamsCount = getTeams().length;
  const seasonMatches = getMatches();
  const matchesPlayed = seasonMatches.filter((m) => m.status === 'finished').length;
  const roundsCount = new Set(seasonMatches.map((m) => m.round)).size;
  const allPlayers = getPlayers();
  const topScorer = allPlayers.length > 0 ? [...allPlayers].sort((a, b) => b.goals - a.goals)[0] : null;
  const topScorerName = topScorer ? topScorer.name.split(' ')[0] : 'Dagó';
  const topScorerGoals = topScorer ? topScorer.goals : 18;
  const topScorerFull = topScorer ? topScorer.name : 'Dagó Tshibamba';

  // Época em curso (resultados consolidados) — fonte única em data.ts
  const activeSeasonLabel = SEASONS.find((s) => s.id === CURRENT_SEASON_ID)?.label ?? '2025/2026';

  // Campeão / vice derivados da classificação (coincidem sempre com a tabela)
  const champion = STANDINGS[0]?.teamName ?? 'Petro de Luanda';
  const runnerUp = STANDINGS[1]?.teamName ?? '';

  const tickerItems = [
    `● ${champion} campeão do Liga Unitel Girabola ${activeSeasonLabel}`,
    `◆ ${topScorerFull} melhor marcador com ${topScorerGoals} golos`,
    runnerUp ? `▲ ${runnerUp} fecha a época no 2.º lugar` : '',
    '■ Portal digital do futebol de Angola',
    '● Cobertura completa em tempo real',
  ].filter(Boolean);

  const stats = [
    { label: 'Clubes', value: teamsCount, icon: Shield, href: '/teams' },
    { label: 'Jogos Disputados', value: matchesPlayed, icon: Trophy, href: '/competicao?tab=calendario' },
    { label: 'Jornadas', value: roundsCount, icon: Calendar, href: '/competicao?tab=calendario' },
    { label: 'Golos Marcados (' + topScorerName + ')', value: topScorerGoals, icon: Flame, href: '/competicao?tab=estatisticas' },
  ];

  const news = getNewsArticles().slice(0, 4);
  const featuredNews = news[0];
  const secondaryNews = news.slice(1, 4);

  // Jogos — últimos resultados (época em curso) e próxima jornada (época a disputar)
  const recentResults = [...seasonMatches]
    .filter((m) => m.status === 'finished')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const upcomingMatches = [...getMatchesForSeason(UPCOMING_SEASON_ID)]
    .filter((m) => m.status !== 'finished')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Classificação — pré-visualização do topo da tabela
  const topStandings = STANDINGS.slice(0, 6);

  // Parceiros oficiais do ecossistema Liga Unitel Girabola
  const partners = [
    { name: 'Unitel', role: 'Patrocinador Principal' },
    { name: 'FAF', role: 'Federação Angolana de Futebol' },
    { name: 'ANCAF', role: 'Associação Nacional de Clubes' },
    { name: 'TPA', role: 'Transmissão Oficial' },
    { name: 'ZAP', role: 'Media Partner' },
    { name: 'Rádio Nacional', role: 'Rádio Oficial' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative h-[85vh] flex items-center bg-background overflow-hidden border-b border-primary/20">
        <div className="absolute inset-0 angola-field opacity-0 dark:opacity-30" />
        <div className="absolute inset-0 cyber-grid-bg" />
        <div className="scanline-overlay" />
        <DataParticles />

        {/* Decoractive Radar */}
        <div className="absolute top-10 right-10 opacity-30 hidden lg:block">
          <RadarSweep />
        </div>

        {/* Live Indicator */}
        <div className="absolute top-6 left-6 flex items-center gap-2 z-20">
          <span className="w-2 h-2 rounded-full bg-green-500 status-pulse" />
          <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest font-semibold">
            PLATAFORMA_ONLINE
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <div>
            <h1 className="mb-8">
              <span className="sr-only">Liga Unitel Girabola</span>
              <Image
                src="/logo-girabola-horizontal.svg"
                alt="Liga Unitel Girabola"
                width={396}
                height={219}
                priority
                className="w-full max-w-[360px] md:max-w-[460px] h-auto object-contain dark:hidden"
              />
              <Image
                src="/logo-girabola-horizontal-white.png"
                alt="Liga Unitel Girabola"
                width={396}
                height={219}
                priority
                className="hidden w-full max-w-[360px] md:max-w-[460px] h-auto object-contain dark:block"
              />
            </h1>

            <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-xl mb-4 font-bold uppercase tracking-wide">
              O maior portal digital do Campeonato Nacional de Futebol de Angola.
            </p>

            <div className="flex items-center gap-3 mb-10">
              <Activity size={14} className="text-accent animate-pulse" />
              <span className="text-[10px] font-mono text-accent/80 tracking-widest uppercase">
                Edição {activeSeasonLabel} · {champion} Campeão
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/competicao?tab=classificacao">
                <FuturisticButton variant="neon" glitchText>
                  Classificações
                </FuturisticButton>
              </Link>
              <Link href="/competicao?tab=calendario">
                <FuturisticButton variant="outline">
                  Resultados
                </FuturisticButton>
              </Link>
            </div>
          </div>

          <div className="absolute inset-0 lg:relative lg:inset-auto flex items-center justify-center lg:justify-self-center opacity-20 lg:opacity-100 pointer-events-none lg:pointer-events-auto scale-75 md:scale-90 lg:scale-100 -z-10 lg:z-auto mt-24 lg:mt-0">
            <PitchOrbit />
          </div>
        </div>
      </section>

      {/* ── QUICK STATS ───────────────────────────────────────── */}
      <section className="bg-zinc-100 dark:bg-zinc-950 py-12 border-b border-zinc-200 dark:border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          {stats.map((stat, i) => (
            <Link key={i} href={stat.href} className="block group">
              <AnimatedCard
                variant="hud"
                className="text-center relative overflow-hidden cursor-pointer hover:border-accent/40 hover:bg-white/40 dark:hover:bg-zinc-900/40 transition-all duration-350"
                delay={i * 0.1}
              >
                <stat.icon className="text-accent mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" size={24} />
                <h4 className="text-4xl font-display text-primary">
                  <AnimatedCounter value={stat.value} />
                </h4>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-2 group-hover:text-primary transition-colors">
                  {stat.label}
                </p>
              </AnimatedCard>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LIVE TICKER ───────────────────────────────────────── */}
      <div className="bg-primary/5 border-y border-primary/20 py-3 overflow-hidden relative">
        <motion.div
          className="flex gap-12 whitespace-nowrap font-mono text-[10px] text-primary/80 uppercase tracking-wider"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 4 }).map((_, r) => (
            <span key={r} className="flex gap-12">
              {tickerItems.map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── JOGOS (Resultados & Próxima Jornada) ──────────────── */}
      <section className="py-20 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} className="text-accent" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent">MATCH_CENTER</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display uppercase text-foreground">Os Jogos</h2>
              <p className="text-primary font-bold uppercase tracking-widest text-xs mt-1">
                Resultados recentes e a próxima jornada
              </p>
            </div>
            <Link href="/competicao?tab=calendario" className="premium-button text-xs py-3.5 px-6">
              Calendário Completo <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Últimos resultados */}
            <AnimatedCard variant="hud" className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3 px-2">
                <Trophy size={14} className="text-accent" />
                <h3 className="text-sm font-display uppercase tracking-wider text-foreground">Últimos Resultados</h3>
              </div>
              <div className="divide-y divide-zinc-200/60 dark:divide-zinc-900/60">
                {recentResults.length > 0 ? (
                  recentResults.map((m) => <MatchRow key={m.id} match={m} />)
                ) : (
                  <p className="text-xs text-zinc-500 font-mono py-6 text-center">Sem resultados disponíveis.</p>
                )}
              </div>
            </AnimatedCard>

            {/* Próxima jornada */}
            <AnimatedCard variant="hud" className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3 px-2">
                <Clock size={14} className="text-primary" />
                <h3 className="text-sm font-display uppercase tracking-wider text-foreground">Próxima Jornada</h3>
                <span className="ml-auto text-[9px] font-mono uppercase tracking-wider text-zinc-500 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-0.5">
                  {SEASONS.find((s) => s.id === UPCOMING_SEASON_ID)?.label ?? '2026/2027'}
                </span>
              </div>
              <div className="divide-y divide-zinc-200/60 dark:divide-zinc-900/60">
                {upcomingMatches.length > 0 ? (
                  upcomingMatches.map((m) => <MatchRow key={m.id} match={m} />)
                ) : (
                  <p className="text-xs text-zinc-500 font-mono py-6 text-center">Calendário por confirmar.</p>
                )}
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* ── CLASSIFICAÇÃO (pré-visualização) ───────────────────── */}
      <section className="py-20 bg-zinc-100 dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ListOrdered size={14} className="text-accent" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent">LEADERBOARD</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display uppercase text-foreground">Classificação</h2>
              <p className="text-primary font-bold uppercase tracking-widest text-xs mt-1">
                Edição {activeSeasonLabel} · topo da tabela
              </p>
            </div>
            <Link href="/competicao?tab=classificacao" className="premium-button text-xs py-3.5 px-6">
              Tabela Completa <ArrowRight size={14} />
            </Link>
          </div>

          <AnimatedCard variant="hud" className="p-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left border-collapse min-w-[420px]">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-900/40 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="py-4 px-4 text-center w-12">#</th>
                  <th className="py-4 px-4">Clube</th>
                  <th className="py-4 px-3 text-center w-12">J</th>
                  <th className="py-4 px-3 text-center w-14 hidden sm:table-cell">DG</th>
                  <th className="py-4 px-4 text-center w-16 bg-primary/10 text-primary dark:text-white font-bold">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900/60">
                {topStandings.map((row, i) => {
                  const isChampion = row.position === 1;
                  const isCafChampions = row.position === 2;
                  const isCafConfederation = row.position === 3;
                  let borderIndicator = 'border-l-2 border-transparent';
                  if (isChampion) borderIndicator = 'border-l-4 border-accent';
                  else if (isCafChampions) borderIndicator = 'border-l-2 border-amber-500';
                  else if (isCafConfederation) borderIndicator = 'border-l-2 border-blue-500';
                  return (
                    <motion.tr
                      key={row.teamId}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className={`transition-colors ${isChampion ? 'bg-primary/5' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900/20'}`}
                    >
                      <td className={`py-3.5 px-4 text-center font-mono ${isChampion ? 'text-accent font-extrabold' : 'text-zinc-600 dark:text-zinc-400'} ${borderIndicator}`}>
                        {row.position}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        <div className="flex items-center gap-3">
                          <TeamCrest teamId={row.teamId} size={30} />
                          <Link href={`/teams/${row.teamId}`} className="hover:text-primary transition-colors text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                            {row.teamName}
                          </Link>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm">{row.played}</td>
                      <td className={`py-3.5 px-3 text-center font-mono font-semibold text-xs hidden sm:table-cell ${row.goalDifference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-extrabold text-sm bg-primary/5 text-primary dark:text-white">
                        {row.points}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </AnimatedCard>
        </div>
      </section>

      {/* ── COMUNICADOS / NOTÍCIAS ────────────────────────────── */}
      <section className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Newspaper size={14} className="text-accent" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent">FEED_GLOBAL</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display uppercase text-foreground">Comunicados</h2>
              <p className="text-primary font-bold uppercase tracking-widest text-xs mt-1">
                Notícias oficiais do ecossistema
              </p>
            </div>
            <Link href="/news" className="premium-button text-xs py-3.5 px-6">
              Ver Todas <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Comunicado em destaque */}
            {featuredNews && (
              <AnimatedCard
                variant="holographic"
                className="lg:col-span-2 flex flex-col justify-end bg-white/80 hover:bg-white dark:bg-zinc-900/50 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-800 min-h-[340px] relative overflow-hidden"
              >
                <div className="absolute inset-0 cyber-grid-bg opacity-10" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[9px] font-mono uppercase bg-accent text-white px-2 py-1 rounded tracking-wider">
                      {featuredNews.category}
                    </span>
                    <span className="text-[9px] font-mono uppercase bg-primary/15 text-primary border border-primary/25 px-2 py-1 rounded tracking-wider">
                      Destaque
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{featuredNews.date}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display uppercase text-foreground mb-4 line-clamp-3">
                    {featuredNews.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6 max-w-2xl">{featuredNews.summary}</p>
                  <Link href={`/news/${featuredNews.id}`} className="inline-flex items-center gap-1 text-xs font-mono uppercase text-primary hover:text-accent transition-colors">
                    Ler Comunicado <ArrowRight size={12} />
                  </Link>
                </div>
              </AnimatedCard>
            )}

            {/* Comunicados secundários */}
            <div className="flex flex-col gap-4">
              {secondaryNews.map((article, i) => (
                <AnimatedCard
                  key={article.id}
                  variant="hud"
                  delay={i * 0.1}
                  className="bg-white/80 hover:bg-white dark:bg-zinc-900/50 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex-1"
                >
                  <Link href={`/news/${article.id}`} className="block group">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] font-mono uppercase bg-accent/15 text-accent border border-accent/25 px-2 py-0.5 rounded tracking-wider">
                        {article.category}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">{article.date}</span>
                    </div>
                    <h3 className="text-base font-display uppercase text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PARCEIROS ─────────────────────────────────────────── */}
      <section className="py-20 bg-zinc-100 dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Handshake size={14} className="text-accent" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent">OFFICIAL_PARTNERS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display uppercase text-foreground">Parceiros Oficiais</h2>
            <p className="text-primary font-bold uppercase tracking-widest text-xs mt-1">
              Quem faz acontecer o Liga Unitel Girabola
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.map((p, i) => (
              <AnimatedCard
                key={p.name}
                variant="hud"
                delay={i * 0.08}
                className="flex flex-col items-center justify-center text-center py-8 px-3 bg-white/60 dark:bg-zinc-900/40 hover:border-accent/40 transition-colors grayscale hover:grayscale-0"
              >
                <span className="text-lg sm:text-xl font-display uppercase tracking-wide text-foreground">{p.name}</span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 mt-2 leading-tight">{p.role}</span>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid-bg opacity-20" />
        <div className="scanline-overlay" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-display text-white uppercase mb-6">
            RECEBA NOTIFICAÇÕES LIVE
          </h2>
          <p className="text-md text-black font-bold uppercase mb-10 tracking-wide opacity-80 max-w-xl mx-auto">
            Subscreva para receber alertas de golos em tempo real, resumos de jogos e notícias exclusivas do Liga Unitel Girabola.
          </p>
          {subscribed ? (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 max-w-lg mx-auto text-center backdrop-blur-md">
              <p className="text-xl text-white font-display uppercase tracking-wider font-extrabold">
                ✓ SUBSCRITO COM SUCESSO!
              </p>
              <p className="text-xs text-black/80 font-mono uppercase mt-2 font-bold">
                Canal de Alertas ativado para: {newsletterEmail}
              </p>
            </div>
          ) : (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) setSubscribed(true);
              }}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto w-full"
            >
              <input
                type="email"
                required
                aria-label="Endereço de email para subscrição"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="O TEU EMAIL"
                className="flex-grow p-4 text-sm font-bold bg-white text-zinc-900 outline-none rounded-full font-mono text-center sm:text-left sm:px-6"
              />
              <FuturisticButton variant="premium" type="submit">
                Subscrever
              </FuturisticButton>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
