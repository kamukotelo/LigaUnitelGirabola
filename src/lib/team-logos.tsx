'use client';

// ════════════════════════════════════════════════════════════════════════
// Logótipos da marca — fixos em código
// ────────────────────────────────────────────────────────────────────────
// O portal já não lê logótipos da base de dados. Antes este provider pedia
// /api/brand-logos e /api/teams/logo em cada visita: quando a BD devolvia um
// logótipo antigo, ou falhava, a marca e os emblemas mudavam sozinhos aos
// olhos dos visitantes. Os ficheiros oficiais vivem em `public/` e
// `public/crests/`, com o conteúdo fixado por SHA-256 em
// `scripts/verify-brand-assets.mjs`, que corre antes de cada build.
//
// Os EMBLEMAS DE CLUBE resolvem-se em `src/lib/team-crests.ts`.
// ════════════════════════════════════════════════════════════════════════

import React from 'react';

/** Mantido para não mexer no layout; já não carrega nada da base de dados. */
export function TeamLogosProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/** Mantido por compatibilidade: os emblemas nunca vêm da BD (ver team-crests.ts). */
export function useTeamLogo(teamId: string): string | undefined {
  void teamId;
  return undefined;
}

/** Logótipo oficial da marca (vertical, horizontal, horizontal branco, ANCAF). */
export function useBrandLogo(key: 'logo_vertical' | 'logo_horizontal' | 'logo_horizontal_white' | 'logo_ancaf'): string {
  switch (key) {
    case 'logo_vertical':
      return '/logo-girabola.png';
    case 'logo_horizontal':
      return '/logo-girabola-horizontal.png';
    case 'logo_horizontal_white':
      return '/logo-girabola-horizontal-white.png';
    case 'logo_ancaf':
      return '/logo-ancaf.png';
  }
}
