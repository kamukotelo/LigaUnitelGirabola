#!/usr/bin/env python3
"""
Script de Importação Automática de Rodadas do Girabola via Excel / CSV.
Permite atualizar resultados, marcadores, cartões e classificação
sem necessidade de editar o código-fonte manualmente.
"""

import os
import sys
import json
import openpyxl
from datetime import datetime

# Mapeamento de normalização de nomes de clubes
CLUBE_MAP = {
    "petro": "petro", "petro de luanda": "petro", "petro atletico": "petro", "petro atlético": "petro",
    "dago": "dago", "1.º de agosto": "dago", "1º de agosto": "dago", "cd 1.º de agosto": "dago", "primeiro de agosto": "dago",
    "sagrada": "sagrada", "sagrada esperança": "sagrada", "gd sagrada esperança": "sagrada",
    "lundasul": "lundasul", "lunda sul": "lundasul", "desportivo da lunda sul": "lundasul", "cd lunda sul": "lundasul",
    "interclube": "interclube", "gd interclube": "interclube",
    "kabuscorp": "kabuscorp", "kabuscorp sc": "kabuscorp", "kabuscorp do palanca": "kabuscorp",
    "wiliete": "wiliete", "wiliete de benguela": "wiliete", "wiliete sc": "wiliete",
    "bravos": "bravos", "bravos do maquis": "bravos", "fc bravos do maquis": "bravos",
    "desphuila": "desphuila", "desportivo da huíla": "desphuila", "desportivo da huila": "desphuila", "cd huíla": "desphuila", "huíla": "desphuila",
    "lobito": "lobito", "académica do lobito": "lobito", "academica do lobito": "lobito",
    "saosalvador": "saosalvador", "são salvador": "saosalvador", "sao salvador": "saosalvador", "são salvador do kongo": "saosalvador",
    "primeiromaio": "primeiromaio", "1.º de maio": "primeiromaio", "1º de maio": "primeiromaio", "estrela 1.º de maio": "primeiromaio", "1.º de maio de benguela": "primeiromaio",
    "libolo": "libolo", "recreativo do libolo": "libolo", "crd libolo": "libolo",
    "caala": "caala", "recreativo da caála": "caala", "recreativo da caala": "caala", "cr caála": "caala", "caála": "caala",
    "fcluanda": "fcluanda", "fc luanda": "fcluanda", "futebol clube de luanda": "fcluanda",
    "cabinda": "cabinda", "fc cabinda": "cabinda", "futebol clube de cabinda": "cabinda"
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
    "cabinda": "FC Cabinda"
}

def normalizar_clube(nome):
    if not nome:
        return None
    chave = str(nome).strip().lower()
    return CLUBE_MAP.get(chave, chave)

def processar_excel_rodada(caminho_arquivo):
    if not os.path.exists(caminho_arquivo):
        print(f"❌ Erro: Ficheiro '{caminho_arquivo}' não encontrado.")
        return None

    wb = openpyxl.load_workbook(caminho_arquivo, data_only=True)

    # Processar Jogos
    if "Jogos_Resultados" not in wb.sheetnames:
        print("❌ Erro: Planilha 'Jogos_Resultados' não encontrada no ficheiro.")
        return None

    ws_jogos = wb["Jogos_Resultados"]
    jogos = []

    for row_idx, row in enumerate(ws_jogos.iter_rows(values_only=True), start=1):
        if row_idx == 1:
            continue  # Cabeçalho
        if not row or row[0] is None:
            continue

        jornada = int(row[0])
        data_str = str(row[1]).split(" ")[0] if row[1] else ""
        hora_str = str(row[2]) if row[2] else "15:00"

        home_raw = row[3]
        home_score = int(row[4]) if row[4] is not None and str(row[4]).isdigit() else 0
        away_score = int(row[5]) if row[5] is not None and str(row[5]).isdigit() else 0
        away_raw = row[6]
        stadium = str(row[7]) if len(row) > 7 and row[7] else ""
        broadcaster = str(row[8]) if len(row) > 8 and row[8] else ""
        status = str(row[9]).lower().strip() if len(row) > 9 and row[9] else "finished"

        home_id = normalizar_clube(home_raw)
        away_id = normalizar_clube(away_raw)

        jogos.append({
            "round": jornada,
            "date": f"{data_str}T{hora_str}:00+01:00" if data_str else "",
            "homeTeamId": home_id,
            "homeTeam": NOMES_OFICIAIS.get(home_id, str(home_raw)),
            "awayTeamId": away_id,
            "awayTeam": NOMES_OFICIAIS.get(away_id, str(away_raw)),
            "homeScore": home_score,
            "awayScore": away_score,
            "score": f"{home_score}-{away_score}" if status == "finished" else None,
            "stadium": stadium,
            "broadcaster": broadcaster,
            "status": status
        })

    # Processar Eventos
    eventos = []
    if "Eventos_Ocorrencias" in wb.sheetnames:
        ws_eventos = wb["Eventos_Ocorrencias"]
        for row_idx, row in enumerate(ws_eventos.iter_rows(values_only=True), start=1):
            if row_idx == 1 or not row or row[0] is None:
                continue

            jornada = int(row[0])
            home_id = normalizar_clube(row[1])
            away_id = normalizar_clube(row[2])
            # Minuto pode ficar vazio até existir confirmação oficial.
            # Nunca preencher com texto substituto ou valor estimado.
            minuto = str(row[3]).strip() if row[3] is not None else None
            tipo = str(row[4]).upper().strip()
            lado = str(row[5]).upper().strip()  # CASA ou FORA
            camisola = int(row[6]) if row[6] is not None and str(row[6]).isdigit() else None
            jogador = str(row[7]).strip() if row[7] else "Desconhecido"
            detalhe = str(row[8]).strip() if len(row) > 8 and row[8] else ""

            # Normalizar tipo
            tipo_normalizado = "goal" if "GOL" in tipo else "yellow" if "AMA" in tipo else "red" if "VERM" in tipo else "sub"
            team_side = "home" if lado in ["CASA", "HOME"] else "away"

            eventos.append({
                "round": jornada,
                "homeTeamId": home_id,
                "awayTeamId": away_id,
                "minute": minuto,
                "type": tipo_normalizado,
                "team": team_side,
                "jerseyNumber": camisola,
                "player": jogador,
                "detail": detalhe
            })

    return {
        "jogos": jogos,
        "eventos": eventos
    }

def gerar_resumo_estatistico(dados):
    jogos = dados["jogos"]
    eventos = dados["eventos"]

    total_jogos = len(jogos)
    total_golos = sum(j["homeScore"] + j["awayScore"] for j in jogos)
    vitorias_casa = sum(1 for j in jogos if j["homeScore"] > j["awayScore"])
    vitorias_fora = sum(1 for j in jogos if j["awayScore"] > j["homeScore"])
    empates = sum(1 for j in jogos if j["homeScore"] == j["awayScore"])

    cartoes_amarelos = sum(1 for e in eventos if e["type"] == "yellow")
    cartoes_vermelhos = sum(1 for e in eventos if e["type"] == "red")

    print("\n" + "="*70)
    print("📊 RESUMO PROCESSADO DA RODADA:")
    print("="*70)
    print(f"⚽ Jogos processados: {total_jogos}")
    print(f"🎯 Total de golos: {total_golos} (Média: {total_golos/total_jogos:.2f} por jogo)")
    print(f"🏠 Vitórias em casa: {vitorias_casa} | ✈️ Vitórias fora: {vitorias_fora} | 🤝 Empates: {empates}")
    print(f"🟨 Cartões amarelos registados: {cartoes_amarelos}")
    print(f"🟥 Cartões vermelhos registados: {cartoes_vermelhos}")
    print("="*70 + "\n")

if __name__ == "__main__":
    caminho = sys.argv[1] if len(sys.argv) > 1 else "public/templates/girabola_modelo_rodada_exemplo.xlsx"
    print(f"📂 Lendo ficheiro: {caminho}")
    resultado = processar_excel_rodada(caminho)
    if resultado:
        gerar_resumo_estatistico(resultado)
        # Salvar backup em JSON para fácil integração
        output_json = "public/templates/ultima_rodada_importada.json"
        with open(output_json, "w", encoding="utf-8") as f:
            json.dump(resultado, f, indent=2, ensure_ascii=False)
        print(f"💾 Dados consolidados guardados em: {output_json}")
