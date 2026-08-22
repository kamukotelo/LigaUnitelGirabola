'use client';

import { motion } from 'framer-motion';
import { Trophy, Calendar, Shield, Flame } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedCard from '@/components/ui/AnimatedCard';
import FuturisticButton from '@/components/ui/FuturisticButton';
import TeamCrestMarquee from '@/components/ui/TeamCrestMarquee';
import LigaAngolaBlock from '@/components/competition/LigaAngolaBlock';
import { CURRENT_SEASON_SCORERS, getTeams, getMatches, getStandings, SEASONS, CURRENT_SEASON_ID } from '@/lib/data';
import { ROUTES } from '@/lib/routes';
import { useBrandLogo } from '@/lib/team-logos';

/* ── Animated Number Counter ─────────────────────────────────── */
function AnimatedCounter({ value }: { value: number }) {
  return <span className="tabular-nums font-display">{value}</span>;
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

  const satellites = [
    { color: '#D21515', glow: 'rgba(210,21,21,0.85)' },
    { color: '#0B0B12', glow: 'rgba(255,255,255,0.35)' },
    { color: '#F9C304', glow: 'rgba(249,195,4,0.9)' },
  ];

  return (
    <div className="relative w-[320px] h-[340px] sm:w-[440px] sm:h-[460px] flex items-center justify-center select-none overflow-hidden" aria-hidden>
      <div
        className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(210,21,21,0.28), rgba(249,195,4,0.12) 55%, transparent 72%)' }}
      />

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

      <motion.div
        className="absolute w-[180px] h-[180px] sm:w-[250px] sm:h-[250px]"
        animate={{ rotate: -360 }}
        transition={{ duration: 13, repeat: Infinity, ease: 'linear' }}
      >
        {satellites.map((satellite, index) => (
          <div
            key={satellite.color}
            className="absolute left-1/2 top-1/2 h-0 w-0"
            style={{ transform: `rotate(${index * 120}deg)` }}
          >
            <span
              className="absolute -ml-1 -mt-1 h-2 w-2 -translate-y-[90px] rounded-full sm:-ml-1.5 sm:-mt-1.5 sm:h-3 sm:w-3 sm:-translate-y-[125px]"
              style={{ backgroundColor: satellite.color, boxShadow: `0 0 12px ${satellite.glow}` }}
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
  const topScorer = CURRENT_SEASON_SCORERS[0] ?? null;
  const seasonStarted = matchesPlayed > 0;
  const hasGoals = seasonStarted && topScorer && topScorer.goals > 0;
  const topScorerGoals = hasGoals ? topScorer.goals : 0;
  const topScorerFull = hasGoals ? topScorer.name : '';
  const seasonGoals = seasonMatches
    .filter((match) => match.status === 'finished')
    .reduce((total, match) => total + match.homeScore + match.awayScore, 0);

  // Época em curso (resultados consolidados) — fonte única em data.ts
  const activeSeasonLabel = SEASONS.find((s) => s.id === CURRENT_SEASON_ID)?.label ?? '2026/2027';

  // Campeão / vice derivados da classificação (coincidem sempre com a tabela)
  const standings = getStandings();
  const leader = seasonStarted ? standings[0]?.teamName ?? '' : '';

  const tickerItems = [
    `● Liga Unitel Girabola ${activeSeasonLabel} · calendário oficial disponível`,
    leader ? `▲ ${leader} lidera a classificação da temporada` : '▲ Classificação preparada para o início da temporada',
    topScorerFull ? `◆ ${topScorerFull} melhor marcador com ${topScorerGoals} golos` : '◆ Estatísticas da nova temporada serão atualizadas após os jogos',
    '■ Portal digital do futebol de Angola',
    '● Cobertura completa em tempo real',
  ].filter(Boolean);

  const stats = [
    { label: 'Clubes', value: teamsCount, icon: Shield, href: ROUTES.teams },
    { label: 'Jogos Disputados', value: matchesPlayed, icon: Trophy, href: ROUTES.calendar },
    { label: 'Jornadas', value: roundsCount, icon: Calendar, href: ROUTES.calendar },
    { label: 'Golos Marcados', value: seasonGoals, icon: Flame, href: ROUTES.stats },
  ];

  // News and match center are now handled dynamically inside LigaAngolaBlock

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[36rem] lg:min-h-[42rem] flex items-center bg-gradient-to-br from-background via-background to-primary/10 overflow-hidden border-b border-border">

        <div className="content-shell relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 2xl:gap-20">
          <div>
            <h1 className="mb-8">
              <span className="sr-only">Liga Unitel Girabola</span>
              {/* As duas imagens são decorativas (alt=""): o rótulo textual acima
                  (sr-only) fornece o nome acessível único ao leitor de ecrã, e só
                  uma das versões (clara/escura) fica visível de cada vez. */}
              {/* Fundo claro: logótipo principal a cores (mesmo enquadramento do branco) */}
              {isCustomHorizontal ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoHorizontal}
                  alt=""
                  className="w-full max-w-[360px] md:max-w-[460px] 2xl:max-w-[560px] h-auto object-contain dark:hidden"
                />
              ) : (
                <Image
                  src={logoHorizontal}
                  alt=""
                  width={635}
                  height={208}
                  priority
                  className="w-full max-w-[360px] md:max-w-[460px] 2xl:max-w-[560px] h-auto object-contain dark:hidden"
                />
              )}
              {/* Fundo escuro: versão monocromática negativa (inalterada) */}
              {isCustomHorizontalWhite ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoHorizontalWhite}
                  alt=""
                  className="hidden w-full max-w-[360px] md:max-w-[460px] 2xl:max-w-[560px] h-auto object-contain dark:block"
                />
              ) : (
                <Image
                  src={logoHorizontalWhite}
                  alt=""
                  width={396}
                  height={219}
                  priority
                  className="hidden w-full max-w-[360px] md:max-w-[460px] 2xl:max-w-[560px] h-auto object-contain dark:block"
                />
              )}
            </h1>

            <p className="text-lg md:text-xl 2xl:text-2xl text-zinc-700 dark:text-zinc-300 max-w-xl 2xl:max-w-2xl mb-4 font-semibold leading-relaxed">
              Resultados, calendário, classificação e notícias do Campeonato Nacional de Futebol de Angola.
            </p>

            <div className="flex items-center gap-3 mb-10">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs font-bold text-muted">
                Época {activeSeasonLabel} · temporada atual
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href={ROUTES.standings}>
                <FuturisticButton variant="neon" glitchText as="span">
                  Ver classificação
                </FuturisticButton>
              </Link>
              <Link href={ROUTES.calendar}>
                <FuturisticButton variant="outline" as="span">
                  Ver calendário
                </FuturisticButton>
              </Link>
            </div>
          </div>

          <div className="absolute inset-0 lg:relative lg:inset-auto flex items-center justify-center lg:justify-self-center opacity-20 lg:opacity-100 pointer-events-none lg:pointer-events-auto scale-75 md:scale-90 lg:scale-100 -z-10 lg:z-auto mt-24 lg:mt-0">
            <PitchOrbit />
          </div>
        </div>
      </section>

      {/* ── COMPETIÇÃO, RESULTADOS E CLASSIFICAÇÃO ───────────── */}
      <LigaAngolaBlock />

      {/* ── DESTAQUES DA ÉPOCA ───────────────────────────────── */}
      <section className="bg-zinc-100 dark:bg-zinc-950 py-12 border-b border-zinc-200 dark:border-zinc-900 relative">
        <div className="content-shell grid grid-cols-2 md:grid-cols-4 gap-6 2xl:gap-8 relative z-10">
          {stats.map((stat, i) => (
            <Link key={i} href={stat.href} className="block group">
              <AnimatedCard
                variant="standard"
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

      <div className="border-y border-border bg-primary/5 py-4">
        <div className="content-shell flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-semibold text-primary">
          {tickerItems.slice(0, 3).map((item) => <span key={item}>{item.replace(/^[●◆▲■]\s*/, '')}</span>)}
        </div>
      </div>

      {/* ── FAIXA DE CLUBES (marquee animado) ─────────────────── */}
      <TeamCrestMarquee />

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid-bg opacity-20" />
        <div className="scanline-overlay" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-display text-white uppercase mb-6">
            Receba novidades da Liga
          </h2>
          <p className="text-md text-black font-bold uppercase mb-10 tracking-wide opacity-80 max-w-xl mx-auto">
            Subscreva para receber resultados, resumos e notícias oficiais da Liga Unitel Girabola.
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
