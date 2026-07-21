'use client';

import Image from 'next/image';
import { useBrandLogo } from '@/lib/team-logos';

export default function HoloBgLogo() {
  const logo = useBrandLogo('logo_vertical');
  const isCustom = logo.startsWith('data:') || (logo.startsWith('http') && !logo.includes('.supabase.co'));

  return (
    <div className="holo-bg-logo">
      <div className="holo-logo-glow" />
      <div className="holo-logo-ring-outer" />
      <div className="holo-logo-ring-inner" />
      {isCustom ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt=""
          aria-hidden
          className="holo-logo-image object-contain"
          width={500}
          height={500}
          style={{ width: '500px', height: '500px' }}
        />
      ) : (
        <Image
          src={logo}
          alt=""
          aria-hidden
          className="holo-logo-image"
          width={500}
          height={500}
        />
      )}
      <div className="holo-logo-scanner" />
    </div>
  );
}
