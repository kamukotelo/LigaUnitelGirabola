# Liga Unitel Girabola — regras do repositório

Estas regras valem para qualquer pessoa ou IA (Claude, Codex, …) que altere este
site. Resultam de problemas reais em produção; os testes do build bloqueiam o
deploy quando uma delas é violada.

## Publicação

- **Só existe um branch de produção: `main`.** A Vercel publica
  ligaunitelgirabola.com a partir dele. Não trabalhar noutro branch "principal"
  nem copiar o mesmo commit para vários branches (gera deploys duplicados).
- O build da Vercel é `npm run build`, que corre `npm run test:regressions`
  antes do `next build`. **Um deploy com testes a falhar não chega ao site.**
  Depois de cada push, confirmar em Vercel → Deployments que o deploy de
  Production ficou `Ready`; um `Error` significa que o site continua na versão
  anterior.
- Antes de enviar: `npm run test:regressions` e `npx tsc --noEmit -p .`.
- **Scripts novos em `scripts/` usados no build têm de ser acrescentados ao
  `.vercelignore`** (`!/scripts/<ficheiro>`). O `.vercelignore` exclui a pasta e
  o teste `test-portal-regressions` falha se faltar a exceção.
- `src/lib/platform-build-info.ts` é reescrito por cada build local: não o
  gravar.
- **Emblemas dos clubes** (`src/lib/team-crests.ts`) estão fixados por SHA-256
  em `scripts/verify-brand-assets.mjs`; só se trocam com o emblema enviado pela
  DCE/ANCAF ou pelo clube. Emblemas já publicados por engano ficam em
  `FORBIDDEN_CRESTS` e o build falha se voltarem (ex.: Kabuscorp "Sambizanga";
  o oficial é o Kabuscorp Sport Club do Palanca, confirmado a 07/10/2026).

## Calendário, horas e estádios

- **Fonte única de cada jogo: `src/data/jogos/2026-27/<id>.ts`.** Ver
  `src/data/jogos/LEIA-ME.md`. Editar o ficheiro e correr
  `npm run jogos -- publicar` (ou `sincronizar` + testes).
- Só se muda data, hora, estádio ou transmissão a partir de um **comunicado ou
  mapa oficial da ANCAF**. Um jogo por disputar com
  `scheduleStatus: 'official'` **tem de** ter `schedule.source` com esse
  documento; sem documento, fica `'provisional'`.
- **Estádios:** a lista oficial é `HOME_STADIUMS_2026_27` em `src/lib/data.ts`
  (um estádio da casa por equipa). Os jogos por disputar usam o estádio da
  equipa da casa; qualquer outro exige `schedule.stadiumException` com motivo e
  fonte. A ficha do clube (`TEAMS[].stadium`) tem de ser igual ao estádio da
  casa. O painel só oferece os estádios da lista.
- Jogos **já disputados** nunca são alterados por uma mudança de calendário:
  ficam como o relatório do árbitro os registou.
- As edições do painel `/adminancaf2026` **não** mudam data, hora, estádio nem
  transmissão de jogos com registo — o registo manda (`withoutRecordSchedule`).
- **Bloqueios do painel** (`src/lib/admin-match-locks.ts`), aplicados na
  interface e de novo no servidor (`/api/admin/overrides`,
  `/api/admin/match-operations`, `/api/fcms/sync`):
  - jornada e equipas nunca mudam no painel (sorteio oficial);
  - data, hora, estádio e transmissão de jogos com registo aparecem só de
    leitura, com a fonte; um pedido que os tente mudar é recusado (422
    `locked_fields`);
  - o resultado de um jogo encerrado (registo com `result.status: 'finished'`)
    só muda com motivo (422 `reason_required`), guardado no histórico
    (`ancaf_match_audit_log.after_data.correction_reason`).
  Não remover estes bloqueios: `scripts/test-admin-locks.mts` e
  `test-portal-regressions` falham o deploy.
- Ao receber um mapa novo: comparar jogo a jogo com os registos, aplicar só as
  diferenças, e reportar o que o mapa tem de incoerente (ex.: dia da semana que
  não bate com a data) em vez de adivinhar.
- `src/lib/published-ancaf-calendar.ts` é a cópia do sorteio recebido: não se
  edita para mudar agendas.

## Validação

`npm run jogos -- validar` recusa, entre outros:
- jogo oficial por disputar sem `source`;
- estádio fora da lista oficial, ou diferente do da casa sem `stadiumException`;
- ficha de clube com estádio diferente do da casa;
- dois jogos oficiais no mesmo estádio com menos de 3 h de intervalo;
- `broadcaster` com "Rádio 5" (a Rádio 5 é a transmissão por omissão);
- golos dos eventos que não batem com o resultado.
