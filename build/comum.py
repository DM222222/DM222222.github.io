# -*- coding: utf-8 -*-
"""Carrega e valida a fonte unica de dados."""
import json
import os
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PERFIL = os.path.join(RAIZ, "dados", "perfil.json")
SAIDA_CV = os.path.join(RAIZ, "assets", "cv")

OBRIGATORIOS = ["pessoal", "variantes", "competencias", "experiencia",
                "formacao", "certificacoes", "idiomas", "site_habilidades"]


def carregar():
    if not os.path.exists(PERFIL):
        sys.exit("ERRO: nao encontrei dados/perfil.json")
    try:
        with open(PERFIL, encoding="utf-8") as f:
            d = json.load(f)
    except json.JSONDecodeError as e:
        sys.exit(
            "ERRO de sintaxe em dados/perfil.json, linha %d, coluna %d:\n  %s\n"
            "  Dica: quase sempre e uma virgula sobrando antes de } ou ], "
            "ou uma aspa que nao foi fechada." % (e.lineno, e.colno, e.msg)
        )

    faltando = [k for k in OBRIGATORIOS if k not in d]
    if faltando:
        sys.exit("ERRO: faltam secoes em perfil.json: " + ", ".join(faltando))

    for i, exp in enumerate(d["experiencia"]):
        for campo in ("cargo", "empresa", "inicio", "fim", "bullets"):
            if not exp.get(campo):
                sys.exit("ERRO: experiencia #%d esta sem o campo '%s'" % (i + 1, campo))

    for nome, v in d["variantes"].items():
        for chave in v.get("competencias", []):
            if chave not in d["competencias"]:
                sys.exit("ERRO: a variante '%s' aponta para o grupo de competencia "
                         "'%s', que nao existe." % (nome, chave))

    os.makedirs(SAIDA_CV, exist_ok=True)
    return d


def linha_contato(p, separador=" | "):
    """Linha de contato em texto puro — do jeito que o robo le melhor."""
    return separador.join([
        p["email"],
        p["telefone_ats"],
        "%s, %s" % (p["cidade"], p["estado"]),
        p["linkedin_curto"],
        p["portfolio_curto"],
    ])


def periodo(exp):
    return "%s - %s" % (exp["inicio"], exp["fim"])
