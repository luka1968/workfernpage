/**
 * Workfern Keyword Matrix Generator
 * Generates 1000+ keyword combinations and writes them to keywords.csv
 * Usage: node generate_keywords.js
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_CSV = path.resolve('D:/360/git2/workfernbusiness/business_website_temp/keywords.csv');

// ─── KEYWORD MATRIX ─────────────────────────────────────────────────────────

const coreIntents = [
  'instant data scraper alternative',
  'data scraper alternative',
  'web scraper alternative',
  'data extractor alternative',
  'scraping tool alternative',
  'instant data scraper replacement',
  'data scraper tool',
  'web scraping extension',
  'data extraction tool',
  'lead scraper tool',
  'business data extractor',
  'instant web scraper',
];

const modifiers = [
  'free',
  'no login',
  'no limit',
  'unlimited',
  'fast',
  'best',
  'top rated',
  'easy',
  'simple',
  'automated',
  'AI powered',
  'no signup',
  'no credit card',
  'no registration',
  'beginner friendly',
  'one click',
  'instant',
  'chrome extension',
  '2025',
  '2026',
];

const useCases = [
  'for ecommerce',
  'for lead generation',
  'for google maps',
  'for linkedin',
  'for yelp',
  'for amazon',
  'for shopify',
  'for b2b',
  'for real estate',
  'for yellow pages',
  'for directories',
  'for product research',
  'for competitor analysis',
  'for price monitoring',
  'for contact scraping',
  'for email extraction',
  'for phone number extraction',
  'for local businesses',
  'for marketing agencies',
  'for sales teams',
  'for freelancers',
  'for startups',
];

const locations = [
  'usa',
  'uk',
  'canada',
  'australia',
  'india',
  'germany',
  'france',
  'philippines',
  'new york',
  'london',
  'dubai',
  'singapore',
];

const problems = [
  'not working fix',
  'blocked workaround',
  'crashing on large pages fix',
  'too slow alternative',
  'limit reached workaround',
  'pagination not working fix',
  'not scrolling fix',
  'export limit workaround',
  'stopped working alternative',
  'login required workaround',
  'captcha blocked alternative',
  'dynamic page issue fix',
  'infinite scroll not working fix',
];

const comparisons = [
  'vs instant data scraper',
  'vs data miner',
  'vs webscraper io',
  'vs octoparse',
  'vs import io',
  'vs parsehub',
  'vs apify',
  'vs scrapy',
  'vs beautiful soup',
  'vs selenium alternative',
  'vs python scraper',
  'vs chrome extension scraper',
];

// ─── BUILD COMBINATIONS ─────────────────────────────────────────────────────

const rows = [];

function addRow(keyword, category, intent, pageType) {
  const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  rows.push({ category, keyword, intent, pageType, slug });
}

// 1. Modifier + Core (free instant data scraper alternative, etc.)
for (const mod of modifiers) {
  for (const core of coreIntents) {
    addRow(`${mod} ${core}`, 'High Commercial Intent', `Wants a ${mod} option for ${core}`, 'landing');
  }
}

// 2. Core + Use case (instant data scraper alternative for ecommerce, etc.)
for (const core of coreIntents) {
  for (const useCase of useCases) {
    addRow(`${core} ${useCase}`, 'Use-case', `Needs ${core} ${useCase}`, 'landing');
  }
}

// 3. Core + Problem (instant data scraper alternative not working fix, etc.)
for (const core of coreIntents.slice(0, 4)) {
  for (const prob of problems) {
    addRow(`${core} ${prob}`, 'Problem-based', `Troubleshooting: ${prob}`, 'blog');
  }
}

// 4. Modifier + Core + Use case (free instant data scraper for google maps, etc.)
const topModifiers = ['free', 'no login', 'unlimited', 'fast', 'best'];
const topCores = coreIntents.slice(0, 4);
const topUseCases = useCases.slice(0, 8);
for (const mod of topModifiers) {
  for (const core of topCores) {
    for (const useCase of topUseCases) {
      addRow(`${mod} ${core} ${useCase}`, 'High Commercial Intent', `${mod} ${core} ${useCase}`, 'landing');
    }
  }
}

// 5. Comparisons
for (const core of coreIntents) {
  for (const comp of comparisons) {
    addRow(`${core} ${comp}`, 'Comparison', `Comparing ${core} with ${comp.replace('vs ', '')}`, 'comparison');
  }
}

// 6. Problem + Use case (scraper blocked on google maps, etc.)
const problemPhrases = [
  'scraper blocked',
  'data scraper not working',
  'web scraper crashing',
  'instant data scraper failing',
  'scraper hitting limit',
  'export limit reached',
];
for (const prob of problemPhrases) {
  for (const useCase of useCases.slice(0, 10)) {
    addRow(`${prob} ${useCase}`, 'Problem-based', `${prob} ${useCase}`, 'blog');
  }
}

// 7. Location-based (free web scraper for google maps usa, etc.)
const locationCores = [
  'free web scraper',
  'business data extractor',
  'lead scraper tool',
  'google maps scraper',
  'local business scraper',
  'instant data scraper alternative',
  'web scraping extension',
];
for (const core of locationCores) {
  for (const loc of locations) {
    addRow(`${core} in ${loc}`, 'Use-case', `Local market scraping in ${loc}`, 'landing');
    addRow(`${core} for ${loc} businesses`, 'Use-case', `B2B scraping targeting ${loc}`, 'landing');
  }
}

// 8. "How to" blog variants
const howToTopics = [
  'scrape google maps without api',
  'export yelp listings to csv',
  'extract linkedin contacts free',
  'scrape amazon product data',
  'scrape shopify store products',
  'get phone numbers from directories',
  'extract emails from websites free',
  'scrape b2b leads without coding',
  'bypass scraper limits for free',
  'automate lead generation with browser extension',
  'scrape ecommerce data without login',
  'export unlimited leads to csv',
];
for (const topic of howToTopics) {
  addRow(`how to ${topic}`, 'Problem-based', `Tutorial: how to ${topic}`, 'blog');
  addRow(`best tool to ${topic}`, 'High Commercial Intent', `Best tool to ${topic}`, 'landing');
}

// 9. Competitor Interception (Instant Data Scraper exact match and variations)
const idsInterceptionKeywords = [
  'instant data scraper chrome extension',
  'instant data scraper download',
  'instant data scraper review',
  'instant data scraper tutorial',
  'how to use instant data scraper',
  'instant data scraper next button not working',
  'instant data scraper not scrolling',
  'instant data scraper alternatives reddit',
  'instant data scraper pricing',
  'is instant data scraper safe',
  'instant data scraper limit reached',
  'instant data scraper pro',
  'instant data scraper premium',
  'instant data scraper vs web scraper',
  'instant data scraper export to excel',
  'instant data scraper pagination',
  'instant data scraper not extracting all data',
  'instant data scraper blocked',
  'instant data scraper not finding table',
  'instant data scraper multiple pages',
  'instant data scraper stuck on page 1',
  'instant data scraper auto clicker',
  'instant data scraper dynamic pages',
  'instant data scraper google maps',
  'instant data scraper yelp',
  'instant data scraper linkedin',
  'instant data scraper amazon',
  'instant data scraper yellow pages',
  'instant data scraper github',
  'instant data scraper malware',
  'instant data scraper source code'
];

for (const keyword of idsInterceptionKeywords) {
  // Use problem-based or comparison categories to trigger the right template blocks
  let category = 'Comparison';
  if (keyword.includes('not ') || keyword.includes('blocked') || keyword.includes('limit') || keyword.includes('stuck')) {
    category = 'Problem-based';
  }
  addRow(keyword, category, `Intercepting traffic for: ${keyword}`, 'landing');
}

// ─── DEDUPLICATE ─────────────────────────────────────────────────────────────

const seen = new Set();
const unique = rows.filter(r => {
  if (seen.has(r.slug)) return false;
  seen.add(r.slug);
  return true;
});

// ─── WRITE CSV ────────────────────────────────────────────────────────────────

const header = 'Category,Keyword,Search Intent,Page Type';
const csvLines = unique.map(r => {
  const safeKeyword = r.keyword.includes(',') ? `"${r.keyword}"` : r.keyword;
  const safeIntent = r.intent.includes(',') ? `"${r.intent}"` : r.intent;
  return `${r.category},${safeKeyword},${safeIntent},${r.pageType}`;
});

fs.writeFileSync(OUTPUT_CSV, [header, ...csvLines].join('\n'), 'utf-8');

console.log(`✅ Generated ${unique.length} unique keywords → ${OUTPUT_CSV}`);
