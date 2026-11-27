'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CLUB_STATUSES, type ClubStatus } from '@/lib/club-submissions';

export default function ClubReviewForm({ id, activity, status, assignee, admins }: {
  id: string; activity: string; status: ClubStatus; assignee: string | null;
  admins: { email: string; name: string }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(form)) params.set(key, String(value));
    params.set('action', 'review');
    params.set('id', id);
    params.set('activity', activity);
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/club-portal', { method: 'POST', body: params });
      const result = await response.json().catch(() => null);
      setFailed(!response.ok);
      setMessage(response.ok ? 'Actualização registada.' : result?.message ?? 'Não foi possível actualizar.');
      if (response.ok) {
        const reply = form.elements.namedItem('message');
        if (reply instanceof HTMLTextAreaElement) reply.value = '';
        router.refresh();
      }
    } catch {
      setFailed(true);
      setMessage('Falha de ligação. Verifique se a resposta foi registada antes de repetir.');
    } finally {
      setBusy(false);
    }
  }

  const input = 'w-full rounded-lg border border-zinc-300 bg-background px-3 py-2 dark:border-zinc-700';
  return <form method="post" onSubmit={submit} className="mt-4 space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
    <fieldset className="grid gap-3 sm:grid-cols-2" disabled={busy}>
      <label className="text-sm">Estado<select name="status" defaultValue={status} className={input}>
        {Object.entries(CLUB_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select></label>
      <label className="text-sm">Responsável<select name="assignee" defaultValue={assignee ?? ''} className={input}>
        <option value="">Por atribuir</option>
        {admins.map(({ email, name }) => <option key={email} value={email}>{name}</option>)}
      </select></label>
      <label className="text-sm sm:col-span-2">Resposta ao clube<textarea name="message" rows={3} maxLength={5000} className={input} /></label>
    </fieldset>
    {message && <p role={failed ? 'alert' : 'status'} className="text-sm">{message}</p>}
    <button type="submit" disabled={busy} className="premium-button rounded-lg px-4 py-2">Guardar actualização</button>
  </form>;
}
