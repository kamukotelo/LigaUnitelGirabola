import React from 'react';

interface FuturisticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'premium' | 'neon' | 'outline';
  glitchText?: boolean;
  as?: 'button' | 'span' | 'div';
}

/** Botão institucional simples; a API antiga é preservada para compatibilidade. */
export default function FuturisticButton({
  children,
  className = '',
  variant = 'primary',
  glitchText: _glitchText = false,
  as = 'button',
  ...props
}: FuturisticButtonProps) {
  void _glitchText;
  const styles = variant === 'outline'
    ? 'border border-zinc-300 bg-transparent text-zinc-800 dark:border-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
    : 'border border-primary bg-primary text-white hover:opacity-90';
  const combined = `inline-flex items-center justify-center rounded-lg px-6 py-2.5 font-bold transition-colors ${styles} ${className}`;

  if (as === 'span') return <span className={`${combined} cursor-pointer`}>{children}</span>;
  if (as === 'div') return <div className={`${combined} cursor-pointer`}>{children}</div>;
  return <button className={combined} {...props}>{children}</button>;
}
