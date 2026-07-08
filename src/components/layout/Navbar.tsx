'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/pages.config';
import Brand from './Brand';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
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
    closed: { opacity: 0, x: -16 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <header
      className={`glass-header w-full border-b backdrop-blur-md fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        scrolled
          ? 'border-zinc-200/80 dark:border-zinc-800/80 shadow-lg shadow-black/10 dark:shadow-black/40'
          : 'border-zinc-200/40 dark:border-zinc-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20 md:h-24">
          {/* Selo institucional ANCAF (à esquerda, maior) + marca Liga Unitel Girabola */}
          <div className="flex items-center flex-shrink-0">
            {/* ANCAF — logótipo institucional, agora em primeiro plano à esquerda */}
            <a
              href="https://www.ancaf.ao"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center gap-2 hover:opacity-85 transition-all group"
            >
              <Image
                src="/logo-ancaf.png"
                alt="Logotipo ANCAF"
                width={60}
                height={60}
                className="h-14 w-auto object-contain"
              />
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold group-hover:text-accent transition-colors">
                Institucional
              </span>
            </a>

            <div className="hidden xl:block h-8 w-px bg-zinc-300 dark:bg-zinc-800/80 mx-3 xl:mx-4" />

            {/* Marca oficial da competição */}
            <Brand size="sm" className="xl:hidden" />
            <Brand size="md" className="hidden xl:flex" />
          </div>

          {/* Desktop Nav Links — centrados, com espaço garantido */}
          <nav className="hidden xl:flex items-center gap-2 mx-auto">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(`${link.path}/`));
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-xs font-semibold tracking-wide uppercase px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
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
            <Link href="/contact" className="premium-button text-sm whitespace-nowrap">
              Área de Clubes
            </Link>
          </div>

          {/* Mobile / Tablet Menu Toggle */}
          <div className="flex xl:hidden items-center gap-1 flex-shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Alternar menu de navegação"
              className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 focus:outline-none"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-20 z-40 bg-background/95 dark:bg-zinc-950/95 backdrop-blur-xl xl:hidden overflow-y-auto flex flex-col justify-between"
          >
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="px-6 py-8 space-y-3 flex-grow"
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                Navegação Principal
              </div>
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(`${link.path}/`));
                return (
                  <motion.div key={link.path} variants={itemVariants}>
                    <Link
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-md font-semibold tracking-wide uppercase transition-all duration-200 ${
                        isActive
                          ? 'bg-accent/10 text-accent border-l-4 border-accent'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight size={14} className="opacity-50" />
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div variants={itemVariants} className="pt-6">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="premium-button w-full text-center text-sm py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <span>Área de Clubes</span>
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Mobile Footer Info */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 border-t border-zinc-200 dark:border-zinc-900 bg-zinc-100/50 dark:bg-zinc-950/50 text-center"
            >
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Federação Angolana de Futebol
              </p>
              <p className="text-[9px] font-mono text-zinc-600 dark:text-zinc-500 mt-1">
                Campeonato Nacional Oficial de Angola
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
