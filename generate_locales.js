const fs = require('fs');

let rawData = fs.readFileSync('D:\\360\\git2\\workfernpage\\150_seo_metadata_min.json', 'utf8');
if (rawData.charCodeAt(0) === 0xFEFF) {
  rawData = rawData.slice(1);
}
const englishMetadata = JSON.parse(rawData);

const locales = ['es', 'de', 'fr', 'ja', 'it', 'ar', 'sv', 'fi', 'ko', 'ru', 'hi'];
const localizedData = { en: englishMetadata, es: [], de: [], fr: [], ja: [], it: [], ar: [], sv: [], fi: [], ko: [], ru: [], hi: [] };

// Helper to replace keywords based on common patterns
function translateKeyword(kw, lang) {
    kw = kw.toLowerCase();
    let platform = "";
    
    // Pattern Matching
    if (kw.includes('data scraper')) {
        platform = kw.replace('data scraper', '').trim();
        if(lang==='es') return [`scraper de ${platform}`, `extraer datos de ${platform}`, `descargar datos de ${platform}`];
        if(lang==='de') return [`${platform} scraper`, `${platform} daten extrahieren`, `${platform} daten exportieren`];
        if(lang==='fr') return [`scraper ${platform}`, `extraire des donnees ${platform}`, `telecharger donnees ${platform}`];
        if(lang==='ja') return [`${platform} データ抽出`, `${platform} スクレイピング`, `${platform} データ収集`];
        if(lang==='it') return [`scraper per ${platform}`, `estrarre dati da ${platform}`, `scaricare dati ${platform}`];
        if(lang==='ar') return [`استخراج بيانات ${platform}`, `سحب بيانات ${platform}`, `تنزيل بيانات ${platform}`];
        if(lang==='sv') return [`${platform} dataskrapa`, `extrahera data från ${platform}`, `hämta data från ${platform}`];
        if(lang==='fi') return [`${platform} tiedonkeruu`, `kerää tietoa ${platform}`, `lataa ${platform} data`];
        if(lang==='ko') return [`${platform} 데이터 추출`, `${platform} 스크래핑`, `${platform} 데이터 수집`];
        if(lang==='ru') return [`парсер данных ${platform}`, `сбор данных с ${platform}`, `скачать данные ${platform}`];
        if(lang==='hi') return [`${platform} डेटा स्क्रैपर`, `${platform} से डेटा निकालें`, `${platform} डेटा डाउनलोड करें`];
    }
    if (kw.includes('scrape') && kw.includes('for leads')) {
        platform = kw.replace('scrape', '').replace('for leads', '').trim();
        if(lang==='es') return [`extraer leads de ${platform}`, `generar leads de ${platform}`, `buscar clientes en ${platform}`];
        if(lang==='de') return [`${platform} leads generieren`, `${platform} leads finden`, `${platform} kontakte exportieren`];
        if(lang==='fr') return [`extraire des leads ${platform}`, `generer des leads ${platform}`, `trouver des clients ${platform}`];
        if(lang==='ja') return [`${platform} 顧客リスト 作成`, `${platform} 見込み客 抽出`, `${platform} 営業リスト 作成`];
        if(lang==='it') return [`estrarre lead da ${platform}`, `generare lead da ${platform}`, `trovare clienti su ${platform}`];
        if(lang==='ar') return [`استخراج عملاء محتملين من ${platform}`, `توليد عملاء من ${platform}`, `البحث عن عملاء في ${platform}`];
        if(lang==='sv') return [`extrahera leads från ${platform}`, `generera leads från ${platform}`, `hitta kunder på ${platform}`];
        if(lang==='fi') return [`kerää liidejä ${platform}`, `generoi liidejä ${platform}`, `etsi asiakkaita ${platform}`];
        if(lang==='ko') return [`${platform} 잠재 고객 추출`, `${platform} 리드 생성`, `${platform} 고객 찾기`];
        if(lang==='ru') return [`сбор лидов с ${platform}`, `генерация лидов с ${platform}`, `поиск клиентов на ${platform}`];
        if(lang==='hi') return [`${platform} से लीड्स निकालें`, `${platform} लीड्स जनरेट करें`, `${platform} पर ग्राहक खोजें`];
    }
    if (kw.includes('free web scraper for')) {
        platform = kw.replace('free web scraper for', '').trim();
        if(lang==='es') return [`web scraper gratis para ${platform}`, `scraper gratuito para ${platform}`, `herramienta gratis para extraer ${platform}`];
        if(lang==='de') return [`kostenloser web scraper für ${platform}`, `gratis scraper für ${platform}`, `kostenloses tool für ${platform}`];
        if(lang==='fr') return [`web scraper gratuit pour ${platform}`, `scraper gratuit pour ${platform}`, `outil gratuit pour extraire ${platform}`];
        if(lang==='ja') return [`無料の ${platform} スクレイピングツール`, `${platform} 無料抽出ツール`, `完全無料 ${platform} スクレイパー`];
        if(lang==='it') return [`web scraper gratuito per ${platform}`, `scraper gratis per ${platform}`, `strumento gratuito per ${platform}`];
        if(lang==='ar') return [`أداة استخراج ويب مجانية لـ ${platform}`, `أداة مجانية لسحب ${platform}`, `استخراج ${platform} مجانا`];
        if(lang==='sv') return [`gratis webbskrapa för ${platform}`, `kostnadsfri skrapa för ${platform}`, `gratis verktyg för ${platform}`];
        if(lang==='fi') return [`ilmainen web scraper ${platform}`, `ilmainen tiedonkeruutyökalu ${platform}`, `maksuton ${platform} scraper`];
        if(lang==='ko') return [`무료 ${platform} 웹 스크래퍼`, `${platform} 무료 추출 도구`, `완전 무료 ${platform} 스크래핑`];
        if(lang==='ru') return [`бесплатный парсер для ${platform}`, `бесплатный скрапер для ${platform}`, `бесплатный инструмент для ${platform}`];
        if(lang==='hi') return [`मुफ्त ${platform} वेब स्क्रैपर`, `${platform} के लिए मुफ्त स्क्रैपर`, `${platform} मुफ़्त डेटा टूल`];
    }
    if (kw.includes('no code web scraper for')) {
        platform = kw.replace('no code web scraper for', '').trim();
        if(lang==='es') return [`web scraper sin codigo para ${platform}`, `scraper sin programar para ${platform}`, `extraer ${platform} sin codigo`];
        if(lang==='de') return [`no code web scraper für ${platform}`, `scraper ohne programmieren für ${platform}`, `${platform} ohne code scrapen`];
        if(lang==='fr') return [`web scraper sans code pour ${platform}`, `scraper sans coder pour ${platform}`, `extraire ${platform} sans code`];
        if(lang==='ja') return [`ノーコード ${platform} スクレイピング`, `プログラミング不要 ${platform} 抽出`, `コードなし ${platform} スクレイパー`];
        if(lang==='it') return [`web scraper senza codice per ${platform}`, `scraper senza programmazione per ${platform}`, `estrarre ${platform} senza codice`];
        if(lang==='ar') return [`استخراج ويب بدون كود لـ ${platform}`, `سحب ${platform} بدون برمجة`, `أداة ${platform} بدون كود`];
        if(lang==='sv') return [`no-code webbskrapa för ${platform}`, `skrapa utan kod för ${platform}`, `extrahera ${platform} utan kod`];
        if(lang==='fi') return [`kooditon web scraper ${platform}`, `tiedonkeruu ilman koodia ${platform}`, `no-code ${platform} scraper`];
        if(lang==='ko') return [`노코드 ${platform} 웹 스크래퍼`, `코딩 없는 ${platform} 추출`, `코드 없이 ${platform} 스크래핑`];
        if(lang==='ru') return [`парсер без кода для ${platform}`, `скрапер без программирования для ${platform}`, `сбор ${platform} без кода`];
        if(lang==='hi') return [`बिना कोडिंग के ${platform} वेब स्क्रैपर`, `नो-कोड ${platform} स्क्रैपर`, `बिना कोड के ${platform} निकालें`];
    }
    if (kw.includes('how to scrape') && kw.includes('without coding')) {
        platform = kw.replace('how to scrape', '').replace('without coding', '').trim();
        if(lang==='es') return [`como extraer datos de ${platform} sin programar`, `extraer ${platform} sin saber codigo`, `guia ${platform} sin codigo`];
        if(lang==='de') return [`${platform} scrapen ohne programmieren`, `wie man ${platform} ohne code scrapt`, `${platform} anleitung ohne code`];
        if(lang==='fr') return [`comment scraper ${platform} sans coder`, `extraire ${platform} sans programmation`, `tuto ${platform} sans code`];
        if(lang==='ja') return [`${platform} スクレイピング ノーコード`, `コードなしで ${platform} をスクレイピングする方法`, `プログラミングなし ${platform} 抽出`];
        if(lang==='it') return [`come estrarre dati da ${platform} senza codice`, `estrarre ${platform} senza saper programmare`, `guida ${platform} senza codice`];
        if(lang==='ar') return [`كيفية استخراج بيانات ${platform} بدون برمجة`, `استخراج ${platform} بدون كود`, `طريقة سحب ${platform} بدون برمجة`];
        if(lang==='sv') return [`hur man skrapar ${platform} utan kodning`, `skrapa ${platform} utan att programmera`, `guide ${platform} utan kod`];
        if(lang==='fi') return [`kuinka kerätä tietoa ${platform} ilman koodia`, `kerää ${platform} ohjelmoimatta`, `opas ${platform} ilman koodia`];
        if(lang==='ko') return [`코딩 없이 ${platform} 스크래핑하는 방법`, `프로그래밍 없이 ${platform} 추출하기`, `노코드 ${platform} 가이드`];
        if(lang==='ru') return [`как парсить ${platform} без кода`, `парсинг ${platform} без программирования`, `руководство ${platform} без кода`];
        if(lang==='hi') return [`बिना कोडिंग के ${platform} से डेटा कैसे निकालें`, `बिना प्रोग्रामिंग ${platform} स्क्रैप करें`, `नो-कोड ${platform} गाइड`];
    }
    if (kw.includes('guide to extracting data from')) {
        platform = kw.replace('guide to extracting data from', '').trim();
        if(lang==='es') return [`guia para extraer datos de ${platform}`, `tutorial para extraer ${platform}`, `como descargar datos de ${platform}`];
        if(lang==='de') return [`anleitung zum daten auslesen von ${platform}`, `tutorial ${platform} daten extrahieren`, `wie man daten von ${platform} lädt`];
        if(lang==='fr') return [`guide pour extraire des donnees de ${platform}`, `tutoriel extraction ${platform}`, `comment telecharger donnees ${platform}`];
        if(lang==='ja') return [`${platform} データ抽出 ガイド`, `${platform} データ収集 チュートリアル`, `${platform} データダウンロード 方法`];
        if(lang==='it') return [`guida all'estrazione dati da ${platform}`, `tutorial estrazione ${platform}`, `come scaricare dati da ${platform}`];
        if(lang==='ar') return [`دليل استخراج البيانات من ${platform}`, `درس تعليمي لاستخراج ${platform}`, `كيفية تنزيل بيانات ${platform}`];
        if(lang==='sv') return [`guide för att extrahera data från ${platform}`, `tutorial för att skrapa ${platform}`, `hur man laddar ner ${platform} data`];
        if(lang==='fi') return [`opas tiedonkeruuseen ${platform}`, `tutoriaali ${platform} tietojen keräämiseen`, `kuinka ladata dataa ${platform}`];
        if(lang==='ko') return [`${platform} 데이터 추출 가이드`, `${platform} 데이터 수집 튜토리얼`, `${platform} 데이터 다운로드 방법`];
        if(lang==='ru') return [`руководство по извлечению данных с ${platform}`, `туториал по парсингу ${platform}`, `как скачать данные с ${platform}`];
        if(lang==='hi') return [`${platform} से डेटा निकालने की गाइड`, `${platform} डेटा ट्यूटोरियल`, `${platform} डेटा कैसे डाउनलोड करें`];
    }
    if (kw.includes('alternative') && !kw.includes('free')) {
        platform = kw.replace('alternative', '').trim();
        if(lang==='es') return [`alternativa a ${platform}`, `mejor que ${platform}`, `herramientas como ${platform}`];
        if(lang==='de') return [`${platform} alternative`, `besser als ${platform}`, `tools wie ${platform}`];
        if(lang==='fr') return [`alternative a ${platform}`, `meilleur que ${platform}`, `outils comme ${platform}`];
        if(lang==='ja') return [`${platform} 代替`, `${platform} より優れたツール`, `${platform} に似たツール`];
        if(lang==='it') return [`alternativa a ${platform}`, `migliore di ${platform}`, `strumenti come ${platform}`];
        if(lang==='ar') return [`بديل ${platform}`, `أفضل من ${platform}`, `أدوات مثل ${platform}`];
        if(lang==='sv') return [`${platform} alternativ`, `bättre än ${platform}`, `verktyg som ${platform}`];
        if(lang==='fi') return [`${platform} vaihtoehto`, `parempi kuin ${platform}`, `työkalut kuten ${platform}`];
        if(lang==='ko') return [`${platform} 대안`, `${platform} 보다 나은 툴`, `${platform} 같은 도구`];
        if(lang==='ru') return [`альтернатива ${platform}`, `лучше чем ${platform}`, `инструменты как ${platform}`];
        if(lang==='hi') return [`${platform} का विकल्प`, `${platform} से बेहतर`, `${platform} जैसे टूल`];
    }
    
    // Fallback dictionary for specific generic terms
    const dict = {
        'es': { 'leads': 'leads', 'emails': 'correos', 'product prices': 'precios', 'reviews': 'reseñas' },
        'de': { 'leads': 'leads', 'emails': 'emails', 'product prices': 'preise', 'reviews': 'bewertungen' },
        'fr': { 'leads': 'leads', 'emails': 'emails', 'product prices': 'prix', 'reviews': 'avis' },
        'ja': { 'leads': '見込み客', 'emails': 'メールアドレス', 'product prices': '価格', 'reviews': 'レビュー' }
    };

    return [kw + ` ${lang}`]; // Safe fallback
}

function titleCase(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

englishMetadata.forEach(item => {
    let baseKw = item.keyword.toLowerCase();
    let platform = "websites";
    let dataType = "data";

    if (baseKw.includes('data scraper')) {
        platform = baseKw.replace('data scraper', '').trim();
        dataType = "data";
    } else if (baseKw.includes('scrape') && baseKw.includes('for leads')) {
        platform = baseKw.replace('scrape', '').replace('for leads', '').trim();
        dataType = "leads";
    } else if (baseKw.includes('free web scraper for')) {
        platform = baseKw.replace('free web scraper for', '').trim();
        dataType = "data";
    } else if (baseKw.includes('no code web scraper for')) {
        platform = baseKw.replace('no code web scraper for', '').trim();
        dataType = "data";
    } else if (baseKw.includes('how to scrape') && baseKw.includes('without coding')) {
        platform = baseKw.replace('how to scrape', '').replace('without coding', '').trim();
        dataType = "data";
    } else if (baseKw.includes('guide to extracting data from')) {
        platform = baseKw.replace('guide to extracting data from', '').trim();
        dataType = "data";
    } else if (baseKw.includes('alternative')) {
        platform = baseKw.replace('alternative', '').replace('free', '').trim();
        dataType = "data";
    }
    if (!platform) platform = "websites";

    locales.forEach(lang => {
        let tks = translateKeyword(item.keyword, lang);
        if (!Array.isArray(tks)) tks = [tks];

        tks.forEach(tk => {
            tk = tk.replace('  ', ' ');
            // Basic capitalizing
            let title = ""; let h1 = ""; let meta = "";
            
            if (lang === 'es') {
                title = `${titleCase(tk)} | Sin Código`;
                h1 = `Potente ${titleCase(tk)}`;
                meta = `Extrae datos fácilmente. Usa Workfern, la herramienta gratuita de IA para obtener ${tk} al instante en CSV.`;
            } else if (lang === 'de') {
                title = `${titleCase(tk)} | Ohne Code`;
                h1 = `Leistungsstarker ${titleCase(tk)}`;
                meta = `Daten einfach auslesen. Nutzen Sie Workfern, das kostenlose KI-Tool für ${tk} direkt in CSV.`;
            } else if (lang === 'fr') {
                title = `${titleCase(tk)} | Sans Code`;
                h1 = `Le Meilleur ${titleCase(tk)}`;
                meta = `Extrayez des données facilement. Utilisez Workfern, l'outil IA gratuit pour ${tk} instantanément en CSV.`;
            } else if (lang === 'ja') {
                title = `${tk} | ノーコード`;
                h1 = `強力な ${tk}`;
                meta = `データ抽出をノーコードで簡単に。Workfernは、データをCSVに即座に出力する無料のAIスクレイピングツールです。`;
            } else if (lang === 'it') {
                title = `${titleCase(tk)} | Senza Codice`;
                h1 = `Potente ${titleCase(tk)}`;
                meta = `Estrai dati facilmente. Usa Workfern, lo strumento IA gratuito per ottenere ${tk} istantaneamente in CSV.`;
            } else if (lang === 'ar') {
                title = `${tk} | بدون كود`;
                h1 = `أداة قوية لـ ${tk}`;
                meta = `استخرج البيانات بسهولة. استخدم Workfern، أداة الذكاء الاصطناعي المجانية للحصول على ${tk} فورًا في CSV.`;
            } else if (lang === 'sv') {
                title = `${titleCase(tk)} | Utan Kod`;
                h1 = `Kraftfull ${titleCase(tk)}`;
                meta = `Extrahera data enkelt. Använd Workfern, det kostnadsfria AI-verktyget för ${tk} direkt till CSV.`;
            } else if (lang === 'fi') {
                title = `${titleCase(tk)} | Ilman Koodia`;
                h1 = `Tehokas ${titleCase(tk)}`;
                meta = `Kerää tietoa helposti. Käytä Workferniä, ilmaista tekoälytyökalua ${tk} suoraan CSV-muodossa.`;
            } else if (lang === 'ko') {
                title = `${tk} | 노코드`;
                h1 = `강력한 ${tk}`;
                meta = `쉽게 데이터를 추출하세요. 무료 AI 도구 Workfern을 사용하여 즉시 CSV로 ${tk}하세요.`;
            } else if (lang === 'ru') {
                title = `${titleCase(tk)} | Без Кода`;
                h1 = `Мощный ${titleCase(tk)}`;
                meta = `Легко извлекайте данные. Используйте Workfern, бесплатный ИИ-инструмент для мгновенного получения ${tk} в CSV.`;
            } else if (lang === 'hi') {
                title = `${tk} | बिना कोड के`;
                h1 = `शक्तिशाली ${tk}`;
                meta = `आसानी से डेटा निकालें। CSV में तुरंत ${tk} प्राप्त करने के लिए मुफ़्त AI टूल Workfern का उपयोग करें。`;
            }

            let slug = tk.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, '-').replace(/^-|-$/g, '');

            localizedData[lang].push({
                keyword: tk,
                slug: slug,
                title: title.substring(0, 60),
                meta_description: meta.substring(0, 155),
                h1: h1,
                page_type: item.page_type,
                platform: titleCase(platform),
                data_type: dataType
            });
        });
    });
});

fs.writeFileSync('D:\\360\\git2\\workfernpage\\localized_seo_all.json', JSON.stringify(localizedData, null, 2), 'utf8');
console.log('Successfully generated localized_seo_all.json');
