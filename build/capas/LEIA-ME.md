# Capas dos cases

Capas 1600x800 (renderizadas a 1.5x = 2400x1200 e salvas em WebP, qualidade 84) em `assets/projects/capa-*.webp`.

- `capa.css`: palco ameixa + grid + notebook/celular (tokens do design system do portfólio).
- `capa_torre.html`, `capa_planta.html`, `capa_openflow2.html`: composições.
- `src/`: capturas de tela e artefatos usados.
- `grab3.js` / `grab4.js`: recapturam a Torre (precisa servir `assets/prototipo/torre` em localhost:4301).
- `render2.js <nome>`: `NODE_PATH=$(npm root -g) node render2.js torre` gera `out_torre.png`; converter para WebP com PIL.
