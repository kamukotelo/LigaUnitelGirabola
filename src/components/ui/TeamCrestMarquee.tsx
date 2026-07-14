'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { TEAMS } from '@/lib/data';
import TeamCrest from '@/components/ui/TeamCrest';

function CrestSet({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 pr-2.5 sm:pr-3" aria-hidden={ariaHidden}>
      {TEAMS.map((t) => (
        <Link
          key={t.id}
          href={`/teams/${t.id}`}
          title={t.name}
          aria-label={`Abrir página do ${t.name}`}
          tabIndex={ariaHidden ? -1 : 0}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-white/40 bg-white/95 shadow-sm ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-[54px] sm:w-[54px]"
        >
          <TeamCrest teamId={t.id} size={38} />
        </Link>
      ))}
    </div>
  );
}

// Faixa animada (marquee) com todos os emblemas dos clubes — estilo "WEB CLUBS"
// do Liga Angola. Deslize horizontal contínuo, pausa ao passar o rato e
// cada emblema abre a página do respetivo clube.
export default function TeamCrestMarquee({ label = 'Clubes' }: { label?: string }) {
  return (
    <div className="crest-marquee relative w-full overflow-hidden border-y border-primary/30 bg-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
      <div className="flex min-h-[64px] items-stretch sm:min-h-[70px]">
        {/* Etiqueta fixa à esquerda */}
        <div className="z-20 flex flex-shrink-0 items-center gap-2 border-r border-white/15 bg-black/22 px-3 sm:px-5">
          <span className="whitespace-nowrap font-display text-[11px] uppercase tracking-[0.22em] text-white sm:text-sm">{label}</span>
          <ExternalLink size={13} className="text-white/70" />
        </div>

        {/* Pista deslizante (dois conjuntos idênticos para loop perfeito) */}
        <div className="marquee-viewport relative min-w-0 flex-1 overflow-hidden py-2 sm:py-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-primary to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-primary to-transparent" />
          <div className="marquee-track flex items-center w-max">
            <CrestSet />
            <CrestSet ariaHidden />
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: crestMarquee 36s linear infinite;
          will-change: transform;
        }
        .crest-marquee:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes crestMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
          .marquee-viewport { overflow-x: auto; }
        }
      `}</style>
    </div>
  );
}
