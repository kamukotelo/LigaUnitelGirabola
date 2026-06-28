'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import FuturisticButton from './ui/FuturisticButton';
import AnimatedCard from './ui/AnimatedCard';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Leitura de sessionStorage apenas no cliente (evita mismatch de hidratação).
    /* eslint-disable react-hooks/set-state-in-effect */
    const auth = sessionStorage.getItem('faf_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '0317' || passcode === 'faf2026') {
      sessionStorage.setItem('faf_admin_auth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Código de acesso inválido. Acesso negado.');
      setPasscode('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative z-10">
      <div className="cyber-grid-bg absolute inset-0 opacity-10 pointer-events-none" />
      
      <AnimatedCard variant="hud" className="max-w-md w-full p-8 border-zinc-200 dark:border-zinc-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary mb-4 animate-pulse">
            <Lock className="h-7 w-7 text-accent" />
          </div>
          <h2 className="text-2xl font-display text-foreground uppercase tracking-tight">
            Área Restrita FAF
          </h2>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">
            Autenticação de Segurança Requerida
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
              Código de Acesso Administrador
            </label>
            <input
              type="password"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono text-center tracking-widest font-black"
              placeholder="••••"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 font-mono text-[10px] uppercase font-bold"
            >
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <FuturisticButton variant="neon" type="submit" className="w-full">
            <span className="flex items-center justify-center gap-2">
              Autenticar Terminal <ShieldCheck size={14} />
            </span>
          </FuturisticButton>
        </form>

        <div className="text-center mt-6 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          SISTEMA DE SEGURANÇA INTEGRADO FAF · COD. 0317
        </div>
      </AnimatedCard>
    </div>
  );
}
