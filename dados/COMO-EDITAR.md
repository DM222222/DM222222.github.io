# Como editar tudo de uma vez

Existe **um arquivo só** com todo o seu conteúdo: `dados/perfil.json`.

Mudou uma data, um cargo, uma frase? Muda ali. Aí o build regenera o CV, o
Resume e o portfólio juntos — não existe mais "atualizei o currículo mas
esqueci do site".

## O fluxo

1. Abra `dados/perfil.json` e edite.
2. Me peça para rodar o build (ou, se tiver Python instalado: `python build/build.py`).
3. Abra o GitHub Desktop, confira o diff, commit e push.

## O que sai do build

| Arquivo | Para quê |
|---|---|
| `assets/cv/CV_Danilo_Morelli_<variante>.docx` | **Upload em vaga.** É o formato que o robô lê melhor. Prefira sempre este. |
| `assets/cv/CV_Danilo_Morelli_<variante>.pdf` | Quando o formulário só aceita PDF. |
| `assets/cv/CV_Danilo_Morelli.pdf` | Cópia da variante `design`. É o que o botão "Baixar currículo" do site aponta. |
| `assets/cv/Resume_Danilo_Morelli.pdf` | Uma página, diagramado. Para mandar por e-mail e levar impresso na entrevista. **Não suba em formulário de vaga.** |
| `index.html` | Experiência, habilidades, formação e contato, sincronizados. |

## As quatro variantes

O mesmo histórico, com o título e o resumo ajustados para a família de cargo.
Os fatos são os mesmos nas quatro — só muda a ênfase e o vocabulário que o
robô compara com a vaga.

- **design** — Product Designer / UX
- **produto** — Produto / PO / PM
- **ia** — IA / Agentes / Transformação Digital
- **marketing** — Marketing / Branding

Escolha pela vaga. Na dúvida, `design`.

## Editar sem quebrar

O arquivo é JSON. Três regras e você não erra:

- Todo texto fica entre `"aspas duplas"`.
- Itens de uma lista são separados por vírgula — **menos o último**.
- Precisa de aspas dentro do texto? Escreva `\"assim\"`.

Se errar, o build não gera nada errado: ele para e diz a linha do problema.

**Um detalhe:** nos campos que terminam em `_site` (vão direto para o HTML),
escreva `&amp;` em vez de `&`.

## Onde mexer no quê

| Quero mudar | Vá em |
|---|---|
| E-mail, telefone, cidade, links | `pessoal` |
| Título e resumo de uma família de cargo | `variantes` → a variante |
| Palavras-chave que o robô procura | `competencias` |
| Um emprego, as datas, o que fiz lá | `experiencia` |
| Faculdade, certificados, idiomas | `formacao`, `certificacoes`, `idiomas` |
| Os 6 chips de habilidade do site | `site_habilidades` |

Dentro de `experiencia`, os campos `_site` alimentam o portfólio e os
`bullets` alimentam o CV. O **primeiro bullet** de cada cargo é o que aparece
no Resume de uma página — deixe o mais forte em primeiro.

## As regiões sincronizadas do site

No `index.html` existem três trechos entre `<!-- SYNC:x -->` e `<!-- /SYNC:x -->`.
O build reescreve só o que está entre eles e não toca em mais nada — layout,
cases, CSS e JS ficam intactos. **Não edite dentro dos marcadores**: a próxima
build sobrescreve. Edite no `perfil.json`.

## Por que o CV é feio

De propósito. Antes de um humano ver seu currículo, um programa lê o arquivo e
transforma em texto. Coluna dupla, tabela, caixa de texto, ícone, foto e dado
no cabeçalho são justamente o que ele embaralha ou perde — e um telefone que
virou ruído é uma candidatura que não volta.

Então o CV é texto corrido, coluna única, Arial, preto no branco, datas em
MM/AAAA e títulos de seção com os nomes que o robô procura. A beleza fica por
conta do Resume de uma página e do portfólio, que são para olho humano.
