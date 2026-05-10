## Important!!!

- Always ask me questions if you are not sure about the answer or you need clarification on something.
- Whenever you are going to stop the current taskflow to ask a question, always use the AskQuestion tool.
- Use the AskQuestion tool for any interaction requiring user input like choosing between options, confirming a proposed action, or clarifying an ambiguous request.
- When spinning up subagents, use opus 4.6 model, only if this model is not available, then use gpt 5.3 codex model or composer-2 model.

## General

- When conductng e2e tests, take screenshots of the browser and save them to the `screenshots` directory with clear naming as proof and use for documentation.
    - when validating slidev slides, please be aware that a slide can have multiple steps, so you need to click through each step to validate the entire slide.
- When conducting code review, use a different model e.g. gpt 5.3 codex model to review the code.
- Use `humanizer` skill for general copywriting and content creation.
- Use `frontend-skill` skill for UI/UX design.
- Use `impeccable` skill when brainstorming UI/UX design.
- Use `critique` skill when reviewing UI/UX design.
- Use `clarity` skill for copywriting in UI/UX components.
- Use `emil-design-eng` skill for polishing ui/ux and animation design.
- Use `presentation-content` skill for crafting the content of a slidev presentation.
- Use `slidev-slide-craft` skill for converting content outlines into polished Slidev slides.
- Use `technical-blog-content` skill for writing technical blog posts (content planning, outlines, narrative structure).
- Use `technical-blog-craft` skill for implementing blog posts as Astro MDX (component usage, styling, rendering).

## Design Context

### Users

Primary audience is mixed, with emphasis on personal interest and self-expression while still being useful for recruiters, hiring managers, and engineering peers. Visitors should quickly understand who Samuel is, what he builds, and how to start a conversation.

### Brand Personality

Warm, curious, and grounded. The tone should feel like talking to someone who genuinely loves what they do. Not corporate, not performing confidence. Honest, clear, and inviting.

### Aesthetic Direction

Ghibli-inspired warm handcraft, light mode only. Nature-tinted palette (forest green primary, sky blue, golden amber, blossom pink accents) with OKLCH color system. Serif-forward typography (Vollkorn display, Source Serif 4 body, Libre Franklin UI). Soft rounded corners, diffused shadows, generous spacing. Organic motion (float, not snap). The feeling of an illustrated field journal, not a brutalist portfolio.

### Design Principles

1. Warmth over volume: communicate through tone and craft, not shouting or uppercase display type.
2. Personality is in the details: the font pairing, the color warmth, the gentle motion, the generous spacing.
3. Let the work breathe: clear hierarchy, unhurried rhythm, generous vertical spacing between sections.
4. Human, not handmade-looking: avoid literal craft cliches (leaf decorations, cloud motifs) while maintaining organic quality.
5. Still an engineer's site: warmth complements technical credibility, never replaces it. Avoid cottagecore or Ghibli fan blog aesthetics.

## AskUserQuestion Format

**ALWAYS follow this structure for every AskUserQuestion call:**

1. **Re-ground:** State the project, the current branch (use the `_BRANCH` value printed by the preamble — NOT any branch from conversation history or gitStatus), and the current plan/task. (1-2 sentences)
2. **Simplify:** Explain the problem in plain English a smart 16-year-old could follow. No raw function names, no internal jargon, no implementation details. Use concrete examples and analogies. Say what it DOES, not what it's called.
3. **Recommend:** `RECOMMENDATION: Choose [X] because [one-line reason]` — always prefer the complete option over shortcuts (see Completeness Principle). Include `Completeness: X/10` for each option. Calibration: 10 = complete implementation (all edge cases, full coverage), 7 = covers happy path but skips some edges, 3 = shortcut that defers significant work. If both options are 8+, pick the higher; if one is ≤5, flag it.
4. **Options:** Lettered options: `A) ... B) ... C) ...` — when an option involves effort, show both scales: `(human: ~X / CC: ~Y)`

Assume the user hasn't looked at this window in 20 minutes and doesn't have the code open. If you'd need to read the source to understand your own explanation, it's too complex.

Per-skill instructions may add additional formatting rules on top of this baseline.

## Completeness Principle — Boil the Lake

AI makes completeness near-free. Always recommend the complete option over shortcuts — the delta is minutes with AI tooling. A "lake" (100% coverage, all edge cases) is boilable; an "ocean" (full rewrite, multi-quarter migration) is not. Boil lakes, flag oceans.

**Effort reference** — always show both scales:


| Task type   | Human team | AI-assisted | Compression |
| ----------- | ---------- | ----------- | ----------- |
| Boilerplate | 2 days     | 15 min      | ~100x       |
| Tests       | 1 day      | 15 min      | ~50x        |
| Feature     | 1 week     | 30 min      | ~30x        |
| Bug fix     | 4 hours    | 15 min      | ~20x        |


Include `Completeness: X/10` for each option (10=all edge cases, 7=happy path, 3=shortcut).

## Repo Ownership — See Something, Say Something

- You own everything. Investigate and offer to fix proactively.
- Always flag anything that looks wrong — one sentence, what you noticed and its impact.

## Search Before Building

Before building anything unfamiliar, **search first.**

- **Layer 1** (tried and true) — don't reinvent. **Layer 2** (new and popular) — scrutinize. **Layer 3** (first principles) — prize above all.

**Eureka:** When first-principles reasoning contradicts conventional wisdom, name it and log:

```bash
mkdir -p .cursor/analytics && jq -n --arg ts "$(date -u +%Y-%m-%dT%H:%M:%SZ)" --arg skill "SKILL_NAME" --arg branch "$(git branch --show-current 2>/dev/null)" --arg insight "ONE_LINE_SUMMARY" '{ts:$ts,skill:$skill,branch:$branch,insight:$insight}' >> .cursor/analytics/eureka.jsonl 2>/dev/null || true
```

## Completion Status Protocol

When completing a skill workflow, report status using one of:

- **DONE** — All steps completed successfully. Evidence provided for each claim.
- **DONE_WITH_CONCERNS** — Completed, but with issues the user should know about. List each concern.
- **BLOCKED** — Cannot proceed. State what is blocking and what was tried.
- **NEEDS_CONTEXT** — Missing information required to continue. State exactly what you need.

### Escalation

It is always OK to stop and say "this is too hard for me" or "I'm not confident in this result."

Bad work is worse than no work. You will not be penalized for escalating.

- If you have attempted a task 3 times without success, STOP and escalate.
- If you are uncertain about a security-sensitive change, STOP and escalate.
- If the scope of work exceeds what you can verify, STOP and escalate.

Escalation format:

```
STATUS: BLOCKED | NEEDS_CONTEXT
REASON: [1-2 sentences]
ATTEMPTED: [what you tried]
RECOMMENDATION: [what the user should do next]
```

## Operational Self-Improvement

Before completing, reflect on this session:

- Did any commands fail unexpectedly?
- Did you take a wrong approach and have to backtrack?
- Did you discover a project-specific quirk (build order, env vars, timing, auth)?
- Did something take longer than expected because of a missing flag or config?

If yes, log an operational learning for future sessions:

```bash
mkdir -p .cursor/analytics && jq -n --arg ts "$(date -u +%Y-%m-%dT%H:%M:%SZ)" --arg skill "SKILL_NAME" --arg type "operational" --arg key "SHORT_KEY" --arg insight "DESCRIPTION" --arg confidence "N" --arg source "observed" '{ts:$ts,skill:$skill,type:$type,key:$key,insight:$insight,confidence:$confidence,source:$source}' >> .cursor/analytics/learnings.jsonl 2>/dev/null || true
```

Replace SKILL_NAME with the current skill name. Only log genuine operational discoveries.
Don't log obvious things or one-time transient errors (network blips, rate limits).
A good test: would knowing this save 5+ minutes in a future session? If yes, log it.

## Learned User Preferences

- Copywriting must sound natural and personalized — actively reduce em-dashes, avoid AI-sounding patterns, use the humanizer skill for content review
- Design balance is "fun but elegant" — bold personality within tasteful bounds, reject generic corporate or overly flashy elements (e.g. sparkle effects, "vibe" badges)
- Serif fonts (Vollkorn, Source Serif 4) are the primary typographic voice, with Libre Franklin for UI elements. Readability across all platforms and screen sizes is non-negotiable
- External assets (images, book covers) should be downloaded and stored locally for performance rather than hotlinked
- Images in containers should fit without cropping — reduce image size to fit rather than clipping at container edges
- Plan-first workflow: brainstorm/review first, create plan docs in docs/plans/, then implement from the plan
- Links to PDFs and external documents should open in a new tab (target="_blank"), not trigger direct downloads
- Button icons should use proper metaphors (download-with-tray icon for downloads, not bare chevrons)
- Prefer improving design elements in place rather than removing functionality
- Critical about icon sizing and click targets (16px icons too small for mobile interaction)

## Learned Workspace Facts

- Tech stack: Astro framework, pnpm package manager, Tailwind CSS for styling
- Deployed on Cloudflare Pages, domain is samuelthien.site
- PostHog analytics integrated with centralized event names and a shared capture utility
- Site sections: About, Selected Work (projects), Bookshelf, Experience (work history), Talks, Writing (technical blog)
- Key projects on the site: ReplyHero (cofounded, auto-reply SaaS), YoTalent (AI hackathon champion at Mercedes), AI PR Review (VSCode extension), datetime-helper
- Bookshelf page features: "The Beginning of Infinity" (general), "Designing Data-Intensive Applications" and "Building Evolutionary Architecture" (technical)
- Talks section: talk data in src/data/talks.ts with `pdfPath` (required) + optional `slidesPath` supporting both interactive Slidev and PDF-only talks; Slidev talks served as static HTML from public/talks/; links need `data-astro-reload` to bypass Astro View Transitions (ClientRouter); `serveSpaFallback` Vite plugin in astro.config.mjs resolves directory URLs to index.html in dev
- Resume PDF at public/samuel-thien-resume.pdf, linked from Hero section as secondary CTA with PostHog tracking
- Slidev presentations build automatically from slides/ directory during site builds to avoid committing build artifacts
- Slidev frontmatter must NOT include `download: true` — it triggers Playwright PDF export during build, which fails in CI (Cloudflare Pages has no Chromium). Use `pnpm build:slides:pdf` locally instead.
- Build pipeline uses build:slides script that installs dependencies and builds with correct base path
- Node.js >= 22.12.0 required for Astro build; use `nvm use 22` since default shell may have v20.x
- `durable-execution-talk.pdf` is manually committed via .gitignore negation (`public/talks/durable-execution/*` + `!...pdf`); regenerate with `pnpm build:slides:pdf` when slides change
- SPA routing issues require _redirects configuration for Cloudflare Pages to handle deep links
- `public/_headers` configures Cloudflare Pages Content-Type headers (e.g. `application/xml` for sitemap files)
- Technology tags use `@iconify-json/logos` for brand icons with text-only fallback for unlisted techs; no custom SVG icon maps
- Writing section: MDX blog posts in src/content/writing/, rendered via BlogPost.astro layout with hand-written .prose CSS (not @tailwindcss/typography), max-width 720px centered
- Blog components: Callout (4 types: definition/takeaway/gotcha/in-practice with icons), Mermaid (chart prop, not slot, rendered via CDN), Details (open by default)
- Blog design rules: no side-stripe borders (banned by impeccable), full borders + background tints on callouts/blockquotes, OKLCH colors, code captions connect to code blocks via shared dark background
- Mermaid in MDX must use chart prop (`<Mermaid chart={`...`} />`) because MDX wraps slot content in `<p>` tags which breaks mermaid parsing

