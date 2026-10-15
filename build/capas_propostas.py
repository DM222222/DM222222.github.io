#!/usr/bin/env python3
"""Propostas alternativas de capa (SVG 1600x800), 3 por case, sem mockup de dispositivo.

Regras: so dado, texto e fato que ja estao no produto ou no case; paleta do portfolio
(branco, tinta, cinza, roxo #69458D, lime #C6DE64 so sobre escuro); lê-se em cinza
(a home mostra cinza e devolve a cor no hover); tudo importante entre x=267 e x=1333
(corte 4:3 no celular).

Uso: python build/capas_propostas.py [pasta_de_saida]
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from capas import rect, text, circle, line, poly, path, wrap  # noqa: E402

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "projects", "propostas")

INK, PAPER, SOFT = "#0A0A0A", "#F3F2EE", "#E4E2DC"
GREY, MID = "#8A8A86", "#5E5E5E"
PU, PUD, LIME = "#69458D", "#4A2F66", "#C6DE64"
SANS = "Helvetica Neue, Helvetica, Arial, sans-serif"


def T(x, y, s, size, fill=INK, weight=700, anchor="start", ls=None, op=None):
    """texto em Helvetica/Arial (SVG usado em <img> nao carrega fonte web)."""
    out = text(x, y, s, size, fill, weight, anchor, op, ls)
    return out.replace("<text ", f'<text font-family="{SANS}" ', 1)


def page(uid, bg, body, defs=""):
    return wrap(uid, defs, rect(0, 0, 1600, 800, 0, bg) + "\n" + "\n".join(body))


# ============================================================ TORRE
def torre_a():
    """Andares: a torre como diagrama de elevacao; cada andar responde a uma pergunta."""
    b = []
    b.append(T(300, 250, "UMA TORRE", 17, GREY, 700, ls=".22em"))
    b.append(T(300, 308, "Uma torre tem", 48, INK, 700, ls="-.03em"))
    b.append(T(300, 364, "andares, e a", 48, INK, 700, ls="-.03em"))
    b.append(T(300, 420, "informação", 48, INK, 700, ls="-.03em"))
    b.append(T(300, 476, "também.", 48, INK, 700, ls="-.03em"))
    b.append(line(300, 516, 560, 516, INK, 2))
    b.append(T(300, 552, "Cada nível responde a uma", 19, MID, 500))
    b.append(T(300, 578, "pergunta diferente.", 19, MID, 500))
    # torre
    cx = 1060
    slabs = [  # (y, w, nome, frase)
        (270, 240, "ESTRATÉGICO", "Lê a saúde do negócio"),
        (394, 380, "TÁTICO", "Controla a execução"),
        (518, 520, "OPERACIONAL", "Acompanha o dia a dia"),
    ]
    # mastro e farol
    b.append(line(cx, 150, cx, 270, INK, 3.5))
    b.append(circle(cx, 140, 18, PU))
    b.append(circle(cx, 140, 36, "none", PU, 2.4, ".55"))
    b.append(circle(cx, 140, 56, "none", PU, 1.8, ".28"))
    b.append(T(cx + 78, 146, "IA recomenda", 17, PU, 700))
    for i, (y, w, nome, frase) in enumerate(slabs):
        x = cx - w / 2
        b.append(rect(x, y, w, 124, 0, PAPER, INK, 3.5))
        b.append(line(x, y + 76, x + w, y + 76, INK, 1.6, op=".4"))
        for k in range(1, int(w // 30)):
            b.append(line(x + k * 30, y + 76, x + k * 30, y + 124, INK, 1.6, op=".4"))
        b.append(T(x + 18, y + 34, nome, 16, INK, 700, ls=".14em"))
        b.append(T(x + 18, y + 58, frase, 17, MID, 500))
        b.append(T(x + w - 18, y + 34, f"0{3 - i}", 16, GREY, 700, "end"))
    b.append(line(cx - 270, 642, cx + 270, 642, INK, 4))
    return page("ta", PAPER, b)


def torre_b():
    """Um lance: a decisao em tamanho de manchete, o antes e o depois do indicador."""
    b = []
    b.append(T(300, 150, "CD 2 · OCUPAÇÃO", 20, "#9A9A9A", 700, ls=".22em"))
    b.append(T(300, 400, "97%", 250, "#4A4A4A", 700, ls="-.05em"))
    b.append(line(300, 322, 760, 322, "#7A7A7A", 8, op=".9"))
    b.append(line(790, 300, 880, 300, LIME, 8))
    b.append(path("M862,278 L890,300 L862,322", "none", LIME, 8))
    b.append(T(920, 400, "80%", 250, "#FFFFFF", 700, ls="-.05em"))
    b.append(line(300, 470, 1300, 470, "#3A3A3A", 2))
    b.append(T(300, 548, "Mover 1.700 posições", 54, "#FFFFFF", 700, ls="-.02em"))
    b.append(T(300, 612, "do CD 2 para o CD 5.", 54, "#FFFFFF", 700, ls="-.02em"))
    b.append(rect(300, 650, 330, 56, 28, LIME))
    b.append(T(465, 686, "Aplicar recomendação", 22, INK, 700, "middle"))
    b.append(T(660, 686, "A ação pode ser desfeita em seguida.", 19, "#9A9A9A", 500))
    return page("tb", INK, b)


def torre_c():
    """Cinco centros: o dado como imagem; limite de 80% e a carga que sai do CD 2."""
    b = []
    cap = [12000, 10000, 9000, 8000, 6000]
    occ = [74, 97, 82, 61, 28]
    base, bw, gap, x0 = 640, 110, 70, 385
    b.append(T(300, 130, "5 CENTROS DE DISTRIBUIÇÃO", 17, GREY, 700, ls=".22em"))
    b.append(T(300, 176, "Limite de ocupação: 80%", 34, INK, 700, ls="-.02em"))
    tops = []
    for i in range(5):
        x = x0 + i * (bw + gap)
        h = cap[i] / 12000 * 380
        b.append(rect(x, base - h, bw, h, 0, "none", INK, 2.4))
        fill_h = h * occ[i] / 100
        over = occ[i] > 80
        b.append(rect(x, base - fill_h, bw, fill_h, 0, PU if over else INK, op="1" if over else ".14"))
        b.append(line(x - 10, base - h * 0.8, x + bw + 10, base - h * 0.8, INK, 2, "6 4"))
        b.append(T(x + bw / 2, base + 34, f"CD {i + 1}", 22, INK, 700, "middle"))
        b.append(T(x + bw / 2, base - h - 14, f"{occ[i]}%", 26, PU if over else INK, 700, "middle"))
        tops.append((x + bw / 2, base - h))
    # carga que sai do CD2 para o CD5
    (x2, y2), (x5, y5) = tops[1], tops[4]
    b.append(path(f"M{x2 + 20},{y2 - 62} C{x2 + 200},{y2 - 170} {x5 - 200},{y5 - 130} {x5 - 8},{y5 - 66}", "none", PU, 3))
    b.append(path(f"M{x5 - 24},{y5 - 82} L{x5 - 6},{y5 - 62} L{x5 - 32},{y5 - 56}", "none", PU, 3))
    b.append(T((x2 + x5) / 2, y2 - 146, "1.700 posições", 22, PU, 700, "middle"))
    b.append(T(300, base + 86, "Tracejado: limite de 80% da capacidade de cada centro. Altura da barra: capacidade.", 16, MID, 500))
    return page("tc", PAPER, b)


# ============================================================ PLANTA
def planta_a():
    """Tres luzes: o mesmo numero nos tres ambientes de luz do case."""
    b = []
    themes = [
        ("Claro", "escritório", "#ECEEF2", "#14161A", "#5A616B", "#69458D", "#D3D7DE", 2),
        ("Sol", "tablet em campo", "#D9DADF", "#0A0A0A", "#2A2D33", "#4A2F66", "#6B717B", 5),
        ("Escuro", "videowall", "#0C0D11", "#FFFFFF", "#B9B9C0", "#B79ADB", "#3A3C44", 2),
    ]
    b.append(T(300, 120, "A MESMA TELA, TRÊS LUZES", 17, "#9A9A9A", 700, ls=".22em"))
    for i, (nome, onde, bg, ink, mu, ac, ln, bw) in enumerate(themes):
        x = 270 + i * 360
        y = 160
        b.append(rect(x, y, 340, 470, 14, bg, ln, bw))
        b.append(T(x + 28, y + 52, "THROUGHPUT", 15, mu, 700, ls=".12em"))
        b.append(T(x + 312, y + 52, "TARGET 375", 14, mu, 600, "end"))
        b.append(T(x + 24, y + 180, "380", 128, ink, 700, ls="-.04em"))
        b.append(T(x + 286, y + 180, "t/h", 24, mu, 600))
        b.append(rect(x + 28, y + 224, 284, 14, 7, ln))
        b.append(rect(x + 120, y + 224, 100, 14, 7, ac, op=".35"))
        b.append(rect(x + 168, y + 214, 5, 34, 2, ink))
        b.append(rect(x + 28, y + 276, 170, 40, 20, "none", ink, bw if bw > 2 else 2))
        b.append(T(x + 113, y + 303, "✓ IN RANGE", 16, ink, 700, "middle", ls=".04em"))
        b.append(T(x + 28, y + 392, nome.upper(), 26, ink, 700, ls=".08em"))
        b.append(T(x + 28, y + 424, onde, 20, mu, 500))
    b.append(T(300, 700, "O Sol não é o Claro com mais brilho: bordas mais grossas e um roxo mais fechado.", 19, "#B9B9B9", 500))
    return page("pa", "#26282D", b)


def planta_b():
    """1,2:1: o achado da auditoria (botao principal invisivel) como tipografia."""
    b = []
    b.append(T(300, 140, "AUDITORIA · LEGIBILIDADE", 17, GREY, 700, ls=".22em"))
    b.append(T(285, 420, "1,2:1", 290, INK, 700, ls="-.06em"))
    b.append(line(300, 470, 1000, 470, INK, 3))
    b.append(T(300, 530, "Esse era o contraste do botão principal", 30, INK, 600, ls="-.01em"))
    b.append(T(300, 570, "da tela de entrada. A ação mais importante era invisível.", 30, INK, 600, ls="-.01em"))
    # antes / depois
    b.append(T(300, 650, "ANTES", 14, GREY, 700, ls=".2em"))
    b.append(rect(300, 664, 250, 56, 28, "#E9E9E9"))
    b.append(T(425, 700, "Sign in", 22, "#D3D3D3", 700, "middle"))
    b.append(T(680, 650, "DEPOIS", 14, GREY, 700, ls=".2em"))
    b.append(rect(680, 664, 250, 56, 28, INK))
    b.append(T(805, 700, "Sign in", 22, "#FFFFFF", 700, "middle"))
    return page("pb", PAPER, b)


def planta_c():
    """Segure: o atrito do 'desligar a IA' como um anel de pressao."""
    b = []
    cx, cy, r = 1060, 400, 190
    b.append(circle(cx, cy, r, "none", "#34343A", 26))
    ang = 0.72 * 2 * math.pi
    ex, ey = cx + r * math.sin(ang), cy - r * math.cos(ang)
    b.append(path(f"M{cx},{cy - r} A{r},{r} 0 1 1 {ex:.1f},{ey:.1f}", "none", LIME, 26))
    b.append(circle(ex, ey, 22, LIME))
    b.append(T(cx, cy + 14, "HOLD", 84, "#FFFFFF", 700, "middle", ls="-.02em"))
    b.append(T(cx, cy + 62, "to confirm", 28, "#B9B9C0", 500, "middle"))
    b.append(T(300, 190, "DESLIGAR A IA", 17, "#9A9A9A", 700, ls=".22em"))
    b.append(T(300, 290, "18 parâmetros.", 62, "#FFFFFF", 700, ls="-.03em"))
    b.append(T(300, 364, "Antes, um clique.", 62, "#6A6A72", 700, ls="-.03em"))
    b.append(line(300, 410, 620, 410, LIME, 5))
    b.append(T(300, 480, "Agora, o impacto aparece antes,", 25, "#E8E8EC", 500))
    b.append(T(300, 516, "pede o motivo e exige segurar", 25, "#E8E8EC", 500))
    b.append(T(300, 552, "para confirmar.", 25, "#E8E8EC", 500))
    return page("pc", "#0C0D11", b)


# ============================================================ OPEN FLOW
def openflow_a():
    """Esforco x impacto: a matriz que decidiu o MVP, redesenhada."""
    b = []
    X, Y, S = 330, 120, 560
    b.append(rect(X, Y, S / 2, S / 2, 0, PU, op=".12"))
    b.append(rect(X, Y, S, S, 0, "none", INK, 3))
    b.append(line(X + S / 2, Y, X + S / 2, Y + S, INK, 1.6, "6 5"))
    b.append(line(X, Y + S / 2, X + S, Y + S / 2, INK, 1.6, "6 5"))
    b.append(T(X, Y + S + 38, "ESFORÇO →", 16, GREY, 700, ls=".2em"))
    b.append(T(X - 20, Y + 8, "IMPACTO ↑", 16, GREY, 700, "end", ls=".2em"))
    dots = [(0.62, 0.30), (0.80, 0.22), (0.70, 0.55), (0.88, 0.78), (0.58, 0.82), (0.30, 0.66), (0.15, 0.80), (0.44, 0.58), (0.90, 0.42), (0.66, 0.12)]
    for dx, dy in dots:
        b.append(circle(X + dx * S, Y + dy * S, 11, "none", INK, 2.4, ".55"))
    hx, hy = X + 0.2 * S, Y + 0.22 * S
    b.append(circle(hx, hy, 24, PU))
    b.append(circle(hx, hy, 40, "none", PU, 2, ".5"))
    b.append(T(X + 14, Y + S / 2 - 14, "ALTO IMPACTO · BAIXO ESFORÇO", 14, PU, 700, ls=".1em"))
    b.append(T(980, 280, "O MVP", 74, INK, 700, ls="-.04em"))
    b.append(T(980, 358, "nasceu aqui.", 74, INK, 700, ls="-.04em"))
    b.append(line(980, 398, 1300, 398, INK, 3))
    b.append(T(980, 446, "Cadastro de oportunidade.", 26, PU, 700))
    b.append(T(980, 482, "Validado com as partes interessadas.", 21, MID, 500))
    return page("oa", PAPER, b)


def openflow_b():
    """5 -> 3: a decisao de escopo como tipografia."""
    b = []
    b.append(T(300, 130, "ORIGINADORES", 17, "#DCCDEB", 700, ls=".22em"))
    b.append(T(285, 480, "5", 440, "#FFFFFF", 700, ls="-.06em"))
    b.append(line(640, 330, 880, 330, LIME, 8))
    b.append(path("M850,300 L884,330 L850,360", "none", LIME, 8))
    b.append(T(900, 480, "3", 440, LIME, 700, ls="-.06em"))
    for i in range(5):
        b.append(circle(325 + i * 62, 560, 20, "none", "#FFFFFF", 3))
    for i in range(3):
        b.append(circle(940 + i * 100, 560, 34, LIME))
    b.append(T(300, 650, "perfis de originador", 28, "#FFFFFF", 600))
    b.append(T(920, 650, "personas", 28, "#FFFFFF", 600))
    b.append(T(300, 716, "Menos escopo, mais foco: o que cabia num primeiro MVP.", 22, "#DCCDEB", 500))
    return page("ob", PU, b)


def openflow_c():
    """Oficio: o precatorio como documento, com a oportunidade cadastrada."""
    b = []
    sx, sy, sw, sh = 800, 70, 480, 660
    b.append(rect(sx + 14, sy + 14, sw, sh, 6, "#000", op=".35"))
    b.append(rect(sx, sy, sw, sh, 6, "#FAFAF7"))
    b.append(T(sx + 40, sy + 66, "PRECATÓRIO", 15, GREY, 700, ls=".26em"))
    b.append(line(sx + 40, sy + 84, sx + sw - 40, sy + 84, INK, 3))
    for i, w in enumerate([300, 380, 340, 200]):
        b.append(T(sx + 40, sy + 130 + i * 52, ["Credor", "Devedor", "Valor", "Vara"][i].upper(), 12, GREY, 700, ls=".2em"))
        b.append(rect(sx + 40, sy + 142 + i * 52, w, 14, 2, INK))
    # carimbo
    st = []
    st.append(rect(-150, -54, 300, 108, 10, "none", PU, 7))
    st.append(rect(-140, -44, 280, 88, 6, "none", PU, 2))
    st.append(T(0, -6, "OPORTUNIDADE", 30, PU, 700, "middle", ls=".1em"))
    st.append(T(0, 30, "CADASTRADA", 30, PU, 700, "middle", ls=".1em"))
    b.append(f'<g transform="translate({sx + 270} {sy + 410}) rotate(-9)" opacity=".92">' + "".join(st) + "</g>")
    # fluxo
    steps = ["Cadastro", "Análise", "Due diligence", "Onboarding", "Liquidação"]
    for i, s in enumerate(steps):
        x = sx + 52 + i * 94
        b.append(circle(x, sy + 590, 9, PU if i == 0 else "none", PU if i == 0 else INK, 2.4))
        if i < 4:
            b.append(line(x + 9, sy + 590, x + 85, sy + 590, INK, 1.6, op=".4"))
    b.append(T(sx + 40, sy + 626, "Cadastro → Análise → Due diligence → Onboarding → Liquidação", 11, MID, 600))
    # coluna esquerda: titulo
    b.append(T(300, 300, "O negócio", 64, "#FFFFFF", 700, ls="-.03em"))
    b.append(T(300, 372, "começa aqui.", 64, LIME, 700, ls="-.03em"))
    b.append(line(300, 414, 540, 414, "#6A5A80", 3))
    b.append(T(300, 456, "Um precatório vira", 22, "#CFC6DB", 500))
    b.append(T(300, 486, "oportunidade cadastrada.", 22, "#CFC6DB", 500))
    return page("oc", "#1A1426", b)


PROPOSTAS = {
    "torre-a-andares": torre_a,
    "torre-b-um-lance": torre_b,
    "torre-c-cinco-centros": torre_c,
    "planta-a-tres-luzes": planta_a,
    "planta-b-contraste": planta_b,
    "planta-c-segure": planta_c,
    "openflow-a-matriz": openflow_a,
    "openflow-b-cinco-tres": openflow_b,
    "openflow-c-oficio": openflow_c,
}


# capas escolhidas para a home (python build/capas_propostas.py --aplicar)
ESCOLHIDAS = {
    "capa-torre.svg": torre_a,
    "capa-planta.svg": planta_c,
    "capa-openflow.svg": openflow_c,
}


def aplicar():
    destino = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "projects")
    for nome, fn in ESCOLHIDAS.items():
        p = os.path.join(destino, nome)
        with open(p, "w", encoding="utf-8") as f:
            f.write(fn())
        print("aplicada", nome, os.path.getsize(p) // 1024, "KB")


def main():
    if "--aplicar" in sys.argv:
        aplicar()
        return
    os.makedirs(OUT, exist_ok=True)
    for nome, fn in PROPOSTAS.items():
        p = os.path.join(OUT, nome + ".svg")
        with open(p, "w", encoding="utf-8") as f:
            f.write(fn())
        print("ok", nome, os.path.getsize(p) // 1024, "KB")


if __name__ == "__main__":
    main()
