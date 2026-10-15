# -*- coding: utf-8 -*-
"""Monta assets/prototipo/torre.html a partir de build/torre/ (shell.html, torre.css, torre.js).
Uso: python build/torre.py"""
import os
AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
P = os.path.join(AQUI, "torre")
def ler(n): return open(os.path.join(P, n), encoding="utf-8").read()
doc = ler("shell.html").replace("/*CSS*/", ler("torre.css")).replace("/*JS*/", ler("torre.js"))
saida = os.path.join(RAIZ, "assets", "prototipo", "torre.html")
os.makedirs(os.path.dirname(saida), exist_ok=True)
open(saida, "w", encoding="utf-8", newline="\n").write(doc)
print("OK: assets/prototipo/torre.html %d KB" % (len(doc) // 1024))
