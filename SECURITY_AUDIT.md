# Auditoria de Segurança — LigaUnitelGiraBola

Data: 24 de agosto de 2026
Stack: Next.js 16 + React 19 + Supabase + Vercel

## Resultado do checklist

1. Chaves públicas vs. privadas .......... 🔧 Corrigido no código; rotação local pendente
2. Segredos hardcoded ..................... 🔧 Corrigido
3. RLS / regras de banco de dados ......... 🔧 Corrigido no repositório; migração pendente no Supabase
4. Páginas internas sem autenticação ...... 🔧 Corrigido
5. SQL Injection ........................... ✅ OK
6. Itens extras de higiene ................. 🔧 Corrigido parcialmente

## Evidências e problemas encontrados

### Credenciais e segredos

- O `.env` real não está rastreado pelo Git e nenhum valor privado foi encontrado no histórico analisado.
- Nenhum segredo privado local foi encontrado no bundle público de produção (`.next/static`).
- A chave pública do Supabase é usada no cliente; a `service_role` permanece exclusiva do servidor.
- O ficheiro `.env` local tinha permissões `0644`; foi alterado para `0600`.
- A autenticação administrativa aceitava `ancaf2026` quando a variável de ambiente não existia. O fallback foi removido: a aplicação agora falha de forma segura.
- A direção de clube reutilizava a credencial de administrador quando `CLUB_DIRECTION_PASSCODE` não existia. Os dois perfis agora exigem credenciais distintas.
- O `ANCAF_SYNC_TOKEN` local reutiliza atualmente a `SUPABASE_SERVICE_ROLE_KEY`. A rota de sincronização passou a rejeitar essa configuração, mas a credencial ainda precisa ser rotacionada e atualizada no sistema que envia o calendário.

### Autorização e páginas internas

- A página administrativa era protegida somente depois de o JavaScript carregar. A sessão agora é validada no servidor antes de a consola ser enviada.
- Sessões de direção de clube conseguiam passar na verificação genérica usada pelas rotas de publicação. As rotas de calendário, notícias, equipas e logótipos agora exigem explicitamente o perfil `admin`.
- A direção de clube fica limitada ao módulo FIFA Connect.
- `/adminancaf2026` e `/login` recebem `X-Robots-Tag: noindex, nofollow, noarchive`; a busca pública não apresentou essas rotas entre os resultados indexados.
- Cookies administrativos usam `HttpOnly`, `Secure` em produção e `SameSite=Strict`.

### Base de dados e Storage

- Teste real com a chave pública confirmou que escrita anónima em `ancaf_configs` é bloqueada.
- Teste real confirmou que `ancaf_profiles` não é legível anonimamente.
- As tabelas têm RLS e a escrita está reservada à `service_role`.
- A leitura pública de `ancaf_configs` estava aberta a qualquer chave, incluindo futuras configurações operacionais. Foi criada uma migração que libera apenas `active_calendar_*`, `override_*` e os logótipos públicos.
- O bucket de logótipos é público apenas para leitura; escrita, atualização e remoção ficam reservadas à `service_role`.
- Uploads SVG foram desativados para evitar conteúdo ativo. Permanecem PNG, JPEG, WebP e GIF com limite de tamanho.

### Injeção, APIs e rede

- Não foram encontradas queries SQL montadas por concatenação; o projeto usa o query builder do Supabase.
- Não foram encontrados `eval` ou execução de comandos baseada em entrada pública na aplicação.
- Pedidos administrativos de browser vindos de outra origem agora recebem `403` (proteção CSRF).
- Login: limite local de 5 tentativas por 15 minutos; o sexto pedido testado recebeu `429` com `Retry-After`.
- Sincronização ANCAF: limite local de 30 pedidos por 15 minutos e comparação do token em tempo constante.
- Não há CORS `*` configurado nas APIs.
- CSP, HSTS, proteção contra framing, `nosniff`, política de referência e política de permissões foram confirmadas em produção.

### Dependências

- Antes da correção, `npm audit` encontrou 7 vulnerabilidades, 6 de severidade alta, incluindo Next.js, Sharp, PostCSS e NanoID.
- Next.js e a cadeia de build foram atualizados para versões corrigidas.
- Resultado final de `npm audit`: 0 vulnerabilidades.
- Build de produção e TypeScript concluíram com sucesso.

## Testes de autorização realizados

- Login administrador válido: `200`.
- Administrador autenticado chegou à validação do conteúdo de publicação: `400` para secção propositalmente inválida.
- Login direção de clube válido: `200`.
- Direção de clube tentando publicar conteúdo administrativo: `401`.
- Direção de clube consultando FIFA Connect: `200`.
- Login enviado por origem externa: `403`.
- Rotas de escrita em produção sem sessão: todas responderam `401`.
- Código padrão antigo em produção: rejeitado com `401`.

## Configurações operacionais ainda necessárias

1. Gerar um `ANCAF_SYNC_TOKEN` aleatório e independente, atualizá-lo na Vercel e no emissor FAF Calendar, e revogar o valor reutilizado.
2. Configurar `CLUB_DIRECTION_PASSCODE` na Vercel com valor diferente de `ADMIN_WRITE_PASSCODE`.
3. Configurar preferencialmente `ADMIN_SESSION_SECRET` para permitir rotação de sessões separada das palavras-passe.
4. Aplicar `supabase/migrations/20260824060000_restrict_public_config_rows.sql` ao projeto Supabase.
5. Ativar rate limiting distribuído no WAF/Vercel para complementar o limite em memória das funções serverless.
6. Confirmar backups automáticos do Supabase e documentar responsáveis, prazos e canais do plano de resposta a incidentes.

## Estado de publicação

As correções foram preparadas e validadas no workspace em 24 de agosto de 2026. O histórico Git e a Vercel devem ser consultados para confirmar o estado de publicação posterior a esta auditoria.
