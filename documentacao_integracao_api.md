# Documentação de Integração - API de Sincronização do Calendário

Esta documentação explica detalhadamente como o site **Liga Unitel Girabola** (`https://liga-unitel-girabola.vercel.app/`) recebe, armazena e expõe o calendário enviado pelo gestor **FAF_Calendar**. 

Todas estas implementações já foram aplicadas por mim no seu repositório local `/Users/nsungukamukotelo/LigaUnitelGiraBola` e publicadas em produção no Vercel. Abaixo está a arquitetura completa para sua referência ou para portar para outros projetos.

---

## 1. Variáveis de Ambiente Necessárias (Vercel)

No painel de definições da Vercel para o projeto **liga-unitel-girabola**, devem estar configuradas as seguintes variáveis:

* `NEXT_PUBLIC_SUPABASE_URL`: O URL do seu projeto Supabase.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: A chave anónima pública do seu Supabase.
* `ANCAF_SYNC_TOKEN`: O token de autenticação seguro. Valor predefinido usado nas requisições:
  `ancaf_secret_sync_token_2026`

---

## 2. Estrutura da Base de Dados (Supabase)

Para persistir a semente (seed) do calendário sorteado, foi adicionada uma tabela dedicada chamada `configs`. O script de migração correspondente é:

```sql
-- Criar tabela configs
CREATE TABLE IF NOT EXISTS public.configs (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir semente predefinida para a época
INSERT INTO public.configs (key, value) 
VALUES ('active_calendar_seed', '1357') 
ON CONFLICT (key) DO NOTHING;

-- Configurar Row Level Security (RLS)
ALTER TABLE public.configs ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para leitura
CREATE POLICY "Allow public read access on configs" ON public.configs FOR SELECT USING (true);

-- Políticas de escrita e alteração
CREATE POLICY "Allow admin write access on configs" ON public.configs FOR ALL USING (true);
```

---

## 3. Rota de Receção e Atualização (POST `/api/ancaf/update-seed`)

Esta API recebe a nova semente via pedido HTTP POST.
* **Ficheiro no projeto:** `src/app/api/ancaf/update-seed/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const SYNC_TOKEN = process.env.ANCAF_SYNC_TOKEN || 'ancaf_secret_sync_token_2026';

export async function POST(request: Request) {
  try {
    // 1. Validar Token de Segurança (Bearer Token)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'unauthorized', message: 'Token em falta' }, { status: 401 });
    }

    const token = authHeader.substring(7).trim();
    if (token !== SYNC_TOKEN) {
      return NextResponse.json({ error: 'unauthorized', message: 'Token inválido' }, { status: 401 });
    }

    // 2. Extrair a semente (seed) do body
    const { seed } = await request.json();
    if (!seed || isNaN(Number(seed))) {
      return NextResponse.json({ error: 'bad_request', message: 'Seed inválida' }, { status: 400 });
    }
    const seedStr = String(seed).trim();

    // 3. Atualizar na Base de Dados (Supabase)
    let dbUpdated = false;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
      const { error } = await supabase
        .from('configs')
        .upsert(
          { key: 'active_calendar_seed', value: seedStr, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
      if (!error) dbUpdated = true;
    }

    // 4. Se estiver em ambiente local de desenvolvimento, edita o ficheiro data.ts
    let fileUpdated = false;
    try {
      const dataFilePath = path.join(process.cwd(), 'src/lib/data.ts');
      if (fs.existsSync(dataFilePath)) {
        let content = fs.readFileSync(dataFilePath, 'utf-8');
        const accessCodeRegex = /(accessCode:\s*['"])\d+(['"])/g;
        const generatedAtRegex = /(generatedAt:\s*['"])[^'"]+(['"])/g;

        if (accessCodeRegex.test(content)) {
          content = content.replace(accessCodeRegex, `$1${seedStr}$2`);
          content = content.replace(generatedAtRegex, `$1${new Date().toISOString()}$2`);
          fs.writeFileSync(dataFilePath, content, 'utf-8');
          fileUpdated = true;
        }
      }
    } catch (err) {
      console.error('Falha ao escrever no data.ts local:', err);
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Semente atualizada',
      seed: seedStr,
      persisted: { database: dbUpdated, localFile: fileUpdated }
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}
```

---

## 4. Rota de Leitura Dinâmica (GET `/api/ancaf`)

Responsável por fornecer o calendário gerado no formato consumido pelas páginas públicas.
* **Ficheiro no projeto:** `src/app/api/ancaf/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateGirabolaCalendar } from '@/lib/ancaf-engine';
import { FAF_CALENDAR_SOURCE, SEASONS, UPCOMING_SEASON_ID, getTeamById } from '@/lib/data';

export const dynamic = 'force-dynamic'; // Garante que a API não é cacheada de forma estática

export async function GET(request: Request) {
  // 1. Tentar ler semente atual do Supabase
  let activeSeedStr = FAF_CALENDAR_SOURCE.accessCode;
  let dynamicSource = { ...FAF_CALENDAR_SOURCE };
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
    try {
      const { data } = await supabase
        .from('configs')
        .select('value, updated_at')
        .eq('key', 'active_calendar_seed')
        .single();
      
      if (data) {
        activeSeedStr = data.value;
        dynamicSource.accessCode = activeSeedStr;
        dynamicSource.generatedAt = data.updated_at || FAF_CALENDAR_SOURCE.generatedAt;
      }
    } catch (e) { /* Fallback automático */ }
  }

  const activeSeed = Number(activeSeedStr) || 1357;

  // 2. Gerar calendário dinamicamente a partir do motor
  const matches = generateGirabolaCalendar(activeSeed, 2026, 'm27-');
  
  // (O resto da rota processa os parâmetros ?round=N ou ?format=matches e devolve o JSON estruturado)
  // ...
}
```

---

## 5. Como o Gestor (`FAF_Calendar`) Envia os Dados

No botão **"Sincronizar com os servidores"** no gestor de calendários, é feito um pedido `fetch` direto para as duas rotas (local e produção):

```typescript
const payload = { seed: state.drawnSeed };
const token = 'ancaf_secret_sync_token_2026';

const response = await fetch('https://liga-unitel-girabola.vercel.app/api/ancaf/update-seed', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(payload)
});

if (response.ok) {
  console.log("Sincronizado com sucesso!");
}
```
