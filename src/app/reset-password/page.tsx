'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck, Mail, ShieldAlert, ArrowLeft } from 'lucide-react';
import { MIN_PASSWORD_LENGTH, validateNewPassword } from '@/lib/password-policy';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const initialEmail = searchParams.get('email') ?? '';
  const initialMode = searchParams.get('mode') === 'key' || !token ? 'key' : 'token';

  const [mode, setMode] = useState<'token' | 'key'>(initialMode);
  const [email, setEmail] = useState(initialEmail);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<'checking' | 'ready' | 'invalid'>(token ? 'checking' : 'ready');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Confirma a validade do link por e-mail antes de pedir a palavra-passe
  useEffect(() => {
    if (!token || mode !== 'token') return;
    let active = true;
    fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (active) setStatus(data?.valid ? 'ready' : 'invalid');
      })
      .catch(() => {
        if (active) setStatus('invalid');
      });
    return () => {
      active = false;
    };
  }, [token, mode]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const policyError = validateNewPassword(password);
    if (policyError) {
      setError(policyError);
      return;
    }
    if (password !== confirmation) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    if (mode === 'key') {
      if (!email.trim()) {
        setError('Introduza o e-mail institucional.');
        return;
      }
      if (!recoveryKey.trim()) {
        setError('Introduza a Chave de Segurança ANCAF.');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = mode === 'key'
        ? { email: email.trim().toLowerCase(), recoveryKey: recoveryKey.trim(), newPassword: password }
        : { token, newPassword: password };

      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message ?? 'Não foi possível atualizar a palavra-passe.');
        if (data?.error === 'invalid_token' && mode === 'token') setStatus('invalid');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Falha de ligação ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <KeyRound size={26} />
          </div>
          <h1 className="text-2xl font-display uppercase text-foreground">Redefinir palavra-passe</h1>
          <p className="mt-2 text-xs text-zinc-500">Defina uma nova credencial para o Portal Admin da ANCAF.</p>
        </div>

        {/* Tab switchers if both options are relevant */}
        {!success && (
          <div className="mb-6 flex rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-1 text-xs font-semibold">
            {token && (
              <button
                type="button"
                onClick={() => { setMode('token'); setError(''); }}
                className={`flex-1 py-2 text-center rounded-xl transition-all ${
                  mode === 'token'
                    ? 'bg-white dark:bg-zinc-800 text-foreground shadow-sm'
                    : 'text-zinc-500 hover:text-foreground'
                }`}
              >
                Link de E-mail
              </button>
            )}
            <button
              type="button"
              onClick={() => { setMode('key'); setError(''); }}
              className={`flex-1 py-2 text-center rounded-xl transition-all ${
                mode === 'key'
                  ? 'bg-white dark:bg-zinc-800 text-foreground shadow-sm'
                  : 'text-zinc-500 hover:text-foreground'
              }`}
            >
              Chave de Segurança ANCAF
            </button>
          </div>
        )}

        {success ? (
          <div className="space-y-5 text-center">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Palavra-passe atualizada com sucesso. Já pode aceder com a nova credencial.
            </div>
            <Link href="/login" className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-accent/90 transition-all">
              Ir para o Início de Sessão
            </Link>
          </div>
        ) : mode === 'token' && status === 'checking' ? (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-zinc-500">
            <Loader2 size={16} className="animate-spin" />
            A validar o link…
          </div>
        ) : mode === 'token' && status === 'invalid' ? (
          <div className="space-y-5 text-center">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-700 dark:text-amber-400">
              O link de recuperação é inválido, já foi usado ou expirou.
            </div>
            <p className="text-xs text-zinc-500">
              Pode redefinir imediatamente a palavra-passe utilizando a Chave de Segurança Master ANCAF.
            </p>
            <button
              type="button"
              onClick={() => { setMode('key'); setError(''); }}
              className="w-full rounded-xl bg-accent px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-accent/90 transition-all"
            >
              Usar Chave de Segurança ANCAF
            </button>
            <div className="pt-2">
              <Link href="/login" className="text-xs text-zinc-400 hover:text-foreground">
                Voltar ao início de sessão
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {mode === 'key' && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">E-mail Institucional</span>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nome@ancaf.co.ao"
                      autoComplete="email"
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-white/60 pl-10 pr-4 py-2.5 text-sm text-foreground outline-none focus:border-accent dark:border-zinc-800 dark:bg-zinc-900/60 font-mono"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Mail size={15} />
                    </div>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">Chave de Segurança ANCAF</span>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={recoveryKey}
                      onChange={(e) => setRecoveryKey(e.target.value)}
                      placeholder="Código Master ANCAF"
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-white/60 px-4 py-2.5 pr-11 text-sm text-foreground outline-none focus:border-accent dark:border-zinc-800 dark:bg-zinc-900/60 font-mono tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((v) => !v)}
                      aria-label={showKey ? 'Ocultar chave' : 'Mostrar chave'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground"
                    >
                      {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span className="mt-1 block text-[10px] text-zinc-400">Código de emergência administrativa ANCAF.</span>
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">Nova palavra-passe</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  className="w-full rounded-xl border border-zinc-200 bg-white/60 px-4 py-2.5 pr-11 text-sm text-foreground outline-none focus:border-accent dark:border-zinc-800 dark:bg-zinc-900/60 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span className="mt-1 block text-[10px] text-zinc-500">Mínimo de {MIN_PASSWORD_LENGTH} caracteres.</span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">Confirmar palavra-passe</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-zinc-200 bg-white/60 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent dark:border-zinc-800 dark:bg-zinc-900/60 font-mono"
              />
            </label>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-500">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 hover:bg-accent/90 transition-all cursor-pointer select-none active:scale-[0.99]"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {loading ? 'A atualizar...' : 'Guardar nova palavra-passe'}
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-foreground">
                <ArrowLeft size={13} /> Voltar ao início de sessão
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
