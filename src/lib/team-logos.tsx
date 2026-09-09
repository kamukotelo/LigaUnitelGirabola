'use client';

// ════════════════════════════════════════════════════════════════════════
// Logótipos de marca persistidos (Supabase) — fonte global
// ────────────────────────────────────────────────────────────────────────
// A consola administrativa guarda os logótipos gerais de marca em
// `ancaf_configs`. Este provider lê-os de /api/brand-logos, que vive em cache
// no servidor e é invalidada quando o admin troca um logótipo. O browser já não
// fala diretamente com a base de dados, nem abre canal Realtime: um logótipo de
// marca muda uma ou duas vezes por ano, e era o padrão contrário — websocket
// permanente mais leituras sem cache — que esgotava a quota.
//
// Os EMBLEMAS DE CLUBE não passam por aqui: estão fixados em
// `src/lib/team-crests.ts` e servidos de `public/crests/`, para não mudarem
// sozinhos quando a base de dados fica indisponível.
// ════════════════════════════════════════════════════════════════════════

import React, { createContext, useContext, useEffect, useState } from 'react';

type BrandLogoMap = Record<string, string>;
type TeamLogoMap = Record<string, string>;

const TeamLogosContext = createContext<TeamLogoMap>({});
const BrandLogosContext = createContext<BrandLogoMap>({});

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url !== 'https://placeholder.supabase.co';
}

export function TeamLogosProvider({ children }: { children: React.ReactNode }) {
  const [teamLogos, setTeamLogos] = useState<TeamLogoMap>({});
  const [brandLogos, setBrandLogos] = useState<BrandLogoMap>({});

  useEffect(() => {
    if (!isConfigured()) return;

    let cancelled = false;

    (async () => {
      try {
        const [brandRes, teamRes] = await Promise.all([
          fetch('/api/brand-logos').catch(() => null),
          fetch('/api/teams/logo').catch(() => null),
        ]);
        if (cancelled) return;
        if (brandRes?.ok) {
          const { logos } = (await brandRes.json().catch(() => ({}))) as { logos?: BrandLogoMap };
          if (!cancelled && logos) setBrandLogos(logos);
        }
        if (teamRes?.ok) {
          const { logos } = (await teamRes.json().catch(() => ({}))) as { logos?: TeamLogoMap };
          if (!cancelled && logos) setTeamLogos(logos);
        }
      } catch {
        // Sem resposta: os componentes recorrem aos logótipos estáticos e à pasta /crests/
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <TeamLogosContext.Provider value={teamLogos}>
      <BrandLogosContext.Provider value={brandLogos}>{children}</BrandLogosContext.Provider>
    </TeamLogosContext.Provider>
  );
}

/**
 * Logótipo persistido (global) de um clube na base de dados, ou undefined se não houver.
 * Quando undefined, o componente recorre a public/crests/ (getTeamCrest).
 */
export function useTeamLogo(teamId: string): string | undefined {
  const map = useContext(TeamLogosContext);
  return map[teamId.toLowerCase()];
}

/**
 * Logótipo dinâmico de marca (vertical, horizontal, horizontal_white, ancaf).
 * Devolve o URL customizado na base de dados ou faz fallback para as imagens estáticas padrão.
 */
export function useBrandLogo(key: 'logo_vertical' | 'logo_horizontal' | 'logo_horizontal_white' | 'logo_ancaf'): string {
  const map = useContext(BrandLogosContext);
  const custom = map[key];
  if (custom) return custom;

  switch (key) {
    case 'logo_vertical':
      return '/logo-girabola.svg';
    case 'logo_horizontal':
      return '/logo-girabola-horizontal.png';
    case 'logo_horizontal_white':
      return '/logo-girabola-horizontal-white.png';
    case 'logo_ancaf':
      return '/logo-ancaf.png';
  }
}
