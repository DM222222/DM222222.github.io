# -*- coding: utf-8 -*-
"""Gera tudo a partir de dados/perfil.json.

    python build/build.py

Saida:
    assets/cv/CV_Danilo_Morelli_<variante>.docx   <- para subir em vaga (Gupy etc.)
    assets/cv/CV_Danilo_Morelli_<variante>.pdf    <- quando so aceita PDF
    assets/cv/CV_Danilo_Morelli.pdf               <- o link do portfolio
    assets/cv/Resume_Danilo_Morelli.pdf           <- uma pagina, para humano
    index.html                                     <- secoes sincronizadas
"""
import os
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import comum
import cv_ats
import portfolio
import resume

PADRAO = "design"  # variante usada no CV que o portfolio linka


def main():
    d = comum.carregar()
    print("Perfil lido: %s — %d experiencias, %d variantes"
          % (d["pessoal"]["nome"], len(d["experiencia"]), len(d["variantes"])))

    print("\nCV para ATS")
    for caminho in cv_ats.gerar_todos(d):
        print("  " + os.path.relpath(caminho, comum.RAIZ))


    print("\nResume de uma pagina")
    print("  " + os.path.relpath(resume.gerar(d, PADRAO), comum.RAIZ))

    priv_path = os.path.join(comum.RAIZ, "dados", "privado.json")
    if os.path.exists(priv_path):
        import copy, json
        dp = copy.deepcopy(d)
        dp["pessoal"].update({k: v for k, v in json.load(open(priv_path, encoding="utf-8")).items() if not k.startswith("_")})
        pasta = os.path.join(comum.RAIZ, "privado")
        os.makedirs(pasta, exist_ok=True)
        print("\nVersao PRIVADA, com telefone (nao vai para o GitHub)")
        for nome, fn in (("CV_Danilo_Morelli.docx", lambda c: cv_ats.gerar_docx(dp, PADRAO, c)),
                         ("CV_Danilo_Morelli.pdf", lambda c: cv_ats.gerar_pdf(dp, PADRAO, c)),
                         ("Resume_Danilo_Morelli.pdf", lambda c: resume.gerar(dp, PADRAO, c))):
            print("  privado/" + os.path.basename(fn(os.path.join(pasta, nome))))

    print("\nPortfolio")
    print("  index.html sincronizado" if portfolio.sincronizar(d)
          else "  index.html ja estava em dia")

    print("\nPronto. Agora e so commitar no GitHub Desktop.")


if __name__ == "__main__":
    main()
