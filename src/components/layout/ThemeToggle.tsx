'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    const initial: Theme =
      stored ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    localStorage.setItem('theme', next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Activar tema claro' : 'Activar tema escuro'}
      title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
      className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:text-foreground hover:bg-foreground/10 transition-colors cursor-pointer"
    >
      {/* Evita mismatch de hidratação até saber o tema real */}
      {mounted && theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
