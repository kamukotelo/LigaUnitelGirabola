#!/usr/bin/env python3
"""
Gerador do FICHEIRO PADRÃO DE JORNADA do Girabola (Liga Unitel).

Produz dois ficheiros com exatamente a mesma estrutura:
  • public/templates/girabola_modelo_rodada_exemplo.xlsx   → preenchido com a 1.ª jornada oficial
  • public/templates/girabola_modelo_rodada_em_branco.xlsx → apenas cabeçalhos e validações

O ficheiro cobre toda a inserção e atualização de uma jornada:
  1. Instrucoes            → guia de preenchimento
  2. Jogos_Resultados      → agenda, resultado, estádio, transmissão, assistência, tempo útil
  3. Eventos_Ocorrencias   → golos, cartões e substituições
  4. Estatisticas_Equipa   → métricas por equipa (só o que consta na ficha oficial)
  5. Arbitragem            → equipa de arbitragem
  6. Onzes_Convocatorias   → onze inicial e suplentes
  7. Clubes_Referencia     → nomes e IDs aceites pelo importador

Regra editorial da plataforma: célula vazia = dado ainda não publicado oficialmente.
Nunca preencher com estimativas.

Uso:  python3 scripts/gerar_template_excel.py
"""

import os

import openpyxl
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

DESTINO = "public/templates"

# ---------------------------------------------------------------------------
# ESTILOS
# ---------------------------------------------------------------------------
COR_CABECALHO_BG = "1A2332"   # Dark Navy
COR_CABECALHO_FG = "FFCC00"   # Dourado Girabola
COR_BORDA = "D0D7DE"
COR_TITULO = "0F1720"

FONTE_CABECALHO = Font(name="Arial", size=11, bold=True, color=COR_CABECALHO_FG)
FILL_CABECALHO = PatternFill(start_color=COR_CABECALHO_BG, end_color=COR_CABECALHO_BG, fill_type="solid")
FONTE_DADOS = Font(name="Arial", size=10)
FONTE_TITULO = Font(name="Arial", size=14, bold=True, color=COR_TITULO)
FONTE_NOTA = Font(name="Arial", size=10, italic=True, color="5A6672")

BORDA = Border(
    left=Side(style="thin", color=COR_BORDA),
    right=Side(style="thin", color=COR_BORDA),
    top=Side(style="thin", color=COR_BORDA),
    bottom=Side(style="thin", color=COR_BORDA),
)

AL_CENTRO = Alignment(horizontal="center", vertical="center")
AL_ESQUERDA = Alignment(horizontal="left", vertical="center")

# ---------------------------------------------------------------------------
# CLUBES (ID do sistema = o que a plataforma usa internamente)
# ---------------------------------------------------------------------------
CLUBES = [
    ["petro", "Petro Atlético de Luanda", "Petro de Luanda", "PET", "Estádio 11 de Novembro"],
    ["dago", "Clube Desportivo 1.º de Agosto", "CD 1.º de Agosto", "PRI", "Estádio França N’dalu"],
    ["sagrada", "Grupo Desportivo Sagrada Esperança", "Sagrada Esperança", "SAG", "Estádio Sagrada Esperança"],
    ["lundasul", "Clube Desportivo da Lunda Sul", "Desportivo da Lunda Sul", "LSU", "Estádio do Sagrada Esperança"],
    ["interclube", "Grupo Desportivo Interclube", "GD Interclube", "INT", "Estádio 22 de Junho"],
    ["kabuscorp", "Kabuscorp Sport Clube do Palanca", "Kabuscorp SC", "KAB", "Estádio dos Coqueiros"],
    ["wiliete", "Wiliete Sport Clube de Benguela", "Wiliete de Benguela", "WIL", "Estádio Nacional de Ombaka"],
    ["bravos", "Futebol Clube Bravos do Maquis", "Bravos do Maquis", "BMA", "Estádio Mundunduleno"],
    ["desphuila", "Clube Desportivo da Huíla", "Desportivo da Huíla", "CDH", "Estádio da Tundavala"],
    ["lobito", "Académica Petróleos do Lobito", "Académica do Lobito", "ACA", "Estádio do Buraco"],
    ["saosalvador", "São Salvador Futebol Clube do Kongo", "São Salvador", "SSA", "Estádio Álvaro Buta"],
    ["primeiromaio", "Estrela Clube 1.º de Maio de Benguela", "Estrela 1.º de Maio", "MAI", "Estádio de São Filipe"],
    ["libolo", "Clube Recreativo Desportivo do Libolo", "Recreativo do Libolo", "LIB", "Estádio Municipal de Calulo"],
    ["caala", "Clube Recreativo da Caála", "CR Caála", "CAA", "Estádio dos Mártires da Canhala"],
    ["fcluanda", "Futebol Clube de Luanda", "FC Luanda", "FCL", "Estádio França N’dalu"],
    ["cabinda", "Futebol Clube de Cabinda", "FC Cabinda", "CAB", "Estádio Vici António"],
]

# ---------------------------------------------------------------------------
# ESTRUTURA DAS ABAS
# As 10 primeiras colunas de Jogos_Resultados e as 9 primeiras de
# Eventos_Ocorrencias mantêm-se fixas (compatibilidade com importações antigas).
# ---------------------------------------------------------------------------
COLUNAS_JOGOS = [
    "Jornada", "Data (AAAA-MM-DD)", "Hora (HH:MM)", "Equipa_Casa",
    "Golos_Casa", "Golos_Fora", "Equipa_Fora", "Estadio",
    "Transmissao", "Status (finished/scheduled/live)",
    "Estado_Agenda (official/provisional)", "Arbitro_Principal",
    "Assistencia", "Tempo_Util_Min", "ID_Jogo (opcional)", "Observacoes",
]

COLUNAS_EVENTOS = [
    "Jornada", "Equipa_Casa", "Equipa_Fora", "Minuto",
    "Tipo_Evento (GOLO/AMARELO/VERMELHO/ADVERTENCIA/SUB)", "Equipa_Infracao (CASA/FORA)",
    "Camisola", "Nome_Jogador", "Detalhe_Motivo",
    "Jogador_Saiu (apenas SUB)", "Assistencia_Golo",
]

COLUNAS_ESTATISTICAS = [
    "Jornada", "Equipa_Casa", "Equipa_Fora", "Lado (CASA/FORA)",
    "Posse_%", "Remates", "Remates_a_Baliza", "Cantos", "Faltas",
    "Foras_de_Jogo", "Amarelos", "Vermelhos", "Passes",
    "Precisao_Passe_%", "Defesas",
]

COLUNAS_ARBITRAGEM = [
    "Jornada", "Equipa_Casa", "Equipa_Fora", "Arbitro_Principal",
    "Assistente_1", "Assistente_2", "Quarto_Arbitro",
]

COLUNAS_ONZES = [
    "Jornada", "Equipa_Casa", "Equipa_Fora", "Lado (CASA/FORA)",
    "Camisola", "Nome_Jogador", "Posicao (GK/DEF/MID/FWD)",
    "Titular (SIM/NAO)", "Formacao",
]

COLUNAS_CLUBES = ["ID_Sistema", "Nome_Oficial", "Nome_Curto", "Sigla", "Estadio_Padrao"]

# Colunas alinhadas ao centro em cada aba (as restantes ficam à esquerda)
CENTRO_JOGOS = {1, 2, 3, 5, 6, 9, 10, 11, 13, 14}
CENTRO_EVENTOS = {1, 4, 5, 6, 7}
CENTRO_ESTATISTICAS = {1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}
CENTRO_ARBITRAGEM = {1}
CENTRO_ONZES = {1, 4, 5, 7, 8, 9}
CENTRO_CLUBES = {1, 4}

# ---------------------------------------------------------------------------
# DADOS OFICIAIS DA 1.ª JORNADA (usados apenas no modelo de exemplo)
# Fonte: fichas de jogo oficiais publicadas. Campos sem fonte ficam vazios.
# ---------------------------------------------------------------------------
EXEMPLO_JOGOS = [
    [1, "2026-08-21", "15:00", "Desportivo da Lunda Sul", 0, 0, "Petro de Luanda",
     "Estádio do Sagrada Esperança", "Zsports", "finished", "official",
     "Miguel Tchissingu Augusto Américo", None, None, "m27-1-4", ""],
    [1, "2026-08-22", "15:00", "FC Cabinda", 0, 3, "Recreativo do Libolo",
     "Estádio Vici António", "Rádio 5", "finished", "official",
     "Nelson João Milagre", None, None, "m27-1-7", ""],
    [1, "2026-08-22", "15:00", "Bravos do Maquis", 3, 0, "Sagrada Esperança",
     "Estádio Mundunduleno", "Rádio 5", "finished", "official",
     "Sanda Mateus Miguel Kitu", None, None, "m27-1-2", ""],
    [1, "2026-08-22", "15:00", "CD 1.º de Agosto", 1, 0, "Desportivo da Huíla",
     "Estádio França N’dalu", "Zsports", "finished", "official",
     "Edilson Roberto Gomes André", None, None, "m27-1-3", ""],
    [1, "2026-08-23", "15:00", "FC Luanda", 0, 0, "CR Caála",
     "Estádio França N’dalu", "Rádio 5", "finished", "official", "", None, None, "m27-1-1", ""],
    [1, "2026-08-23", "15:00", "São Salvador", 0, 1, "GD Interclube",
     "Estádio Álvaro Buta", "Rádio 5", "finished", "official", "", None, None, "m27-1-8", ""],
    [1, "2026-08-23", "15:00", "Estrela 1.º de Maio", 1, 1, "Kabuscorp SC",
     "Estádio de São Filipe", "Rádio 5", "finished", "official", "", None, None, "m27-1-6", ""],
    [1, "2026-08-23", "17:30", "Wiliete de Benguela", 2, 0, "Académica do Lobito",
     "Estádio Nacional de Ombaka", "Zsports", "finished", "official", "", None, None, "m27-1-5", ""],
]

_LS_PET = ("Desportivo da Lunda Sul", "Petro de Luanda")
_CAB_LIB = ("FC Cabinda", "Recreativo do Libolo")
_BRA_SAG = ("Bravos do Maquis", "Sagrada Esperança")
_AGO_HUI = ("CD 1.º de Agosto", "Desportivo da Huíla")
_LUA_CAA = ("FC Luanda", "CR Caála")
_SSA_INT = ("São Salvador", "GD Interclube")
_MAI_KAB = ("Estrela 1.º de Maio", "Kabuscorp SC")
_WIL_LOB = ("Wiliete de Benguela", "Académica do Lobito")

EXEMPLO_EVENTOS = [
    # Lunda Sul 0-0 Petro de Luanda
    [1, *_LS_PET, "28", "AMARELO", "CASA", 10, "Maranata Domingos Sicuba Vunge", "Rasteirou o adversário", "", ""],
    [1, *_LS_PET, "37", "AMARELO", "CASA", 6, "Elindo Wanga Paulino", "Rasteirou o adversário", "", ""],
    [1, *_LS_PET, "45", "SUB", "FORA", 33, "Ilídio Panda", "", "Ivan Cavaleiro", ""],
    [1, *_LS_PET, "45", "SUB", "CASA", 7, "Neymar", "", "Maranata", ""],
    [1, *_LS_PET, "53", "AMARELO", "FORA", 12, "Deybi Aldair Flores Flores", "Rasteirou o adversário", "", ""],
    [1, *_LS_PET, "60", "SUB", "FORA", 27, "António da Silva Chitanga Hossi", "", "Eddie Afonso", ""],
    [1, *_LS_PET, "60", "SUB", "FORA", 11, "Hélder Costa", "", "Pedro Aparício", ""],
    [1, *_LS_PET, "63", "AMARELO", "FORA", 27, "António da Silva Chitanga Hossi", "Protestou a decisão do árbitro", "", ""],
    [1, *_LS_PET, "65", "SUB", "CASA", 34, "Nicon", "", "Joca", ""],
    [1, *_LS_PET, "65", "SUB", "CASA", 17, "Jepson", "", "Mussá", ""],
    [1, *_LS_PET, "73", "SUB", "FORA", 29, "Depú", "", "Tiago Azulão", ""],
    [1, *_LS_PET, "73", "SUB", "FORA", 23, "Tiago Reis", "", "Jonathan Toro", ""],
    [1, *_LS_PET, "73", "SUB", "CASA", 33, "Zonzo", "", "Magrinho", ""],
    [1, *_LS_PET, "76", "AMARELO", "FORA", 13, "Bernardo Silva da Conceição", "Agarrou o adversário", "", ""],
    [1, *_LS_PET, "86", "AMARELO", "CASA", 16, "Domingos Ximba", "Protestar a decisão do árbitro", "", ""],
    [1, *_LS_PET, "90+5", "AMARELO", "CASA", 28, "João Ambrósio", "Agarrou o adversário", "", ""],

    # FC Cabinda 0-3 Recreativo do Libolo
    [1, *_CAB_LIB, "14", "AMARELO", "CASA", None, "Marcos", "", "", ""],
    [1, *_CAB_LIB, "27", "SUB", "CASA", None, "Brás", "", "José", ""],
    [1, *_CAB_LIB, "34", "GOLO", "FORA", 27, "Cuxixima", "0-1", "", ""],
    [1, *_CAB_LIB, "55", "AMARELO", "CASA", None, "António", "", "", ""],
    [1, *_CAB_LIB, "56", "SUB", "CASA", None, "Cornélio", "", "Gedeon", ""],
    [1, *_CAB_LIB, "66", "SUB", "CASA", None, "Costa", "", "Júlio", ""],
    [1, *_CAB_LIB, "70", "GOLO", "FORA", 17, "Pedro", "0-2", "", ""],
    [1, *_CAB_LIB, "70", "SUB", "FORA", None, "Zidane", "", "Pedro", ""],
    [1, *_CAB_LIB, "73", "GOLO", "FORA", 10, "Andeloy", "0-3", "", ""],
    [1, *_CAB_LIB, "76", "SUB", "FORA", None, "Miro", "", "Chimito", ""],
    [1, *_CAB_LIB, "76", "SUB", "FORA", None, "Catraio", "", "Maninho", ""],
    [1, *_CAB_LIB, "85", "SUB", "FORA", None, "Jamanta", "", "Andeloy", ""],

    # Bravos do Maquis 3-0 Sagrada Esperança (minutos dos golos por confirmar)
    [1, *_BRA_SAG, None, "GOLO", "CASA", 8, "Ju Cabral", "", "", ""],
    [1, *_BRA_SAG, None, "GOLO", "CASA", 23, "Lito", "", "", ""],
    [1, *_BRA_SAG, None, "GOLO", "CASA", 28, "Gladilson", "", "", ""],
    [1, *_BRA_SAG, "6", "VERMELHO", "FORA", 32, "Hahilo Sapalo Alberto", "Rasteirar o adversário", "", ""],
    [1, *_BRA_SAG, "45", "SUB", "CASA", None, "Higino", "", "Cueta", ""],
    [1, *_BRA_SAG, "45", "SUB", "CASA", None, "Tony", "", "Bani", ""],
    [1, *_BRA_SAG, "45", "SUB", "FORA", None, "Melono", "", "Dabanda", ""],
    [1, *_BRA_SAG, "45", "SUB", "FORA", None, "Guilherme", "", "Cahilo", ""],
    [1, *_BRA_SAG, "48", "ADVERTENCIA", "FORA", 5, "Miguel Anselmo Basilio Daniel", "Não respeitar a decisão do árbitro", "", ""],
    [1, *_BRA_SAG, "49", "AMARELO", "CASA", 8, "Eric Manuel Gouveia Cabral", "Tentar enganar o árbitro na área de penálte", "", ""],
    [1, *_BRA_SAG, "51", "ADVERTENCIA", "FORA", 16, "Filipe Pimpao", "Jogar à bola depois do árbitro apitar", "", ""],
    [1, *_BRA_SAG, "60", "SUB", "CASA", 28, "Gladilson", "", "Lito", ""],
    [1, *_BRA_SAG, "69", "SUB", "FORA", None, "Silvano", "", "Pimpão", ""],
    [1, *_BRA_SAG, "75", "SUB", "CASA", None, "Tiago", "", "Ju Cabral", ""],
    [1, *_BRA_SAG, "86", "VERMELHO", "CASA", 27, "Oliveira Antonio", "Rasteirar o adversário", "", ""],
    [1, *_BRA_SAG, "88", "SUB", "CASA", None, "Eduwine", "", "Jorginho", ""],

    # CD 1.º de Agosto 1-0 Desportivo da Huíla
    [1, *_AGO_HUI, "30", "AMARELO", "CASA", 17, "Samu Tshibamba Dago", "", "", ""],
    [1, *_AGO_HUI, "40", "AMARELO", "CASA", 3, "Simao Dianzenza", "", "", ""],
    [1, *_AGO_HUI, "52", "AMARELO", "FORA", 13, "Lucas Elias Antonio Paulo", "", "", ""],
    [1, *_AGO_HUI, "87", "AMARELO", "CASA", 15, "Venancio Landu Kukula", "", "", ""],
    [1, *_AGO_HUI, "90+2", "GOLO", "CASA", 9, "Dagó Tshibamba", "1-0", "", ""],

    # FC Luanda 0-0 CR Caála
    [1, *_LUA_CAA, "40", "AMARELO", "FORA", 23, "Lisneu Emanuel Neto Simao", "Rasteirou o adversário", "", ""],

    # São Salvador 0-1 GD Interclube
    [1, *_SSA_INT, "70", "GOLO", "FORA", 8, "Além", "0-1", "", ""],

    # Estrela 1.º de Maio 1-1 Kabuscorp SC
    [1, *_MAI_KAB, "23", "GOLO", "CASA", 10, "Deninho", "1-0", "", ""],
    [1, *_MAI_KAB, "65", "GOLO", "FORA", 11, "Benarfa", "1-1", "", ""],

    # Wiliete de Benguela 2-0 Académica do Lobito
    [1, *_WIL_LOB, "11", "GOLO", "CASA", 10, "Kabelo Dlamini", "1-0", "", ""],
    [1, *_WIL_LOB, "45+2", "GOLO", "CASA", 7, "Valter Monteiro", "2-0", "", ""],
]

# Só as métricas efetivamente visíveis nas fichas recebidas.
# Ordem: Posse, Remates, Remates_a_Baliza, Cantos, Faltas, Foras_de_Jogo,
#        Amarelos, Vermelhos, Passes, Precisao_Passe, Defesas
EXEMPLO_ESTATISTICAS = [
    [1, *_LS_PET, "CASA", None, None, None, None, None, None, 4, 0, None, None, None],
    [1, *_LS_PET, "FORA", None, None, None, None, None, None, 3, 0, None, None, None],
    [1, *_CAB_LIB, "CASA", None, None, None, None, None, None, 2, 0, None, None, None],
    [1, *_CAB_LIB, "FORA", None, None, None, None, None, None, 0, 0, None, None, None],
    [1, *_BRA_SAG, "CASA", None, None, None, None, None, None, 1, 1, None, None, None],
    [1, *_BRA_SAG, "FORA", None, None, None, None, None, None, 0, 1, None, None, None],
    [1, *_AGO_HUI, "CASA", None, None, None, 0, None, None, 3, 0, None, None, None],
    [1, *_AGO_HUI, "FORA", None, None, None, 1, None, None, 1, 0, None, None, None],
    [1, *_LUA_CAA, "CASA", None, None, None, 1, None, None, 0, 0, None, None, None],
    [1, *_LUA_CAA, "FORA", None, None, None, 0, None, None, 1, 0, None, None, None],
    [1, *_MAI_KAB, "CASA", None, None, None, 1, None, None, 2, None, None, None, None],
    [1, *_MAI_KAB, "FORA", None, None, None, 0, None, None, 4, None, None, None, None],
    [1, *_WIL_LOB, "CASA", None, None, None, 0, None, None, 0, None, None, None, None],
    [1, *_WIL_LOB, "FORA", None, None, None, 0, None, None, 1, None, None, None, None],
]

EXEMPLO_ARBITRAGEM = [
    [1, *_LS_PET, "Miguel Tchissingu Augusto Américo", "João Manuel Fula António",
     "Nery Domingos Pereira Amador da Silva", "Isaías Justino Camaxi"],
    [1, *_CAB_LIB, "Nelson João Milagre", "Manuel Daniel Coelho", "Hélder João Milagre",
     "Laurindo Feliciano Aureleo"],
    [1, *_BRA_SAG, "Sanda Mateus Miguel Kitu", "Natarino António Soares", "Nelson Lutumba Quiala",
     "Custódio Roque Lote"],
    [1, *_AGO_HUI, "Edilson Roberto Gomes André", "Manuel Luís Benguela", "Joaquim Manuel Chiyo",
     "Miguel Julião Mateus"],
]

# Convocatórias oficiais do Lunda Sul–Petro (1.ª jornada).
_ONZE_LUNDASUL = [
    (12, "Kacusso", "GK", "SIM"), (5, "Fredy", "DEF", "SIM"), (25, "Dieu", "DEF", "SIM"),
    (28, "Kibuata", "DEF", "SIM"), (6, "Platiny", "MID", "SIM"), (8, "Vado", "MID", "SIM"),
    (10, "Maranata", "MID", "SIM"), (11, "Magrinho", "FWD", "SIM"), (19, "Manucho", "FWD", "SIM"),
    (20, "Mussá", "FWD", "SIM"), (27, "Joca", "FWD", "SIM"),
    (2, "Nonó", "DEF", "NAO"), (4, "Yuri", "DEF", "NAO"), (7, "Neymar", "FWD", "NAO"),
    (16, "Ximba", "MID", "NAO"), (17, "Jepson", "FWD", "NAO"), (23, "Mongadié", "DEF", "NAO"),
    (26, "Sozito", "DEF", "NAO"), (33, "Zonzo", "MID", "NAO"), (34, "Nicon", "MID", "NAO"),
    (35, "Fuca", "FWD", "NAO"), (41, "Angola", "GK", "NAO"),
]

_ONZE_PETRO = [
    (22, "Neblú", "GK", "SIM"), (4, "Rúben Adérito", "DEF", "SIM"), (5, "Léo Bolgado", "DEF", "SIM"),
    (13, "Berna", "DEF", "SIM"), (25, "Eddie Afonso", "DEF", "SIM"), (6, "Mário Balbúrdia", "MID", "SIM"),
    (8, "Jonathan Toro", "MID", "SIM"), (10, "Pedro Aparício", "MID", "SIM"),
    (12, "Deybi Flores", "MID", "SIM"), (7, "Ivan Cavaleiro", "FWD", "SIM"),
    (26, "Tiago Azulão", "FWD", "SIM"),
    (1, "Hugo Marques", "GK", "NAO"), (2, "Núrio Fortuna", "DEF", "NAO"),
    (11, "Hélder Costa", "FWD", "NAO"), (18, "Vidinho", "DEF", "NAO"),
    (20, "Jorge Pereira", "MID", "NAO"), (23, "Tiago Reis", "FWD", "NAO"),
    (27, "António Hossi", "DEF", "NAO"), (29, "Depú", "FWD", "NAO"),
    (33, "Ilídio Panda", "FWD", "NAO"),
]

EXEMPLO_ONZES = (
    [[1, *_LS_PET, "CASA", num, nome, pos, tit, ""] for num, nome, pos, tit in _ONZE_LUNDASUL]
    + [[1, *_LS_PET, "FORA", num, nome, pos, tit, ""] for num, nome, pos, tit in _ONZE_PETRO]
)

INSTRUCOES = [
    ("COMO USAR ESTE FICHEIRO", ""),
    ("1.", "Preencha uma jornada de cada vez. A coluna «Jornada» tem de estar preenchida em todas as linhas — linhas sem jornada são ignoradas pelo importador."),
    ("2.", "Os nomes das equipas devem coincidir com a aba «Clubes_Referencia» (Nome_Curto, Nome_Oficial ou ID_Sistema são todos aceites)."),
    ("3.", "Cada jogo é identificado pelo trio Jornada + Equipa_Casa + Equipa_Fora. Use sempre a mesma grafia em todas as abas."),
    ("4.", "Depois de preencher, execute:  python3 scripts/import_rodada_excel.py <caminho_do_ficheiro.xlsx>"),
    ("5.", "O importador gera public/templates/ultima_rodada_importada.json. Carregue esse JSON em Admin › Calendário › «Importar Dados» e depois «Guardar alterações»."),
    ("", ""),
    ("REGRA EDITORIAL", ""),
    ("•", "Célula vazia = dado ainda não publicado oficialmente. NUNCA preencher com estimativas, médias ou valores aproximados."),
    ("•", "Métricas ausentes na ficha oficial (posse, passes, remates…) devem ficar em branco: o site apresenta apenas o que foi publicado."),
    ("•", "Minuto por confirmar: deixar a célula «Minuto» vazia. O evento é publicado sem minuto, nunca com minuto inventado."),
    ("", ""),
    ("ABAS DO FICHEIRO", ""),
    ("Jogos_Resultados", "Obrigatória. Agenda, resultado, estádio, transmissão, estado, árbitro principal, assistência e tempo útil."),
    ("Eventos_Ocorrencias", "Golos, cartões amarelos/vermelhos e substituições. Uma linha por ocorrência."),
    ("Estatisticas_Equipa", "Duas linhas por jogo (CASA e FORA). Só as métricas que constam da ficha oficial."),
    ("Arbitragem", "Equipa de arbitragem completa. Uma linha por jogo."),
    ("Onzes_Convocatorias", "Onze inicial e suplentes. Uma linha por atleta; Titular = SIM para o onze inicial."),
    ("Clubes_Referencia", "Apenas consulta. Não editar."),
    ("", ""),
    ("VALORES ACEITES", ""),
    ("Status", "finished (terminado) · scheduled (agendado) · live (em direto)"),
    ("Estado_Agenda", "official (data confirmada) · provisional (data provisória)"),
    ("Tipo_Evento", "GOLO · AMARELO · VERMELHO · ADVERTENCIA · SUB"),
    ("Equipa_Infracao / Lado", "CASA · FORA"),
    ("Posicao", "GK (guarda-redes) · DEF (defesa) · MID (médio) · FWD (avançado)"),
    ("Minuto", "Número (ex.: 63) ou compensação (ex.: 45+2, 90+5). Vazio se não confirmado."),
    ("Data / Hora", "Data no formato AAAA-MM-DD e hora HH:MM (fuso de Luanda, +01:00)."),
]


# ---------------------------------------------------------------------------
# CONSTRUÇÃO
# ---------------------------------------------------------------------------
def escrever_cabecalho(ws, colunas):
    ws.append(colunas)
    for col_idx in range(1, len(colunas) + 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.font = FONTE_CABECALHO
        cell.fill = FILL_CABECALHO
        cell.alignment = AL_CENTRO
        cell.border = BORDA
    ws.row_dimensions[1].height = 28
    ws.freeze_panes = "A2"


def escrever_linhas(ws, linhas, colunas_centro):
    for row in linhas:
        ws.append(row)
        row_idx = ws.max_row
        for col_idx in range(1, len(row) + 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.font = FONTE_DADOS
            cell.border = BORDA
            cell.alignment = AL_CENTRO if col_idx in colunas_centro else AL_ESQUERDA


def adicionar_validacao(ws, coluna_idx, valores, ultima_linha=500):
    """Lista pendente na coluna indicada, da linha 2 até `ultima_linha`."""
    formula = '"{}"'.format(",".join(valores))
    dv = DataValidation(type="list", formula1=formula, allow_blank=True, showDropDown=False)
    ws.add_data_validation(dv)
    letra = get_column_letter(coluna_idx)
    dv.add(f"{letra}2:{letra}{ultima_linha}")


def ajustar_larguras(ws, largura_maxima=42):
    for col in ws.columns:
        max_len = max((len(str(cell.value or "")) for cell in col), default=10)
        letra = get_column_letter(col[0].column)
        ws.column_dimensions[letra].width = min(max(max_len + 4, 12), largura_maxima)


def construir_aba_instrucoes(wb, incluir_exemplo):
    ws = wb.active
    ws.title = "Instrucoes"

    ws["A1"] = "GIRABOLA — FICHEIRO PADRÃO DE JORNADA"
    ws["A1"].font = FONTE_TITULO
    subtitulo = "Modelo preenchido (1.ª jornada oficial)" if incluir_exemplo else "Modelo em branco"
    ws["A2"] = f"{subtitulo} · Liga Unitel Girabola"
    ws["A2"].font = FONTE_NOTA
    ws.append([])

    for chave, texto in INSTRUCOES:
        ws.append([chave, texto])
        row_idx = ws.max_row
        titulo = texto == "" and chave != ""
        ws.cell(row=row_idx, column=1).font = Font(name="Arial", size=10, bold=True)
        ws.cell(row=row_idx, column=1).alignment = AL_ESQUERDA
        ws.cell(row=row_idx, column=2).font = FONTE_DADOS
        ws.cell(row=row_idx, column=2).alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        if titulo:
            ws.cell(row=row_idx, column=1).font = Font(name="Arial", size=11, bold=True, color=COR_CABECALHO_BG)

    ws.column_dimensions["A"].width = 24
    ws.column_dimensions["B"].width = 118
    return ws


def criar_modelo(nome_arquivo, incluir_exemplo=True):
    wb = openpyxl.Workbook()
    construir_aba_instrucoes(wb, incluir_exemplo)

    nomes_curtos = [c[2] for c in CLUBES]

    # 1. Jogos e resultados
    ws_jogos = wb.create_sheet("Jogos_Resultados")
    escrever_cabecalho(ws_jogos, COLUNAS_JOGOS)
    if incluir_exemplo:
        escrever_linhas(ws_jogos, EXEMPLO_JOGOS, CENTRO_JOGOS)
    adicionar_validacao(ws_jogos, 4, nomes_curtos)
    adicionar_validacao(ws_jogos, 7, nomes_curtos)
    adicionar_validacao(ws_jogos, 10, ["finished", "scheduled", "live"])
    adicionar_validacao(ws_jogos, 11, ["official", "provisional"])

    # 2. Eventos e ocorrências
    ws_eventos = wb.create_sheet("Eventos_Ocorrencias")
    escrever_cabecalho(ws_eventos, COLUNAS_EVENTOS)
    if incluir_exemplo:
        escrever_linhas(ws_eventos, EXEMPLO_EVENTOS, CENTRO_EVENTOS)
    adicionar_validacao(ws_eventos, 2, nomes_curtos, 1000)
    adicionar_validacao(ws_eventos, 3, nomes_curtos, 1000)
    adicionar_validacao(ws_eventos, 5, ["GOLO", "AMARELO", "VERMELHO", "SUB"], 1000)
    adicionar_validacao(ws_eventos, 6, ["CASA", "FORA"], 1000)

    # 3. Estatísticas por equipa
    ws_stats = wb.create_sheet("Estatisticas_Equipa")
    escrever_cabecalho(ws_stats, COLUNAS_ESTATISTICAS)
    if incluir_exemplo:
        escrever_linhas(ws_stats, EXEMPLO_ESTATISTICAS, CENTRO_ESTATISTICAS)
    adicionar_validacao(ws_stats, 2, nomes_curtos)
    adicionar_validacao(ws_stats, 3, nomes_curtos)
    adicionar_validacao(ws_stats, 4, ["CASA", "FORA"])

    # 4. Arbitragem
    ws_arb = wb.create_sheet("Arbitragem")
    escrever_cabecalho(ws_arb, COLUNAS_ARBITRAGEM)
    if incluir_exemplo:
        escrever_linhas(ws_arb, EXEMPLO_ARBITRAGEM, CENTRO_ARBITRAGEM)
    adicionar_validacao(ws_arb, 2, nomes_curtos)
    adicionar_validacao(ws_arb, 3, nomes_curtos)

    # 5. Onzes e convocatórias
    ws_onzes = wb.create_sheet("Onzes_Convocatorias")
    escrever_cabecalho(ws_onzes, COLUNAS_ONZES)
    if incluir_exemplo:
        escrever_linhas(ws_onzes, EXEMPLO_ONZES, CENTRO_ONZES)
    adicionar_validacao(ws_onzes, 2, nomes_curtos, 1000)
    adicionar_validacao(ws_onzes, 3, nomes_curtos, 1000)
    adicionar_validacao(ws_onzes, 4, ["CASA", "FORA"], 1000)
    adicionar_validacao(ws_onzes, 7, ["GK", "DEF", "MID", "FWD"], 1000)
    adicionar_validacao(ws_onzes, 8, ["SIM", "NAO"], 1000)

    # 6. Clubes de referência
    ws_clubes = wb.create_sheet("Clubes_Referencia")
    escrever_cabecalho(ws_clubes, COLUNAS_CLUBES)
    escrever_linhas(ws_clubes, CLUBES, CENTRO_CLUBES)

    for ws in [ws_jogos, ws_eventos, ws_stats, ws_arb, ws_onzes, ws_clubes]:
        ajustar_larguras(ws)

    wb.save(nome_arquivo)
    print(f"✅ Ficheiro gerado: {nome_arquivo}")


if __name__ == "__main__":
    os.makedirs(DESTINO, exist_ok=True)
    criar_modelo(f"{DESTINO}/girabola_modelo_rodada_exemplo.xlsx", incluir_exemplo=True)
    criar_modelo(f"{DESTINO}/girabola_modelo_rodada_em_branco.xlsx", incluir_exemplo=False)
