'use client';

import React, { useState } from 'react';

interface TeamCrestProps {
  teamId: string;
  size?: number;
  className?: string;
}

const VALID_TEAMS = new Set([
  'petro',
  'wiliete',
  'dago',
  'desphuila',
  'bravos',
  'kabuscorp',
  'sagrada',
  'interclube',
  'lundasul',
  'libolo',
  'lobito',
  'saosalvador',
  'cabinda',
  'primeiromaio',
  'caala',
  'fcluanda'
]);

export default function TeamCrest({ teamId, size = 40, className = '' }: TeamCrestProps) {
  const cleanId = teamId.toLowerCase();
  const [hasError, setHasError] = useState(false);

  const isValid = VALID_TEAMS.has(cleanId);

  if (!isValid || hasError) {
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
    <img
      src={`/crests/${cleanId}.png`}
      alt={`Emblema ${teamId}`}
      width={size}
      height={size}
      onError={() => setHasError(true)}
      className={`object-contain select-none flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
