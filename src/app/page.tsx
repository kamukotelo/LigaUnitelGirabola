'use client';

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Trophy, Calendar, Shield, Activity, Flame, ChevronLeft, ChevronRight, Tv, ExternalLink } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedCard from '@/components/ui/AnimatedCard';
import FuturisticButton from '@/components/ui/FuturisticButton';
import TeamCrestMarquee from '@/components/ui/TeamCrestMarquee';
import TeamCrest from '@/components/ui/TeamCrest';
import LigaAngolaBlock from '@/components/competition/LigaAngolaBlock';
import { getTeams, getMatches, getPlayers, getStandings, SEASONS, CURRENT_SEASON_ID } from '@/lib/data';
import { ROUTES } from '@/lib/routes';
import { useBrandLogo } from '@/lib/team-logos';

/* ── Animated Number Counter ─────────────────────────────────── */
function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [mounted, setMounted] = useState(false);

  // Marca a hidratação no cliente (sinaliza que já podemos animar).
  /* eslint-disable-next-line react-hooks/set-state-in-effect */
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, motionVal, value]);

  // No render do servidor / sem JavaScript, mostra já o valor final (bom para
  // SEO e para a primeira pintura). Após a hidratação, o contador anima de 0
  // até ao valor quando entra no ecrã.
  if (!mounted) {
    return <span className="tabular-nums font-display">{value}</span>;
  }

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
  const logoVertical = useBrandLogo('logo_vertical');
  const isCustomVertical = logoVertical.startsWith('data:') || (logoVertical.startsWith('http') && !logoVertical.includes('.supabase.co'));

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
      {isCustomVertical ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoVertical}
          alt=""
          aria-hidden
          className="absolute w-20 h-20 sm:w-28 sm:h-28 object-contain opacity-[0.07]"
        />
      ) : (
        <Image
          src={logoVertical}
          alt=""
          aria-hidden
          width={80}
          height={80}
          className="absolute w-20 h-20 sm:w-28 sm:h-28 object-contain opacity-[0.07]"
        />
      )}

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
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-0 h-0"
            style={{ transform: `rotate(${i * 120}deg)` }}
          >
            <span
              className="absolute w-2 h-2 sm:w-3 sm:h-3 -ml-1 -mt-1 sm:-ml-1.5 sm:-mt-1.5 rounded-full -translate-y-[90px] sm:-translate-y-[125px]"
              style={{
                backgroundColor: s.color,
                boxShadow: `0 0 12px ${s.glow}`,
              }}
            />
          </div>
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

// Compact match row helper has been migrated to LigaAngolaBlock

/* ── Hero com Estrutura Inspirada na Imagem (Estilo Liga Portugal Adaptado à Liga Girabola) ──── */
const HERO_SLIDES = [
  {
    tag: 'LIGA TV',
    date: 'Em 27/07/2026',
    title: '"O TORNEIO DE VERÃO DA LIGA UNITEL GIRABOLA É MAIS UM PASSO NA NOSSA ESTRATÉGIA DE VALORIZAÇÃO PARA OS ADEPTOS"',
    link: '/ligatv',
    cardTitle: 'LIGA TV APRESENTA',
    cardSubtitle: 'TORNEIO DE VERÃO',
    cardTeams: ['petro', 'primeiro_agosto', 'sagrada', 'wiliete'],
    cardSeason: '2026/27',
    cardFooter: 'TRANSMISSÃO EXCLUSIVA · DIRECTO HD',
  },
  {
    tag: 'COMPETIÇÕES PROFISSIONAIS',
    date: 'Em 14/07/2026',
    title: '"ATRIBUIÇÃO DE COLETES E INSCRIÇÃO DE JORNALISTAS PARA A ÉPOCA 2026/27 DA LIGA UNITEL GIRABOLA"',
    link: '/news',
    cardTitle: 'IMPRENSA & COMUNICAÇÃO',
    cardSubtitle: 'ACREDITAÇÃO DE IMPRENSA',
    cardTeams: ['academica_lobito', 'bravos_maquis', 'desportivo_huila', 'interclube'],
    cardSeason: '2026/27',
    cardFooter: 'PROCESSO ABERTO · PORTAL ANCAF',
  },
  {
    tag: 'INSTITUCIONAL',
    date: 'Em 10/07/2026',
    title: '"BOLSA DE VOLUNTÁRIOS PARA AS COMPETIÇÕES PROFISSIONAIS DA LIGA UNITEL GIRABOLA ABERTA"',
    link: '/news',
    cardTitle: 'PROGRAMA DE VOLUNTARIADO',
    cardSubtitle: 'ANCAF & LIGA GIRABOLA',
    cardTeams: ['kabuscorp', 'lunda_sul', 'santa_rita', 'sporting_cabinda'],
    cardSeason: '2026/27',
    cardFooter: 'INSCRIÇÕES ABERTAS · PARCERIA OFICIAL',
  },
];

const THUMBNAIL_NEWS = [
  {
    tag: 'COMPETIÇÕES PROFISSIONAIS',
    date: 'Em 14/07/2026',
    title: 'ATRIBUIÇÃO DE COLETES E INSCRIÇÃO DE JORNALISTAS - ÉPOCA 2026/27',
    img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
    slideIndex: 1,
  },
  {
    tag: 'LIGA TV',
    date: 'Em 27/07/2026',
    title: 'O TORNEIO DE VERÃO DA LIGA UNITEL GIRABOLA É MAIS UM PASSO NA NOSSA...',
    img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80',
    slideIndex: 0,
  },
  {
    tag: 'INSTITUCIONAL',
    date: 'Em 10/07/2026',
    title: 'BOLSA DE VOLUNTÁRIOS PARA AS COMPETIÇÕES PROFISSIONAIS ABERTA',
    img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=400&q=80',
    slideIndex: 2,
  },
];

function LigaGirabolaHero() {
  const [activeSlide, setActiveSlide] = useState(0);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const current = HERO_SLIDES[activeSlide];

  return (
    <section className="relative bg-background text-foreground pt-20 lg:pt-24 pb-10 overflow-hidden border-b border-primary/20 transition-colors duration-300">
      {/* Dynamic Background Effects matching site's theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background dark:from-primary/20 dark:via-zinc-950 dark:to-zinc-950 z-0" />
      <div className="absolute inset-0 cyber-grid-bg opacity-15" />
      <div className="scanline-overlay opacity-20" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[380px] relative">

          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            aria-label="Slide anterior"
            className="absolute -left-3 lg:left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-card/90 hover:bg-card border border-border text-foreground shadow-md backdrop-blur-md flex items-center justify-center transition-all hover:scale-105"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Main Content Column (7 cols) */}
          <div className="lg:col-span-7 pl-6 lg:pl-10">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-accent/10 border border-accent/30 text-accent font-extrabold text-[11px] uppercase px-3 py-1 rounded-md tracking-wider font-mono">
                  {current.tag}
                </span>
                <span className="text-muted text-xs font-mono font-semibold">
                  {current.date}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight text-foreground mb-8 font-display max-w-2xl">
                {current.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                <Link href={current.link}>
                  <FuturisticButton variant="neon" glitchText as="span">
                    Saber Mais <ExternalLink size={14} className="inline ml-1" />
                  </FuturisticButton>
                </Link>
                <Link href="/ligatv">
                  <FuturisticButton variant="outline" as="span">
                    <Tv size={16} className="inline mr-1 text-accent" /> Ver na Liga TV
                  </FuturisticButton>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Featured Tournament / Graphic Box (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end pr-6 lg:pr-10">
            <motion.div
              key={`card-${activeSlide}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md bg-card/95 dark:bg-zinc-900/90 backdrop-blur-xl border border-border dark:border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border dark:border-zinc-800 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Tv size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-accent uppercase tracking-widest font-extrabold">{current.cardTitle}</p>
                    <p className="text-base font-black uppercase tracking-wide text-foreground">{current.cardSubtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-md font-bold">
                  {current.cardSeason}
                </span>
              </div>

              {/* Team Crests Grid */}
              <div className="grid grid-cols-4 gap-3 my-6">
                {current.cardTeams.map((teamId) => (
                  <Link
                    key={teamId}
                    href={`/teams/${teamId}`}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/60 hover:bg-primary/10 dark:hover:bg-primary/20 border border-border dark:border-zinc-700/80 transition group"
                  >
                    <TeamCrest teamId={teamId} size={40} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted group-hover:text-primary mt-2">
                      {teamId.substring(0, 3)}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border dark:border-zinc-800 text-xs">
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest font-bold">
                  {current.cardFooter}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
                  EM DIRETO
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            aria-label="Próximo slide"
            className="absolute -right-3 lg:right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-card/90 hover:bg-card border border-border text-foreground shadow-md backdrop-blur-md flex items-center justify-center transition-all hover:scale-105"
          >
            <ChevronRight size={22} />
          </button>

        </div>

        {/* Bottom Thumbnail News Strip */}
        <div className="mt-8 pt-6 border-t border-border dark:border-zinc-800 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {THUMBNAIL_NEWS.map((news, idx) => {
              const isActive = activeSlide === news.slideIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(news.slideIndex)}
                  className={`text-left p-3.5 rounded-xl border transition-all flex items-center gap-3.5 ${
                    isActive
                      ? 'bg-primary/10 dark:bg-primary/20 border-primary shadow-md'
                      : 'bg-card/70 dark:bg-zinc-900/50 border-border dark:border-zinc-800 hover:bg-card hover:border-primary/40'
                  }`}
                >
                  <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 relative bg-zinc-200 dark:bg-zinc-800 border border-border dark:border-zinc-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={news.img}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono font-bold uppercase text-accent">
                        {news.tag}
                      </span>
                      <span className="text-[9px] font-mono text-muted">
                        {news.date}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-foreground truncate line-clamp-2 leading-tight uppercase">
                      {news.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

export default function Home() {
  const logoHorizontal = useBrandLogo('logo_horizontal');
  const logoHorizontalWhite = useBrandLogo('logo_horizontal_white');
  const isCustomHorizontal = logoHorizontal.startsWith('data:') || (logoHorizontal.startsWith('http') && !logoHorizontal.includes('.supabase.co'));
  const isCustomHorizontalWhite = logoHorizontalWhite.startsWith('data:') || (logoHorizontalWhite.startsWith('http') && !logoHorizontalWhite.includes('.supabase.co'));

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Dynamic statistics from helper functions
  const teamsCount = getTeams().length;
  const seasonMatches = getMatches();
  const matchesPlayed = seasonMatches.filter((m) => m.status === 'finished').length;
  const roundsCount = new Set(seasonMatches.map((m) => m.round)).size;
  const allPlayers = getPlayers();
  const topScorer = allPlayers.length > 0 ? [...allPlayers].sort((a, b) => b.goals - a.goals)[0] : null;
  const hasGoals = topScorer && topScorer.goals > 0;
  const topScorerName = hasGoals ? topScorer.name.split(' ')[0] : 'Dagó';
  const topScorerGoals = hasGoals ? topScorer.goals : 18;
  const topScorerFull = hasGoals ? topScorer.name : 'Dagó Tshibamba';

  // Época em curso (resultados consolidados) — fonte única em data.ts
  const activeSeasonLabel = SEASONS.find((s) => s.id === CURRENT_SEASON_ID)?.label ?? '2025/2026';

  // Campeão / vice derivados da classificação (coincidem sempre com a tabela)
  const standings = getStandings();
  const champion = standings[0]?.teamName ?? 'Petro de Luanda';
  const runnerUp = standings[1]?.teamName ?? '';

  const tickerItems = [
    `● ${champion} campeão da Liga Unitel Girabola ${activeSeasonLabel}`,
    `◆ ${topScorerFull} melhor marcador com ${topScorerGoals} golos`,
    runnerUp ? `▲ ${runnerUp} fecha a época no 2.º lugar` : '',
    '■ Portal digital do futebol de Angola',
    '● Cobertura completa em tempo real',
  ].filter(Boolean);

  const stats = [
    { label: 'Clubes', value: teamsCount, icon: Shield, href: ROUTES.teams },
    { label: 'Jogos Disputados', value: matchesPlayed, icon: Trophy, href: ROUTES.calendar },
    { label: 'Jornadas', value: roundsCount, icon: Calendar, href: ROUTES.calendar },
    { label: 'Golos Marcados (' + topScorerName + ')', value: topScorerGoals, icon: Flame, href: ROUTES.stats },
  ];

  // News and match center are now handled dynamically inside LigaAngolaBlock

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ESTILO LIGA PORTUGAL (ADAPTADO À LIGA GIRABOLA) ── */}
      <LigaGirabolaHero />

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
                <h2 className="text-4xl font-display text-primary">
                  <AnimatedCounter value={stat.value} />
                </h2>
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

      {/* ── FAIXA DE CLUBES (marquee animado) ─────────────────── */}
      <TeamCrestMarquee />

      {/* ── BLOCO ESTILO LIGA ANGOLA (Parcerias + Sidebar + Notícias/Vídeos) ── */}
      <LigaAngolaBlock />

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid-bg opacity-20" />
        <div className="scanline-overlay" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-display text-white uppercase mb-6">
            RECEBA NOTIFICAÇÕES LIVE
          </h2>
          <p className="text-md text-black font-bold uppercase mb-10 tracking-wide opacity-80 max-w-xl mx-auto">
            Subscreva para receber alertas de golos em tempo real, resumos de jogos e notícias exclusivas da Liga Unitel Girabola.
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
