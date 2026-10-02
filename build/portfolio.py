# -*- coding: utf-8 -*-
"""Injeta os dados do perfil nas regioes marcadas do index.html.

So mexe no que esta entre <!-- SYNC:x --> e <!-- /SYNC:x -->.
O resto do arquivo (layout, cases, CSS, JS) nao e tocado.
"""
import os
import re
import sys

from comum import RAIZ

INDEX = os.path.join(RAIZ, "index.html")
AVISO = "<!-- Gerado de dados/perfil.json — não edite à mão -->"


def _trocar(html, nome, conteudo):
    padrao = re.compile(
        r"(<!--\s*SYNC:%s\s*-->).*?(<!--\s*/SYNC:%s\s*-->)" % (nome, nome),
        re.DOTALL,
    )
    if not padrao.search(html):
        sys.exit("ERRO: nao achei o marcador SYNC:%s no index.html" % nome)
    novo = "\\1" + AVISO + "\n" + conteudo + "      \\2"
    return padrao.sub(lambda m: m.group(1) + AVISO + "\n" + conteudo + "      " + m.group(2), html)


def _experiencia(d):
    partes = []
    for exp in d["experiencia"]:
        partes.append(
            '      <div class="tline">\n'
            '        <div class="when">%s</div>\n'
            '        <div>\n'
            '          <h3>%s</h3>\n'
            '          <p class="role">%s</p>\n'
            '          <p>%s</p>\n'
            '        </div>\n'
            '        <div class="arrow">↗</div>\n'
            '      </div>\n'
            % (exp["periodo_site"], exp["cargo_curto"],
               exp["subtitulo_site"], exp["resumo_site"])
        )
    return "\n".join(partes)


def _habilidades(d):
    hab = "".join(
        '          <li>%s <span class="tag">%s</span></li>\n' % (h["nome"], h["tag"])
        for h in d["site_habilidades"]
    )

    form = ""
    for f in d["formacao"]:
        form += ('          <li class="block">\n            %s\n'
                 '            <span class="sub">%s</span>\n          </li>\n'
                 % (f["curso"], f["periodo_site"]))
    cert_formacao = [c for c in d["certificacoes"] if c["instituicao"] == "Digital House"]
    for c in cert_formacao:
        form += ('          <li class="block">\n            %s\n'
                 '            <span class="sub">%s · %s</span>\n          </li>\n'
                 % (c["nome"], c["instituicao"], c["periodo"]))

    idi = "".join(
        '          <li>%s <span class="tag">%s</span></li>\n' % (i["idioma"], i["nivel"])
        for i in d["idiomas"]
    )
    outras = [c for c in d["certificacoes"] if c["instituicao"] != "Digital House"]
    for c in outras:
        sub = c.get("detalhe") or "%s · %s" % (c["instituicao"], c["periodo"])
        idi += ('          <li class="block">\n            %s — %s\n'
                '            <span class="sub">%s</span>\n          </li>\n'
                % (c["instituicao"], c["nome"], sub))

    def card(titulo, n, itens):
        return ('      <div class="skill-card">\n'
                '        <h3>%s <span class="num">%02d</span></h3>\n'
                '        <ul>\n%s        </ul>\n'
                '      </div>\n' % (titulo, n, itens))

    return (card("Habilidades", len(d["site_habilidades"]), hab)
            + card("Formação", len(d["formacao"]) + len(cert_formacao), form)
            + card("Idiomas &amp; Certificações", len(d["idiomas"]) + len(outras), idi))


def _contato(d):
    p = d["pessoal"]
    linhas = [
        ("mailto:" + p["email"], "E-mail", p["email"], "→", False),
        (p["linkedin"], "LinkedIn", "/" + p["linkedin_curto"].split("/", 1)[1], "↗", True),
        ("tel:" + p["telefone"].replace(" ", "").replace("-", ""), "Telefone", p["telefone"], "→", False),
        ("#top", "Localização", "%s · %s" % (p["cidade"], p["pais"]), "↑", False),
    ]
    saida = ""
    for href, rotulo, valor, seta, externo in linhas:
        alvo = ' target="_blank" rel="noopener"' if externo else ""
        saida += ('        <a class="contact-link" href="%s"%s>\n'
                  '          <div><div class="lbl">%s</div><div class="val">%s</div></div>\n'
                  '          <span class="arrow">%s</span>\n'
                  '        </a>\n' % (href, alvo, rotulo, valor, seta))
    return saida


def sincronizar(d):
    with open(INDEX, encoding="utf-8") as f:
        html = f.read()
    antes = html

    html = _trocar(html, "experiencia", _experiencia(d))
    html = _trocar(html, "habilidades", _habilidades(d))
    html = _trocar(html, "contato", _contato(d))

    if html == antes:
        return False
    with open(INDEX, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    return True
