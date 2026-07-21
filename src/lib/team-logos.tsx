'use client';

// ════════════════════════════════════════════════════════════════════════
// Logótipos de clube e de marca persistidos (Supabase) — fontes globais
// ────────────────────────────────────────────────────────────────────────
// A consola administrativa guarda o emblema de cada clube em
// `ancaf_teams.logo_url` e os logótipos gerais de marca em `ancaf_configs`.
// Este provider lê essas informações e disponibiliza-as para todo o portal,
// reagindo em tempo real a qualquer alteração.
// ════════════════════════════════════════════════════════════════════════

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

type TeamLogoMap = Record<string, string>;
type BrandLogoMap = Record<string, string>;

const TeamLogosContext = createContext<TeamLogoMap>({});
const BrandLogosContext = createContext<BrandLogoMap>({});

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url !== 'https://placeholder.supabase.co';
}

export function TeamLogosProvider({ children }: { children: React.ReactNode }) {
  const [logos, setLogos] = useState<TeamLogoMap>({});
  const [brandLogos, setBrandLogos] = useState<BrandLogoMap>({});

  useEffect(() => {
    if (!isConfigured()) return;

    let cancelled = false;

    // 1. Carrega os emblemas das equipas
    const loadTeams = async () => {
      const { data, error } = await supabase.from('ancaf_teams').select('id, logo_url');
      if (cancelled || error || !data) return;
      const map: TeamLogoMap = {};
      for (const row of data as { id: string; logo_url: string | null }[]) {
        if (row.logo_url) map[row.id] = row.logo_url;
      }
      setLogos(map);
    };

    // 2. Carrega as configurações dos logótipos de marca
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

    loadTeams();
    loadConfigs();

    // Atualização ao vivo dos emblemas das equipas
    const teamChannel = supabase
      .channel('ancaf-team-logos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ancaf_teams' }, () => loadTeams())
      .subscribe();

    // Atualização ao vivo dos logótipos gerais de marca
    const configChannel = supabase
      .channel('ancaf-configs-logos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ancaf_configs' }, () => loadConfigs())
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(teamChannel);
      supabase.removeChannel(configChannel);
    };
  }, []);

  return (
    <TeamLogosContext.Provider value={logos}>
      <BrandLogosContext.Provider value={brandLogos}>
        {children}
      </BrandLogosContext.Provider>
    </TeamLogosContext.Provider>
  );
}

/** Logótipo persistido (global) de um clube, ou undefined se não houver. */
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
      return '/logo-girabola.png';
    case 'logo_horizontal':
      return '/logo-girabola-horizontal.png';
    case 'logo_horizontal_white':
      return '/logo-girabola-horizontal-white.png';
    case 'logo_ancaf':
      return '/logo-ancaf.png';
  }
}
