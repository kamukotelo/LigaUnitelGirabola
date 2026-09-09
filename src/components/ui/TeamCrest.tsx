'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getTeamById } from '@/lib/data';
import { getTeamCrest } from '@/lib/team-crests';

interface TeamCrestProps {
  teamId: string;
  size?: number;
  className?: string;
}

export default function TeamCrest({ teamId, size = 40, className = '' }: TeamCrestProps) {
  const cleanId = teamId.toLowerCase();
  // Guardamos a fonte que falhou (em vez de um booleano) para que um novo
  // logótipo limpe automaticamente o erro anterior, sem precisar de effect.
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);

  // Fonte única e BLOQUEADA: o registo canónico em `@/lib/team-crests`, servido
  // de `public/crests/`. Não há leitura do Supabase, de overrides do admin nem
  // de `logoUrl` nos dados — assim o emblema nunca muda sozinho em produção
  // (ver a nota no topo de `src/lib/team-crests.ts`).
  const crestPath = getTeamCrest(cleanId);
  const hasError = !!crestPath && erroredSrc === crestPath;

  if (!crestPath || hasError) {
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

  return (
    <Image
      src={crestPath}
      alt={`Emblema ${teamId}`}
      width={size}
      height={size}
      onError={() => setErroredSrc(crestPath)}
      className={`object-contain select-none flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
