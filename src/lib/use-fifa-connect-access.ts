'use client';

import { useEffect, useState } from 'react';

export function useFifaConnectAccess(): boolean {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/fifa-connect/access', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((access) => {
        if (!cancelled) setAllowed(access?.allowed === true);
      })
      .catch(() => {
        if (!cancelled) setAllowed(false);
      });
    return () => { cancelled = true; };
  }, []);

  return allowed;
}
