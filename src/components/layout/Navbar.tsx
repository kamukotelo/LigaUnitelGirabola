'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Home, Trophy, Shield, Newspaper, PlayCircle, CalendarDays, ListOrdered, LogIn, Globe2, BriefcaseBusiness, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/pages.config';
import Brand from './Brand';
import ThemeToggle from './ThemeToggle';
import { useBrandLogo } from '@/lib/team-logos';

const MOBILE_NAV_ICONS = {
  'Início': Home,
  'Competição': Trophy,
  'Calendário': CalendarDays,
  'Classificação': ListOrdered,
  'Equipas': Shield,
  'Notícias': Newspaper,
  'Liga TV': PlayCircle,
};

const ANCAF_CHANNELS = [
  { label: 'Portal oficial da ANCAF', href: 'https://ancaf.co.ao/', icon: Globe2 },
  { label: 'ANCAF no LinkedIn', href: 'https://www.linkedin.com/company/ancaf-liga-profissional-angolana-futebol', icon: BriefcaseBusiness },
  { label: 'Email da ANCAF', href: 'mailto:info@ancaf.ao', icon: Mail },
];

export default function Navbar() {
  const logoAncaf = useBrandLogo('logo_ancaf');
  const isCustomLogo = logoAncaf.startsWith('data:') || (logoAncaf.startsWith('http') && !logoAncaf.includes('.supabase.co'));
  const pathname = usePathname();
  const [activeCompetitionTab, setActiveCompetitionTab] = useState('geral');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastPathname = useRef(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (lastPathname.current === pathname) return;

    lastPathname.current = pathname;
    const frame = window.requestAnimationFrame(() => setIsOpen(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const syncCompetitionTab = () => {
      setActiveCompetitionTab(new URLSearchParams(window.location.search).get('tab') ?? 'geral');
    };
    syncCompetitionTab();
    window.addEventListener('popstate', syncCompetitionTab);
    return () => window.removeEventListener('popstate', syncCompetitionTab);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen]);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -12,
      transition: {
        staggerChildren: 0.04,
        staggerDirection: -1,
        when: 'afterChildren',
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: 8 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <header
      className={`glass-header w-full border-b backdrop-blur-md fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        scrolled
          ? 'border-zinc-200/80 dark:border-zinc-800/80 shadow-lg shadow-black/10 dark:shadow-black/40'
          : 'border-zinc-200/40 dark:border-zinc-800/40'
      }`}
    >
      <div className="content-shell">
        <div className="flex h-16 items-center justify-between gap-3 md:h-20">
          {/* Selo institucional ANCAF (à esquerda, maior) + marca Liga Unitel Girabola */}
          <div className="flex items-center flex-shrink-0">
            {/* ANCAF — logótipo institucional, agora em primeiro plano à esquerda */}
            <div className="hidden xl:flex items-center gap-2">
              <a
                href="https://ancaf.co.ao/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-85 transition-all group"
              >
              {isCustomLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoAncaf}
                  alt="Logotipo ANCAF"
                  width={48}
                  height={48}
                  className="h-12 w-auto object-contain dark:brightness-0 dark:invert"
                />
              ) : (
                <Image
                  src={logoAncaf}
                  alt="Logotipo ANCAF"
                  width={48}
                  height={48}
                  className="h-12 w-auto object-contain dark:brightness-0 dark:invert"
                />
              )}
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold group-hover:text-accent transition-colors">
                  Institucional
                </span>
              </a>
              <div className="ml-1 flex items-center gap-0.5 border-l border-zinc-200 pl-2 dark:border-zinc-800" aria-label="Canais oficiais da ANCAF">
                {ANCAF_CHANNELS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    aria-label={label}
                    title={label}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-accent/10 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent/70 dark:text-zinc-400"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            <div className="hidden xl:block h-8 w-px bg-zinc-300 dark:bg-zinc-800/80 mx-3 xl:mx-4" />

            {/* Marca oficial da competição */}
            <Brand size="sm" className="max-w-[min(58vw,15rem)] overflow-hidden xl:hidden" />
            <Brand size="sm" className="hidden xl:flex" />
          </div>

          {/* Desktop Nav Links — centrados, com espaço garantido */}
          <nav aria-label="Navegação principal" className="hidden xl:flex items-center gap-1 mx-auto">
            {NAV_LINKS.map((link) => {
              const matchPath = link.match;
              const isPathActive = pathname === matchPath || (matchPath !== '/' && pathname.startsWith(`${matchPath}/`));
              const isActive = isPathActive && (!('tab' in link) || link.tab === activeCompetitionTab);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setActiveCompetitionTab(('tab' in link && link.tab) || 'geral')}
                  className={`text-[11px] font-semibold tracking-wide uppercase px-2.5 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'text-accent bg-accent/5'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden xl:flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <Link href="/login" className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-bold text-zinc-700 transition hover:border-primary hover:text-primary dark:border-zinc-700 dark:text-zinc-300 whitespace-nowrap">
              Acesso reservado
            </Link>
          </div>

          {/* Mobile / Tablet Menu Toggle */}
          <div className="flex xl:hidden items-center gap-1 flex-shrink-0">
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-label="Alternar menu de navegação"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200/70 bg-white/70 text-zinc-700 shadow-sm transition hover:text-foreground hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-16 z-40 flex h-[calc(100dvh-4rem)] flex-col justify-end bg-black/25 backdrop-blur-sm overscroll-contain md:top-20 md:h-[calc(100dvh-5rem)] xl:hidden dark:bg-black/50"
            onClick={() => {
              setIsOpen(false);
              menuButtonRef.current?.focus();
            }}
          >
            <motion.div
              id="mobile-navigation"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              onClick={(event) => event.stopPropagation()}
              className="mx-auto flex max-h-[calc(100dvh-4.75rem)] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-b-0 border-zinc-200/80 bg-background/98 shadow-2xl backdrop-blur-xl sm:mb-4 sm:max-h-[calc(100dvh-6rem)] sm:rounded-3xl sm:border-b dark:border-zinc-800/80 dark:bg-zinc-950/98"
            >
              <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700 sm:hidden" />
              <div className="flex items-center justify-between gap-4 border-b border-zinc-200/80 px-4 py-2.5 dark:border-zinc-800/80 sm:px-5 sm:py-3">
                <div className="flex items-center gap-3">
                  {isCustomLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoAncaf}
                      alt="Logotipo ANCAF"
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain dark:brightness-0 dark:invert"
                    />
                  ) : (
                    <Image
                      src={logoAncaf}
                      alt="Logotipo ANCAF"
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain dark:brightness-0 dark:invert"
                    />
                  )}
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Menu oficial</p>
                    <p className="text-sm font-semibold uppercase leading-tight text-foreground">Liga Unitel Girabola</p>
                    <div className="mt-1.5 flex items-center gap-1" aria-label="Canais oficiais da ANCAF">
                      {ANCAF_CHANNELS.map(({ label, href, icon: Icon }) => (
                        <a
                          key={label}
                          href={href}
                          target={href.startsWith('mailto:') ? undefined : '_blank'}
                          rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                          aria-label={label}
                          title={label}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition hover:text-accent dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          <Icon size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    menuButtonRef.current?.focus();
                  }}
                  aria-label="Fechar menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

            <nav className="grid min-h-0 grid-cols-2 gap-2 overflow-y-auto overscroll-contain px-3 py-3 sm:gap-3 sm:px-5 sm:py-4">
              {NAV_LINKS.map((link) => {
                  const matchPath = link.match;
                  const isPathActive = pathname === matchPath || (matchPath !== '/' && pathname.startsWith(`${matchPath}/`));
                  const isActive = isPathActive && (!('tab' in link) || link.tab === activeCompetitionTab);
                  const Icon = MOBILE_NAV_ICONS[link.label as keyof typeof MOBILE_NAV_ICONS] ?? ArrowRight;
                  return (
                    <motion.div key={link.path} variants={itemVariants}>
                      <Link
                        href={link.path}
                        onClick={() => {
                          setActiveCompetitionTab(('tab' in link && link.tab) || 'geral');
                          setIsOpen(false);
                        }}
                        className={`flex min-h-[4.25rem] items-center gap-2.5 rounded-2xl border px-3 py-3 text-left transition-all duration-200 sm:min-h-[86px] sm:flex-col sm:items-stretch sm:justify-between sm:p-4 ${
                          isActive
                            ? 'border-accent/50 bg-accent/10 text-accent shadow-sm'
                            : 'border-zinc-200/80 bg-white/65 text-zinc-700 hover:border-zinc-300 hover:bg-white hover:text-foreground dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className="flex shrink-0 items-center justify-between gap-3 sm:w-full">
                          <Icon size={20} />
                          <ArrowRight size={14} className="hidden opacity-50 sm:block" />
                        </span>
                        <span className="min-w-0 flex-1 text-[11px] font-bold uppercase leading-tight tracking-wide sm:text-xs">{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div variants={itemVariants} className="shrink-0 border-t border-zinc-200/80 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 dark:border-zinc-800/80 sm:px-5 sm:pb-4 sm:pt-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="premium-button flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl py-3 text-center text-sm"
                >
                  <LogIn size={17} />
                  <span>Acesso reservado</span>
                  <ArrowRight size={16} />
                </Link>
                <p className="mt-2 hidden text-center text-[9px] font-mono uppercase tracking-widest text-zinc-500 sm:block">
                  Campeonato Nacional Oficial de Angola
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
