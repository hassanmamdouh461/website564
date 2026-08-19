# Paccino's Minya — Website

> Single-page site for **باتشينوس Paccino's**, an Italian restaurant & specialty coffee shop in Minya, Egypt. Two branches, founded 2010.

🌐 **Live:** https://pacinos.engaz.tech/ (default: Arabic)
🇬🇧 **English:** https://pacinos.engaz.tech/index.html
🇪🇬 **العربية:** https://pacinos.engaz.tech/ar.html

---

## Stack

- **HTML5** — two standalone pages, no framework
- **Tailwind CSS** — prebuilt into `tailwind.css`, not the CDN (see below)
- **Vanilla JS** — cinematic intro (rAF mask), side drawer, scroll reveal, language redirect
- **GitHub Pages** hosting from the `gh-pages` branch (`main` is kept in sync)
- **Custom domain:** `pacinos.engaz.tech` (see `CNAME`)

## CSS build

The pages used to load `cdn.tailwindcss.com`, which is a **400 KB JIT compiler**
that blocks rendering and regenerates the same stylesheet in every visitor's
browser. It is replaced by a static ~18 KB build containing only the classes the
markup actually uses, plus the `@font-face` rules (see Fonts below).

Rebuild after adding or changing any class in the markup:

```bash
npm install --no-save tailwindcss@3.4.17
./node_modules/.bin/tailwindcss -c tools/tailwind.config.js -i tailwind.src.css -o tailwind.css --minify
node tools/audit-classes.js      # every class must resolve
```

Call the **local binary**, not `npx tailwindcss`. If a global `@tailwindcss/cli`
v4 is installed, npx picks it, and v4 silently ignores this v3-style config — the
build "succeeds" but emits a 6.5 KB file with none of the utilities the markup
needs. `audit-classes.js` is what catches that.

`audit-classes.js` cross-checks every `class="..."` token in both pages against
`tailwind.css` and each page's inline `<style>` block, so a class that silently
stopped being generated fails loudly instead of quietly losing its styling.

Two things matter if you touch this:

- The `<link rel="stylesheet" href="tailwind.css">` must stay **before** each
  page's own `<style>` block. The inline CSS deliberately overrides Tailwind
  (for example `.reveal.visible` vs Tailwind's `.visible`).
- `tailwind.config.js` must keep the same theme tokens the old CDN config
  declared, or the brand colours and fonts shift.

## Fonts

Both fonts are **self-hosted** from `fonts/`. They used to come from
`fonts.googleapis.com`, which is a render-blocking stylesheet on one origin that
then resolves `woff2` files on a *second* origin (`fonts.gstatic.com`) — two
extra connections standing between the visitor and the first paint.

`fonts.css` holds the four `@font-face` rules and is `@import`-ed by
`tailwind.src.css`, so the build inlines it and the whole page needs exactly one
CSS request.

| File | Size | Used for |
|---|---|---|
| `cairo-arabic.woff2` | 30 KB | all Arabic text |
| `cairo-latin.woff2` | 33 KB | latin inside Arabic text (brand name, numbers) |
| `playfair-latin.woff2` | 38 KB | `.font-heading`, e.g. "Paccino's" in the h1 |
| `playfair-latin-italic.woff2` | 21 KB | the italic testimonial blockquotes |

Both are variable fonts, so one file covers the whole weight range and the
`@font-face` rules declare a span (`font-weight: 300 700`) instead of a single
value. The `unicode-range` strings are copied verbatim from Google's CSS, so a
browser still only downloads the Arabic file when Arabic text is present. The
cyrillic, vietnamese and latin-ext subsets Google also serves are dropped —
nothing on either page uses them.

`index.html` preloads the two latin faces; `ar.html` also preloads
`cairo-arabic.woff2`, since its `h1` renders "باتشينوس Paccino's" and genuinely
needs all three before the first paint.

Both families are OFL-licensed, so self-hosting is permitted.

To replace a font file: fetch Google's CSS with a modern browser User-Agent (the
response varies by UA), take the `woff2` URLs from it, and keep the
`unicode-range` strings in `fonts.css` in sync with what that CSS declares. Then
rebuild `tailwind.css` — the `@font-face` rules live inside it.

## File structure

```
website564/
├── index.html                    ← English version
├── ar.html                       ← Arabic version (default landing)
├── 404.html                      ← Branded not-found page
├── tailwind.src.css              ← Build input (@tailwind directives + fonts)
├── fonts.css                     ← @font-face rules, inlined into tailwind.css
├── fonts/                        ← Self-hosted woff2 (Cairo + Playfair Display)
├── tailwind.css                  ← Built stylesheet, SERVED — commit it
├── .nojekyll                     ← Required, or .well-known/ is never published
├── .well-known/
│   └── security.txt              ← RFC 9116 — must live here, not at the root
├── tools/                        ← Build-time only, never served as content
│   ├── validate.js               ← Pre-commit checker
│   ├── audit-classes.js          ← Verifies every markup class exists in the CSS
│   ├── tailwind.config.js        ← Build config (theme tokens)
│   ├── paccinos-data.json        ← Source-of-truth business data
│   ├── apply-colors.js           ← One-off historical migration script
│   ├── server.js                 ← Local preview server
│   └── setup-domain.ps1          ← One-off DNS helper
├── .gitignore                    ← Excludes node_modules (installed on demand)
├── robots.txt                    ← Crawler rules + sitemap pointer
├── sitemap.xml                   ← Both language URLs with hreflang
├── manifest.json                 ← PWA manifest (install + theme color)
├── browserconfig.xml             ← Windows tile colors
├── humans.txt                    ← Credits / trust signal
├── favicon.svg                   ← Brand "P" badge
├── CNAME                         ← Custom domain
├── google4a500f27301bceae.html   ← Search Console verification — DO NOT DELETE
├── googlec1c84b6ac35a711a.html   ← Search Console verification — DO NOT DELETE
├── BingSiteAuth.xml              ← Bing Webmaster verification
└── images/                       ← All photos
```

## Brand tokens

Do not change these without asking. They are referenced from Tailwind config,
CSS variables, and inline `style` attributes throughout both pages.

| Token | Hex | Used for |
|---|---|---|
| burgundy | `#5C1425` | headings, borders, accents |
| espresso | `#3D0A17` | dark sections, buttons, body text |
| cream | `#FAF6F0` | light section backgrounds, cards |
| caramel | `#EAD5C1` | stars, hover states, links |
| intro red | `#6d142a` | cinematic intro backdrop only |

---

## Canonical NAP — use this exact text everywhere

Local search works by matching the **same** Name / Address / Phone across many
independent sources. Every character below is what appears in the pages, in the
JSON-LD. Copy it verbatim into any directory
listing; do not reword, abbreviate, or reformat the phone numbers.

```
Name:      Paccino's
Also:      باتشينوس  ·  Paccino's Coffee & Food Experience

Address 1: Taha Hussein St (in front of Wabour El-Nour), Minya, Egypt — 61661
Address 2: Corner Plaza Mall, 3rd District, New Minya, Egypt

Phone:     +20 12 28784569
Delivery:  01007811378  (Taha Hussein branch)
           01033777117  (New Minya branch)

Email:     paccinoscafe@gmail.com
WhatsApp:  https://wa.me/201228784569
Website:   https://pacinos.engaz.tech
Instagram: https://instagram.com/paccino_s
Facebook:  https://facebook.com/PaccinosCoffee
Hours:     Daily 09:00 – 23:59
Founded:   2010
Cuisine:   Italian · Coffee · Egyptian
```

Arabic form (for Arabic-language directories):

```
الاسم:     باتشينوس Paccino's
العنوان 1: شارع طه حسين (أمام وابور النور)، المنيا — 61661
العنوان 2: مول كورنر بلازا، الحي الثالث، المنيا الجديدة
```

---

## The Aug 17 Google Business Profile request — how to avoid it

**Situation.** A claim request was filed for the Paccino's listing on Google
Business Profile. The listing is currently attached to another Google account
(`ea…@gmail.com`). Google's rule is that if the current owner does not respond
within seven days, the request is **auto-approved** — which was set to happen on
**Aug 17, 2026**. Auto-approval transfers the listing and notifies the previous
owner by email, which is exactly the outcome we wanted to avoid.

**What "avoiding it" means.** There is no way to keep a pending request open
indefinitely and no way to take over the listing silently. The two clean options
are:

1. **Cancel the request before it resolves.** Sign in at
   https://business.google.com/ with the account that filed the claim →
   **Businesses** → find the pending Paccino's listing → **Cancel request**
   (may appear as *Withdraw request* or *Remove from account*). Once cancelled,
   nothing transfers and no notification is sent to the current owner.
   This is the only action that actually stops the clock.
2. **Let it lapse and stop using that path.** If the request is already past its
   deadline and was auto-approved, the transfer is done and cannot be undone from
   our side. If it was rejected, do not re-file — repeated claim attempts on the
   same listing are rate-limited and get flagged.

**After cancelling, do not re-file a claim.** Everything below achieves local
visibility without touching Google Business Profile at all.

---

## Local visibility without a Google Business Profile

Being findable locally is not one switch — it is the sum of many independent
sources saying the same thing about the same business. GBP is the loudest single
source, but the other sources still work on their own, and Google reads several
of them directly.

### What is already shipped in this repo

| Signal | Where | What it does |
|---|---|---|
| `Restaurant` + `LocalBusiness` JSON-LD | both pages | Tells Google the name, both addresses, geo coordinates, phone, hours, cuisine, price range — the same fields a GBP listing would supply |
| `Review` + `aggregateRating` JSON-LD | both pages | Star rating eligibility in **organic** results, independent of GBP |
| `FAQPage` JSON-LD | both pages | Expandable Q&A in results, including "how do I leave a review" |
| `hasMap` on the Restaurant node | both pages | Points Google at the two Maps place URLs |
| `sameAs` on the Restaurant node | both pages | Links the domain to Facebook, Instagram, WhatsApp |
| Contact section | both pages | Human-readable NAP for both branches + an embedded map each |
| `sitemap.xml` + `robots.txt` | root | Discovery, already accepted in Search Console |

The `Review` markup is intentionally limited to the three real testimonials shown
on the page. Google requires that reviewer-visible content match the markup, so
**do not add a review to the JSON-LD that is not also rendered in the
`#reviews` section.** Inflating `reviewCount` or adding invented authors is the
fastest way to lose the rich result entirely.

### Manual citation checklist — do these in order

Each entry below is a separate business listing you create yourself, using the
canonical NAP above. Highest impact first.

1. **Bing Places** — https://www.bingplaces.com/ · free, no owner approval needed,
   feeds Bing Maps, DuckDuckGo, and some Apple/Alexa results.
2. **Apple Business Connect** — https://businessconnect.apple.com/ · covers Apple
   Maps and Siri for every iPhone user in Minya.
3. **OpenStreetMap** — https://www.openstreetmap.org/ · add both branches as
   `amenity=cafe` / `amenity=restaurant` nodes with `name`, `phone`, `website`,
   `opening_hours`. Feeds a long tail of apps and aggregators that Google crawls.
4. **Facebook page** — already live. Keep the **About → address and hours**
   fields identical to the canonical NAP; Google indexes them.
5. **Instagram bio** — already live. Keep the website link as
   `https://pacinos.engaz.tech`.
6. **Tripadvisor** — https://www.tripadvisor.com/Owners · add the restaurant, then
   collect reviews. Tripadvisor pages rank on their own for "restaurants Minya".
7. **Foursquare** — https://foursquare.com/ · one of the sources Apple and several
   travel apps license.
8. **Talabat / elmenus** — delivery aggregators with strong domain authority in
   Egypt. A listing there ranks for branded searches even without GBP.
9. **Yelp** — https://business.yelp.com/ · low traffic in Egypt but a cheap,
   high-authority citation.
10. **Yellow Pages Egypt** — https://yellowpages.com.eg/ · local directory, still
    crawled.

After each listing goes live, add its public URL to the `sameAs` array in the
`Restaurant` JSON-LD in **both** `index.html` and `ar.html`. That is what closes
the loop: the directory points at the site, and the site points back at the
directory, so Google can treat them as the same entity.

### Driving reviews without owning the Maps listing

Anyone can review a place on Google Maps — ownership only controls *replying* and
*editing the profile*. So reviews still accumulate on the existing listing and
still feed the local ranking of that place. Share the branch Maps link over
WhatsApp after orders:

```
https://www.google.com/maps/search/?api=1&query=Paccino%27s+Taha+Hussein+St+Minya+Egypt
```

### What is genuinely lost without GBP

Be realistic about this: no owner replies to reviews, no posts/offers, no photo
curation, no Maps insights, and no editing wrong hours if someone submits them.
Everything above recovers discoverability, not control.

---

## Images and performance

Every `<img>` on both pages serves a **WebP** file and carries intrinsic
`width`/`height`, a `srcset`/`sizes` pair, descriptive `alt` text naming the
brand and the city, and `decoding="async"`. The hero is `fetchpriority="high"`
and never lazy-loaded (it is the LCP element); everything else is
`loading="lazy"`.

Each photo ships at several widths so a phone does not download a 900px file to
paint it at 180px: gallery and signature cards at 400/600/900, the hero at
500/600/800/1200/1600. The hero's `<link rel="preload">` carries a matching
`imagesrcset`/`imagesizes` so the preload and the `srcset` pick the same file
instead of fetching two copies.

The hero is encoded at quality 70 rather than 80. It sits behind a 70% opaque
espresso overlay, so the extra fidelity is not visible, and the 800w step drops
from 110 KB to 83 KB.

The intro logo is delivered through `image-set()` so WebP-capable browsers get
`logo.webp` (23 KB) and anything older falls back to `logo.png` (203 KB).

First-paint payload on a phone is now roughly **18 KB CSS + 101 KB fonts + 83 KB
hero ≈ 201 KB**, against a 398 KB render-blocking CDN script plus a 297 KB hero
and cross-origin fonts before this work.

`og:image`, `twitter:image`, and the JSON-LD `image` arrays deliberately still
point at the **JPEG** — some social scrapers do not handle WebP.

### Regenerating the WebP files

The `.jpg` and `.png` originals stay in the repo as the source of truth. `sharp`
is not committed; install it on demand:

```bash
npm install --no-save sharp@0.34.2
node -e "
const sharp=require('sharp');
const photos=['paccino-4','paccino-5','paccino-6','paccino-7','paccino-8','paccino-9','paccino-13','paccino-14','paccino-15'];
for (const n of photos) {
  sharp('images/'+n+'.jpg').webp({quality:80,effort:6}).toFile('images/'+n+'.webp');
  for (const w of [400,600])
    sharp('images/'+n+'.jpg').resize(w,w).webp({quality:78,effort:6}).toFile('images/'+n+'-'+w+'.webp');
}
// Hero: quality 70, it is behind a 70% overlay
sharp('images/paccino-12.jpg').webp({quality:70,effort:6}).toFile('images/paccino-12.webp');
for (const w of [500,600,800,1200])
  sharp('images/paccino-12.jpg').resize(w,w).webp({quality:70,effort:6}).toFile('images/paccino-12-'+w+'.webp');
sharp('images/logo.png').webp({quality:88,effort:6}).toFile('images/logo.webp');
"
```

Keep the pixel dimensions unchanged — the `width`/`height` attributes in the HTML
are hardcoded to the originals, and changing one without the other reintroduces
layout shift.

The oversized `paccino-*.png` originals (~2.4 MB each, 23 MB total) are not
referenced by either page. They are kept as archival masters only.

---

## Hosting limits worth knowing

GitHub Pages does not let you set HTTP response headers, so the site has **no
HSTS, CSP, X-Frame-Options, X-Content-Type-Options or Referrer-Policy**, and
every asset is served with a fixed `Cache-Control: max-age=600` — fonts and
images included, even though they never change. Brotli is unavailable too; only
gzip is negotiated.

A `public/_headers` file used to sit in the repo declaring all of these. It was
dead weight: `_headers` is a Netlify/Cloudflare Pages convention that GitHub
Pages ignores entirely, and the file was not even published. It has been removed
so nobody mistakes it for active configuration.

Putting Cloudflare in front of the domain is the single change that fixes all
three (headers via Transform Rules, cache lifetimes via Page Rules, Brotli at
the edge). Until then, the meta-equivalents in each page's `<head>` cover what
can be covered — note that `X-Frame-Options` and `HSTS` cannot be set via
`<meta>` at all.

`.nojekyll` must stay in the repo root. Without it GitHub runs Jekyll, which
skips every path beginning with a dot — `/.well-known/security.txt` would 404.

## Search Console / Bing status

- Google Search Console: verified via HTML file. **Never delete or rename these
  files** — removing one un-verifies that property.
  - `google4a500f27301bceae.html` — first property
  - `googlec1c84b6ac35a711a.html` — second property
  Sitemap `https://pacinos.engaz.tech/sitemap.xml` submitted and accepted.
- Bing Webmaster Tools: verified via `BingSiteAuth.xml`.
- After any structured-data change, re-test both URLs at
  https://search.google.com/test/rich-results and request re-indexing in
  Search Console → URL Inspection.

---

## Before every commit

```bash
node tools/validate.js
node tools/audit-classes.js
```

`validate.js` parses every inline `<script>` with `new Function()`, every
`application/ld+json` block with `JSON.parse()`, checks `<section>` tag balance in
both pages, and validates `manifest.json` and `tools/paccinos-data.json`.
`audit-classes.js` confirms every markup class is still covered by `tailwind.css`
or the page's inline CSS. Non-zero exit from either means do not commit.

## Deploying

`gh-pages` is the branch GitHub Pages serves. `main` is force-synced to match it
so both branches always show the same tree.

```bash
node tools/validate.js                       # must pass first
node tools/audit-classes.js                  # and this

git add -A
git commit -m "Your message"

# Plain `git push` fails here with a /dev/tty credential prompt.
# The cached credential helper is the only reliable form:
git -c "credential.helper=cache --timeout=300" push origin gh-pages --force

# Keep main identical to gh-pages
git checkout main
git reset --hard gh-pages
git -c "credential.helper=cache --timeout=300" push origin main --force
git checkout gh-pages
```

⚠️ `git checkout` and `git reset --hard` **discard uncommitted work**. Always
`add` + `commit` before switching branches.

The live site updates 30–90 seconds after the push. Verify with:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://pacinos.engaz.tech/
curl -s -o /dev/null -w "%{http_code}\n" https://pacinos.engaz.tech/ar.html
```

## Language switch

`localStorage.pac_lang`:

- not set, or any value other than `'en'` → redirect to `ar.html`
- `'en'` → stay on `index.html`

The redirect runs in the `<head>` of `index.html` before paint, and preserves
`location.hash` so deep links to sections survive it.

## Notes for future edits

- `overflow-x: clip` belongs on `body` only. Putting it on `html` makes the news
  marquee glitch against the navbar's `backdrop-filter`.
- The marquee pauses on hover only inside `@media (hover: hover)`, so touch
  devices never get a stuck ticker.
- The reviews section is three fixed cards by deliberate choice. A carousel and a
  marquee were both tried and rejected — do not reintroduce them.

---

## Contact

- **Email:** paccinoscafe@gmail.com
- **WhatsApp:** https://wa.me/201228784569
- **Instagram:** https://instagram.com/paccino_s
- **Facebook:** https://facebook.com/PaccinosCoffee
