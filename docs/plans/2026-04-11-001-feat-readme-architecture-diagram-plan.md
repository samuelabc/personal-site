---
title: "feat: Create README with architecture diagram"
type: feat
status: completed
date: 2026-04-11
---

# feat: Create README with architecture diagram

## Overview

Add a root `README.md` to the repository with project information, setup instructions, and an architecture diagram created with Excalidraw and stored as a PNG in the repo.

## Problem Frame

The repo has no `README.md`. Contributors, recruiters, and future-Samuel have no quick way to understand the project structure, tech stack, or how to get started. An architecture diagram will make the system shape immediately scannable.

## Requirements Trace

- R1. README covers: project description, tech stack, getting started, project structure, architecture diagram, deployment info
- R2. Architecture diagram is created using Excalidraw MCP, rendered visually, and stored as a PNG in `public/` or `docs/`
- R3. README embeds the architecture diagram image inline

## Scope Boundaries

- No CONTRIBUTING.md or CODE_OF_CONDUCT — out of scope
- No DESIGN.md — design context lives in AGENTS.md already
- No changes to application code

## Context & Research

### Relevant Code and Patterns

- **Framework:** Astro 6.x, TypeScript, Tailwind CSS 4, pnpm
- **Site URL:** `https://samuelthien.site`
- **Key pages:** `src/pages/index.astro` (portfolio), `src/pages/bookshelf/` (reading list), `src/pages/og/` (OG image generation)
- **Data layer:** TypeScript modules in `src/data/` (no content collections)
- **OG pipeline:** Satori + @resvg/resvg-js for build-time PNG generation
- **Analytics:** PostHog (optional via env)
- **Styling:** Tailwind v4 with `@theme` tokens in `src/styles/global.css`
- **Fonts:** Archivo Black, Instrument Serif, DM Sans, Space Mono (Google Fonts + local TTFs for OG)
- **Integrations:** `@astrojs/sitemap`
- **Node requirement:** >= 22.12.0
- **No CI config in repo**, deployment is configured externally

### Architecture Shape

```
Browser Request
    ↓
Astro SSG (build-time)
    ├── Pages (file-based routing)
    │   ├── index.astro → Hero, About, Projects, Experience, Writing, Contact
    │   ├── bookshelf/index.astro → Book grid
    │   ├── bookshelf/[slug].astro → Book detail
    │   └── og/[...slug].png.ts → OG image generation
    ├── Layout: Base.astro (HTML shell, meta, nav, scripts)
    ├── Components: *.astro (UI sections)
    ├── Data: src/data/*.ts (projects, books, analytics events)
    ├── Styles: Tailwind v4 + global.css @theme tokens
    └── Assets: fonts (TTF for Satori), images
    ↓
Static Output → CDN
```

## Key Technical Decisions

- **Diagram tool:** Excalidraw MCP (`create_view` for rendering, `export_to_excalidraw` for shareable link). Screenshot via browser MCP to capture PNG for storage in the repo
- **Image location:** `docs/architecture.png` — keeps it out of the public build output since it's developer documentation, not site content
- **README tone:** Match the brand personality from AGENTS.md — bold, confident, human. Not a generic template

## Open Questions

### Resolved During Planning

- **Where to store the diagram image?** → `docs/architecture.png`. It's developer-facing, not user-facing, so `public/` is wrong
- **How to get a PNG from Excalidraw MCP?** → Use `create_view` to render, then use the browser MCP to screenshot the rendered diagram. Alternatively, use `export_to_excalidraw` to get a shareable URL and screenshot from there

### Deferred to Implementation

- Exact Excalidraw element coordinates and layout — determined by the diagram content at draw time

## Implementation Units

- [ ] **Unit 1: Create and export architecture diagram**

**Goal:** Produce a PNG architecture diagram of the site using Excalidraw MCP

**Requirements:** R2

**Dependencies:** None

**Files:**
- Create: `docs/architecture.png`

**Approach:**
- Call Excalidraw MCP `create_view` with elements representing the site architecture: Astro build pipeline, page routing, component composition, data layer, OG image pipeline, and static output
- Capture the rendered diagram as a PNG and save to `docs/architecture.png`
- Diagram should show: Pages → Layout → Components → Data flow, plus the OG generation pipeline as a parallel branch, and the final static output to CDN

**Patterns to follow:**
- Excalidraw element format from the MCP `read_me` reference
- Use labeled shapes, zone backgrounds, and clear arrow bindings

**Test expectation:** none — visual asset, no behavioral change

**Verification:**
- `docs/architecture.png` exists and is a readable image
- Diagram accurately reflects the project structure

- [ ] **Unit 2: Write README.md**

**Goal:** Create a comprehensive, personality-forward README

**Requirements:** R1, R3

**Dependencies:** Unit 1 (diagram image must exist for embedding)

**Files:**
- Create: `README.md`

**Approach:**
- Sections: project title/tagline, screenshot or hero description, tech stack badges, architecture diagram (embedded from `docs/architecture.png`), project structure tree, getting started (prerequisites, install, dev, build), deployment notes, license
- Tone: confident and direct, matching brand personality. No corporate boilerplate
- Use the existing `package.json` scripts (`dev`, `build`, `preview`) for the getting started section
- Reference Node >= 22.12.0 and pnpm as prerequisites
- Keep the project structure tree focused — show `src/` depth but not every file

**Patterns to follow:**
- Match the editorial tone established in AGENTS.md brand personality
- Use standard GitHub markdown features (badges, code blocks, image embeds)

**Test expectation:** none — documentation file, no behavioral change

**Verification:**
- `README.md` exists at repo root
- Architecture diagram renders correctly in GitHub markdown preview
- All referenced paths and commands are accurate

## System-Wide Impact

- **Interaction graph:** None — pure documentation addition
- **Error propagation:** N/A
- **State lifecycle risks:** None
- **API surface parity:** N/A
- **Integration coverage:** N/A
- **Unchanged invariants:** All application code remains untouched

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Excalidraw MCP screenshot capture may require browser MCP coordination | Fall back to exporting to excalidraw.com and using the shareable link, or use GenerateImage for a static diagram |
| Architecture diagram may become stale as the project evolves | Keep the diagram high-level enough that minor changes don't invalidate it |

## Sources & References

- Related code: `package.json`, `astro.config.mjs`, `src/pages/`, `src/components/`, `src/data/`
- Design context: `AGENTS.md` (brand personality, aesthetic direction)
- Excalidraw MCP: `create_view`, `export_to_excalidraw` tools
