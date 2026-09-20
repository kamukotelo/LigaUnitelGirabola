// ═══════════════════════════════════════════════════════════════════════
// ANCAF · Criação / reposição das contas de administração
// Liga Unitel Girabola — plataforma digital
//
// A autenticação da consola vive no PostgreSQL do Neon: a tabela
// public.ancaf_profiles guarda o e-mail e o hash bcrypt da palavra-passe
// (pgcrypto). Ver src/lib/admin-auth.ts.
//
// Uso:
//   node --env-file=.env scripts/create-ancaf-admins.mjs
//   node --env-file=.env scripts/create-ancaf-admins.mjs --reset   (repõe a
//         senha provisória mesmo em contas que já existem)
//
// Requer no ambiente (ou no .env):
//   DATABASE_URL_UNPOOLED  (recomendado)  ou  DATABASE_URL
//
// É idempotente: correr várias vezes não duplica contas.
// ═══════════════════════════════════════════════════════════════════════

import { readFileSync } from 'node:fs';
import { Pool } from '@neondatabase/serverless';

const TEMP_PASSWORD = 'jabulani2026';

// full_name é só para apresentação na consola; o e-mail é sempre em minúsculas.
const ACCOUNTS = [
  { email: 'emanuel.valodia@ancaf.co.ao', name: 'Emanuel Valódia' },
  { email: 'rivaldo.domingues@ancaf.co.ao', name: 'Rivaldo Domingues' },
  { email: 'derby.candido@ancaf.co.ao', name: 'Derby Cândido' },
  { email: 'kamukotelo@ancaf.co.ao', name: 'Kamukotelo' },
];

const RESET = process.argv.includes('--reset');

// ── Carregar variáveis de ambiente (process.env tem prioridade; .env é fallback) ──
function loadEnvFallback() {
  try {
    const raw = readFileSync(new URL('../.env', import.meta.url), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // sem .env — segue só com process.env
  }
}
loadEnvFallback();

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error('✗ Falta DATABASE_URL_UNPOOLED (recomendado) ou DATABASE_URL.');
  console.error('  Corra com: node --env-file=.env scripts/create-ancaf-admins.mjs');
  process.exit(1);
}

const pool = new Pool({ connectionString, max: 1 });
const client = await pool.connect();

let created = 0;
let updated = 0;
let skipped = 0;

try {
  await client.query('create extension if not exists pgcrypto');

  for (const account of ACCOUNTS) {
    const email = account.email.trim().toLowerCase();
    try {
      // O hash é calculado pelo servidor (pgcrypto); a senha em claro nunca é
      // guardada nem enviada para o cliente.
      const { rows } = await client.query(
        `insert into public.ancaf_profiles
               (email, password_hash, full_name, role, must_change_password, password_changed_at)
        values ($1, crypt($2, gen_salt('bf', 12)), $3, 'admin', true, timezone('utc', now()))
        on conflict (email) do update
           set full_name = excluded.full_name,
               role = 'admin',
               password_hash = case when $4 then excluded.password_hash
                                    else public.ancaf_profiles.password_hash end,
               must_change_password = case when $4 then true
                                           else public.ancaf_profiles.must_change_password end,
               password_changed_at = case when $4 then excluded.password_changed_at
                                          else public.ancaf_profiles.password_changed_at end
         returning (xmax = 0) as inserted`,
        [email, TEMP_PASSWORD, account.name, RESET],
      );

      if (rows[0]?.inserted) {
        created += 1;
        console.log(`＋ ${email} — conta criada com a senha provisória`);
      } else if (RESET) {
        updated += 1;
        console.log(`↻ ${email} — senha reposta para a provisória (--reset)`);
      } else {
        skipped += 1;
        console.log(`= ${email} — já existe; senha mantida (use --reset para repor)`);
      }
    } catch (error) {
      console.error(`✗ ${email} — ${error?.message ?? error}`);
      process.exitCode = 1;
    }
  }
} finally {
  client.release();
  await pool.end();
}

console.log('');
console.log(`Resumo: ${created} criada(s), ${updated} reposta(s), ${skipped} inalterada(s).`);
console.log(`Senha provisória: ${TEMP_PASSWORD} — trocada obrigatoriamente no 1.º acesso.`);
