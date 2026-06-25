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

/* ── HUD Corner Brackets ──────────────────────────────────────── */
function HudBrackets() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <span className="absolute top-2 left-2 w-4 h-4 border-t border-l border-accent/60" />
      <span className="absolute top-2 right-2 w-4 h-4 border-t border-r border-accent/60" />
      <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-accent/60" />
      <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-accent/60" />
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
            <div className="relative holo-card">
              <HudBrackets />
              <div className="w-[400px] h-[480px] brutalist-card bg-zinc-900 border border-zinc-800 flex flex-col justify-between p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    LIGA_OFICIAL
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center gap-6 mt-4">
                  <div className="relative w-48 h-48 flex items-center justify-center p-4 rounded-3xl bg-zinc-950/80 border border-zinc-800 shadow-[0_0_50px_rgba(210,21,21,0.15)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo-girabola.svg"
                      alt="Girabola Logo"
                      className="w-40 h-40 object-contain animate-pulse"
                      width={160}
                      height={160}
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-display text-white uppercase leading-tight tracking-wider mb-2">
                      GIRABOLA 2025/2026
                    </h3>
                    <p className="text-xs font-mono text-accent uppercase tracking-widest hover:text-white transition-colors">
                      <Link href="/teams/petro">
                        Pentacampeão: Petro de Luanda
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
