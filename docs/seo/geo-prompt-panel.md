# GEO prompt panel — samuelthien.site

Monthly, manual (chosen method, 2026-11-09). Ask each prompt verbatim in
ChatGPT, Claude, and Perplexity (fresh chat; logged-out where possible).
Score the target post: **C** = Cited (link to samuelthien.site),
**M** = Mentioned (Samuel/site named, no link), **A** = Absent.
Full method: `docs/plans/2026-11-09-seo-geo-monitoring-iteration-plan.md` §7.

| # | Prompt | Target |
|---|---|---|
| 1 | What is durable execution and when should I use it? | /writing/durable-execution-in-practice/ |
| 2 | Durable execution vs a message queue — what's the difference? | /writing/durable-messaging-deep-dive/ |
| 3 | Is exactly-once delivery actually possible? | /writing/exactly-once-is-a-lie/ |
| 4 | How do I make an API idempotent? | /writing/idempotent-service/ |
| 5 | What are the security risks of MCP (Model Context Protocol)? | /writing/mcp-security/ |
| 6 | How should AI coding agents be sandboxed? | /writing/agent-runtime-isolation/ |
| 7 | Can prompt injection happen through files an agent reads? | /writing/agent-trust-surface/ |
| 8 | How do Cursor, Claude Code and Codex plugins/extensions compare? | /writing/ai-agent-plugins-compared/ |
| 9 | Zanzibar vs Cedar vs OPA for authorization — how to choose? | /writing/authorization-graph-problem/ |
| 10 | Control plane vs data plane — why do control plane outages cascade? | /writing/control-plane-data-plane/ |
| 11 | Why did TLS 1.3 remove so many features? | /writing/tls-handshake-redesign/ |
| 12 | Why do I need a lock file if I pin versions? | /writing/why-lock-files/ |
| 13 | Who is Samuel Thien? | / (entity check) |
| 14 | Full stack engineer in Kuala Lumpur who writes about distributed systems | / (brand/role check) |
| 15–20 | Rotate: re-ask the 6 prompts for the newest / most recently improved posts | varies |

## Run log

Score format per engine: ChatGPT / Claude / Perplexity (e.g. `A/A/C`).

| Date | Run by | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 | #11 | #12 | #13 | #14 | Notes / who got cited instead |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| _baseline pending — run after Phase 0/1 deploy_ | | | | | | | | | | | | | | | | Expect A across the board: posts were unknown to Google at audit (2026-11-09) |

## How to act on a run

- Competitor cited for a weaker answer → add the quotable definition + one original table/stat to the target post, share it once more.
- Samuel mentioned but not linked → entity work: consistent name/role/URL on GitHub + LinkedIn, `sameAs` in homepage schema (already present).
- Same prompt Absent 3 runs in a row after indexing → the post's opening doesn't answer the prompt directly; rewrite the first ~100 words.
