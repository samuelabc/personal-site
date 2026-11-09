#!/usr/bin/env node
/**
 * Weekly SEO live-site check for samuelthien.site
 *
 * Usage:
 *   node scripts/seo-check.mjs                      # check production, write docs/seo/reports/YYYY-MM-DD.md
 *   node scripts/seo-check.mjs --base http://localhost:4321
 *   node scripts/seo-check.mjs --no-write           # print only
 *
 * Checks (no credentials, no dependencies — Node >= 22):
 *   - every sitemap URL returns 200 with title, description, self-canonical, og:image
 *   - /writing/<slug>/ pages emit BlogPosting JSON-LD and link to >= 2 other posts
 *   - /llms.txt is real text (not the homepage HTML fallback), /robots.txt lists the sitemap
 *   - a nonsense URL returns 404 (not a soft-404 homepage)
 *
 * GSC numbers (impressions/clicks/indexing) still come from Search Console —
 * paste them into the "GSC snapshot" section of the generated report.
 * See docs/plans/2026-11-09-seo-geo-monitoring-iteration-plan.md §4.4 for the exact MCP calls.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const baseArg = args.includes("--base") ? args[args.indexOf("--base") + 1] : "https://samuelthien.site";
const base = baseArg.replace(/\/$/, "");
const noWrite = args.includes("--no-write");
const today = new Date().toISOString().slice(0, 10);

async function fetchText(url) {
  const res = await fetch(url, { headers: { "user-agent": "seo-check/1.0 (+https://samuelthien.site)" } });
  return { status: res.status, contentType: res.headers.get("content-type") ?? "", body: await res.text() };
}

function extract(html, re) {
  return html.match(re)?.[1]?.trim() ?? "";
}

const failures = [];
const warnings = [];
const rows = [];

function check(condition, failureMessage) {
  if (!condition) failures.push(failureMessage);
  return condition;
}

// --- Sitemap discovery -------------------------------------------------------
const sitemapIndex = await fetchText(`${base}/sitemap-index.xml`);
check(sitemapIndex.status === 200, `sitemap-index.xml returned ${sitemapIndex.status}`);
const childSitemaps = [...sitemapIndex.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

let urls = [];
for (const child of childSitemaps) {
  const childPath = child.replace(/^https?:\/\/[^/]+/, "");
  const sitemap = await fetchText(`${base}${childPath}`);
  check(sitemap.status === 200, `${childPath} returned ${sitemap.status}`);
  urls.push(...[...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
}
if (urls.length === 0) warnings.push("No URLs found in sitemap");

// --- Per-URL checks ----------------------------------------------------------
for (const url of urls) {
  const path = url.replace(/^https?:\/\/[^/]+/, "") || "/";
  let page;
  try {
    page = await fetchText(`${base}${path}`);
  } catch (err) {
    failures.push(`${path}: fetch failed (${err.message})`);
    rows.push(`| ${path} | FETCH FAIL | | | | |`);
    continue;
  }

  const title = extract(page.body, /<title>([^<]*)<\/title>/i);
  const description = extract(page.body, /<meta name="description" content="([^"]*)"/i);
  const canonical = extract(page.body, /<link rel="canonical" href="([^"]*)"/i);
  const ogImage = extract(page.body, /<meta property="og:image" content="([^"]*)"/i);
  const robotsMeta = extract(page.body, /<meta name="robots" content="([^"]*)"/i);
  const jsonLdTypes = [...page.body.matchAll(/"@type":\s*"([^"]+)"/g)].map((m) => m[1]);
  const isPost = /^\/writing\/[^/]+\/$/.test(path);
  const writingLinks = new Set([...page.body.matchAll(/href="(\/writing\/[^"#]+)"/g)].map((m) => m[1])).size;

  check(page.status === 200, `${path}: HTTP ${page.status}`);
  check(title.length > 0, `${path}: missing <title>`);
  check(description.length >= 30, `${path}: meta description too short (${description.length} chars)`);
  check(canonical === url, `${path}: canonical "${canonical}" != sitemap URL "${url}"`);
  check(ogImage.length > 0, `${path}: missing og:image`);
  if (robotsMeta.includes("noindex") && path !== "/404/") failures.push(`${path}: unexpectedly noindex`);
  if (isPost) {
    check(jsonLdTypes.includes("BlogPosting"), `${path}: missing BlogPosting JSON-LD`);
    check(writingLinks >= 2, `${path}: only ${writingLinks} internal /writing/ links (want >= 2)`);
    check(!ogImage.endsWith("/og-default.png"), `${path}: still using default OG image`);
  }

  rows.push(
    `| ${path} | ${page.status} | ${title ? "ok" : "MISSING"} | ${description.length} | ${jsonLdTypes.join(",") || "—"} | ${isPost ? writingLinks : "—"} |`,
  );
}

// --- GEO / crawler files -------------------------------------------------------
const llms = await fetchText(`${base}/llms.txt`);
check(llms.status === 200, `/llms.txt returned ${llms.status}`);
check(!llms.body.trimStart().startsWith("<!DOCTYPE"), "/llms.txt serves homepage HTML (soft fallback), not a real llms.txt");
check(llms.body.includes("# Samuel Thien"), "/llms.txt missing '# Samuel Thien' heading");

const robots = await fetchText(`${base}/robots.txt`);
check(robots.body.includes("Sitemap:"), "/robots.txt missing Sitemap: line");
for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot"]) {
  if (!robots.body.includes(bot)) warnings.push(`/robots.txt does not explicitly mention ${bot}`);
}

// --- Soft-404 check ------------------------------------------------------------
const probe = await fetchText(`${base}/seo-check-nonexistent-${today}/`);
if (probe.status !== 404) {
  failures.push(`Soft-404: /seo-check-nonexistent-${today}/ returned ${probe.status} (want 404)`);
}

// --- Report ---------------------------------------------------------------------
const report = `# SEO weekly report — ${today}

Base: ${base}
Sitemap URLs checked: ${urls.length}
Result: ${failures.length === 0 ? "✅ PASS" : `❌ ${failures.length} failure(s)`}${warnings.length ? `, ${warnings.length} warning(s)` : ""}

## Page checks

| Path | HTTP | Title | Desc chars | JSON-LD types | Writing links |
|---|---|---|---|---|---|
${rows.join("\n")}

## Failures

${failures.length ? failures.map((f) => `- [ ] ${f}`).join("\n") : "None."}

## Warnings

${warnings.length ? warnings.map((w) => `- ${w}`).join("\n") : "None."}

## GSC snapshot (paste from Search Console via gscServer MCP — plan §4.4)

| Metric (28d) | This week | Last week |
|---|---|---|
| Clicks | | |
| Impressions | | |
| CTR | | |
| Avg position | | |
| Indexed / sitemap URLs | / ${urls.length} | |
| Distinct queries | | |

Top pages this week:
-

Top / striking-distance queries (position 4-20):
-

## This week's one iteration

- Change shipped:
- Tied to which number:
- Re-check date:
`;

console.log(report);
if (failures.length) {
  console.error(`\nseo-check: ${failures.length} failure(s)`);
}
if (!noWrite) {
  const dir = join(process.cwd(), "docs/seo/reports");
  mkdirSync(dir, { recursive: true });
  const out = join(dir, `${today}.md`);
  writeFileSync(out, report);
  console.error(`Report written to ${out}`);
}
process.exit(failures.length ? 1 : 0);
