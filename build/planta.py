# -*- coding: utf-8 -*-
"""Monta assets/prototipo/planta.html (layout fluido) a partir de build/planta/.
Uso: python build/planta.py   (apenas biblioteca padrao)"""
import html, json, os
AQUI = os.path.join(os.path.dirname(os.path.abspath(__file__)), "planta")
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "assets", "prototipo", "planta.html")
ROTULOS = [("login-badge", "01 · Login by badge and PIN"), ("login-sso", "02 · Login with SSO"), ("home", "03 · Home"),
           ("widgets", "04 · Widget variations"), ("flow", "05 · Turn off AI flow"), ("circuits", "06 · Circuits"),
           ("parameters", "07 · Parameters"), ("history", "08 · History"), ("reports", "09 · Reports")]

def ler(n): return open(os.path.join(AQUI, n), encoding="utf-8").read()

def main():
    tpl = ler("template.html")
    temas = json.dumps(json.loads(ler("themes.json")), ensure_ascii=False).replace("</", "<\\/")
    opts = "".join('<option value="%s">%s</option>' % (v, html.escape(t)) for v, t in ROTULOS)
    doc = (tpl.replace("/*CSS*/", ler("planta.css")).replace("/*OPTS*/", opts)
              .replace("/*THEMES*/", temas).replace("/*JS*/", ler("planta.js")))
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    with open(SAIDA, "w", encoding="utf-8", newline="\n") as f: f.write(doc)
    print("OK:", os.path.relpath(SAIDA, RAIZ), "%d KB" % (len(doc) // 1024))

if __name__ == "__main__": main()
