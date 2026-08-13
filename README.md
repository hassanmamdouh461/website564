# Paccino's Minya — Website

> Single-page site for **باتشينوس Paccino's**, an Italian restaurant & specialty coffee shop in Minya, Egypt. Two branches, founded 2010.

🌐 **Live:** https://pacinos.engaz.tech/ (default: Arabic)
🇬🇧 **English:** https://pacinos.engaz.tech/index.html
🇪🇬 **العربية:** https://pacinos.engaz.tech/ar.html

---

## Stack

- **HTML5** (single page each, no framework)
- **Tailwind CSS** via CDN
- **Vanilla JS** (mobile menu, scroll reveal, language redirect)
- **GitHub Pages** for hosting (no backend, no SSR)
- **Custom domain:** `pacinos.engaz.tech`

## File structure

```
website564/
├── index.html              ← English version
├── ar.html                 ← Arabic version (default landing)
├── robots.txt              ← Search engine rules + sitemap pointer
├── sitemap.xml             ← All public URLs with hreflang
├── favicon.svg             ← Brand "P" badge
├── CNAME                   ← Custom domain config
├── paccinos-data.json      ← Source-of-truth business data
├── images/                 ← All photos (optimized JPGs)
└── .well-known/
    └── security.txt        ← RFC 9116 — vulnerability reporting
```

## SEO infrastructure

| File | Purpose |
|---|---|
| `<head>` in both pages | Title, description, keywords, Open Graph, Twitter Cards, hreflang, canonical |
| JSON-LD `<script>` blocks | `Restaurant`, `Menu`, `BreadcrumbList` schema.org data |
| `robots.txt` | Allows all crawlers, points to sitemap |
| `sitemap.xml` | Lists both language versions with hreflang annotations |
| `BingSiteAuth.xml` | Bing Webmaster verification (replace with real token) |
| `google-site-verification.html` | Google Search Console verification placeholder |
| `.well-known/security.txt` | Security researcher contact per RFC 9116 |

---

## Step-by-step: Get "باتشينوس" to rank in Google

### ✅ Step 1 — Technical SEO (DONE in this repo)

- ✅ Title, meta description, keywords in both languages
- ✅ Open Graph + Twitter Card tags
- ✅ Canonical URLs + hreflang annotations
- ✅ JSON-LD structured data: Restaurant + Menu + BreadcrumbList
- ✅ `robots.txt` + `sitemap.xml`
- ✅ Security headers reference (`.well-known/security.txt`)
- ✅ H1 in Arabic page includes Arabic brand

### 📋 Step 2 — Google Search Console (MANUAL)

1. Open https://search.google.com/search-console
2. Click **Add property** → choose **URL prefix**
3. Enter: `https://pacinos.engaz.tech/`
4. Verification method: **HTML file**
5. Google generates a file like `google12a3bc4d5e6f7g8h9.html`
6. **Save that file** in the repo root (or send me the content and I'll create it)
7. Push to gh-pages → Google will verify within 24h
8. After verification → **Sitemaps** → submit `https://pacinos.engaz.tech/sitemap.xml`

**Alternative — DNS verification (faster, fewer steps):**
- Choose **Domain** property type instead of URL prefix
- Google gives a TXT record like `google-site-verification=abc123...`
- In **Cloudflare** → DNS → Records → Add:
  - Type: `TXT`
  - Name: `pacinos` (NOT `@`, because the subdomain is `pacinos.engaz.tech`)
  - Content: the full verification string
  - Proxy: **DNS only** (grey cloud, not orange)
- Wait 5-30 min, click Verify

### 📋 Step 3 — Bing Webmaster Tools (MANUAL)

1. Open https://www.bing.com/webmasters
2. Add site: `https://pacinos.engaz.tech/`
3. Verify with **HTML <meta> tag** (or XML file in `BingSiteAuth.xml`)
4. Submit sitemap

### 📋 Step 4 — Google Business Profile (CRITICAL for local SEO)

This is the **#1 thing** for ranking in local search "باتشينوس المنيا":

1. Open https://business.google.com/
2. Add your business:
   - **Name:** Paccino's (باتشينوس)
   - **Category:** Italian restaurant + Coffee shop
   - **Address:** Taha Hussein St (in front of Wabour El-Nour), Minya
   - **Second branch:** Corner Plaza Mall, New Minya
   - **Phone:** +20 12 28784569
   - **Website:** https://pacinos.engaz.tech
   - **Hours:** 9:00 AM – 12:00 AM daily
3. Verify by phone/postcard
4. Upload high-quality photos of both branches
5. Get customer reviews on Google Maps (encourage via WhatsApp)

### 📋 Step 5 — Off-page SEO (DO MANUALLY)

Ranking in Google depends heavily on **backlinks from other sites**. A few easy wins:

- **Facebook page** (https://www.facebook.com/PaccinosCoffee) — post weekly, link to your site
- **Instagram** (https://www.instagram.com/paccino_s) — link in bio
- **Yellow Pages Egypt** — list your business with the same name/address/phone (NAP consistency)
- **Egyptian food directories** — RestaurantGuru, Zomato, Talabat
- **TripAdvisor** — claim your listing, get reviews
- **Medium / LinkedIn** — write 1-2 articles about Paccino's history (the bio is already in `paccinos-data.json`)

### 📋 Step 6 — Content growth (LONG-TERM)

- **Add an /about page** with the full bio
- **Add /menu page** with the full menu and prices
- **Add a blog** for SEO articles ("Best Italian restaurants in Minya", "What makes Egyptian-style coffee special", etc.)
- **Customer testimonials** with schema.org/Review markup

---

## Cloudflare configuration (optional but recommended)

Currently the site is hosted on GitHub Pages. Cloudflare can add:
- **Free CDN** (faster load for Egyptian users)
- **Free SSL** (already have one, but Cloudflare can add edge security)
- **Bot management** (block bad crawlers)
- **Response headers** (X-Content-Type-Options, Referrer-Policy, etc.)

If the user wants Cloudflare proxy, point `pacinos.engaz.tech` CNAME to `<username>.github.io` and enable orange-cloud proxy. But this is optional — GitHub Pages already serves the site fine.

---

## Deploying changes

```bash
git checkout gh-pages
git add -A
git commit -m "Your message"
git push origin gh-pages
```

The site updates within 30-60 seconds.

## Language switch

`localStorage.pac_lang`:
- Not set (or anything other than 'en') → redirect to `ar.html`
- `'en'` → stay on `index.html`

The redirect script is in the `<head>` of `index.html` (the first script tag). To reset a visitor's language preference, they need to clear site data in their browser.

---

## Contact

- **Email:** paccinoscafe@gmail.com
- **WhatsApp:** +20 12 28784569
- **Instagram:** https://www.instagram.com/paccino_s
- **Facebook:** https://www.facebook.com/PaccinosCoffee
