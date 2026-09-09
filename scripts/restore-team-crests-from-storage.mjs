#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════
// RECUPERAR OS EMBLEMAS DO SUPABASE STORAGE PARA public/crests/
// ────────────────────────────────────────────────────────────────────────
// Até 2026-09-09 o portal servia os emblemas de `ancaf_teams.logo_url`
// (bucket `team-logos` do Supabase Storage). Quando o projeto Supabase foi
// bloqueado por quota de egress, essas leituras passaram a falhar e o site
// caiu no conjunto estático — foi assim que os emblemas "mudaram sozinhos".
//
// Este script traz esses ficheiros para dentro do repositório, que passou a
// ser a única fonte de emblemas (ver `src/lib/team-crests.ts`).
//
// COMO USAR
//   1. No painel do Supabase, retirar o spend cap / repor o serviço.
//   2. node scripts/restore-team-crests-from-storage.mjs
//      (--dry-run para só listar, sem escrever)
//   3. Conferir as imagens, confirmar as extensões indicadas no relatório
//      final e fazer commit de public/crests/.
//   4. O limite pode voltar a ser aplicado: o portal já não depende do
//      Supabase para mostrar emblemas.
// ════════════════════════════════════════════════════════════════════════

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CRESTS_DIR = join(ROOT, 'public', 'crests');
const DRY_RUN = process.argv.includes('--dry-run');

const EXT_BY_TYPE = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/gif': 'gif',
};

function loadEnv() {
  const env = {};
  for (const name of ['.env.local', '.env']) {
    const path = join(ROOT, name);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      if (!(key in env)) env[key] = trimmed.slice(eq + 1).trim();
    }
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  env.SUPABASE_SERVICE_ROLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !KEY) {
  console.error('Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no .env.');
  process.exit(1);
}

const rows = await fetch(`${SUPABASE_URL}/rest/v1/ancaf_teams?select=id,name,logo_url&order=id`, {
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
}).then(async (res) => {
  const body = await res.text();
  if (!res.ok) {
    console.error(`Supabase respondeu ${res.status}: ${body}`);
    if (res.status === 402) {
      console.error('\nO projeto continua bloqueado por quota. Retire o spend cap e tente de novo.');
    }
    process.exit(1);
  }
  return JSON.parse(body);
});

const report = [];

for (const row of rows) {
  if (!row.logo_url) {
    report.push({ id: row.id, estado: 'sem logo_url na BD', ficheiro: '—' });
    continue;
  }

  const res = await fetch(row.logo_url);
  if (!res.ok) {
    report.push({ id: row.id, estado: `falhou (HTTP ${res.status})`, ficheiro: '—' });
    continue;
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const type = (res.headers.get('content-type') || '').split(';')[0].trim();
  const urlExt = new URL(row.logo_url).pathname.split('.').pop()?.toLowerCase();
  const ext = EXT_BY_TYPE[type] || (urlExt && urlExt.length <= 4 ? urlExt : 'png');
  const filename = `${row.id}.${ext}`;
  const dest = join(CRESTS_DIR, filename);

  const before = existsSync(dest) ? createHash('md5').update(readFileSync(dest)).digest('hex') : null;
  const after = createHash('md5').update(buf).digest('hex');
  const estado = before === after ? 'igual ao que já está' : before ? 'substituído' : 'novo';

  if (!DRY_RUN && before !== after) writeFileSync(dest, buf);

  report.push({ id: row.id, estado: DRY_RUN ? `${estado} (dry-run)` : estado, ficheiro: `/crests/${filename}` });
}

console.table(report);
console.log(
  '\nConferir agora que cada caminho acima bate certo com o registo em' +
    ' src/lib/team-crests.ts (atenção às extensões .png vs .jpg) e fazer commit de public/crests/.'
);
