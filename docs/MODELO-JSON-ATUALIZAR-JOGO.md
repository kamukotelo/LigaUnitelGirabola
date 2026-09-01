# Modelo JSON — atualização de um jogo

Cola este JSON no chat quando quiseres que eu (Claude) atualize um jogo. **Não é
lido por nenhum sistema automático** — serve só para me dares os dados de forma
estruturada; eu depois traduzo para código / base de dados e faço commit + deploy.

Regra geral: **campos a `null` ou ausentes = "não sei", não são publicados**. Nunca
invento marcadores, cartões, minutos ou estatísticas que não estejam aqui.

```json
{
  "match_id": "m27-3-6",
  "fonte": "Sofascore",
  "data_confirmacao": "2026-09-01T18:00:00+01:00",

  "resultado": {
    "casa": 2,
    "fora": 1,
    "intervalo": "0-1",
    "estado": "finished"
  },

  "agenda": {
    "data_hora": "2026-09-01T15:30:00+01:00",
    "estadio": null,
    "transmissao": "Zsports",
    "publico": null,
    "tempo_util_minutos": null
  },

  "treinadores": { "casa": "Filipe Nzanza", "fora": "Divaldo Alves" },

  "arbitragem": {
    "principal": "Edson Esoko",
    "assistente1": "Jerson Emiliano",
    "assistente2": "Estanislau Prata",
    "quarto": "Sandra Kitu"
  },

  "eventos": [
    { "minuto": 45, "acrescimo": 5, "tipo": "golo", "equipa": "fora", "jogador": "Alexandre Fernando", "penalti": true, "placar": "0-1" },
    { "minuto": 79, "tipo": "golo", "equipa": "casa", "jogador": "Dagó Tshibamba", "placar": "1-1" },
    { "minuto": 90, "tipo": "golo", "equipa": "casa", "jogador": "Calebi Yanda", "placar": "2-1" },
    { "minuto": 61, "tipo": "amarelo", "equipa": "casa", "jogador": "Núrio Fortuna", "motivo": null },
    { "minuto": 65, "tipo": "substituicao", "equipa": "casa", "jogador": "António Hossi", "jogador_sai": "Núrio Fortuna" }
  ],

  "estatisticas": {
    "casa": { "posse": null, "remates": null, "remates_baliza": null, "cantos": 4, "faltas": null, "foras_de_jogo": null, "amarelos": 2, "vermelhos": 0, "passes": null, "precisao_passe": null, "defesas": null },
    "fora": { "posse": null, "remates": null, "remates_baliza": null, "cantos": 4, "faltas": null, "foras_de_jogo": null, "amarelos": 1, "vermelhos": 0, "passes": null, "precisao_passe": null, "defesas": null }
  },

  "notas": "texto livre — não é publicado"
}
```

## Campos

| Campo | Uso |
|---|---|
| `match_id` | **Obrigatório.** ID interno (`m27-<jornada>-<n>`). Se não souberes, dá as equipas + jornada e eu procuro. |
| `resultado.casa` / `.fora` | Golos finais. |
| `resultado.intervalo` | `"H-A"` ao intervalo, ou `null`. |
| `resultado.estado` | `scheduled` \| `live` \| `finished`. |
| `agenda.*` | Só o que mudou. `estadio: null` = mantém o oficial. |
| `treinadores` | Nome tal como sai na ficha. |
| `arbitragem` | Vai para `ancaf_referee_nominations`. |
| `eventos[]` | Ver abaixo. **A cronologia e os goleadores saem daqui.** |
| `estatisticas` | Só as métricas que a fonte mostra. As outras ficam `null` e não aparecem. |
| `notas` | Contexto para mim. Nunca publicado. |

### `eventos[]`

| Chave | Notas |
|---|---|
| `tipo` | `golo` \| `penalti` \| `autogolo` \| `amarelo` \| `vermelho` \| `substituicao` \| `aviso` |
| `equipa` | `casa` \| `fora` |
| `minuto` | Inteiro. `null` = minuto por confirmar (aparece no topo, sem minuto inventado). |
| `acrescimo` | Opcional, minutos de compensação (`45+5` → `minuto: 45, acrescimo: 5`). |
| `jogador` | Nome. Eu tento ligar ao plantel oficial pelo nome/maId; se não existir, entra sem ficha (como "Alexandre Fernando"). |
| `jogador_sai` | Só em `substituicao`. |
| `penalti` | `true` marca o golo como grande penalidade. |
| `motivo` | Opcional, texto do cartão. |
| `placar` | Opcional, placar após o golo (`"1-1"`). Ajuda-me a validar. |

## O que o site IGNORA (não há campo)

- **Odds / probabilidades de casas de apostas**
- **Votação / enquete "quem vai ganhar"**
- **Classificação** — é sempre **recalculada** a partir dos resultados. Não a envies.
- **Golos / disciplina por identificar** — se não deres o nome do jogador, o golo/cartão
  conta no total do jogo mas fica "por identificar" na reconciliação. É o comportamento correto.
- **"Tiros de meta" (goal kicks)** — não é o mesmo que defesas; sem campo próprio.

## Para onde é que isto vai, afinal

| Dado | Destino hoje |
|---|---|
| Resultado, intervalo, estado, data | `src/lib/data.ts` (`PLATFORM_CONFIRMED_RESULTS`) **+** tabela `ancaf_matches` |
| Eventos / cronologia | `src/lib/data.ts` (`getPublishedMatchEvents`) — código, precisa deploy |
| Goleadores | `src/lib/data.ts` (`CURRENT_SEASON_SCORERS`) — código, precisa deploy |
| Estatísticas do jogo | `src/lib/data.ts` (`PUBLISHED_MATCH_STATS`) — código, precisa deploy |
| Treinadores | `src/lib/data.ts` (`PUBLISHED_MATCH_COACHES`) + `ancaf_match_lineups.coach` |
| Arbitragem | tabela `ancaf_referee_nominations` (aparece sem deploy, via Realtime) |
| Escalações | tabela `ancaf_match_lineups` (aparece sem deploy) |
