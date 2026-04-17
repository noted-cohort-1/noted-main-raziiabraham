---
type: vision
last_updated: 2026-04-18
---

# Noted — Product Vision

## What Noted is

A collaborative, AI-native note-taking app in the Notion lineage. Rich block-based editing, instant real-time backend, AI built in at two levels (in-editor and as an agent chat), bring-your-own-key for model providers.

## Who it's for

Individual power users and small teams who want Notion's shape but with:
- **AI without a markup** — BYO API key for OpenAI, Anthropic, or Google.
- **Multiple model providers** — not locked to one.
- **A clean, fast editor** on Blocknote.

## Where Noted is today (2026-Q2)

Honest snapshot:

| Surface | Status |
|---|---|
| Block-based editor (Blocknote) | ✅ live |
| Personal workspaces (single-user) | ✅ live |
| AI settings + model picker (3 providers, encrypted keys) | ✅ live |
| In-editor "Ask AI" (streaming + accept/reject/retry) | ✅ live |
| Coworker chat with custom Squad Agents | ✅ live |
| Publish-to-web (read-only public link) | ✅ live |
| File uploads (25MB hard cap) | ✅ live |
| Team workspaces, multi-user editing, comments, @mentions | ❌ not yet |
| Paid plans, Stripe billing, subscription management | ❌ not yet |

See [team-os/feature-index.yaml](../feature-index.yaml) for what's tracked.

## What we're not

- **Not a database tool.** Notion databases, properties, relations, rollups — out of scope. Pages are pages.
- **Not a wiki platform.** We don't optimize for cross-team knowledge bases with complex permissions.
- **Not a content CMS.** Publish-to-web exists, but we're not trying to replace Webflow or Substack.

## The flywheel we believe in

A user who experiences real AI productivity in the editor will create more pages, invite collaborators, and eventually pay for team features. The three loops are:

1. **AI → engagement.** Every AI-assisted page is a page the user wouldn't have finished otherwise.
2. **Sharing → growth.** Publish-to-web and (later) team invites spread Noted to new users for free.
3. **Teams → revenue.** Individuals on free plans; teams on paid plans. (This is the part not yet built.)

## Open strategic questions

- **Do we eventually offer hosted AI** so users don't have to bring a key? Opens a cost / metering story.
- **How much Notion-parity is enough?** The original specs mapped 1:1 to Notion. We've intentionally diverged on AI (BYOK, multi-provider) and simplified on collaboration (zero shipped). The team-collab PRD should revisit scope rather than re-target parity.
- **When does the paywall appear?** Noted currently generates no revenue. The first paid feature is an explicit decision — what, when, at what price.
