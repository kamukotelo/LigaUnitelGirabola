'use client';

// ════════════════════════════════════════════════════════════════════════
// Logótipos de clube persistidos (Supabase) — fonte global partilhada
// ────────────────────────────────────────────────────────────────────────
// A consola administrativa guarda o emblema de cada clube em
// `ancaf_teams.logo_url` (via /api/teams/logo). Este provider lê esses
// logótipos (leitura pública) e disponibiliza-os a todo o portal, reagindo em
// tempo real à troca de um emblema. O `TeamCrest` consome este contexto.
// ════════════════════════════════════════════════════════════════════════

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

type TeamLogoMap = Record<string, string>;

const TeamLogosContext = createContext<TeamLogoMap>({});

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url !== 'https://placeholder.supabase.co';
}

export function TeamLogosProvider({ children }: { children: React.ReactNode }) {
  const [logos, setLogos] = useState<TeamLogoMap>({});

  useEffect(() => {
    if (!isConfigured()) return;

    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase.from('ancaf_teams').select('id, logo_url');
      if (cancelled || error || !data) return;
      const map: TeamLogoMap = {};
      for (const row of data as { id: string; logo_url: string | null }[]) {
        if (row.logo_url) map[row.id] = row.logo_url;
      }
      setLogos(map);
    };

    load();

    // Atualização ao vivo: qualquer troca de emblema publicada reflete-se sem
    // recarregar a página.
    const channel = supabase
      .channel('ancaf-team-logos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ancaf_teams' }, () => load())
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return <TeamLogosContext.Provider value={logos}>{children}</TeamLogosContext.Provider>;
}

/** Logótipo persistido (global) de um clube, ou undefined se não houver. */
export function useTeamLogo(teamId: string): string | undefined {
  const map = useContext(TeamLogosContext);
  return map[teamId.toLowerCase()];
}
