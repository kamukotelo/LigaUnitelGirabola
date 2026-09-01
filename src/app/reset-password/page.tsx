'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const MIN_LENGTH = 10;

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setReady(Boolean(data.session));
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (active && (event === 'PASSWORD_RECOVERY' || session)) setReady(true);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (password.length < MIN_LENGTH) {
      setError(`A palavra-passe deve ter pelo menos ${MIN_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirmation) {
      setError('As palavras-passe não coincidem.');
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError('O link expirou ou não foi possível atualizar a palavra-passe. Solicite um novo link.');
      setLoading(false);
      return;
    }
    await supabase.auth.signOut();
    setSuccess(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 p-8 shadow-2xl">
        <div className="text-center mb-7">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <KeyRound size={26} />
          </div>
          <h1 className="text-2xl font-display uppercase text-foreground">Redefinir palavra-passe</h1>
          <p className="mt-2 text-xs text-zinc-500">Defina uma nova credencial para o Portal Admin.</p>
        </div>

        {success ? (
          <div className="space-y-5 text-center">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
              Palavra-passe atualizada com sucesso.
            </div>
            <Link href="/login" className="inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white">
              Iniciar sessão
            </Link>
          </div>
        ) : !ready ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-zinc-500">O link de recuperação é inválido ou expirou.</p>
            <Link href="/login" className="text-sm text-accent hover:underline">Solicitar um novo link</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">Nova palavra-passe</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={MIN_LENGTH}
                  className="w-full rounded-xl border border-zinc-200 bg-white/60 px-4 py-3 pr-12 text-sm text-foreground outline-none focus:border-accent dark:border-zinc-800 dark:bg-zinc-900/60"
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <span className="mt-1 block text-[10px] text-zinc-500">Mínimo de {MIN_LENGTH} caracteres.</span>
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">Confirmar palavra-passe</span>
              <input type={showPassword ? 'text' : 'password'} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} autoComplete="new-password" required className="w-full rounded-xl border border-zinc-200 bg-white/60 px-4 py-3 text-sm text-foreground outline-none focus:border-accent dark:border-zinc-800 dark:bg-zinc-900/60" />
            </label>

            {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-500">{error}</p>}

            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {loading ? 'A atualizar...' : 'Guardar nova palavra-passe'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
