'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getTeamById } from '@/lib/data';
import { useTeamLogoOverride } from '@/lib/team-overrides';
import { useTeamLogo } from '@/lib/team-logos';

interface TeamCrestProps {
  teamId: string;
  size?: number;
  className?: string;
}

const CREST_PATHS: Record<string, string> = {
  petro: '/Clubes/PETRO DE LUANDA.png',
  // Emblemas servidos a partir de nomes ASCII limpos em /crests (evita o erro de
  // nomenclatura "WILIWTE" e o símbolo "§"/%C2%A7 nos ficheiros de "1.º de ...").
  wiliete: '/crests/wiliete.png',
  dago: '/crests/dago.png',
  desphuila: '/Clubes/CDH.png',
  bravos: '/Clubes/BRAVOS DO MAQUIS.png',
  kabuscorp: '/Clubes/KABUSCORP.png',
  sagrada: '/Clubes/SAGRADA.jpg',
  interclube: '/Clubes/INTERCLUBE.png',
  lundasul: '/Clubes/DESPORTIVO LUNDA SUL.png',
  libolo: '/Clubes/LIBOLO.png',
  lobito: '/Clubes/ACADEMICA DO LOBITO.png',
  saosalvador: '/Clubes/SALVADOR DO KONGO.png',
  primeiromaio: '/crests/primeiromaio.png',
  // fcluanda: sem emblema oficial disponível — usa o crachá de reserva com a
  // sigla do clube, evitando confusão com o FC Cabinda (o ficheiro que existia
  // era, na verdade, uma cópia do emblema do FC Cabinda).
  cabinda: '/Clubes/FC%20CABINDA.png',
  caala: '/Clubes/CAALA.png',
};

export default function TeamCrest({ teamId, size = 40, className = '' }: TeamCrestProps) {
  const cleanId = teamId.toLowerCase();
  // Guardamos a fonte que falhou (em vez de um booleano) para que um novo
  // logótipo limpe automaticamente o erro anterior, sem precisar de effect.
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);

  // Prioridade do emblema: (1) logótipo trocado no admin (override local, para
  // pré-visualização instantânea) → (2) logótipo global persistido no Supabase
  // → (3) logoUrl definido nos dados do clube → (4) mapa de ficheiros incluídos
  // → (5) crachá de reserva com a sigla. Trocar o logótipo no admin reflete-se
  // aqui em tempo real (override local + realtime do Supabase).
  const overrideLogo = useTeamLogoOverride(cleanId);
  const persistedLogo = useTeamLogo(cleanId);
  const dataLogo = getTeamById(cleanId)?.logoUrl;
  const crestPath = overrideLogo || persistedLogo || dataLogo || CREST_PATHS[cleanId];
  const hasError = !!crestPath && erroredSrc === crestPath;

  // Fontes personalizadas (upload em data URL ou URL externo) são servidas com
  // <img> nativo para não dependerem da lista de domínios do next/image.
  const isCustomSource = !!crestPath && (crestPath.startsWith('data:') || /^https?:\/\//.test(crestPath));

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

  if (isCustomSource) {
    return (
      // Fonte personalizada (data URL / URL externo): next/image não a otimiza.
      // eslint-disable-next-line @next/next/no-img-element
      <img
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
