'use client';

import { useState, type FormEvent } from 'react';

export default function ClubAccessForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/club-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: data.get('username'), password: data.get('password') }),
      });
      if (response.ok) {
        window.location.replace('/area-clubes');
        return;
      }
      const result = await response.json().catch(() => null);
      setError(result?.message ?? 'Não foi possível iniciar sessão.');
    } catch {
      setError('Falha de ligação. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  const inputClass = 'w-full rounded-xl border border-zinc-300 bg-background px-4 py-3 dark:border-zinc-700';
  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-5">
      <label className="grid gap-2 text-sm font-semibold">
        Utilizador do clube
        <input name="username" autoComplete="username" required maxLength={12} className={inputClass} />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Palavra-passe
        <input name="password" type="password" autoComplete="current-password" required maxLength={72} className={inputClass} />
      </label>
      {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
      <button type="submit" disabled={busy} className="premium-button min-h-11 w-full rounded-xl px-4 py-2 disabled:opacity-60">
        {busy ? 'A entrar…' : 'Entrar'}
      </button>
    </form>
  );
}
