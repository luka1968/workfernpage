/**
 * Workfern Multilingual SEO Static Site Builder
 * ================================================
 * Reads: data/keywords.json, data/pages.json, data/i18n.json
 * Uses:  EJS template engine
 * Out:   output/{lang}/{slug}.html (supports 1000+ pages)
 *
 * Usage: node build.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const ejs  = require('ejs');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const SITE_URL    = 'https://www.workfern.com';
const CHROME_URL  = 'https://chromewebstore.google.com/detail/local-business-lead-extra/pnccfoihojohldpenobnanlfcpkmiapa';
const LANGS       = ['en', 'es', 'de', 'fr', 'ja'];
const OUTPUT_DIR  = path.resolve(__dirname, 'output');
const TMPL_FILE   = path.resolve(__dirname, 'templates', 'page.ejs');
const DATA_DIR    = path.resolve(__dirname, 'data');

// ── HELPERS ───────────────────────────────────────────────────────────────────
function readJSON(file) {
  let raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1); // strip BOM
  return JSON.parse(raw);
}

function toSlug(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ensure(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function titleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function buildTitle(keyword, lang) {
  const prefixes = {
    en: 'Best', es: 'Mejor', de: 'Bester', fr: 'Meilleur', ja: '最高の'
  };
  const suffixes = {
    en: '| Free, No Login', es: '| Gratis, Sin Registro',
    de: '| Kostenlos', fr: '| Gratuit', ja: '| 無料'
  };
  const kw = titleCase(keyword);
  const t  = `${prefixes[lang] || 'Best'} ${kw} ${suffixes[lang] || '| Free'}`;
  return t.length > 60 ? t.substring(0, 57) + '...' : t;
}

function buildMeta(keyword, platform, data_type, lang) {
  const templates = {
    en: `Extract ${data_type} from ${platform} instantly. Workfern is the #1 free AI ${keyword} — no login, no limits. Download clean CSV in 30 seconds.`,
    es: `Extrae ${data_type} de ${platform} al instante. Workfern es el mejor ${keyword} gratuito — sin registro, sin límites. Descarga CSV limpio en 30 segundos.`,
    de: `Extrahieren Sie ${data_type} aus ${platform} sofort. Workfern ist der beste kostenlose ${keyword} — ohne Anmeldung. Saubere CSV in 30 Sekunden.`,
    fr: `Extrayez des ${data_type} depuis ${platform} instantanément. Workfern est le meilleur ${keyword} gratuit — sans inscription. CSV propre en 30 secondes.`,
    ja: `${platform}から${data_type}を即座に抽出。WorkfernはNo.1の無料${keyword}です — ログイン不要、制限なし。30秒でクリーンなCSVをダウンロード。`
  };
  const m = templates[lang] || templates.en;
  return m.length > 155 ? m.substring(0, 152) + '...' : m;
}

function buildH1(keyword, lang) {
  const map = {
    en: `${titleCase(keyword)}`,
    es: `${titleCase(keyword)}`,
    de: `${titleCase(keyword)}`,
    fr: `${titleCase(keyword)}`,
    ja: `${keyword}`
  };
  return map[lang] || titleCase(keyword);
}

// OG Locale map (ISO 639-1 → ISO locale for OG)
const OG_LOCALE = {
  en: 'en_US', es: 'es_ES', de: 'de_DE', fr: 'fr_FR', ja: 'ja_JP'
};

// Build canonical URL: /en/slug or /es/slug etc.
function buildCanonicalUrl(lang, slug) {
  return `${SITE_URL}/${lang}/${slug}`;
}

/**
 * Builds ALL hreflang <link> tags for a given page.
 * Includes:
 *   - One tag per language (en, es, de, fr, ja)
 *   - x-default pointing to English version
 * Per Google spec: every language version must list ALL alternatives.
 */
function buildHreflangTags(slug, langSlugs) {
  const lines = [];

  // One tag per supported language
  for (const l of LANGS) {
    const s   = langSlugs[l] || slug;
    const url = buildCanonicalUrl(l, s);
    const htmlLang = l === 'en' ? 'en'   // keep simple for now
                   : l === 'es' ? 'es'
                   : l === 'de' ? 'de'
                   : l === 'fr' ? 'fr'
                   : 'ja';
    lines.push(`  <link rel="alternate" hreflang="${htmlLang}" href="${url}" />`);
  }

  // x-default always points to English
  const defaultUrl = buildCanonicalUrl('en', langSlugs['en'] || slug);
  lines.push(`  <link rel="alternate" hreflang="x-default" href="${defaultUrl}" />`);

  return lines.join('\n');
}

// ── MAIN BUILD ────────────────────────────────────────────────────────────────
console.log('\n🌍 Workfern SEO Builder — Multilingual Static Site Generator');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 1. Load data
const keywords  = readJSON('keywords.json');
const pagesData = readJSON('pages.json');
const i18n      = readJSON('i18n.json');
const template  = fs.readFileSync(TMPL_FILE, 'utf-8');

// 2. Merge keywords + pages (pages.json overrides keyword defaults)
const pagesMap = {};
for (const p of pagesData) pagesMap[p.slug] = p;

// Build master page list from keywords
const masterPages = keywords.map(kw => {
  const slug = toSlug(kw.keyword);
  const override = pagesMap[slug] || {};
  return {
    slug,
    keyword:   kw.keyword,
    platform:  kw.platform  || 'any',
    data_type: kw.data_type || 'data',
    page_type: kw.category  || 'landing',
    ...override
  };
});

// 3. Create output dirs
ensure(OUTPUT_DIR);
LANGS.forEach(l => ensure(path.join(OUTPUT_DIR, l)));

// 4. Generate pages
let totalCount = 0;
const sitemapUrls = [];

for (const page of masterPages) {
  // Compute slug variants per lang (all same for now; extend for localized slugs)
  const allLangSlugs = {};
  LANGS.forEach(l => { allLangSlugs[l] = page.slug; });

  for (const lang of LANGS) {
    const t             = i18n[lang];
    if (!t) { console.warn(`⚠️  No i18n for lang: ${lang}`); continue; }

    // All lang slug variants for this page (same slug across langs here;
    // extend langSlugs per-lang if you add localized slugs in pages.json)
    const langSlugs = {};
    LANGS.forEach(l => { langSlugs[l] = page.slug; });

    const canonicalUrl    = buildCanonicalUrl(lang, page.slug);
    const hreflangTags    = buildHreflangTags(page.slug, langSlugs);
    const hreflangCount   = LANGS.length + 1; // +1 for x-default
    const ogLocale        = OG_LOCALE[lang] || 'en_US';
    const title           = buildTitle(page.keyword, lang);
    const metaDescription = buildMeta(page.keyword, page.platform, page.data_type, lang);
    const h1              = buildH1(page.keyword, lang);

    const html = ejs.render(template, {
      // Page data
      lang, slug: page.slug, title, metaDescription, h1,
      canonicalUrl, hreflangTags, hreflangCount, ogLocale,
      keyword: page.keyword, platform: page.platform, data_type: page.data_type,
      page_type: page.page_type,
      // i18n
      t,
      // URLs
      SITE_URL, CHROME_URL
    });

    const outPath = path.join(OUTPUT_DIR, lang, `${page.slug}.html`);
    fs.writeFileSync(outPath, html, 'utf-8');
    sitemapUrls.push({
      url:  canonicalUrl,
      lang: t.htmlLang,
      alternates: LANGS.map(l => ({
        hreflang: l,
        href: buildCanonicalUrl(l, langSlugs[l] || page.slug)
      }))
    });
    totalCount++;
  }

  // Progress log every 50 pages
  if (totalCount % (LANGS.length * 10) === 0) {
    console.log(`  ✅ ${totalCount} pages generated...`);
  }
}

// 5. Generate sitemap.xml
const urlTags = sitemapUrls.map(({ url, lang, alternates }) => {
  const altTags = (alternates || []).map(a =>
    `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`
  ).join('\n');
  // x-default always points to the en version
  const enAlt = (alternates || []).find(a => a.hreflang === 'en');
  const xDefault = enAlt
    ? `    <xhtml:link rel="alternate" hreflang="x-default" href="${enAlt.href}"/>` : '';
  return `
  <url>
    <loc>${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
${altTags}
${xDefault}
  </url>`;
}).join('');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>${urlTags}
</urlset>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap, 'utf-8');

// 6. Generate index.html redirect page per lang
const indexHtml = lang => `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<title>Workfern — ${lang.toUpperCase()} Pages</title>
</head><body>
<h1>Workfern ${lang.toUpperCase()} SEO Pages</h1>
<ul>
${masterPages.map(p => `  <li><a href="${p.slug}.html">${p.keyword}</a></li>`).join('\n')}
</ul></body></html>`;

LANGS.forEach(l => {
  fs.writeFileSync(path.join(OUTPUT_DIR, l, 'index.html'), indexHtml(l), 'utf-8');
});

// 7. Summary
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`🎉 Build complete!`);
console.log(`   📄 Pages generated : ${totalCount}`);
console.log(`   🌍 Languages        : ${LANGS.join(', ')}`);
console.log(`   📁 Output folder   : ${OUTPUT_DIR}`);
console.log(`   🗺️  Sitemap          : ${path.join(OUTPUT_DIR, 'sitemap.xml')}`);
console.log(`   📊 Pages per lang  : ${masterPages.length}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
