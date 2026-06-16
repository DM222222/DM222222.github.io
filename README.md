# Portfólio — Danilo Morelli

Site estático em HTML/CSS puro. Sem build, sem dependências.

## Publicar no GitHub Pages (3 passos)

1. **Criar o repositório**
   - Acesse https://github.com/new
   - Nome do repositório: **`DM222222.github.io`** (exatamente igual ao seu usuário + `.github.io`)
   - Visibilidade: **Public**
   - Clique em **Create repository**

2. **Subir os arquivos**
   - No repositório recém-criado, clique em **uploading an existing file** (link azul no centro da tela)
   - Arraste TODOS os arquivos desta pasta (`index.html` + a pasta `assets/`) para a área de upload
   - Role até o fim e clique em **Commit changes**

3. **Ativar o GitHub Pages**
   - Vá em **Settings** → **Pages** (menu lateral esquerdo)
   - Em "Source", selecione **Deploy from a branch**
   - Branch: **main** · Pasta: **/ (root)** → **Save**
   - Aguarde 1-2 minutos

✅ Seu site estará no ar em: **https://dm222222.github.io/**

---

## Alternativa via Git (linha de comando)

```bash
git clone https://github.com/DM222222/DM222222.github.io.git
cd DM222222.github.io
# copie todos os arquivos desta pasta para dentro
git add .
git commit -m "Publicar portfólio"
git push origin main
```

---

## Estrutura

```
.
├── index.html              # site completo (HTML + CSS inline)
└── assets/
    ├── logo-dm.svg         # logo (também usado como favicon)
    ├── profile.jpg         # foto de perfil
    ├── cv/
    │   └── CV_Danilo_Morelli.pdf
    └── projects/           # imagens dos cases
```

## Atualizar conteúdo

Tudo está em `index.html`. Para mudar textos, basta editar e fazer novo commit/upload — o GitHub Pages atualiza sozinho em 1-2 minutos.
