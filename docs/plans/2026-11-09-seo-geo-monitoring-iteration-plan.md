---
title: "SEO + GEO monitoring and iteration plan — samuelthien.site"
type: plan
status: in-progress
date: 2026-11-09
property: "sc-domain:samuelthien.site"
branch: main
decisions:
  primary_goal: both_balanced # blog growth + name/role brand in parallel
  execution_scope: plan_plus_phase0_1 # plan + Phase 0 + Phase 1 now
  monitoring_system: scripted_weekly # repo script + dated markdown report via GSC MCP
  geo_tracking: manual_prompt_panel # ~20 fixed prompts, monthly, logged
---

# SEO + GEO monitoring and iteration plan — samuelthien.site

## 1. Baseline audit (2026-11-09, via gscServer MCP — live data, not estimates)

Property: `sc-domain:samuelthien.site` (siteOwner). All figures below were pulled
2026-11-09 from Google Search Console (GSC) + live-site checks.

### 1.1 Performance — effectively zero

| Window | Clicks | Impressions | CTR | Avg position | Source (MCP tool) |
|---|---|---|---|---|---|
| Last 28d (2026-10-12 → 11-08) | **0** | **6** | 0% | 2.3 | `get_performance_overview(days=28)` |
| Last 90d (2026-08-11 → 11-09) | **0** | **11** | 0% | 17.3 | `get_performance_overview(days=90)` |
| Last 180d, by device | 0 | 28 (27 desktop, 1 mobile) | 0% | ~11.7 | `get_search_analytics(dimensions=device)` |
| Query data, 90d | — | — | — | — | `get_search_analytics(dimensions=query)` → **no rows returned** |

28d vs prior 28d (2026-09-14 → 10-11), by page (`compare_search_periods`): only 4
rows exist in total — homepage (6 vs 2 impressions), `yotalent.samuelthien.site`
(3 vs 1 — subdomain noise inside the domain property), DDIA bookshelf page
(1 vs 1), bookshelf index (1 vs 1). Everything else: never shown.

### 1.2 Indexing — the core problem: 16 of 19 URLs are unknown to Google

`batch_url_inspection` + sitemap (19 URLs in `https://samuelthien.site/sitemap-0.xml`):

| URL | Verdict | Coverage | Last crawled |
|---|---|---|---|
| `/` | PASS | Submitted and indexed | 2026-11-03 |
| `/bookshelf/` | PASS | Submitted and indexed | 2026-09-18 |
| `/bookshelf/designing-data-intensive-applications/` | PASS | Submitted and indexed | 2026-10-13 |
| `/writing/` + all 12 posts (`/writing/*`) | NEUTRAL | **URL is unknown to Google** | Never |
| `/talks/` | NEUTRAL | **URL is unknown to Google** | Never |
| `/bookshelf/the-beginning-of-infinity/`, `/bookshelf/building-evolutionary-architectures/` | NEUTRAL | **URL is unknown to Google** | Never |

**16 of 19 sitemap URLs have never been crawled.** The 12 blog posts (published
2026-05-10 → 05-24) have had ~6 months to be discovered and were not.

### 1.3 Root causes found

1. **Sitemap exists but was never submitted to GSC.** `get_sitemaps` and
   `list_sitemaps_enhanced` both return "No sitemaps found", even though
   `robots.txt` references `https://samuelthien.site/sitemap-index.xml` and
   `@astrojs/sitemap` generates it. Robots-reference alone has not resulted in
   Google processing it for this property.
2. **No `BlogPosting`/`Article` structured data anywhere.** Only JSON-LD on the
   site is `Person` + `WebSite`, and only on the homepage (`src/layouts/Base.astro`,
   gated by `isHome`). `src/layouts/BlogPost.astro` emits no schema, no
   `dateModified`, no author entity. Google and AI engines get no machine-readable
   article/author signal. `rich_results: null` on every inspected URL.
3. **`/llms.txt` is a false 200.** `curl https://samuelthien.site/llms.txt`
   returns the homepage HTML (SPA fallback), not a real llms.txt. AI crawlers
   that look for it get duplicate homepage content.
4. **Per-post OG images not wired.** `src/pages/og/[...slug].png.ts` only
   generates `index` and `bookshelf/*`. All 12 posts fall back to
   `/og-default.png` — weak for sharing, which is a discovery channel.
5. **Zero internal links between posts.** A live post
   (`/writing/exactly-once-is-a-lie/`) contains no `href="/writing/…"` links.
   Series relationships that exist in the writing (exactly-once →
   durable-execution → durable-messaging) are not surfaced as links. The
   writing index links to all posts, but nothing links back or across.
6. **Canonical inconsistency.** Section pages use no trailing slash
   (`/writing`, `/talks`, `/bookshelf/<slug>`) while post URLs resolve with a
   trailing slash (`/writing/mcp-security/`). Harmless today, worth normalising
   before Google builds the wrong canonical set at scale.
7. **Soft-404s.** Unknown URLs (e.g. `/this-page-does-not-exist-xyz/`,
   `/llms-full.txt`) return HTTP 200 with the homepage HTML. Google treats
   these as soft-404s/duplicates and they waste crawl attention. Fixed with a
   real `src/pages/404.astro` (excluded from the sitemap, `noindex`).
8. **GSC MCP is read-only for writes.** `submit_sitemap` via gscServer returns
   `403 insufficient authentication scopes` (verified 2026-11-09). Reads,
   inspection and analytics work; sitemap submission and indexing requests are
   manual GSC-UI actions for Samuel (30 seconds each, see Phase 0.1/0.2).
7. **What is already good (do not redo):** canonical tags, meta descriptions,
   OG/Twitter tags on every page; AI bots (GPTBot, ClaudeBot, PerplexityBot,
   Google-Extended, Bingbot) all get HTTP 200 — not blocked; good heading
   structure, definitional callouts and original stats in posts (strong raw
   material for AI citation once discovered).

### 1.4 Diagnosis in one sentence

This is not a ranking problem, a content problem, or an AI problem yet — it is
a **discovery/indexing failure**: Google has never been told, in a way it acted
on, that 84% of the site exists. Every later SEO/GEO lever is blocked behind it.

## 2. Strategy — both_balanced

Two tracks, sequenced by the diagnosis:

- **Track A — Technical SEO (unblock + compound).** Fix discovery, indexing,
  structured data, internal linking. This is the Phase 0/1 work below.
- **Track B — GEO (AI citation).** Make each post the most citable answer to a
  specific engineering question: clear definition in the first ~100 words,
  named entities, original numbers, author/date signals, `llms.txt`, and
  content that AI engines can quote without the surrounding page.

Brand/role ("Samuel Thien", "full stack engineer Kuala Lumpur") already sits at
position ~2 with no effort — it is maintained by Track A hygiene, not a
separate campaign.

## 3. KPI framework — what "good" looks like, by horizon

Do not judge by clicks in month 1. Judge in this order: indexing → impressions
→ query breadth → clicks/CTR → AI citations.

| KPI | Baseline (2026-11-09) | Day 14 | Day 30 | Day 60 | Day 90 | Tool |
|---|---|---|---|---|---|---|
| Sitemap URLs indexed | 3 / 19 (16%) | 19 / 19 | 19 / 19 | 19 / 19 | all new posts ≤7d | `batch_url_inspection` |
| Sitemap status in GSC | not submitted | Success, 0 errors | — | — | — | `get_sitemaps` |
| Impressions / 28d | 6 | — | 100+ | 500+ | 1,500+ | `get_performance_overview(28)` |
| Distinct queries / 28d | 0 rows | first rows appear | 25+ | 75+ | 150+ | `get_search_analytics(query)` |
| Clicks / 28d | 0 | 0 (expected) | first clicks | 10+ | 30+ | `get_performance_overview(28)` |
| Queries in position 4–20 ("striking distance") | 0 | — | 5+ | 15+ | 30+ | `get_advanced_search_analytics` sorted by position |
| Pages with impressions | 3–4 | 10+ | 15+ | 19+ | 19 + new | `get_search_analytics(page)` |
| GEO: prompt panel citations (§7) | 0 / 20 (assumed, to verify) | baseline run | ≥1 post cited | 3+ posts cited | 5+ posts, ≥25% prompts | Manual panel |
| AI referral sessions (PostHog, later) | not segmented | — | baseline | trend | trend | PostHog (deferred per decision: panel only) |

Targets are directional for a new personal site in competitive technical
topics — the commitment is the *measurement cadence*, not the exact number.

## 4. The monitoring system — scripted_weekly

### 4.1 Weekly (15 min, every Monday)

1. Run the live-site audit script (no credentials needed):
   `node scripts/seo-check.mjs` → writes `docs/seo/reports/YYYY-MM-DD.md`
   (checks: every sitemap URL returns 200, title/description/canonical present,
   JSON-LD present on posts, `llms.txt` is real text, no fake-200s).
2. Pull GSC numbers via gscServer MCP (exact calls in §4.4) and paste the
   totals into that week's report: impressions/clicks/CTR/position (28d),
   top pages, top queries, striking-distance queries.
3. Check indexing spot-set: homepage, writing index, newest post, one random
   post (`batch_url_inspection`, max 10 URLs/batch).
4. Log one line in the tracker: what changed last week, what we change this week.
   **Rule: one iteration per week, tied to a number in the report.**

### 4.2 Monthly (45 min, first Monday)

1. `compare_search_periods`: this 28d vs prior 28d, by `page` and by `query`.
2. Full indexing sweep of all sitemap URLs (2 batches).
3. GEO prompt panel run (§7) — 20 prompts × ChatGPT / Claude / Perplexity,
   log cited / mentioned / absent per post.
4. Review striking-distance queries (position 4–20, impressions ≥5): pick the
   top 2 and improve those posts (title, intro definition, internal links).
5. Review zero-impression pages: if a post has 0 impressions 30d after
   indexing, it gets a title/intro rewrite or is merged/linked from a stronger post.
6. Check Bing Webmaster Tools (same sitemap) + `site:` spot checks in
   ChatGPT Search / Perplexity for the newest post title.

### 4.3 Quarterly (half day)

- Content audit: update `dateModified` only when content materially changes;
  refresh stats/screenshots; consolidate cannibalising posts (watch for two
  posts ranking for the same query in `get_search_by_page_query`).
- GEO deep check: is the site cited for the *author* entity ("who is Samuel
  Thien")? Are GitHub/LinkedIn `sameAs` profiles consistent (name, role, site)?
- Backlink review: every talk, guest post, or social share should link to the
  canonical post URL — distribution is the backlink strategy for a personal site.
- Re-run this plan's §1 audit in full; update the baseline table.

### 4.4 Exact GSC MCP query set (copy-paste each week/month)

```
list_properties                                        # confirm sc-domain:samuelthien.site
get_performance_overview  site_url=sc-domain:samuelthien.site, days=28   # and days=90 monthly
get_search_analytics      dimensions=page,  days=28, row_limit=50
get_search_analytics      dimensions=query, days=28, row_limit=50
get_advanced_search_analytics dimensions=query,page, sort_by=position, sort_direction=ascending  # striking distance
get_sitemaps              site_url=sc-domain:samuelthien.site            # must stay "Success"
batch_url_inspection      # ≤10 URLs per batch, all sitemap URLs monthly
compare_search_periods    # monthly: current 28d (period1) vs prior 28d (period2), dimensions=page then query
get_search_by_page_query  # when a single post needs diagnosis
```

Note: the domain property also captures `yotalent.samuelthien.site` — always
read page rows filtered to `samuelthien.site` (exclude subdomains) so the
numbers are not polluted.

### 4.5 Alert thresholds (act, don't just watch)

| Signal | Threshold | Action |
|---|---|---|
| Indexed count drops | any previously indexed URL → NEUTRAL/FAIL | Inspect URL, check deploy/canonical, resubmit sitemap |
| Sitemap status | error / could not fetch | `manage_sitemaps` resubmit; verify live `sitemap-index.xml` |
| Impressions fall | −40% 28d-over-28d with no deploy | Compare periods by page; check indexing before touching content |
| Striking-distance query | position 4–20 + impressions growing 2 wks | On-page sprint on that post (§6 playbook) |
| New post not indexed | >7 days after publish | Internal-link it from homepage writing section + a related post; manual "Request indexing" in GSC UI (no API exists for this) |

## 5. Execution plan

### Phase 0 — Discovery emergency (this week) — IN SCOPE NOW

| # | Action | How | Verify |
|---|---|---|---|
| 0.1 | Submit sitemap to GSC | **Manual (user):** GSC UI → Sitemaps → enter `sitemap-index.xml` → Submit. Attempted via gscServer MCP on 2026-11-09: `403 insufficient authentication scopes` — the MCP token is read-only | `get_sitemaps` (MCP, readable) shows it, status Success |
| 0.2 | Request indexing (manual, user) | GSC UI → URL Inspection → Request Indexing for `/writing/` + 12 posts + `/talks/` (daily quota ~10–12; do posts first). **No API/MCP tool can do this** — sitemap submission is the automated path, manual requests accelerate the top pages | Inspection verdict flips NEUTRAL → PASS over following days |
| 0.3 | Real `/llms.txt` | Create `public/llms.txt`: who Samuel is, what the site covers, canonical links to all posts/talks/books with one-line descriptions (llmstxt.org format) | `curl /llms.txt` returns text/plain content, not homepage HTML |
| 0.4 | `llms-full.txt` (optional but cheap) | Full text of posts is already HTML-crawlable; defer unless panel shows AI engines missing content. **Deferred.** | — |
| 0.5 | Robots hygiene | Keep `Allow: /` + sitemap line; explicitly welcome AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) so intent is unambiguous | `curl /robots.txt` |
| 0.6 | Confirm no crawl blockers | `seo-check.mjs`: all 19 URLs 200, no `noindex`, canonical self-referencing | Script report green |

### Phase 1 — Machine-readability + internal linking (this week) — IN SCOPE NOW

| # | Action | Files | Verify |
|---|---|---|---|
| 1.1 | `BlogPosting` JSON-LD on every post: headline, description, author (`Person` + `sameAs` GitHub/LinkedIn), `datePublished`, `dateModified`, `mainEntityOfPage`, keywords/tags, word-count | `src/layouts/BlogPost.astro` (via `Base` structured-data prop or inline), `src/pages/writing/[slug].astro` passes dates/tags | Live post HTML contains valid JSON-LD; GSC rich-results appears on re-inspection |
| 1.2 | `ProfilePage`/`Person` stays on homepage; add `Blog`/`ItemList` on `/writing/` listing posts | `src/pages/writing/index.astro` | JSON-LD present on `/writing/` |
| 1.3 | Per-post OG images | Extend `src/pages/og/[...slug].png.ts` `getStaticPaths` to include all writing posts (title + subtitle); wire `ogImage={`/og/writing/${slug}.png`}` in `[slug].astro` → `BlogPost.astro` → `Base.astro` | `curl` post shows `/og/writing/<slug>.png`, image returns 200 image/png |
| 1.4 | Related posts (internal linking) | In `[slug].astro`, compute 3 related posts by shared tags; render "Keep reading" in `BlogPost.astro`. Every post links to ≥2 others; series posts (exactly-once → durable-execution → durable-messaging) link explicitly | Every live post has ≥2 `/writing/…` links |
| 1.5 | Canonical trailing-slash cleanup | Normalise `canonicalPath` values to trailing-slash form matching resolved URLs (`/writing/`, `/talks/`, `/bookshelf/<slug>/`, posts already `/`) | Canonical == final URL on all templates |
| 1.6 | Weekly script + report template + GEO tracker | `scripts/seo-check.mjs`, `docs/seo/reports/`, `docs/seo/geo-prompt-panel.md` | First baseline report generated |

### Phase 2 — Rank what Google starts showing (weeks 3–8, data-led)

Only start when impressions exist. Per striking-distance query (position 4–20):

1. `get_search_by_page_query` for the ranking post — is the query the post's
   intended topic, or an accidental one?
2. If intended: strengthen title tag (query language, keep voice), add the
   direct definition/answer in the first 100 words (also the GEO move), add a
   comparison table or FAQ-shaped H2s where the content honestly supports it.
3. Add 2 internal links to that post from related posts with descriptive anchors.
4. Wait 14 days, re-measure. **Never change title + content + links in the
   same week for the same post if you want to know what worked** — in practice
   for a small site, batch them and accept weaker attribution.

Content expansion (new posts) follows the same rule: each new post targets one
primary question (e.g. "durable execution vs workflow engine"), is linked from
≥2 existing posts on publish day, and is submitted via sitemap (automatic) +
manual indexing request.

### Phase 3 — GEO compounding (monthly, from month 2)

- Keep every post's opening: definition → why it matters → original example/stat.
  AI engines cite passages, not pages.
- Prefer citing primary sources in posts (papers, official docs) — engines
  follow citation chains.
- Distribute where engines learn: dev.to / Hashnode cross-posts with
  `rel=canonical` to samuelthien.site, GitHub profile README linking key posts,
  talks pages linking the written version. Same content, canonical here.
- Entity consistency: name, role, employer, and site URL identical across
  GitHub, LinkedIn, and the homepage `Person` schema.

## 6. Iteration playbooks (decision rules, so weekly checks end in action)

| Observation | Play |
|---|---|
| Indexed but 0 impressions after 30d | Title/intro rewrite around the question the post answers; add internal links from the two most-related posts; re-check in 14d |
| Impressions, position 30+ | Content depth gap — add the missing subtopic the top results cover; do not keyword-stuff |
| Position 4–20, CTR below page average | Title/meta rewrite only (clearer payoff, numbers where honest) |
| Position 1–3, 0 clicks | Likely branded/AI-Overview absorption — check GEO panel; improve description for the click, don't chase position |
| Two posts compete for one query (`get_search_by_page_query` overlap) | Merge or differentiate titles/intros; canonical intent per post |
| AI cites a competitor's weaker answer | Add the quotable definition + a small original table/stat to your post; distribute that post once more |
| AI mentions Samuel but no link/citation | Entity work: `sameAs`, author bylines, GitHub/LinkedIn profile links to the post |

## 7. GEO prompt panel (manual, monthly — chosen method)

Fixed prompts — ask verbatim in ChatGPT, Claude, Perplexity (logged-out /
fresh chat where possible). Score per post: **Cited** (link), **Mentioned**
(name/site, no link), **Absent**. Tracker: `docs/seo/geo-prompt-panel.md`.

Mapping (prompt → target post):

1. "What is durable execution and when should I use it?" → `durable-execution-in-practice`
2. "Durable execution vs a message queue — what's the difference?" → `durable-messaging-deep-dive`
3. "Is exactly-once delivery actually possible?" → `exactly-once-is-a-lie`
4. "How do I make an API idempotent?" → `idempotent-service`
5. "What are the security risks of MCP (Model Context Protocol)?" → `mcp-security`
6. "How should AI coding agents be sandboxed?" → `agent-runtime-isolation`
7. "Can prompt injection happen through files an agent reads?" → `agent-trust-surface`
8. "How do Cursor, Claude Code and Codex plugins/extensions compare?" → `ai-agent-plugins-compared`
9. "Zanzibar vs Cedar vs OPA for authorization — how to choose?" → `authorization-graph-problem`
10. "Control plane vs data plane — why do control plane outages cascade?" → `control-plane-data-plane`
11. "Why did TLS 1.3 remove so many features?" → `tls-handshake-redesign`
12. "Why do I need a lock file if I pin versions?" → `why-lock-files`
13. "Who is Samuel Thien?" → homepage (entity check)
14. "Full stack engineer in Kuala Lumpur who writes about distributed systems" → homepage (brand/role check)
15–20. Rotate: re-ask the 6 prompts for the newest / most recently improved posts.

Baseline run happens after Phase 0/1 deploys (crawlers need the fixed site);
expect Absent across the board at baseline — that is the honest zero.

## 8. Roles, cadence, time budget

| Cadence | Who | Time | Output |
|---|---|---|---|
| Weekly | Agent (via GSC MCP + script) or Samuel | 15 min | `docs/seo/reports/YYYY-MM-DD.md` + 1 change shipped |
| Per publish | Samuel | 10 min | Sitemap auto-updates; manual indexing request; 2 internal links in/out; share once |
| Monthly | Agent + Samuel review | 45 min | Period comparison, GEO panel results, 2 post improvements chosen |
| Quarterly | Samuel | Half day | Content/entity audit, plan refresh |

## 9. Risks and honest limits

- **GSC API/MCP cannot request indexing** and cannot force crawling. Sitemap
  submission + internal links + manual requests are the levers; indexing may
  still take days–weeks. That lag is Google's, not a plan failure.
- **GEO measurement is sampling, not analytics.** AI answers vary by session;
  the panel detects direction (absent → mentioned → cited), not precise share.
- **Small numbers lie.** Under ~1k impressions/28d, CTR and position averages
  swing wildly — act on indexing and query-breadth first.
- **Do not buy a GEO/SEO tool yet.** At 0 clicks, the free stack
  (GSC + Bing Webmaster + PostHog + this script) measures everything that matters.

## 10. Definition of done for this plan's execution

- [ ] Sitemap submitted and Success in GSC (Phase 0.1) — **manual, pending Samuel** (MCP read-only, 403 verified)
- [x] `/llms.txt` serves real content; robots welcomes AI crawlers (0.3, 0.5) — in code, pending deploy
- [x] Every post emits `BlogPosting` JSON-LD + per-post OG image (1.1, 1.3) — verified in local build
- [x] Every post links to ≥2 related posts (1.4); canonicals normalised (1.5) — verified: 3–5 internal links/post
- [x] `scripts/seo-check.mjs` runs clean (1.6) — ✅ PASS locally (19/19); production still shows 43 failures until deploy, which is the expected before/after delta
- [x] First weekly report under `docs/seo/reports/2026-11-09.md`; GEO panel tracker created (baseline run pending deploy)
- [ ] Manual indexing requests queued for Samuel in GSC UI (0.2 — user action)

## 11. Execution log

| Date | Item | Evidence |
|---|---|---|
| 2026-11-09 | Baseline GSC audit | 0 clicks / 6 impressions (28d); 3/19 indexed; all 12 posts "URL is unknown to Google" |
| 2026-11-09 | `submit_sitemap` via MCP attempted | `403 insufficient authentication scopes` — sitemap submission is manual |
| 2026-11-09 | Phase 0/1 code shipped (uncommitted on `main`) | `pnpm exec astro build` ✅ (20 pages, 12 new `/og/writing/*.png`); `node scripts/seo-check.mjs --base http://localhost:4321` ✅ PASS |
| 2026-11-09 | Production check (pre-deploy) | `node scripts/seo-check.mjs --no-write` → 43 failures — the quantified deploy delta |
| Next | Deploy → re-run `pnpm seo:check` on production → submit sitemap (GSC UI) → Request Indexing → weekly cadence starts | Plan §4 |
