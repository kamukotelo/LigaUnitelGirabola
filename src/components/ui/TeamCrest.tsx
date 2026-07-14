'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getTeamById } from '@/lib/data';

interface TeamCrestProps {
  teamId: string;
  size?: number;
  className?: string;
}

const CREST_PATHS: Record<string, string> = {
  petro: '/Clubes/PETRO DE LUANDA.png',
  wiliete: '/Clubes/WILIWTE FC.png',
  dago: '/Clubes/1%C2%A7%20DE%20AGOSTO.png',
  desphuila: '/Clubes/CDH.png',
  bravos: '/Clubes/BRAVOS DO MAQUIS.png',
  kabuscorp: '/Clubes/KABUSCORP.png',
  sagrada: '/Clubes/SAGRADA.jpg',
  interclube: '/Clubes/INTERCLUBE.png',
  lundasul: '/Clubes/DESPORTIVO LUNDA SUL.png',
  libolo: '/Clubes/LIBOLO.png',
  lobito: '/Clubes/ACADEMICA DO LOBITO.png',
  saosalvador: '/Clubes/SALVADOR DO KONGO.png',
  primeiromaio: '/Clubes/1%C2%A7%20DE%20MAIO.png',
  // fcluanda: sem emblema oficial disponível — usa o crachá de reserva com a
  // sigla do clube, evitando confusão com o FC Cabinda (o ficheiro que existia
  // era, na verdade, uma cópia do emblema do FC Cabinda).
  cabinda: '/Clubes/FC%20CABINDA.png',
  caala: '/Clubes/CAALA.png',
};

export default function TeamCrest({ teamId, size = 40, className = '' }: TeamCrestProps) {
  const cleanId = teamId.toLowerCase();
  const [hasError, setHasError] = useState(false);

  const crestPath = CREST_PATHS[cleanId];

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
      onError={() => setHasError(true)}
      className={`object-contain select-none flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
