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
  DEFAULT_SITE_SETTINGS, setPortalOverrides,
  type PortalOverrides, type SiteSettings,
} from './data';

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url !== 'https://placeholder.supabase.co';
}

export type OverrideSection = 'news' | 'calendar' | 'players' | 'nominations' | 'teams' | 'site';

/** Publica o bloco de uma secção no servidor (usado pela consola de admin). */
export async function publishOverride(section: OverrideSection, value: unknown): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/overrides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, value }),
    });
    return res.ok;
  } catch {
    return false;
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
        const res = await fetch('/api/admin/overrides', { cache: 'no-store' });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const overrides = (data?.overrides ?? {}) as PortalOverrides;
        const sig = JSON.stringify(overrides);
        // Só aplica/remonta quando algo mudou — sites sem overrides nunca
        // sofrem remontagem nem perdem estado.
        if (sig === lastSig.current) return;
        lastSig.current = sig;
        setPortalOverrides(overrides);
        setSite({ ...DEFAULT_SITE_SETTINGS, ...(overrides.site ?? {}) });
        setVersion((v) => v + 1);
      } catch {
        // silencioso — o portal continua com os dados base
      }
    };

    load();

    const channel = supabase
      .channel('portal-overrides')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ancaf_configs' }, () => load())
      .subscribe();

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
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  return (
    <SiteSettingsContext.Provider value={site}>
      {isAdmin ? children : <React.Fragment key={version}>{children}</React.Fragment>}
    </SiteSettingsContext.Provider>
  );
}
