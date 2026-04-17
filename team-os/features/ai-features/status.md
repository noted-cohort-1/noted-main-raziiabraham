---
type: feature-status
feature: ai-features
last_updated: 2026-04-17
owner: raziiabraham
---

# AI Features — Status

Overall state: **live**. All four sub-features (settings, in-editor AI, coworker chat, squad agents) are merged to `main` and available to users who bring their own API key.

## Sub-feature rollout

| Sub-feature | State | Rollout | Notes |
|---|---|---|---|
| AI Settings | ✅ live | 100% | Users configure OpenAI / Anthropic / Google API keys + model. Keys encrypted server-side. |
| In-Editor AI ("Ask AI") | ✅ live | 100% | Blocknote `/` slash menu → "Ask AI". Streaming with Accept / Reject / Retry. |
| Coworker Chat | ✅ live | 100% | Floating panel. Multi-agent selection. Supports file upload. Sidebar resizable 280–600px. |
| Squad Agents | ✅ live | 100% | Create / edit custom agents with instruction documents. Summary auto-extracted from the doc. |

## Known gaps (vs. what a customer might reasonably expect)

- **No inline auto-complete suggestions** — "Ask AI" is explicit, not ambient.
- **No "Create page with AI" one-click entry** — users have to open a doc first, then invoke AI.
- **Agent tools are basic** — workspace CRUD (read / write / edit / list / search documents). No MCP, no external tools yet. The original spec contemplated Adology MCP integration; that's not built.
- **No eval harness in repo** — we do not currently run regression evals on prompt or model changes.

## Known issues

- *(none tracked in this dossier today — update as they come up, or link from a bug-investigation in `team-os/engineering/bug-investigations/`.)*

## Cost / usage posture

- Users provide their own API keys. Noted does not proxy or meter usage through a shared key today.
- Anthropic is available (installed: `@ai-sdk/anthropic@^3.0.23`) — matches the code owner's own brand preferences.

## Last significant change

See [ship-log.md](ship-log.md). *(Empty on day one — engineering backfills as new PRs merge. Run `/ship-log <PR>` after every merge touching AI code paths.)*
