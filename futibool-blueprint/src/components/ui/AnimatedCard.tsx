'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'standard' | 'brutalist' | 'holographic' | 'hud';
  delay?: number;
}

export default function AnimatedCard({
  children,
  className = '',
  variant = 'standard',
  delay = 0,
}: AnimatedCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'brutalist':
        return 'brutalist-card';
      case 'holographic':
        return 'holo-card bg-card border border-zinc-800/80 rounded-2xl shadow-lg';
      case 'hud':
        return 'hud-panel relative rounded-lg';
      default:
        return 'bg-card border border-zinc-800/80 rounded-2xl hover:border-zinc-700/80 shadow-md transition-all duration-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 80,
        damping: 15,
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`${getVariantStyles()} ${className}`}
    >
      {variant === 'hud' && <div className="scanline-overlay" />}
      <div className="p-6 relative z-10">{children}</div>
    </motion.div>
  );
}
