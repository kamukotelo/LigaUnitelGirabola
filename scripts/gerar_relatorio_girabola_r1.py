import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# ==============================================================================
# 1. INICIALIZAÇÃO DA APRESENTAÇÃO WIDESCREEN (16:9)
# ==============================================================================
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Paleta de Cores Institucional Girabola / ANCAF
COR_FUNDO = RGBColor(15, 17, 23)           # Dark Navy/Preto Profundo
COR_CARD = RGBColor(26, 31, 46)            # Slate Card escuro
COR_CARD_ALT = RGBColor(35, 41, 60)        # Alternado
COR_TEXTO = RGBColor(245, 245, 245)        # Branco suave
COR_TEXTO_MUTED = RGBColor(160, 174, 192)  # Cinza suave
COR_AMARELO = RGBColor(255, 204, 0)        # Dourado Girabola / Unitel
COR_VERMELHO = RGBColor(239, 68, 68)       # Vermelho cartão / alerta
COR_VERDE = RGBColor(34, 197, 94)          # Verde vitória / destaque
COR_AZUL = RGBColor(59, 130, 246)          # Azul institucional

def aplicar_estilo_base(slide, titulo_texto, subtitulo_texto=None):
    """Aplica o fundo escuro e o cabeçalho oficial da ANCAF / Liga Unitel."""
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = COR_FUNDO

    # Barra superior decorativa
    top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.08))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = COR_AMARELO
    top_bar.line.color.rgb = COR_AMARELO

    # Cabeçalho de Texto
    txBox = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.8))
    tf = txBox.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = f"ANCAF  |  LIGA UNITEL GIRABOLA 2026"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COR_AMARELO

    p2 = tf.add_paragraph()
    p2.text = titulo_texto.upper()
    p2.font.size = Pt(20)
    p2.font.bold = True
    p2.font.color.rgb = COR_TEXTO

    if subtitulo_texto:
        p3 = tf.add_paragraph()
        p3.text = subtitulo_texto
        p3.font.size = Pt(11)
        p3.font.color.rgb = COR_TEXTO_MUTED

slide_layout = prs.slide_layouts[6]  # Layout em branco

# ==============================================================================
# DIAPOSITIVO 1: CAPA OFICIAL
# ==============================================================================
slide1 = prs.slides.add_slide(slide_layout)
bg1 = slide1.background
fill1 = bg1.fill
fill1.solid()
fill1.fore_color.rgb = COR_FUNDO

# Faixa lateral ou moldura decorativa
accent_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(0.15), Inches(4.5))
accent_bar.fill.solid()
accent_bar.fill.fore_color.rgb = COR_AMARELO
accent_bar.line.color.rgb = COR_AMARELO

# Caixa do Título Principal
title_box = slide1.shapes.add_textbox(Inches(1.2), Inches(1.5), Inches(11.0), Inches(4.5))
tf1 = title_box.text_frame
tf1.word_wrap = True

p = tf1.paragraphs[0]
p.text = "LIGA UNITEL GIRABOLA 2026"
p.font.size = Pt(36)
p.font.bold = True
p.font.color.rgb = COR_AMARELO
p.space_after = Pt(8)

p = tf1.add_paragraph()
p.text = "RELATÓRIO OFICIAL & ESTATÍSTICAS — 1.ª RODADA"
p.font.size = Pt(24)
p.font.bold = True
p.font.color.rgb = COR_TEXTO
p.space_after = Pt(20)

p = tf1.add_paragraph()
p.text = "⚽ 8 Jogos Realizados | 11 Golos Marcados (Média: 1,38)\n📅 Período de Disputa: 21 a 23 de Agosto de 2026\n🏢 Associação Nacional dos Clubes de Futebol de Angola (ANCAF)"
p.font.size = Pt(14)
p.font.color.rgb = COR_TEXTO_MUTED
p.space_after = Pt(20)

p = tf1.add_paragraph()
p.text = "Documento Oficial de Homologação de Resultados e Classificação"
p.font.size = Pt(11)
p.font.italic = True
p.font.color.rgb = COR_AMARELO

# ==============================================================================
# DIAPOSITIVO 2: JOGOS E RESULTADOS (COM MARCADORES E DATAS)
# ==============================================================================
slide2 = prs.slides.add_slide(slide_layout)
aplicar_estilo_base(slide2, "Resultados & Marcadores da 1.ª Rodada", "Jogos disputados entre 21 e 23 de Agosto de 2026")

jogos_info = [
    {
        "data": "21 DE AGOSTO DE 2026",
        "jogos": [
            {
                "confronto": "Desportivo da Lunda Sul 0–0 Petro de Luanda",
                "detalhes": "Sem golos  •  Sem cartões vermelhos"
            }
        ]
    },
    {
        "data": "22 DE AGOSTO DE 2026",
        "jogos": [
            {
                "confronto": "FC Cabinda 0–3 Recreativo do Libolo",
                "detalhes": "⚽ 34' Cuxixima (0-1) | ⚽ 70' Pedro (0-2) | ⚽ 73' Andeloy (0-3)"
            },
            {
                "confronto": "Bravos do Maquis 3–0 Sagrada Esperança",
                "detalhes": "⚽ 24' Ju Cabral (1-0) | ⚽ 36' Luís Caetano Paquete (2-0) | ⚽ 80' Tangu Gastão (3-0)"
            },
            {
                "confronto": "1.º de Agosto 1–0 Desportivo da Huíla",
                "detalhes": "⚽ 90'+2 D. Tshibamba (1-0)"
            }
        ]
    },
    {
        "data": "23 DE AGOSTO DE 2026",
        "jogos": [
            {
                "confronto": "FC Luanda 0–0 Recreativo da Caála",
                "detalhes": "Sem golos  •  🟥 14' Cartão Vermelho"
            },
            {
                "confronto": "São Salvador do Kongo 0–1 Interclube",
                "detalhes": "⚽ 70' Além (0-1)"
            },
            {
                "confronto": "1.º de Maio de Benguela 1–1 Kabuscorp",
                "detalhes": "⚽ 23' Deninho (1-0) | ⚽ 65' Benarfa (1-1)"
            },
            {
                "confronto": "Wiliete de Benguela 2–0 Académica do Lobito",
                "detalhes": "⚽ 11' Kabelo Dlamini (1-0) | ⚽ 45'+2 Valter Monteiro (2-0)"
            }
        ]
    }
]

# Renderizar duas colunas de cartões para os jogos
col1_box = slide2.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(5.7), Inches(5.7))
tf_c1 = col1_box.text_frame
tf_c1.word_wrap = True

col2_box = slide2.shapes.add_textbox(Inches(6.8), Inches(1.3), Inches(5.7), Inches(5.7))
tf_c2 = col2_box.text_frame
tf_c2.word_wrap = True

# Preencher coluna 1 (21 e 22 de Agosto)
p = tf_c1.paragraphs[0]
p.text = f"📅 {jogos_info[0]['data']}"
p.font.size = Pt(13)
p.font.bold = True
p.font.color.rgb = COR_AMARELO

for j in jogos_info[0]["jogos"]:
    p_m = tf_c1.add_paragraph()
    p_m.text = f"🥊 {j['confronto']}"
    p_m.font.size = Pt(13)
    p_m.font.bold = True
    p_m.font.color.rgb = COR_TEXTO

    p_d = tf_c1.add_paragraph()
    p_d.text = f"   {j['detalhes']}"
    p_d.font.size = Pt(11)
    p_d.font.color.rgb = COR_TEXTO_MUTED
    p_d.space_after = Pt(8)

p_sep = tf_c1.add_paragraph()
p_sep.text = f"📅 {jogos_info[1]['data']}"
p_sep.font.size = Pt(13)
p_sep.font.bold = True
p_sep.font.color.rgb = COR_AMARELO
p_sep.space_before = Pt(6)

for j in jogos_info[1]["jogos"]:
    p_m = tf_c1.add_paragraph()
    p_m.text = f"🥊 {j['confronto']}"
    p_m.font.size = Pt(13)
    p_m.font.bold = True
    p_m.font.color.rgb = COR_TEXTO

    p_d = tf_c1.add_paragraph()
    p_d.text = f"   {j['detalhes']}"
    p_d.font.size = Pt(11)
    p_d.font.color.rgb = COR_TEXTO_MUTED
    p_d.space_after = Pt(8)

# Preencher coluna 2 (23 de Agosto)
p = tf_c2.paragraphs[0]
p.text = f"📅 {jogos_info[2]['data']}"
p.font.size = Pt(13)
p.font.bold = True
p.font.color.rgb = COR_AMARELO

for j in jogos_info[2]["jogos"]:
    p_m = tf_c2.add_paragraph()
    p_m.text = f"🥊 {j['confronto']}"
    p_m.font.size = Pt(13)
    p_m.font.bold = True
    p_m.font.color.rgb = COR_TEXTO

    p_d = tf_c2.add_paragraph()
    p_d.text = f"   {j['detalhes']}"
    p_d.font.size = Pt(11)
    p_d.font.color.rgb = COR_TEXTO_MUTED
    p_d.space_after = Pt(8)

# ==============================================================================
# DIAPOSITIVO 3: TABELA DE CLASSIFICAÇÃO (16 EQUIPAS)
# ==============================================================================
slide3 = prs.slides.add_slide(slide_layout)
aplicar_estilo_base(slide3, "Tabela de Classificação Oficial (16 Equipas)", "Atualizada após a conclusão da 1.ª Rodada")

dados_classificacao = [
    ["Pos", "Clube", "P", "J", "V", "E", "D", "GM", "GS", "DG"],
    ["1", "Bravos do Maquis", "3", "1", "1", "0", "0", "3", "0", "+3"],
    ["1", "Recreativo do Libolo", "3", "1", "1", "0", "0", "3", "0", "+3"],
    ["3", "Wiliete de Benguela", "3", "1", "1", "0", "0", "2", "0", "+2"],
    ["4", "1.º de Agosto", "3", "1", "1", "0", "0", "1", "0", "+1"],
    ["4", "Interclube", "3", "1", "1", "0", "0", "1", "0", "+1"],
    ["6", "1.º de Maio de Benguela", "1", "1", "0", "1", "0", "1", "1", "0"],
    ["6", "Kabuscorp do Palanca", "1", "1", "0", "1", "0", "1", "1", "0"],
    ["6", "Desportivo da Lunda Sul", "1", "1", "0", "1", "0", "0", "0", "0"],
    ["6", "Petro de Luanda", "1", "1", "0", "1", "0", "0", "0", "0"],
    ["6", "FC Luanda", "1", "1", "0", "1", "0", "0", "0", "0"],
    ["6", "Recreativo da Caála", "1", "1", "0", "1", "0", "0", "0", "0"],
    ["12", "Sagrada Esperança", "0", "1", "0", "0", "1", "0", "3", "-3"],
    ["12", "FC Cabinda", "0", "1", "0", "0", "1", "0", "3", "-3"],
    ["14", "Académica do Lobito", "0", "1", "0", "0", "1", "0", "2", "-2"],
    ["14", "São Salvador do Kongo", "0", "1", "0", "0", "1", "0", "1", "-1"],
    ["14", "Desportivo da Huíla", "0", "1", "0", "0", "1", "0", "1", "-1"]
]

rows = len(dados_classificacao)
cols = 10
left = Inches(0.8)
top = Inches(1.3)
width = Inches(11.733)
height = Inches(5.7)

table_shape = slide3.shapes.add_table(rows, cols, left, top, width, height)
table = table_shape.table

# Definir larguras de coluna proporcionais
table.columns[0].width = Inches(0.8)   # Pos
table.columns[1].width = Inches(3.933) # Clube
for col_idx in range(2, 10):
    table.columns[col_idx].width = Inches(0.875)

for r_idx, row in enumerate(dados_classificacao):
    for c_idx, val in enumerate(row):
        cell = table.cell(r_idx, c_idx)
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE

        # Cor de fundo
        cell_fill = cell.fill
        cell_fill.solid()
        if r_idx == 0:
            cell_fill.fore_color.rgb = RGBColor(40, 50, 75)
        elif r_idx <= 5:  # Zona de topo
            cell_fill.fore_color.rgb = RGBColor(22, 28, 42) if r_idx % 2 == 1 else RGBColor(18, 22, 34)
        elif r_idx >= 12: # Zona de despromoção
            cell_fill.fore_color.rgb = RGBColor(32, 22, 24) if r_idx % 2 == 1 else RGBColor(26, 18, 20)
        else:             # Meio da tabela
            cell_fill.fore_color.rgb = RGBColor(24, 28, 38) if r_idx % 2 == 1 else RGBColor(18, 22, 30)

        p = cell.text_frame.paragraphs[0]
        p.text = val
        p.font.size = Pt(10.5)

        if r_idx == 0:
            p.font.bold = True
            p.font.color.rgb = COR_AMARELO
            p.alignment = PP_ALIGN.LEFT if c_idx == 1 else PP_ALIGN.CENTER
        else:
            p.font.color.rgb = COR_TEXTO
            p.alignment = PP_ALIGN.LEFT if c_idx == 1 else PP_ALIGN.CENTER
            if c_idx == 0 and r_idx <= 5:
                p.font.bold = True
                p.font.color.rgb = COR_VERDE
            elif c_idx == 0 and r_idx >= 12:
                p.font.bold = True
                p.font.color.rgb = COR_VERMELHO
            elif c_idx == 2:  # Pontos
                p.font.bold = True
                p.font.color.rgb = COR_AMARELO

# ==============================================================================
# DIAPOSITIVO 4: ESTATÍSTICAS GERAIS E DISCIPLINARES
# ==============================================================================
slide4 = prs.slides.add_slide(slide_layout)
aplicar_estilo_base(slide4, "Estatísticas Gerais & Disciplina — Rodada 1", "Métricas consolidadas de produtividade e conduta")

stats_col1 = [
    ("📊 Total de Jogos Realizados", "8 jogos"),
    ("⚽ Total de Golos Marcados", "11 golos"),
    ("📈 Média de Golos / Jogo", "1,38 golos por partida"),
    ("🏠 Vitórias da Equipa da Casa", "4 vitórias (50,0%)"),
    ("✈️ Vitórias da Equipa Visitante", "1 vitória (12,5%)"),
]

stats_col2 = [
    ("🤝 Empates Registados", "3 empates (37,5%)"),
    ("🚫 Jogos sem Golos (0–0)", "2 jogos (Lunda Sul x Petro, Luanda x Caála)"),
    ("💥 Maior Goleada da Ronda", "FC Cabinda 0–3 Libolo | Maquis 3–0 Sagrada"),
    ("🟥 Cartões Vermelhos", "1 expulsão (FC Luanda vs Recreativo da Caála - 14')"),
    ("🟨 Cartões Amarelos", "Dados não disponíveis nas imagens oficiais")
]

box_s1 = slide4.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(5.7), Inches(5.7))
tf_s1 = box_s1.text_frame
tf_s1.word_wrap = True

p = tf_s1.paragraphs[0]
p.text = "📈 PRODUTIVIDADE & RESULTADOS"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = COR_AMARELO
p.space_after = Pt(10)

for label, val in stats_col1:
    p_l = tf_s1.add_paragraph()
    p_l.text = f"{label}:"
    p_l.font.size = Pt(12)
    p_l.font.bold = True
    p_l.font.color.rgb = COR_TEXTO

    p_v = tf_s1.add_paragraph()
    p_v.text = f"   👉 {val}"
    p_v.font.size = Pt(11.5)
    p_v.font.color.rgb = COR_TEXTO_MUTED
    p_v.space_after = Pt(8)

box_s2 = slide4.shapes.add_textbox(Inches(6.8), Inches(1.3), Inches(5.7), Inches(5.7))
tf_s2 = box_s2.text_frame
tf_s2.word_wrap = True

p = tf_s2.paragraphs[0]
p.text = "⚖️ EQUILÍBRIO & DISCIPLINA"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = COR_AMARELO
p.space_after = Pt(10)

for label, val in stats_col2:
    p_l = tf_s2.add_paragraph()
    p_l.text = f"{label}:"
    p_l.font.size = Pt(12)
    p_l.font.bold = True
    p_l.font.color.rgb = COR_TEXTO

    p_v = tf_s2.add_paragraph()
    p_v.text = f"   👉 {val}"
    p_v.font.size = Pt(11.5)
    p_v.font.color.rgb = COR_TEXTO_MUTED
    p_v.space_after = Pt(8)

# ==============================================================================
# DIAPOSITIVO 5: DESTAQUES DA RODADA
# ==============================================================================
slide5 = prs.slides.add_slide(slide_layout)
aplicar_estilo_base(slide5, "Destaques & Recordes da 1.ª Rodada", "Principais marcas individuais e coletivas da jornada de abertura")

destaques = [
    ("🔥 Melhor Ataque", "Bravos do Maquis e Recreativo do Libolo", "3 golos marcados cada"),
    ("🛡️ Melhor Defesa", "Wiliete, 1.º de Agosto, Interclube, Lunda Sul, Petro, Luanda e Caála", "0 golos sofridos (clean sheet)"),
    ("⏱️ Golo Mais Cedo", "Kabelo Dlamini (Wiliete de Benguela)", "Aos 11 minutos do 1.º tempo"),
    ("⏳ Golo Mais Tarde", "D. Tshibamba (1.º de Agosto)", "Aos 90'+2 minutos dos acréscimos"),
    ("🌟 Hat-Trick", "Nenhum registado nesta ronda", "Nenhum jogador marcou 3 golos"),
    ("🎯 Jogo com Mais Golos", "Bravos do Maquis 3–0 Sagrada & FC Cabinda 0–3 Libolo", "3 golos no somatório da partida")
]

dest_box = slide5.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.733), Inches(5.7))
tf_d = dest_box.text_frame
tf_d.word_wrap = True

p = tf_d.paragraphs[0]
p.text = "🏆 QUADRO DE HONRA DA JORNADA"
p.font.size = Pt(15)
p.font.bold = True
p.font.color.rgb = COR_AMARELO
p.space_after = Pt(12)

for item, titular, desc in destaques:
    p_i = tf_d.add_paragraph()
    p_i.text = f"✅  {item}: {titular}"
    p_i.font.size = Pt(13)
    p_i.font.bold = True
    p_i.font.color.rgb = COR_TEXTO

    p_sub = tf_d.add_paragraph()
    p_sub.text = f"      ↳ {desc}"
    p_sub.font.size = Pt(11)
    p_sub.font.color.rgb = COR_TEXTO_MUTED
    p_sub.space_after = Pt(7)

# ==============================================================================
# DIAPOSITIVO 6: PRÓXIMOS CONFRONTOS - RODADA 2
# ==============================================================================
slide6 = prs.slides.add_slide(slide_layout)
aplicar_estilo_base(slide6, "Próximos Confrontos — 2.ª Rodada", "Calendário dos jogos da próxima jornada do Girabola 2026")

jogos_r2 = [
    ("Petro de Luanda", "Bravos do Maquis", "⭐ Clássico da Ronda"),
    ("Recreativo do Libolo", "1.º de Agosto", "Duelo de Campeões"),
    ("Sagrada Esperança", "Wiliete de Benguela", "Confronto Direto"),
    ("Desportivo da Huíla", "FC Cabinda", "Duelo Regional"),
    ("Académica do Lobito", "1.º de Maio de Benguela", "Dérbi de Benguela"),
    ("Interclube", "FC Luanda", "Confronto da Capital"),
    ("Recreativo da Caála", "Desportivo da Lunda Sul", "Duelo do Planalto / Leste"),
    ("Kabuscorp do Palanca", "São Salvador do Kongo", "Jogo de Alta Intensidade")
]

r2_col1 = slide6.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(5.7), Inches(5.7))
tf_r2_1 = r2_col1.text_frame
tf_r2_1.word_wrap = True

r2_col2 = slide6.shapes.add_textbox(Inches(6.8), Inches(1.3), Inches(5.7), Inches(5.7))
tf_r2_2 = r2_col2.text_frame
tf_r2_2.word_wrap = True

p = tf_r2_1.paragraphs[0]
p.text = "⚔️ CONFRONTOS (PARTE 1)"
p.font.size = Pt(13)
p.font.bold = True
p.font.color.rgb = COR_AMARELO
p.space_after = Pt(8)

for mandante, visitante, obs in jogos_r2[:4]:
    p_j = tf_r2_1.add_paragraph()
    p_j.text = f"⚽  {mandante}  vs  {visitante}"
    p_j.font.size = Pt(13)
    p_j.font.bold = True
    p_j.font.color.rgb = COR_TEXTO

    p_o = tf_r2_1.add_paragraph()
    p_o.text = f"     📌 {obs}"
    p_o.font.size = Pt(11)
    p_o.font.color.rgb = COR_TEXTO_MUTED
    p_o.space_after = Pt(10)

p = tf_r2_2.paragraphs[0]
p.text = "⚔️ CONFRONTOS (PARTE 2)"
p.font.size = Pt(13)
p.font.bold = True
p.font.color.rgb = COR_AMARELO
p.space_after = Pt(8)

for mandante, visitante, obs in jogos_r2[4:]:
    p_j = tf_r2_2.add_paragraph()
    p_j.text = f"⚽  {mandante}  vs  {visitante}"
    p_j.font.size = Pt(13)
    p_j.font.bold = True
    p_j.font.color.rgb = COR_TEXTO

    p_o = tf_r2_2.add_paragraph()
    p_o.text = f"     📌 {obs}"
    p_o.font.size = Pt(11)
    p_o.font.color.rgb = COR_TEXTO_MUTED
    p_o.space_after = Pt(10)

# Salvar apresentação
output_filename = "Girabola_2026_Rodada1_Resumo_Oficial.pptx"
prs.save(output_filename)
print(f"✅ Apresentação gerada com sucesso: {output_filename}")
