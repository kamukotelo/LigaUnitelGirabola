'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, ListOrdered, Shield, LayoutGrid } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const ITEMS = [
  { label: 'Calendário', href: ROUTES.calendar, tab: 'calendario', icon: CalendarDays },
  { label: 'Classificação', href: ROUTES.standings, tab: 'classificacao', icon: ListOrdered },
  { label: 'Equipas', href: ROUTES.teams, icon: Shield },
  { label: 'Mais', href: ROUTES.competition, tab: 'geral', icon: LayoutGrid },
] as const;

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [competitionTab, setCompetitionTab] = useState('geral');

  useEffect(() => {
    const syncTab = () => setCompetitionTab(new URLSearchParams(window.location.search).get('tab') ?? 'geral');
    syncTab();
    window.addEventListener('popstate', syncTab);
    return () => window.removeEventListener('popstate', syncTab);
  }, [pathname]);

  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) return null;

  return (
    <nav aria-label="Navegação rápida" className="fixed inset-x-0 bottom-0 z-[9998] border-t border-zinc-200/90 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-zinc-800/90 dark:bg-zinc-950/95 xl:hidden">
      <div className="mx-auto grid h-16 max-w-md grid-cols-4">
        {ITEMS.map(({ label, href, icon: Icon, ...item }) => {
          const isCompetition = pathname.startsWith('/competicao/');
          const isActive = 'tab' in item
            ? isCompetition && competitionTab === item.tab
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={label}
              href={href}
              onClick={() => setCompetitionTab('tab' in item ? item.tab : '')}
              className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-bold transition-colors ${isActive ? 'text-accent' : 'text-zinc-500'}`}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
