// Instala o esquema PostgreSQL portátil e o snapshot disponível no Neon.
// Usa a ligação direta (não pooled) para operações de migração longas.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Pool } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Falta DATABASE_URL_UNPOOLED (recomendado) ou DATABASE_URL.');
  process.exit(1);
}

const root = process.cwd();
const files = [
  ['001_schema', resolve(root, 'db/001_schema.sql')],
  ['002_seed', resolve(root, 'db/002_seed.sql')],
  ['003_match_file_intervenients', resolve(root, 'supabase/migrations/20260919000000_match_file_intervenients.sql')],
  ['004_atomic_match_file_publish', resolve(root, 'supabase/migrations/20260919001000_atomic_match_file_publish.sql')],
  ['005_admin_password_resets', resolve(root, 'supabase/migrations/20260920000000_admin_password_resets.sql')],
];

const pool = new Pool({ connectionString, max: 1 });
const client = await pool.connect();

try {
  await client.query(`
    create table if not exists public.ancaf_schema_migrations (
      name text primary key,
      applied_at timestamptz not null default timezone('utc', now())
    )
  `);

  for (const [name, file] of files) {
    const exists = await client.query(
      'select 1 from public.ancaf_schema_migrations where name = $1',
      [name],
    );
    if (exists.rowCount) {
      console.log(`= ${name} já aplicado`);
      continue;
    }

    const sql = await readFile(file, 'utf8');
    console.log(`→ A aplicar ${name}…`);
    await client.query('begin');
    try {
      await client.query(sql);
      await client.query(
        'insert into public.ancaf_schema_migrations (name) values ($1)',
        [name],
      );
      await client.query('commit');
      console.log(`✓ ${name} aplicado`);
    } catch (error) {
      await client.query('rollback');
      throw error;
    }
  }
} finally {
  client.release();
  await pool.end();
}

console.log('Neon preparado com o esquema e o snapshot inicial.');
