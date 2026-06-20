# Site Speedfaz

Site institucional da **Speedfaz** — reparações residenciais e comerciais na margem sul
(Setúbal e Tróia). Site estático (HTML + CSS + JavaScript), pronto a publicar.

## 📁 Estrutura do repositório

```
.
├── speedfaz-static/      → O SITE (é isto que se publica)
│   ├── index.html, servicos.html, sobre.html, blog.html,
│   │   contacto.html, visita.html, cart.html
│   ├── blog/             → páginas dos artigos (geradas)
│   ├── sitemap.xml, robots.txt
│   ├── assets/ (css, js, img, fonts)
│   └── LEIA-ME.md        → instruções detalhadas de edição e instalação
├── _build-seo.js         → gerador das páginas do blog + sitemap (manutenção)
├── speedfaz-site.html    → ficheiro original (SPA) de onde tudo foi extraído
└── README.md
```

## 🚀 Publicar (Hostinger)

Enviar **o conteúdo de `speedfaz-static/`** para a pasta pública do alojamento
(`public_html/`) via Gestor de Ficheiros ou FTP. Detalhes em
[`speedfaz-static/LEIA-ME.md`](speedfaz-static/LEIA-ME.md).

## ✏️ Editar conteúdos

Quase tudo se edita num só sítio: a **ÁREA EDITÁVEL** no topo de
[`speedfaz-static/assets/js/main.js`](speedfaz-static/assets/js/main.js)
(serviços, preços, contactos, depoimentos, artigos do blog, menu).

Depois de editar os **artigos do blog** (`BLOG`), regenerar as páginas e o sitemap:

```bash
node _build-seo.js
```

> Antes de publicar no domínio final, confirmar `SITE.baseUrl` em `main.js`
> (atualmente `https://www.speedfaz.com`).

## 🧪 Pré-visualizar localmente

```bash
cd speedfaz-static
python -m http.server 8080
# abrir http://127.0.0.1:8080/index.html
```
