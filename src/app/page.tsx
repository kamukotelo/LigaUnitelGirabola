'use client';

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Trophy, Calendar, Shield, Zap, Activity, Flame } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import AnimatedCard from '@/components/ui/AnimatedCard';
import FuturisticButton from '@/components/ui/FuturisticButton';

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
    <div className="relative w-[440px] h-[460px] flex items-center justify-center select-none" aria-hidden>
      {/* Glow base */}
      <div
        className="absolute w-72 h-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(210,21,21,0.28), rgba(249,195,4,0.12) 55%, transparent 72%)' }}
      />

      {/* Varredura radar */}
      <motion.div
        className="absolute w-[340px] h-[340px] rounded-full"
        style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(249,195,4,0.20) 40deg, transparent 95deg)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      />

      {/* Linhas do campo (círculo central + meio-campo) */}
      <div className="absolute w-[340px] h-[340px] rounded-full border border-primary/25" />
      <div className="absolute w-[250px] h-[250px] rounded-full border border-accent/20" />
      <div className="absolute w-[150px] h-[150px] rounded-full border-2 border-white/15" />
      <div className="absolute w-[340px] h-px bg-primary/20" />
      <div className="absolute w-px h-[340px] bg-primary/10" />
      <div className="absolute w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_rgba(249,195,4,0.9)]" />

      {/* Brasão Girabola em marca-d'água */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-girabola.svg" alt="" className="absolute w-28 h-28 object-contain opacity-[0.07]" />

      {/* Órbita da bola */}
      <motion.div
        className="absolute w-[340px] h-[340px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div
          className="absolute left-1/2 -top-4 -translate-x-1/2 drop-shadow-[0_0_14px_rgba(0,0,0,0.65)]"
          animate={{ rotate: -360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        >
          <SoccerBall size={58} />
        </motion.div>
      </motion.div>

      {/* Satélites nas cores de Angola */}
      <motion.div
        className="absolute w-[250px] h-[250px]"
        animate={{ rotate: -360 }}
        transition={{ duration: 13, repeat: Infinity, ease: 'linear' }}
      >
        {satellites.map((s, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full"
            style={{
              backgroundColor: s.color,
              boxShadow: `0 0 12px ${s.glow}`,
              transform: `rotate(${i * 120}deg) translateY(-125px)`,
            }}
          />
        ))}
      </motion.div>

      {/* Etiqueta */}
      <div className="absolute bottom-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-pulse" />
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/80">
          Girabola · Angola
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 250);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Inline Mock Data
  const stats = [
    { label: 'Clubes', value: 16, icon: Shield },
    { label: 'Jogos Disputados', value: 240, icon: Trophy },
    { label: 'Jornadas', value: 30, icon: Calendar },
    { label: 'Golos Marcados (Dagó)', value: 18, icon: Flame },
  ];

  const news = [
    {
      id: '1',
      title: 'Petro de Luanda sagra-se Pentacampeão Nacional após vitória categórica',
      category: 'Competição',
      date: '09 Mai 2026',
      summary: 'Os tricolores garantiram o seu 5º título consecutivo do Girabola com uma vitória emocionante de 2-1 sobre o Kabuscorp do Palanca na última jornada.',
    },
    {
      id: '2',
      title: 'Dagó Tshibamba conquista Troféu de Melhor Marcador do Girabola',
      category: 'Individual',
      date: '10 Mai 2026',
      summary: 'O avançado congolês do 1.º de Agosto finalizou a temporada com 18 golos marcados, consagrando-se o principal goleador do futebol nacional angolano.',
    },
    {
      id: '3',
      title: 'Wiliete de Benguela garante histórico 2º lugar e vaga nas competições africanas',
      category: 'Competição',
      date: '09 Mai 2026',
      summary: 'A formação de Benguela venceu o Interclube por 2-0 e garantiu uma participação histórica na Liga dos Campeões da CAF para a próxima época.',
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative h-[85vh] flex items-center bg-black overflow-hidden border-b border-primary/20">
        <div className="absolute inset-0 angola-field opacity-30" />
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-girabola-horizontal.svg"
                alt="Liga Unitel Girabola"
                width={396}
                height={219}
                className={`w-full max-w-[360px] md:max-w-[460px] h-auto object-contain drop-shadow-[0_0_25px_rgba(210,80,0,0.35)] ${
                  glitchActive ? 'glitch-text' : ''
                }`}
              />
            </h1>

            <p className="text-lg md:text-xl text-zinc-300 max-w-xl mb-4 font-bold uppercase tracking-wide">
              O maior portal digital do Campeonato Nacional de Futebol de Angola.
            </p>

            <div className="flex items-center gap-3 mb-10">
              <Activity size={14} className="text-accent animate-pulse" />
              <span className="text-[10px] font-mono text-accent/80 tracking-widest uppercase">
                Edição 2025/2026 · Petro de Luanda Campeão
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/standings">
                <FuturisticButton variant="neon" glitchText>
                  Classificações
                </FuturisticButton>
              </Link>
              <Link href="/fixtures">
                <FuturisticButton variant="outline">
                  Resultados
                </FuturisticButton>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative justify-self-center">
            <PitchOrbit />
          </div>
        </div>
      </section>

      {/* ── QUICK STATS ───────────────────────────────────────── */}
      <section className="bg-zinc-100 dark:bg-zinc-950 py-12 border-b border-zinc-200 dark:border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          {stats.map((stat, i) => (
            <AnimatedCard
              key={i}
              variant="hud"
              className="text-center relative overflow-hidden"
              delay={i * 0.1}
            >
              <stat.icon className="text-accent mx-auto mb-3" size={24} />
              <h4 className="text-4xl font-display text-primary">
                <AnimatedCounter value={stat.value} />
              </h4>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-2">
                {stat.label}
              </p>
            </AnimatedCard>
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
              <span>● PETRO DE LUANDA CAMPEÃO DO GIRABOLA 2025/26</span>
              <span>◆ DAGÓ TSHIBAMBA COROADO MELHOR MARCADOR COM 18 GOLOS</span>
              <span>▲ WILIETE DE BENGUELA EM SEGUNDO LUGAR HISTÓRICO</span>
              <span>■ PORTAL DIGITAL DO FUTEBOL DE ANGOLA</span>
              <span>● COBERTURA COMPLETA EM TEMPO REAL</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── NEWS ──────────────────────────────────────────────── */}
      <section className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-accent" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent">
                  FEED_GLOBAL
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display uppercase text-foreground">Notícias Recentes</h2>
              <p className="text-primary font-bold uppercase tracking-widest text-xs mt-1">
                Informação em tempo real do ecossistema
              </p>
            </div>
            <Link href="/news" className="premium-button text-xs py-3.5 px-6">
              Ver Todas <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((article, i) => (
              <AnimatedCard
                key={article.id}
                variant="holographic"
                delay={i * 0.15}
                className="bg-white/80 hover:bg-white dark:bg-zinc-900/50 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              >
                <span className="text-[9px] font-mono uppercase bg-accent text-white px-2 py-1 rounded tracking-wider">
                  {article.category}
                </span>
                <p className="text-[10px] text-zinc-500 font-mono mt-3">{article.date}</p>
                <h3 className="text-xl font-display uppercase text-foreground mt-2 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6">{article.summary}</p>
                <Link href={`/news/${article.id}`} className="inline-flex items-center gap-1 text-xs font-mono uppercase text-primary hover:text-accent transition-colors">
                  Ler Artigo <ArrowRight size={12} />
                </Link>
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
            Subscreva para receber alertas de golos em tempo real, resumos de jogos e notícias exclusivas do Girabola.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="O TEU EMAIL"
              className="flex-grow p-4 text-sm font-bold bg-white text-zinc-900 outline-none rounded-full font-mono text-center sm:text-left sm:px-6"
            />
            <FuturisticButton variant="premium">
              Subscrever
            </FuturisticButton>
          </div>
        </div>
      </section>
    </div>
  );
}
