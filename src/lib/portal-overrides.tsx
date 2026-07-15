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

import React, { useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';
import { setPortalOverrides, type PortalOverrides } from './data';

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url !== 'https://placeholder.supabase.co';
}

/** Publica o bloco de uma secção no servidor (usado pela consola de admin). */
export async function publishOverride(
  section: 'news' | 'calendar' | 'players' | 'nominations',
  value: unknown,
): Promise<boolean> {
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

export function PortalDataProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);
  const lastSig = useRef<string>('{}');

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
  return <React.Fragment key={version}>{children}</React.Fragment>;
}
