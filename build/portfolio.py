# -*- coding: utf-8 -*-
"""Injeta os textos aprovados nas regioes marcadas do index.html.

So mexe no que esta entre <!-- SYNC:x --> e <!-- /SYNC:x -->.
Fontes: dados/perfil.json (contato, trajetoria) e dados/portfolio_textos.json
(abertura e cards dos cases). O resto do arquivo nao e tocado.
"""
import html
import json
import os
import re
import sys

from comum import RAIZ

INDEX = os.path.join(RAIZ, "index.html")
TEXTOS = os.path.join(RAIZ, "dados", "portfolio_textos.json")
AVISO = "<!-- Gerado de dados/ — não edite à mão -->"
e = html.escape


def _trocar(doc, nome, conteudo, indent="      "):
    padrao = re.compile(
        r"(<!--\s*SYNC:%s\s*-->).*?(<!--\s*/SYNC:%s\s*-->)" % (nome, nome), re.DOTALL)
    if not padrao.search(doc):
        sys.exit("ERRO: nao achei o marcador SYNC:%s no index.html" % nome)
    return padrao.sub(
        lambda m: m.group(1) + AVISO + "\n" + conteudo + indent + m.group(2), doc)


def _abertura(t):
    a = t["abertura"]
    return (
        '      <p class="eyebrow">%s</p>\n'
        '      <h1 id="titulo">%s</h1>\n'
        '      <p class="lead">%s</p>\n' % (e(a["cargo"]), e(a["titulo"]), e(a["paragrafo"]))
    )


def _cases(t):
    saida = ""
    for c in t["cases"]:
        video = botao = ""
        if c.get("video"):
            video = ('<video muted loop playsinline preload="metadata" poster="%s" data-src="%s"></video>'
                     % (e(c["poster"]), e(c["video"])))
            botao = '\n          <button type="button" class="vctl" aria-label="Pausar v\u00eddeo do case">Pausar</button>'
        saida += (
            '      <article class="case">\n'
            '        <div class="case-cover"%(attr)s>\n'
            '          <a class="cover-link" href="%(link)s" tabindex="-1" aria-hidden="true">'
            '<img src="%(poster)s" alt="" loading="lazy" width="1600" height="800">%(video)s</a>%(botao)s\n'
            '        </div>\n'
            '        <div class="case-meta">\n'
            '          <p class="case-who"><b>%(n)s</b>%(empresa)s<br>%(etiqueta)s</p>\n'
            '          <h3><a href="%(link)s">%(frase)s</a></h3>\n'
            '          <p class="case-metric">%(metrica)s</p>\n'
            '        </div>\n'
            '      </article>\n' % {
                "link": e(c["link"]), "poster": e(c["poster"]), "video": video, "botao": botao,
                "attr": ' data-torre' if c.get("interativo") == "torre" else "",
                "n": e(c["n"]), "empresa": e(c["empresa"]), "etiqueta": e(c["etiqueta"]),
                "frase": e(c["frase"]), "metrica": e(c["metrica"])}
        )
    return saida


def _experiencia(d):
    saida = ""
    for x in d["experiencia"]:
        saida += (
            '        <div class="tline">\n'
            '          <div class="when">%s</div>\n'
            '          <div>\n'
            '            <h3>%s</h3>\n'
            '            <p class="role">%s</p>\n'
            '            <p>%s</p>\n'
            '          </div>\n'
            '        </div>\n' % (e(x["periodo_site"]), e(x["cargo_curto"]),
                                  e(x["subtitulo_site"]), e(x["resumo_site"]))
        )
    return saida


def _contato(d):
    p = d["pessoal"]
    nova = '<span class="sr-only"> (abre em nova aba)</span>'
    return (
        '        <a class="contact-link" href="mailto:%s"><span><span class="lbl">E-mail</span>'
        '<span class="val">%s</span></span></a>\n'
        '        <a class="contact-link" href="%s" target="_blank" rel="noopener"><span>'
        '<span class="lbl">LinkedIn</span><span class="val">/%s%s</span></span></a>\n'
        '        <p class="contact-link"><span><span class="lbl">Localização</span>'
        '<span class="val">%s · %s</span></span></p>\n'
        % (e(p["email"]), e(p["email"]), e(p["linkedin"]),
           e(p["linkedin_curto"].split("/", 1)[1]), nova, e(p["cidade"]), e(p["pais"]))
    )


def sincronizar(d):
    t = json.load(open(TEXTOS, encoding="utf-8"))
    with open(INDEX, encoding="utf-8") as f:
        doc = f.read()
    antes = doc
    doc = _trocar(doc, "abertura", _abertura(t), "      ")
    doc = _trocar(doc, "cases", _cases(t), "      ")
    doc = _trocar(doc, "experiencia", _experiencia(d), "        ")
    doc = _trocar(doc, "contato", _contato(d), "        ")
    if doc == antes:
        return False
    with open(INDEX, "w", encoding="utf-8", newline="\n") as f:
        f.write(doc)
    return True
