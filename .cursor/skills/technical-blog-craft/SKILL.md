---
name: technical-blog-craft
description: Convert a blog content outline into a polished Astro MDX post with proper component usage, styling, and rendering. Takes structured output from the `technical-blog-content` skill and produces a complete `.mdx` file using the site's blog component library. Use when implementing a blog post from a content outline, or when adding/modifying blog components.
---

# Technical Blog Craft

Convert a content outline into a finished Astro MDX blog post using the site's component library and design system. This skill handles MDX syntax, component APIs, CSS conventions, and rendering. It does not handle narrative structure or content quality; that's the job of `technical-blog-content`.

## When to Use

- Converting a content outline (from `technical-blog-content`) into an Astro MDX file
- Adding or modifying blog components (callouts, diagrams, collapsibles)
- Debugging rendering issues in blog posts (mermaid not showing, MDX parsing errors)
- Applying the site's blog design system to new content

## Prerequisites

- A content outline exists (from `technical-blog-content` or manually written)
- The blog component library exists at `src/components/blog/`
- The blog layout exists at `src/layouts/BlogPost.astro`

## Blog Architecture

### File Structure

```
src/
  content/
    writing/           # MDX blog posts live here
      my-post.mdx
    config.ts          # Content collection schema
  components/
    blog/
      Callout.astro    # Admonition boxes (4 types)
      Mermaid.astro    # Diagram wrapper (chart prop)
      Details.astro    # Collapsible sections (open by default)
  layouts/
    BlogPost.astro     # Blog post layout (header + prose + mermaid init)
    Base.astro         # Site shell (nav, footer, fonts)
  styles/
    global.css         # All blog prose + component styles
```

### Content Collection Schema

Every MDX file in `src/content/writing/` must have this frontmatter:

```yaml
---
title: "Post Title"
subtitle: "One-line description"
date: 2026-05-10
tags: ["tag-1", "tag-2"]
readTime: "14 min"
---
```

Optional field: `draft: true` (excluded from builds).

### Layout Pipeline

```
[slug].astro -> BlogPost.astro -> Base.astro
                  |                  |
                  |                  +-- Nav, Footer, fonts, PostHog
                  |
                  +-- Article header (title, subtitle, date, tags)
                  +-- .prose div (slot for MDX content)
                  +-- Inline scripts (mermaid init, table wrapper)
```

The `<main>` container is `max-w-[1100px]` centered. The article header and `.prose` content are both `max-width: 720px` and centered within that container.

## Component Reference

### Callout

Four semantic types, each with a distinct icon, border color, and background tint.

| Type | Icon | Color | Use For |
|---|---|---|---|
| `definition` | Question circle | Forest green (accent) | Precise term definitions |
| `takeaway` | Checkbox | Sky blue | Section-level key insights |
| `gotcha` | Warning triangle | Golden amber | Non-obvious failure modes |
| `in-practice` | Wrench | Blossom pink | Real-world application notes |

**MDX usage:**

```mdx
<Callout type="definition">

**Exactly-once delivery**: a message crosses the network and arrives at the receiver exactly one time.

</Callout>
```

**Critical MDX rule:** Blank lines after the opening tag and before the closing tag are required for MDX to parse markdown inside the component. Without them, bold/italic/links won't render.

**Import:** `import Callout from "../../components/blog/Callout.astro";`

### Mermaid

Renders mermaid diagrams via CDN (mermaid v11). Chart definition is passed as a `chart` prop, not as children/slot content.

**Props:**
- `chart` (string, required): The mermaid diagram definition
- `caption` (string, optional): Caption text displayed below the diagram

**MDX usage:**

```mdx
<Mermaid
  caption="Decision tree for choosing an idempotency strategy."
  chart={`graph LR
    A{"Naturally\nidempotent?"} -->|Yes| B["No extra\nwork needed"]
    A -->|No| C{"Control the\nclient?"}
    C -->|Yes| D["Idempotency\nkeys"]
    C -->|No| E["Transactional\noutbox"]`}
/>
```

**Diagram direction:** Prefer `graph LR` for flowcharts and decision trees. `graph TD` creates tall diagrams that dominate the viewport. Use `\n` for line breaks within node labels to keep nodes compact.

**Why `chart` prop instead of slot:** MDX wraps slot content in `<p>` tags, which corrupts mermaid syntax. The `chart` prop passes the string directly to a `<pre class="mermaid">` element, preserving whitespace and avoiding HTML entity escaping issues.

**Rendering:** The BlogPost layout loads mermaid from CDN and calls `mermaid.run()` on all `.mermaid` elements. Theming uses OKLCH colors matching the site palette.

**Container styling:** Mermaid diagrams are wrapped in `.mermaid-wrapper` with a soft green background tint, subtle border, and 12px rounded corners to look like illustrated figures in the field journal aesthetic. The caption sits below the diagram with a `border-top` separator.

**Import:** `import Mermaid from "../../components/blog/Mermaid.astro";`

### Details

Collapsible/expandable sections for supplementary depth. Open by default for discoverability.

**Props:**
- `title` (string, required): Summary text shown in the clickable header
- `open` (boolean, default `true`): Whether the section starts expanded

**MDX usage:**

```mdx
<Details title="Full implementation with race condition handling">

The full production pattern includes: (1) INSERT the idempotency key...

</Details>
```

To make a section start collapsed: `<Details title="..." open={false}>`

**Import:** `import Details from "../../components/blog/Details.astro";`

## MDX File Template

Every blog post MDX file follows this structure:

```mdx
---
title: "Post Title"
subtitle: "Subtitle"
date: 2026-05-10
tags: ["tag-1", "tag-2"]
readTime: "14 min"
---

import Callout from "../../components/blog/Callout.astro";
import Mermaid from "../../components/blog/Mermaid.astro";
import Details from "../../components/blog/Details.astro";

## Section Heading

Body text with [links](https://example.com) and `inline code`.

<Callout type="definition">

**Term**: definition text with *emphasis* and [links](url).

</Callout>

<Mermaid
  caption="What question does this diagram answer?"
  chart={`graph TD
    A[Node A] --> B[Node B]`}
/>

<Details title="Deep dive: extended explanation">

Extended content here...

</Details>
```

## Design Rules

These rules are derived from the site's design system and the impeccable skill audit. They apply to all blog components.

### Banned Patterns

- **No side-stripe borders.** `border-left` or `border-right` greater than 1px as colored accents on callouts, blockquotes, or alerts. Use full borders + background tints instead.
- **No gradient text.** Use solid colors for emphasis.
- **No glassmorphism.** No decorative blurs or glass effects.

### Component Styling Conventions

| Element | Border | Background | Border Radius | Padding | Margin |
|---|---|---|---|---|---|
| Callout | 1px solid (type color, reduced opacity) | OKLCH tint at 5-9% opacity | 10px | 1.125rem 1.375rem | 1.75rem 0 |
| Blockquote | 1px solid (accent, 15% opacity) | accent at 4% opacity | 10px | 1rem 1.375rem | 1.75rem 0 |
| Details | 1px solid (rule color) | summary: 1.5% opacity tint | 8px | summary: 0.75rem 1.25rem | 1.5rem 0 |
| Code block | none | ink color (dark) | 8px | 1.25rem 1.5rem | 1.5rem 0 |
| Code caption | bottom: 1px solid separator | same dark as code block | 8px 8px 0 0 (top only) | 0.625rem 1.5rem 0.375rem | 0 bottom (connects to code) |
| Table | bottom borders on rows | none | none | 0.625rem 0.75rem | 1.75rem 0 |
| Mermaid | 1px solid (green tint, 60% opacity) | OKLCH green tint at 50% opacity | 12px | 1.5rem 1.25rem 1rem | 1.75rem 0 |
| HR | top border only | none | none | none | 3rem 0 |

### Spacing Rhythm

Vary spacing for visual rhythm. Monotonous margins make the page feel mechanical.

- Callouts and blockquotes: `1.75rem` vertical margin (slightly more than body elements)
- Body paragraphs: `1.25rem` bottom margin
- Code blocks: `1.5rem` bottom margin
- HRs (section breaks): `3rem` vertical margin
- Headings: `2.5rem` top / `0.75rem` bottom (h2), `2rem` top / `0.5rem` bottom (h3)

### Typography

- Body: Source Serif 4, 17px (mobile) / 18px (desktop), line-height 1.75
- Headings: Vollkorn, bold, tight letter-spacing
- UI labels (callout labels, captions, code captions): Libre Franklin, small caps style
- Inline code: 0.875em with 4% opacity background tint
- Code blocks: 0.85rem, line-height 1.6, dark background

### Color System

All colors use OKLCH. Blog-specific mappings:

| Token | OKLCH Value | Used For |
|---|---|---|
| `--color-accent` | `oklch(48% 0.10 150)` | Links, definition callout border |
| `--color-sky` | `oklch(72% 0.08 230)` | Takeaway callout border |
| `--color-golden` | `oklch(78% 0.13 85)` | Gotcha callout border |
| `--color-blossom` | `oklch(82% 0.06 350)` | In-practice callout border |
| `--color-ink` | `oklch(22% 0.015 160)` | Body text, code block background |
| `--color-ink-muted` | `oklch(58% 0.008 160)` | Captions, metadata |
| `--color-rule` | `oklch(88% 0.006 150)` | Table borders, details border, HR |

### Mobile Considerations

- Tables are auto-wrapped in a `.table-wrapper` div with `overflow-x: auto` via client-side JS in BlogPost.astro. No manual wrapping needed in MDX.
- Prose content is constrained to 720px, which reads well on mobile without adjustment.
- Code blocks have `overflow-x: auto` for horizontal scrolling.
- Mermaid diagrams are centered with `max-width: 100%` on the SVG.

## Workflow

1. **Read the content outline.** Map each section to the appropriate MDX elements and components.
2. **Create the MDX file** in `src/content/writing/` with proper frontmatter.
3. **Add component imports** at the top (after frontmatter, before content).
4. **Convert each section:**
   - Hook sections: plain prose, no components needed
   - Concept sections: prose + Callout (definition) + Mermaid diagram + Callout (takeaway)
   - Comparison sections: Callout (definition) blocks + markdown table
   - Code sections: fenced code blocks with language tag + `.code-caption` paragraph
   - Production sections: prose + Callout (gotcha) + Callout (in-practice)
   - Landscape sections: Mermaid diagram + prose + Callout (takeaway)
   - Summary sections: bullet list + h3 "Further Reading" with annotated links
   - Deep dives: Details component wrapping extended content
5. **Add code captions** using `<p class="code-caption">Caption text</p>` immediately before the fenced code block. The caption connects visually to the code block via shared dark background and a subtle `border-bottom` separator. **CSS specificity note:** the caption's `margin-bottom: 0` must be set on `.prose .code-caption` (not bare `.code-caption`) to beat `.prose p`'s margin. Similarly, `.prose pre` needs explicit `margin-top: 0` to override the browser default `1em`.
6. **Build and verify.** Run `pnpm build` (requires Node.js >= 22). Check mermaid rendering, callout styling, table overflow on narrow viewports.
7. **Run the humanizer skill** on the final content to strip AI-sounding patterns.

## Common Pitfalls

| Problem | Cause | Fix |
|---|---|---|
| Mermaid diagram shows raw text | Using slot/children instead of `chart` prop | Pass diagram as `chart={\`...\`}` prop |
| Bold/italic not rendering in callout | Missing blank lines after opening/before closing tag | Add blank line after `<Callout type="...">` |
| Code caption not connected to code block | Other element between caption and code block | `.code-caption` paragraph must be immediately before the fenced code block |
| Code caption has spacing gap above code block | `.prose p` specificity (0,1,1) overrides `.code-caption` (0,1,0) `margin-bottom: 0` | Use `.prose .code-caption` selector (0,2,0) to win the specificity battle |
| Gap above code blocks (no caption) | Browser default `<pre>` has `margin: 1em 0`; only `margin-bottom` is overridden | Add explicit `margin-top: 0` to `.prose pre` |
| Mermaid diagram too tall / overflows viewport | Using `graph TD` for decision trees/flowcharts with 5+ nodes | Use `graph LR` with `\n` in node labels for compact horizontal layout |
| Table overflows on mobile | Wide tables with many columns | Tables are auto-wrapped; add `min-width: 480px` in CSS for scroll hint |
| Details section hidden by default | Missing `open` prop or `open={false}` | Default is `true`; omit prop for open, pass `open={false}` for closed |
| Mermaid diagram has wrong colors | CDN mermaid using default theme | BlogPost.astro initializes mermaid with OKLCH theme variables |

## Review Checklist

Before publishing:

- [ ] Frontmatter has all required fields (title, subtitle, date, tags, readTime)
- [ ] Component imports are at the top of the file
- [ ] Every Callout has blank lines for MDX markdown parsing
- [ ] Mermaid diagrams use `chart` prop, not slot content
- [ ] Every Mermaid diagram has a `caption`
- [ ] Code blocks have language tags
- [ ] Code captions immediately precede their code blocks
- [ ] Details sections have descriptive titles
- [ ] Build succeeds without errors (`pnpm build`)
- [ ] Mermaid diagrams render as SVG (not raw text)
- [ ] Mermaid flowcharts/decision trees use `graph LR` (not `graph TD`)
- [ ] Code captions connect seamlessly to code blocks (no gap)
- [ ] Article content is centered on wide screens
- [ ] Tables are scrollable on mobile
- [ ] No side-stripe borders on any element
