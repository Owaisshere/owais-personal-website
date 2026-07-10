# Mohammad Owais — Portfolio (Multi-file Structure)

Refactored from a single `index.html` file into a clean, maintainable project.
**Design, layout, copy, and animations are unchanged** — only the code
organization changed.

## Structure

```
portfolio/
├── assets/
│   ├── images/       → profile.webp (extracted from the original base64 data-URI)
│   ├── icons/         (reserved for future icon assets)
│   └── fonts/         (reserved — currently using Google Fonts CDN)
├── components/
│   ├── header.html    → nav bar, injected via js/include.js
│   └── footer.html    → footer, injected via js/include.js
├── css/
│   ├── style.css       → base styles, layout, components, animations
│   └── responsive.css  → all @media breakpoints (980px / 560px / 380px)
├── js/
│   ├── include.js      → tiny fetch-based HTML component loader
│   └── main.js         → all interactive behaviour (scroll reveal, counters,
│                          magnetic buttons, FAQ accordion, nav, etc.)
├── pages/               (reserved for future inner pages, e.g. case studies)
└── index.html
```

## Running locally

`include.js` uses `fetch()` to load `header.html` / `footer.html`, which
**does not work over the `file://` protocol** due to browser CORS
restrictions. Serve the folder with any static server, for example:

```bash
# Option 1 — Python (already installed on most systems)
python3 -m http.server 8000

# Option 2 — Node
npx serve .

# Option 3 — VS Code "Live Server" extension
```

Then open `http://localhost:8000/`.

## Notes

- No inline CSS or inline JavaScript remains anywhere in the markup.
- A few former `style="..."` attributes were converted into small reusable
  utility classes (`.section-head-tight`, `.section-head-center`,
  `.section-sub-center`, `.case-title-note`) in `css/style.css`.
- The duplicated base64 profile image (used in the hero and in the contact
  card) was extracted once to `assets/images/profile.webp` and is now
  referenced twice — smaller HTML, cacheable image.
- All SEO meta tags, Open Graph/Twitter tags, canonical link, and JSON-LD
  structured data are preserved in `index.html`'s `<head>`.

## Migrating to Astro later

This structure maps almost directly onto Astro:

- `components/header.html` → `src/components/Header.astro`
- `components/footer.html` → `src/components/Footer.astro`
- `css/*.css` → import directly into a layout or `<style>`/global CSS
- `js/main.js` → drop into a `<script>` tag in the relevant `.astro`
  component, or load as a client script
- `index.html` → `src/pages/index.astro`, replacing the `data-include`
  divs with `<Header />` / `<Footer />` component tags
- `pages/` → new files here become new routes automatically in Astro
