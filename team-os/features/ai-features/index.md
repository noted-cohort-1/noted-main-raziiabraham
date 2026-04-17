---
type: feature-index
feature: ai-features
status: live
last_updated: 2026-04-17
owner_product: raziiabraham
owner_engineering: avidx-app
---

# AI Features — Full Writeup

Long-form reference for the AI surface in Noted. Written from the current code. If you need a short answer, use [status.md](status.md) or [customer-talking-points.md](customer-talking-points.md) instead. If you want the historical intent and the pivot retrospectives, see [`team-os/product/prds/ai-features/`](../../product/prds/ai-features/).

## What Noted ships today

Noted is a Notion-style, AI-native note-taking app. The AI surface has four sub-features, all merged to `main`:

1. **AI Settings** — user-owned API key storage and model selection
2. **In-Editor AI** — `/` → "Ask AI" inside the Blocknote editor
3. **Coworker Chat** — a floating, persistent chat panel with AI agents
4. **Squad Agents** — custom agents defined by instruction documents

The unifying design decision: **users bring their own API key**, and we support three model providers side-by-side (OpenAI, Anthropic, Google). This trades a "free AI tier" story for flexibility and zero upstream cost exposure.

## Sub-feature 1: AI Settings

**User story.** The first time a user tries to invoke AI, they hit a setup flow: pick a provider, paste an API key, pick a model. Repeat for as many providers as they want.

**Where the code lives.**
- Convex table: `aiSettings` ([convex/schema.ts](../../../convex/schema.ts) lines ~17–40). Stores `activeProvider`, `activeModel`, and encrypted per-provider keys (`openaiKey`, `anthropicKey`, `googleKey`). Indexed `by_user`.
- Convex queries/mutations: [convex/aiSettings.ts](../../../convex/aiSettings.ts) — `getSettings`, `deleteSettings`, `getSettingsWithKeys` (internal), `createSettings` (internal), `updateSettings` (internal).
- Encryption actions: [convex/aiSettingsActions.ts](../../../convex/aiSettingsActions.ts) — `saveSettings`, `testConnection`, `getDecryptedApiKey`. Keys encrypted with AES-256-GCM server-side before storage.
- UI: [components/modals/settings-modal.tsx](../../../components/modals/settings-modal.tsx) — tabbed modal with OpenAI / Anthropic / Google. Model dropdown populated from [lib/ai-models.ts](../../../lib/ai-models.ts) (25+ models).

**What a PM should care about.** Users hit friction on first-run (BYO-key can feel like work). No free trial of the AI today. Setup conversion is worth instrumenting.

## Sub-feature 2: In-Editor AI

**User story.** While writing a document, type `/`, pick "Ask AI", enter a prompt. Output streams inline with a blue agent cursor. Accept, reject, or retry.

**Where the code lives.**
- Editor: [components/editor.tsx](../../../components/editor.tsx) — Blocknote integration with `@blocknote/xl-ai@^0.46.1`.
- API route: [app/api/ai/chat/route.ts](../../../app/api/ai/chat/route.ts) — runs `streamText()` from Vercel AI SDK. Uses `createAIModel()` to pick provider, injects document-state messages via `injectDocumentStateMessages()`, uses the official Blocknote `aiDocumentFormats.html.systemPrompt`. Max duration 30s. Auth: Clerk bearer token.
- Transport: [lib/server-side-transport.ts](../../../lib/server-side-transport.ts) — custom AI transport that threads Convex auth through the streaming request.

**Known limits.**
- "Ask AI" is explicit, not ambient. No inline auto-complete.
- Context is cursor / selection scoped, not the full workspace.

## Sub-feature 3: Coworker Chat

**User story.** Bottom-right floating panel. Opens into a resizable sidebar (280–600px wide). Pick which agent to talk to from the dropdown. Chat with full history. Upload files. Streaming responses with reasoning traces when the model supports it (e.g., Gemini thinking).

**Where the code lives.**
- Convex table: `coworkerMessages` ([convex/schema.ts](../../../convex/schema.ts)). Fields: `role` (user|assistant), `agentId` (optional), `content`, `reasoning`, `toolInvocations`, `parts`. Indexed `by_user` and `by_user_time`.
- Convex queries/mutations: [convex/coworkerMessages.ts](../../../convex/coworkerMessages.ts) — `getMessages` (last 50), `getRecentMessages` (context window), `addMessage`, `clearHistory`.
- API route: [app/api/ai/coworker/route.ts](../../../app/api/ai/coworker/route.ts) — full agent loop via `streamText` + `stepCountIs(5)`. Loads agent instructions from the linked instruction doc. Creates workspace tools via `createWorkspaceTools()`. Supports Gemini thinking config. Max duration 60s. Auth: Clerk cookies + Convex token.
- UI: [components/coworker/](../../../components/coworker/) — floating chat, chat component, message renderer, quick actions, status, context selector.
- Hooks: [hooks/use-coworker.ts](../../../hooks/use-coworker.ts) (Zustand store for messages/streaming/error), [hooks/use-coworker-config.ts](../../../hooks/use-coworker-config.ts) (UI state — expanded, width, resizing).

## Sub-feature 4: Squad Agents

**User story.** A page at `/coworkers` shows a grid of agent cards. Click "Add Agent" to create one — Noted generates a random name and an instruction document. Open the document to write the agent's system prompt. The document's first "Summary" heading becomes the agent's short description in the UI.

**Where the code lives.**
- Convex table: `squadAgents` ([convex/schema.ts](../../../convex/schema.ts)). Fields: `name`, `description`, `icon` (emoji), `instructionsDocId` (links to a document holding the system prompt), `toolIds` (placeholder for future tools). Indexed `by_user`.
- Convex queries/mutations: [convex/squadAgents.ts](../../../convex/squadAgents.ts) — `list` (reads doc to extract dynamic description), `getById`, `create`, `update`, `remove`, `findByDocId`, `extractTextFromBlocks` (Blocknote JSON → plain text helper).
- UI: [app/(main)/(routes)/coworkers/page.tsx](../../../app/%28main%29/%28routes%29/coworkers/page.tsx), agent card at [app/(main)/_components/coworker-card.tsx](../../../app/%28main%29/_components/coworker-card.tsx).
- Agent tooling: [lib/agent/tools/workspace.ts](../../../lib/agent/tools/workspace.ts) — defines the workspace tool suite (read, write, edit, list, search documents). Includes Markdown → Blocknote conversion for writes.
- Prompts: [lib/agent/prompts/squad-prompts.ts](../../../lib/agent/prompts/squad-prompts.ts) — default system prompt + tool-calling instructions.

## Architecture notes

- **Three-provider switch** (`createAIModel`) is isolated in the API routes — it picks `@ai-sdk/openai`, `@ai-sdk/anthropic`, or `@ai-sdk/google` at request time based on the user's `aiSettings.activeProvider`. Adding a fourth provider is localized.
- **BlockNote → Markdown → BlockNote** conversion is the plumbing that lets agents create and edit documents while the editor stores Blocknote JSON.
- **Auth** is Clerk-first, Convex-second. The JWT template must be named `convex` (lowercase) — see [README.md](../../../README.md) troubleshooting.
- **Thinking modes** (Gemini 2.5) are plumbed through in the coworker route via `thinkingLevel` / `thinkingBudget`. Not exposed in the UI yet.

## Gaps vs. the original spec

The original specs (now migrated into retrospective PRDs at [`team-os/product/prds/ai-features/`](../../product/prds/ai-features/)) predicted a different shape. The code has moved on:

| Old spec | What actually shipped |
|---|---|
| "Advanced slash commands (/ai write, /ai summarize, etc.)" | One general "Ask AI" slash item with free-form prompts |
| "Create Page with AI" full-page generator | Not built as a home-screen CTA; agents can create docs via tools |
| Inline auto-complete | Not built |
| "ToolLoopAgent from AI SDK" | Implemented with `streamText` + `stepCountIs(5)` — same idea, different API |
| Anthropic + Google providers | ✅ Both shipped |
| "Four outputs" (feeds/collections/briefings/creative) | Not built — scope was dropped |
| Adology MCP integration | Not built |

The PRD-style truth is here. The old specs should be considered superseded; they're left in the repo for history.

## Open questions / ideas worth a PRD

- **Shared AI key** — should Noted offer a built-in provider so users don't have to BYO? Opens a meter/billing question.
- **Evaluations** — we have no regression eval harness for prompt or model changes. Worth one if AI-feature PRs keep growing.
- **External tools** — MCP would be the obvious way to extend agent tools beyond workspace-only. Only worth it if users actively ask.
- **Inline suggestions** — could be a toggle for users who want ambient AI; current "explicit-only" design is intentional.

## Links

- Master map for this feature: [team-os/feature-index.yaml](../../feature-index.yaml) under `ai-features:`.
- [status.md](status.md) — current state snapshot.
- [customer-talking-points.md](customer-talking-points.md) — what to say / not say.
- [faq.md](faq.md) — top user questions.
- [ship-log.md](ship-log.md) — record of merged PRs.
