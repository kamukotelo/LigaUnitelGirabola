from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "walkthrough-presenca-digital-clubes.pdf"
LOGO = ROOT / "public" / "logo-girabola-horizontal.png"


club_rows = [
    ["petro", "Petro de Luanda", "https://petroatletico.co.ao/", "https://www.facebook.com/atleticopetroleosluanda", "https://www.instagram.com/petro_de_luanda_oficial/", "YouTube: @petrodeluandaoficial"],
    ["dago", "1.º de Agosto", "http://www.primeiroagosto.com/", "https://www.facebook.com/clube1deagosto/", "https://www.instagram.com/cdagosto/", "-"],
    ["sagrada", "Sagrada Esperança", "https://gdse.ao/", "https://www.facebook.com/cdsagradaesperanca", "https://www.instagram.com/cdsagradaesperanca/", "-"],
    ["interclube", "Interclube", "http://interclube.co.ao/", "https://www.facebook.com/InterclubeAngolaGDI/", "https://www.instagram.com/gdinterclube/", "-"],
    ["libolo", "Recreativo do Libolo", "https://recreativolibolo.com/", "https://www.facebook.com/CRDLibolo/", "https://www.instagram.com/libolo.oficial/", "-"],
    ["wiliete", "Wiliete de Benguela", "https://wilietesc.ao/", "https://www.facebook.com/WilieteSportClube", "https://www.instagram.com/wilietesc/", "-"],
    ["bravos", "Bravos do Maquis", "https://bravosdomaquis.co.ao/", "https://www.facebook.com/p/Bravos-do-Maquis-do-Moxico-100095414350444/", "https://www.instagram.com/bravosdomaquis/", "-"],
    ["desphuila", "Desportivo da Huíla", "Não possui", "https://www.facebook.com/CDhuila/", "https://www.instagram.com/clubedesportivodahuila_/", "-"],
    ["kabuscorp", "Kabuscorp", "Não possui", "https://www.facebook.com/kabuscorpscp", "https://www.instagram.com/kabuscorp.scp/", "-"],
    ["lundasul", "Desportivo da Lunda Sul", "Não possui", "https://www.facebook.com/p/Clube-Desportivo-Da-Lunda-Sul-100077348542835/", "https://www.instagram.com/clubedesportivodalundasul/", "-"],
    ["lobito", "Académica do Lobito", "Não possui", "https://www.facebook.com/academicalobito", "https://www.instagram.com/academicalobito/", "-"],
    ["saosalvador", "São Salvador do Kongo", "Não possui", "https://www.facebook.com/saosalvadordokongo", "https://www.instagram.com/cdsaosalvador/", "-"],
    ["caala", "CR Caála", "http://recreativocaalafutebol.blogspot.com/", "https://www.facebook.com/ClubeRecreativodaCaala", "Não possui", "-"],
    ["cabinda", "FC Cabinda", "https://fccabinda.com/", "https://www.facebook.com/fccabinda", "https://www.instagram.com/fccabinda", "-"],
    ["primeiromaio", "1.º de Maio", "Não possui", "https://www.facebook.com/EstrelaClub1oDeMaioDeBenguela", "Não possui", "-"],
    ["fcluanda", "FC Luanda", "Não possui", "https://www.facebook.com/923669860835536", "https://www.instagram.com/fcluanda_oficial/", "YouTube: @FutebolClubeDeLuanda"],
]


def make_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "TitleCustom",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=30,
            textColor=colors.HexColor("#2F1242"),
            alignment=TA_LEFT,
            spaceAfter=12,
        ),
        "subtitle": ParagraphStyle(
            "SubtitleCustom",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=15,
            textColor=colors.HexColor("#555555"),
            spaceAfter=18,
        ),
        "h1": ParagraphStyle(
            "HeadingCustom",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#5C0F8B"),
            spaceBefore=14,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "SubHeadingCustom",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#222222"),
            spaceBefore=10,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "BodyCustom",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=14,
            textColor=colors.HexColor("#222222"),
            spaceAfter=7,
        ),
        "bullet": ParagraphStyle(
            "BulletCustom",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            leftIndent=12,
            bulletIndent=0,
            textColor=colors.HexColor("#222222"),
            spaceAfter=5,
        ),
        "small": ParagraphStyle(
            "SmallCustom",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=7,
            leading=8.5,
            textColor=colors.HexColor("#222222"),
            wordWrap="CJK",
        ),
        "small_center": ParagraphStyle(
            "SmallCenterCustom",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=7.3,
            leading=8.5,
            textColor=colors.white,
            alignment=TA_CENTER,
        ),
    }


def para(text, style):
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return Paragraph(text, style)


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = doc.pagesize
    canvas.setStrokeColor(colors.HexColor("#E4E4E7"))
    canvas.line(doc.leftMargin, height - 1.15 * cm, width - doc.rightMargin, height - 1.15 * cm)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(colors.HexColor("#5C0F8B"))
    canvas.drawString(doc.leftMargin, height - 0.82 * cm, "Liga Unitel Girabola")
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.drawRightString(width - doc.rightMargin, 0.75 * cm, f"Página {doc.page}")
    canvas.restoreState()


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    styles = make_styles()

    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=landscape(A4),
        leftMargin=1.25 * cm,
        rightMargin=1.25 * cm,
        topMargin=1.65 * cm,
        bottomMargin=1.2 * cm,
        title="Walkthrough - Presença Digital dos Clubes",
        author="Liga Unitel Girabola",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=header_footer)])

    story = []
    if LOGO.exists():
        story.append(Image(str(LOGO), width=6.2 * cm, height=2.05 * cm, hAlign="LEFT"))
        story.append(Spacer(1, 0.15 * cm))

    story.append(para("Walkthrough - Presença Digital dos Clubes", styles["title"]))
    story.append(
        para(
            "Foi realizada uma revisão e atualização completa dos canais de presença digital "
            "(Websites, Facebook, Instagram e YouTube) dos 16 clubes participantes do sistema.",
            styles["subtitle"],
        )
    )

    story.append(para("Objetivo", styles["h1"]))
    story.append(
        para(
            "Garantir que os botões direcionem os utilizadores diretamente para páginas oficiais "
            "e perfis reais dos clubes, evitando redirecionamentos para páginas de pesquisa genéricas "
            "do Facebook ou Instagram.",
            styles["body"],
        )
    )

    story.append(para("Alterações Efetuadas", styles["h1"]))
    story.append(
        para(
            "Todas as correções de dados foram implementadas em src/lib/data.ts.",
            styles["body"],
        )
    )
    story.append(para("Atualizações e Correções Específicas de Clubes", styles["h2"]))
    bullets = [
        "Petro de Luanda (petro): adicionado o canal oficial do YouTube https://www.youtube.com/@petrodeluandaoficial; website mantido como https://petroatletico.co.ao/.",
        "Sagrada Esperança (sagrada): adicionado o website oficial https://gdse.ao/.",
        "Interclube (interclube): adicionado o website oficial http://interclube.co.ao/.",
        "FC Cabinda (cabinda): adicionado o website oficial https://fccabinda.com/; Facebook atualizado para https://www.facebook.com/fccabinda; Instagram adicionado em https://www.instagram.com/fccabinda.",
    ]
    for item in bullets:
        story.append(Paragraph(item, styles["bullet"], bulletText="-"))

    story.append(PageBreak())
    story.append(para("Mapeamento Geral de Presença Digital (16 Clubes)", styles["h1"]))

    table_data = [[
        para("ID", styles["small_center"]),
        para("Clube", styles["small_center"]),
        para("Website", styles["small_center"]),
        para("Facebook", styles["small_center"]),
        para("Instagram", styles["small_center"]),
        para("Outros", styles["small_center"]),
    ]]
    for row in club_rows:
        table_data.append([para(cell, styles["small"]) for cell in row])

    table = Table(
        table_data,
        colWidths=[2.1 * cm, 3.25 * cm, 4.1 * cm, 5.15 * cm, 4.65 * cm, 4.0 * cm],
        repeatRows=1,
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#5C0F8B")),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D4D4D8")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAFAFA")]),
            ]
        )
    )
    story.append(table)

    story.append(PageBreak())
    story.append(para("Validação e Testes", styles["h1"]))
    validation_blocks = [
        (
            "Compilação do Projeto",
            "Foi executado o comando npm run build, que compilou a aplicação com sucesso e gerou todas as rotas estáticas, incluindo /teams/presenca-digital e as páginas individuais de cada um dos 16 clubes.",
        ),
        (
            "Verificação dos Links",
            "Todos os endereços introduzidos apontam diretamente para o perfil ou página de destino e não para uma busca ou placeholder.",
        ),
    ]
    for title, body in validation_blocks:
        story.append(KeepTogether([para(title, styles["h2"]), para(body, styles["body"])]))

    story.append(Spacer(1, 0.4 * cm))
    summary_data = [
        [para("Resultado", styles["small_center"]), para("Estado", styles["small_center"])],
        [para("Build Next.js", styles["small"]), para("Concluído com sucesso", styles["small"])],
        [para("Rotas de clubes", styles["small"]), para("16 páginas individuais geradas", styles["small"])],
        [para("Página de auditoria", styles["small"]), para("/teams/presenca-digital disponível", styles["small"])],
        [para("Links de pesquisa", styles["small"]), para("Eliminados da Presença Digital", styles["small"])],
    ]
    summary_table = Table(summary_data, colWidths=[6 * cm, 11 * cm], hAlign="LEFT")
    summary_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#5C0F8B")),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#D4D4D8")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#FAFAFA")]),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(summary_table)

    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build_pdf()
