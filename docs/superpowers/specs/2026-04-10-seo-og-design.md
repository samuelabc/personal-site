# SEO & Open Graph Implementation

**Date:** 2026-04-10
**Status:** Approved
**Site:** https://samuelthien.site

## Summary

Add complete SEO metadata, Open Graph/Twitter card tags, dynamic OG image generation, sitemap, robots.txt, canonical URLs, and JSON-LD structured data to the Astro personal site.

## Scope

### In scope

- Astro `site` config
- OG and Twitter card meta tags (per-page, with defaults)
- Dynamic OG image generation via Satori + resvg-wasm (build-time)
- Static fallback OG image
- Canonical `<link>` on every page
- `@astrojs/sitemap` integration
- `robots.txt`
- JSON-LD structured data (Person + WebSite)

### Out of scope

- RSS feed (no blog/writing pages yet)
- Web app manifest
- Book-specific JSON-LD (BookReview, etc.)
- Per-project detail pages (don't exist yet)

## Architecture

### 1. Astro Config

Set `site: 'https://samuelthien.site'` in `astro.config.mjs`. Add `@astrojs/sitemap` integration.

```js
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://samuelthien.site',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

### 2. Base Layout Props & Meta Tags

Extend the `Props` interface in `Base.astro`:

```typescript
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;      // absolute URL or path like '/og/index.png'
  canonicalPath?: string; // path like '/bookshelf' (resolved against site)
  ogType?: string;        // 'website' | 'article' — defaults to 'website'
}
```

Add to `<head>`:

```html
<!-- Canonical -->
<link rel="canonical" href={canonicalUrl} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImageAbsolute} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:type" content={ogType} />
<meta property="og:site_name" content="Samuel Thien" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageAbsolute} />

<!-- Robots -->
<meta name="robots" content="index, follow" />
```

**Canonical URL logic:** `new URL(canonicalPath ?? Astro.url.pathname, Astro.site).href`

**OG image logic:** If `ogImage` prop is provided, resolve to absolute URL. Otherwise, default to `{site}/og-default.png`.

### 3. Dynamic OG Image Generation

**Endpoint:** `src/pages/og/[...slug].png.ts`

**Dependencies:**
- `satori` — renders JSX to SVG
- `@resvg/resvg-js` — converts SVG to PNG (WASM-based, no native deps)

**How it works:**

1. `getStaticPaths()` returns one entry per page route:
   - `{ params: { slug: 'index' }, props: { title: 'Samuel Thien', subtitle: 'Full Stack Engineer' } }`
   - `{ params: { slug: 'bookshelf' }, props: { title: 'Bookshelf', subtitle: 'Books that shaped...' } }`
   - `{ params: { slug: 'bookshelf/the-beginning-of-infinity' }, props: { title: 'The Beginning of Infinity', subtitle: 'David Deutsch' } }`
   - etc.
2. The `GET` handler renders a Satori JSX template with the props.
3. The output is a 1200x630 PNG (standard OG dimensions).

**Template design:**

```
┌─────────────────────────────────────────────┐
│                                             │
│  #f4f0e8 background                         │
│                                             │
│     SAMUEL THIEN                            │
│     ─────────────                           │
│                                             │
│     {title}                                 │
│     in large bold serif                     │
│                                             │
│     {subtitle}                              │
│     in smaller mono/sans                    │
│                                             │
│                      samuelthien.site  ──┐  │
│                                          │  │
└─────────────────────────────────────────────┘
```

- Background: `#f4f0e8` (warm paper)
- Title: bold serif (Instrument Serif or fallback), dark `#1a1a1a`
- Subtitle: `Space Mono` or DM Sans, muted
- Accent line/border: high-contrast, matching the editorial brutalist style
- Name + domain in corner for brand recognition

**Font loading:** Download TTF files for the required fonts (Instrument Serif, Space Mono) and store them in `src/assets/fonts/`. Satori requires raw font buffers via `fs.readFileSync` — Google Fonts CDN URLs won't work directly since Satori needs the binary data at render time.

### 4. Static Fallback OG Image

A pre-designed PNG at `public/og-default.png` (1200x630). Used as the default `ogImage` value in `Base.astro` when no page-specific OG image is provided.

This image should be a simple branded card: name, title, domain, matching the dynamic template's aesthetic.

### 5. Per-Page Metadata

| Route | `title` | `description` | `ogImage` | `canonicalPath` |
|-------|---------|---------------|-----------|-----------------|
| `/` | "Samuel Thien — Full Stack Engineer" | "Full stack engineer with a backend focus. Building secure, high-performance systems with Go, TypeScript, and React." | `/og/index.png` | `/` |
| `/bookshelf` | "Bookshelf — Samuel Thien" | "Books that shaped how I think about software and systems." | `/og/bookshelf.png` | `/bookshelf` |
| `/bookshelf/[slug]` | "{Book Title} — Samuel Thien" | "{Note excerpt}" or "{Title} by {Author}" | `/og/bookshelf/{slug}.png` | `/bookshelf/{slug}` |

**Title pattern:** `{Page Name} — Samuel Thien` for sub-pages, full branded title for home.

### 6. Sitemap

`@astrojs/sitemap` generates `/sitemap-index.xml` automatically from all static routes. No additional config needed beyond `site`.

### 7. robots.txt

Static file at `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://samuelthien.site/sitemap-index.xml
```

### 8. JSON-LD Structured Data

Rendered in `Base.astro` (home page only, via conditional check on `Astro.url.pathname`):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "name": "Samuel Thien",
      "url": "https://samuelthien.site",
      "jobTitle": "Full Stack Engineer",
      "sameAs": [
        "https://github.com/samuelabc",
        "https://linkedin.com/in/samuel-thien-18b9071ab"
      ]
    },
    {
      "@type": "WebSite",
      "name": "Samuel Thien",
      "url": "https://samuelthien.site"
    }
  ]
}
```

Social `sameAs` links match the Footer component's existing link data (`github.com/samuelabc`, `linkedin.com/in/samuel-thien-18b9071ab`). If these change in Footer, they should be updated here too — consider extracting to a shared `social-links.ts` data file if this becomes a maintenance concern.

## File Changes

| File | Action | What |
|------|--------|------|
| `astro.config.mjs` | Edit | Add `site`, `sitemap` integration |
| `src/layouts/Base.astro` | Edit | Extended props, OG/Twitter/canonical meta, JSON-LD |
| `src/pages/og/[...slug].png.ts` | Create | Dynamic OG image endpoint |
| `src/pages/index.astro` | Edit | Pass SEO props to Base |
| `src/pages/bookshelf/index.astro` | Edit | Pass SEO props to Base |
| `src/pages/bookshelf/[slug].astro` | Edit | Pass SEO props to Base |
| `public/robots.txt` | Create | Allow all + sitemap directive |
| `public/og-default.png` | Create | Static fallback OG image |
| `package.json` | Edit | Add `satori`, `@resvg/resvg-js`, `@astrojs/sitemap` |

## Dependencies

- `@astrojs/sitemap` — sitemap generation
- `satori` — JSX-to-SVG rendering for OG images
- `@resvg/resvg-js` — SVG-to-PNG conversion (WASM)

## Testing

- Build the site and verify OG images are generated in `dist/og/`
- Check meta tags in built HTML files with `grep` or browser dev tools
- Validate OG tags with https://www.opengraph.xyz/ or Twitter Card Validator
- Verify sitemap at `/sitemap-index.xml`
- Verify `robots.txt` is accessible
- Test JSON-LD with Google's Rich Results Test
