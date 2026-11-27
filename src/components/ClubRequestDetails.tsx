import { CLUB_FIELDS, CLUB_STATUSES, type ClubRequest } from '@/lib/club-submissions';

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-AO', { timeZone: 'Africa/Luanda' });
}

export default function ClubRequestDetails({ item }: { item: ClubRequest }) {
  const latestFileRevision = item.files[0]?.revision;
  return (
    <div className="mt-3 space-y-3 text-sm">
      <p className="break-all text-xs text-zinc-500">{formatDate(item.created_at)} · Referência {item.id}</p>
      <dl className="flex flex-wrap gap-3">
        {(Object.entries(CLUB_FIELDS) as [keyof typeof CLUB_FIELDS, string][]).map(([field, label]) =>
          item.details[field] && <div key={field}><dt className="text-xs text-zinc-500">{label}</dt><dd>{item.details[field]}</dd></div>)}
      </dl>
      {item.message && <p className="whitespace-pre-wrap break-words">{item.message}</p>}
      {(item.filename || item.files.length > 0) && <ul className="grid gap-2">
        {item.files.map((file) => <li key={file.id} className="break-all">
          <a className="underline" href={`/api/club-portal?anexo=${file.id}`}>{file.filename}</a>
          <span className="ml-2 text-xs text-zinc-500">Versão {file.revision}{file.revision === latestFileRevision ? ' · Mais recente' : ''}</span>
        </li>)}
        {item.filename && <li className="break-all"><a className="underline" href={`/api/club-portal?anexo=${item.id}`}>{item.filename}</a><span className="ml-2 text-xs text-zinc-500">Versão 1{!latestFileRevision ? ' · Mais recente' : ''}</span></li>}
      </ul>}
      {item.updates.length > 0 && <ol aria-label="Histórico de actualizações" className="space-y-2 border-l border-zinc-300 pl-3 dark:border-zinc-700">
        {item.updates.map((update) => <li key={update.id}>
          <p className="font-semibold">{update.author === 'ancaf' ? 'ANCAF' : 'Clube'} · {CLUB_STATUSES[update.status]}</p>
          <time className="text-xs text-zinc-500">{formatDate(update.created_at)}</time>
          {update.message && <p className="whitespace-pre-wrap break-words">{update.message}</p>}
        </li>)}
      </ol>}
    </div>
  );
}
