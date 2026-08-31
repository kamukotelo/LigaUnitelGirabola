'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ShieldCheck, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import FuturisticButton from './ui/FuturisticButton';
import AnimatedCard from './ui/AnimatedCard';

const MIN_LENGTH = 10;

export default function ChangePasswordGate({ email }: { email?: string }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < MIN_LENGTH) {
      setError(`A nova palavra-passe tem de ter pelo menos ${MIN_LENGTH} caracteres.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('A confirmação não coincide com a nova palavra-passe.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        // Recarrega para que o servidor releia o cookie sem a marca de troca.
        window.location.href = '/adminancaf2026';
        return;
      }
      setError(data?.message ?? 'Não foi possível atualizar a palavra-passe.');
    } catch {
      setError('Falha de ligação ao servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative z-10">
      <div className="cyber-grid-bg absolute inset-0 opacity-10 pointer-events-none" />

      <AnimatedCard variant="hud" className="max-w-md w-full p-8 border-zinc-200 dark:border-zinc-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 mb-4">
            <KeyRound className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-display text-foreground uppercase tracking-tight">
            Definir palavra-passe
          </h2>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">
            Primeiro acesso — troca obrigatória
          </p>
          {email && (
            <p className="text-[11px] font-mono text-zinc-400 mt-2 lowercase">{email}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
              Palavra-passe provisória
            </label>
            <input
              type={show ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono"
              placeholder="jabulani2026"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
              Nova palavra-passe (mín. {MIN_LENGTH} caracteres)
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-foreground rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-primary transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground"
                aria-label={show ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
              Confirmar nova palavra-passe
            </label>
            <input
              type={show ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono"
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
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
              {submitting ? 'A guardar...' : 'Guardar e entrar'}
            </span>
          </FuturisticButton>
        </form>
      </AnimatedCard>
    </div>
  );
}
