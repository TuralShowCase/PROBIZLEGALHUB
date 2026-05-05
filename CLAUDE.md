# PROBİZ LEGAL HUB — Project Guide

**Static marketing website** for an Azerbaijani law firm. No build tool, no framework, no transpilation. Plain HTML5 + CSS3 + vanilla JS. Production: `probizlegal.az`.

---

## Development

```bash
npx serve .          # root-relative paths require a server — double-click won't work
python -m http.server 8080
```

---

## Directory Layout

```
az/                        # Azerbaijani pages (source of truth for HTML structure)
  index.html               → probizlegal.az/az/
  about/index.html         → probizlegal.az/az/about/
  team/index.html
  clients/index.html
  services/
    index.html             → probizlegal.az/az/services/
    korporativ-huquq/index.html
    muqavile-huququ/index.html
    biznes-huququ/index.html
    eqli-mulkiyyet/index.html
    debitor-borclar/index.html
    emek-huququ/index.html
    vekil-xidmeti/index.html
    aile-huququ/index.html
    cinayat-huququ/index.html
    inzibati-huquq/index.html
    dasinmaz-emlak/index.html

en/                        # English pages (same folder structure as az/)
ru/                        # Russian pages (same folder structure as az/)

styles/                    # ALL CSS (root-relative paths used everywhere)
  general.css              # Design tokens, layout, shared components
  faq.css                  # FAQ accordion
  index.css / about.css / services.css / service-detail.css / team.css / clients.css

scripts/                   # ALL JS (root-relative paths used everywhere)
  general.js               # Shared PROBIZ modules
  i18n.js                  # Language engine
  translations.js          # All AZ/EN/RU strings
  index.js / about.js / services.js / service-detail.js / team.js / clients.js

images/                    # Static assets (.avif primary, .png for logo)
index.html                 # Root redirect → /az/
```

**Key rule:** `az/` is the body HTML source of truth. Any body change (new `data-i18n` attribute, structural edit) must be made in `az/` first, then synced to `en/` and `ru/` (same body, different head).

---

## Script & CSS Tags (all pages)

All paths are **root-relative** — works from any folder depth:

```html
<link rel="stylesheet" href="/styles/general.css" />
<link rel="stylesheet" href="/styles/faq.css" />
<link rel="stylesheet" href="/styles/[page].css" />

<script src="/scripts/translations.js" defer></script>
<script src="/scripts/i18n.js" defer></script>
<script src="/scripts/general.js" defer></script>
<script src="/scripts/[page].js" defer></script>
```

---

## JavaScript: PROBIZ Namespace

All JS lives under `window.PROBIZ` as IIFEs exposing `init()`:

```js
PROBIZ.moduleName = (function () {
  const init = () => { ... };
  return { init };
})();
```

**Modules in `scripts/general.js`** (every page):
- `PROBIZ.ui` — navbar scroll, progress bar, mobile WhatsApp CTA
- `PROBIZ.motion` — Lenis smooth scroll (desktop only), GSAP config, magnetic buttons
- `PROBIZ.scrollReveals` — GSAP ScrollTrigger fade-ups
- `PROBIZ.mobileMenu` — offcanvas drill-down nav
- `PROBIZ.faq` — FAQ accordion
- `PROBIZ.i18n.init()` — **called first** in every `DOMContentLoaded`

`scripts/team.js` re-renders cards on `plh:langChange` via `_t()` helper.

---

## CSS Design Tokens (`styles/general.css`)

- `--plh-base`: `#092c3a` (dark navy)
- `--plh-accent`: `#29a9bd` (teal)
- `--plh-footer`: `#061e26`
- Typography: `clamp()` fluid scaling, breakpoints at 992px and 768px

---

## Third-Party Libraries (CDN)

| Library | Version | Purpose |
|---|---|---|
| Bootstrap | 5.3.2 | Grid, utilities |
| GSAP + ScrollTrigger | 3.12.5 | Scroll animations |
| Lenis | 1.0.45 | Smooth scroll (desktop only) |
| Lucide Icons | latest | Icons |
| Bootstrap Icons | 1.11.1 | Supplementary icons |

---

## i18n System

### Engine files
| File | Role |
|---|---|
| `scripts/translations.js` | All AZ/EN/RU strings. Namespaces: `nav.*`, `footer.*`, `common.*`, `mobile_cta.*`, `index.*`, `about.*`, `clients.*`, `team.*`, `services.*`, `service_detail.*`, `muqavile.*`, `korporativ.*`, `biznes.*`, `eqli.*`, `debitor.*`, `emek.*`, `vekil.*`, `aile.*`, `cinayat.*`, `inzibati.*`, `dasinmaz.*` |
| `scripts/i18n.js` | `PROBIZ.i18n.init()`, `setLang(lang)`, `getLang()`. Dispatches `plh:langChange` CustomEvent. |

### HTML attributes
- `data-i18n="key"` → sets `element.textContent`
- `data-i18n-html="key"` → sets `element.innerHTML` (for keys with `<strong>` etc.)
- `data-i18n-aria="key"` → sets `aria-label`

### Icon + text elements — always wrap text in `<span>`
```html
<i class="bi bi-telephone-fill me-2"></i>
<span data-i18n="footer.call_btn">Zəng Edin</span>
```
Never put `data-i18n` on a parent that also contains an `<i>` — `textContent` wipes the icon.

### Translation status
- **Nav, footer, mobile CTA, FAQ questions, h2 headings, sidebar** — fully translated on all 16 pages ✓
- **Body `<p>` paragraphs, `<li>` items, FAQ answers** — NOT yet tagged with `data-i18n` (deferred)

### Remaining i18n work (priority order)
1. **FAQ answers** — add `data-i18n` to each `<p>` inside `.plh-faq-answer-inner`, add keys to `translations.js` for AZ/EN/RU
2. **List items** — `<ul>/<li>` with `<strong>` need `data-i18n-html`. Keys: `korporativ.li1_1` etc.
3. **Body paragraphs** — ~30 explanatory `<p>` tags. Use professional legal translation.

---

## Multilingual URL Structure

| Language | Base path | Example |
|---|---|---|
| Azerbaijani | `/az/` | `probizlegal.az/az/services/korporativ-huquq/` |
| English | `/en/` | `probizlegal.az/en/services/korporativ-huquq/` |
| Russian | `/ru/` | `probizlegal.az/ru/services/korporativ-huquq/` |

- `az/`, `en/`, `ru/` HTML files share identical `<body>` — only `<head>` differs per language
- All internal nav links are root-relative (`/az/about/`, `/en/services/korporativ-huquq/`)
- hreflang points to all 3 languages + `x-default` → `/az/`
- `index.html` at root redirects to `/az/`

---

## SEO / Head Standard (every page)

Every page head includes:
- `<title>`, `meta description`, `meta keywords`
- `robots` with `max-snippet:-1, max-image-preview:large, max-video-preview:-1`
- GEO: `geo.region=AZ-BA`, `geo.placename`, `geo.position`, `ICBM`
- Open Graph: `og:locale`, `og:locale:alternate` (en_US + ru_RU), `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:image:alt`, `og:site_name`
- Twitter/X: `twitter:card=summary_large_image`, `twitter:site=@probizlegal`, `twitter:url`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`
- `<link rel="apple-touch-icon">`, `<meta name="theme-color" content="#092c3a">`
- JSON-LD `@graph`: `WebPage` (with `speakable`), `Service`/page-type, `FAQPage`, `BreadcrumbList`
- hreflang for az/en/ru + x-default

**og:image** points to `https://probizlegal.az/images/og-image.jpg` — this file must be created (1200×630px branded banner).

---

## Rules

- Body HTML edits go in `az/` only — sync to `en/`/`ru/` after
- Translation keys never change once set
- Never hardcode visible text in HTML — always `data-i18n`
- JSON-LD strings are out of scope for `data-i18n` (not DOM-accessible)
- Scroll handlers: `requestAnimationFrame` with `ticking` flag
- Event listeners on scroll/resize: `{ passive: true }`
- Lenis disabled on mobile (`window.innerWidth < 992`)
