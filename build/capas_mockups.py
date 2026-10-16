#!/usr/bin/env python3
"""9 propostas de capa em mockup (3 por case). NAO altera as capas em uso.

Uso: python build/capas_mockups.py            -> assets/projects/propostas-mockup/*.svg + index.html
     python build/capas_mockups.py --aplicar torre=2 planta=1 openflow=3   -> grava como capa oficial
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from capas import *  # noqa
import capas as C

PROP = os.path.join(C.OUT, "propostas-mockup")


def window(uid, x, y, w, h, inner, bar="#E9EAEE", dot="#C7CAD1"):
    """Janela de navegador sem aparelho: barra de 30px + conteudo w x h."""
    g = [f'<clipPath id="{uid}-w"><rect x="0" y="0" width="{w}" height="{h}"/></clipPath>',
         f'<ellipse cx="{x + w / 2:g}" cy="{y + h + 60}" rx="{w * 0.5:g}" ry="18" fill="#000" opacity=".28" filter="url(#{uid}-bl)"/>',
         rect(x, y - 30, w, h + 30, 12, "#fff"),
         path(f"M{x},{y} V{y - 18} Q{x},{y - 30} {x + 12},{y - 30} H{x + w - 12} Q{x + w},{y - 30} {x + w},{y - 18} V{y} Z", bar)]
    for i in range(3):
        g.append(circle(x + 18 + i * 16, y - 15, 4.5, dot))
    g.append(rect(x + 80, y - 23, w - 160, 16, 8, "#fff", op=".8"))
    g.append(f'<g clip-path="url(#{uid}-w)" transform="translate({x},{y})">{inner}</g>')
    return "\n".join(g)


def grid(op=".035", c="#fff"):
    o = []
    for gx in range(0, 1601, 80):
        o.append(line(gx, 0, gx, 800, c, 1, op=op))
    for gy in range(0, 801, 80):
        o.append(line(0, gy, 1600, gy, c, 1, op=op))
    return o


def rot(cx, cy, a, inner):
    return f'<g transform="rotate({a} {cx} {cy})">{inner}</g>'


# ---------------------------------------------------------------- telas do Open Flow
def ofl_screen():
    W, H = 860, 537
    INK, MU, PU, LI = "#241635", "#6B6478", "#5A3A7B", "#C6DE64"
    o = [rect(0, 0, W, H, 0, "#F6F4F9")]
    o.append(rect(0, 0, 170, H, 0, "#3B2556"))
    o.append(text(24, 40, "Open Flow", 17, "#fff", 700))
    for i, (t, on) in enumerate([("Oportunidades", 1), ("Análise", 0), ("Due diligence", 0), ("Onboarding", 0), ("Liquidação", 0)]):
        y = 82 + i * 38
        if on:
            o.append(rect(12, y - 20, 146, 32, 8, LI))
        o.append(text(26, y, t, 12.5, "#2B1B3D" if on else "#E4DCEF", 600 if on else 400))
    o.append(text(204, 48, "Minhas oportunidades", 24, INK, 700))
    o.append(text(204, 72, "Originador · 12 em andamento", 12.5, MU))
    for i, (t, v, n) in enumerate([("Em análise", "5", "R$ 3,2 mi"), ("Due diligence", "4", "R$ 2,1 mi"), ("A liquidar", "3", "R$ 1,4 mi")]):
        x = 204 + i * 212
        o.append(rect(x, 96, 196, 92, 12, "#fff", "#E3DEEA"))
        o.append(text(x + 16, 120, t.upper(), 9.5, MU, 700, ls=".08em"))
        o.append(text(x + 16, 162, v, 34, PU, 700))
        o.append(text(x + 180, 162, n, 12, MU, 500, "end"))
    o.append(rect(204, 208, 624, 290, 12, "#fff", "#E3DEEA"))
    o.append(text(224, 238, "OPORTUNIDADE", 9.5, MU, 700, ls=".08em"))
    o.append(text(520, 238, "ETAPA", 9.5, MU, 700, ls=".08em"))
    o.append(text(700, 238, "VALOR", 9.5, MU, 700, ls=".08em"))
    rows = [("Precatório estadual · SP", "Análise", "R$ 480 mil", "#EFE9F6", PU),
            ("Precatório municipal · RJ", "Due diligence", "R$ 1,1 mi", "#EAF3D0", "#4C5F12"),
            ("Precatório federal · DF", "Onboarding", "R$ 760 mil", "#EFE9F6", PU),
            ("Precatório estadual · MG", "Liquidação", "R$ 320 mil", "#EAF3D0", "#4C5F12"),
            ("Precatório municipal · BA", "Análise", "R$ 905 mil", "#EFE9F6", PU)]
    for i, (n, e, v, bg, fg) in enumerate(rows):
        y = 262 + i * 46
        o.append(line(224, y - 8, 808, y - 8, "#EEE9F3", 1))
        o.append(text(224, y + 18, n, 13, INK, 500))
        o.append(rect(512, y + 3, 112, 24, 12, bg))
        o.append(text(568, y + 19.5, e, 11, fg, 700, "middle"))
        o.append(text(700, y + 18, v, 13, INK, 600))
    return "".join(o)


def ofl_phone():
    W, H = 220, 452
    INK, MU, PU, LI = "#241635", "#6B6478", "#5A3A7B", "#C6DE64"
    o = [rect(0, 0, W, H, 0, "#F6F4F9")]
    o.append(text(18, 22, "9:41", 8.5, INK, 600))
    o.append(rect(0, 40, W, 44, 0, "#3B2556"))
    o.append(text(16, 67, "Nova oportunidade", 13, "#fff", 700))
    o.append(text(16, 112, "Passo 2 de 5 · Análise", 9, MU, 600))
    for i in range(5):
        o.append(rect(16 + i * 38, 122, 34, 4, 2, PU if i < 2 else "#DCD4E8"))
    o.append(rect(12, 144, 196, 120, 12, "#fff", "#E3DEEA"))
    o.append(text(24, 166, "PRECATÓRIO", 7.5, MU, 700, ls=".08em"))
    o.append(text(24, 190, "Estadual · SP", 14, INK, 700))
    o.append(text(24, 226, "R$ 480 mil", 22, PU, 700))
    o.append(text(24, 248, "Cedente verificado", 9, "#2C7A4B", 600))
    for i, (t, ok) in enumerate([("Documentos", 1), ("Habilitação", 1), ("Due diligence", 0)]):
        y = 292 + i * 32
        o.append(circle(26, y, 8, LI if ok else "#fff", None if ok else "#CFC6DD", 1.4))
        if ok:
            o.append(text(26, y + 3.5, "✓", 10, "#2B1B3D", 700, "middle"))
        o.append(text(44, y + 4, t, 11.5, INK if ok else MU, 600 if ok else 400))
    o.append(rect(12, 396, 196, 38, 19, PU))
    o.append(text(110, 420, "Enviar para análise", 11, "#fff", 700, "middle"))
    return "".join(o)


# ---------------------------------------------------------------- configuracao por case
CASES = {
    "torre": dict(uid="t", scr=C.torre_screen, ph=C.torre_phone, frame="#0A0E11", ws=C.torre_screen,
                  bgs=["#0A4048", "#EEF3F4", "#4DBFCB"], gc=("#06222A", "#4DBFCB")),
    "planta": dict(uid="p", scr=C.planta_screen, ph=C.planta_phone, frame="#0C0D11", ws=C.planta_screen,
                   bgs=["#241A33", "#ECEAF1", "#C6DE64"], gc=("#121018", "#C6DE64")),
    "openflow": dict(uid="o", scr=ofl_screen, ph=ofl_phone, frame="#1B1226", ws=ofl_screen,
                     bgs=["#5A3A7B", "#F1EEF6", "#C6DE64"], gc=("#2F1D44", "#C6DE64")),
}


def build(case, v):
    k = CASES[case]; uid = k["uid"]; dark, light, acc = k["bgs"]
    defs = ""
    b = []
    if v == 1:
        # PALCO CLARO: fundo liso claro, laptop grande sangrando na base, celular na frente
        b.append(rect(0, 0, 1600, 800, 0, light))
        b.append(rect(0, 560, 1600, 240, 0, dark, op=".08"))
        b.append('<g transform="translate(800 400) scale(1.08) translate(-800 -420)">')
        b.append(laptop(uid, 372, 100, 860, 537, k["scr"](), k["frame"]))
        b.append(phone(uid, 1056, 270, 238, 470, k["ph"](), k["frame"]))
        b.append("</g>")
    elif v == 2:
        # JANELA INCLINADA: janela de navegador sem aparelho + celular girado, fundo escuro com cor da marca
        defs = f'<radialGradient id="{uid}-g" cx="30%" cy="20%" r="90%"><stop offset="0" stop-color="{dark}"/><stop offset="1" stop-color="{k["gc"][0]}"/></radialGradient>'
        b.append(rect(0, 0, 1600, 800, 0, f"url(#{uid}-g)"))
        b += grid()
        b.append(rot(780, 400, -4, window(uid, 330, 150, 800, 500, f'<g transform="scale({800/860:.4f})">{k["ws"]()}</g>')))
        b.append(rot(1190, 520, 6, phone(uid, 1060, 290, 238, 470, k["ph"](), k["frame"])))
    else:
        # RECORTE: so o tela do laptop, enorme e cortada, celular centralizado a frente, cor viva de fundo
        b.append(rect(0, 0, 1600, 800, 0, acc if case != "torre" else "#4DBFCB"))
        b.append(rect(0, 0, 1600, 800, 0, dark, op=".12"))
        b.append('<g transform="translate(560 120) rotate(-2)">')
        b.append(f'<g transform="scale(1.32)">{window(uid, 0, 30, 860, 537, k["ws"]())}</g></g>')
        b.append(phone(uid, 430, 210, 262, 520, k["ph"](), k["frame"]))
    return C.wrap(uid, defs, "\n".join(b))


LABEL = {1: "Palco claro", 2: "Janela inclinada", 3: "Recorte"}


def main():
    os.makedirs(PROP, exist_ok=True)
    if "--aplicar" in sys.argv:
        for a in sys.argv[sys.argv.index("--aplicar") + 1:]:
            c, v = a.split("="); v = int(v)
            name = {"torre": "capa-torre.svg", "planta": "capa-planta.svg", "openflow": "capa-openflow.svg"}[c]
            open(os.path.join(C.OUT, name), "w", encoding="utf-8").write(build(c, v)); print("aplicado", name, v)
        return
    cards = []
    for c in CASES:
        for v in (1, 2, 3):
            fn = f"{c}-{v}.svg"
            open(os.path.join(PROP, fn), "w", encoding="utf-8").write(build(c, v))
            cards.append(f'<figure><img src="{fn}" alt=""><figcaption>{c} · {v} · {LABEL[v]}</figcaption></figure>')
    open(os.path.join(PROP, "index.html"), "w", encoding="utf-8").write(
        '<!doctype html><meta charset="utf-8"><title>Propostas de capa</title><style>body{font:14px system-ui;margin:20px;background:#fafafa}'
        '.g{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}img{width:100%;display:block;border:1px solid #ddd}figcaption{margin:4px 0 12px;color:#555}</style>'
        '<div class="g">' + "".join(cards) + "</div>")
    print("ok", len(cards), "propostas ->", PROP)


if __name__ == "__main__":
    main()
