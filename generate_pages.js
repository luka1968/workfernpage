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

// Pain points map → H1 hero
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

// H2 pain headings — injected into the orange pain block
const H2_PAIN_HEADINGS = {
  'not working': 'No Login, No Limit, No More Broken Scrapers',
  'blocked': 'Stop Getting Blocked — Scrape Without Detection',
  'limit': 'No Limit, No Caps — Unlimited Data Export',
  'no login': 'No Login Required — Start Scraping in Seconds',
  'ecommerce': 'Fast Ecommerce Scraping Without Row Limits',
  'leads': 'Unlimited Lead Extraction, Zero Restrictions',
  'google maps': 'Google Maps Scraping That Actually Works',
  'linkedin': 'LinkedIn Data Extraction Without Account Blocks',
  'alternative': 'The Free Alternative That Removes Every Limit',
  'comparison': 'Why Workfern Wins Every Feature Comparison',
  'default': 'No Login. No Limit. Fast Scraping in One Click.'
};

// H2 pain body text
const H2_PAIN_BODIES = {
  'not working': 'Most scrapers fail on modern websites because they rely on outdated parsing methods that break whenever a site updates its HTML structure. You end up losing hours debugging why your export stopped mid-way, or why your tool refuses to scroll past page 3.',
  'blocked': 'Anti-scraping systems get smarter every year. If your tool sends too many rapid requests or fails to mimic human browsing patterns, you get blocked instantly — sometimes permanently. This forces you to rotate proxies, add delays, and babysit your script.',
  'limit': 'Every "free" scraper eventually shows you a paywall. You hit 500 rows and suddenly you need to upgrade to export the other 49,500. This artificial cap is a business model — not a technical limitation.',
  'no login': 'Being forced to create an account before you can even try a tool is a red flag. Tools that require login can track your usage, sell your data, and lock you out the moment you exceed a quota.',
  'ecommerce': 'Tracking thousands of SKUs across competitor stores manually is impossible at scale. Most scrapers can\'t handle the lazy-loaded product grids, currency variations, and pagination that modern ecommerce platforms use.',
  'leads': 'Generic scrapers only pull what\'s visible on a directory page. But real decision-maker contacts are hidden on individual company websites — never listed on Yelp or Google Maps.',
  'google maps': 'Google Maps uses complex infinite scroll and dynamic DOM rendering that trips up most extraction tools. They stop loading after a few dozen results or crash entirely on large city searches.',
  'linkedin': 'LinkedIn aggressively rate-limits and blocks unauthorized data access. Most tools that claim LinkedIn support either scrape nothing useful or get your IP flagged immediately.',
  'default': 'Legacy scraping tools were built for a simpler web. They break on dynamic pages, get blocked on popular directories, and force you to pay just to download what should be your own data.'
};

// H3 solution headings
const H3_SOLUTION_HEADINGS = {
  'not working': 'How Workfern Fixes It — AI-Powered, Always Working',
  'blocked': 'How Workfern Avoids Blocks — Local, Human-Like Browsing',
  'limit': 'How Workfern Removes Limits — No Server, No Caps',
  'no login': 'How Workfern Works Without Any Account',
  'ecommerce': 'How Workfern Handles Ecommerce Complexity',
  'leads': 'How Workfern Finds the Leads Others Miss',
  'google maps': 'How Workfern Dominates Google Maps Extraction',
  'linkedin': 'How Workfern Approaches Professional Data Extraction',
  'default': 'How Workfern Solves Every Scraping Pain Point'
};

// H3 solution body text
const H3_SOLUTION_BODIES = {
  'not working': 'Workfern uses an AI engine that reads the DOM structure of the current page and intelligently identifies the most valuable data — regardless of how the HTML is laid out. It adapts to page structure changes automatically, so you never need to debug selectors again.',
  'blocked': 'Because Workfern runs entirely inside your own Chrome browser, every request it makes looks exactly like a normal user browsing the page. There are no shared IP addresses, no bot fingerprints, and no detectable scraping patterns.',
  'limit': 'Workfern has no server infrastructure processing your data. It runs 100% locally in your browser tab, which means there is no cost basis for imposing limits. You can export 100 rows or 100,000 rows — the tool does not care.',
  'no login': 'Workfern is installed directly from the Chrome Web Store and works immediately. Your data is processed locally on your device and never transmitted to any external server. No account, no email, no password.',
  'ecommerce': 'Workfern intelligently navigates pagination, handles lazy-loaded image grids, and auto-scrolls through massive product catalogs. It extracts names, prices, ratings, and stock levels in one continuous session without any manual page turning.',
  'leads': 'After grabbing the surface-level directory data, Workfern silently opens each business\'s official website in the background and scans for contact pages, email addresses, and technology signals like Facebook Pixels.',
  'google maps': 'Workfern was built with Google Maps as a first-class target. It auto-scrolls the results sidebar, waits for dynamic content to load, and systematically captures every business listing in the current search area.',
  'linkedin': 'Workfern extracts publicly available profile and company data that is rendered in the DOM of your current browser session, working within your existing logged-in context to avoid triggering account flags.',
  'default': 'Workfern replaces the entire complex scraping stack with a single Chrome extension. No proxies, no scripts, no configuration. Install it, navigate to your target site, and click one button to download your clean CSV.'
};

function getH2PainHeading(keyword)  { return getMap(H2_PAIN_HEADINGS, keyword); }
function getH2PainBody(keyword)     { return getMap(H2_PAIN_BODIES, keyword); }
function getH3SolutionHeading(keyword) { return getMap(H3_SOLUTION_HEADINGS, keyword); }
function getH3SolutionBody(keyword)    { return getMap(H3_SOLUTION_BODIES, keyword); }

function getMap(map, keyword) {
  const lower = keyword.toLowerCase();
  for (const [trigger, text] of Object.entries(map)) {
    if (lower.includes(trigger)) return text;
  }
  return map['default'];
}

function getPainPoint(keyword) { return getMap(PAIN_POINTS, keyword); }
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
  const painPoint    = getPainPoint(keyword);
  const h2Heading    = getH2PainHeading(keyword);
  const h2Body       = getH2PainBody(keyword);
  const h3Heading    = getH3SolutionHeading(keyword);
  const h3Body       = getH3SolutionBody(keyword);
  const badgeText    = getBadgeText(category);
  const h1Title      = `The Best ${keywordCap}`;

  let page = template
    .replace(/\{\{META_TITLE\}\}/g, metaTitle)
    .replace(/\{\{META_DESCRIPTION\}\}/g, metaDesc)
    .replace(/\{\{SLUG\}\}/g, slug + '.html')
    .replace(/\{\{KEYWORD\}\}/g, keyword)
    .replace(/\{\{KEYWORD_CAPITALIZED\}\}/g, keywordCap)
    .replace(/\{\{H1_TITLE\}\}/g, h1Title)
    .replace(/\{\{HERO_PAIN_POINT\}\}/g, painPoint)
    .replace(/\{\{H2_PAIN_HEADING\}\}/g, h2Heading)
    .replace(/\{\{H2_PAIN_BODY\}\}/g, h2Body)
    .replace(/\{\{H3_SOLUTION_HEADING\}\}/g, h3Heading)
    .replace(/\{\{H3_SOLUTION_BODY\}\}/g, h3Body)
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
