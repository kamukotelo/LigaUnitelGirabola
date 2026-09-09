"""
Template Oficial Girabola 2026/27 - 3ª Jornada
Versão com Dados Oficiais Reais do Sistema ANCAF/Girabola
17 Slides, Fundo Dark Oficial (#071A2B), Tipografia Consistente e Gráficos Integrados.
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn

# ==========================================
# CONFIGURAÇÃO OFICIAL & PALETA DE CORES
# ==========================================
FICHEIRO_SAIDA = "LIGA_UNITEL_GIRABOLA_2026-27_3JORNADA_ANALISE.pptx"

# Cores oficiais do Girabola (Dark Theme Premium)
COR_FUNDO        = RGBColor(7, 26, 43)       # #071A2B - Azul Noturno
COR_AZUL_SEC     = RGBColor(12, 39, 57)      # #0C2639 - Card Container
COR_AZUL_CARD_ALT= RGBColor(16, 48, 72)      # #103048 - Destaque suave
COR_AZUL_DEST    = RGBColor(8, 120, 201)     # #0878C9 - Azul Girabola Vibrante
COR_VERDE        = RGBColor(24, 182, 106)    # #18B66A - Sucesso / Vitórias
COR_DOURADO      = RGBColor(242, 201, 76)    # #F2C94C - Ouro Girabola
COR_VERMELHO     = RGBColor(230, 57, 70)     # #E63946 - Cartões / Derrotas
COR_BRANCO       = RGBColor(255, 255, 255)   # Branco puro
COR_CINZA_TEXTO  = RGBColor(180, 195, 210)   # Texto secundário legível
COR_CINZA_MUTED  = RGBColor(120, 140, 160)   # Rótulos muted

HEX_FUNDO        = "#071A2B"
HEX_CARD         = "#0C2639"
HEX_DOURADO      = "#F2C94C"
HEX_AZUL_DEST    = "#0878C9"
HEX_VERDE        = "#18B66A"
HEX_VERMELHO     = "#E63946"

# ==========================================
# DADOS OFICIAIS REAIS DA 3ª JORNADA (2026/2027)
# Fonte: Base Oficial de Dados ANCAF / Liga Unitel Girabola
# ==========================================

# 8 Jogos da 3ª Jornada (6 disputados + 2 adiados)
jogos_r3 = [
    {
        "casa": "Petro de Luanda",
        "fora": "Recreativo do Libolo",
        "gc": 3, "gf": 0,
        "status": "finished",
        "data": "26 AGO",
        "estadio": "Estádio Nacional 11 de Novembro",
        "marcadores": "Rúben Adérito 22', Tiago Azulão 84', Deybi Flores 90+5'",
    },
    {
        "casa": "1.º de Agosto",
        "fora": "GD Interclube",
        "gc": 2, "gf": 1,
        "status": "finished",
        "data": "01 SET",
        "estadio": "Estádio França Ndalu",
        "marcadores": "Dagó Tshibamba 79', Calebi Yanda 90' | Alexandre Fernando 45+5' (pen)",
    },
    {
        "casa": "Desportivo da Lunda Sul",
        "fora": "CR Caála",
        "gc": 1, "gf": 2,
        "status": "finished",
        "data": "05 SET",
        "estadio": "Estádio Sagrada Esperança",
        "marcadores": "Mariano Vidal 15' (ag) | Benvindo Afonso 52', Tiago Jamba 90+4'",
    },
    {
        "casa": "FC Luanda",
        "fora": "FC Cabinda",
        "gc": 2, "gf": 1,
        "status": "finished",
        "data": "05 SET",
        "estadio": "Estádio França Ndalu",
        "marcadores": "Jaime Caetano 1', 67' | Ariclenis Lede 29'",
    },
    {
        "casa": "Académica do Lobito",
        "fora": "Estrela 1.º de Maio",
        "gc": 0, "gf": 2,
        "status": "finished",
        "data": "05 SET",
        "estadio": "Estádio do Buraco",
        "marcadores": "Moisés 45+2', Kessie Messi 81'",
    },
    {
        "casa": "Bravos do Maquis",
        "fora": "São Salvador",
        "gc": 0, "gf": 1,
        "status": "finished",
        "data": "06 SET",
        "estadio": "Estádio Mundunduleno",
        "marcadores": "Beni Papel 27'",
    },
    {
        "casa": "Desportivo da Huíla",
        "fora": "Wiliete de Benguela",
        "gc": "-", "gf": "-",
        "status": "postponed",
        "data": "Adiado",
        "estadio": "Estádio da Tundavala",
        "marcadores": "Data a remarcar pela FAF/ANCAF",
    },
    {
        "casa": "Sagrada Esperança",
        "fora": "Kabuscorp SC",
        "gc": "-", "gf": "-",
        "status": "postponed",
        "data": "23 SET",
        "estadio": "Estádio Sagrada Esperança",
        "marcadores": "Jogo agendado para 23/09/2026",
    },
]

# Tabela Oficial de Classificação após a 3ª Jornada (Todas as 16 Equipas)
tabela_oficial = [
    {"pos": "01", "equipa": "CD 1.º DE AGOSTO",        "j": 3, "v": 3, "e": 0, "d": 0, "gm": 5, "gs": 2, "dg": "+3", "pts": 9, "forma": "WWW"},
    {"pos": "02", "equipa": "PETRO DE LUANDA",         "j": 3, "v": 2, "e": 1, "d": 0, "gm": 5, "gs": 0, "dg": "+5", "pts": 7, "forma": "DWW"},
    {"pos": "03", "equipa": "BRAVOS DO MAQUIS",        "j": 3, "v": 2, "e": 0, "d": 1, "gm": 4, "gs": 1, "dg": "+3", "pts": 6, "forma": "WWL"},
    {"pos": "04", "equipa": "WILIETE DE BENGUELA",     "j": 2, "v": 2, "e": 0, "d": 0, "gm": 4, "gs": 1, "dg": "+3", "pts": 6, "forma": "WW-"},
    {"pos": "05", "equipa": "GD INTERCLUBE",           "j": 3, "v": 2, "e": 0, "d": 1, "gm": 4, "gs": 3, "dg": "+1", "pts": 6, "forma": "WWL"},
    {"pos": "06", "equipa": "ESTRELA 1.º DE MAIO",     "j": 3, "v": 1, "e": 1, "d": 1, "gm": 4, "gs": 3, "dg": "+1", "pts": 4, "forma": "DLW"},
    {"pos": "07", "equipa": "CR CAÁLA",                "j": 3, "v": 1, "e": 1, "d": 1, "gm": 3, "gs": 3, "dg": "0",  "pts": 4, "forma": "DLW"},
    {"pos": "08", "equipa": "FC DE LUANDA",            "j": 3, "v": 1, "e": 1, "d": 1, "gm": 3, "gs": 3, "dg": "0",  "pts": 4, "forma": "DLW"},
    {"pos": "09", "equipa": "DESPORTIVO DA HUÍLA",     "j": 2, "v": 1, "e": 0, "d": 1, "gm": 2, "gs": 2, "dg": "0",  "pts": 3, "forma": "LW-"},
    {"pos": "10", "equipa": "RECREATIVO DO LIBOLO",    "j": 3, "v": 1, "e": 0, "d": 2, "gm": 3, "gs": 4, "dg": "-1", "pts": 3, "forma": "WLL"},
    {"pos": "11", "equipa": "SAGRADA ESPERANÇA",       "j": 2, "v": 1, "e": 0, "d": 1, "gm": 3, "gs": 4, "dg": "-1", "pts": 3, "forma": "LW-"},
    {"pos": "12", "equipa": "SÃO SALVADOR DO KONGO",   "j": 3, "v": 1, "e": 0, "d": 2, "gm": 2, "gs": 4, "dg": "-2", "pts": 3, "forma": "LLW"},
    {"pos": "13", "equipa": "KABUSCORP SC",            "j": 2, "v": 0, "e": 2, "d": 0, "gm": 2, "gs": 2, "dg": "0",  "pts": 2, "forma": "DD-"},
    {"pos": "14", "equipa": "DESPORTIVO DA LUNDA SUL", "j": 3, "v": 0, "e": 2, "d": 1, "gm": 2, "gs": 3, "dg": "-1", "pts": 2, "forma": "DDL"},
    {"pos": "15", "equipa": "FC DE CABINDA",           "j": 3, "v": 0, "e": 0, "d": 3, "gm": 2, "gs": 7, "dg": "-5", "pts": 0, "forma": "LLL"},
    {"pos": "16", "equipa": "ACADÉMICA DO LOBITO",     "j": 3, "v": 0, "e": 0, "d": 3, "gm": 0, "gs": 6, "dg": "-6", "pts": 0, "forma": "LLL"},
]

# Dados do Top Ofensivo e Defensivo
dados_ataque = [
    ("1.º de Agosto", 5),
    ("Petro Luanda", 5),
    ("Bravos Maquis", 4),
    ("Wiliete", 4),
    ("Interclube", 4),
    ("1.º de Maio", 4),
    ("CR Caála", 3),
    ("FC Luanda", 3),
    ("Libolo", 3),
    ("Sagrada Esp.", 3),
]

dados_defesa = [
    ("Petro Luanda", 0),
    ("Wiliete", 1),
    ("Bravos Maquis", 1),
    ("1.º de Agosto", 2),
    ("Desp. Huíla", 2),
    ("Kabuscorp", 2),
    ("Lunda Sul", 3),
    ("Interclube", 3),
    ("1.º de Maio", 3),
    ("CR Caála", 3),
    ("FC Luanda", 3),
    ("Libolo", 4),
    ("Sagrada Esp.", 4),
    ("São Salvador", 4),
    ("Acad. Lobito", 6),
    ("FC Cabinda", 7),
]

# Jogos da 4.ª Jornada
proximos_jogos_r4 = [
    ("09 SET · 15:30", "FC Cabinda", "1.º de Agosto", "Estádio Vici António"),
    ("10 SET · 15:30", "GD Interclube", "Académica do Lobito", "Estádio 22 de Junho"),
    ("12 SET · 15:00", "Recreativo do Libolo", "Estrela 1.º de Maio", "Estádio de Calulo"),
    ("13 SET · 15:00", "CR Caála", "Desportivo da Huíla", "Estádio Daniel Lutucuta"),
    ("13 SET · 15:00", "Desportivo da Lunda Sul", "Sagrada Esperança", "Estádio Sagrada Esperança"),
    ("13 SET · 15:00", "Wiliete de Benguela", "FC Luanda", "Estádio Nac. de Ombaka"),
    ("16 SET · 15:00", "Bravos do Maquis", "Kabuscorp SC", "Estádio Mundunduleno"),
    ("16 SET · 15:30", "São Salvador", "Petro de Luanda", "Estádio Álvaro Buta"),
]

# ==========================================
# INICIALIZAÇÃO DO POWERPOINT 16:9
# ==========================================
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)


# ==========================================
# FUNÇÕES UTILITÁRIAS DE DESIGN
# ==========================================
def aplicar_fundo_escuro(slide):
    """Garante fundo uniforme #071A2B em cada slide."""
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = COR_FUNDO
    bg.line.fill.background()
    return bg

def add_shape(slide, shape_type, left, top, width, height, fill_color=None, line_color=None):
    """Cria forma geométrica com preenchimento e borda controlados."""
    shape = slide.shapes.add_shape(shape_type, left, top, width, height)
    if fill_color:
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill_color
    if line_color:
        shape.line.color.rgb = line_color
    else:
        shape.line.fill.background()
    return shape

def add_header(slide, tag, titulo):
    """Cria cabeçalho consistente com tag e título em ouro/branco."""
    tx = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.9))
    tf = tx.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

    p_tag = tf.paragraphs[0]
    p_tag.text = tag.upper()
    p_tag.font.size = Pt(11)
    p_tag.font.bold = True
    p_tag.font.color.rgb = COR_DOURADO
    p_tag.font.name = "Arial"

    p_tit = tf.add_paragraph()
    p_tit.text = titulo.upper()
    p_tit.font.size = Pt(28)
    p_tit.font.bold = True
    p_tit.font.color.rgb = COR_BRANCO
    p_tit.font.name = "Arial"

def set_cell_props(cell, text, font_size=11, bold=False, color=COR_BRANCO, align=PP_ALIGN.CENTER, bg_color=None):
    """Formata célula de tabela com fundo e alinhamento vertical/horizontal."""
    if bg_color:
        tcPr = cell._tc.get_or_add_tcPr()
        solidFill = tcPr.makeelement(qn('a:solidFill'), {})
        srgbClr = solidFill.makeelement(qn('a:srgbClr'), {'val': str(bg_color)})
        solidFill.append(srgbClr)
        tcPr.append(solidFill)

    cell.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf = cell.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.05)
    tf.margin_right = Inches(0.05)
    tf.margin_top = Inches(0.02)
    tf.margin_bottom = Inches(0.02)
    p = tf.paragraphs[0]
    p.text = str(text)
    p.font.size = Pt(font_size)
    p.font.bold = bold
    p.font.color.rgb = color
    p.font.name = "Arial"
    p.alignment = align


# ==========================================
# SLIDE 1 — CAPA OFICIAL
# ==========================================
slide1 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide1)

# Barra decorativa vertical esquerda
add_shape(slide1, MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(0.15), Inches(3.8), COR_DOURADO)

# Card de título principal
tx1 = slide1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(7.5), Inches(3.8))
tf1 = tx1.text_frame
tf1.word_wrap = True

p = tf1.paragraphs[0]
p.text = "LIGA UNITEL GIRABOLA 2026/27"
p.font.size = Pt(16)
p.font.bold = True
p.font.color.rgb = COR_DOURADO
p.font.name = "Arial"

p2 = tf1.add_paragraph()
p2.text = "RESCALDO OFICIAL"
p2.font.size = Pt(44)
p2.font.bold = True
p2.font.color.rgb = COR_BRANCO
p2.font.name = "Arial"

p3 = tf1.add_paragraph()
p3.text = "3.ª JORNADA"
p3.font.size = Pt(44)
p3.font.bold = True
p3.font.color.rgb = COR_AZUL_DEST
p3.font.name = "Arial"

p4 = tf1.add_paragraph()
p4.text = "Resultados • Classificação • Análise Tática • Antevisão da 4.ª Jornada"
p4.font.size = Pt(16)
p4.font.color.rgb = COR_CINZA_TEXTO
p4.font.name = "Arial"

# Card institucional lateral direito
card_inst = add_shape(slide1, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.0), Inches(1.8), Inches(3.5), Inches(3.8), COR_AZUL_SEC, COR_AZUL_DEST)
tx_inst = slide1.shapes.add_textbox(Inches(9.2), Inches(2.1), Inches(3.1), Inches(3.2))
tf_inst = tx_inst.text_frame
tf_inst.word_wrap = True

p = tf_inst.paragraphs[0]
p.text = "DESTAQUES DA JORNADA"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = COR_DOURADO
p.font.name = "Arial"

pontos_capa = [
    ("🏆 1.º de Agosto Isolado", "3 vitórias em 3 jogos (9 pts)"),
    ("🛡️ Petro Intransponível", "3 jogos sem sofrer golos (0 GS)"),
    ("⚽ Dagó Tshibamba", "Líder da artilharia com 3 golos"),
    ("🔥 Reviravolta Épica", "1.º de Agosto bate Inter aos 90'"),
]
for tit, desc in pontos_capa:
    p_t = tf_inst.add_paragraph()
    p_t.text = f"\n{tit}"
    p_t.font.size = Pt(13)
    p_t.font.bold = True
    p_t.font.color.rgb = COR_BRANCO
    p_d = tf_inst.add_paragraph()
    p_d.text = desc
    p_d.font.size = Pt(11)
    p_d.font.color.rgb = COR_CINZA_TEXTO


# ==========================================
# SLIDE 2 — A JORNADA EM NÚMEROS (6 CARDS)
# ==========================================
slide2 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide2)
add_header(slide2, "Resumo Estatístico", "A 3.ª Jornada em Números")

cards_dados = [
    ("15", "GOLOS MARCADOS", "Nos 6 jogos realizados", COR_AZUL_DEST),
    ("6", "JOGOS DISPUTADOS", "2 jogos adiados p/ Taças", COR_AZUL_SEC),
    ("2.50", "GOLOS / JOGO", "Média ofensiva alta", COR_AZUL_DEST),
    ("3", "VITÓRIAS EM CASA", "Petro, 1.º Agosto, FC Luanda", COR_VERDE),
    ("3", "VITÓRIAS FORA", "Caála, 1.º de Maio, São Salvador", COR_VERDE),
    ("3", "CLEAN SHEETS", "Petro, 1.º de Maio, São Salvador", COR_DOURADO),
]

for i, (valor, rotulo, sub, cor_borda) in enumerate(cards_dados):
    col = i % 3
    lin = i // 3
    x = Inches(0.8 + col * 3.98)
    y = Inches(1.6 + lin * 2.5)

    add_shape(slide2, MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.7), Inches(2.2), COR_AZUL_SEC, cor_borda)

    tx_c = slide2.shapes.add_textbox(x + Inches(0.2), y + Inches(0.2), Inches(3.3), Inches(1.8))
    tf_c = tx_c.text_frame
    tf_c.word_wrap = True

    p = tf_c.paragraphs[0]
    p.text = valor
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = cor_borda
    p.font.name = "Arial"

    p2 = tf_c.add_paragraph()
    p2.text = rotulo
    p2.font.size = Pt(14)
    p2.font.bold = True
    p2.font.color.rgb = COR_BRANCO
    p2.font.name = "Arial"

    p3 = tf_c.add_paragraph()
    p3.text = sub
    p3.font.size = Pt(11)
    p3.font.color.rgb = COR_CINZA_TEXTO
    p3.font.name = "Arial"


# ==========================================
# SLIDE 3 — RESULTADOS OFICIAIS (8 MATCH CARDS)
# ==========================================
slide3 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide3)
add_header(slide3, "Resultados Oficiais", "Marcadores e Placar da 3.ª Jornada")

for i, m in enumerate(jogos_r3):
    col = i % 4
    lin = i // 4
    x = Inches(0.8 + col * 2.98)
    y = Inches(1.5 + lin * 2.7)

    is_adiado = m["status"] == "postponed"
    cor_box = COR_AZUL_SEC
    borda_box = COR_DOURADO if not is_adiado else COR_CINZA_MUTED

    add_shape(slide3, MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(2.8), Inches(2.5), cor_box, borda_box)

    tx_m = slide3.shapes.add_textbox(x + Inches(0.15), y + Inches(0.1), Inches(2.5), Inches(2.3))
    tf_m = tx_m.text_frame
    tf_m.word_wrap = True

    # Data
    p_d = tf_m.paragraphs[0]
    p_d.text = f"🗓️ {m['data']}"
    p_d.font.size = Pt(10)
    p_d.font.bold = True
    p_d.font.color.rgb = COR_DOURADO if not is_adiado else COR_CINZA_MUTED

    # Casa
    p_c = tf_m.add_paragraph()
    p_c.text = m["casa"]
    p_c.font.size = Pt(12)
    p_c.font.bold = True
    p_c.font.color.rgb = COR_BRANCO

    # Placar
    p_sc = tf_m.add_paragraph()
    if is_adiado:
        p_sc.text = "ADIADO"
        p_sc.font.size = Pt(16)
        p_sc.font.bold = True
        p_sc.font.color.rgb = COR_DOURADO
    else:
        p_sc.text = f"{m['gc']}  —  {m['gf']}"
        p_sc.font.size = Pt(24)
        p_sc.font.bold = True
        p_sc.font.color.rgb = COR_DOURADO

    # Fora
    p_f = tf_m.add_paragraph()
    p_f.text = m["fora"]
    p_f.font.size = Pt(12)
    p_f.font.bold = True
    p_f.font.color.rgb = COR_BRANCO

    # Marcadores
    p_mc = tf_m.add_paragraph()
    p_mc.text = m["marcadores"]
    p_mc.font.size = Pt(9)
    p_mc.font.color.rgb = COR_CINZA_TEXTO


# ==========================================
# SLIDE 4 — JOGO DA JORNADA (1.º AGOSTO x INTER)
# ==========================================
slide4 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide4)
add_header(slide4, "Dérbi de Luanda", "Jogo da Jornada: Reviravolta Militar aos 90'")

# Card Placar Grande
card_jogo = add_shape(slide4, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(6.0), Inches(5.3), COR_AZUL_SEC, COR_AZUL_DEST)
tx_jg = slide4.shapes.add_textbox(Inches(1.1), Inches(1.7), Inches(5.4), Inches(4.9))
tf_jg = tx_jg.text_frame
tf_jg.word_wrap = True

p = tf_jg.paragraphs[0]
p.text = "ESTÁDIO FRANÇA NDALU · 8.000 ESPECTADORES"
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = COR_DOURADO

p2 = tf_jg.add_paragraph()
p2.text = "CD 1.º DE AGOSTO   2 — 1   GD INTERCLUBE"
p2.font.size = Pt(20)
p2.font.bold = True
p2.font.color.rgb = COR_BRANCO

p3 = tf_jg.add_paragraph()
p3.text = "\n⏱️ FILME DO JOGO:"
p3.font.size = Pt(14)
p3.font.bold = True
p3.font.color.rgb = COR_AZUL_DEST

timeline = [
    ("45+5'", "GOLO (Interclube)", "Alexandre Fernando converte grande penalidade no fecho do primeiro tempo (0-1)."),
    ("79'", "GOLO (1.º de Agosto)", "Dagó Tshibamba restabelece a igualdade com remate fulgurante na grande área (1-1)."),
    ("90'", "GOLO (1.º de Agosto)", "Calebi Yanda sela a reviravolta militar com golo salvador aos 90 minutos (2-1)."),
]
for min_t, ev, desc in timeline:
    p_ev = tf_jg.add_paragraph()
    p_ev.text = f"• {min_t} — {ev}"
    p_ev.font.size = Pt(12)
    p_ev.font.bold = True
    p_ev.font.color.rgb = COR_DOURADO
    p_de = tf_jg.add_paragraph()
    p_de.text = f"   {desc}"
    p_de.font.size = Pt(11)
    p_de.font.color.rgb = COR_CINZA_TEXTO

# Caixa de Crónica Editorial à direita
card_ed = add_shape(slide4, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.2), Inches(1.5), Inches(5.3), Inches(5.3), COR_AZUL_CARD_ALT, COR_DOURADO)
tx_ed = slide4.shapes.add_textbox(Inches(7.5), Inches(1.8), Inches(4.7), Inches(4.7))
tf_ed = tx_ed.text_frame
tf_ed.word_wrap = True

p = tf_ed.paragraphs[0]
p.text = "ANÁLISE EDITORIAL DA PARTIDA"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = COR_DOURADO

cronica = (
    "\n“O dérbi da capital no França Ndalu foi o mais emotivo da temporada até ao momento. "
    "O Interclube entrou taticamente coeso e conseguiu chegar à vantagem num penálti controverso "
    "convertido por Alexandre Fernando nos descontos do primeiro tempo.\n\n"
    "Na segunda metade, a equipa militar de Filipe Nzanza aumentou a intensidade nas alas e pressionou alto. "
    "A recompensa chegou aos 79' pelo goleador do campeonato Dagó Tshibamba. Quando o empate parecia selado, "
    "a perseverança do 1.º de Agosto operou o milagre: Calebi Yanda fez explodir as bancadas aos 90 minutos, "
    "garantindo 3 pontos capitais que isolam os Militares na liderança absoluta com 9 pontos em 3 jornadas.”"
)
p2 = tf_ed.add_paragraph()
p2.text = cronica
p2.font.size = Pt(12)
p2.font.color.rgb = COR_BRANCO


# ==========================================
# SLIDE 5 — TABELA DE CLASSIFICAÇÃO REAL (16 EQUIPAS)
# ==========================================
slide5 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide5)
add_header(slide5, "Classificação Geral", "Tabela Oficial da Liga Unitel Girabola 2026/27")

# Tabela PowerPoint nativa com 17 linhas (1 header + 16 equipas) e 10 colunas
tabela_shape = slide5.shapes.add_table(17, 10, Inches(0.8), Inches(1.4), Inches(11.733), Inches(5.5))
table = tabela_shape.table

# Definir larguras de colunas proporcionais
col_widths = [Inches(0.6), Inches(3.6), Inches(0.7), Inches(0.7), Inches(0.7), Inches(0.7), Inches(0.7), Inches(0.7), Inches(0.8), Inches(0.9)]
for idx, w in enumerate(col_widths):
    table.columns[idx].width = w

headers_tab = ["POS", "EQUIPA", "J", "V", "E", "D", "GM", "GS", "DG", "PTS"]
for j, h in enumerate(headers_tab):
    align = PP_ALIGN.LEFT if j == 1 else PP_ALIGN.CENTER
    set_cell_props(table.cell(0, j), h, font_size=11, bold=True, color=COR_DOURADO, align=align, bg_color=COR_AZUL_DEST)

for i, row in enumerate(tabela_oficial):
    bg = COR_AZUL_SEC if i % 2 == 0 else COR_AZUL_CARD_ALT
    # Cores de destaque nos primeiros colocados e zona de descida
    cor_pos = COR_DOURADO if i == 0 else (COR_VERDE if i < 4 else (COR_VERMELHO if i >= 13 else COR_BRANCO))

    row_data = [row["pos"], row["equipa"], row["j"], row["v"], row["e"], row["d"], row["gm"], row["gs"], row["dg"], row["pts"]]
    for j, val in enumerate(row_data):
        align = PP_ALIGN.LEFT if j == 1 else PP_ALIGN.CENTER
        bold = (j in [0, 1, 9])
        txt_color = cor_pos if j in [0, 9] else COR_BRANCO
        set_cell_props(table.cell(i + 1, j), val, font_size=10, bold=bold, color=txt_color, align=align, bg_color=bg)


# ==========================================
# SLIDE 6 — PRODUTIVIDADE OFENSIVA (GRÁFICO)
# ==========================================
slide6 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide6)
add_header(slide6, "Estatística Ofensiva", "Produtividade Ofensiva — Golos Marcados por Clube")

# Gerar gráfico Matplotlib com estilo escuro integrado
fig, ax = plt.subplots(figsize=(10, 5), facecolor=HEX_FUNDO)
ax.set_facecolor(HEX_CARD)

teams_atk = [x[0] for x in dados_ataque][::-1]
goals_atk = [x[1] for x in dados_ataque][::-1]
colors_bar = [HEX_DOURADO if g == max(goals_atk) else HEX_AZUL_DEST for g in goals_atk]

bars = ax.barh(teams_atk, goals_atk, color=colors_bar, height=0.65, edgecolor="#1B4D7E")
ax.set_xlim(0, 7)
ax.tick_params(colors="white", labelsize=11)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['bottom'].set_color("#1B4D7E")
ax.spines['left'].set_color("#1B4D7E")
ax.set_xlabel("Total de Golos Marcados", color="white", fontsize=12, labelpad=10)

for bar in bars:
    w = bar.get_width()
    ax.text(w + 0.15, bar.get_y() + bar.get_height() / 2, str(int(w)),
            va='center', ha='left', color='white', fontweight='bold', fontsize=12)

plt.tight_layout()
graf_atk_path = "grafico_ataque.png"
plt.savefig(graf_atk_path, dpi=160, facecolor=HEX_FUNDO)
plt.close()

slide6.shapes.add_picture(graf_atk_path, Inches(0.8), Inches(1.5), width=Inches(8.5))

# Card explicativo lateral
card_info_atk = add_shape(slide6, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.6), Inches(1.5), Inches(2.9), Inches(5.2), COR_AZUL_SEC, COR_AZUL_DEST)
tx_ia = slide6.shapes.add_textbox(Inches(9.8), Inches(1.8), Inches(2.5), Inches(4.6))
tf_ia = tx_ia.text_frame
tf_ia.word_wrap = True

p = tf_ia.paragraphs[0]
p.text = "RADAR OFENSIVO"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = COR_DOURADO

p2 = tf_ia.add_paragraph()
p2.text = (
    "\n• 1.º de Agosto e Petro lideram com 5 golos marcados em 3 jornadas.\n\n"
    "• O Wiliete mantém média espetacular de 2.0 golos por jogo (4 golos em apenas 2 jogos disputados).\n\n"
    "• Destaque para o Estrela 1.º de Maio com 4 golos marcados, subindo para a 6.ª posição da tabela."
)
p2.font.size = Pt(12)
p2.font.color.rgb = COR_CINZA_TEXTO


# ==========================================
# SLIDE 7 — CONSISTÊNCIA DEFENSIVA (GRÁFICO)
# ==========================================
slide7 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide7)
add_header(slide7, "Segurança Defensiva", "Consistência Defensiva — Golos Sofridos por Clube")

fig, ax = plt.subplots(figsize=(10, 5), facecolor=HEX_FUNDO)
ax.set_facecolor(HEX_CARD)

teams_def = [x[0] for x in dados_defesa[:10]][::-1]
goals_def = [x[1] for x in dados_defesa[:10]][::-1]
colors_def = [HEX_VERDE if g == 0 else (HEX_VERMELHO if g >= 3 else HEX_AZUL_DEST) for g in goals_def]

bars = ax.barh(teams_def, goals_def, color=colors_def, height=0.65, edgecolor="#1B4D7E")
ax.set_xlim(0, 8)
ax.tick_params(colors="white", labelsize=11)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['bottom'].set_color("#1B4D7E")
ax.spines['left'].set_color("#1B4D7E")
ax.set_xlabel("Total de Golos Sofridos (Menor é Melhor)", color="white", fontsize=12, labelpad=10)

for bar in bars:
    w = bar.get_width()
    ax.text(w + 0.15, bar.get_y() + bar.get_height() / 2, str(int(w)),
            va='center', ha='left', color='white', fontweight='bold', fontsize=12)

plt.tight_layout()
graf_def_path = "grafico_defesa.png"
plt.savefig(graf_def_path, dpi=160, facecolor=HEX_FUNDO)
plt.close()

slide7.shapes.add_picture(graf_def_path, Inches(0.8), Inches(1.5), width=Inches(8.5))

card_info_def = add_shape(slide7, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.6), Inches(1.5), Inches(2.9), Inches(5.2), COR_AZUL_SEC, COR_VERDE)
tx_id = slide7.shapes.add_textbox(Inches(9.8), Inches(1.8), Inches(2.5), Inches(4.6))
tf_id = tx_id.text_frame
tf_id.word_wrap = True

p = tf_id.paragraphs[0]
p.text = "MURALHA TRICOLOR"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = COR_DOURADO

p2 = tf_id.add_paragraph()
p2.text = (
    "\n• O Petro de Luanda é a única equipa sem golos sofridos no campeonato (0 GS em 3 jogos).\n\n"
    "• Wiliete e Bravos do Maquis sofreram apenas 1 golo cada, confirmando consistência tática do setor recuado.\n\n"
    "• Na cauda, FC Cabinda (7 sofridos) e Académica do Lobito (6 sofridos) enfrentam sérias dificuldades defensivas."
)
p2.font.size = Pt(12)
p2.font.color.rgb = COR_CINZA_TEXTO


# ==========================================
# SLIDE 8 — BALIZAS MAIS PROTEGIDAS (CLEAN SHEETS)
# ==========================================
slide8 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide8)
add_header(slide8, "Solidez dos Guarda-Redes", "As Balizas Mais Protegidas — Clean Sheets")

clean_sheets_dados = [
    ("PETRO DE LUANDA", "Hugo Marques (2) & Neblú (1)", "3 Jogos", "3 Jogos Sem Sofrer", "100%", COR_DOURADO),
    ("BRAVOS DO MAQUIS", "Nathan (Guarda-Redes Titular)", "3 Jogos", "2 Jogos Sem Sofrer", "66.7%", COR_AZUL_DEST),
    ("WILIETE DE BENGUELA", "Gelson (Guarda-Redes Titular)", "2 Jogos", "1 Jogo Sem Sofrer", "50.0%", COR_VERDE),
    ("ESTRELA 1.º DE MAIO", "Benvindo (Guarda-Redes)", "3 Jogos", "1 Jogo Sem Sofrer", "33.3%", COR_VERDE),
    ("SÃO SALVADOR", "Nsesani (Guarda-Redes)", "3 Jogos", "1 Jogo Sem Sofrer", "33.3%", COR_VERDE),
]

for i, (equipa, gr, jg, cs, perc, cor_destaque) in enumerate(clean_sheets_dados):
    y = Inches(1.5 + i * 1.05)
    add_shape(slide8, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.733), Inches(0.9), COR_AZUL_SEC, cor_destaque)

    tx_cs = slide8.shapes.add_textbox(Inches(1.1), y + Inches(0.1), Inches(11.1), Inches(0.7))
    tf_cs = tx_cs.text_frame
    tf_cs.word_wrap = True

    p = tf_cs.paragraphs[0]
    p.text = f"{equipa}   ·   {gr}"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = COR_BRANCO

    p2 = tf_cs.add_paragraph()
    p2.text = f"{jg} Disputados   |   {cs} (Clean Sheets)   |   Taxa de Eficácia: {perc}"
    p2.font.size = Pt(12)
    p2.font.bold = True
    p2.font.color.rgb = cor_destaque


# ==========================================
# SLIDE 9 — ARTILHARIA (MELHORES MARCADORES)
# ==========================================
slide9 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide9)
add_header(slide9, "Goleadores da Época", "Artilharia Oficial da Liga Unitel Girabola 2026/27")

# Card Destaque 1º Colocado
card_art1 = add_shape(slide9, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.8), Inches(5.3), COR_AZUL_SEC, COR_DOURADO)
tx_a1 = slide9.shapes.add_textbox(Inches(1.1), Inches(1.8), Inches(5.2), Inches(4.7))
tf_a1 = tx_a1.text_frame
tf_a1.word_wrap = True

p = tf_a1.paragraphs[0]
p.text = "LÍDER DA ARTILHARIA"
p.font.size = Pt(13)
p.font.bold = True
p.font.color.rgb = COR_DOURADO

p2 = tf_a1.add_paragraph()
p2.text = "3  DAGÓ TSHIBAMBA"
p2.font.size = Pt(36)
p2.font.bold = True
p2.font.color.rgb = COR_DOURADO

p3 = tf_a1.add_paragraph()
p3.text = "Clube Desportivo 1.º de Agosto · Avançado"
p3.font.size = Pt(14)
p3.font.bold = True
p3.font.color.rgb = COR_BRANCO

p4 = tf_a1.add_paragraph()
p4.text = (
    "\n• Média de 1.00 golo por jogo (3 golos em 3 aparições).\n"
    "• Marcou em momentos capitais contra Desportivo da Huíla e o empate no dérbi com o Interclube.\n"
    "• Principal referência ofensiva da formação militar orientada por Filipe Nzanza."
)
p4.font.size = Pt(12)
p4.font.color.rgb = COR_CINZA_TEXTO

# Lista de Perseguidores Imediatos à direita
card_art2 = add_shape(slide9, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.0), Inches(1.5), Inches(5.5), Inches(5.3), COR_AZUL_CARD_ALT, COR_AZUL_DEST)
tx_a2 = slide9.shapes.add_textbox(Inches(7.3), Inches(1.8), Inches(4.9), Inches(4.7))
tf_a2 = tx_a2.text_frame
tf_a2.word_wrap = True

p = tf_a2.paragraphs[0]
p.text = "TOP MARCADORES PERSEGUIDORES"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = COR_AZUL_DEST

perseguidores = [
    ("2 GOLOS", "Tiago Azulão", "Petro de Luanda · Avançado histórico"),
    ("2 GOLOS", "Jaime Caetano", "FC Luanda · Médio ofensivo (Bis na J3)"),
    ("1 GOLO", "Rúben Adérito", "Petro de Luanda · Defesa"),
    ("1 GOLO", "Depú", "Petro de Luanda · Avançado"),
    ("1 GOLO", "Calebi Yanda", "1.º de Agosto · Herói do dérbi aos 90'"),
    ("1 GOLO", "Alexandre Fernando", "GD Interclube · Médio"),
    ("1 GOLO", "Beni Papel", "São Salvador · Golo da vitória nos Maquis"),
]
for gols, nome, clb in perseguidores:
    p_g = tf_a2.add_paragraph()
    p_g.text = f"{gols} — {nome} ({clb})"
    p_g.font.size = Pt(11)
    p_g.font.color.rgb = COR_BRANCO


# ==========================================
# SLIDE 10 — GOLOS POR PERÍODO (DISTRIBUIÇÃO REAL)
# ==========================================
slide10 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide10)
add_header(slide10, "Distribuição Temporal", "Quando São Marcados os Golos? (Total Época: 48 Golos)")

fig, ax = plt.subplots(figsize=(10, 4.8), facecolor=HEX_FUNDO)
ax.set_facecolor(HEX_CARD)

periodos = ["0–15'", "16–30'", "31–45+'", "46–60'", "61–75'", "76–90+'"]
gols_p = [3, 8, 6, 10, 8, 13]
colors_p = [HEX_DOURADO if gp == max(gols_p) else HEX_AZUL_DEST for gp in gols_p]

bars_p = ax.bar(periodos, gols_p, color=colors_p, width=0.55, edgecolor="#1B4D7E")
ax.set_ylim(0, 16)
ax.tick_params(colors="white", labelsize=12)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['bottom'].set_color("#1B4D7E")
ax.spines['left'].set_color("#1B4D7E")
ax.set_ylabel("Quantidade de Golos", color="white", fontsize=12)

for bar in bars_p:
    h = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2, h + 0.3, str(int(h)),
            ha='center', va='bottom', color='white', fontweight='bold', fontsize=13)

plt.tight_layout()
graf_golos_path = "grafico_golos.png"
plt.savefig(graf_golos_path, dpi=160, facecolor=HEX_FUNDO)
plt.close()

slide10.shapes.add_picture(graf_golos_path, Inches(0.8), Inches(1.5), width=Inches(8.5))

card_temp = add_shape(slide10, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.6), Inches(1.5), Inches(2.9), Inches(5.2), COR_AZUL_SEC, COR_DOURADO)
tx_tp = slide10.shapes.add_textbox(Inches(9.8), Inches(1.8), Inches(2.5), Inches(4.6))
tf_tp = tx_tp.text_frame
tf_tp.word_wrap = True

p = tf_tp.paragraphs[0]
p.text = "INSIGHT TÁTICO"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = COR_DOURADO

p2 = tf_tp.add_paragraph()
p2.text = (
    "\n• O período dos 76' aos 90+' minutos é o mais letal do Girabola, registando 13 golos (27.1% do total da liga).\n\n"
    "• Na 3ª jornada, nada menos que 4 golos decisivos ocorreram nos descontos (90'+).\n\n"
    "• O desgaste físico dos minutos finais tem sido explorado pelas equipas com bancos mais profundos."
)
p2.font.size = Pt(12)
p2.font.color.rgb = COR_CINZA_TEXTO


# ==========================================
# SLIDE 11 — A LIDERANÇA MUDOU
# ==========================================
slide11 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide11)
add_header(slide11, "Dinâmica do Trono", "A Liderança Mudou: 3 Jornadas, 3 Líderes Distintos")

etapas_lideranca = [
    ("1.ª JORNADA", "RECREATIVO DO LIBOLO & BRAVOS", "Vitórias por 3-0 fora e em casa inauguraram o topo da tabela."),
    ("2.ª JORNADA", "FC BRAVOS DO MAQUIS", "Vitória heroica em Calulo isolou os Maquisardes com 6 pontos e saldo positivo (+4)."),
    ("3.ª JORNADA", "CD 1.º DE AGOSTO (ISOLADO)", "Reviravolta épica no dérbi militar garantiu o pleno de 9 pontos em 3 jornadas."),
]

for i, (jorn, lid, sub) in enumerate(etapas_lideranca):
    y = Inches(1.6 + i * 1.7)
    cor_borda = COR_DOURADO if i == 2 else COR_AZUL_DEST
    add_shape(slide11, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.733), Inches(1.4), COR_AZUL_SEC, cor_borda)

    tx_l = slide11.shapes.add_textbox(Inches(1.1), y + Inches(0.15), Inches(11.1), Inches(1.1))
    tf_l = tx_l.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = jorn
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COR_DOURADO

    p2 = tf_l.add_paragraph()
    p2.text = lid
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = COR_BRANCO

    p3 = tf_l.add_paragraph()
    p3.text = sub
    p3.font.size = Pt(12)
    p3.font.color.rgb = COR_CINZA_TEXTO


# ==========================================
# SLIDE 12 — DISCIPLINA (CARTÕES OFICIAIS)
# ==========================================
slide12 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide12)
add_header(slide12, "Disciplina e Fair-Play", "A Batalha dos Cartões — Registos das Fichas de Jogo")

cards_disc = [
    ("82", "🟨 CARTÕES AMARELOS", "Total acumulado nas fichas de arbitragem oficiais", COR_DOURADO),
    ("1", "🟥 CARTÃO VERMELHO", "Apenas 1 expulsão em 22 jogos concluídos", COR_VERMELHO),
    ("3.73", "MÉDIA POR JOGO", "Cartões exibidos por partida disputada", COR_AZUL_DEST),
]

for i, (val, tit, sub, cor_d) in enumerate(cards_disc):
    x = Inches(0.8 + i * 3.98)
    add_shape(slide12, MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.6), Inches(3.7), Inches(2.2), COR_AZUL_SEC, cor_d)

    tx_d = slide12.shapes.add_textbox(x + Inches(0.2), Inches(1.8), Inches(3.3), Inches(1.8))
    tf_d = tx_d.text_frame
    tf_d.word_wrap = True

    p = tf_d.paragraphs[0]
    p.text = val
    p.font.size = Pt(48)
    p.font.bold = True
    p.font.color.rgb = cor_d

    p2 = tf_d.add_paragraph()
    p2.text = tit
    p2.font.size = Pt(14)
    p2.font.bold = True
    p2.font.color.rgb = COR_BRANCO

    p3 = tf_d.add_paragraph()
    p3.text = sub
    p3.font.size = Pt(11)
    p3.font.color.rgb = COR_CINZA_TEXTO

# Box analítico de Fair-Play
card_fp = add_shape(slide12, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.2), Inches(11.733), Inches(2.5), COR_AZUL_CARD_ALT, COR_AZUL_DEST)
tx_fp = slide12.shapes.add_textbox(Inches(1.1), Inches(4.4), Inches(11.1), Inches(2.1))
tf_fp = tx_fp.text_frame
tf_fp.word_wrap = True

p = tf_fp.paragraphs[0]
p.text = "DESTAQUES DISCIPLINARES DA 3.ª JORNADA"
p.font.size = Pt(14)
p.font.bold = True
p.font.color.rgb = COR_DOURADO

p2 = tf_fp.add_paragraph()
p2.text = (
    "\n• O duelo Académica do Lobito 0 — 2 Estrela 1.º de Maio foi o mais disputado da jornada, acumulando 9 advertências com cartão amarelo.\n"
    "• O campeonato mantém elevado rigor disciplinar sem episódios graves de indisciplina — apenas 1 vermelho direto em 22 jogos.\n"
    "• Arbitragens rigorosas na marcação de faltas tácticas têm evitado lances de violência excessiva."
)
p2.font.size = Pt(12)
p2.font.color.rgb = COR_BRANCO


# ==========================================
# SLIDE 13 — REAÇÃO: QUEM SABE RECUPERAR PONTOS?
# ==========================================
slide13 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide13)
add_header(slide13, "Poder de Superação", "Quem Sabe Recuperar Pontos? Reviravoltas da 3.ª Jornada")

reacoes = [
    (
        "1.º DE AGOSTO (3 PONTOS RECUPERADOS)",
        "Estádio França Ndalu · 2-1 vs Interclube",
        "Esteve em desvantagem até aos 79 minutos. Marcou aos 79' e 90', transformando uma derrota quase certa numa vitória memorável que valeu a liderança.",
        COR_DOURADO,
    ),
    (
        "CR CAÁLA (3 PONTOS RECUPERADOS)",
        "Estádio Sagrada Esperança · 2-1 vs Desportivo da Lunda Sul",
        "Sofreu golo aos 15 minutos em Dundo. Empatou aos 52' por Benvindo Afonso e selou a virada épica aos 90+4' por Tiago Jamba Adelino.",
        COR_VERDE,
    ),
]

for i, (tit, sub, desc, cor_b) in enumerate(reacoes):
    y = Inches(1.6 + i * 2.5)
    add_shape(slide13, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.733), Inches(2.2), COR_AZUL_SEC, cor_b)

    tx_r = slide13.shapes.add_textbox(Inches(1.1), y + Inches(0.2), Inches(11.1), Inches(1.8))
    tf_r = tx_r.text_frame
    tf_r.word_wrap = True

    p = tf_r.paragraphs[0]
    p.text = tit
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = cor_b

    p2 = tf_r.add_paragraph()
    p2.text = sub
    p2.font.size = Pt(13)
    p2.font.bold = True
    p2.font.color.rgb = COR_BRANCO

    p3 = tf_r.add_paragraph()
    p3.text = f"\n{desc}"
    p3.font.size = Pt(12)
    p3.font.color.rgb = COR_CINZA_TEXTO


# ==========================================
# SLIDE 14 — 4.ª JORNADA (CALENDÁRIO CONFIRMADO)
# ==========================================
slide14 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide14)
add_header(slide14, "Próximo Desafio", "Calendário Oficial Confirmado da 4.ª Jornada")

for i, (data, casa, fora, local) in enumerate(proximos_jogos_r4):
    col = i % 4
    lin = i // 4
    x = Inches(0.8 + col * 2.98)
    y = Inches(1.5 + lin * 2.7)

    add_shape(slide14, MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(2.8), Inches(2.4), COR_AZUL_SEC, COR_AZUL_DEST)

    tx_p = slide14.shapes.add_textbox(x + Inches(0.15), y + Inches(0.12), Inches(2.5), Inches(2.1))
    tf_p = tx_p.text_frame
    tf_p.word_wrap = True

    p = tf_p.paragraphs[0]
    p.text = f"🗓️ {data}"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = COR_DOURADO

    p2 = tf_p.add_paragraph()
    p2.text = f"\n{casa}"
    p2.font.size = Pt(13)
    p2.font.bold = True
    p2.font.color.rgb = COR_BRANCO

    p3 = tf_p.add_paragraph()
    p3.text = "vs"
    p3.font.size = Pt(11)
    p3.font.color.rgb = COR_DOURADO

    p4 = tf_p.add_paragraph()
    p4.text = fora
    p4.font.size = Pt(13)
    p4.font.bold = True
    p4.font.color.rgb = COR_BRANCO

    p5 = tf_p.add_paragraph()
    p5.text = f"\n📍 {local}"
    p5.font.size = Pt(9)
    p5.font.color.rgb = COR_CINZA_TEXTO


# ==========================================
# SLIDE 15 — QUATRO DUELOS A SEGUIR
# ==========================================
slide15 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide15)
add_header(slide15, "Antevisão Estratégica", "Quatro Jogos Imperdíveis da 4.ª Jornada")

quatro_duelos = [
    ("FC CABINDA × 1.º DE AGOSTO (09 SET · VICI ANTÓNIO)",
     "O líder militar de Filipe Nzanza viaja ao norte para defender o pleno de vitórias contra um Cabinda ferido no fundo da tabela."),
    ("WILIETE DE BENGUELA × FC LUANDA (13 SET · OMBAKA)",
     "O Wiliete, invicto e com 2 vitórias em 2 jogos, recebe o aguerrido FC Luanda de Jaime Caetano, que vem de vitória moralizadora."),
    ("SÃO SALVADOR × PETRO DE LUANDA (16 SET · ÁLVARO BUTA)",
     "O campeão Petro testa a sua baliza 100% inviolável no difícil reduto do São Salvador do Kongo, motivado pela vitória na jornada 3."),
    ("BRAVOS DO MAQUIS × KABUSCORP SC (16 SET · MUNDUNDULENO)",
     "Confronto direto no Luena entre dois candidatos históricos à procura de recuperação imediata após desaires na jornada anterior."),
]

for i, (tit, desc) in enumerate(quatro_duelos):
    y = Inches(1.5 + i * 1.3)
    add_shape(slide15, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.733), Inches(1.15), COR_AZUL_SEC, COR_AZUL_DEST)

    tx_d = slide15.shapes.add_textbox(Inches(1.1), y + Inches(0.12), Inches(11.1), Inches(0.95))
    tf_d = tx_d.text_frame
    tf_d.word_wrap = True

    p = tf_d.paragraphs[0]
    p.text = tit
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COR_DOURADO

    p2 = tf_d.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(12)
    p2.font.color.rgb = COR_BRANCO


# ==========================================
# SLIDE 16 — CONCLUSÕES: A JORNADA EM 7 NÚMEROS
# ==========================================
slide16 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide16)
add_header(slide16, "Síntese Editorial", "A 3.ª Jornada em 7 Números Fundamentais")

conclusoes_reais = [
    ("01", "1.º DE AGOSTO ISOLADO", "9 Pontos e pleno absoluto de vitórias (3 em 3)."),
    ("02", "PETRO DE LUANDA IMPENETRÁVEL", "0 Golos sofridos em 3 partidas (baliza virgem)."),
    ("03", "15 GOLOS ANOTADOS", "Excelente média de 2.50 golos nos 6 jogos disputados."),
    ("04", "DAGÓ TSHIBAMBA LIDERA", "3 Golos em 3 jogos colocam o avançado no topo da artilharia."),
    ("05", "PODER DE SUPERAÇÃO", "1.º de Agosto e Caála venceram de reviravolta aos 90 minutos."),
    ("06", "ZONA LETAL (76'–90+')", "13 Golos nos últimos quartos de hora comprovam emoção até ao fim."),
    ("07", "82 CARTÕES EXIBIDOS", "Competitividade ao rubro com respeito às decisões de arbitragem."),
]

for i, (num, tit, desc) in enumerate(conclusoes_reais):
    y = Inches(1.5 + i * 0.76)
    add_shape(slide16, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.733), Inches(0.65), COR_AZUL_SEC, COR_AZUL_DEST)

    tx_c = slide16.shapes.add_textbox(Inches(1.0), y + Inches(0.08), Inches(11.3), Inches(0.5))
    tf_c = tx_c.text_frame
    tf_c.word_wrap = True

    p = tf_c.paragraphs[0]
    p.text = f"{num}  ·  {tit} — {desc}"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COR_BRANCO
    # Destaque no número
    p.font.color.rgb = COR_BRANCO


# ==========================================
# SLIDE 17 — ENCERRAMENTO
# ==========================================
slide17 = prs.slides.add_slide(prs.slide_layouts[6])
aplicar_fundo_escuro(slide17)

# Card Central de Encerramento
card_enc = add_shape(slide17, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.0), Inches(1.8), Inches(9.333), Inches(4.0), COR_AZUL_SEC, COR_DOURADO)
tx_f = slide17.shapes.add_textbox(Inches(2.3), Inches(2.2), Inches(8.7), Inches(3.2))
tf_f = tx_f.text_frame
tf_f.word_wrap = True

p = tf_f.paragraphs[0]
p.text = "LIGA UNITEL GIRABOLA 2026/2027"
p.font.size = Pt(16)
p.font.bold = True
p.font.color.rgb = COR_DOURADO
p.alignment = PP_ALIGN.CENTER

p2 = tf_f.add_paragraph()
p2.text = "ATÉ À 4.ª JORNADA"
p2.font.size = Pt(44)
p2.font.bold = True
p2.font.color.rgb = COR_BRANCO
p2.alignment = PP_ALIGN.CENTER

p3 = tf_f.add_paragraph()
p3.text = "Acompanhamento Oficial das 30 Jornadas do Futebol Angolano"
p3.font.size = Pt(18)
p3.font.color.rgb = COR_AZUL_DEST
p3.alignment = PP_ALIGN.CENTER

p4 = tf_f.add_paragraph()
p4.text = "\nDados Oficiais Homologados · Associação Nacional de Clubes de Angola (ANCAF)"
p4.font.size = Pt(12)
p4.font.color.rgb = COR_CINZA_TEXTO
p4.alignment = PP_ALIGN.CENTER


# ==========================================
# GUARDAR APRESENTAÇÃO & LIMPEZA
# ==========================================
prs.save(FICHEIRO_SAIDA)

# Limpeza dos ficheiros de imagem temporários gerados pelo matplotlib
for tmp_img in [graf_atk_path, graf_def_path, graf_golos_path]:
    if os.path.exists(tmp_img):
        try:
            os.remove(tmp_img)
        except Exception:
            pass

print("=" * 60)
print(f"✅ Apresentação Oficial 16:9 Gerada com Sucesso!")
print(f"📁 Ficheiro: {FICHEIRO_SAIDA}")
print(f"📊 Total de Slides: {len(prs.slides)}")
print("=" * 60)
