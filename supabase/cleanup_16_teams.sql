-- ═══════════════════════════════════════════════════════════════════════
-- LIMPEZA DA BASE DE DADOS — Manter apenas as 16 equipas oficiais
-- Liga Unitel Girabola 2026/2027
--
-- COMO USAR:
--   Supabase → SQL Editor → colar este ficheiro → Run
--
-- IDs oficiais das 16 equipas:
--   petro, wiliete, dago, desphuila, bravos, kabuscorp, sagrada,
--   interclube, lundasul, libolo, lobito, saosalvador, cabinda,
--   primeiromaio, caala, fcluanda
-- ═══════════════════════════════════════════════════════════════════════

-- Lista das 16 equipas oficiais desta época
-- Qualquer equipa fora desta lista será eliminada.

-- ── 1. Eliminar JOGOS que referenciam equipas não oficiais ─────────────
DELETE FROM public.liga_matches
WHERE home_team_id NOT IN (
    'petro','wiliete','dago','desphuila','bravos','kabuscorp',
    'sagrada','interclube','lundasul','libolo','lobito',
    'saosalvador','cabinda','primeiromaio','caala','fcluanda'
)
OR away_team_id NOT IN (
    'petro','wiliete','dago','desphuila','bravos','kabuscorp',
    'sagrada','interclube','lundasul','libolo','lobito',
    'saosalvador','cabinda','primeiromaio','caala','fcluanda'
)
OR home_team_id IS NULL
OR away_team_id IS NULL;

-- ── 2. Eliminar JOGADORES de equipas não oficiais ──────────────────────
DELETE FROM public.liga_players
WHERE team_id NOT IN (
    'petro','wiliete','dago','desphuila','bravos','kabuscorp',
    'sagrada','interclube','lundasul','libolo','lobito',
    'saosalvador','cabinda','primeiromaio','caala','fcluanda'
)
OR team_id IS NULL;

-- ── 3. Eliminar EQUIPAS não oficiais ───────────────────────────────────
DELETE FROM public.liga_teams
WHERE id NOT IN (
    'petro','wiliete','dago','desphuila','bravos','kabuscorp',
    'sagrada','interclube','lundasul','libolo','lobito',
    'saosalvador','cabinda','primeiromaio','caala','fcluanda'
);

-- ── 4. Verificação — confirmar que ficaram exatamente 16 equipas ────────
SELECT 
    COUNT(*) AS total_equipas,
    CASE 
        WHEN COUNT(*) = 16 THEN '✅ Correto — 16 equipas oficiais'
        ELSE '❌ Erro — ' || COUNT(*) || ' equipas (esperado: 16)'
    END AS estado
FROM public.liga_teams;

-- ── 5. Listar as 16 equipas que ficaram ────────────────────────────────
SELECT id, name, city, stadium
FROM public.liga_teams
ORDER BY name;
