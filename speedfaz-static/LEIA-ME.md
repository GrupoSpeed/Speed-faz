# Speedfaz — site estático

Site reestruturado a partir do `speedfaz-site.html` (que era uma Single Page Application
num framework próprio) para **ficheiros HTML separados + CSS e JavaScript partilhados**.

## Estrutura

```
speedfaz-static/
├── index.html        → Página inicial
├── servicos.html     → Serviços (clicar num cartão abre detalhe + adicionar ao carrinho)
├── sobre.html        → Sobre nós
├── blog.html         → Blog (lista de artigos)
├── contacto.html     → Contacto (telefones, morada, email, mapa)
├── visita.html       → Agendar visita (condições)
├── cart.html         → Carrinho (total estimado + pedido via WhatsApp)
├── sitemap.xml       → Mapa do site (para o Google) — GERADO
├── robots.txt        → Instruções para motores de busca — GERADO
├── blog/             → Uma página por artigo (SEO) — GERADO
│   ├── torneira-vazamento.html
│   └── … (8 artigos)
└── assets/
    ├── css/style.css → Estilos partilhados (cores, fontes, componentes, hovers, menu, rodapé)
    ├── js/main.js    → ÁREA EDITÁVEL (dados) + cabeçalho/rodapé/menu + carrinho
    ├── img/          → logo.png, hero.jpg, sobre.jpg, portas.jpg
    └── fonts/        → Gilroy 400–900 (.ttf)
```

> **SEO / páginas geradas:** as páginas em `blog/`, o `sitemap.xml` e o `robots.txt` são
> **gerados automaticamente** a partir dos dados em `assets/js/main.js`. Sempre que
> editares os artigos (`BLOG`), volta a correr o gerador na pasta-mãe "Site Speed Faz":
> `node _build-seo.js`. Isto recria as páginas de artigo com `<title>`, *meta description*,
> Open Graph e dados estruturados (JSON-LD), e atualiza o sitemap.
> (Importante: muda `SITE.baseUrl` em `main.js` se o domínio final não for `https://www.speedfaz.com`.)

## Onde editar conteúdos (importante)

O **cabeçalho e o rodapé são gerados a partir de `assets/js/main.js`** — editas uma vez e
muda em todas as páginas. No topo desse ficheiro há uma zona marcada com
`███ ÁREA EDITÁVEL ███` onde alteras, sem mexer no resto do código:

- **SITE** — WhatsApp, telefones, email, Instagram, morada, zona de atuação
- **CATALOG** — serviços, preços, imagens e descrições
- **PRODUCTS** — produtos relacionados (mostrados no carrinho)
- **SERVICE_BLOG** — liga cada serviço ao seu artigo do blog
- **BLOG** — texto de cada artigo (cada item de `body` é um parágrafo)
- **NAV** — itens do menu e do dropdown

## O que mudou face ao original

- A navegação por estado (SPA) passou a **links reais** entre páginas (`<a href>`).
- O carrinho usa **localStorage** (`speedfaz_cart`), por isso **persiste entre páginas**.
- Os `:hover` que o runtime aplicava por JavaScript são agora **CSS real**.
- O detalhe de cada serviço abre num **modal** (gerado por `main.js`) a partir da
  página de Serviços ou da Home.
- As imagens do catálogo e do blog continuam a usar **links do Unsplash** (como no original).
  O logótipo, a foto do herói e a foto do "Sobre" estão em `assets/img/`.

## Instalar no alojamento da Hostinger

1. No hPanel da Hostinger, abre **Gestor de Ficheiros** (ou liga por FTP).
2. Entra na pasta pública do domínio: normalmente `public_html/`.
3. Carrega **todo o conteúdo** desta pasta `speedfaz-static/` para lá
   (os `.html` e a pasta `assets/`), mantendo a estrutura.
   - Para o site responder em `www.speedfaz.com`, o `index.html` tem de ficar
     diretamente em `public_html/`.
   - Em alternativa, sobe para uma subpasta (ex.: `public_html/novo/`) e testa
     em `www.speedfaz.com/novo/` antes de publicar.

> Nota: se já tens um **WordPress** instalado em `public_html/`, o `index.php` do
> WordPress tem prioridade sobre o `index.html`. Para servir este site estático
> tens de o colocar **numa subpasta** ou **substituir** a instalação WordPress
> nessa pasta (faz cópia de segurança primeiro).

## Personalizar

- **Número de WhatsApp:** está como `351923322717` nos `.html` e no topo de `assets/js/main.js`
  (constante `WHATSAPP_NUMBER`). Altera nos dois sítios se mudar.
- **Serviços / preços / produtos:** edita os arrays `CATALOG` e `PRODUCTS` em `assets/js/main.js`
  (e o texto visível dos cartões em `servicos.html` / `index.html`).
- **Artigos do blog:** edita diretamente os cartões em `blog.html`.
