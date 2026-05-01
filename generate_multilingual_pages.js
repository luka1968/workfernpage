/**
 * Workfern Multilingual Programmatic SEO Page Generator
 * Reads localized_seo_all.json and generates one HTML page per keyword per language.
 * Output: /pages/{lang}/{slug}.html
 * Usage: node generate_multilingual_pages.js
 */

const fs   = require('fs');
const path = require('path');
const UI_STRINGS = require('./translations.js');

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const LOCALIZED_JSON = path.resolve(__dirname, 'localized_seo_all.json');
const TEMPLATE_FILE  = path.resolve(__dirname, 'template_scraping.html');
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
  it: { htmlLang: 'it', label: 'Italiano' },
  ar: { htmlLang: 'ar', label: 'العربية', dir: 'rtl' },
  sv: { htmlLang: 'sv', label: 'Svenska' },
  fi: { htmlLang: 'fi', label: 'Suomi' },
  ko: { htmlLang: 'ko', label: '한국어' },
  ru: { htmlLang: 'ru', label: 'Русский' },
  hi: { htmlLang: 'hi', label: 'हिन्दी' },
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
  },
  it: {
    'not working': 'Il tuo attuale scraper continua a bloccarsi o fallire?',
    'alternative': 'Cerchi un\'alternativa migliore, più veloce e gratuita?',
    'leads':       'Fai fatica a creare liste di contatti senza costosi database?',
    'google maps': 'Cerchi di estrarre dati da Google Maps senza essere bloccato?',
    'default':     'Stanco di scraper che si bloccano, limitano le esportazioni e chiedono la carta di credito?'
  },
  ar: {
    'not working': 'هل أداتك الحالية تتعطل أو يتم حظرها باستمرار؟',
    'alternative': 'هل تبحث عن بديل أفضل وأسرع ومجاني بالكامل؟',
    'leads':       'هل تواجه صعوبة في بناء قوائم العملاء بدون قواعد بيانات باهظة؟',
    'google maps': 'هل تحاول استخراج البيانات من خرائط جوجل دون حظر؟',
    'default':     'هل سئمت من الأدوات التي تتوقف، تقيد التصدير، وتطلب بطاقتك الائتمانية؟'
  },
  sv: {
    'not working': 'Frustrerad över att din nuvarande skrapa ständigt misslyckas eller blockeras?',
    'alternative': 'Letar du efter ett bättre, snabbare och helt gratis alternativ?',
    'leads':       'Kämpar du med att bygga kontaktlistor utan dyra databaser?',
    'google maps': 'Försöker du extrahera data från Google Maps utan att bli blockerad?',
    'default':     'Trött på skrapor som fryser, begränsar din export och kräver ditt kreditkort?'
  },
  fi: {
    'not working': 'Turhauttaako, kun nykyinen tiedonkeruutyökalusi kaatuu tai estetään?',
    'alternative': 'Etsitkö parempaa, nopeampaa ja täysin ilmaista vaihtoehtoa?',
    'leads':       'Onko liidilistojen rakentaminen vaikeaa ilman kalliita tietokantoja?',
    'google maps': 'Yritätkö kerätä tietoa Google Mapsista ilman estoja?',
    'default':     'Kyllästynyt työkaluihin, jotka jäätyvät, rajoittavat vientiä ja vaativat luottokorttia?'
  },
  ko: {
    'not working': '현재 사용하는 스크래퍼가 계속 실패하거나 차단되어 답답하신가요?',
    'alternative': '더 빠르고 완벽하게 무료인 대안을 찾고 계신가요?',
    'leads':       '비싼 데이터베이스 없이 잠재 고객 목록을 구축하는 데 어려움을 정고 계신가요?',
    'google maps': '차단되지 않고 구글 맵에서 데이터를 추출하려고 하시나요?',
    'default':     '멈추고, 내보내기를 제한하며, 신용카드를 요구하는 스크래퍼에 지치셨나요?'
  },
  ru: {
    'not working': 'Ваш текущий парсер постоянно дает сбои, зависает или блокируется?',
    'alternative': 'Ищете лучшую, более быструю и полностью бесплатную альтернативу?',
    'leads':       'Сложно собирать базы лидов без дорогих баз данных?',
    'google maps': 'Пытаетесь извлечь данные из Google Maps без блокировок?',
    'default':     'Устали от парсеров, которые зависают, ограничивают экспорт и требуют кредитную карту?'
  },
  hi: {
    'not working': 'क्या आपका वर्तमान स्क्रैपर बार-बार विफल होता है या ब्लॉक हो जाता है?',
    'alternative': 'क्या आप एक बेहतर, तेज़ और पूरी तरह से मुफ़्त विकल्प खोज रहे हैं?',
    'leads':       'क्या आप महंगे डेटाबेस के बिना लीड सूचियां बनाने के लिए संघर्ष कर रहे हैं?',
    'google maps': 'क्या आप बिना ब्लॉक हुए Google Maps से डेटा निकालने का प्रयास कर रहे हैं?',
    'default':     'क्या आप ऐसे स्क्रैपर से थक गए हैं जो हैंग होते हैं, निर्यात सीमित करते हैं और क्रेडिट कार्ड मांगते हैं?'
  }
};

// Solution text per language
const SOLUTIONS = {
  en: 'Workfern runs 100% inside your Chrome browser — no servers, no login, no limits. Install from the Chrome Web Store and start extracting data to CSV in 30 seconds.',
  es: 'Workfern se ejecuta 100% dentro de tu navegador Chrome — sin servidores, sin registro, sin límites. Instala desde Chrome Web Store y empieza a exportar datos a CSV en 30 segundos.',
  de: 'Workfern läuft zu 100% in Ihrem Chrome-Browser — keine Server, kein Login, keine Limits. Installieren Sie es aus dem Chrome Web Store und exportieren Sie in 30 Sekunden Daten als CSV.',
  fr: 'Workfern fonctionne 100% dans votre navigateur Chrome — sans serveur, sans login, sans limite. Installez depuis le Chrome Web Store et commencez à extraire des données en CSV en 30 secondes.',
  ja: 'WorkfernはあなたのChromeブラウザ内で100%動作します。サーバー不要、ログイン不要、制限なし。Chrome Web Storeからインストールして30秒でCSVにデータ出力を開始できます。',
  it: 'Workfern funziona al 100% all\'interno del tuo browser Chrome — niente server, nessun login, nessun limite. Installa dal Chrome Web Store e inizia a esportare dati in CSV in 30 secondi.',
  ar: 'يعمل Workfern بالكامل داخل متصفح كروم — بدون خوادم، بدون تسجيل دخول، وبدون حدود. قم بتثبيته من سوق كروم الإلكتروني وابدأ في استخراج البيانات إلى CSV في 30 ثانية.',
  sv: 'Workfern körs 100% inuti din Chrome-webbläsare — inga servrar, ingen inloggning, inga begränsningar. Installera från Chrome Web Store och börja extrahera data till CSV på 30 sekunder.',
  fi: 'Workfern toimii 100% Chrome-selaimessasi — ei palvelimia, ei kirjautumista, ei rajoituksia. Asenna Chrome Web Storesta ja aloita tietojen vienti CSV-muotoon 30 sekunnissa.',
  ko: 'Workfern은 Chrome 브라우저 내에서 100% 실행됩니다. 서버, 로그인, 제한이 없습니다. Chrome 웹 스토어에서 설치하고 30초 만에 CSV로 데이터 추출을 시작하세요.',
  ru: 'Workfern работает на 100% внутри вашего браузера Chrome — без серверов, без регистрации, без ограничений. Установите из Chrome Web Store и начните экспорт данных в CSV за 30 секунд.',
  hi: 'Workfern 100% आपके क्रोम ब्राउज़र के अंदर चलता है — कोई सर्वर नहीं, कोई लॉगिन नहीं, कोई सीमा नहीं। क्रोम वेब स्टोर से इंस्टॉल करें और 30 सेकंड में CSV में डेटा निकालना शुरू करें।'
};

// CTA button text per language
const CTA_TEXT = {
  en: 'Add to Chrome — It\'s Free',
  es: 'Añadir a Chrome — Es Gratis',
  de: 'Zu Chrome hinzufügen — Kostenlos',
  fr: 'Ajouter à Chrome — C\'est Gratuit',
  ja: 'Chromeに追加 — 無料',
  it: 'Aggiungi a Chrome — È Gratis',
  ar: 'أضف إلى كروم — مجانًا',
  sv: 'Lägg till i Chrome — Det är gratis',
  fi: 'Lisää Chromeen — Se on ilmainen',
  ko: 'Chrome에 추가 — 무료입니다',
  ru: 'Добавить в Chrome — Это бесплатно',
  hi: 'क्रोम में जोड़ें — यह मुफ़्त है'
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

function titleCase(str) {
  if (!str) return '';
  return str.replace(/\b\w/g, l => l.toUpperCase());
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
    const relativeSlugPath = lang === 'en' ? `${safeSlug}.html` : `${lang}/${safeSlug}.html`;

    // Build the page from template
    let htmlDir = LANG_META[lang].dir ? ` dir="${LANG_META[lang].dir}"` : '';
    let pageHtml = template;

    if (lang !== 'en' && UI_STRINGS[lang]) {
        for (const [enStr, translatedStr] of Object.entries(UI_STRINGS[lang])) {
            pageHtml = pageHtml.split(enStr).join(translatedStr);
        }
    }

    pageHtml = pageHtml
      .replace(/lang="en"/g, `lang="${htmlLang}"${htmlDir}`)
      .replace(/\{\{META_TITLE\}\}/g,       title || `${h1} | Workfern`)
      .replace(/\{\{META_DESCRIPTION\}\}/g, meta_description || '')
      .replace(/\{\{SLUG\}\}/g,             relativeSlugPath)
      .replace(/\{\{keyword\}\}/g,          titleCase(keyword))
      .replace(/\{\{KEYWORD\}\}/g,          keyword)
      .replace(/\{\{KEYWORD_CAPITALIZED\}\}/g, h1 || keyword)
      .replace(/\{\{H1_TITLE\}\}/g,         h1 || keyword)
      .replace(/\{\{HERO_PAIN_POINT\}\}/g,  painPoint)
      .replace(/\{\{H2_PAIN_HEADING\}\}/g,  h1 || keyword)
      .replace(/\{\{H2_PAIN_BODY\}\}/g,     painPoint)
      .replace(/\{\{H3_SOLUTION_HEADING\}\}/g, `How Workfern Solves It`)
      .replace(/\{\{H3_SOLUTION_BODY\}\}/g, solution)
      .replace(/\{\{BADGE_TEXT\}\}/g,       '🚀 Free Tool')
      .replace(/\{\{TWITTER_TEXT\}\}/g,     encodeURIComponent(h1 || keyword))
      .replace(/\{\{platform\}\}/g,         page.platform || 'websites')
      .replace(/\{\{data_type\}\}/g,        page.data_type || 'data');

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
console.log(`📁 Italian → /pages/it/`);
console.log(`📁 Arabic  → /pages/ar/`);
console.log(`📁 Swedish → /pages/sv/`);
console.log(`📁 Finnish → /pages/fi/`);
console.log(`📁 Korean  → /pages/ko/`);
console.log(`📁 Russian → /pages/ru/`);
console.log(`📁 Hindi   → /pages/hi/`);
console.log(`🗺️  sitemap.xml updated with ${allSlugsForSitemap.length} URLs`);
