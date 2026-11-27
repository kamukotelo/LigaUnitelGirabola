'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  CATEGORY_FIELDS, CLUB_CATEGORIES, CLUB_FIELDS, MAX_CLUB_ATTACHMENT_BYTES, MAX_CLUB_FILES, type ClubCategory,
} from '@/lib/club-submissions';

const input = 'w-full rounded-lg border border-zinc-300 bg-background px-3 py-2 dark:border-zinc-700';

export default function ClubSubmissionForm({ correctionId }: { correctionId?: string }) {
  const router = useRouter();
  const [category, setCategory] = useState<ClubCategory>('jogadores');
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (correctionId) data.set('id', correctionId);
    else data.set('category', category);
    const files = data.getAll('attachment').filter((file): file is File => file instanceof File && file.size > 0);
    setError('');
    setReceipt('');
    if (files.length > MAX_CLUB_FILES || files.reduce((size, file) => size + file.size, 0) > MAX_CLUB_ATTACHMENT_BYTES) {
      setError('Pode enviar até cinco anexos, com 3 MB no total.');
      return;
    }

    setProgress(0);
    const request = new XMLHttpRequest();
    request.open('POST', '/api/club-portal');
    request.responseType = 'json';
    request.timeout = 60_000;
    request.upload.onprogress = (upload) => {
      if (upload.lengthComputable) setProgress(Math.round(upload.loaded / upload.total * 100));
    };
    request.onload = () => {
      setProgress(null);
      if (request.status < 200 || request.status >= 300) {
        setError(request.response?.message ?? 'Não foi possível enviar o pedido.');
        return;
      }
      form.reset();
      setReceipt(request.response.id);
      router.refresh();
    };
    request.onerror = request.ontimeout = () => {
      setProgress(null);
      setError('Não foi possível confirmar o envio. Consulte o histórico antes de repetir.');
    };
    request.send(data);
  }

  return (
    <section id={correctionId ? undefined : 'novo-envio'} className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">{correctionId ? 'Enviar correcção' : 'Novo envio à ANCAF'}</h2>
      {!correctionId && (
        <div role="group" aria-label="Categoria de envio" className="flex flex-wrap gap-2">
          {Object.entries(CLUB_CATEGORIES).map(([key, label]) => (
            <button key={key} type="button" disabled={progress !== null} aria-pressed={category === key}
              onClick={() => setCategory(key as ClubCategory)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm aria-pressed:border-accent aria-pressed:bg-accent/10 dark:border-zinc-700">
              {label}
            </button>
          ))}
        </div>
      )}
      <form method="post" encType="multipart/form-data" onSubmit={submit} className="space-y-4">
        <fieldset disabled={progress !== null} className="space-y-3">
          {!correctionId && <>
            <label className="grid gap-1 text-sm">Assunto<input name="subject" className={input} required maxLength={150} /></label>
            <div className="grid gap-3 sm:grid-cols-2">
              {CATEGORY_FIELDS[category].map((field) => (
                <label key={field} className="grid gap-1 text-sm">
                  {CLUB_FIELDS[field]}
                  <input name={field} className={input} required maxLength={field === 'round' ? 3 : 150}
                    pattern={field === 'round' ? '[1-9][0-9]{0,2}' : undefined} inputMode={field === 'round' ? 'numeric' : undefined} />
                </label>
              ))}
            </div>
          </>}
          <label className="grid gap-1 text-sm">Mensagem<textarea name="message" className={input} rows={4} maxLength={5000} /></label>
          <label className="grid gap-1 text-sm">
            Anexos (até cinco, 3 MB no total)
            <input name="attachment" type="file" multiple accept=".pdf,.xlsx,.docx,.csv,.png,.jpg,.jpeg" className={input} />
          </label>
        </fieldset>
        {progress !== null && <div role="status" className="text-sm">
          <progress className="block w-full" max={100} value={progress} aria-label="Progresso dos anexos" />
          {progress === 100 ? 'A guardar o envio…' : `A carregar ${progress}%`}
        </div>}
        {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
        {receipt && <p role="status" className="break-all text-sm">Enviado com sucesso. Referência {receipt}</p>}
        <button type="submit" disabled={progress !== null} className="premium-button min-h-11 rounded-xl px-4 py-2 disabled:opacity-60">
          {correctionId ? 'Enviar correcção' : 'Enviar à ANCAF'}
        </button>
      </form>
    </section>
  );
}
