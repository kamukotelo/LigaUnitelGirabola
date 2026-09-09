'use client';

// ════════════════════════════════════════════════════════════════════════
// Logótipos de marca persistidos (Supabase) — fonte global
// ────────────────────────────────────────────────────────────────────────
// A consola administrativa guarda os logótipos gerais de marca em
// `ancaf_configs`. Este provider lê-os e disponibiliza-os para todo o portal,
// reagindo em tempo real a qualquer alteração.
//
// Os EMBLEMAS DE CLUBE não passam por aqui: estão fixados em
// `src/lib/team-crests.ts` e servidos de `public/crests/`, para não mudarem
// sozinhos quando a base de dados fica indisponível.
// ════════════════════════════════════════════════════════════════════════

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

type BrandLogoMap = Record<string, string>;

const BrandLogosContext = createContext<BrandLogoMap>({});

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url !== 'https://placeholder.supabase.co';
}

export function TeamLogosProvider({ children }: { children: React.ReactNode }) {
  const [brandLogos, setBrandLogos] = useState<BrandLogoMap>({});

  useEffect(() => {
    if (!isConfigured()) return;

    let cancelled = false;

    // Carrega as configurações dos logótipos de marca
    const loadConfigs = async () => {
      const { data, error } = await supabase
        .from('ancaf_configs')
        .select('key, value')
        .in('key', ['logo_vertical', 'logo_horizontal', 'logo_horizontal_white', 'logo_ancaf']);
      if (cancelled || error || !data) return;
      const map: BrandLogoMap = {};
      for (const row of data as { key: string; value: string }[]) {
        map[row.key] = row.value;
      }
      setBrandLogos(map);
    };

    loadConfigs();

    // Atualização ao vivo dos logótipos gerais de marca
    const configChannel = supabase
      .channel('ancaf-configs-logos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ancaf_configs' }, () => loadConfigs())
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(configChannel);
    };
  }, []);

  return <BrandLogosContext.Provider value={brandLogos}>{children}</BrandLogosContext.Provider>;
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
