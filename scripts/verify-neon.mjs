import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Falta DATABASE_URL.');
  process.exit(1);
}

const sql = neon(connectionString);
const [health] = await sql`
  select
    current_database() as database_name,
    current_user as database_user,
    now() as checked_at
`;

const tables = await sql`
  select table_name
  from information_schema.tables
  where table_schema = 'public' and table_name like 'ancaf_%'
  order by table_name
`;

const [counts] = await sql`
  select
    (select count(*)::int from public.ancaf_seasons) as seasons,
    (select count(*)::int from public.ancaf_teams) as teams,
    (select count(*)::int from public.ancaf_matches) as matches,
    (select count(*)::int from public.ancaf_profiles) as profiles
`;

if (tables.length < 10) throw new Error(`Esquema incompleto: apenas ${tables.length} tabelas ANCAF.`);
if (counts.teams < 16) throw new Error(`Dados incompletos: apenas ${counts.teams} clubes.`);
if (counts.matches < 240) throw new Error(`Dados incompletos: apenas ${counts.matches} jogos.`);

console.log(`✓ Neon acessível: ${health.database_name} (${health.database_user})`);
console.log(`✓ ${tables.length} tabelas ANCAF`);
console.log(`✓ ${counts.seasons} épocas · ${counts.teams} clubes · ${counts.matches} jogos · ${counts.profiles} administradores`);
