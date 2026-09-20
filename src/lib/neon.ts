import 'server-only';
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let cachedSql: NeonQueryFunction<false, false> | null = null;

/** Ligação HTTP ao Neon, exclusiva do servidor. Nunca importar em Client Components. */
export function getNeonSql(): NeonQueryFunction<false, false> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL não configurada. Adicione a ligação pooled do Neon.');
  }
  cachedSql ??= neon(connectionString);
  return cachedSql;
}

export function isNeonConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
