'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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
  fcluanda: '/Clubes/LUANDA CITY.png',
  cabinda: '/Clubes/FC%20CABINDA.png',
  caala: '/Clubes/CAALA.png',
};

export default function TeamCrest({ teamId, size = 40, className = '' }: TeamCrestProps) {
  const cleanId = teamId.toLowerCase();
  const [hasError, setHasError] = useState(false);

  const crestPath = CREST_PATHS[cleanId];

  if (!crestPath || hasError) {
    const fallbackText = teamId.slice(0, 2).toUpperCase();
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-display font-bold border border-zinc-300 dark:border-zinc-700 text-center select-none ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(8, size * 0.4) }}
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
