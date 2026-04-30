/**
 * Workfern Multilingual Programmatic SEO Page Generator
 * Reads localized_seo_all.json and generates one HTML page per keyword per language.
 * Output: /pages/{lang}/{slug}.html
 * Usage: node generate_multilingual_pages.js
 */

const fs   = require('fs');
const path = require('path');

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const LOCALIZED_JSON = path.resolve(__dirname, 'localized_seo_all.json');
const TEMPLATE_FILE  = path.resolve(__dirname, 'template.html');
const OUTPUT_DIR     = path.resolve(__dirname, 'pages');
const SITE_URL       = 'https://www.workfern.com';
// ────────────────────────────────────────────────────────────────────────────────

// Language → HTML lang attribute + hreflang tag
const LANG_META = {
  en: { htmlLang: 'en', label: 'English' },
  es: { htmlLang: 'es', label: 'Español' },
  de: { htmlLang: 'de', label: 'Deutsch' },
  fr: { htmlLang: 'fr', label: 'Français' },
  ja: { htmlLang: 'ja', label: '日本語' },
};

// Pain points per language (used to enrich hero section)
const PAIN_POINTS = {
  en: {
    'not working': 'Frustrated that your current scraper keeps failing, freezing, or getting blocked?',
    'blocked':     'Getting blocked every time you try to extract data from your target site?',
    'alternative': 'Looking for a better, faster, and completely free alternative?',
    'leads':       'Struggling to build accurate lead lists without expensive databases?',
    'google maps': 'Trying to extract local business data from Google Maps without getting blocked?',
    'linkedin':    'Need to pull professional contact data efficiently at scale?',
    'default':     'Tired of scrapers that freeze, limit your exports, and demand your credit card?'
  },
  es: {
    'not working': '¿Tu scraper actual sigue fallando, congelándose o siendo bloqueado?',
    'alternative': '¿Buscas una alternativa mejor, más rápida y completamente gratuita?',
    'leads':       '¿Luchando por crear listas de leads sin bases de datos costosas?',
    'google maps': '¿Intentas extraer datos de Google Maps sin ser bloqueado?',
    'default':     '¿Cansado de scrapers que congelan, limitan y piden tu tarjeta de crédito?'
  },
  de: {
    'not working': 'Frustiert, dass Ihr aktueller Scraper ständig versagt oder blockiert wird?',
    'alternative': 'Suchen Sie eine bessere, schnellere und kostenlose Alternative?',
    'leads':       'Mühe beim Aufbau von Lead-Listen ohne teure Datenbanken?',
    'google maps': 'Versuchen Sie, Google Maps-Daten zu extrahieren ohne blockiert zu werden?',
    'default':     'Müde von Scrapern, die einfrieren, Limits setzen und Kreditkartendaten fordern?'
  },
  fr: {
    'not working': 'Frustré parce que votre scraper plante, se fige ou se fait bloquer ?',
    'alternative': 'Vous cherchez une alternative meilleure, plus rapide et gratuite ?',
    'leads':       'Du mal à constituer des listes de leads sans bases de données coûteuses ?',
    'google maps': 'Vous essayez d\'extraire des données Google Maps sans être bloqué ?',
    'default':     'Marre des scrapers qui plantent, limitent les exports et demandent votre CB ?'
  },
  ja: {
    'not working': '現在のスクレイパーが動かない、フリーズする、ブロックされる問題に悩んでいますか？',
    'alternative': 'より優れた、高速で完全無料の代替ツールをお探しですか？',
    'leads':       '高価なデータベースなしで正確な顧客リストを作成するのに苦労していますか？',
    'google maps': 'Googleマップからブロックされずにビジネスデータを抽出したいですか？',
    'default':     'フリーズし、エクスポートを制限し、クレジットカードを要求するスクレイパーにうんざりしていますか？'
  }
};

// Solution text per language
const SOLUTIONS = {
  en: 'Workfern runs 100% inside your Chrome browser — no servers, no login, no limits. Install from the Chrome Web Store and start extracting data to CSV in 30 seconds.',
  es: 'Workfern se ejecuta 100% dentro de tu navegador Chrome — sin servidores, sin registro, sin límites. Instala desde Chrome Web Store y empieza a exportar datos a CSV en 30 segundos.',
  de: 'Workfern läuft zu 100% in Ihrem Chrome-Browser — keine Server, kein Login, keine Limits. Installieren Sie es aus dem Chrome Web Store und exportieren Sie in 30 Sekunden Daten als CSV.',
  fr: 'Workfern fonctionne 100% dans votre navigateur Chrome — sans serveur, sans login, sans limite. Installez depuis le Chrome Web Store et commencez à extraire des données en CSV en 30 secondes.',
  ja: 'WorkfernはあなたのChromeブラウザ内で100%動作します。サーバー不要、ログイン不要、制限なし。Chrome Web Storeからインストールして30秒でCSVにデータ出力を開始できます。'
};

// CTA button text per language
const CTA_TEXT = {
  en: 'Add to Chrome — It\'s Free',
  es: 'Añadir a Chrome — Es Gratis',
  de: 'Zu Chrome hinzufügen — Kostenlos',
  fr: 'Ajouter à Chrome — C\'est Gratuit',
  ja: 'Chromeに追加 — 無料'
};

function getPainPoint(keyword, lang) {
  const map = PAIN_POINTS[lang] || PAIN_POINTS['en'];
  const lower = keyword.toLowerCase();
  for (const [trigger, text] of Object.entries(map)) {
    if (lower.includes(trigger)) return text;
  }
  return map['default'];
}

function toSlug(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateHreflangTags(allLangData, currentSlug, currentLang) {
  // Build hreflang links for this page across all languages
  const tags = [];
  for (const lang of Object.keys(LANG_META)) {
    const pages = allLangData[lang] || [];
    // Find matching page by index (same order across languages)
    const currentIndex = (allLangData[currentLang] || []).findIndex(p => p.slug === currentSlug);
    if (currentIndex >= 0 && pages[currentIndex]) {
      const slug = pages[currentIndex].slug;
      const prefix = lang === 'en' ? '' : `/${lang}`;
      tags.push(`<link rel="alternate" hreflang="${lang}" href="${SITE_URL}/pages${prefix}/${slug}.html">`);
    }
  }
  return tags.join('\n    ');
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────
console.log('🌍 Workfern Multilingual SEO Page Generator');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (!fs.existsSync(LOCALIZED_JSON)) {
  console.error(`❌ Localized JSON not found: ${LOCALIZED_JSON}`);
  process.exit(1);
}
if (!fs.existsSync(TEMPLATE_FILE)) {
  console.error(`❌ Template not found: ${TEMPLATE_FILE}`);
  process.exit(1);
}

// Read files
let rawJson = fs.readFileSync(LOCALIZED_JSON, 'utf-8');
if (rawJson.charCodeAt(0) === 0xFEFF) rawJson = rawJson.slice(1);
const allLangData = JSON.parse(rawJson);

const template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

const allSlugsForSitemap = [];
let totalCount = 0;

// Process each language
for (const lang of Object.keys(LANG_META)) {
  const pages = allLangData[lang];
  if (!pages || pages.length === 0) {
    console.log(`⚠️  No data for language: ${lang}, skipping.`);
    continue;
  }

  // Output dir: /pages/ for English, /pages/{lang}/ for others
  const langOutputDir = lang === 'en'
    ? OUTPUT_DIR
    : path.join(OUTPUT_DIR, lang);

  if (!fs.existsSync(langOutputDir)) {
    fs.mkdirSync(langOutputDir, { recursive: true });
  }

  console.log(`\n📁 Generating ${lang.toUpperCase()} pages (${pages.length} pages)...`);
  let langCount = 0;

  for (const page of pages) {
    const { keyword, slug, title, meta_description, h1, page_type } = page;
    const safeSlug = slug || toSlug(keyword);
    const htmlLang = LANG_META[lang].htmlLang;
    const painPoint = getPainPoint(keyword, lang);
    const solution  = SOLUTIONS[lang];
    const ctaText   = CTA_TEXT[lang];
    const hreflangTags = generateHreflangTags(allLangData, safeSlug, lang);

    // Build the page from template
    let pageHtml = template
      .replace(/lang="en"/g, `lang="${htmlLang}"`)
      .replace(/\{\{META_TITLE\}\}/g,       title || `${h1} | Workfern`)
      .replace(/\{\{META_DESCRIPTION\}\}/g, meta_description || '')
      .replace(/\{\{SLUG\}\}/g,             `${safeSlug}.html`)
      .replace(/\{\{KEYWORD\}\}/g,          keyword)
      .replace(/\{\{KEYWORD_CAPITALIZED\}\}/g, h1 || keyword)
      .replace(/\{\{H1_TITLE\}\}/g,         h1 || keyword)
      .replace(/\{\{HERO_PAIN_POINT\}\}/g,  painPoint)
      .replace(/\{\{H2_PAIN_HEADING\}\}/g,  h1 || keyword)
      .replace(/\{\{H2_PAIN_BODY\}\}/g,     painPoint)
      .replace(/\{\{H3_SOLUTION_HEADING\}\}/g, `How Workfern Solves It`)
      .replace(/\{\{H3_SOLUTION_BODY\}\}/g, solution)
      .replace(/\{\{BADGE_TEXT\}\}/g,       '🚀 Free Tool')
      .replace(/\{\{TWITTER_TEXT\}\}/g,     encodeURIComponent(h1 || keyword));

    // Inject hreflang tags right before </head>
    if (hreflangTags) {
      pageHtml = pageHtml.replace('</head>', `    ${hreflangTags}\n</head>`);
    }

    const outputPath = path.join(langOutputDir, `${safeSlug}.html`);
    fs.writeFileSync(outputPath, pageHtml, 'utf-8');

    // Track for sitemap
    const urlPath = lang === 'en'
      ? `/pages/${safeSlug}.html`
      : `/pages/${lang}/${safeSlug}.html`;
    allSlugsForSitemap.push({ url: urlPath, lang: htmlLang });

    langCount++;
    totalCount++;
    if (langCount <= 5 || langCount === pages.length) {
      console.log(`  ✅ [${lang}] ${safeSlug}.html`);
    } else if (langCount === 6) {
      console.log(`  ... (${pages.length - 5} more)`);
    }
  }
  console.log(`  📊 ${lang.toUpperCase()}: ${langCount} pages generated.`);
}

// ─── Generate sitemap including all lang pages ─────────────────────────────────
// Read existing sitemap if any (to preserve existing English pages)
const existingSitemapPath = path.join(__dirname, 'sitemap.xml');
let existingUrls = '';
if (fs.existsSync(existingSitemapPath)) {
  const existing = fs.readFileSync(existingSitemapPath, 'utf-8');
  // Extract existing <url> blocks for the root and any pages not in our new set
  const rootMatch = existing.match(/<url>\s*<loc>https:\/\/www\.workfern\.com\/<\/loc>[\s\S]*?<\/url>/);
  if (rootMatch) existingUrls = rootMatch[0];
}

const newUrlTags = allSlugsForSitemap.map(({ url, lang }) => `
  <url>
    <loc>${SITE_URL}${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}${url}"/>
  </url>`).join('');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>${newUrlTags}
</urlset>`;

fs.writeFileSync(existingSitemapPath, sitemap, 'utf-8');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`🎉 Done! Generated ${totalCount} multilingual pages`);
console.log(`📁 English → /pages/`);
console.log(`📁 Spanish → /pages/es/`);
console.log(`📁 German  → /pages/de/`);
console.log(`📁 French  → /pages/fr/`);
console.log(`📁 Japanese→ /pages/ja/`);
console.log(`🗺️  sitemap.xml updated with ${allSlugsForSitemap.length} URLs`);
