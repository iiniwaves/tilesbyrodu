# Tiles by Rudu — Website

A 5-page, mobile-responsive marketing site for a tile & building finishes business. Plain HTML, CSS and vanilla JS — no build step, no framework. Products are now data-driven: all product content lives in one JSON file and is rendered dynamically on the homepage, the product gallery, and each product detail page.

## Files

```
index.html          Home page — featured products render dynamically
about.html          Company story, mission/vision, values, timeline
products.html       Full product gallery — dynamic grid + category filtering
product.html        Single reusable product detail template (reads ?product=<id> from the URL)
contact.html        Contact info, form, map placeholder
privacy-policy.html Privacy policy (template — see note below)
cookie-settings.html Standalone page for managing cookie preferences
css/styles.css      All styling (colors, type, layout, components, animations)
data/products.json  Every product's content — the single source of truth
js/product-api.js   Fetches and queries data/products.json (getProducts, getProduct, getFeaturedProducts, getProductsByCategory)
js/components.js    Shared HTML builders: createProductCard, renderSkeletonCards
js/home.js          Renders the homepage's featured-products grid
js/products.js      Renders the product gallery grid + wires up the filter pills
js/product.js       Renders a single product's full detail page + its related products
js/site-preferences.js Cookie consent engine: first-visit banner, "Manage Preferences" modal, and the logic behind cookie-settings.html
js/script.js         Site-wide behaviour: mobile nav, contact form, scroll-reveal animation, active nav link
assets/images/      Placeholder images — swap these out with real photos
```

## Important: this needs a local server, not a plain double-click

Because pages now `fetch()` `data/products.json`, opening `index.html` directly from disk (a `file://` URL) will fail in most browsers — they block that fetch for security reasons. **Always use Live Server** (right-click `index.html` in VS Code → "Open with Live Server") or any other local server. This was fine before when everything was hardcoded HTML, but the dynamic system needs a real `http://` address to fetch from.

## How the dynamic system works

1. **`data/products.json`** holds every product as an object: `id`, `category`, `name`, descriptions, `images[]`, `chips[]`, `features[]`, `specifications[]`, and a `related[]` array of other product ids.
2. **`js/product-api.js`** fetches that file once (cached after the first call) and exposes simple lookup functions.
3. **`js/components.js`** turns a product object into the HTML for a card (`createProductCard`) — this is the one place that defines what a product card looks like, used identically on the homepage, the gallery, and the related-products section.
4. Each page's own script (`home.js`, `products.js`, `product.js`) fetches what it needs and drops the rendered HTML into an empty container `<div>` already sitting in that page's HTML (`#featured-products-grid`, `#products-grid`, `#related-products`).

### Adding a new product
Just add a new object to the `products` array in `data/products.json` and give it a unique `id`. It will automatically show up in `products.html`, and in any other product's `related` list that references its id. No HTML editing required.

### Linking to a specific product
Product links follow the pattern `product.html?product=matte-grey-floor-tile` — `product.js` reads that `id` from the URL and loads the matching record.

## Cookies & Privacy Policy

- **The popup**: on a visitor's first visit (no saved preference yet), a banner slides up from the bottom with "Accept All", "Reject Non-Essential", and "Manage Preferences." That last option opens a modal with individual toggles per cookie category. The choice is saved to `localStorage` (key `tbr-cookie-consent`) and the banner won't show again unless that's cleared.
- **Reopening it anytime**: the "Cookie Settings" link in every page's footer reopens the same modal. If JavaScript somehow fails to load, that same link still works as a plain link to the full `cookie-settings.html` page instead — a safety net, not the primary path.
- **The dedicated page**: `cookie-settings.html` shows the same toggles inline on their own page (useful if you want to link to cookie settings from elsewhere, like the privacy policy text).
- **One shared engine**: all three (banner, modal, standalone page) are powered by the same `js/site-preferences.js` — the cookie categories, storage logic, and toggle rendering are defined once. To add a cookie category, edit the `CATEGORIES` array at the top of that file; it'll automatically appear in the banner, modal, and standalone page.
- **Currently three categories**: Strictly Necessary (always on), Analytics, and Marketing. These are scaffolding for when you add real tools (Google Analytics, Meta Pixel, etc.) — right now the site doesn't actually set any analytics or marketing cookies itself, so update the descriptions in `site-preferences.js` and the Privacy Policy once you do.
- **A note on the filename**: the consent engine lives in `js/site-preferences.js` rather than something like `cookie-consent.js`. Ad blockers (uBlock Origin, AdGuard, etc.) ship filter lists that specifically block requests to files named things like `cookie-consent.js` or `cookiebanner.js`, since those names are common across tracking-heavy cookie-banner services. If you ever rename this file back to something with "cookie" or "consent" in it, test with an ad blocker enabled — the script may silently fail to load and the whole popup will stop working with no visible error beyond `net::ERR_BLOCKED_BY_CLIENT` in the console.

**Important — the Privacy Policy is a template, not legal advice.** It covers the standard sections (what's collected, cookies, retention, your rights, contact) with placeholders like `[Company Address]` and `[Effective Date]` for you to fill in. Have it reviewed by a qualified legal professional before publishing, so it accurately reflects what the site actually does and complies with applicable law — Nigeria's NDPA/NDPR, and GDPR if you expect visitors from the EU/UK.

## Things to swap in before launch

1. **WhatsApp number** — currently a placeholder `https://wa.me/2348000000000`, used in static markup (nav, hero, CTA banners, floating button) and generated dynamically inside `createProductCard` and `product.js`. Find-and-replace `2348000000000` across the `.html` and `.js` files with the real number.
2. **Images** — every image in `assets/images/` is a labeled placeholder. Replace each file with a real photo of the same name and matching aspect ratio and the site picks it up automatically — including every image path referenced inside `data/products.json`.
3. **Logo** — `assets/images/logo.png`, used in the header and footer.
4. **Contact details** — email, address and business hours are placeholders in `contact.html` and the footer of every page.
5. **Product content** — edit the text, specs, chips and images per product directly in `data/products.json`.

## Notes on the design

- Palette: lemon-green accent, white, light-gray backgrounds, charcoal text.
- Typeface: Sora throughout, loaded from Google Fonts.
- Signature detail: a thin "grout-line" motif (hairline + diamond joint mark) used as section dividers, and product cards styled like physical tile samples with a spec-label sticker.
- Icons: Lucide, loaded via CDN (`unpkg.com/lucide`), rendered with `lucide.createIcons()`. Social icons (Instagram/Facebook/LinkedIn) are inline SVGs rather than Lucide icons — Lucide's 1.0 release removed all brand/logo icons, so these are hand-coded to avoid breaking again on a future library update.
- Animations: scroll-triggered fade-in on section headers and card grids (staggered so cards don't all pop in at once), a fluid `cubic-bezier` easing curve used across hovers and transitions, a shimmer loading skeleton while dynamic product grids fetch their data, and a smooth crossfade when switching the main image in the product gallery.
