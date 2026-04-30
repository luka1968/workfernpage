# Workfern SEO Builder

A Node.js multilingual programmatic SEO static site generator. Builds 1000+ HTML pages across 5 languages from JSON data files using EJS templates.

## 📁 Project Structure

```
seo-builder/
├── build.js              # Main build script
├── package.json
├── data/
│   ├── keywords.json     # Source keywords (platform, data_type, category)
│   ├── pages.json        # Optional page overrides (slug, page_type)
│   └── i18n.json         # All UI strings for every language
├── templates/
│   └── page.ejs          # EJS HTML template (5 sections)
└── output/               # Generated site (git-ignored)
    ├── en/               # English pages
    ├── es/               # Spanish pages
    ├── de/               # German pages
    ├── fr/               # French pages
    ├── ja/               # Japanese pages
    └── sitemap.xml       # Full multilingual sitemap
```

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd seo-builder
npm install
```

### 2. Run the build
```bash
npm run build
```

### 3. Output
Pages are generated to `output/{lang}/{slug}.html`

---

## 📊 Scaling to 1000+ Pages

To generate 1000+ pages, add more entries to `data/keywords.json`:

```json
[
  {
    "keyword": "Google Maps data scraper",
    "platform": "Google Maps",
    "data_type": "business listings",
    "category": "platform",
    "intent": "high"
  }
]
```

With **30 keywords × 5 languages = 150 pages**.  
With **200 keywords × 5 languages = 1000 pages**.

To reach 1000+ pages, add at least **200 keywords** to `keywords.json`.

---

## 🌍 Adding a New Language

1. Add language code to `LANGS` array in `build.js`:
```js
const LANGS = ['en', 'es', 'de', 'fr', 'ja', 'pt']; // add 'pt' for Portuguese
```

2. Add the translation block to `data/i18n.json`:
```json
"pt": {
  "htmlLang": "pt",
  "nav_cta": "Adicionar ao Chrome — Grátis",
  "btn_cta": "Adicionar ao Chrome — É Grátis",
  ...
}
```

3. Run `npm run build` again.

---

## ⚙️ Customization

| File | Purpose |
|------|---------|
| `data/keywords.json` | Add/edit keywords and platforms |
| `data/i18n.json` | Edit UI text per language |
| `templates/page.ejs` | Edit HTML structure and design |
| `build.js` | Customize title/meta logic, add new sections |

---

## 📦 Deploy to Netlify

After building, deploy the `output/` folder:

```bash
# In your repo root, copy output to public dir
cp -r seo-builder/output/* pages/

# Then git push to trigger Netlify
git add .
git commit -m "feat: regenerate multilingual SEO pages"
git push
```

Or configure Netlify build command:
```
Build command: cd seo-builder && npm install && npm run build
Publish directory: seo-builder/output
```

---

## 📈 SEO Features

Each generated page includes:
- ✅ `<title>` (max 60 chars, localized)
- ✅ `<meta name="description">` (max 155 chars, localized)
- ✅ `<h1>` with keyword
- ✅ `hreflang` alternate tags for all 5 languages
- ✅ `canonical` URL
- ✅ Open Graph tags
- ✅ JSON-LD HowTo structured data (Rich Snippet eligible)
- ✅ GA4 tracking (G-QD5VFXDPCH)
- ✅ Sitemap with 1000+ URLs
