'use client';

// ════════════════════════════════════════════════════════════════════════
// Overrides de equipa (admin) — fonte única partilhada
// ────────────────────────────────────────────────────────────────────────
// A consola administrativa guarda as edições de clube (incluindo o emblema/
// logótipo) neste registo local. Tanto o editor (`TeamsSection`) como os
// componentes de apresentação (`TeamCrest`) leem daqui, de modo a que trocar
// um logótipo no admin se reflita imediatamente em todo o portal.
// ════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import type { Team } from './data';

export const TEAM_OVERRIDES_KEY = 'faf_team_overrides';
/** Evento disparado sempre que os overrides mudam (atualização ao vivo dos emblemas). */
export const TEAM_OVERRIDES_EVENT = 'faf-team-overrides-changed';

export type TeamOverrides = Record<string, Partial<Team>>;

export function readTeamOverrides(): TeamOverrides {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(TEAM_OVERRIDES_KEY);
    return raw ? (JSON.parse(raw) as TeamOverrides) : {};
  } catch {
    return {};
  }
}

/** Persiste os overrides e notifica todos os componentes (mesmo separador). */
export function writeTeamOverrides(next: TeamOverrides): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TEAM_OVERRIDES_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(TEAM_OVERRIDES_EVENT));
}

/**
 * Devolve o emblema/logótipo personalizado de uma equipa (se existir),
 * reagindo em tempo real às alterações feitas no admin — no mesmo separador
 * (evento próprio) e entre separadores (evento `storage`).
 */
export function useTeamLogoOverride(teamId: string): string | undefined {
  const [logo, setLogo] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = teamId.toLowerCase();
    const read = () => {
      const overrides = readTeamOverrides();
      const entry = overrides[id] ?? overrides[teamId];
      setLogo(entry?.logoUrl);
    };
    read();
    window.addEventListener(TEAM_OVERRIDES_EVENT, read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener(TEAM_OVERRIDES_EVENT, read);
      window.removeEventListener('storage', read);
    };
  }, [teamId]);

  return logo;
}

/**
 * Converte um ficheiro de imagem escolhido pelo utilizador num data URL
 * otimizado para servir de emblema: redimensiona para no máx. `max` px
 * (preservando a transparência via PNG) para não esgotar o armazenamento
 * local. SVGs são mantidos como estão (já são vetoriais e leves).
 */
export async function fileToLogoDataUrl(file: File, max = 256): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Não foi possível ler o ficheiro.'));
    reader.readAsDataURL(file);
  });

  if (file.type === 'image/svg+xml') return dataUrl;

  const img = document.createElement('img');
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('Imagem inválida.'));
    img.src = dataUrl;
  });

  const scale = Math.min(1, max / Math.max(img.width, img.height || 1));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/png');
}
