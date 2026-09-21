'use client';

import React, { useState, useEffect } from 'react';
import {
  X, ShieldCheck, KeyRound, RefreshCw, Loader2, CheckCircle2,
  AlertTriangle, Lock, Eye, EyeOff, UserCheck, ShieldAlert
} from 'lucide-react';
import { MIN_PASSWORD_LENGTH, validateNewPassword } from '@/lib/password-policy';

interface AdminAccount {
  email: string;
  name: string;
  role: string;
  mustChangePassword: boolean;
  passwordChangedAt: string | null;
  hasCustomPassword: boolean;
}

interface AdminAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminAccountsModal({ isOpen, onClose }: AdminAccountsModalProps) {
  const [activeTab, setActiveTab] = useState<'accounts' | 'changeMyPassword'>('accounts');
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Estados para reposição individual com senha customizada
  const [customPasswordModalEmail, setCustomPasswordModalEmail] = useState<string | null>(null);
  const [customNewPassword, setCustomNewPassword] = useState('');
  const [customConfirmPassword, setCustomConfirmPassword] = useState('');
  const [showCustomPassword, setShowCustomPassword] = useState(false);
  const [actionLoadingEmail, setActionLoadingEmail] = useState<string | null>(null);

  // Estados para troca da própria senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [myNewPassword, setMyNewPassword] = useState('');
  const [myConfirmPassword, setMyConfirmPassword] = useState('');
  const [showMyPassword, setShowMyPassword] = useState(false);
  const [myChangeLoading, setMyChangeLoading] = useState(false);
  const [myChangeSuccess, setMyChangeSuccess] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/accounts');
      const data = await res.json();
      if (res.ok && Array.isArray(data?.accounts)) {
        setAccounts(data.accounts);
      } else {
        setError(data?.message || 'Não foi possível carregar as contas.');
      }
    } catch {
      setError('Falha de ligação ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
      setSuccessMsg(null);
      setError(null);
    }
  }, [isOpen]);

  const handleResetToProvisional = async (account: AdminAccount) => {
    const confirm = window.confirm(
      `Tem a certeza de que deseja repor a palavra-passe de ${account.name} (${account.email}) para a provisória (jabulani2026)?`
    );
    if (!confirm) return;

    setActionLoadingEmail(account.email);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/accounts/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Falha ao repor a palavra-passe.');
      } else {
        setSuccessMsg(`Palavra-passe de ${account.email} reposta para a provisória (jabulani2026).`);
        await fetchAccounts();
      }
    } catch {
      setError('Falha de ligação ao servidor.');
    } finally {
      setActionLoadingEmail(null);
    }
  };

  const handleSetCustomPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPasswordModalEmail) return;

    const policyError = validateNewPassword(customNewPassword);
    if (policyError) {
      setError(policyError);
      return;
    }
    if (customNewPassword !== customConfirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    setActionLoadingEmail(customPasswordModalEmail);
    setError(null);

    try {
      const res = await fetch('/api/admin/accounts/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customPasswordModalEmail,
          newPassword: customNewPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Falha ao definir a nova palavra-passe.');
      } else {
        setSuccessMsg(`Nova palavra-passe definida com sucesso para ${customPasswordModalEmail}.`);
        setCustomPasswordModalEmail(null);
        setCustomNewPassword('');
        setCustomConfirmPassword('');
        await fetchAccounts();
      }
    } catch {
      setError('Falha de ligação ao servidor.');
    } finally {
      setActionLoadingEmail(null);
    }
  };

  const handleChangeMyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const policyError = validateNewPassword(myNewPassword, currentPassword);
    if (policyError) {
      setError(policyError);
      return;
    }
    if (myNewPassword !== myConfirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    setMyChangeLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword: myNewPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Não foi possível atualizar a sua palavra-passe.');
      } else {
        setMyChangeSuccess(true);
        setCurrentPassword('');
        setMyNewPassword('');
        setMyConfirmPassword('');
        setSuccessMsg('A sua palavra-passe foi atualizada com sucesso!');
        await fetchAccounts();
      }
    } catch {
      setError('Falha de ligação ao servidor.');
    } finally {
      setMyChangeLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 className="text-base font-display uppercase tracking-wide text-foreground">
                Segurança & Gestão de Contas
              </h2>
              <p className="text-[11px] font-mono text-zinc-500">
                Administração de credenciais dos representantes oficiais ANCAF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab('accounts'); setError(null); setSuccessMsg(null); }}
            className={`pb-3 px-4 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
              activeTab === 'accounts'
                ? 'border-accent text-accent'
                : 'border-transparent text-zinc-500 hover:text-foreground'
            }`}
          >
            Contas Oficiais ANCAF
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('changeMyPassword'); setError(null); setSuccessMsg(null); }}
            className={`pb-3 px-4 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
              activeTab === 'changeMyPassword'
                ? 'border-accent text-accent'
                : 'border-transparent text-zinc-500 hover:text-foreground'
            }`}
          >
            Alterar a Minha Senha
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 text-xs font-medium">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'accounts' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  4 Contas Oficiais Autorizadas
                </span>
                <button
                  onClick={fetchAccounts}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-foreground font-mono disabled:opacity-50"
                >
                  <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                  Atualizar
                </button>
              </div>

              {loading && accounts.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-zinc-400 gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-xs font-mono">A carregar estado das contas...</span>
                </div>
              ) : (
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/20">
                  {accounts.map((acc) => {
                    const isProcessing = actionLoadingEmail === acc.email;
                    return (
                      <div key={acc.email} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">{acc.name}</span>
                            {acc.mustChangePassword ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                                <AlertTriangle size={10} /> Provisória
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                                <UserCheck size={10} /> Ativa
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-mono text-zinc-400 mt-0.5">{acc.email}</p>
                          {acc.passwordChangedAt && (
                            <p className="text-[10px] font-mono text-zinc-500 mt-1">
                              Última alteração: {new Date(acc.passwordChangedAt).toLocaleString('pt-AO')}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleResetToProvisional(acc)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-amber-500 hover:text-amber-500 transition-colors disabled:opacity-50"
                            title="Repor palavra-passe desta conta para a padrão provisória (jabulani2026)"
                          >
                            {isProcessing ? <Loader2 size={12} className="animate-spin inline mr-1" /> : null}
                            Repor Provisória
                          </button>
                          <button
                            onClick={() => {
                              setCustomPasswordModalEmail(acc.email);
                              setCustomNewPassword('');
                              setCustomConfirmPassword('');
                              setError(null);
                            }}
                            disabled={isProcessing}
                            className="px-3 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider rounded-xl bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
                          >
                            Definir Senha
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Mini formulário inline de definição de senha customizada para colega */}
              {customPasswordModalEmail && (
                <form onSubmit={handleSetCustomPassword} className="p-4 rounded-2xl border border-accent/40 bg-accent/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Definir palavra-passe para <span className="font-mono text-accent">{customPasswordModalEmail}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCustomPasswordModalEmail(null)}
                      className="text-zinc-400 hover:text-foreground text-xs font-mono"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type={showCustomPassword ? 'text' : 'password'}
                        value={customNewPassword}
                        onChange={(e) => setCustomNewPassword(e.target.value)}
                        placeholder={`Nova senha (mín. ${MIN_PASSWORD_LENGTH})`}
                        required
                        minLength={MIN_PASSWORD_LENGTH}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-foreground pr-8 font-mono outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCustomPassword(!showCustomPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
                      >
                        {showCustomPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                    <input
                      type={showCustomPassword ? 'text' : 'password'}
                      value={customConfirmPassword}
                      onChange={(e) => setCustomConfirmPassword(e.target.value)}
                      placeholder="Confirmar nova senha"
                      required
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-foreground font-mono outline-none focus:border-accent"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={Boolean(actionLoadingEmail)}
                      className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold uppercase tracking-wider hover:bg-accent/90 disabled:opacity-50 transition-all flex items-center gap-1.5"
                    >
                      {actionLoadingEmail ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                      Gravar Senha
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Alterar Minha Senha */
            <form onSubmit={handleChangeMyPassword} className="space-y-4 max-w-md mx-auto">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Palavra-passe Atual
                </label>
                <div className="relative">
                  <input
                    type={showMyPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 px-4 py-2.5 pr-11 text-xs text-foreground font-mono outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMyPassword(!showMyPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground"
                  >
                    {showMyPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Nova Palavra-passe (mín. {MIN_PASSWORD_LENGTH} caracteres)
                </label>
                <input
                  type={showMyPassword ? 'text' : 'password'}
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  value={myNewPassword}
                  onChange={(e) => setMyNewPassword(e.target.value)}
                  placeholder="Defina uma senha forte"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 px-4 py-2.5 text-xs text-foreground font-mono outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Confirmar Nova Palavra-passe
                </label>
                <input
                  type={showMyPassword ? 'text' : 'password'}
                  required
                  value={myConfirmPassword}
                  onChange={(e) => setMyConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 px-4 py-2.5 text-xs text-foreground font-mono outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={myChangeLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent text-white text-xs font-semibold uppercase tracking-wider hover:bg-accent/90 disabled:opacity-50 transition-all cursor-pointer shadow-md"
              >
                {myChangeLoading ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
                <span>{myChangeLoading ? 'A guardar...' : 'Atualizar a Minha Senha'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
