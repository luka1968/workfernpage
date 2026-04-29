/**
 * Workfern Programmatic SEO Page Generator
 * Reads keywords.csv and generates one HTML landing page per keyword.
 * Usage: node generate_pages.js
 */

const fs = require('fs');
const path = require('path');

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const KEYWORDS_CSV = path.resolve('D:/360/git2/workfernbusiness/business_website_temp/keywords.csv');
const TEMPLATE_FILE = path.resolve(__dirname, 'template.html');
const OUTPUT_DIR = path.resolve(__dirname, 'pages');
const SITE_URL = 'https://www.workfern.com';
// ────────────────────────────────────────────────────────────────────────────────

// Pain points map for hero section variation
const PAIN_POINTS = {
  'not working': 'Frustrated that your current scraper keeps failing, freezing, or getting blocked?',
  'blocked': 'Getting blocked every time you try to extract data from your target site?',
  'limit': 'Hitting daily row limits right when you need the most data?',
  'no login': 'Tired of being forced to create an account just to test a tool?',
  'alternative': 'Looking for a better, faster, and completely free alternative to your current scraper?',
  'ecommerce': 'Need to track competitor prices and product data across massive catalogs?',
  'leads': 'Struggling to build accurate lead lists without expensive databases?',
  'google maps': 'Trying to extract local business data from Google Maps without getting blocked?',
  'linkedin': 'Need to pull professional contact data efficiently at scale?',
  'default': 'Tired of scrapers that freeze, limit your exports, and demand your credit card details?'
};

function getPainPoint(keyword) {
  const lower = keyword.toLowerCase();
  for (const [trigger, text] of Object.entries(PAIN_POINTS)) {
    if (lower.includes(trigger)) return text;
  }
  return PAIN_POINTS['default'];
}

function toSlug(keyword) {
  return keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function toTitleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function getBadgeText(category) {
  const map = {
    'High Commercial Intent': '🔥 Top Rated Tool',
    'Problem-based': '✅ Problem Solved',
    'Use-case': '🎯 Use Case Guide',
    'Comparison': '⚖️ Comparison Page'
  };
  return map[category] || '🚀 Free Tool';
}

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    // Handle commas inside quoted fields
    const values = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (values[i] || '').trim()]));
  }).filter(row => row.Keyword);
}

function generateSitemap(slugs) {
  const urls = slugs.map(slug => `
  <url>
    <loc>${SITE_URL}/pages/${slug}.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>${urls}
</urlset>`;
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────
console.log('🚀 Workfern Programmatic SEO Page Generator');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (!fs.existsSync(KEYWORDS_CSV)) {
  console.error(`❌ CSV not found: ${KEYWORDS_CSV}`);
  process.exit(1);
}

if (!fs.existsSync(TEMPLATE_FILE)) {
  console.error(`❌ Template not found: ${TEMPLATE_FILE}`);
  process.exit(1);
}

const csvText = fs.readFileSync(KEYWORDS_CSV, 'utf-8');
const keywords = parseCSV(csvText);
const template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const generatedSlugs = [];
let count = 0;

for (const row of keywords) {
  const keyword = row['Keyword'];
  const category = row['Category'];
  const intent = row['Search Intent'];

  const slug = toSlug(keyword);
  const keywordCap = toTitleCase(keyword);
  const metaTitle = `${keywordCap} — Free, No Login, Unlimited | Workfern`;
  const metaDesc = `Looking for the best ${keyword}? Workfern is 100% free, requires no login, and has zero export limits. Start scraping in 30 seconds.`;
  const twitterText = encodeURIComponent(`The best ${keyword} — free, no login, unlimited exports`);
  const painPoint = getPainPoint(keyword);
  const badgeText = getBadgeText(category);
  const h1Title = `The Best ${keywordCap}`;

  let page = template
    .replace(/\{\{META_TITLE\}\}/g, metaTitle)
    .replace(/\{\{META_DESCRIPTION\}\}/g, metaDesc)
    .replace(/\{\{SLUG\}\}/g, slug + '.html')
    .replace(/\{\{KEYWORD\}\}/g, keyword)
    .replace(/\{\{KEYWORD_CAPITALIZED\}\}/g, keywordCap)
    .replace(/\{\{H1_TITLE\}\}/g, h1Title)
    .replace(/\{\{HERO_PAIN_POINT\}\}/g, painPoint)
    .replace(/\{\{BADGE_TEXT\}\}/g, badgeText)
    .replace(/\{\{TWITTER_TEXT\}\}/g, twitterText);

  const outputPath = path.join(OUTPUT_DIR, `${slug}.html`);
  fs.writeFileSync(outputPath, page, 'utf-8');
  generatedSlugs.push(slug);
  count++;
  console.log(`  ✅ [${count.toString().padStart(2, '0')}] ${slug}.html`);
}

// Generate sitemap.xml
const sitemap = generateSitemap(generatedSlugs);
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap, 'utf-8');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`🎉 Done! Generated ${count} pages → /pages/`);
console.log(`🗺️  sitemap.xml updated with all ${count} URLs`);
