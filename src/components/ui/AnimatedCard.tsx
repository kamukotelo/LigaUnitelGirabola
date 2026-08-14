import React from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'standard' | 'brutalist' | 'holographic' | 'hud';
  delay?: number;
}

/**
 * Cartão visual uniforme. O nome é mantido por compatibilidade com as páginas
 * existentes, mas os movimentos, hologramas e varreduras foram removidos.
 */
export default function AnimatedCard({ children, className = '' }: AnimatedCardProps) {
  return (
    <div className={`relative rounded-2xl border border-zinc-200 bg-card shadow-sm dark:border-zinc-800/80 ${className}`}>
      <div className="relative p-6">{children}</div>
    </div>
  );
}
