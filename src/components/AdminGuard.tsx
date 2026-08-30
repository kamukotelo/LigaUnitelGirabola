'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, AlertCircle, Loader2, Mail } from 'lucide-react';
import FuturisticButton from './ui/FuturisticButton';
import AnimatedCard from './ui/AnimatedCard';

interface AdminGuardProps {
  children?: React.ReactNode;
}

type AuthStatus = 'checking' | 'authed' | 'anon';

export default function AdminGuard({ children }: AdminGuardProps) {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [passcode, setPasscode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // A sessão é verificada no servidor (cookie httpOnly). Nenhuma senha é
    // guardada nem comparada no cliente.
    let cancelled = false;
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setStatus(data?.authenticated ? 'authed' : 'anon');
      })
      .catch(() => {
        if (!cancelled) setStatus('anon');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: passcode }),
      });
      if (res.ok) {
        setStatus('authed');
        setPasscode('');
        window.location.reload();
      } else {
        setError('E-mail ou palavra-passe inválidos. Acesso negado.');
        setPasscode('');
      }
    } catch {
      setError('Falha de ligação ao servidor de autenticação.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'checking') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 relative z-10">
        <div className="flex items-center gap-3 text-zinc-500 font-mono text-xs uppercase tracking-widest">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          A verificar sessão...
        </div>
      </div>
    );
  }

  if (status === 'authed') {
    return children ? <>{children}</> : (
      <div className="min-h-[80vh] flex items-center justify-center p-6 relative z-10">
        <Loader2 className="h-5 w-5 animate-spin text-accent" />
      </div>
    );
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
            Área Restrita ANCAF
          </h2>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">
            Autenticação de Segurança Requerida
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
              E-mail administrativo
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-foreground rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono"
                placeholder="nome@ancaf.co.ao"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
              Palavra-passe
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
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

          <FuturisticButton variant="neon" type="submit" className="w-full" disabled={submitting}>
            <span className="flex items-center justify-center gap-2">
              {submitting ? 'A autenticar...' : 'Autenticar Terminal'} <ShieldCheck size={14} />
            </span>
          </FuturisticButton>
        </form>

        <div className="text-center mt-6 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
          SISTEMA DE SEGURANÇA INTEGRADO ANCAF
        </div>
      </AnimatedCard>
    </div>
  );
}
