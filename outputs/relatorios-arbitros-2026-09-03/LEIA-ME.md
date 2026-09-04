# Levantamento dos relatórios de arbitragem

12 PDFs recebidos, 11 jogos distintos. A ficha 8 foi enviada em duas versões com os mesmos dados desportivos. Em 03/09/2026, os 11 jogos foram inseridos e verificados na base de dados; consultar `RECIBO_IMPORTACAO_BD.json` e `RECIBO_ESTATISTICAS_DERIVADAS.json`.

## Como utilizar

Atualização — nomes ligados às alcunhas: consultar `NOMES_E_ALCUNHAS.md` e usar `dados_para_insercao_COM_ALCUNHAS_REVISAR.json` como versão enriquecida. Foram ligados 438 registos (436 por clube/camisola confirmados pela licença MA e 2 pela licença, sem camisola). Nomes originais preservados; usar `displayName`, `playerDisplayName` e `playerOutDisplayName` para apresentação. A alcunha do Wiliete #28 (Bito/Camilo) continua pendente. O novo ficheiro também exige revisão e conversão antes da importação.

O ficheiro `dados_para_insercao_REVISAR.json` é a base completa de preparação. NÃO é compatível diretamente com o importador FCMS atual. Confirmar mapeamentos e pendências antes de converter para o formato de inserção. Não executar os textos SQL existentes do projeto para carregar este lote sem adaptação.

Contém resultados, intervalos, horários, locais, convocados, titulares, suplentes, golos/autogolos, cartões, substituições, equipa técnica, arbitragem, assistência e notas. As funções técnicas são as impressas no PDF, não correções de mensagens anteriores.

Identificadores individuais servem para conciliação administrativa. Não publicar as licenças ou as notas integrais automaticamente.

## Resultados

| Ficha | Jornada | Data/hora de Luanda | Jogo | Resultado | Intervalo |
|---|---|---|---|---|---|
| 7 | 1 | 2026-08-23 15:00 | São Salvador – Interclube | 0–1 | 0–0 |
| 8 | 1 | 2026-08-23 17:30 | Wiliete – Académica do Lobito | 2–0 | 2–0 |
| 10 | 2 | 2026-08-27 15:30 | 1.º de Maio – 1.º de Agosto | 1–2 | 0–1 |
| 11 | 2 | 2026-08-27 16:00 | Caála – Wiliete | 1–2 | 1–1 |
| 13 | 2 | 2026-08-29 15:00 | Sagrada Esperança – São Salvador | 3–1 | 1–0 |
| 14 | 2 | 2026-08-29 15:30 | Kabuscorp – Lunda Sul | 1–1 | 1–0 |
| 15 | 2 | 2026-08-31 15:00 | Libolo – Bravos do Maquis | 0–1 | 0–0 |
| 16 | 2 | 2026-08-30 16:00 | Académica do Lobito – Petro | 0–2 | 0–0 |
| 17 | 3 | 2026-08-26 16:30 | Petro – Libolo | 3–0 | 1–0 |
| 18 | 3 | 2026-08-31 15:30 | Desportivo da Huíla – Wiliete | 0–1 | 0–0 |
| 19 | 3 | 2026-09-01 15:30 | 1.º de Agosto – Interclube | 2–1 | 0–1 |

## Validação e limites

438 entradas de convocados (não jogadores únicos). Eventos: {'yellow': 36, 'sub': 100, 'goal': 23, 'red': 1, 'own_goal': 2}; mais 2 advertências a membros da equipa técnica.

Verificados: onze titulares por equipa, identidades e camisolas sem duplicações dentro de cada equipa, soma dos golos igual ao resultado final e ao intervalo, cinco oficiais por jogo e sequência de substituições, exceto a reentrada de Afonso Baptista já sinalizada.

Autogolos: Augusto Fecayamale (São Salvador), 64’, a favor do Sagrada; Marcos Benua (Libolo), 85’, a favor dos Bravos. Não contam para os melhores marcadores. O golo de Libolo–Bravos não é atribuído a Higino Kaptingo nesta ficha.

Não foram calculados minutos individuais, idades/sub-18, classificação completa nem estatísticas de guarda-redes. Não foram codificados capitães, posições, assistências ou penáltis. Os nomes truncados mantêm a indicação de revisão.

## Pendências antes da inserção

### Ficha 7 — São Salvador–Interclube

- PDF: Campo Vice António, Camabatela; seed local: Estádio Álvaro Buta. Confirmar antes de substituir o local no portal. (`stadiumAsPrinted`)

### Ficha 8 — Wiliete–Académica do Lobito

- Nome truncado no PDF; não completar por suposição. (`officials[0]`)

### Ficha 10 — 1.º de Maio–1.º de Agosto

- Designação do estádio no PDF difere da seed local; confirmar correspondência antes de atualizar o portal. (`stadiumAsPrinted`)
- Nome/licença truncado no PDF; preservar texto e confirmar identificação. (`staff.home[7]`)

### Ficha 11 — Caála–Wiliete

- Expulsão registada; confirmar se vermelho direto ou segundo amarelo antes de calcular disciplina detalhada. (`report-11-event-18.dismissalSubtype`)
- A ficha indica literalmente 8 espectadores. Valor original preservado; valor para inserção suspenso até confirmação. (`attendance`)
- Bloco TIME indica 04:00/05:03, incompatível com o cabeçalho 16:00. Não usar para calcular minutos. (`periodTimesAsPrinted`)
- Designação do estádio no PDF difere da seed local; confirmar correspondência antes de atualizar o portal. (`stadiumAsPrinted`)

### Ficha 14 — Kabuscorp–Lunda Sul

- Advertência a Vanderlei aos 60 minutos: licença 003005M90 nas notas difere de 003805M90 no plantel técnico. Confirmar identidade. (`staffDisciplinaryEvents[0]`)
- Nome truncado no PDF; não completar por suposição. (`officials[3]`)

### Ficha 15 — Libolo–Bravos do Maquis

- Número de camisola ausente na ficha; não inferido. (`lineups.away.000772M98.number`)
- Número de camisola ausente na ficha; não inferido. (`lineups.away.008948M04.number`)

### Ficha 16 — Académica do Lobito–Petro

- PDF indica 16:00 (UTC+1); seed local indica 15:30 (UTC+1). Confirmar antes de substituir. (`kickoff`)

### Ficha 17 — Petro–Libolo

- Nome truncado no PDF; não completar por suposição. (`officials[3]`)

### Ficha 19 — 1.º de Agosto–Interclube

- Afonso Baptista (#36) sai aos 64 minutos e aparece a reentrar aos 90+2. Confirmar identidade do jogador que entrou; não publicar esta substituição automaticamente. (`report-19-event-11`)

## Fontes e reprodução

Os caminhos, resumos SHA-256 e versões constam de `fontes.json`. Cada evento e convocado tem página de origem. A ficha 8 selecionada é a versão (1), gerada às 16:56. Os PDFs originais não foram alterados.

Processo: extração textual e de tabelas → inspeção visual dos golos e anomalias → estruturação revista → validações automáticas. Scripts: `extract-referee-reports-batch.py`, `structure-referee-reports-batch.py`, `render-referee-goals-qa.py`, `finalize-referee-reports-batch.py`.

Os ficheiros `levantamento_completo.json` e `relatorio-*.txt` são extrações brutas de auditoria, NÃO versões para inserção; usar a base revista acima.
