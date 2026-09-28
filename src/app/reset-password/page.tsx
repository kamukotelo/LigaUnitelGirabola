'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck, ArrowLeft, ShieldAlert, Key } from 'lucide-react';
import { MIN_PASSWORD_LENGTH, validateNewPassword } from '@/lib/password-policy';
import ThemeToggle from '@/components/layout/ThemeToggle';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token') ?? '';
  const emailFromUrl = searchParams.get('email') ?? '';
  const modeFromUrl = searchParams.get('mode');

  const [activeTab, setActiveTab] = useState<'token' | 'key'>(
    tokenFromUrl ? 'token' : 'key'
  );

  // Campos do formulário
  const [token, setToken] = useState(tokenFromUrl);
  const [email, setEmail] = useState(emailFromUrl);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryKey, setShowRecoveryKey] = useState(false);

  // Estados de controlo
  const [tokenStatus, setTokenStatus] = useState<'checking' | 'ready' | 'invalid'>(
    tokenFromUrl ? 'checking' : 'invalid'
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  const [error, setError] = useState('');

  // Validar token se presente na URL
  useEffect(() => {
    if (!token) return;
    let active = true;
    fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (active) setTokenStatus(data?.valid ? 'ready' : 'invalid');
      })
      .catch(() => {
        if (active) setTokenStatus('invalid');
      });
    return () => {
      active = false;
    };
  }, [token]);

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

    setLoading(true);
    try {
      const payload = activeTab === 'key'
        ? { email: email.trim().toLowerCase(), recoveryKey: recoveryKey.trim(), newPassword: password }
        : { token: token.trim(), newPassword: password };

      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message ?? 'Não foi possível atualizar a palavra-passe.');
        if (data?.error === 'invalid_token' && activeTab === 'token') {
          setTokenStatus('invalid');
        }
        return;
      }
      setSuccessEmail(data?.email || email);
      setSuccess(true);
    } catch {
      setError('Falha de ligação ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="cyber-grid-bg absolute inset-0 opacity-[0.05] dark:opacity-[0.03] pointer-events-none" />
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 p-7 sm:p-9 shadow-2xl backdrop-blur-md relative z-10">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent">
            <KeyRound size={26} />
          </div>
          <h1 className="text-2xl font-display uppercase tracking-tight text-foreground">Redefinir palavra-passe</h1>
          <p className="mt-1.5 text-xs text-zinc-500">Recupere o acesso à consola administrativa da Liga Unitel Girabola.</p>
        </div>

        {success ? (
          <div className="space-y-5 text-center">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="mx-auto h-8 w-8 mb-2" />
              <p className="font-semibold">Palavra-passe atualizada com sucesso!</p>
              {successEmail && (
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 font-mono">Conta: {successEmail}</p>
              )}
            </div>
            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-accent/90 transition-all"
            >
              Iniciar sessão agora
            </Link>
          </div>
        ) : (
          <div>
            {/* Seletor de Modo de Recuperação */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl mb-6 text-xs font-mono">
              <button
                type="button"
                onClick={() => { setActiveTab('key'); setError(''); }}
                className={`py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'key'
                    ? 'bg-white dark:bg-zinc-800 text-foreground shadow-sm'
                    : 'text-zinc-500 hover:text-foreground'
                }`}
              >
                <Key size={13} />
                Chave ANCAF
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('token'); setError(''); }}
                className={`py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'token'
                    ? 'bg-white dark:bg-zinc-800 text-foreground shadow-sm'
                    : 'text-zinc-500 hover:text-foreground'
                }`}
              >
                <ShieldCheck size={13} />
                Link por E-mail
              </button>
            </div>

            {activeTab === 'token' && tokenStatus === 'checking' && (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-sm text-zinc-500">
                <Loader2 size={24} className="animate-spin text-accent" />
                <span>A validar o link de recuperação…</span>
              </div>
            )}

            {activeTab === 'token' && tokenStatus === 'invalid' && (
              <div className="space-y-4 text-center py-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
                  <ShieldAlert className="mx-auto h-6 w-6 mb-2" />
                  O link de recuperação por e-mail é inválido, expirou ou já foi utilizado.
                </div>
                <p className="text-xs text-zinc-500">
                  Pode usar a <strong className="text-foreground">Chave de Segurança ANCAF</strong> para redefinir a palavra-passe imediatamente sem esperar por e-mails.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('key')}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent hover:underline"
                >
                  <Key size={13} /> Mudar para Chave ANCAF
                </button>
              </div>
            )}

            {(activeTab === 'key' || (activeTab === 'token' && tokenStatus === 'ready')) && (
              <form onSubmit={submit} className="space-y-4">
                {activeTab === 'key' && (
                  <>
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        E-mail de Administrador
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="kamukotelo@ancaf.co.ao"
                        className="w-full rounded-xl border border-zinc-200 bg-white/60 dark:bg-zinc-900/60 px-4 py-3 text-sm text-foreground outline-none focus:border-accent dark:border-zinc-800 font-mono"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Chave de Segurança ANCAF (Master Passcode)
                      </span>
                      <div className="relative">
                        <input
                          type={showRecoveryKey ? 'text' : 'password'}
                          value={recoveryKey}
                          onChange={(e) => setRecoveryKey(e.target.value)}
                          required
                          placeholder="Chave de segurança ou código mestre"
                          className="w-full rounded-xl border border-zinc-200 bg-white/60 dark:bg-zinc-900/60 px-4 py-3 pr-11 text-sm text-foreground outline-none focus:border-accent dark:border-zinc-800 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRecoveryKey(!showRecoveryKey)}
                          aria-label={showRecoveryKey ? 'Ocultar chave' : 'Mostrar chave'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground"
                        >
                          {showRecoveryKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <span className="mt-1 block text-[10px] text-zinc-500 font-mono">
                        Código de autorização administrativa ANCAF.
                      </span>
                    </label>
                  </>
                )}

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Nova palavra-passe
                  </span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      minLength={MIN_PASSWORD_LENGTH}
                      className="w-full rounded-xl border border-zinc-200 bg-white/60 dark:bg-zinc-900/60 px-4 py-3 pr-11 text-sm text-foreground outline-none focus:border-accent dark:border-zinc-800 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span className="mt-1 block text-[10px] text-zinc-500">
                    Mínimo de {MIN_PASSWORD_LENGTH} caracteres (diferente da senha provisória).
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Confirmar nova palavra-passe
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white/60 dark:bg-zinc-900/60 px-4 py-3 text-sm text-foreground outline-none focus:border-accent dark:border-zinc-800 font-mono"
                  />
                </label>

                {error && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-500">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-accent/90 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  {loading ? 'A redefinir...' : 'Guardar nova palavra-passe'}
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900 text-center">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-foreground">
                <ArrowLeft size={13} /> Voltar ao ecrã de login
              </Link>
            </div>
          </div>
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
