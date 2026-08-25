#!/usr/bin/env python3
"""
Importação do FICHEIRO PADRÃO DE JORNADA do Girabola (.xlsx).

Lê o modelo gerado por scripts/gerar_template_excel.py e consolida, num único
JSON, tudo o que a plataforma precisa para inserir ou atualizar uma jornada:
jogos, eventos, estatísticas por equipa, arbitragem e convocatórias.

Uso:
    python3 scripts/import_rodada_excel.py [caminho.xlsx] [--saida ficheiro.json]

O resultado é gravado em public/templates/ultima_rodada_importada.json e pode
ser carregado em Admin › Calendário › «Importar Dados».

Regra editorial: célula vazia = dado não publicado. O importador nunca inventa
valores — o que não vem preenchido fica ausente do JSON.
"""

import json
import os
import re
import sys
import unicodedata
from datetime import datetime

import openpyxl

# ---------------------------------------------------------------------------
# NORMALIZAÇÃO DE CLUBES
# ---------------------------------------------------------------------------
CLUBE_MAP = {
    "petro": "petro", "petro de luanda": "petro", "petro atletico": "petro", "petro atlético": "petro",
    "petro atletico de luanda": "petro", "petro atlético de luanda": "petro",
    "dago": "dago", "1.º de agosto": "dago", "1º de agosto": "dago", "cd 1.º de agosto": "dago",
    "cd 1º de agosto": "dago", "primeiro de agosto": "dago", "clube desportivo 1.º de agosto": "dago",
    "sagrada": "sagrada", "sagrada esperança": "sagrada", "gd sagrada esperança": "sagrada",
    "grupo desportivo sagrada esperança": "sagrada",
    "lundasul": "lundasul", "lunda sul": "lundasul", "desportivo da lunda sul": "lundasul",
    "cd lunda sul": "lundasul", "clube desportivo da lunda sul": "lundasul",
    "interclube": "interclube", "gd interclube": "interclube", "grupo desportivo interclube": "interclube",
    "kabuscorp": "kabuscorp", "kabuscorp sc": "kabuscorp", "kabuscorp do palanca": "kabuscorp",
    "kabuscorp sport clube do palanca": "kabuscorp",
    "wiliete": "wiliete", "wiliete de benguela": "wiliete", "wiliete sc": "wiliete",
    "wiliete sport clube de benguela": "wiliete",
    "bravos": "bravos", "bravos do maquis": "bravos", "fc bravos do maquis": "bravos",
    "futebol clube bravos do maquis": "bravos",
    "desphuila": "desphuila", "desportivo da huíla": "desphuila", "desportivo da huila": "desphuila",
    "cd huíla": "desphuila", "huíla": "desphuila", "clube desportivo da huíla": "desphuila",
    "lobito": "lobito", "académica do lobito": "lobito", "academica do lobito": "lobito",
    "académica petróleos do lobito": "lobito",
    "saosalvador": "saosalvador", "são salvador": "saosalvador", "sao salvador": "saosalvador",
    "são salvador do kongo": "saosalvador", "são salvador futebol clube do kongo": "saosalvador",
    "primeiromaio": "primeiromaio", "1.º de maio": "primeiromaio", "1º de maio": "primeiromaio",
    "estrela 1.º de maio": "primeiromaio", "1.º de maio de benguela": "primeiromaio",
    "estrela clube 1.º de maio de benguela": "primeiromaio",
    "libolo": "libolo", "recreativo do libolo": "libolo", "crd libolo": "libolo",
    "clube recreativo desportivo do libolo": "libolo",
    "caala": "caala", "recreativo da caála": "caala", "recreativo da caala": "caala",
    "cr caála": "caala", "caála": "caala", "clube recreativo da caála": "caala",
    "fcluanda": "fcluanda", "fc luanda": "fcluanda", "futebol clube de luanda": "fcluanda",
    "cabinda": "cabinda", "fc cabinda": "cabinda", "futebol clube de cabinda": "cabinda",
}

NOMES_OFICIAIS = {
    "petro": "Petro de Luanda",
    "dago": "CD 1.º de Agosto",
    "sagrada": "Sagrada Esperança",
    "lundasul": "Desportivo da Lunda Sul",
    "interclube": "GD Interclube",
    "kabuscorp": "Kabuscorp SC",
    "wiliete": "Wiliete de Benguela",
    "bravos": "Bravos do Maquis",
    "desphuila": "Desportivo da Huíla",
    "lobito": "Académica do Lobito",
    "saosalvador": "São Salvador",
    "primeiromaio": "Estrela 1.º de Maio",
    "libolo": "Recreativo do Libolo",
    "caala": "CR Caála",
    "fcluanda": "FC Luanda",
    "cabinda": "FC Cabinda",
}

AVISOS = []


def avisar(mensagem):
    AVISOS.append(mensagem)


def normalizar_clube(nome, contexto=""):
    if nome is None or str(nome).strip() == "":
        return None
    chave = str(nome).strip().lower()
    clube_id = CLUBE_MAP.get(chave)
    if clube_id is None:
        avisar(f"Clube não reconhecido: «{nome}»{contexto}. Verifique a aba Clubes_Referencia.")
        return chave
    return clube_id


# ---------------------------------------------------------------------------
# LEITURA GENÉRICA DE ABAS (por nome de coluna, não por posição)
# ---------------------------------------------------------------------------
def chave_coluna(titulo):
    """«Golos_Casa», «Status (finished/scheduled)» → 'golos_casa', 'status'."""
    texto = str(titulo or "").split("(")[0].strip().lower()
    texto = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode("ascii")
    texto = texto.replace("%", "pct").replace(" ", "_")
    return re.sub(r"_+", "_", texto).strip("_")


def ler_aba(wb, nome_aba):
    """Devolve uma lista de dicionários {chave_coluna: valor} por linha preenchida."""
    if nome_aba not in wb.sheetnames:
        return []

    ws = wb[nome_aba]
    linhas = list(ws.iter_rows(values_only=True))
    if not linhas:
        return []

    cabecalho = [chave_coluna(c) for c in linhas[0]]
    registos = []
    for numero, linha in enumerate(linhas[1:], start=2):
        if not linha or linha[0] is None or str(linha[0]).strip() == "":
            continue
        registo = {}
        for idx, chave in enumerate(cabecalho):
            if not chave:
                continue
            registo[chave] = linha[idx] if idx < len(linha) else None
        registo["_linha"] = numero
        registos.append(registo)
    return registos


def texto(valor):
    if valor is None:
        return ""
    return str(valor).strip()


def inteiro(valor):
    if valor is None or str(valor).strip() == "":
        return None
    try:
        return int(float(str(valor).strip().replace(",", ".")))
    except ValueError:
        return None


def minuto_para_numero(rotulo):
    """'90+5' → 95 · '63' → 63 · vazio → None (nunca estimado)."""
    if not rotulo:
        return None
    partes = re.findall(r"\d+", str(rotulo))
    if not partes:
        return None
    return sum(int(p) for p in partes[:2])


def chave_jogo(jornada, home_id, away_id):
    return f"{jornada}|{home_id}|{away_id}"


# ---------------------------------------------------------------------------
# ABAS
# ---------------------------------------------------------------------------
def processar_jogos(wb):
    registos = ler_aba(wb, "Jogos_Resultados")
    if not registos:
        return []

    jogos = []
    vistos = set()
    for r in registos:
        jornada = inteiro(r.get("jornada"))
        if jornada is None:
            avisar(f"Jogos_Resultados linha {r['_linha']}: jornada inválida — linha ignorada.")
            continue

        data_str = texto(r.get("data")).split(" ")[0]
        hora_str = texto(r.get("hora")) or "15:00"
        if len(hora_str) > 5:
            hora_str = hora_str[:5]

        home_id = normalizar_clube(r.get("equipa_casa"), f" (Jogos_Resultados, linha {r['_linha']})")
        away_id = normalizar_clube(r.get("equipa_fora"), f" (Jogos_Resultados, linha {r['_linha']})")
        if not home_id or not away_id:
            avisar(f"Jogos_Resultados linha {r['_linha']}: equipas em falta — linha ignorada.")
            continue

        chave = chave_jogo(jornada, home_id, away_id)
        if chave in vistos:
            avisar(f"Jogos_Resultados linha {r['_linha']}: jogo repetido na mesma jornada.")
        vistos.add(chave)

        status = (texto(r.get("status")) or "finished").lower()
        if status not in {"finished", "scheduled", "live"}:
            avisar(f"Jogos_Resultados linha {r['_linha']}: status «{status}» desconhecido — assumido 'finished'.")
            status = "finished"

        home_score = inteiro(r.get("golos_casa")) or 0
        away_score = inteiro(r.get("golos_fora")) or 0

        jogo = {
            "round": jornada,
            "date": f"{data_str}T{hora_str}:00+01:00" if data_str else "",
            "homeTeamId": home_id,
            "homeTeam": NOMES_OFICIAIS.get(home_id, texto(r.get("equipa_casa"))),
            "awayTeamId": away_id,
            "awayTeam": NOMES_OFICIAIS.get(away_id, texto(r.get("equipa_fora"))),
            "homeScore": home_score,
            "awayScore": away_score,
            "score": f"{home_score}-{away_score}" if status in {"finished", "live"} else None,
            "stadium": texto(r.get("estadio")),
            "broadcaster": texto(r.get("transmissao")),
            "status": status,
        }

        # Campos opcionais: só entram no JSON quando preenchidos.
        estado_agenda = texto(r.get("estado_agenda")).lower()
        if estado_agenda in {"official", "provisional"}:
            jogo["scheduleStatus"] = estado_agenda
        if texto(r.get("id_jogo")):
            jogo["id"] = texto(r.get("id_jogo"))
        if texto(r.get("arbitro_principal")):
            jogo["referee"] = texto(r.get("arbitro_principal"))
        if inteiro(r.get("assistencia")) is not None:
            jogo["attendance"] = inteiro(r.get("assistencia"))
        if inteiro(r.get("tempo_util_min")) is not None:
            jogo["usefulTimeMinutes"] = inteiro(r.get("tempo_util_min"))
        if texto(r.get("observacoes")):
            jogo["notes"] = texto(r.get("observacoes"))

        jogos.append(jogo)

    return jogos


TIPOS_EVENTO = {
    "GOLO": "goal",
    "AMARELO": "yellow",
    "VERMELHO": "red",
    "ADVERTENCIA": "warning",
    "ADVERTÊNCIA": "warning",
    "SUB": "sub",
}


def processar_eventos(wb):
    eventos = []
    for r in ler_aba(wb, "Eventos_Ocorrencias"):
        jornada = inteiro(r.get("jornada"))
        if jornada is None:
            continue

        home_id = normalizar_clube(r.get("equipa_casa"), f" (Eventos_Ocorrencias, linha {r['_linha']})")
        away_id = normalizar_clube(r.get("equipa_fora"), f" (Eventos_Ocorrencias, linha {r['_linha']})")

        tipo_bruto = texto(r.get("tipo_evento")).upper()
        tipo = next((v for k, v in TIPOS_EVENTO.items() if k in tipo_bruto), None)
        if tipo is None:
            avisar(f"Eventos_Ocorrencias linha {r['_linha']}: tipo «{tipo_bruto}» desconhecido — linha ignorada.")
            continue

        lado = texto(r.get("equipa_infracao")).upper()
        team = "home" if lado in {"CASA", "HOME"} else "away"
        if lado not in {"CASA", "HOME", "FORA", "AWAY"}:
            avisar(f"Eventos_Ocorrencias linha {r['_linha']}: lado «{lado}» inválido — assumido 'FORA'.")

        # Minuto por confirmar fica vazio: nunca preencher com valor estimado.
        rotulo_minuto = texto(r.get("minuto")) or None

        evento = {
            "round": jornada,
            "homeTeamId": home_id,
            "awayTeamId": away_id,
            "minute": minuto_para_numero(rotulo_minuto),
            "minuteLabel": rotulo_minuto,
            "type": tipo,
            "team": team,
            "jerseyNumber": inteiro(r.get("camisola")),
            "player": texto(r.get("nome_jogador")) or "Por identificar",
            # Cartões são publicados apenas com jogador, minuto e cor.
            "detail": "" if tipo in {"yellow", "red"} else texto(r.get("detalhe_motivo")),
        }
        if texto(r.get("jogador_saiu")):
            evento["playerOut"] = texto(r.get("jogador_saiu"))
        if texto(r.get("assistencia_golo")):
            evento["assist"] = texto(r.get("assistencia_golo"))

        eventos.append(evento)

    return eventos


CAMPOS_ESTATISTICA = {
    "posse_pct": "possession",
    "remates": "shots",
    "remates_a_baliza": "shotsOnTarget",
    "cantos": "corners",
    "faltas": "fouls",
    "foras_de_jogo": "offsides",
    "amarelos": "yellowCards",
    "vermelhos": "redCards",
    "passes": "passes",
    "precisao_passe_pct": "passAccuracy",
    "defesas": "saves",
}


def processar_estatisticas(wb):
    """Uma entrada por jogo com home/away e a lista de métricas efetivamente publicadas."""
    por_jogo = {}
    for r in ler_aba(wb, "Estatisticas_Equipa"):
        jornada = inteiro(r.get("jornada"))
        if jornada is None:
            continue

        home_id = normalizar_clube(r.get("equipa_casa"), f" (Estatisticas_Equipa, linha {r['_linha']})")
        away_id = normalizar_clube(r.get("equipa_fora"), f" (Estatisticas_Equipa, linha {r['_linha']})")
        lado = texto(r.get("lado")).upper()
        if lado not in {"CASA", "FORA"}:
            avisar(f"Estatisticas_Equipa linha {r['_linha']}: lado «{lado}» inválido — linha ignorada.")
            continue

        chave = chave_jogo(jornada, home_id, away_id)
        entrada = por_jogo.setdefault(chave, {
            "round": jornada,
            "homeTeamId": home_id,
            "awayTeamId": away_id,
            "home": {},
            "away": {},
            "keys": [],
        })

        destino = entrada["home"] if lado == "CASA" else entrada["away"]
        for coluna, campo in CAMPOS_ESTATISTICA.items():
            valor = inteiro(r.get(coluna))
            if valor is None:
                continue  # métrica não publicada na ficha oficial
            destino[campo] = valor
            if campo not in entrada["keys"]:
                entrada["keys"].append(campo)

    return list(por_jogo.values())


def processar_arbitragem(wb):
    equipas = []
    for r in ler_aba(wb, "Arbitragem"):
        jornada = inteiro(r.get("jornada"))
        if jornada is None:
            continue

        registo = {
            "round": jornada,
            "homeTeamId": normalizar_clube(r.get("equipa_casa"), f" (Arbitragem, linha {r['_linha']})"),
            "awayTeamId": normalizar_clube(r.get("equipa_fora"), f" (Arbitragem, linha {r['_linha']})"),
            "referee": texto(r.get("arbitro_principal")),
            "assistants": [texto(r.get("assistente_1")), texto(r.get("assistente_2"))],
            "fourth": texto(r.get("quarto_arbitro")),
        }
        equipas.append(registo)

    return equipas


POSICOES = {"GK", "DEF", "MID", "FWD"}


def processar_onzes(wb):
    por_jogo = {}
    for r in ler_aba(wb, "Onzes_Convocatorias"):
        jornada = inteiro(r.get("jornada"))
        if jornada is None:
            continue

        home_id = normalizar_clube(r.get("equipa_casa"), f" (Onzes_Convocatorias, linha {r['_linha']})")
        away_id = normalizar_clube(r.get("equipa_fora"), f" (Onzes_Convocatorias, linha {r['_linha']})")
        lado = texto(r.get("lado")).upper()
        if lado not in {"CASA", "FORA"}:
            avisar(f"Onzes_Convocatorias linha {r['_linha']}: lado «{lado}» inválido — linha ignorada.")
            continue

        posicao = texto(r.get("posicao")).upper()
        if posicao not in POSICOES:
            avisar(f"Onzes_Convocatorias linha {r['_linha']}: posição «{posicao}» inválida — linha ignorada.")
            continue

        chave = chave_jogo(jornada, home_id, away_id)
        entrada = por_jogo.setdefault(chave, {
            "round": jornada,
            "homeTeamId": home_id,
            "awayTeamId": away_id,
            "home": [],
            "away": [],
        })

        formacao = texto(r.get("formacao"))
        if formacao:
            entrada["formationHome" if lado == "CASA" else "formationAway"] = formacao

        destino = entrada["home"] if lado == "CASA" else entrada["away"]
        destino.append({
            "number": inteiro(r.get("camisola")),
            "name": texto(r.get("nome_jogador")),
            "position": posicao,
            "isStarter": texto(r.get("titular")).upper() in {"SIM", "S", "TRUE", "1"},
        })

    return list(por_jogo.values())


# ---------------------------------------------------------------------------
# COERÊNCIA E RESUMO
# ---------------------------------------------------------------------------
def validar_coerencia(jogos, eventos, onzes):
    for jogo in jogos:
        chave = chave_jogo(jogo["round"], jogo["homeTeamId"], jogo["awayTeamId"])
        golos_casa = sum(1 for e in eventos if e["type"] == "goal" and e["team"] == "home"
                         and chave_jogo(e["round"], e["homeTeamId"], e["awayTeamId"]) == chave)
        golos_fora = sum(1 for e in eventos if e["type"] == "goal" and e["team"] == "away"
                         and chave_jogo(e["round"], e["homeTeamId"], e["awayTeamId"]) == chave)

        if jogo["status"] == "finished" and (golos_casa or golos_fora):
            if golos_casa != jogo["homeScore"] or golos_fora != jogo["awayScore"]:
                avisar(
                    f"{jogo['homeTeam']} {jogo['homeScore']}-{jogo['awayScore']} {jogo['awayTeam']}: "
                    f"marcadores registados {golos_casa}-{golos_fora} não batem certo com o resultado."
                )

    for onze in onzes:
        for lado in ("home", "away"):
            titulares = sum(1 for p in onze[lado] if p["isStarter"])
            if titulares and titulares != 11:
                avisar(
                    f"Jornada {onze['round']} · {onze['homeTeamId']}–{onze['awayTeamId']}: "
                    f"{titulares} titulares indicados no lado «{lado}» (esperados 11)."
                )


def processar_ficheiro(caminho):
    if not os.path.exists(caminho):
        print(f"❌ Erro: ficheiro «{caminho}» não encontrado.")
        return None

    wb = openpyxl.load_workbook(caminho, data_only=True)

    if "Jogos_Resultados" not in wb.sheetnames:
        print("❌ Erro: aba «Jogos_Resultados» não encontrada. Use o modelo em public/templates/.")
        return None

    jogos = processar_jogos(wb)
    eventos = processar_eventos(wb)
    estatisticas = processar_estatisticas(wb)
    arbitragem = processar_arbitragem(wb)
    onzes = processar_onzes(wb)

    validar_coerencia(jogos, eventos, onzes)

    jornadas = sorted({j["round"] for j in jogos})

    return {
        "jornadas": jornadas,
        "origem": os.path.basename(caminho),
        "importadoEm": datetime.now().astimezone().isoformat(timespec="seconds"),
        "jogos": jogos,
        "eventos": eventos,
        "estatisticas": estatisticas,
        "arbitragem": arbitragem,
        "onzes": onzes,
        "avisos": AVISOS,
    }


def mostrar_resumo(dados):
    jogos = dados["jogos"]
    eventos = dados["eventos"]

    total_jogos = len(jogos)
    total_golos = sum(j["homeScore"] + j["awayScore"] for j in jogos)
    vitorias_casa = sum(1 for j in jogos if j["homeScore"] > j["awayScore"])
    vitorias_fora = sum(1 for j in jogos if j["awayScore"] > j["homeScore"])
    empates = sum(1 for j in jogos if j["homeScore"] == j["awayScore"])
    media = f"{total_golos / total_jogos:.2f}" if total_jogos else "—"

    print("\n" + "=" * 70)
    print("📊 RESUMO DA JORNADA IMPORTADA")
    print("=" * 70)
    print(f"🗓️  Jornada(s): {', '.join(str(j) for j in dados['jornadas']) or '—'}")
    print(f"⚽ Jogos processados: {total_jogos}")
    print(f"🎯 Golos: {total_golos} (média {media} por jogo)")
    print(f"🏠 Casa: {vitorias_casa} | ✈️  Fora: {vitorias_fora} | 🤝 Empates: {empates}")
    print(f"🟨 Amarelos: {sum(1 for e in eventos if e['type'] == 'yellow')}"
          f" | 🟥 Vermelhos: {sum(1 for e in eventos if e['type'] == 'red')}"
          f" | ⚠️ Advertências: {sum(1 for e in eventos if e['type'] == 'warning')}"
          f" | 🔄 Substituições: {sum(1 for e in eventos if e['type'] == 'sub')}")
    print(f"📈 Jogos com estatísticas de ficha: {len(dados['estatisticas'])}")
    print(f"👨‍⚖️ Equipas de arbitragem: {len(dados['arbitragem'])}")
    print(f"👥 Jogos com convocatórias: {len(dados['onzes'])}")

    if dados["avisos"]:
        print("-" * 70)
        print(f"⚠️  {len(dados['avisos'])} aviso(s) a rever antes de publicar:")
        for aviso in dados["avisos"]:
            print(f"   • {aviso}")
    else:
        print("✅ Sem inconsistências detetadas.")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    argumentos = [a for a in sys.argv[1:] if not a.startswith("--")]
    caminho = argumentos[0] if argumentos else "public/templates/girabola_modelo_rodada_exemplo.xlsx"

    saida = "public/templates/ultima_rodada_importada.json"
    if "--saida" in sys.argv:
        saida = sys.argv[sys.argv.index("--saida") + 1]

    print(f"📂 A ler: {caminho}")
    resultado = processar_ficheiro(caminho)
    if resultado is None:
        sys.exit(1)

    mostrar_resumo(resultado)
    with open(saida, "w", encoding="utf-8") as f:
        json.dump(resultado, f, indent=2, ensure_ascii=False)
    print(f"💾 JSON consolidado: {saida}")
    print("➡️  Carregue-o em Admin › Calendário › «Importar Dados» e clique em «Guardar alterações».")
