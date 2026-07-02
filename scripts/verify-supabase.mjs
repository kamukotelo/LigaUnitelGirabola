import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const missing = [
  ['NEXT_PUBLIC_SUPABASE_URL', url],
  ['NEXT_PUBLIC_SUPABASE_ANON_KEY', anonKey],
  ['SUPABASE_SERVICE_ROLE_KEY', serviceRoleKey],
].filter(([, value]) => !value).map(([name]) => name);

if (missing.length) {
  console.error(`Variáveis em falta: ${missing.join(', ')}`);
  process.exit(1);
}

const publicClient = createClient(url, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const adminClient = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const checks = [];

const { data: config, error: configError } = await publicClient
  .from('ancaf_configs')
  .select('key,value,updated_at')
  .eq('key', 'active_calendar_seed')
  .single();
checks.push(['Leitura pública da configuração', configError, config]);

const { count: teamsCount, error: teamsError } = await publicClient
  .from('ancaf_teams')
  .select('*', { count: 'exact', head: true });
checks.push(['Equipas inicializadas', teamsError, `${teamsCount ?? 0}/16`]);

const { count: seasonsCount, error: seasonsError } = await publicClient
  .from('ancaf_seasons')
  .select('*', { count: 'exact', head: true });
checks.push(['Épocas inicializadas', seasonsError, seasonsCount]);

const { error: adminError } = await adminClient
  .from('ancaf_configs')
  .select('key', { head: true, count: 'exact' });
checks.push(['Acesso server/service_role', adminError, 'OK']);

let failed = false;
for (const [label, error, value] of checks) {
  if (error) {
    failed = true;
    console.error(`FALHOU  ${label}: ${error.message}`);
  } else {
    console.log(`OK      ${label}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
  }
}

if (teamsCount !== 16) {
  failed = true;
  console.error(`FALHOU  Esperadas 16 equipas, encontradas ${teamsCount ?? 0}.`);
}

process.exit(failed ? 1 : 0);
