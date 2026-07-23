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
  // Fonte canónica partilhada com o FAF_Calendar. Cada ID do portal aponta
  // para uma cópia byte-a-byte do emblema do respetivo ID FAF.
  petro: '/crests/petro.png',
  wiliete: '/crests/wiliete.png',
  dago: '/crests/dago.png',
  desphuila: '/crests/desphuila.png',
  bravos: '/crests/bravos.png',
  kabuscorp: '/crests/kabuscorp.png',
  sagrada: '/crests/sagrada.jpg',
  interclube: '/crests/interclube.png',
  lundasul: '/crests/lundasul.png',
  libolo: '/crests/libolo.png',
  lobito: '/crests/lobito.png',
  saosalvador: '/crests/saosalvador.png',
  primeiromaio: '/crests/primeiromaio.png',
  fcluanda: '/crests/fcluanda.png',
  cabinda: '/crests/cabinda.png',
  caala: '/crests/caala.png',
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
