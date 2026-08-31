// ═══════════════════════════════════════════════════════════════════════
// ANCAF · Criação das contas de administração individuais
// Liga Unitel Girabola — plataforma digital
//
// Cria (ou repõe) as contas de administrador no Supabase Authentication e
// garante o registo correspondente em public.ancaf_profiles com
// role = 'admin' e must_change_password = true (troca obrigatória no
// primeiro acesso).
//
// Uso:
//   node --env-file=.env scripts/create-ancaf-admins.mjs
//   node --env-file=.env scripts/create-ancaf-admins.mjs --reset   (repõe a
//         senha provisória mesmo em contas que já existem)
//
// Requer no ambiente (ou no .env):
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//
// É idempotente: correr várias vezes não duplica contas.
// ═══════════════════════════════════════════════════════════════════════

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey || serviceRoleKey === 'your-supabase-service-role-key') {
  console.error('✗ Faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY.');
  console.error('  Corra com: node --env-file=.env scripts/create-ancaf-admins.mjs');
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  // O projeto tem poucos utilizadores; uma página basta.
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return data.users.find((u) => (u.email ?? '').toLowerCase() === email) ?? null;
}

let created = 0;
let updated = 0;
let skipped = 0;

for (const account of ACCOUNTS) {
  const email = account.email.trim().toLowerCase();
  try {
    const existing = await findUserByEmail(email);
    let userId;

    if (!existing) {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password: TEMP_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: account.name },
      });
      if (error) throw error;
      userId = data.user.id;
      created += 1;
      console.log(`＋ ${email} — conta criada com a senha provisória`);
    } else {
      userId = existing.id;
      if (RESET) {
        const { error } = await admin.auth.admin.updateUserById(userId, {
          password: TEMP_PASSWORD,
          email_confirm: true,
        });
        if (error) throw error;
        updated += 1;
        console.log(`↻ ${email} — senha reposta para a provisória (--reset)`);
      } else {
        skipped += 1;
        console.log(`= ${email} — já existe; senha mantida (use --reset para repor)`);
      }
    }

    const { error: profileError } = await admin
      .from('ancaf_profiles')
      .upsert(
        {
          id: userId,
          full_name: account.name,
          role: 'admin',
          must_change_password: !existing || RESET,
        },
        { onConflict: 'id' },
      );
    if (profileError) throw profileError;
  } catch (error) {
    console.error(`✗ ${email} — ${error?.message ?? error}`);
    process.exitCode = 1;
  }
}

console.log('');
console.log(`Resumo: ${created} criada(s), ${updated} reposta(s), ${skipped} inalterada(s).`);
console.log(`Senha provisória: ${TEMP_PASSWORD} — trocada obrigatoriamente no 1.º acesso.`);
