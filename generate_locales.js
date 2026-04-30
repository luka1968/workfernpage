const fs = require('fs');

let rawData = fs.readFileSync('D:\\360\\git2\\workfernpage\\150_seo_metadata_min.json', 'utf8');
if (rawData.charCodeAt(0) === 0xFEFF) {
  rawData = rawData.slice(1);
}
const englishMetadata = JSON.parse(rawData);

const locales = ['es', 'de', 'fr', 'ja'];
const localizedData = { en: englishMetadata, es: [], de: [], fr: [], ja: [] };

// Helper to replace keywords based on common patterns
function translateKeyword(kw, lang) {
    kw = kw.toLowerCase();
    let platform = "";
    
    // Pattern Matching
    if (kw.includes('data scraper')) {
        platform = kw.replace('data scraper', '').trim();
        if(lang==='es') return `scraper de ${platform}`;
        if(lang==='de') return `${platform} scraper`;
        if(lang==='fr') return `scraper ${platform}`;
        if(lang==='ja') return `${platform} データ抽出`;
    }
    if (kw.includes('scrape') && kw.includes('for leads')) {
        platform = kw.replace('scrape', '').replace('for leads', '').trim();
        if(lang==='es') return `extraer leads de ${platform}`;
        if(lang==='de') return `${platform} leads generieren`;
        if(lang==='fr') return `extraire des leads ${platform}`;
        if(lang==='ja') return `${platform} 顧客リスト 作成`;
    }
    if (kw.includes('free web scraper for')) {
        platform = kw.replace('free web scraper for', '').trim();
        if(lang==='es') return `web scraper gratis para ${platform}`;
        if(lang==='de') return `kostenloser web scraper für ${platform}`;
        if(lang==='fr') return `web scraper gratuit pour ${platform}`;
        if(lang==='ja') return `無料の ${platform} スクレイピングツール`;
    }
    if (kw.includes('no code web scraper for')) {
        platform = kw.replace('no code web scraper for', '').trim();
        if(lang==='es') return `web scraper sin codigo para ${platform}`;
        if(lang==='de') return `no code web scraper für ${platform}`;
        if(lang==='fr') return `web scraper sans code pour ${platform}`;
        if(lang==='ja') return `ノーコード ${platform} スクレイピング`;
    }
    if (kw.includes('how to scrape') && kw.includes('without coding')) {
        platform = kw.replace('how to scrape', '').replace('without coding', '').trim();
        if(lang==='es') return `como extraer datos de ${platform} sin programar`;
        if(lang==='de') return `${platform} scrapen ohne programmieren`;
        if(lang==='fr') return `comment scraper ${platform} sans coder`;
        if(lang==='ja') return `${platform} スクレイピング ノーコード`;
    }
    if (kw.includes('guide to extracting data from')) {
        platform = kw.replace('guide to extracting data from', '').trim();
        if(lang==='es') return `guia para extraer datos de ${platform}`;
        if(lang==='de') return `anleitung zum daten auslesen von ${platform}`;
        if(lang==='fr') return `guide pour extraire des donnees de ${platform}`;
        if(lang==='ja') return `${platform} データ抽出 ガイド`;
    }
    if (kw.includes('alternative') && !kw.includes('free')) {
        platform = kw.replace('alternative', '').trim();
        if(lang==='es') return `alternativa a ${platform}`;
        if(lang==='de') return `${platform} alternative`;
        if(lang==='fr') return `alternative a ${platform}`;
        if(lang==='ja') return `${platform} 代替`;
    }
    
    // Fallback dictionary for specific generic terms
    const dict = {
        'es': { 'leads': 'leads', 'emails': 'correos', 'product prices': 'precios', 'reviews': 'reseñas' },
        'de': { 'leads': 'leads', 'emails': 'emails', 'product prices': 'preise', 'reviews': 'bewertungen' },
        'fr': { 'leads': 'leads', 'emails': 'emails', 'product prices': 'prix', 'reviews': 'avis' },
        'ja': { 'leads': '見込み客', 'emails': 'メールアドレス', 'product prices': '価格', 'reviews': 'レビュー' }
    };

    return kw + ` ${lang}`; // Safe fallback
}

function titleCase(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

englishMetadata.forEach(item => {
    locales.forEach(lang => {
        let tk = translateKeyword(item.keyword, lang).replace('  ', ' ');
        // Basic capitalizing
        let title = ""; let h1 = ""; let meta = "";
        
        if (lang === 'es') {
            title = `${titleCase(tk)} | Sin Código`;
            h1 = `Potente ${titleCase(tk)}`;
            meta = `Extrae datos fácilmente. Usa Workfern, la herramienta gratuita de IA para obtener ${tk} al instante en CSV.`;
        }
        if (lang === 'de') {
            title = `${titleCase(tk)} | Ohne Code`;
            h1 = `Leistungsstarker ${titleCase(tk)}`;
            meta = `Daten einfach auslesen. Nutzen Sie Workfern, das kostenlose KI-Tool für ${tk} direkt in CSV.`;
        }
        if (lang === 'fr') {
            title = `${titleCase(tk)} | Sans Code`;
            h1 = `Le Meilleur ${titleCase(tk)}`;
            meta = `Extrayez des données facilement. Utilisez Workfern, l'outil IA gratuit pour ${tk} instantanément en CSV.`;
        }
        if (lang === 'ja') {
            title = `${tk} | ノーコード`;
            h1 = `強力な ${tk}`;
            meta = `データ抽出をノーコードで簡単に。Workfernは、データをCSVに即座に出力する無料のAIスクレイピングツールです。`;
        }

        let slug = tk.toLowerCase().replace(/[^a-z0-9\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u2605-\u2606\u2190-\u2195\u203B]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        localizedData[lang].push({
            keyword: tk,
            slug: slug,
            title: title.substring(0, 60),
            meta_description: meta.substring(0, 155),
            h1: h1,
            page_type: item.page_type
        });
    });
});

fs.writeFileSync('D:\\360\\git2\\workfernpage\\localized_seo_all.json', JSON.stringify(localizedData, null, 2), 'utf8');
console.log('Successfully generated localized_seo_all.json');
