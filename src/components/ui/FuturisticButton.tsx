'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface FuturisticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'premium' | 'neon' | 'outline';
  glitchText?: boolean;
  as?: 'button' | 'span' | 'div';
}

export default function FuturisticButton({
  children,
  className = '',
  variant = 'primary',
  glitchText = false,
  as = 'button',
  ...props
}: FuturisticButtonProps) {
  const getButtonStyles = () => {
    switch (variant) {
      case 'premium':
        return 'premium-button';
      case 'neon':
        return 'running-border bg-black text-white hover:text-cyan-400 font-bold py-2.5 px-6 rounded-full shadow-lg border border-transparent';
      case 'outline':
        return 'border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-700 py-2.5 px-6 rounded-full transition-all duration-200 active:scale-95';
      default:
        return 'primary-button';
    }
  };

  const content = typeof children === 'string' && glitchText ? (
    <span className="glitch-text" data-text={children}>
      {children}
    </span>
  ) : (
    children
  );

  const combinedClasses = `${getButtonStyles()} ${className} ${as !== 'button' ? 'inline-block text-center cursor-pointer' : ''}`;

  if (as === 'span') {
    return (
      <motion.span
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={combinedClasses}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
      >
        {content}
      </motion.span>
    );
  }

  if (as === 'div') {
    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={combinedClasses}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={combinedClasses}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    >
      {content}
    </motion.button>
  );
}
