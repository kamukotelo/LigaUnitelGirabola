'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CLUB_CATEGORIES, MAX_CLUB_ATTACHMENT_BYTES, type ClubCategory } from '@/lib/club-submissions';

export default function ClubSubmissionForm() {
  const router = useRouter();
  const [category, setCategory] = useState<ClubCategory>('jogadores');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set('category', category);
    const file = data.get('attachment');
    setError('');
    setReceipt('');
    if (file instanceof File && file.size > MAX_CLUB_ATTACHMENT_BYTES) {
      setError('O anexo não pode exceder 3 MB.');
      return;
    }

    setBusy(true);
    try {
      const response = await fetch('/api/club-portal', { method: 'POST', body: data });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(result?.message ?? 'Não foi possível enviar o pedido.');
        return;
      }
      form.reset();
      setReceipt(result.id);
      router.refresh();
    } catch {
      setError('Falha de ligação. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  const input = 'w-full rounded-lg border border-zinc-300 bg-background px-3 py-2 dark:border-zinc-700';
  return (
    <section className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold">Enviar à ANCAF</h2>
      <div role="group" aria-label="Categoria de envio" className="flex flex-wrap gap-2">
        {Object.entries(CLUB_CATEGORIES).map(([key, label]) => (
          <button key={key} type="button" disabled={busy} aria-pressed={category === key}
            onClick={() => setCategory(key as ClubCategory)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm aria-pressed:border-accent aria-pressed:bg-accent/10 dark:border-zinc-700">
            {label}
          </button>
        ))}
      </div>
      <form method="post" encType="multipart/form-data" onSubmit={submit} className="space-y-4">
        <fieldset disabled={busy} className="space-y-3">
          <label className="grid gap-1 text-sm">Assunto<input name="subject" className={input} required maxLength={150} /></label>
          <label className="grid gap-1 text-sm">Mensagem<textarea name="message" className={input} rows={4} maxLength={5000} /></label>
          <label className="grid gap-1 text-sm">
            Anexo (até 3 MB)
            <input name="attachment" type="file" accept=".pdf,.xlsx,.docx,.csv,.png,.jpg,.jpeg" className={input} />
          </label>
        </fieldset>
        {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
        {receipt && <p role="status" className="break-all text-sm">Enviado com sucesso. Referência {receipt}</p>}
        <button type="submit" disabled={busy} className="premium-button min-h-11 rounded-xl px-4 py-2 disabled:opacity-60">
          {busy ? 'A enviar…' : 'Enviar à ANCAF'}
        </button>
      </form>
    </section>
  );
}
