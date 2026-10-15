#!/usr/bin/env python3
"""Gera as 3 capas da home (SVG 1600x800, vetoriais) em assets/projects/.

Uso: python build/capas.py
- capa-torre.svg    laptop + celular com a Torre de Controle (dados fictícios do protótipo)
- capa-planta.svg   laptop + celular com o painel da planta (sem marca do cliente)
- capa-openflow.svg diagrama: 5 perfis -> 3 personas -> fluxo do ecossistema

A home mostra a capa em cinza e devolve a cor no hover (site.css), e no celular
corta em 4:3 pelo centro: tudo importante fica entre x=267 e x=1333.
"""
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "projects")
FONT = "Inter Tight, Inter, Segoe UI, Helvetica Neue, Arial, sans-serif"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def rect(x, y, w, h, r=0, fill="none", stroke=None, sw=1, op=None, extra=""):
    s = f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="{r:g}" fill="{fill}"'
    if stroke:
        s += f' stroke="{stroke}" stroke-width="{sw:g}"'
    if op is not None:
        s += f' opacity="{op}"'
    return s + f" {extra}/>"


def text(x, y, s, size=10, fill="#fff", weight=400, anchor="start", op=None, ls=None):
    a = f'<text x="{x:g}" y="{y:g}" font-size="{size:g}" fill="{fill}" font-weight="{weight}"'
    if anchor != "start":
        a += f' text-anchor="{anchor}"'
    if op is not None:
        a += f' opacity="{op}"'
    if ls:
        a += f' letter-spacing="{ls}"'
    return a + f">{esc(s)}</text>"


def circle(cx, cy, r, fill="none", stroke=None, sw=1, op=None):
    s = f'<circle cx="{cx:g}" cy="{cy:g}" r="{r:g}" fill="{fill}"'
    if stroke:
        s += f' stroke="{stroke}" stroke-width="{sw:g}"'
    if op is not None:
        s += f' opacity="{op}"'
    return s + "/>"


def line(x1, y1, x2, y2, stroke, sw=1, dash=None, op=None):
    s = f'<line x1="{x1:g}" y1="{y1:g}" x2="{x2:g}" y2="{y2:g}" stroke="{stroke}" stroke-width="{sw:g}"'
    if dash:
        s += f' stroke-dasharray="{dash}"'
    if op is not None:
        s += f' opacity="{op}"'
    return s + "/>"


def poly(points, stroke, sw=1.5, fill="none", dash=None, op=None):
    pts = " ".join(f"{x:g},{y:g}" for x, y in points)
    s = f'<polyline points="{pts}" fill="{fill}" stroke="{stroke}" stroke-width="{sw:g}" stroke-linejoin="round" stroke-linecap="round"'
    if dash:
        s += f' stroke-dasharray="{dash}"'
    if op is not None:
        s += f' opacity="{op}"'
    return s + "/>"


def path(d, fill="none", stroke=None, sw=1, op=None):
    s = f'<path d="{d}" fill="{fill}"'
    if stroke:
        s += f' stroke="{stroke}" stroke-width="{sw:g}" stroke-linecap="round" stroke-linejoin="round"'
    if op is not None:
        s += f' opacity="{op}"'
    return s + "/>"


def laptop(uid, x, y, w, h, inner, frame="#0A0E11"):
    """Tela w x h em (x, y); o conteudo `inner` usa coordenadas 0..w, 0..h."""
    b = 14
    g = []
    g.append(f'<clipPath id="{uid}-s"><rect x="0" y="0" width="{w}" height="{h}" rx="6"/></clipPath>')
    # sombra
    g.append(f'<ellipse cx="{x + w / 2:g}" cy="{y + h + 52}" rx="{w * 0.56:g}" ry="16" fill="#000" opacity=".32" filter="url(#{uid}-bl)"/>')
    # tampa
    g.append(rect(x - b, y - b, w + 2 * b, h + 2 * b, 18, frame))
    g.append(rect(x - b + 1, y - b + 1, w + 2 * b - 2, h + 2 * b - 2, 17, "none", "#2A3238", 1))
    g.append(circle(x + w / 2, y - 7, 2.2, "#1C242A"))
    g.append(f'<g clip-path="url(#{uid}-s)" transform="translate({x},{y})">{inner}</g>')
    # base
    by = y + h + b
    g.append(path(f"M{x - b - 40},{by} H{x + w + b + 40} L{x + w + b + 26},{by + 18} Q{x + w + b + 24},{by + 22} {x + w + b + 18},{by + 22} H{x - b - 18} Q{x - b - 24},{by + 22} {x - b - 26},{by + 18} Z", "#C9CED3"))
    g.append(path(f"M{x - b - 40},{by} H{x + w + b + 40} L{x + w + b + 38},{by + 5} H{x - b - 38} Z", "#E3E7EA"))
    g.append(rect(x + w / 2 - 60, by, 120, 7, 3, "#9CA3AA"))
    return "\n".join(g)


def phone(uid, x, y, w, h, inner, frame="#0A0E11"):
    p = 9
    g = []
    g.append(f'<clipPath id="{uid}-p"><rect x="0" y="0" width="{w - 2 * p}" height="{h - 2 * p}" rx="28"/></clipPath>')
    g.append(f'<ellipse cx="{x + w / 2:g}" cy="{y + h + 14}" rx="{w * 0.55:g}" ry="12" fill="#000" opacity=".35" filter="url(#{uid}-bl)"/>')
    g.append(rect(x, y, w, h, 38, frame))
    g.append(rect(x + 1, y + 1, w - 2, h - 2, 37, "none", "#2E373E", 1.2))
    g.append(f'<g clip-path="url(#{uid}-p)" transform="translate({x + p},{y + p})">{inner}</g>')
    g.append(rect(x + w / 2 - 28, y + 15, 56, 14, 7, frame))
    return "\n".join(g)


# aumenta 4% e centraliza o conjunto laptop+celular (centro em 821,411) no quadro
DEV_OPEN = '<g transform="translate(800 404) scale(1.04) translate(-821 -411)">'


def wrap(uid, bg_defs, body):
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800" width="1600" height="800" '
        f'font-family="{FONT}" role="img" aria-label="Capa do case">\n'
        f"<defs>{bg_defs}"
        f'<filter id="{uid}-bl" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>'
        "</defs>\n" + body + "\n</svg>\n"
    )


# ---------------------------------------------------------------- TORRE
def torre_screen():
    W, H = 860, 537
    BG, CARD, ST = "#0D1519", "#121D22", "#22323A"
    TX, MU, AC = "#EAF2F4", "#93A8AF", "#4DBFCB"
    RED, AMB, GRN = "#F28B8B", "#F2C36B", "#74D69B"
    o = [rect(0, 0, W, H, 0, BG)]
    # topo
    o.append(rect(0, 0, W, 32, 0, "#101A1F"))
    o.append(line(0, 32, W, 32, "#1E2B31"))
    o.append(rect(12, 9, 14, 14, 4, AC))
    o.append(text(34, 21, "Torre de Controle", 10, TX, 600))
    o.append(rect(706, 7, 66, 18, 9, "none", "#2A3A42"))
    o.append(text(739, 19.5, "Insights", 8.5, TX, 500, "middle"))
    o.append(circle(796, 16, 8, "none", "#2A3A42"))
    o.append(circle(802, 10, 4, RED))
    o.append(circle(830, 16, 9, AC))
    # lateral
    o.append(rect(0, 33, 108, H - 33, 0, "#0F181C"))
    o.append(rect(8, 46, 92, 22, 5, AC))
    o.append(text(20, 60.5, "Estratégico", 9, "#06242A", 700))
    for i, n in enumerate(["Tático", "Vendas", "Financeiro", "Operação", "Alertas"]):
        yy = 84 + i * 24
        o.append(circle(19, yy - 3, 3.5, "none", "#7F959C", 1))
        o.append(text(30, yy, n, 9, "#A9BBC1", 500))
    o.append(rect(82, 164, 14, 12, 6, RED, op=".9"))
    o.append(text(89, 173.5, "3", 7.5, "#2B0A0A", 700, "middle"))
    # titulo
    o.append(text(122, 58, "Visão estratégica", 15, TX, 700))
    o.append(text(238, 58, "A saúde do negócio nos 5 centros de distribuição", 8, MU))
    # decisoes
    cards = [
        (RED, "Crítico", ["CD 2 abaixo da meta de SLA,", "com ocupação de 97%"], ["IA recomenda: Mover 1.700 posições", "do CD 2 para o CD 5."]),
        (AMB, "Atenção", ["CD 3 acima do limite", "operacional de 80%"], ["IA recomenda: Mover 400 posições", "do CD 3 para o CD 4."]),
        (AMB, "Atenção", ["Inadimplência do Marketplace", "em 3,8%, acima da meta de 3%"], ["IA recomenda: Encaminhar ao", "Financeiro a revisão de limite."]),
    ]
    for i, (col, tag, t, ia) in enumerate(cards):
        x = 122 + i * 248
        y = 70
        o.append(rect(x, y, 232, 86, 8, CARD, ST))
        o.append(rect(x, y + 6, 3, 74, 1.5, col))
        o.append(rect(x + 14, y + 10, 44, 13, 6.5, col, op=".18"))
        o.append(text(x + 36, y + 19.5, "▲ " + tag, 7, col, 700, "middle"))
        o.append(text(x + 14, y + 38, t[0], 9.5, TX, 700))
        o.append(text(x + 14, y + 50, t[1], 9.5, TX, 700))
        o.append(text(x + 14, y + 64, ia[0], 7.5, "#B7C8CD"))
        o.append(text(x + 14, y + 74, ia[1], 7.5, "#B7C8CD"))
        o.append(rect(x + 150, y + 62, 72, 17, 8.5, AC))
        o.append(text(x + 186, y + 73.5, "Ver recomendação", 7, "#06242A", 700, "middle"))
    # kpis
    k = [("Faturamento, 12 meses", "R$ 80,0M", "▲ 8,1%", GRN), ("Resultado de caixa", "+R$ 3,3M", "", GRN), ("SLA global", "96,5%", "✓ Na meta", GRN), ("Inadimplência global", "2,3%", "✓ Na meta", GRN), ("Score médio da carteira", "79", "", GRN)]
    for i, (lb, v, bd, bc) in enumerate(k):
        x = 122 + i * 147.6
        y = 166
        o.append(rect(x, y, 137.6, 64, 8, CARD, ST))
        o.append(text(x + 11, y + 17, lb, 7.5, MU))
        o.append(text(x + 11, y + 42, v, 18, TX, 700))
        if bd:
            o.append(rect(x + 137.6 - 52, y + 8, 42, 12, 6, bc, op=".16"))
            o.append(text(x + 137.6 - 31, y + 16.8, bd, 6.5, bc, 700, "middle"))
        base = y + 58
        seed = [3, 5, 2, 4, 6, 5, 7, 6, 8, 7, 9, 8]
        pts = [(x + 11 + j * 10.3, base - s) for j, s in enumerate(seed)]
        o.append(poly(pts, AC, 1.2, op=".8"))
    # grafico de barras
    cy, ch = 240, 283
    o.append(rect(122, cy, 330, ch, 8, CARD, ST))
    o.append(text(136, cy + 20, "Faturamento", 10, TX, 700))
    o.append(text(136, cy + 32, "Últimos 12 meses · R$ milhões", 7, MU))
    o.append(rect(330, cy + 14, 7, 7, 2, "#3F6573"))
    o.append(text(341, cy + 20.5, "Realizado", 6.5, MU))
    o.append(rect(384, cy + 14, 7, 7, 2, AC))
    o.append(text(395, cy + 20.5, "Atual", 6.5, MU))
    vals = [7.2, 6.9, 5.9, 5.6, 6.2, 6.1, 6.4, 6.6, 6.8, 6.9, 7.4, 8.0]
    prev = [7.0, 7.3, 6.2, 5.8, 6.2, 6.3, 6.6, 6.8, 7.0, 7.2, 7.1, 7.5]
    base = cy + ch - 28
    for g in range(0, 5):
        gy = base - g * 45
        o.append(line(136, gy, 440, gy, "#1F2E35", 1, "2 3"))
        o.append(text(130, gy + 2.5, str(g * 2.5).replace(".", ","), 6, MU, 400, "end"))
    for j, v in enumerate(vals):
        bx = 140 + j * 25.2
        hh = v / 10 * 180
        o.append(rect(bx, base - hh, 16, hh, 2.5, AC if j == 11 else "#3F6573"))
    o.append(poly([(148 + j * 25.2, base - p / 10 * 180) for j, p in enumerate(prev)], "#E6EEF0", 1, dash="3 3", op=".9"))
    for j, p in enumerate(prev):
        o.append(circle(148 + j * 25.2, base - p / 10 * 180, 2, BG, "#E6EEF0", 1))
    for j, m in enumerate("NDJFMAMJJASO"):
        o.append(text(148 + j * 25.2, base + 12, m, 6.5, MU, 400, "middle"))
    o.append(text(148 + 11 * 25.2, base - 8 / 10 * 180 - 5, "8,0", 8, TX, 700, "middle"))
    # por CD
    x0 = 462
    o.append(rect(x0, cy, 190, ch, 8, CARD, ST))
    o.append(text(x0 + 14, cy + 20, "Faturamento por CD", 10, TX, 700))
    o.append(text(x0 + 14, cy + 32, "12 meses · participação", 7, MU))
    data = [("CD 1", 38, "R$ 30,0M"), ("CD 2", 25, "R$ 20,0M"), ("CD 3", 19, "R$ 15,0M"), ("CD 4", 13, "R$ 10,0M"), ("CD 5", 6, "R$ 5,0M")]
    for j, (n, p, vv) in enumerate(data):
        yy = cy + 62 + j * 42
        o.append(text(x0 + 14, yy + 3, n, 8, TX, 600))
        o.append(rect(x0 + 14, yy + 10, 162, 8, 4, "#1B2A31"))
        o.append(rect(x0 + 14, yy + 10, 162 * p / 38, 8, 4, AC))
        o.append(text(x0 + 176, yy + 3, vv, 7.5, MU, 500, "end"))
    # fluxo
    x1 = 662
    o.append(rect(x1, cy, 186, ch, 8, CARD, ST))
    o.append(text(x1 + 14, cy + 20, "Fluxo de caixa", 10, TX, 700))
    o.append(text(x1 + 14, cy + 32, "A receber e a pagar · R$ milhões", 7, MU))
    a = [7.2, 7.3, 6.0, 5.7, 6.3, 6.2, 6.5, 6.7, 6.9, 7.0, 7.0, 7.7]
    b = [6.6, 6.9, 6.2, 6.0, 6.1, 6.0, 6.2, 6.3, 6.4, 6.6, 6.8, 7.1]
    px = lambda j: x1 + 16 + j * 14.7
    py = lambda v: cy + ch - 36 - (v - 5) / 4 * 170
    up = [(px(j), py(v)) for j, v in enumerate(a)]
    dn = [(px(j), py(v)) for j, v in enumerate(b)]
    o.append(path("M" + " L".join(f"{x:g},{y:g}" for x, y in up) + " L" + " L".join(f"{x:g},{y:g}" for x, y in reversed(dn)) + " Z", AC, None, 1, ".18"))
    o.append(poly(up, AC, 1.8))
    o.append(poly(dn, "#9AA9AE", 1.5, dash="3 3"))
    o.append(circle(*up[-1], 2.6, AC))
    return "".join(o)


def torre_phone():
    W, H = 220, 452
    BG, CARD, ST = "#0D1519", "#121D22", "#22323A"
    TX, MU, AC = "#EAF2F4", "#93A8AF", "#4DBFCB"
    RED, GRN = "#F28B8B", "#74D69B"
    o = [rect(0, 0, W, H, 0, BG)]
    o.append(text(18, 22, "9:41", 8.5, TX, 600))
    o.append(rect(0, 40, W, 42, 0, "#101A1F"))
    o.append(rect(14, 52, 18, 18, 5, AC))
    o.append(text(40, 65, "Alerta", 12, TX, 700))
    o.append(circle(W - 26, 61, 9, "none", "#2A3A42"))
    o.append(rect(16, 98, 54, 15, 7.5, RED, op=".18"))
    o.append(text(43, 108.5, "▲ Crítico", 8, RED, 700, "middle"))
    for i, t in enumerate(["CD 2 abaixo da meta de SLA,", "com ocupação de 97%"]):
        o.append(text(16, 134 + i * 16, t, 12.5, TX, 700))
    o.append(text(16, 168, "Operação · há 18 min", 8, MU))
    o.append(text(16, 192, "O QUE ESTÁ ACONTECENDO", 7, MU, 600, ls=".08em"))
    pts = [(24, 214), (78, 224), (132, 238), (186, 254)]
    o.append(line(16, 210, 204, 210, "#6E858C", 1, "3 3"))
    o.append(poly(pts, RED, 2))
    for (x, y), v in zip(pts, ["94,8", "93,9", "92,6", "91,2"]):
        o.append(circle(x, y, 2.6, RED))
        o.append(text(x, y + 14, v, 7, RED, 700, "middle"))
    o.append(rect(12, 290, 196, 100, 10, "#10262B", AC, 1.2))
    o.append(text(24, 308, "Mover 1.700 posições", 10.5, TX, 700))
    o.append(text(24, 321, "do CD 2 para o CD 5", 10.5, TX, 700))
    rows = [("CD 2 · ocupação", "97%", "80%"), ("CD 5 · ocupação", "28%", "56%"), ("CD 2 · SLA (IA)", "91,2%", "94,0%")]
    for i, (n, a, b) in enumerate(rows):
        yy = 342 + i * 15
        o.append(text(24, yy, n, 7.5, "#B7C8CD"))
        o.append(text(138, yy, a, 7.5, "#B7C8CD", 400, "end"))
        o.append(text(150, yy, "→", 7.5, MU, 400, "middle"))
        o.append(text(196, yy, b, 8, TX, 700, "end"))
    o.append(rect(12, 402, 196, 34, 17, AC))
    o.append(text(110, 423, "Aplicar recomendação", 10.5, "#06242A", 700, "middle"))
    return "".join(o)


def capa_torre():
    uid = "t"
    defs = (
        '<radialGradient id="t-g1" cx="30%" cy="20%" r="75%"><stop offset="0" stop-color="#16808B"/><stop offset=".55" stop-color="#0A4048"/><stop offset="1" stop-color="#06222A"/></radialGradient>'
        '<radialGradient id="t-g2" cx="85%" cy="95%" r="55%"><stop offset="0" stop-color="#4DBFCB" stop-opacity=".35"/><stop offset="1" stop-color="#4DBFCB" stop-opacity="0"/></radialGradient>'
    )
    body = [rect(0, 0, 1600, 800, 0, "url(#t-g1)"), rect(0, 0, 1600, 800, 0, "url(#t-g2)")]
    for gx in range(0, 1601, 80):
        body.append(line(gx, 0, gx, 800, "#fff", 1, op=".035"))
    for gy in range(0, 801, 80):
        body.append(line(0, gy, 1600, gy, "#fff", 1, op=".035"))
    body.append(DEV_OPEN)
    body.append(laptop(uid, 372, 92, 860, 537, torre_screen()))
    body.append(phone(uid, 1086, 262, 238, 470, torre_phone()))
    body.append("</g>")
    return wrap(uid, defs, "\n".join(body))


# ---------------------------------------------------------------- PLANTA
def planta_screen():
    W, H = 860, 537
    BG, INK, MU, ST = "#ECEEF2", "#14161A", "#5A616B", "#D3D7DE"
    PU, OK, WARN = "#69458D", "#1E7B4B", "#B26A00"
    o = [rect(0, 0, W, H, 0, BG)]
    o.append(rect(0, 0, W, 38, 0, "#fff"))
    o.append(line(0, 38, W, 38, ST))
    o.append(rect(14, 12, 14, 14, 3, INK))
    o.append(text(36, 24, "PRODUCT NAME", 9.5, INK, 700, ls=".08em"))
    for i, n in enumerate(["Home", "Circuits", "Parameters", "History", "Reports"]):
        x = 180 + i * 78
        o.append(text(x, 24, n, 9.5, INK if i == 0 else MU, 700 if i == 0 else 500))
        if i == 0:
            o.append(rect(x, 33, 28, 3, 1.5, PU))
    o.append(rect(678, 9, 92, 21, 10.5, "#E3F3EA", OK, 1))
    o.append(text(724, 23, "✓ AI ACTIVE", 8, OK, 700, "middle"))
    o.append(circle(806, 19.5, 11, PU))
    o.append(text(806, 23, "SO", 7.5, "#fff", 700, "middle"))
    o.append(text(24, 62, "SHIFT B · 07:00–19:00 · 4h12 REMAINING", 8, MU, 600, ls=".06em"))
    # banner
    o.append(rect(24, 72, 812, 70, 8, "#FFF6E0", "#E0B040", 1.2))
    o.append(rect(24, 72, 5, 70, 2.5, "#E0A000"))
    o.append(text(44, 92, "▲ 1   ACTION NEEDED", 9.5, WARN, 700, ls=".06em"))
    o.append(text(44, 110, "SAG_Ouvido_Eletronico drifting below control band for 12 min —", 9, INK, 500))
    o.append(text(44, 124, "AI cannot compensate without a setpoint change.", 9, INK, 500))
    o.append(text(44, 136, "14:38 · SAG MILL", 7.5, MU, 600))
    o.append(rect(596, 92, 96, 26, 13, INK))
    o.append(text(644, 109, "Acknowledge", 9, "#fff", 700, "middle"))
    o.append(rect(702, 92, 122, 26, 13, "#fff", INK, 1.2))
    o.append(text(763, 109, "Open circuit", 9, INK, 700, "middle"))
    # kpis
    def kcard(x, w, title, tgt, val, unit, note, notec, extra):
        o.append(rect(x, 156, w, 150, 10, "#fff", ST))
        o.append(text(x + 16, 178, title, 8.5, MU, 700, ls=".08em"))
        o.append(text(x + w - 16, 178, tgt, 8, MU, 600, "end"))
        o.append(text(x + 16, 224, val, 40, INK, 700))
        o.append(text(x + 16 + len(val) * 22 + 6, 224, unit, 13, MU, 500))
        o.append(text(x + 16, 246, note, 9, notec, 700))
        o.append(extra)
    spark = poly([(200, 262), (232, 258), (264, 260), (296, 252), (328, 254), (360, 246), (392, 248)], PU, 2) + line(200, 250, 392, 250, "#8A93A0", 1, "3 3")
    kcard(24, 400, "THROUGHPUT", "TARGET 375 t/h", "380", "t/h", "↑ +1.3% vs target", OK, spark)
    band = (
        rect(452, 270, 368, 12, 6, "#E4E7EC")
        + rect(560, 270, 126, 12, 6, "#CFE9DB")
        + rect(626, 264, 4, 24, 2, INK)
        + text(452, 300, "79.5", 7.5, MU, 600)
        + text(820, 300, "80.5", 7.5, MU, 600, "end")
    )
    kcard(436, 400, "QUALITY P80", "BAND 79.5–80.5", "80.1", "%", "✓ IN BAND", OK, band)
    # tendencia
    o.append(rect(24, 318, 812, 200, 10, "#fff", ST))
    o.append(text(40, 340, "SAG MILL · LAST 4 HOURS", 8.5, MU, 700, ls=".08em"))
    o.append(rect(40, 388, 780, 56, 0, "#CFE9DB", op=".55"))
    o.append(line(40, 388, 820, 388, "#6FAE8C", 1, "4 3"))
    o.append(line(40, 444, 820, 444, "#6FAE8C", 1, "4 3"))
    import math
    pts = [(40 + i * 26, 416 + math.sin(i / 2.2) * 11 + max(0, i - 20) * 2.6) for i in range(31)]
    o.append(poly(pts, PU, 2.2))
    o.append(circle(*pts[-1], 4, PU))
    o.append(text(820, 380, "BAND", 7.5, "#3F7F5E", 700, "end", ls=".08em"))
    for i, t in enumerate(["14:00", "15:00", "16:00", "17:00", "18:00"]):
        o.append(text(60 + i * 190, 500, t, 7.5, MU, 500, "middle"))
    return "".join(o)


def planta_phone():
    W, H = 220, 452
    INK, MU = "#14161A", "#5A616B"
    PU = "#69458D"
    o = [rect(0, 0, W, H, 0, "#ECEEF2")]
    o.append(text(18, 22, "9:41", 8.5, INK, 600))
    o.append(rect(0, 40, W, 40, 0, "#fff"))
    o.append(rect(14, 52, 14, 14, 3, INK))
    o.append(text(34, 63, "PRODUCT NAME", 8.5, INK, 700, ls=".08em"))
    o.append(rect(150, 51, 56, 18, 9, "#E3F3EA", "#1E7B4B", 1))
    o.append(text(178, 63, "✓ AI ACTIVE", 6.5, "#1E7B4B", 700, "middle"))
    o.append(rect(12, 94, 196, 78, 10, "#fff", "#D3D7DE"))
    o.append(text(24, 114, "THROUGHPUT", 7, MU, 700, ls=".08em"))
    o.append(text(24, 150, "380", 30, INK, 700))
    o.append(text(86, 150, "t/h", 11, MU, 500))
    o.append(rect(12, 182, 196, 78, 10, "#fff", "#D3D7DE"))
    o.append(text(24, 202, "QUALITY P80", 7, MU, 700, ls=".08em"))
    o.append(text(24, 238, "80.1", 30, INK, 700))
    o.append(text(88, 238, "%", 11, MU, 500))
    # modal
    o.append(rect(0, 0, W, H, 0, "#0A0B0E", op=".62"))
    o.append(rect(14, 238, 192, 168, 16, "#fff"))
    o.append(rect(28, 254, 26, 26, 13, "#FFF1D6", "#E0B040", 1))
    o.append(text(41, 272, "!", 15, "#B26A00", 700, "middle"))
    o.append(text(28, 304, "Turn off AI control?", 13, INK, 700))
    o.append(rect(28, 316, 150, 5, 2.5, "#D3D7DE"))
    o.append(rect(28, 328, 120, 5, 2.5, "#D3D7DE"))
    o.append(rect(28, 344, 164, 24, 12, PU))
    o.append(text(110, 360, "Keep AI on", 9.5, "#fff", 700, "middle"))
    o.append(rect(28, 374, 164, 24, 12, "#fff", INK, 1.2))
    o.append(text(110, 390, "Turn off…", 9.5, INK, 700, "middle"))
    return "".join(o)


def capa_planta():
    uid = "p"
    defs = (
        '<radialGradient id="p-g1" cx="25%" cy="15%" r="85%"><stop offset="0" stop-color="#4A2F66"/><stop offset=".6" stop-color="#241A33"/><stop offset="1" stop-color="#121018"/></radialGradient>'
        '<radialGradient id="p-g2" cx="90%" cy="95%" r="50%"><stop offset="0" stop-color="#C6DE64" stop-opacity=".28"/><stop offset="1" stop-color="#C6DE64" stop-opacity="0"/></radialGradient>'
    )
    body = [rect(0, 0, 1600, 800, 0, "url(#p-g1)"), rect(0, 0, 1600, 800, 0, "url(#p-g2)")]
    for gx in range(0, 1601, 80):
        body.append(line(gx, 0, gx, 800, "#fff", 1, op=".03"))
    for gy in range(0, 801, 80):
        body.append(line(0, gy, 1600, gy, "#fff", 1, op=".03"))
    body.append(DEV_OPEN)
    body.append(laptop(uid, 372, 92, 860, 537, planta_screen(), "#0C0D11"))
    body.append(phone(uid, 1086, 262, 238, 470, planta_phone(), "#0C0D11"))
    body.append("</g>")
    return wrap(uid, defs, "\n".join(body))


# ---------------------------------------------------------------- OPEN FLOW
def capa_openflow():
    uid = "o"
    LIME, WH = "#C6DE64", "#FFFFFF"
    defs = (
        '<radialGradient id="o-g1" cx="20%" cy="10%" r="90%"><stop offset="0" stop-color="#7B55A0"/><stop offset=".55" stop-color="#5A3A7B"/><stop offset="1" stop-color="#2F1D44"/></radialGradient>'
        '<radialGradient id="o-g2" cx="88%" cy="90%" r="50%"><stop offset="0" stop-color="#C6DE64" stop-opacity=".25"/><stop offset="1" stop-color="#C6DE64" stop-opacity="0"/></radialGradient>'
        '<marker id="o-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill="#fff" fill-opacity=".85"/></marker>'
    )
    b = [rect(0, 0, 1600, 800, 0, "url(#o-g1)"), rect(0, 0, 1600, 800, 0, "url(#o-g2)")]
    for gx in range(0, 1601, 80):
        b.append(line(gx, 0, gx, 800, "#fff", 1, op=".04"))
    for gy in range(0, 801, 80):
        b.append(line(0, gy, 1600, gy, "#fff", 1, op=".04"))
    # rotulos de coluna
    b.append(text(300, 138, "5 PERFIS", 15, WH, 700, ls=".16em", op=".75"))
    b.append(text(612, 138, "3 PERSONAS", 15, WH, 700, ls=".16em", op=".75"))
    b.append(text(880, 138, "FLUXO DO ECOSSISTEMA", 15, WH, 700, ls=".16em", op=".75"))
    # cinco perfis
    ys5 = [220, 320, 420, 520, 620]
    hx, hy = 480, 420  # ponto de agrupamento
    for y in ys5:
        b.append(path(f"M332,{y} C410,{y} 410,{hy} {hx},{hy}", "none", WH, 2, ".55"))
    for i, y in enumerate(ys5):
        b.append(circle(310, y, 24, WH, None, 1))
        b.append(text(310, y + 5, str(i + 1), 15, "#4A2F66", 700, "middle"))
    b.append(circle(hx, hy, 9, LIME))
    # tres personas
    ys3 = [270, 420, 570]
    for y in ys3:
        b.append(path(f"M{hx},{hy} C540,{hy} 540,{y} 600,{y}", "none", WH, 2, ".55"))
    for i, y in enumerate(ys3):
        b.append(circle(650, y, 50, "#fff", None, 1, op=".12"))
        b.append(circle(650, y, 50, "none", WH, 2.2))
        b.append(circle(650, 408 + (y - 420) - 12 + 0, 0, "none"))
        # silhueta simples
        b.append(circle(650, y - 10, 12, WH, op=".95"))
        b.append(path(f"M626,{y + 28} C626,{y + 6} 674,{y + 6} 674,{y + 28} Z", WH, None, 1, ".95"))
        b.append(text(650, y + 74, f"Persona {i + 1}", 13, WH, 600, "middle", op=".85"))
    # conecta personas ao fluxo
    for y in ys3:
        b.append(path(f"M704,{y} C770,{y} 780,190 836,190", "none", WH, 1.8, ".5"))
    b.append('<g marker-end="url(#o-ar)"></g>')
    # fluxo
    steps = ["Cadastro de oportunidade", "Análise", "Due diligence", "Onboarding", "Liquidação"]
    sy = 190
    for i, s in enumerate(steps):
        y = sy + i * 100
        if i == 0:
            b.append(rect(840, y - 32, 440, 64, 32, LIME))
            b.append(text(876, y + 7, s, 21, "#2B1B3D", 700))
            b.append(rect(1180, y - 14, 80, 28, 14, "#2B1B3D"))
            b.append(text(1220, y + 5, "MVP", 13, LIME, 700, "middle", ls=".1em"))
        else:
            b.append(rect(840, y - 28, 440, 56, 28, "#fff", None, 1, ".12"))
            b.append(rect(840, y - 28, 440, 56, 28, "none", WH, 1.6, ".6"))
            b.append(text(876, y + 6, s, 19, WH, 600))
        if i < 4:
            b.append(path(f"M1060,{y + (34 if i == 0 else 30)} L1060,{y + 66}", "none", WH, 2, ".7"))
            b.append(path(f"M1054,{y + 58} L1060,{y + 67} L1066,{y + 58}", "none", WH, 2, ".7"))
    return wrap(uid, defs, "\n".join(b))


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, fn in [("capa-torre.svg", capa_torre), ("capa-planta.svg", capa_planta), ("capa-openflow.svg", capa_openflow)]:
        p = os.path.join(OUT, name)
        with open(p, "w", encoding="utf-8") as f:
            f.write(fn())
        print("ok", name, os.path.getsize(p) // 1024, "KB")


if __name__ == "__main__":
    main()
