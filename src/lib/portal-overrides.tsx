'use client';

// ════════════════════════════════════════════════════════════════════════
// Overrides de conteúdo do portal (publicados no admin) — leitura global
// ────────────────────────────────────────────────────────────────────────
// Lê os blocos de override publicados (/api/admin/overrides) e injeta-os nos
// getters de data.ts via setPortalOverrides(). Reage em tempo real a novas
// publicações (canal Supabase em `ancaf_configs`) e força a re-renderização da
// árvore para que os getters síncronos devolvam já os dados atualizados — sem
// obrigar cada consumidor a mudar.
// ════════════════════════════════════════════════════════════════════════

import React, { useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from './supabase';
import {
  DEFAULT_SITE_SETTINGS, setPortalOverrides, setPortalData,
  type PortalOverrides, type PortalData, type SiteSettings,
} from './data';

// Tabelas ancaf_* já migradas do código — Realtime alargado (Supabase exige
// subscrição por tabela em RLS). Cresce a cada vaga da migração.
const PORTAL_DATA_TABLES = [
  'ancaf_teams', 'ancaf_players', 'ancaf_team_staff', 'ancaf_team_profiles',
  'ancaf_standings', 'ancaf_videos', 'ancaf_news', 'ancaf_referee_nominations',
  'ancaf_match_lineups', 'ancaf_match_events', 'ancaf_match_stats',
];

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url !== 'https://placeholder.supabase.co';
}

export type OverrideSection = 'news' | 'calendar' | 'players' | 'nominations' | 'teams' | 'site';

/** Publica o bloco de uma secção no servidor (usado pela consola de admin). */
export async function publishOverride(section: OverrideSection, value: unknown): Promise<void> {
  const res = await fetch('/api/admin/overrides', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, value }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `Não foi possível guardar (${res.status}).`);
  }
}

// ── Identidade do portal (nome, textos, contactos, paleta) ───────────────
// Disponibilizada por contexto para que o cabeçalho, o rodapé e as páginas
// institucionais reflitam de imediato o que for editado no admin.
const SiteSettingsContext = React.createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}

/** Escreve a paleta editada nas variáveis CSS globais (`--primary`/`--accent`). */
function applyBrandPalette(site: SiteSettings): void {
  const root = document.documentElement;
  const dark = root.classList.contains('dark');
  root.style.setProperty('--primary', dark ? site.primaryDark : site.primaryLight);
  root.style.setProperty('--accent', dark ? site.accentDark : site.accentLight);
}

export function PortalDataProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);
  const [site, setSite] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const lastSig = useRef<string>('{}');
  const pathname = usePathname();

  // A paleta depende do tema ativo — reaplica quando a classe `dark` muda.
  useEffect(() => {
    applyBrandPalette(site);
    const observer = new MutationObserver(() => applyBrandPalette(site));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [site]);

  useEffect(() => {
    if (!isConfigured()) return;

    let cancelled = false;
    const load = async () => {
      try {
        const [ovRes, dataRes] = await Promise.all([
          fetch('/api/admin/overrides', { cache: 'no-store' }),
          fetch('/api/portal-data', { cache: 'no-store' }),
        ]);
        if (cancelled) return;
        const overrides = (ovRes.ok ? ((await ovRes.json())?.overrides ?? {}) : {}) as PortalOverrides;
        const portalData = (dataRes.ok ? ((await dataRes.json())?.data ?? {}) : {}) as PortalData;
        const sig = JSON.stringify({ o: overrides, d: portalData });
        // Só aplica/remonta quando algo mudou — sites sem edições nunca
        // sofrem remontagem nem perdem estado.
        if (sig === lastSig.current) return;
        lastSig.current = sig;
        setPortalOverrides(overrides);
        setPortalData(portalData);
        setSite({ ...DEFAULT_SITE_SETTINGS, ...(overrides.site ?? {}) });
        setVersion((v) => v + 1);
      } catch {
        // silencioso — o portal continua com os dados base
      }
    };

    load();

    const channel = supabase.channel('portal-data');
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'ancaf_configs' }, () => load());
    for (const table of PORTAL_DATA_TABLES) {
      channel.on('postgres_changes', { event: '*', schema: 'public', table }, () => load());
    }
    channel.subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  // Mudar a `key` remonta a subárvore quando novos overrides chegam, obrigando
  // os getters de data.ts a serem reavaliados com os dados atualizados.
  //
  // A consola de administração fica de fora dessa remontagem: publica as suas
  // próprias alterações, o que dispararia o realtime e faria perder a secção
  // aberta e o rascunho em edição a cada gravação.
  const isAdmin = pathname?.startsWith('/adminancaf2026') ?? false;

  return (
    <SiteSettingsContext.Provider value={site}>
      {isAdmin ? children : <React.Fragment key={version}>{children}</React.Fragment>}
    </SiteSettingsContext.Provider>
  );
}
