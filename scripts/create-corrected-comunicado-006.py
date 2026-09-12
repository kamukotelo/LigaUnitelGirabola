"""Produce a visibly corrected portal copy without overwriting the supplied source PDF."""
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/nsungukamukotelo/Downloads/CO.6-DCE-ANCAF-2026.pdf')
DEST = ROOT / 'public/comunicados/comunicado-006-2026'
OUTPUT = DEST / 'comunicado-006-dce-ancaf-2026.pdf'
FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'

original = fitz.open(SOURCE)
page_rect = original[0].rect
doc = fitz.open()
page = doc.new_page(width=page_rect.width, height=page_rect.height)
page.show_pdf_page(page.rect, original, 0)
page.insert_font(fontname='ArialCustom', fontfile=FONT)

# Replace the one superseded fixture inside the 6th-round schedule image.
# The source's schedule is embedded as artwork, so cover only this row.
page.draw_rect(fitz.Rect(40.5, 421.7, 171.7, 444.7), color=None, fill=(1, 1, 1))
page.insert_text((43, 429.4), 'Desportivo da Huíla', fontname='ArialCustom', fontsize=5.8, color=(0.15, 0.15, 0.15))
page.insert_text((118, 429.4), 'São Salvador', fontname='ArialCustom', fontsize=5.8, color=(0.15, 0.15, 0.15))
page.insert_text((85, 429.4), '— : —', fontname='ArialCustom', fontsize=7, color=(0.15, 0.15, 0.15))
page.insert_text((71, 436.8), 'Domingo, 11/10 - 15:30', fontname='ArialCustom', fontsize=5.8, color=(0.1, 0.1, 0.1))
page.draw_line((43, 441.5), (169, 441.5), color=(0.8, 0.8, 0.8), width=0.3)

add = doc.new_page(width=page_rect.width, height=page_rect.height)
add.insert_font(fontname='ArialCustom', fontfile=FONT)
add.draw_rect(add.rect, color=None, fill=(1, 1, 1))
add.draw_rect(fitz.Rect(0, 0, page_rect.width, 13), color=None, fill=(0.92, 0.30, 0.13))
add.insert_text((55, 82), 'ATUALIZAÇÃO DA PROGRAMAÇÃO', fontname='ArialCustom', fontsize=17, color=(0.14, 0.18, 0.22))
add.insert_text((55, 106), 'Liga Unitel Girabola 2026/2027 - 5.ª e 6.ª jornadas', fontname='ArialCustom', fontsize=10, color=(0.34, 0.39, 0.43))
add.draw_line((55, 128), (540, 128), color=(0.85, 0.87, 0.88), width=1)

def fixture(y, round_label, teams, when, stadium):
    add.draw_rect(fitz.Rect(55, y, 540, y + 118), color=(0.86, 0.87, 0.88), fill=(0.98, 0.98, 0.98), width=0.7)
    add.draw_rect(fitz.Rect(55, y, 60, y + 118), color=None, fill=(0.92, 0.30, 0.13))
    add.insert_text((75, y + 25), round_label, fontname='ArialCustom', fontsize=10, color=(0.55, 0.17, 0.07))
    add.insert_text((75, y + 52), teams, fontname='ArialCustom', fontsize=15, color=(0.14, 0.18, 0.22))
    add.insert_text((75, y + 78), when, fontname='ArialCustom', fontsize=11, color=(0.14, 0.18, 0.22))
    add.insert_text((75, y + 98), stadium, fontname='ArialCustom', fontsize=9, color=(0.38, 0.42, 0.44))

fixture(160, '5.ª JORNADA', 'CD da Huíla x Académica do Lobito', 'Domingo, 20/09/2026 - 15:30', 'Estádio da Tundavala')
fixture(305, '6.ª JORNADA', 'CD da Huíla x São Salvador', 'Domingo, 11/10/2026 - 15:30', 'Estádio da Tundavala')
add.insert_text((55, 477), 'Retificação dos dois horários e datas indicados pelo utilizador.', fontname='ArialCustom', fontsize=9, color=(0.34, 0.39, 0.43))
add.insert_text((55, 493), 'Os restantes jogos do Comunicado 006 mantêm a programação apresentada.', fontname='ArialCustom', fontsize=9, color=(0.34, 0.39, 0.43))
add.insert_text((55, 790), 'Cópia corrigida para publicação no portal - 12/09/2026', fontname='ArialCustom', fontsize=8, color=(0.48, 0.51, 0.53))

doc.set_metadata({'title': 'Comunicado 006 - programação corrigida para o portal', 'subject': 'Retificação das jornadas 5 e 6'})
doc.save(OUTPUT, garbage=4, deflate=True)
for i in range(len(doc)):
    doc[i].get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False).save(DEST / f'pagina-{i + 1}.png')
print(OUTPUT)
