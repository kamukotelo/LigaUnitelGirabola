import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Criar pasta de templates se não existir
os.makedirs("public/templates", exist_ok=True)

def criar_template_excel(nome_arquivo, incluir_exemplo=True):
    wb = openpyxl.Workbook()

    # -------------------------------------------------------------
    # ESTILOS VISUAIS
    # -------------------------------------------------------------
    cor_cabecalho_bg = "1A2332"  # Dark Navy
    cor_cabecalho_fg = "FFCC00"  # Dourado Girabola
    cor_borda = "D0D7DE"

    fonte_cabecalho = Font(name="Arial", size=11, bold=True, color=cor_cabecalho_fg)
    fill_cabecalho = PatternFill(start_color=cor_cabecalho_bg, end_color=cor_cabecalho_bg, fill_type="solid")

    fonte_dados = Font(name="Arial", size=10)
    fonte_destaque = Font(name="Arial", size=10, bold=True)

    thin_border = Border(
        left=Side(style='thin', color=cor_borda),
        right=Side(style='thin', color=cor_borda),
        top=Side(style='thin', color=cor_borda),
        bottom=Side(style='thin', color=cor_borda)
    )

    align_center = Alignment(horizontal="center", vertical="center")
    align_left = Alignment(horizontal="left", vertical="center")

    # -------------------------------------------------------------
    # 1. ABA DE JOGOS E RESULTADOS
    # -------------------------------------------------------------
    ws_jogos = wb.active
    ws_jogos.title = "Jogos_Resultados"

    colunas_jogos = [
        "Jornada", "Data (AAAA-MM-DD)", "Hora (HH:MM)", "Equipa_Casa",
        "Golos_Casa", "Golos_Fora", "Equipa_Fora", "Estadio",
        "Transmissao", "Status (finished/scheduled)"
    ]

    ws_jogos.append(colunas_jogos)
    for col_idx in range(1, len(colunas_jogos) + 1):
        cell = ws_jogos.cell(row=1, column=col_idx)
        cell.font = fonte_cabecalho
        cell.fill = fill_cabecalho
        cell.alignment = align_center
        cell.border = thin_border

    if incluir_exemplo:
        dados_exemplo_jogos = [
            [1, "2026-08-21", "15:00", "Desportivo da Lunda Sul", 0, 0, "Petro de Luanda", "Estádio do Sagrada Esperança", "Zsports", "finished"],
            [1, "2026-08-22", "15:00", "FC Cabinda", 0, 3, "Recreativo do Libolo", "Estádio Vici António", "", "finished"],
            [1, "2026-08-22", "15:00", "Bravos do Maquis", 3, 0, "Sagrada Esperança", "Estádio Mundunduleno", "", "finished"],
            [1, "2026-08-22", "15:00", "CD 1.º de Agosto", 1, 0, "Desportivo da Huíla", "Estádio França N’dalu", "Zsports", "finished"],
            [1, "2026-08-23", "15:00", "FC Luanda", 0, 0, "CR Caála", "Estádio França N’dalu", "", "finished"],
            [1, "2026-08-23", "15:00", "São Salvador", 0, 1, "GD Interclube", "Estádio Álvaro Buta", "", "finished"],
            [1, "2026-08-23", "15:00", "Estrela 1.º de Maio", 1, 1, "Kabuscorp SC", "Estádio de São Filipe", "", "finished"],
            [1, "2026-08-23", "17:30", "Wiliete de Benguela", 2, 0, "Académica do Lobito", "Estádio Nacional de Ombaka", "Zsports", "finished"]
        ]
        for row in dados_exemplo_jogos:
            ws_jogos.append(row)
            row_idx = ws_jogos.max_row
            for col_idx in range(1, len(row) + 1):
                cell = ws_jogos.cell(row=row_idx, column=col_idx)
                cell.font = fonte_dados
                cell.border = thin_border
                cell.alignment = align_center if col_idx in [1, 2, 3, 5, 6, 9, 10] else align_left

    # -------------------------------------------------------------
    # 2. ABA DE EVENTOS (GOLOS, CARTÕES, SUBS)
    # -------------------------------------------------------------
    ws_eventos = wb.create_sheet(title="Eventos_Ocorrencias")
    colunas_eventos = [
        "Jornada", "Equipa_Casa", "Equipa_Fora", "Minuto",
        "Tipo_Evento (GOLO/AMARELO/VERMELHO/SUB)", "Equipa_Infracao (CASA/FORA)",
        "Camisola", "Nome_Jogador", "Detalhe_Motivo"
    ]

    ws_eventos.append(colunas_eventos)
    for col_idx in range(1, len(colunas_eventos) + 1):
        cell = ws_eventos.cell(row=1, column=col_idx)
        cell.font = fonte_cabecalho
        cell.fill = fill_cabecalho
        cell.alignment = align_center
        cell.border = thin_border

    if incluir_exemplo:
        dados_exemplo_eventos = [
            # Lunda Sul x Petro (Conforme a súmula oficial)
            [1, "Desportivo da Lunda Sul", "Petro de Luanda", "28", "AMARELO", "CASA", 10, "Maranata Domingos Sicuba Vunge", "Rasteirou o adversário"],
            [1, "Desportivo da Lunda Sul", "Petro de Luanda", "37", "AMARELO", "CASA", 6, "Elindo Wanga Paulino", "Rasteirou o adversário"],
            [1, "Desportivo da Lunda Sul", "Petro de Luanda", "53", "AMARELO", "FORA", 12, "Deybi Aldair Flores Flores", "Rasteirou o adversário"],
            [1, "Desportivo da Lunda Sul", "Petro de Luanda", "63", "AMARELO", "FORA", 27, "Antonio da Silva Chitanga Hossi", "Protestou a decisão do árbitro"],
            [1, "Desportivo da Lunda Sul", "Petro de Luanda", "76", "AMARELO", "FORA", 13, "Bernardo Silva da Conceição", "Agarrou o adversário"],
            [1, "Desportivo da Lunda Sul", "Petro de Luanda", "86", "AMARELO", "CASA", 16, "Domingos Ximba", "Protestar a decisão do árbitro"],
            [1, "Desportivo da Lunda Sul", "Petro de Luanda", "90+5", "AMARELO", "CASA", 28, "João Ambrosio", "Agarrou o adversário"],

            # Cabinda x Libolo
            [1, "FC Cabinda", "Recreativo do Libolo", "34", "GOLO", "FORA", 27, "Cuxixima", "0-1"],
            [1, "FC Cabinda", "Recreativo do Libolo", "70", "GOLO", "FORA", 17, "Pedro", "0-2"],
            [1, "FC Cabinda", "Recreativo do Libolo", "73", "GOLO", "FORA", 10, "Andeloy", "0-3"],

            # Maquis x Sagrada
            [1, "Bravos do Maquis", "Sagrada Esperança", None, "GOLO", "CASA", 8, "Ju Cabral", ""],
            [1, "Bravos do Maquis", "Sagrada Esperança", None, "GOLO", "CASA", 23, "Lito", ""],
            [1, "Bravos do Maquis", "Sagrada Esperança", None, "GOLO", "CASA", 28, "Gladilson", ""],

            # 1º de Agosto x Huíla
            [1, "CD 1.º de Agosto", "Desportivo da Huíla", "90+2", "GOLO", "CASA", 9, "D. Tshibamba", "1-0"],

            # FC Luanda x Caála
            [1, "FC Luanda", "CR Caála", "14", "VERMELHO", "FORA", 0, "Jogador do Caála", "Cartão Vermelho direto"],

            # São Salvador x Interclube
            [1, "São Salvador", "GD Interclube", "70", "GOLO", "FORA", 8, "Além", "0-1"],

            # 1º de Maio x Kabuscorp
            [1, "Estrela 1.º de Maio", "Kabuscorp SC", "23", "GOLO", "CASA", 10, "Deninho", "1-0"],
            [1, "Estrela 1.º de Maio", "Kabuscorp SC", "65", "GOLO", "FORA", 11, "Benarfa", "1-1"],

            # Wiliete x Lobito
            [1, "Wiliete de Benguela", "Académica do Lobito", "11", "GOLO", "CASA", 10, "Kabelo Dlamini", "1-0"],
            [1, "Wiliete de Benguela", "Académica do Lobito", "45+2", "GOLO", "CASA", 7, "Valter Monteiro", "2-0"],
        ]
        for row in dados_exemplo_eventos:
            ws_eventos.append(row)
            row_idx = ws_eventos.max_row
            for col_idx in range(1, len(row) + 1):
                cell = ws_eventos.cell(row=row_idx, column=col_idx)
                cell.font = fonte_dados
                cell.border = thin_border
                cell.alignment = align_center if col_idx in [1, 4, 5, 6, 7] else align_left

    # -------------------------------------------------------------
    # 3. ABA DE CLUBES VÁLIDOS (REFERÊNCIA)
    # -------------------------------------------------------------
    ws_clubes = wb.create_sheet(title="Clubes_Referencia")
    colunas_clubes = ["ID_Sistema", "Nome_Oficial", "Nome_Curto", "Sigla", "Estadio_Padrao"]
    ws_clubes.append(colunas_clubes)

    for col_idx in range(1, len(colunas_clubes) + 1):
        cell = ws_clubes.cell(row=1, column=col_idx)
        cell.font = fonte_cabecalho
        cell.fill = fill_cabecalho
        cell.alignment = align_center
        cell.border = thin_border

    clubes = [
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
        ["cabinda", "Futebol Clube de Cabinda", "FC Cabinda", "CAB", "Estádio Vici António"]
    ]

    for row in clubes:
        ws_clubes.append(row)
        row_idx = ws_clubes.max_row
        for col_idx in range(1, len(row) + 1):
            cell = ws_clubes.cell(row=row_idx, column=col_idx)
            cell.font = fonte_dados
            cell.border = thin_border
            cell.alignment = align_center if col_idx in [1, 4] else align_left

    # Ajustar largura das colunas em todas as abas
    for ws in [ws_jogos, ws_eventos, ws_clubes]:
        ws.row_dimensions[1].height = 25
        for col in ws.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = get_column_letter(col[0].column)
            ws.column_dimensions[col_letter].width = max(max_len + 4, 12)

    wb.save(nome_arquivo)
    print(f"✅ Ficheiro Excel gerado: {nome_arquivo}")

# Gerar tanto o modelo com exemplos quanto o modelo em branco
criar_template_excel("public/templates/girabola_modelo_rodada_exemplo.xlsx", incluir_exemplo=True)
criar_template_excel("public/templates/girabola_modelo_rodada_em_branco.xlsx", incluir_exemplo=False)
