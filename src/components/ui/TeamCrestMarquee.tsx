'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { TEAMS } from '@/lib/data';
import TeamCrest from '@/components/ui/TeamCrest';

// Faixa animada (marquee) com todos os emblemas dos clubes — estilo "WEB CLUBS"
// do ligaportugal.pt. Deslize horizontal contínuo, pausa ao passar o rato e
// cada emblema abre a página do respetivo clube.
export default function TeamCrestMarquee({ label = 'Clubes' }: { label?: string }) {
  const CrestSet = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
    <div className="flex items-center gap-3 pr-3" aria-hidden={ariaHidden}>
      {TEAMS.map((t) => (
        <Link
          key={t.id}
          href={`/teams/${t.id}`}
          title={t.name}
          aria-label={`Abrir página do ${t.name}`}
          tabIndex={ariaHidden ? -1 : 0}
          className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/95 border border-white/25 flex items-center justify-center shadow-sm hover:scale-110 hover:bg-white transition-transform duration-200"
        >
          <TeamCrest teamId={t.id} size={40} />
        </Link>
      ))}
    </div>
  );

  return (
    <div className="crest-marquee relative w-full bg-primary overflow-hidden border-y border-primary/40">
      <div className="flex items-stretch">
        {/* Etiqueta fixa à esquerda */}
        <div className="flex items-center gap-2 px-4 sm:px-6 bg-black/25 flex-shrink-0 z-10">
          <span className="font-display uppercase tracking-widest text-white text-xs sm:text-sm whitespace-nowrap">{label}</span>
          <ExternalLink size={13} className="text-white/70" />
        </div>

        {/* Pista deslizante (dois conjuntos idênticos para loop perfeito) */}
        <div className="marquee-viewport overflow-hidden py-3">
          <div className="marquee-track flex items-center w-max">
            <CrestSet />
            <CrestSet ariaHidden />
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: crestMarquee 40s linear infinite;
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
