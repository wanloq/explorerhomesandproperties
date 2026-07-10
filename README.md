# Explorer Homes & Properties — Website Redesign

A premium, mobile-first redesign of explorerhomesandproperties.com. Built with
semantic HTML5, Tailwind CSS and vanilla JavaScript (ES6+) — no frameworks,
no build step required to run it.

---

## Quick start

No installation needed. This is a static site.

```bash
# Option A — just open it
open index.html

# Option B — serve it locally (recommended, avoids any file:// quirks)
npm run dev
# or
python3 -m http.server 8000
```

Then visit the local URL printed in your terminal.

---

## Project structure

```
explorer-homes/
│
├── index.html                   Home
├── about.html                   About
├── properties.html              All properties (with client-side filtering)
├── property.html                Single property detail page
├── estates.html                 Featured estates
├── investment-guide.html        Investment guide
├── faqs.html                    FAQs
├── blog.html                    Journal (blog listing)
├── article.html                 Single article
├── contact.html                 Contact + inquiry form
├── 404.html                     Custom not-found page
├── privacy.html                 Privacy Policy
├── terms.html                   Terms of Service
│
├── assets/
│   ├── css/input.css           Custom CSS layer (animations, glass, dark mode)
│   ├── js/main.js               All interactive behavior (single file, modular)
│   ├── images/                  Drop optimized local images here if you move off Unsplash
│   ├── icons/                   Spare icon assets
│   └── fonts/                   Reserved for self-hosted fonts (currently using Google Fonts CDN)
│
├── favicon/                     favicon.svg, PNG fallbacks, apple-touch-icon
├── robots.txt
├── sitemap.xml
├── manifest.json
└── README.md
```

---

## Design system

| Token | Value | Usage |
|---|---|---|
| Primary | `#0F3D2E` | Primary buttons, dark sections, headings on dark |
| Secondary | `#14532D` | Hover states, gradients |
| Gold accent | `#D4AF37` | Sparingly — badges, dividers, key highlights only |
| Cream | `#F8F6F2` | Base background |
| Dark | `#111827` | Body copy on light backgrounds |
| Gray | `#6B7280` | Secondary/supporting copy |

- **Headings:** Playfair Display (serif, editorial)
- **Body:** Manrope (sans-serif, highly legible at small sizes)
- Breakpoints designed mobile-first: 375px → 768px → 1024px → 1280px → 1536px

---

## Features implemented

- Sticky glass navbar (transparent over hero imagery, solid + blurred on scroll)
- Accessible mobile menu (focus trap via `inert`, Escape to close, keyboard-navigable)
- Scroll-reveal animations via `IntersectionObserver` (`prefers-reduced-motion` respected throughout)
- Animated statistic counters
- Investment/mortgage calculator with live JavaScript calculations (deposit, monthly instalment, total cost, illustrative ROI)
- Client-side property filter (location, type, budget) on the Properties page
- FAQ accordion, testimonial slider (auto-play, pauses on hover/focus)
- Wishlist ("save property") using `localStorage`
- Dark mode architecture: `<html class="dark">` toggle hook + CSS variables, persisted in `localStorage` (add a `[data-theme-toggle]` button anywhere to expose it in the UI)
- Client-side form validation (contact form, newsletter, quick enquiry) with accessible error messaging
- Back-to-top button, scroll progress bar, magnetic buttons, ripple click effect
- Semantic landmarks, skip-to-content link, visible focus states, alt text on every image, schema.org `RealEstateAgent` markup, Open Graph + Twitter Card tags on every page

---

## Images

All photography is sourced from Unsplash as placeholders (`images.unsplash.com`,
served with `fm=webp` for modern-format delivery). **Before launch:**

1. Replace with licensed or original photography of actual listings.
2. Save final images into `assets/images/` and update the `IMAGES` map if you
   regenerate pages, or update `src` attributes directly in the HTML.
3. Keep `alt` text descriptive and specific (already written per-image — just
   update to match your real photos).

---

## About the Tailwind setup

This build intentionally ships with **zero build step**: Tailwind is loaded
via the CDN Play script (`cdn.tailwindcss.com`) with a small runtime config
(`assets/js/tailwind.config.js`) defining the brand colors and fonts. This
keeps the project "open `index.html` and go."

**For production**, compiling Tailwind properly will meaningfully improve
performance (smaller CSS payload, no runtime JIT compilation in the browser).
To switch to a compiled build:

```bash
npm install -D tailwindcss
npx tailwindcss init
# point content: ["./*.html"] in tailwind.config.js
# use the same color/font tokens from assets/js/tailwind.config.js
npx tailwindcss -i ./assets/css/tailwind-source.css -o ./assets/css/tailwind-built.css --minify
```

Then swap the CDN `<script>` tag for a single `<link rel="stylesheet" href="assets/css/tailwind-built.css">` across all pages.

---

## Performance & Lighthouse notes

- Images use `loading="lazy"` (except the hero's LCP image, which is eager + `fetchpriority="high"`)
- Fonts are loaded via `preconnect` + `display=swap`
- No render-blocking custom JavaScript — `main.js` is loaded with `defer`
- For a Lighthouse score above 95 in Performance specifically, compiling
  Tailwind (see above) and self-hosting/compressing final photography will
  make the biggest difference — the current CDN Tailwind + hot-linked
  Unsplash images are the two remaining "no-build-step" tradeoffs.

---

## Deployment

### GitHub Pages
1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under "Build and deployment", select **Deploy from a branch**, choose
   `main` and the `/ (root)` folder.
4. Your site will be live at `https://<username>.github.io/<repo>/`.
5. Update `sitemap.xml`, `robots.txt` and canonical URLs in each page's
   `<head>` to match your final domain.

### Netlify
1. Drag and drop this folder into the Netlify dashboard ("Deploys" →
   "Drag and drop your site folder"), **or** connect the GitHub repo.
2. Build command: none. Publish directory: `/` (project root).
3. Netlify will assign a `*.netlify.app` URL — attach your custom domain
   under **Domain settings**.

### Vercel
1. Run `npx vercel` from inside this folder, or import the GitHub repo at
   vercel.com/new.
2. Framework preset: **Other** (static site) — no build command needed,
   output directory: `/`.
3. Deploy, then attach your custom domain under **Project → Settings → Domains**.

---

## Before going live — checklist

- [ ] Replace all Unsplash placeholder imagery with licensed/real photography
- [ ] Replace phone numbers, email and WhatsApp number with real contact details
- [ ] Confirm office addresses on the Contact page
- [ ] Wire the contact/newsletter/enquiry forms to a real backend or form service (currently client-side validation only — no submission endpoint)
- [ ] Update `sitemap.xml` and canonical URLs if the final domain differs
- [ ] Run Lighthouse and axe DevTools against the final, hosted version
