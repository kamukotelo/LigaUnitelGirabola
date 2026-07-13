# Google Form inteligente de futebol

Este projeto cria um Google Form baseado na planilha `planilha_inteligente_futebol.xlsx`.

## O que o formulario faz

- Permite escolher entre `Novo jogador` e `Estatisticas de jogador`.
- Mostra apenas os campos correspondentes ao tipo de registo escolhido.
- Usa listas de selecao para posicao, pe preferido, nacionalidade, epoca e competicao.
- Valida numeros como camisola, altura, peso, minutos, golos, assists e rating.
- Cria uma planilha Google com abas separadas:
  - `Dados_Pessoais`
  - `Estatisticas`
  - `Listas`
- Calcula automaticamente:
  - `Golos_por_90`
  - `Contribuicoes_G_A`

## Como criar no Google

1. Abra https://script.google.com
2. Clique em `Novo projeto`.
3. Apague o codigo inicial.
4. Cole o conteudo do ficheiro `google_form_futebol_inteligente.gs`.
5. Salve o projeto.
6. No seletor de funcoes, escolha `criarFormularioFutebolInteligente`.
7. Clique em `Executar`.
8. Autorize as permissoes solicitadas pelo Google.
9. Abra `Ver > Registros` para ver:
   - link publico do formulario
   - link de edicao do formulario
   - link da planilha de respostas

## Observacao

O Google vai criar tambem uma aba automatica chamada algo como `Form Responses 1`.
Pode deixar essa aba como historico bruto. As abas `Dados_Pessoais` e `Estatisticas` sao as abas organizadas pelo script.
