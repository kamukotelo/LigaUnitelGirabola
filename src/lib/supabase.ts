import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
// Supabase renamed the legacy "anon key" to "publishable key" in newer
// dashboards; accept either env var name so local setups using either
// naming still work (production on Vercel is configured with ANON_KEY).
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Standard utility to get public URL for player photos
 * Follows the naming convention: lowercase, no accents, hyphens.
 */
export const getPlayerPhotoUrl = (playerName: string) => {
  if (!playerName) return '/silhouettes/generic-player.png';
  
  const normalized = playerName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-');
    
  return `${supabaseUrl}/storage/v1/object/public/players/${normalized}.jpg`;
};
