# Beautiful-Mermaid Integration

**Date:** 2026-05-24  
**Status:** Approved  
**Scope:** Replace Mermaid CDN with build-time SVG rendering via beautiful-mermaid

---

## Problem

Blog diagrams currently load Mermaid v11 from jsDelivr CDN at runtime. This causes:

1. Flash of unstyled `<pre>` content before SVGs render
2. ~200KB client-side dependency loaded on every blog page (even those without diagrams, due to the unconditional import check)
3. A `resolveColor()` canvas hack to convert OKLCH → hex because Mermaid v11 doesn't support OKLCH natively
4. Tight coupling between the layout file (`BlogPost.astro`) and diagram rendering logic

## Solution

Replace the entire client-side pipeline with **beautiful-mermaid** (`npm:beautiful-mermaid`), rendering diagrams synchronously at build time inside the Astro component.

### Why beautiful-mermaid

- Synchronous `renderMermaidSVG()` — works in Astro's SSR frontmatter with no async complications
- CSS custom properties with `color-mix()` — OKLCH values pass through natively
- Supports all diagram types used across the 12 blog posts: flowcharts (with subgraphs), sequence diagrams, state diagrams
- Zero DOM dependencies — pure TypeScript, runs in Node.js
- Elegant theming: 2 required colors (bg/fg) + optional enrichments

---

## Architecture

### Before

```
MDX post → <Mermaid chart={...} /> → Mermaid.astro outputs <pre class="mermaid">
BlogPost.astro (client):
  → import mermaid@11 from CDN
  → resolveColor() converts OKLCH → hex via canvas
  → mermaid.initialize({ theme: 'base', themeVariables })
  → mermaid.run() replaces <pre> with <svg>
```

### After

```
MDX post → <Mermaid chart={...} /> → Mermaid.astro calls renderMermaidSVG()
  → Finished SVG string baked directly into HTML at build time
  → Zero client-side JavaScript for diagrams
```

---

## Custom Theme

Map the site's OKLCH palette to beautiful-mermaid's color system:

```typescript
// src/data/mermaid-theme.ts
import type { RenderOptions } from 'beautiful-mermaid'

export const mermaidTheme: RenderOptions = {
  bg: 'oklch(96.5% 0.007 110)',         // --color-bg (warm cream)
  fg: 'oklch(22% 0.015 160)',           // --color-ink (dark forest ink)
  accent: 'oklch(48% 0.10 150)',        // --color-accent (forest green arrows/highlights)
  muted: 'oklch(58% 0.008 160)',        // --color-ink-muted (labels, secondary text)
  surface: 'oklch(96% 0.02 150)',       // light green node fills
  border: 'oklch(48% 0.10 150 / 0.3)', // soft green node strokes
  font: '"Libre Franklin", sans-serif',
  transparent: true,                     // blend with page background
  padding: 32,
}
```

The theme uses the same OKLCH values as the rest of the site's CSS. Since beautiful-mermaid outputs SVGs with CSS custom properties and `color-mix()`, these values resolve natively in the browser — no conversion needed.

---

## Component Changes

### Mermaid.astro (rewrite)

```astro
---
import { renderMermaidSVG } from 'beautiful-mermaid'
import { mermaidTheme } from '../../data/mermaid-theme'

interface Props {
  caption?: string
  chart: string
}

const { caption, chart } = Astro.props
const svg = renderMermaidSVG(chart, mermaidTheme)
---

<figure class="mermaid-figure">
  <Fragment set:html={svg} />
  {caption && <figcaption>{caption}</figcaption>}
</figure>
```

### What this changes

- `<div class="mermaid-wrapper">` → `<figure class="mermaid-figure">` (semantic HTML)
- `<pre class="mermaid">{chart}</pre>` → `<Fragment set:html={svg} />` (pre-rendered SVG)
- `<p class="mermaid-caption">` → `<figcaption>` (semantic)
- Build-time rendering, zero client-side work

---

## CSS Changes

### Remove (from global.css)

All of `.mermaid-wrapper`, `.mermaid-wrapper .mermaid`, `.mermaid-wrapper .mermaid svg`, `.mermaid-wrapper .mermaid .cluster-label` rules, and `.mermaid-caption`.

### Add

```css
.mermaid-figure {
  margin: 1.75rem 0;
  text-align: center;
}

.mermaid-figure svg {
  max-width: 100%;
  height: auto;
}

.mermaid-figure figcaption {
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  color: var(--color-ink-muted);
  font-style: italic;
  margin-top: 0.75rem;
}
```

Diagrams breathe directly in the prose with no card wrapper.

---

## BlogPost.astro Cleanup

Remove from the client-side `<script>`:

1. The `resolveColor()` function
2. The `initMermaid()` function
3. The `initMermaid()` call from `init()`
4. Any mermaid-related event listener registrations

Keep everything else (code copy buttons, heading anchors, etc.).

---

## MDX Post Compatibility

**Zero changes needed.** All 12 posts use the same API:

```mdx
import Mermaid from "../../components/blog/Mermaid.astro";

<Mermaid
  caption="Description"
  chart={`graph LR
    A --> B --> C`}
/>
```

This interface is preserved exactly.

---

## Feature Compatibility Verification

| Feature | Used in posts | beautiful-mermaid support |
|---------|--------------|--------------------------|
| `graph LR` / `graph TD` | All 12 posts | Yes |
| Subgraphs | idempotent-service, others | Yes |
| `linkStyle` | Multiple posts | Yes |
| `sequenceDiagram` | 4+ posts | Yes |
| `Note over` | Multiple | Yes |
| `<br/>` in labels | Multiple | Yes (HTML in labels) |
| `stateDiagram-v2` | control-plane-data-plane | Yes |
| Decision nodes `{...}` | Multiple | Yes |
| Dotted edges `-.->` | Multiple | Yes |

### Potential edge cases to verify during implementation

- `linkStyle default` syntax
- `Note over` with exactly two participants
- Self-reference patterns (known Mermaid limitation)
- Subgraph title styling

---

## Rollback Plan

If beautiful-mermaid doesn't support a specific diagram feature used in a post:

1. Keep the old CDN approach for that specific post via a `fallback` prop
2. Or rewrite the diagram to use a supported pattern

Given beautiful-mermaid covers 6 diagram types with full Mermaid syntax parsing, this is unlikely.

---

## Implementation Steps (high-level)

1. Install `beautiful-mermaid` via pnpm
2. Create `src/data/mermaid-theme.ts` with the custom theme
3. Rewrite `src/components/blog/Mermaid.astro`
4. Remove mermaid client-side code from `BlogPost.astro`
5. Replace CSS rules in `global.css`
6. Build and verify all 12 posts render correctly
7. Visual spot-check key diagrams (flowcharts, sequence, state)

---

## Success Criteria

- All 12 blog posts build without errors
- Diagrams render as polished SVGs with the site's forest green palette
- Zero client-side JavaScript for diagram rendering
- No flash of unstyled content
- Diagrams are responsive (scale to viewport)
- Captions render correctly below diagrams
