# -*- coding: utf-8 -*-
"""Resume de uma pagina, diagramado, em preto e branco.

Este NAO e o arquivo para subir em formulario de vaga — e o que se manda
por e-mail, se imprime e se leva para a entrevista. Quem le e gente.
"""
import os

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer,
                                HRFlowable, KeepTogether)

from comum import SAIDA_CV, periodo

ROXO = HexColor("#000000")
LIMA = HexColor("#9A9A9A")
TINTA = HexColor("#000000")
TINTA2 = HexColor("#2B2B2B")
SUAVE = HexColor("#6B6B6B")
LINHA = HexColor("#CFCFCF")


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def gerar(d, chave_variante="design", caminho=None):
    p = d["pessoal"]
    v = d["variantes"][chave_variante]
    caminho = caminho or os.path.join(SAIDA_CV, "Resume_Danilo_Morelli.pdf")

    doc = SimpleDocTemplate(
        caminho, pagesize=A4,
        leftMargin=1.9 * cm, rightMargin=1.9 * cm,
        topMargin=1.5 * cm, bottomMargin=1.3 * cm,
        title="%s - %s" % (p["nome"], v["cargo"]),
        author=p["nome"],
    )

    def est(nome, tam, lead, cor=TINTA, fonte="Helvetica",
            antes=0, depois=0, recuo=0, espaco_letra=0):
        s = ParagraphStyle(nome, fontName=fonte, fontSize=tam, leading=lead,
                           textColor=cor, spaceBefore=antes, spaceAfter=depois,
                           leftIndent=recuo)
        if espaco_letra:
            s.charSpace = espaco_letra
        return s

    E = {
        "nome": est("n", 24, 26, TINTA, "Helvetica-Bold", 0, 2),
        "cargo": est("c", 11.5, 14, ROXO, "Helvetica", 0, 4),
        "contato": est("ct", 8.8, 12, TINTA2, "Helvetica", 0, 0),
        "secao": est("s", 8.5, 11, ROXO, "Helvetica-Bold", 12, 5, espaco_letra=1.1),
        "resumo": est("r", 9.8, 13.6, TINTA2, "Helvetica", 0, 0),
        "cargo_exp": est("ce", 10.5, 13, TINTA, "Helvetica-Bold", 0, 0),
        "meta": est("m", 8.6, 11, SUAVE, "Helvetica", 0, 2),
        "desc": est("de", 9.3, 12.6, TINTA2, "Helvetica", 0, 0),
        "comp": est("cp", 9.3, 13.4, TINTA2, "Helvetica", 0, 0),
        "linha": est("l", 9.4, 12.6, TINTA2, "Helvetica", 0, 0),
    }

    def regua(cor=LINHA, grossura=0.5, antes=3, depois=3):
        return HRFlowable(width="100%", thickness=grossura, color=cor,
                          spaceBefore=antes, spaceAfter=depois)

    def secao(titulo):
        return [Paragraph(esc(titulo).upper(), E["secao"]), regua(LIMA, 1.1, 0, 5)]

    s = []

    # cabecalho
    s.append(Paragraph(esc(p["nome"]), E["nome"]))
    s.append(Paragraph(esc(v["cargo"]), E["cargo"]))
    contato = " &nbsp;·&nbsp; ".join([
        '<link href="mailto:%s" color="#2B2B2B">%s</link>' % (p["email"], p["email"]),
        '<link href="tel:%s" color="#2B2B2B">%s</link>' % (p["telefone"].replace(" ", ""), p["telefone"]),
        '<link href="%s" color="#2B2B2B">%s</link>' % (p["linkedin"], p["linkedin_curto"]),
        '<link href="%s" color="#2B2B2B">%s</link>' % (p["portfolio"], p["portfolio_curto"]),
        "%s · %s" % (p["cidade"], p["estado"]),
    ])
    s.append(Paragraph(contato, E["contato"]))
    s.append(regua(ROXO, 1.4, 9, 0))

    # resumo — versao curta; a longa fica no CV completo
    s += secao("Perfil")
    s.append(Paragraph(esc(v.get("resumo_curto") or v["resumo"]), E["resumo"]))

    # experiencia — uma linha por cargo, para caber na pagina
    s += secao("Experiencia")
    for i, exp in enumerate(d["experiencia"]):
        bloco = [
            Paragraph(esc(exp["cargo_curto"]), E["cargo_exp"]),
            Paragraph(esc("%s  ·  %s" % (exp["empresa"], periodo(exp))), E["meta"]),
            Paragraph(esc(exp["bullets"][0]), E["desc"]),
        ]
        if i < len(d["experiencia"]) - 1:
            bloco.append(Spacer(1, 5))
        s.append(KeepTogether(bloco))

    # competencias — os 8 primeiros termos de cada grupo
    s += secao("Competencias")
    for chave in v["competencias"]:
        g = d["competencias"][chave]
        s.append(Paragraph(
            '<font color="#000000"><b>%s</b></font> &nbsp; %s'
            % (esc(g["titulo"]), esc(" · ".join(g["itens"][:8]))), E["comp"]))

    # formacao, certificacoes, idiomas
    s += secao("Formacao e idiomas")
    for f in d["formacao"]:
        s.append(Paragraph(
            '<b>%s</b> &nbsp; <font color="#6B6B6B">%s · %s</font>'
            % (esc(f["curso"]), esc(f["instituicao"]), esc(f["periodo"])), E["linha"]))
    for c in d["certificacoes"]:
        s.append(Paragraph(
            '<b>%s</b> &nbsp; <font color="#6B6B6B">%s · %s</font>'
            % (esc(c["nome"]), esc(c["instituicao"]), esc(c["periodo"])), E["linha"]))
    s.append(Paragraph(
        '<b>Idiomas</b> &nbsp; <font color="#6B6B6B">%s</font>'
        % esc(" · ".join("%s (%s)" % (i["idioma"], i["nivel"]) for i in d["idiomas"])),
        E["linha"]))

    doc.build(s)
    return caminho
