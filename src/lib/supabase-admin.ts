import 'server-only';
import { createClient } from '@supabase/supabase-js';

/** Cliente exclusivo do servidor. Ignora RLS e nunca deve ser importado por Client Components. */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Credenciais de servidor do Supabase não configuradas.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
