---
name: personal-site-frontend-design
description: Design and build a tasteful personal website with a clear visual point of view using pnpm and Tailwind CSS. Use when the user asks for a personal site, portfolio, landing page, homepage redesign, or frontend styling work that should feel polished and non-generic.
---

# Personal Site Frontend Design

Build production-grade personal websites that feel intentional, distinctive, and tasteful.

Default stack and tooling:
- Framework: Astro (default for personal sites)
- Package manager: `pnpm`
- Styling: Tailwind CSS

## When to Use

Use this skill when the user asks to:
- Create or redesign a personal site, portfolio, or homepage
- Improve visual design, typography, spacing, or branding
- Implement frontend sections/components with stronger aesthetic quality

## Core Principle

Commit to one strong visual direction and execute it consistently.

Avoid generic AI aesthetics:
- No default-feeling type scale and spacing
- No overused bland font choices (for example, Inter + basic cards everywhere)
- No random gradients without concept

## Framework Choice (Default to Astro)

Prefer Astro for personal sites because it is fast by default, content-friendly, and easy to enhance with islands only where interactivity is needed.

Use Astro unless the user clearly needs a highly interactive app-style UI with heavy client state on most pages.

## Workflow

### 1) Establish creative direction first

Before coding, define:
- Audience: recruiter, client, collaborators, community, or mixed
- Tone: editorial, minimal, brutalist, playful, luxury, retro, etc.
- Signature element: one memorable detail (motion motif, layout structure, texture, or typography treatment)

If user requirements are ambiguous, ask for:
- 2-3 reference sites they like
- Preferred tone
- Primary goal (hire, inquiries, newsletter, showcase)

### 2) Set up with pnpm (Astro-first)

If starting from scratch, scaffold Astro first:

```bash
pnpm create astro@latest
pnpm install
pnpm dev
```

If Astro is already present, run:

```bash
pnpm install
pnpm dev
```

Keep dependencies current and use `pnpm` for all package scripts.

### 3) Tailwind-first implementation

Use Tailwind utility classes as default. In Astro projects, install and configure the official Tailwind integration when needed, then:
- Keep tokens (colors, spacing, radii, shadows) consistent
- Create reusable component patterns for repeated UI pieces
- Use semantic HTML and accessible states (`focus-visible`, contrast, landmarks)

Use Astro conventions cleanly:
- Keep shared layout in `src/layouts`
- Keep page routes in `src/pages`
- Keep reusable UI in `src/components`
- Use islands only for components that truly need client-side interactivity

### 4) Build a tasteful personal site structure

Recommended sections:
- Hero with clear identity and short value statement
- About with concise personality and credibility markers
- Selected work/projects with outcomes, not just screenshots
- Optional writing/thoughts section
- Contact with one primary CTA

Favor quality over quantity:
- Fewer sections, stronger hierarchy
- Tight copy blocks and deliberate whitespace

### 5) Motion and interaction rules

Use restrained motion:
- 150-300ms transitions for hover/focus
- Staggered reveal on initial load only where it adds clarity
- Avoid constant looping animations unless part of the concept

### 6) Final polish pass

Run a refinement pass specifically for:
- Typographic rhythm (line length, line height, heading cadence)
- Vertical spacing consistency
- Color contrast and readability
- Mobile layout integrity
- CTA clarity

## Design Standards

### Typography
- Pair a distinctive display font with a readable body font
- Keep line length comfortable for reading
- Use consistent scale progression across headings

### Color
- Define a tight palette with clear intent:
  - 1 dominant background family
  - 1 text family
  - 1-2 accents maximum
- Use accent color for meaning, not decoration overload

### Layout
- Prefer asymmetry or deliberate grid breaks when they improve identity
- Keep alignment discipline; break the grid intentionally, not accidentally
- Respect negative space

## Implementation Expectations

When fulfilling a request with this skill:
1. State the chosen visual direction in 1-2 lines
2. Implement real, runnable code (not pseudo-UI)
3. Ensure `pnpm` commands are used for dependency/task operations
4. Prefer Astro architecture for personal-site pages and content sections
5. Use Tailwind classes and shared patterns instead of ad hoc styles
6. Verify responsive behavior and accessibility basics

## Output Format for Agent Responses

For substantial frontend tasks, respond with:
- What was built and the aesthetic direction
- Files changed
- How to run with `pnpm`
- Any follow-up polish options

## Quick Checks Before Finishing

- Site has a clear personality, not a template feel
- Content hierarchy is obvious in under 5 seconds
- Mobile and desktop both look intentional
- Buttons/links have visible hover and focus states
- No placeholder lorem-style copy in final output unless user asked
