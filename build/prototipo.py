# -*- coding: utf-8 -*-
"""Extrai os tres conjuntos de tokens do deck do case (assets/case-study), grava
build/planta/themes.json e atualiza a tabela de contraste do case.
O HTML do prototipo e gerado por build/planta.py. Uso:  python build/prototipo.py
Requer: beautifulsoup4 + lxml (so para gerar; o resultado e HTML estatico).
"""
import html as _html
import json
import os
import re
import sys
from collections import Counter

from bs4 import BeautifulSoup

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DECK = os.path.join(RAIZ, "assets", "case-study", "painel-mineracao.html")
SAIDA = os.path.join(RAIZ, "assets", "prototipo", "planta.html")
AQUI = os.path.dirname(os.path.abspath(__file__))

NAV = ["Home", "Circuits", "Parameters", "History", "Reports"]
# numero da tela no deck -> id no prototipo
TELAS = {1: "login-badge", 2: "login-sso", 3: "home", 4: "widgets",
         6: "circuits", 7: "parameters", 8: "history", 9: "reports"}
ROTULOS = [("login-badge", "01 · Login by badge and PIN"), ("login-sso", "02 · Login with SSO"),
           ("home", "03 · Home"), ("widgets", "04 · Widget variations"),
           ("flow", "05 · Turn off AI flow"), ("circuits", "06 · Circuits"),
           ("parameters", "07 · Parameters"), ("history", "08 · History"),
           ("reports", "09 · Reports")]


def carregar_deck():
    s = open(DECK, encoding="utf-8").read()
    for x in re.findall(r"<script[^>]*>(.*?)</script>", s, re.S):
        x = x.strip()
        if x.startswith('"') and "<section" in x:
            return json.loads(x)
    sys.exit("ERRO: nao achei o documento interno do deck")


def vars_de(style):
    return {k: v.strip() for k, v in re.findall(r"(--[A-Za-z0-9]+):\s*([^;\"]+)", style)}


def temas(soup, frames):
    escuro = claro_sol = None
    for el in soup.find_all(style=True):
        st = el["style"]
        if escuro is None and "--bg:#0c0c0d" in st:
            escuro = vars_de(st)
        if claro_sol is None and "--bg:#ffffff;--surface:#ffffff;--surface2:#f0f1f4" in st:
            claro_sol = vars_de(st)
    if not escuro or not claro_sol:
        sys.exit("ERRO: nao achei os conjuntos de tokens Escuro/Sol no deck")
    # Claro = valor de fallback mais comum de cada token nas telas
    cont = {}
    for f in frames:
        for nome, val in re.findall(r"var\((--[A-Za-z0-9]+),\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\))\)", f):
            cont.setdefault(nome, Counter())[val] += 1
    claro = {k: c.most_common(1)[0][0] for k, c in cont.items()}
    for k in escuro:  # tokens que so existem nos outros temas
        claro.setdefault(k, claro_sol.get(k, escuro[k]))
    return {"claro": claro, "sol": claro_sol, "escuro": escuro}


# Ajustes feitos na auditoria de contraste dos tokens do deck (ver tabela no case).
AJUSTES = {
    "claro": {"--ink3": "#626973", "--fieldLine": "#858c97"},
    "escuro": {"--accent": "#6857ff", "--accentHi": "#5a48ec"},
}
ORIGINAIS = {"ink3 claro": "#6b727c", "fieldLine claro": "#9aa1ac", "accent escuro": "#7a6bff"}


def _lum(x):
    x = x.strip().lstrip("#")
    if len(x) == 3:
        x = "".join(c * 2 for c in x)
    r, g, b = [int(x[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c / 12.92 if c <= .03928 else ((c + .055) / 1.055) ** 2.4
    return .2126 * f(r) + .7152 * f(g) + .0722 * f(b)


def contraste(a, b):
    la, lb = sorted([_lum(a), _lum(b)], reverse=True)
    return (la + .05) / (lb + .05)


PARES = [
    ("Texto principal sobre o fundo", "--ink", "--bg", 4.5),
    ("Texto secundário sobre o fundo", "--ink2", "--bg", 4.5),
    ("Texto de apoio sobre o fundo", "--ink3", "--bg", 4.5),
    ("Texto do botão sobre o destaque", "--onAccent", "--accent", 4.5),
    ("Link sobre o fundo", "--link", "--bg", 4.5),
    ("Status OK, texto sobre o seu fundo", "--okInk", "--okBg", 4.5),
    ("Status de erro, texto sobre o seu fundo", "--danger", "--errBg", 4.5),
    ("Limite do campo sobre o fundo", "--fieldLine", "--bg", 3.0),
]


def tabela_contraste(tokens):
    linhas, falhas = [], []
    for nome, a, b, minimo in PARES:
        cel = []
        for t in ("claro", "sol", "escuro"):
            v = tokens[t]
            fg = v["--field"] if (a == "--fieldLine" and t == "escuro") else v[a]
            r = contraste(fg, v[b])
            if r < minimo:
                falhas.append((nome, t, r))
            cel.append('<td>%s:1</td>' % ("%.1f" % r).replace(".", ","))
        linhas.append("<tr><th scope=\"row\">%s<span class=\"min\"> (mín. %s:1)</span></th>%s</tr>"
                      % (_html.escape(nome), ("%.1f" % minimo).replace(".", ","), "".join(cel)))
    html = ('<table class="tbl"><caption class="sr-only">Contraste dos pares de cor do sistema, por tema</caption>'
            '<thead><tr><th scope="col">Par</th><th scope="col">Claro</th><th scope="col">Sol</th><th scope="col">Escuro</th></tr></thead>'
            '<tbody>%s</tbody></table>' % "".join(linhas))
    return html, falhas


def injetar_sistema(tokens):
    caminho = os.path.join(RAIZ, "cases", "painel-de-mineracao.html")
    doc = open(caminho, encoding="utf-8").read()
    tabela, falhas = tabela_contraste(tokens)
    m = re.compile(r"(<!--\s*SYNC:contraste\s*-->).*?(<!--\s*/SYNC:contraste\s*-->)", re.S)
    if not m.search(doc):
        return falhas
    novo = m.sub(lambda x: x.group(1) + "\n" + tabela + "\n          " + x.group(2), doc)
    open(caminho, "w", encoding="utf-8", newline="\n").write(novo)
    return falhas


def converter_nav(frag):
    soup = BeautifulSoup(frag, "lxml")
    for div in soup.find_all("div"):
        kids = div.find_all("span", recursive=False)
        if [k.get_text(strip=True) for k in kids] == NAV:
            for k in kids:
                nome = k.get_text(strip=True)
                ativo = "border-bottom" in k.get("style", "")
                k.name = "button"
                k["type"] = "button"
                k["data-go"] = {"Home": "home", "Circuits": "circuits", "Parameters": "parameters",
                                "History": "history", "Reports": "reports"}[nome]
                if ativo:
                    k["aria-current"] = "page"
                k["style"] = "background:none;border:0;padding:0;font:inherit;cursor:pointer;" + k.get("style", "")
    return soup


def corpo(soup):
    return soup.body.decode_contents() if soup.body else str(soup)


def main():
    inner = carregar_deck()
    soup = BeautifulSoup(inner, "lxml")
    secs = soup.find_all("section")
    frames = {}
    for n in range(1, 10):
        sec = secs[13 + n - 1]  # telas 01..09 sao as secoes 14..22
        f = sec.select("div[data-screen-label]")[0]
        frames[n] = str(f)
    tokens = temas(soup, list(frames.values()))
    for t, ajustes in AJUSTES.items():
        tokens[t].update(ajustes)
    falhas = injetar_sistema(tokens)
    if falhas:
        print("ATENCAO, pares abaixo do minimo:", [(n, t, round(r, 2)) for n, t, r in falhas])

    # O prototipo navegavel agora e montado por build/planta.py (layout fluido).
    # Aqui so se atualiza a fonte dos tokens e a tabela de contraste do case.
    destino = os.path.join(AQUI, "planta", "themes.json")
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    with open(destino, "w", encoding="utf-8", newline="\n") as f:
        json.dump(tokens, f, ensure_ascii=False)
    print("OK: tokens ->", os.path.relpath(destino, RAIZ), "| contraste do case atualizado | temas:", ", ".join(tokens))


if __name__ == "__main__":
    main()
