const fs = require('fs');

const csvPath = 'D:/360/git2/workfernbusiness/business_website_temp/keywords.csv';
const csv = fs.readFileSync(csvPath, 'utf-8');
const lines = csv.split('\n').slice(1).filter(l => l.trim() !== '');

let mdContent = '# Top 100 SEO Keyword Combinations\n\n';
mdContent += 'Here is a sample of 100 unique keyword combinations generated for your programmatic SEO strategy:\n\n';

for (let i = 0; i < 100 && i < lines.length; i++) {
  const line = lines[i];
  let keyword = line.split(',')[1];
  if (keyword.startsWith('"') && keyword.endsWith('"')) {
      keyword = keyword.substring(1, keyword.length - 1);
  }
  
  const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const titleCap = keyword.replace(/\b\w/g, c => c.toUpperCase());
  
  mdContent += `- **Keyword**: ${keyword}\n`;
  mdContent += `- **Page URL**: /pages/${slug}.html\n`;
  mdContent += `- **Page Title**: The Best ${titleCap} — Free, No Login, Unlimited | Workfern\n`;
  mdContent += `- **Meta Description**: Looking for the best ${keyword}? Workfern is 100% free, requires no login, and has zero export limits. Start scraping in 30 seconds.\n\n`;
}

fs.writeFileSync('C:/Users/kaka/.gemini/antigravity/brain/0285457f-ce02-49b1-b9a1-cb84264bb67d/seo_keywords_sample.md', mdContent, 'utf-8');
console.log('Artifact created.');
