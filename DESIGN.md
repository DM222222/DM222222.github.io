# DESIGN.md — dm222222.github.io

> Todo valor abaixo foi extraído direto do CSS em `index.html` (não inventado). Se um valor não estiver aqui, pergunte antes de inventar um novo — e, se for genuinamente necessário, registre no log de decisões no final deste arquivo.

## Cor — tokens nomeados por função, não por matiz

| Token | Hex | Função |
|---|---|---|
| `--bg` | `#F4F1EA` | Fundo primário (off-white quente) |
| `--bg-soft` | `#EBE6DA` | Fundo de painel/figura clara |
| `--bg-deep` | `#1A1426` | Fundo escuro (quase preto, subtom roxo) — usado em `figure.dark` |
| `--paper` | `#FFFFFF` | Fundo de card sobre `--bg` (branco puro) |
| `--ink` | `#1A1426` | Texto primário / headings |
| `--ink-2` | `#3F344D` | Texto secundário / descrições |
| `--muted` | `#7A7186` | Texto terciário / labels / eyebrows |
| `--line` | `#D6CFC0` | Bordas e divisores (tema claro) |
| `--line-dark` | `rgba(245,239,224,.14)` | Bordas sobre fundo escuro |
| `--accent` | `#69458D` | Cor de marca — roxo do logo. Uso: números, links ativos, itálicos, CTAs |
| `--accent-light` | `#9D85B5` | Variante clara do accent |
| `--accent-deep` | `#4A2F66` | Variante escura do accent |
| `--lime` | `#C6DE64` | Segunda cor de marca — chartreuse do logo. Uso: só em contraste alto (sobre `--accent` ou `--bg-deep`) — nunca como cor de texto sobre `--bg` |
| `--lime-deep` / `--lime-soft` | `#A9C247` / `#EDF2D2` | Variantes do lime |

**Regra de uso:** `--accent` é a cor de destaque no dia a dia (números de projeto, links, itálicos). `--lime` é reservado para pontos de altíssimo contraste (seleção de texto, badge "disponível", marquee) — os dois nunca competem na mesma composição.

## Tipografia

| Papel | Fonte | Uso |
|---|---|---|
| Display / UI | `Inter Tight` | Headings (h1–h4), nav, body — peso 600, `letter-spacing:-.035em` |
| Itálico de destaque | `Instrument Serif` (itálico) | Palavras-chave dentro de títulos e leads (`.serif-it`) — sempre em `--accent` |
| Corpo | `Inter Tight` (herdado do `body`) | Texto corrido |

Escala real em uso (via `clamp()`, responsiva):
- Título de case: `.ptitle` — segue o `h1-h4` padrão (peso 600, tracking -.035em)
- Lede/hero: `clamp(1.1rem, 1.6vw, 1.45rem)`
- Descrição de case (`.pdesc`): `clamp(1.05rem, 1.4vw, 1.25rem)`
- Número grande (`.pnum`, `.stat .num`, `.case-stats b`): `clamp(1.8rem–2.8rem, ..., 2.5rem–4.5rem)`, peso 600–700, tracking -.03/-.04em, sempre em `--accent`
- Eyebrow / label (`.eyebrow`, `.pclient`, `.stat .lbl`, `.ptag`): `.72–.78rem`, uppercase, `letter-spacing:.12–.18em`, `--muted`

## Espaçamento e layout

- Largura máxima de conteúdo: `--maxw: 1320px`
- Padding lateral: `--pad: clamp(1.25rem, 4vw, 3rem)`
- Gap padrão entre colunas/figuras: `1.4rem`
- Raio de borda padrão (cards, figuras): `clamp(12px, 2vw, 24px)`
- Raio de pílula (botões, avatar): `99px`

## Padrões de grid por case (capas)

Cada case usa uma composição de imagens diferente — não existe um único "hero padrão":

- **`.p1-row1`** (Torre de Controle): 2 imagens, proporção `1.6fr : 1fr`. Principal `aspect-ratio:16/11`, secundária `aspect-ratio:3/4`.
- **`.p1-grid`**: 2 imagens lado a lado, `aspect-ratio:4/3` cada.
- **`.p2-row1`** (Ler a planta — atualmente não usado, caso volte a compor capa): principal `16/10`, secundária `3/4`.
- **`.p2-row2`**: grade de 3 imagens quadradas (`aspect-ratio:1/1`).
- **`.arte`** (artefatos de processo): 2 imagens `16/10`, com padding interno e borda — trata a imagem como documento, não como hero.

Em telas ≤820px todos os grids de 2+ colunas colapsam para 1 coluna (`grid-template-columns:1fr`).

## Componentes-chave

- **`figure.dark`** — fundo `--bg-deep`, para screenshots de UI escura (dashboards). Usar quando a imagem em si já é dark-mode, não force claro sobre escuro.
- **`figure.contain`** / **`figure.purple`** — fundo `--paper` ou `--accent` com padding interno, para diagramas/boards que precisam de respiro (não ocupam o frame inteiro).
- **`.ptag.solid`** — tag preenchida com `--accent` + texto `--lime` — reservada para a tag "principal" de cada case (ex: "Product Designer"); as demais são outline.
- **`.case-deck`** — viewer de slide deck embutido (usado em "Ler a planta"); é a exceção ao padrão de hero-imagem — o case inteiro é o deck.

## O que NÃO inventar

- Não criar uma nova cor sem checar se `--accent`/`--lime`/`--muted` já resolvem o caso.
- Não usar `--lime` como cor de texto de leitura longa (só para acentos pontuais de alto contraste).
- Não criar um novo padrão de grid de capa sem nomear e documentar aqui (`.p1-row1`, `.p2-row1`, etc. — cada um já tem convenção própria).

## Log de decisões

- **2026-09-03** — Torre de Controle: testada composição de 2 imagens do protótipo real (`.p1-row1`) no lugar da imagem única `torre-tela.jpg`; revertida a pedido do DM para redesenhar depois. `.p1-row1` como classe permanece disponível/documentada mesmo não estando em uso agora.
- **2026-09-03** — "Ler a planta": confirmado que NÃO precisa de imagem de capa — o `.case-deck` (slide deck embutido) já representa bem o case.
