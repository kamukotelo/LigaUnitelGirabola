'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getTeamById, getPortalData } from '@/lib/data';
import { resolveTeamCrest } from '@/lib/team-crests';
import { useTeamLogoOverride } from '@/lib/team-overrides';
import { useTeamLogo } from '@/lib/team-logos';

interface TeamCrestProps {
  teamId: string;
  size?: number;
  className?: string;
}

export default function TeamCrest({ teamId, size = 40, className = '' }: TeamCrestProps) {
  const cleanId = teamId.toLowerCase();
  // Guardamos as fontes que falharam para fallback gracioso imediato
  const [failedSources, setFailedSources] = useState<Record<string, boolean>>({});

  // 1. Override local no admin (para pré-visualização instantânea)
  const overrideLogo = useTeamLogoOverride(cleanId);
  // 2. Logótipo lido da base de dados (Supabase ancaf_teams.logo_url)
  const dbLogo = useTeamLogo(cleanId) || getPortalData().teamLogos?.[cleanId];
  // 3. logoUrl dos dados do clube
  const dataLogo = getTeamById(cleanId)?.logoUrl;
  // Os emblemas protegidos nunca alternam com a BD ou overrides antigos.
  const crestPath = resolveTeamCrest(cleanId, [overrideLogo, dbLogo, dataLogo], failedSources);

  const markError = (src: string) => {
    setFailedSources((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  };

  if (!crestPath) {
    // Crachá de reserva distinto: sigla oficial do clube sobre a cor principal.
    const team = getTeamById(cleanId);
    const fallbackText = team?.shortName ?? teamId.slice(0, 3).toUpperCase();
    const bg = team?.colorsHex?.[0] ?? '#5C0F8B';
    return (
      <div
        className={`flex items-center justify-center rounded-full text-white font-display font-bold border border-black/10 dark:border-white/15 text-center select-none shadow-sm ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(8, size * 0.32), backgroundColor: bg }}
      >
        {fallbackText}
      </div>
    );
  }

  const isCustomSource = crestPath.startsWith('data:') || /^https?:\/\//.test(crestPath);

  if (isCustomSource) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={crestPath}
        alt={`Emblema ${teamId}`}
        width={size}
        height={size}
        onError={() => markError(crestPath!)}
        className={`object-contain select-none flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <Image
      src={crestPath}
      alt={`Emblema ${teamId}`}
      width={size}
      height={size}
      onError={() => markError(crestPath!)}
      className={`object-contain select-none flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
