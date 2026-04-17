# AI Features — Navigation

Everything the Noted team (or Claude) needs about the AI surface area of the product. **Start here if you're asking "what's the state of AI in Noted?".**

This dossier is the current-state truth. For the *historical* intent and the retrospective on what was planned vs. what shipped, see [`team-os/product/prds/ai-features/ai-features-prd.md`](../../product/prds/ai-features/ai-features-prd.md) and [`ai-agent-prd.md`](../../product/prds/ai-features/ai-agent-prd.md). (Original `specs/*.md` files were migrated into those retrospectives on 2026-04-18.)

## What's in this folder

| File | Read when |
|---|---|
| [status.md](status.md) | You need a current-state answer — shipped, beta, rollout %, known issues |
| [customer-talking-points.md](customer-talking-points.md) | You're talking to a customer or drafting a reply |
| [faq.md](faq.md) | A user asked a known common question |
| [index.md](index.md) | You want the full PRD-style writeup: what it is, why, how it works end-to-end |
| [ship-log.md](ship-log.md) | "When did this ship?" / "Which PR added X?" |

## Sub-features (all live)

1. **AI Settings** — user configures provider (OpenAI / Anthropic / Google), model, API key. Keys encrypted server-side (AES-256-GCM).
2. **In-Editor AI** — `/` slash menu → "Ask AI" inside the Blocknote editor. Streaming inline generation with Accept / Reject / Retry.
3. **Coworker Chat** — floating bottom-right panel. Persistent chat. Multi-agent. File upload. Resizable sidebar.
4. **Squad Agents** — custom named agents with instruction documents. Users create, edit, and chat with their own.

## Owners

- Product: `@raziiabraham`
- Engineering: `@avidx-app`

## Where the code lives

See [team-os/feature-index.yaml](../../feature-index.yaml) under `ai-features:` — it's the canonical list. Highlights:

- Convex: `convex/aiSettings*.ts`, `convex/coworkerMessages.ts`, `convex/squadAgents.ts`
- API routes: `app/api/ai/chat/route.ts`, `app/api/ai/coworker/route.ts`
- UI: `components/coworker/`, `components/editor.tsx`, `components/modals/settings-modal.tsx`
- Agent tooling: `lib/agent/`
- Model registry: `lib/ai-models.ts`
