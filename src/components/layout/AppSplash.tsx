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
        <Image
          src="/logo-girabola-horizontal.png"
          alt="Liga Unitel Girabola"
          width={635}
          height={208}
          priority
          className="h-auto w-full object-contain"
        />
      </div>
      <div className="app-splash__line" aria-hidden="true" />
      <p>Futebol de Angola</p>
    </div>
  );
}
