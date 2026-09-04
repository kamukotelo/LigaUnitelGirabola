'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useBrandLogo } from '@/lib/team-logos';

export default function AppSplash() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const officialLogo = useBrandLogo('logo_vertical');
  const customOfficialLogo = officialLogo.startsWith('data:') || officialLogo.startsWith('http');

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
          {customOfficialLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={officialLogo} alt="Liga Unitel Girabola" className="h-full w-full object-contain" />
          ) : (
            <Image
              src={officialLogo}
              alt="Liga Unitel Girabola"
              width={355}
              height={403}
              priority
              className="h-full w-full object-contain"
            />
          )}
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
