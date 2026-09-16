# Registos de jogo

Cada jogo da Liga Unitel Girabola 2026/27 tem **um único ficheiro**:
`src/data/jogos/2026-27/<id>.ts`. Tudo o que o portal mostra sobre esse jogo sai
daí — calendário, página inicial, hub da competição, ficha de jogo, API
`/api/ancaf`, classificação, marcadores, disciplina, minutos, páginas de
jogador e de clube, e os seeds SQL da base de dados.

## Atualizar um jogo

```bash
npm run jogos -- procurar wiliete libolo   # encontra o id e o ficheiro
npm run jogos -- ver m27-5-6               # mostra o jogo como o portal o apresenta
# … editar src/data/jogos/2026-27/m27-5-6.ts …
npm run jogos -- publicar                  # sincroniza, valida, testa, mostra o impacto e publica
```

`publicar` só grava depois de confirmares o impacto (`s`). Publica apenas os
ficheiros de `src/data/jogos/` e `supabase/seed/`; qualquer outra alteração no
teu computador fica de fora.

## Campos

| Campo | Quando preencher |
|---|---|
| `schedule.date` | Sempre, com fuso: `'2026-09-20T17:15:00+01:00'` (hora de Luanda). |
| `schedule.stadium` | Sempre. |
| `schedule.scheduleStatus` | `'official'` depois de sair em comunicado/mapa oficial; senão `'provisional'`. |
| `schedule.broadcaster` | **Só transmissões televisivas** (ex.: `'Zsports'`). Sem este campo o jogo aparece como Rádio 5 — nunca escrever `'Rádio 5'`, senão aparece "Em direto · Rádio 5". |
| `result` | Quando o jogo começa. `status: 'live'` durante o jogo, `'finished'` no fim. `updatedAt` é o instante da confirmação e alimenta "atualizado em". |
| `officials` | Árbitro, assistentes, 4.º árbitro e delegado (`commissioner`). |
| `coaches`, `lineups` | Da ficha oficial. A camisola (`number`) liga cada entrada ao plantel. |
| `events` | Golos, cartões e substituições. `team` é a equipa beneficiada; num autogolo usar `ownGoal: true`. |
| `stats` | Só métricas publicadas na ficha; `keys` lista as que existem. |

## O que é calculado (não editar à mão)

- `2026-27/index.ts` — lista dos ficheiros.
- `2026-27/derivados.ts` — marcadores (golos e jogos), cartões por jogador e autogolos, calculados a partir dos eventos e escalações.
- `supabase/seed/*.sql` — gerados por `scripts/generate-db-seed.mts`.

`npm run jogos -- sincronizar` regenera os três. O build da Vercel corre
`scripts/test-match-records.mts` e **falha** se algum estiver desatualizado ou
se um registo tiver erros (golos que não batem com o resultado, jornada ou
equipas diferentes do sorteio, datas inválidas, `broadcaster` com Rádio 5…).

Exceções que nenhuma ficha comprova ficam em `2026-27/ajustes.ts`, comentadas.

## Camadas por cima dos registos

O painel `/adminancaf2026` e a base de dados continuam a poder sobrepor-se a um
registo (o administrador tem a última palavra). Quando a base de dados voltar a
estar ativa, confirmar que não há sobreposições antigas em conflito.

`src/lib/published-ancaf-calendar.ts` guarda o sorteio original recebido do FAF
Calendar (usado para validar os confrontos e a impressão digital da API); as
datas em vigor são as dos registos.
