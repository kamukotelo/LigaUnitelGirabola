'use client';

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Trophy, Users, Calendar, Shield, Zap, Activity, Flame } from 'lucide-react';
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
    { label: 'Clubes', value: 8, icon: Shield },
    { label: 'Atletas', value: 160, icon: Users },
    { label: 'Jornadas', value: 14, icon: Calendar },
    { label: 'Estádios', value: 6, icon: Trophy },
  ];

  const news = [
    {
      id: '1',
      title: 'Abertura oficial do campeonato nacional agendada para Julho',
      category: 'Competição',
      date: '13 Jun 2026',
      summary: 'A comissão organizadora confirmou as datas e os estádios homologados para a fase regular.',
    },
    {
      id: '2',
      title: 'Novas infraestruturas desportivas entram em fase de testes',
      category: 'Infraestrutura',
      date: '12 Jun 2026',
      summary: 'Os campos de treino e balneários de última geração receberam certificação de qualidade máxima.',
    },
    {
      id: '3',
      title: 'Estrela do campeonato assina contrato de patrocínio histórico',
      category: 'Parcerias',
      date: '10 Jun 2026',
      summary: 'Marca desportiva global fecha acordo de exclusividade com a principal goleadora do torneio.',
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
            <h1
              className={`text-6xl md:text-8xl font-display text-white leading-[0.85] uppercase mb-8 ${
                glitchActive ? 'glitch-text' : ''
              }`}
              data-text="FUTIBOOL ENGINE."
            >
              FUTIBOOL <br />
              <span className="text-primary italic neon-text">ENGINE.</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-300 max-w-xl mb-4 font-bold uppercase tracking-wide">
              A estrutura profissional para portais e campeonatos desportivos.
            </p>

            <div className="flex items-center gap-3 mb-10">
              <Activity size={14} className="text-accent animate-pulse" />
              <span className="text-[10px] font-mono text-accent/80 tracking-widest uppercase">
                Next.js 16 · Tailwind CSS v4 · Framer Motion v12
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
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl">
                    <Flame className="h-8 w-8 text-accent animate-bounce" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    Live_Preview
                  </span>
                </div>
                
                <div>
                  <h3 className="text-3xl font-display text-white uppercase leading-tight mb-2">
                    Fidelidade <br/>Visual Suprema
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Bordas geometricas, animações de alta taxa de quadros e estilo cyberpunk premium.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK STATS ───────────────────────────────────────── */}
      <section className="bg-zinc-950 py-12 border-b border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          {stats.map((stat, i) => (
            <AnimatedCard
              key={i}
              variant="hud"
              className="text-center bg-zinc-900/40 relative overflow-hidden"
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
              <span>● FUTIBOOL SYSTEM INITIALIZED</span>
              <span>◆ JORNADA DE ABERTURA</span>
              <span>▲ ESTÁDIO NACIONAL DISPONÍVEL</span>
              <span>■ SISTEMA DE SUPABASE ACTIVO</span>
              <span>● DESIGN DE ZERO PIXÉIS DISRUPTIVO</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── NEWS ──────────────────────────────────────────────── */}
      <section className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-accent" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent">
                  FEED_GLOBAL
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display uppercase text-white">Notícias Recentes</h2>
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
                className="bg-zinc-900/50 hover:bg-zinc-900 border-zinc-800"
              >
                <span className="text-[9px] font-mono uppercase bg-accent text-white px-2 py-1 rounded tracking-wider">
                  {article.category}
                </span>
                <p className="text-[10px] text-zinc-500 font-mono mt-3">{article.date}</p>
                <h3 className="text-xl font-display uppercase text-white mt-2 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-3 mb-6">{article.summary}</p>
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
            LIGA OS TEUS SISTEMAS
          </h2>
          <p className="text-md text-black font-bold uppercase mb-10 tracking-wide opacity-80 max-w-xl mx-auto">
            Inicialize e escale portais desportivos com a melhor arquitetura de software existente.
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
