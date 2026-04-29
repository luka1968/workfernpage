/**
 * Workfern SEO Performance Analyzer
 * 
 * Usage: 
 * 1. Go to Google Search Console -> Search Results
 * 2. Export data as CSV and save it here as 'gsc_performance.csv'
 * 3. Run: node analyze_gsc_data.js
 */

const fs = require('fs');
const path = require('path');

const GSC_CSV_PATH = path.resolve(__dirname, 'gsc_performance.csv');

console.log('📊 Workfern Programmatic SEO Analyzer');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (!fs.existsSync(GSC_CSV_PATH)) {
    console.log('⚠️ [Notice] No gsc_performance.csv found.');
    console.log('Please export your page performance data from Google Search Console and save it as gsc_performance.csv in this folder to run the analysis.');
    
    // Create a dummy CSV file to show the user the format
    const dummyData = `Page,Clicks,Impressions,CTR,Position
https://www.workfern.com/pages/free-instant-data-scraper-alternative.html,120,800,15.00%,3.2
https://www.workfern.com/pages/instant-data-scraper-not-working.html,5,600,0.83%,11.5
https://www.workfern.com/pages/google-maps-scraper-no-login.html,45,300,15.00%,4.1
https://www.workfern.com/pages/instant-data-scraper-limit-reached.html,2,550,0.36%,14.2
`;
    fs.writeFileSync(GSC_CSV_PATH, dummyData, 'utf-8');
    console.log('✅ Created a sample gsc_performance.csv for demonstration.');
}

const csvData = fs.readFileSync(GSC_CSV_PATH, 'utf-8');
const lines = csvData.trim().split('\n');
const headers = lines[0].split(',');

const pages = lines.slice(1).map(line => {
    const parts = line.split(',');
    return {
        url: parts[0],
        clicks: parseInt(parts[1] || 0),
        impressions: parseInt(parts[2] || 0),
        ctr: parseFloat(parts[3] ? parts[3].replace('%', '') : 0),
        position: parseFloat(parts[4] || 0)
    };
});

const needsTitleRewrite = [];
const hiddenGems = [];
const winners = [];

for (const page of pages) {
    if (!page.url.includes('/pages/')) continue;

    // Rule 1: High Impressions, Low CTR -> Needs better Meta Title/Description
    if (page.impressions > 500 && page.ctr < 2.0) {
        needsTitleRewrite.push(page);
    }
    
    // Rule 2: Low Traffic, High CTR -> Hidden gems that need more internal links/backlinks
    if (page.impressions < 200 && page.ctr > 10.0) {
        hiddenGems.push(page);
    }

    // Rule 3: Top performers
    if (page.clicks > 50) {
        winners.push(page);
    }
}

console.log('\n🚨 UNDERPERFORMING PAGES (High Impressions, Low CTR < 2%)');
console.log('Action: Rewrite H1/Meta Description in generate_pages.js to increase clicks.');
if (needsTitleRewrite.length === 0) console.log('  None! Great job.');
needsTitleRewrite.forEach(p => {
    console.log(`  - ${path.basename(p.url)} (Impressions: ${p.impressions}, CTR: ${p.ctr}%)`);
});

console.log('\n💎 HIDDEN GEMS (Low Impressions, High CTR > 10%)');
console.log('Action: Build external backlinks or internal links to push them to Page 1.');
if (hiddenGems.length === 0) console.log('  None found.');
hiddenGems.forEach(p => {
    console.log(`  - ${path.basename(p.url)} (Position: ${p.position}, CTR: ${p.ctr}%)`);
});

console.log('\n🏆 TOP WINNERS (High Clicks)');
console.log('Action: Ensure CTA is highly optimized on these pages.');
if (winners.length === 0) console.log('  None yet. Keep building!');
winners.forEach(p => {
    console.log(`  - ${path.basename(p.url)} (Clicks: ${p.clicks})`);
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Run this script weekly after updating your gsc_performance.csv!');
