'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ShieldCheck, AlertCircle, Loader2, Eye, EyeOff, MailQuestion, CheckCircle2 } from 'lucide-react';
import FuturisticButton from './ui/FuturisticButton';
import AnimatedCard from './ui/AnimatedCard';
import { MIN_PASSWORD_LENGTH as MIN_LENGTH, validateNewPassword } from '@/lib/password-policy';

export default function ChangePasswordGate({ email }: { email?: string }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const policyError = validateNewPassword(newPassword, currentPassword);
    if (policyError) {
      setError(policyError);
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

  // Saída de emergência para quem não consegue confirmar a senha provisória:
  // pede um link de recuperação para o e-mail da própria sessão.
  const handleRecovery = async () => {
    if (!email) return;
    setError('');
    setRecovering(true);
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message ?? 'Não foi possível processar o pedido.');
        return;
      }
      setRecoverySent(true);
    } catch {
      setError('Falha de ligação ao servidor.');
    } finally {
      setRecovering(false);
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

          {recoverySent ? (
            <div className="flex items-start gap-2 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 font-mono text-[10px] uppercase font-bold">
              <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" />
              <span>Enviámos um link para {email}. Abra-o para definir a palavra-passe.</span>
            </div>
          ) : email ? (
            <button
              type="button"
              onClick={handleRecovery}
              disabled={recovering}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:border-primary hover:text-primary disabled:opacity-50 transition-all cursor-pointer active:scale-[0.98]"
            >
              {recovering ? <Loader2 size={14} className="animate-spin" /> : <MailQuestion size={14} />}
              {recovering ? 'A enviar...' : 'Não sei a palavra-passe provisória'}
            </button>
          ) : null}
        </form>
      </AnimatedCard>
    </div>
  );
}
