'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getTeamById, getPortalData } from '@/lib/data';
import { getTeamCrest } from '@/lib/team-crests';
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
  // 4. Registo canónico estático: pasta public/crests/
  const staticCrest = getTeamCrest(cleanId);

  // Cadeia de prioridades:
  // Se houver override local válido (sem erro), usa esse.
  // Senão, se houver imagem da BD válida (sem erro), usa essa.
  // Senão, se o logoUrl dos dados for diferente de staticCrest e válido, tenta.
  // Senão, cai no staticCrest da pasta public/crests/!
  let crestPath: string | undefined;

  if (overrideLogo && !failedSources[overrideLogo]) {
    crestPath = overrideLogo;
  } else if (dbLogo && !failedSources[dbLogo]) {
    crestPath = dbLogo;
  } else if (dataLogo && !failedSources[dataLogo] && dataLogo !== staticCrest) {
    crestPath = dataLogo;
  } else if (staticCrest && !failedSources[staticCrest]) {
    crestPath = staticCrest;
  }

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
