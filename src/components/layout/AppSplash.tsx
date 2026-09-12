'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function AppSplash() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setLeaving(true), 1250);
    const removeTimer = window.setTimeout(() => setVisible(false), 1750);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`app-splash ${leaving ? 'app-splash--leaving' : ''}`}
      role="status"
      aria-label="A abrir a Liga Unitel Girabola"
    >
      <div className="app-splash__grid" aria-hidden="true" />
      <div className="app-splash__halo" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="app-splash__logo">
        <div className="app-splash__logo-mobile">
          {/* Logótipo oficial em PNG, fixado aqui de propósito: o
              `logo-girabola.svg` é uma vetorização automática (216 paths) que
              serrilha as bordas, e passar pela base de dados deixaria o
              logótipo mudar sozinho quando ela falha. */}
          <Image
            src="/logo-girabola.png"
            alt="Liga Unitel Girabola"
            width={355}
            height={403}
            priority
            className="h-full w-full object-contain"
          />
        </div>
        <Image
          src="/logo-girabola-horizontal.png"
          alt="Liga Unitel Girabola"
          width={635}
          height={208}
          priority
          className="app-splash__logo-desktop h-auto w-full object-contain"
        />
      </div>
      <div className="app-splash__line" aria-hidden="true" />
      <p>Futebol de Angola</p>
    </div>
  );
}
