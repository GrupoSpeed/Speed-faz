/* ============================================================
   Gerador de SEO técnico do site Speedfaz.
   - Cria páginas de artigo estáticas em /blog/<slug>.html
   - Injeta canonical + Open Graph + Twitter + JSON-LD nas páginas
   - Gera sitemap.xml e robots.txt
   - Corrige os links da listagem do blog
   Correr a partir da pasta "Site Speed Faz":  node _build-seo.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'speedfaz-static');
const main = fs.readFileSync(path.join(ROOT, 'assets/js/main.js'), 'utf8');

/* ---- extrair SITE e BLOG de main.js ---- */
const sStr = main.slice(main.indexOf('var SITE ='), main.indexOf('};', main.indexOf('var SITE =')) + 1);
const SITE = eval('(' + sStr.replace(/^var SITE =\s*/, '') + ')');
const bStr = main.slice(main.indexOf('var BLOG ='), main.indexOf('/* Menu de navegação'));
const BLOG = eval('(' + bStr.replace(/^var BLOG =\s*/, '').replace(/;\s*$/, '') + ')');

const BASEURL = SITE.baseUrl.replace(/\/$/, '');
const TODAY = '2026-06-20';
const WA = 'https://wa.me/' + SITE.whatsapp;
const WA_ORC = WA + '?text=' + encodeURIComponent('Olá! Gostava de pedir um orçamento.');
const WA_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.36-.5.05-1.13.07-1.83-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.39-.15-.2-1.19-1.58-1.19-3.01s.75-2.13 1.02-2.43c.27-.29.59-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.59.82 2.02.89 2.17.07.15.12.32.02.51-.09.2-.14.32-.27.49-.14.17-.29.38-.41.51-.14.15-.28.31-.12.59.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.27.15.43.12.59-.07.16-.2.68-.79.86-1.06.18-.27.36-.22.59-.13.24.09 1.52.72 1.78.85.27.13.44.2.51.31.07.12.07.68-.17 1.34Z"></path></svg>';

const MONTHS = { Jan: '01', Fev: '02', Mar: '03', Abr: '04', Mai: '05', Jun: '06', Jul: '07', Ago: '08', Set: '09', Out: '10', Nov: '11', Dez: '12' };
function dateISO(s) { const m = s.split(' '); return m[2] + '-' + (MONTHS[m[1]] || '01') + '-' + (m[0].length < 2 ? '0' + m[0] : m[0]); }
function escAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function stripTags(s) { return String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); }
function makeDesc(post) {
  const firstText = post.body.find(b => !/^\s*</.test(b)) || '';
  let d = stripTags(firstText);
  if (d.length > 155) d = d.slice(0, 152).replace(/\s+\S*$/, '') + '…';
  return d;
}

/* ---- 1) páginas de artigo estáticas em /blog/<slug>.html ---- */
const blogDir = path.join(ROOT, 'blog');
fs.mkdirSync(blogDir, { recursive: true });

const slugs = Object.keys(BLOG);
slugs.forEach(slug => {
  const p = BLOG[slug];
  const canon = BASEURL + '/blog/' + slug + '.html';
  const desc = makeDesc(p);
  const titleFull = p.title + (p.subtitle ? ' — ' + p.subtitle : '') + ' | Speedfaz';
  const iso = dateISO(p.date);
  const isAbs = /^https?:/.test(p.img);
  const imgAbs = isAbs ? p.img : BASEURL + '/' + p.img;   // para canonical/OG/JSON-LD (URL absoluto)
  const imgSrc = isAbs ? p.img : '../' + p.img;           // para a tag <img> (a página está em /blog/)
  const bodyHtml = p.body.map(b => /^\s*</.test(b) ? b : '<p style="font-size:17px;color:#3d3c39;margin:0 0 18px">' + b + '</p>').join('');

  const jsonld = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: p.title + (p.subtitle ? ' — ' + p.subtitle : ''),
    description: desc, image: imgAbs,
    datePublished: iso, dateModified: iso, inLanguage: 'pt-PT',
    articleSection: p.tag,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canon },
    author: { '@type': 'Organization', name: 'Speedfaz', url: BASEURL + '/' },
    publisher: { '@type': 'Organization', name: 'Speedfaz', logo: { '@type': 'ImageObject', url: BASEURL + '/assets/img/logo.png' } }
  };

  const html =
`<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escAttr(titleFull)}</title>
<meta name="description" content="${escAttr(desc)}">
<link rel="canonical" href="${canon}">
<meta property="og:type" content="article">
<meta property="og:title" content="${escAttr(p.title + (p.subtitle ? ' — ' + p.subtitle : ''))}">
<meta property="og:description" content="${escAttr(desc)}">
<meta property="og:image" content="${escAttr(imgAbs)}">
<meta property="og:url" content="${canon}">
<meta property="og:site_name" content="Speedfaz">
<meta property="og:locale" content="pt_PT">
<meta property="article:published_time" content="${iso}">
<meta property="article:section" content="${escAttr(p.tag)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(p.title)}">
<meta name="twitter:description" content="${escAttr(desc)}">
<meta name="twitter:image" content="${escAttr(imgAbs)}">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="stylesheet" href="../assets/css/style.css">
</head>
<body data-page="blog" data-base="../">

<div id="sf-header"></div>

<main>
  <article style="max-width:820px;margin:0 auto;padding:clamp(28px,4vw,44px) 24px clamp(48px,6vw,80px)">
    <a href="../blog.html" style="display:inline-flex;align-items:center;gap:7px;color:#727271;font-weight:600;font-size:15px;margin-bottom:22px;text-decoration:none">← Voltar ao blog</a>
    <div class="sf-eyebrow" style="margin-bottom:12px">${escAttr(p.tag)} · ${escAttr(p.date)}</div>
    <h1 style="font-weight:800;font-size:clamp(30px,4.5vw,46px);line-height:1.1;letter-spacing:-.5px;margin:0 0 12px">${p.title}</h1>
    ${p.subtitle ? `<p style="font-size:clamp(17px,2.2vw,22px);color:#727271;font-weight:600;line-height:1.3;margin:0 0 24px">${p.subtitle}</p>` : ''}
    <img src="${escAttr(imgSrc)}" alt="${escAttr(p.title)}" style="width:100%;height:clamp(220px,34vw,400px);object-fit:cover;border-radius:18px;box-shadow:0 18px 40px rgba(28,27,23,.14);margin-bottom:30px">
    <div>${bodyHtml}</div>
    <div style="margin-top:34px;display:flex;flex-wrap:wrap;gap:14px;align-items:center;background:#f5f4f2;border:1px solid #ecebe8;border-radius:18px;padding:24px 26px">
      <div style="flex:1;min-width:220px"><div style="font-weight:800;font-size:18px;margin-bottom:4px">Precisas de ajuda com isto?</div><p style="margin:0;color:#5c5b58;font-size:15px">Fala connosco e resolvemos rápido, sem complicações.</p></div>
      <a href="${WA_ORC}" target="_blank" rel="noopener" class="sf-btn sf-btn-primary lg">${WA_SVG} Pedir orçamento</a>
    </div>
  </article>
</main>

<div id="sf-footer"></div>

<script src="../assets/js/main.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(blogDir, slug + '.html'), html, 'utf8');
});
console.log('Artigos gerados em /blog/:', slugs.length);

/* ---- 2) injetar canonical + OG + Twitter nas páginas principais ---- */
const mainPages = {
  'index.html': '/', 'servicos.html': '/servicos.html', 'sobre.html': '/sobre.html',
  'blog.html': '/blog.html', 'contacto.html': '/contacto.html', 'visita.html': '/visita.html'
};
const ogImg = { 'sobre.html': '/assets/img/sobre.jpg', 'servicos.html': '/assets/img/portas.jpg' };

Object.keys(mainPages).forEach(file => {
  const fp = path.join(ROOT, file);
  let h = fs.readFileSync(fp, 'utf8');
  if (h.indexOf('og:title') !== -1) { h = h.replace(/\s*<link rel="canonical"[\s\S]*?<!-- \/seo -->\n?/, ''); } // re-gerar
  const title = (h.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1];
  const desc = (h.match(/<meta name="description" content="([\s\S]*?)">/) || [, ''])[1];
  const canon = BASEURL + mainPages[file];
  const img = BASEURL + (ogImg[file] || '/assets/img/hero.jpg');
  const block =
`<link rel="canonical" href="${canon}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escAttr(title)}">
<meta property="og:description" content="${escAttr(desc)}">
<meta property="og:image" content="${img}">
<meta property="og:url" content="${canon}">
<meta property="og:site_name" content="Speedfaz">
<meta property="og:locale" content="pt_PT">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(title)}">
<meta name="twitter:description" content="${escAttr(desc)}">
<meta name="twitter:image" content="${img}">`;
  let inject = block;
  /* LocalBusiness só na página inicial */
  if (file === 'index.html') {
    const lb = {
      '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness',
      name: 'Speedfaz', image: BASEURL + '/assets/img/hero.jpg', url: BASEURL + '/',
      telephone: SITE.phones[0].tel, email: SITE.email,
      address: { '@type': 'PostalAddress', streetAddress: 'Rua dos Pinheirinhos, 15, loja j', postalCode: '2910-121', addressLocality: 'Setúbal', addressCountry: 'PT' },
      areaServed: 'Margem Sul (Setúbal e Tróia)',
      sameAs: ['https://instagram.com/' + SITE.instagram]
    };
    inject += '\n<script type="application/ld+json">' + JSON.stringify(lb) + '</script>';
  }
  inject = inject + '\n<!-- /seo -->';
  h = h.replace('</head>', inject + '\n</head>');
  fs.writeFileSync(fp, h, 'utf8');
});
console.log('Meta SEO injetada em', Object.keys(mainPages).length, 'páginas principais.');

/* ---- 3) corrigir links da listagem do blog (artigo.html?post=x -> blog/x.html) ---- */
{
  const fp = path.join(ROOT, 'blog.html');
  let h = fs.readFileSync(fp, 'utf8');
  const n = (h.match(/artigo\.html\?post=/g) || []).length;
  h = h.replace(/artigo\.html\?post=([a-z-]+)/g, 'blog/$1.html');
  fs.writeFileSync(fp, h, 'utf8');
  console.log('Links da listagem do blog corrigidos:', n);
}

/* ---- 4) sitemap.xml + robots.txt ---- */
const urls = ['/', '/servicos.html', '/sobre.html', '/blog.html', '/contacto.html', '/visita.html']
  .concat(slugs.map(s => '/blog/' + s + '.html'));
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => `  <url><loc>${BASEURL}${u}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n') +
  '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');

const robots = 'User-agent: *\nAllow: /\nDisallow: /cart.html\n\nSitemap: ' + BASEURL + '/sitemap.xml\n';
fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots, 'utf8');
console.log('sitemap.xml (' + urls.length + ' URLs) e robots.txt gerados.');

console.log('\n✅ SEO técnico concluído.');
