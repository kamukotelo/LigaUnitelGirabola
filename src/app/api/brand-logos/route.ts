import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { PORTAL_DATA_TAG, PORTAL_DATA_MAX_AGE_SECONDS } from '@/lib/portal-cache';

// ── Logótipos de marca (vertical, horizontal, horizontal branco, ANCAF) ──
// Antes o browser lia `ancaf_configs` diretamente, em cada carregamento de
// página. Era a última leitura cliente→base de dados do portal; agora passa
// por aqui, em cache, e é invalidada quando o admin troca um logótipo.

const BRAND_KEYS = ['logo_vertical', 'logo_horizontal', 'logo_horizontal_white', 'logo_ancaf'] as const;

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url !== 'https://placeholder.supabase.co';
}

async function loadBrandLogos(): Promise<Record<string, string>> {
  if (!isConfigured()) return {};
  // Sem try/catch aqui de propósito: uma falha tem de escapar da função em
  // cache, para que o erro não fique guardado. Quem apanha é o GET.
  const { data, error } = await supabase
    .from('ancaf_configs')
    .select('key, value')
    .in('key', [...BRAND_KEYS]);
  if (error) throw error;
  const map: Record<string, string> = {};
  for (const row of (data ?? []) as { key: string; value: string }[]) {
    if (row.value) map[row.key] = row.value;
  }
  return map;
}

const getBrandLogos = unstable_cache(loadBrandLogos, ['brand-logos'], {
  tags: [PORTAL_DATA_TAG],
  revalidate: PORTAL_DATA_MAX_AGE_SECONDS,
});

export async function GET() {
  try {
    return NextResponse.json({ logos: await getBrandLogos() });
  } catch {
    // Base de dados indisponível: ficam os logótipos estáticos do useBrandLogo.
    return NextResponse.json({ logos: {} });
  }
}
