'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, KeyRound, Mail, Eye, EyeOff, Loader2, CheckCircle2,
  ArrowLeft, Terminal, ShieldAlert
} from 'lucide-react';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { useBrandLogo } from '@/lib/team-logos';

export default function LoginPage() {
  const logoAncaf = useBrandLogo('logo_ancaf');
  const isCustomLogo = logoAncaf.startsWith('data:') || (logoAncaf.startsWith('http') && !logoAncaf.includes('.supabase.co'));
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  // Add initial console output log lines for futuristic feel
  useEffect(() => {
    const lines = [
      'Área reservada aos representantes oficiais.',
      'A ligação a esta página é segura.',
      'Introduza as suas credenciais para continuar.'
    ];
    
    lines.forEach((line, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, line]);
      }, (index + 1) * 300);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setLogs(prev => [...prev, `A validar o acesso de ${email || 'utilizador'}...`]);

    // A credencial é validada no servidor (/api/admin/login), que emite o cookie
    // httpOnly de sessão. Nenhuma senha é comparada ou guardada no cliente.
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: password }),
      });

      if (res.ok) {
        setSuccess(true);
        setLogs(prev => [
          ...prev,
          'Credenciais verificadas com sucesso.',
          'Acesso autorizado.',
        ]);
        setTimeout(() => {
          router.push('/adminancaf2026');
        }, 1200);
      } else {
        setLoading(false);
        setError('Credenciais inválidas. Código de acesso incorreto.');
        setLogs(prev => [...prev, 'Código de acesso incorreto.']);
      }
    } catch {
      setLoading(false);
      setError('Falha de ligação ao servidor de autenticação.');
      setLogs(prev => [...prev, 'Falha de ligação ao servidor.']);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden z-10">
      {/* Background Tech Details */}
      <div className="cyber-grid-bg absolute inset-0 opacity-[0.07] dark:opacity-[0.04] pointer-events-none" />
      <div className="scanline-overlay pointer-events-none" />

      {/* Decorative Auroras / Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />

      {/* Floating Theme Toggle in Login */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Logo and Brand */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 justify-center mb-4">
            {isCustomLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoAncaf}
                alt="ANCAF Logo"
                width={70}
                height={70}
                className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(var(--primary),0.2)]"
              />
            ) : (
              <Image
                src={logoAncaf}
                alt="ANCAF Logo"
                width={70}
                height={70}
                className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(var(--primary),0.2)]"
              />
            )}
            <div className="h-10 w-px bg-zinc-300 dark:bg-zinc-800" />
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
                Portal de Gestão
              </span>
              <h2 className="text-xl font-display font-black uppercase leading-none text-foreground">
                Área de Clubes
              </h2>
            </div>
          </div>
          
          <h1 className="text-2xl font-display font-extrabold text-foreground uppercase tracking-tight sm:text-3xl">
            Iniciar Sessão
          </h1>
          <p className="mt-2 text-xs text-zinc-500 font-mono uppercase tracking-widest">
            Acesso reservado aos representantes oficiais
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden running-border"
        >
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form key="login-form" onSubmit={handleLogin} className="space-y-5">
                {/* Email Field (Optional identifier) */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    E-mail Institucional
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Mail size={16} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="clube@girabola.co.ao"
                      className="block w-full pl-10 pr-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-foreground font-mono"
                    />
                  </div>
                </div>

                {/* Password / Passcode Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Código de Acesso / Palavra-Passe
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <KeyRound size={16} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-10 py-3 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-foreground font-mono tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Error Panel */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 font-mono text-[10px] uppercase font-bold"
                    >
                      <ShieldAlert size={15} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-semibold uppercase tracking-wider text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 transition-all cursor-pointer select-none active:scale-[0.98] duration-150"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      <span>Autenticar Terminal</span>
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  Acesso Autorizado
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Redirecionando para consola de gestão...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal Console Logs */}
          <div className="mt-6 pt-5 border-t border-zinc-200/60 dark:border-zinc-900">
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px] uppercase tracking-wider mb-2">
              <Terminal size={11} /> Console de Auditoria
            </div>
            <div className="bg-zinc-900 rounded-xl p-3 font-mono text-[9px] text-zinc-400 space-y-1 overflow-y-auto max-h-[75px] scrollbar-thin">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-1.5">
                  <span className="text-zinc-600 select-none">&gt;</span>
                  <span className={log.includes('incorreto') || log.includes('Falha') ? 'text-red-400' : log.includes('sucesso') || log.includes('autorizado') ? 'text-emerald-400' : 'text-zinc-300'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={12} /> Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}
