# Atualização completa de uma jornada

O ficheiro padrão é `public/templates/modelo_atualizacao_jornada.json`.
Cada importação deve usar o jogo (`id`) como chave única e nunca deve criar
valores que não estejam presentes numa ficha ou fonte confirmada.

## O que muda automaticamente

| Informação recebida | Áreas atualizadas |
| --- | --- |
| Estado, data, hora, estádio e transmissão | Página inicial, calendário, lista e detalhe do jogo, páginas dos clubes |
| Resultado final | Página inicial, calendário, detalhe, classificação geral/casa/fora, forma, jogos disputados, golos marcados |
| Eventos de golo | Detalhe, cronologia, goleadores e números individuais |
| Cartões | Detalhe, disciplina individual e totais do clube |
| Estatísticas da equipa | Comparativo do jogo e estatísticas da competição |
| Arbitragem | Ficha do jogo e nomeações |
| Convocados/onzes | Ficha do jogo e utilização dos jogadores |

## Regras de consistência

1. A classificação nunca é digitada no JSON; é calculada apenas com jogos terminados.
2. Um resultado sem autores dos golos atualiza a classificação, mas não altera os goleadores.
3. Campos desconhecidos ficam `null` ou em listas vazias; não se estimam valores.
4. Jogos antecipados mantêm a jornada oficial, mas não mudam indevidamente a jornada mostrada na página inicial.
5. Os identificadores de clube e de jogo devem existir no calendário oficial.
6. A soma dos eventos de golo, quando completa, deve coincidir com o resultado final.
7. Cartões e estatísticas só são publicados quando a fonte os apresenta explicitamente.

## Verificação depois de importar

- Confirmar o resultado na página inicial, calendário e detalhe do jogo.
- Confirmar jogos, vitórias, empates, derrotas, golos, diferença e pontos na classificação.
- Confirmar forma recente e números dos dois clubes.
- Confirmar goleadores e disciplina somente quando os jogadores foram identificados.
- Confirmar que a jornada predefinida da página inicial corresponde ao jogo terminado mais recente.
- Executar lint, TypeScript e compilação de produção antes da publicação.
