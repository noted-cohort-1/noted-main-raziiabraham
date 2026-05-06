---
type: constitution
last_ratified: 2026-05-06
version: 1.0.0
owner: avidx-app
---

# Noted Engineering Constitution

The small, stable list of non-negotiables that govern how this codebase grows. These rules are read by `/speckit.plan`'s Constitution Check and are binding for every change. They are not best-practice suggestions — deviation is a finding in `/noted-review` and a blocker for merge unless explicitly justified.

The principles below were drafted as part of Wave 1 of the Vibe PM course adaptation, seeded from the existing `.ai/skills/` and `.ai/INSTRUCTIONS.md`. They will be refined live with the first cohort in Module 4 of the course; the cohort version supersedes this one when ratified.

---

## I. Convex separation (NON-NEGOTIABLE)

Convex is the data layer. Queries, mutations, and actions each have one job:

- **Queries** are reactive reads. They never mutate state. They may read user data only after auth + ownership checks. They are subscribed to by `useQuery` on the client and re-render automatically when underlying data changes.
- **Mutations** are transactional writes. They run server-side, atomically, and are the only way to change Convex data. They must check auth → existence → ownership → validation in that order before writing.
- **Actions** are non-reactive. They are the only handler type that can call external HTTP services, the AI provider SDKs, or EdgeStore. They cannot directly mutate Convex tables — they call mutations as needed.

Picking the wrong type is a finding. A read that doesn't need to be reactive is fine as a query (Convex makes reactive reads cheap); a write hidden inside a query is a bug.

## II. Auth → existence → ownership → validation (NON-NEGOTIABLE)

Every Convex mutation or action that touches user data starts with the same four-line check, in this order:

```typescript
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Not authenticated");

const existing = await ctx.db.get(args.id);
if (!existing) throw new Error("<Thing> not found");

if (existing.userId !== identity.subject) throw new Error("Not authorized");

// validation of args here, then business logic
```

Order matters: never reveal whether a resource exists to an unauthenticated caller. Never check ownership before existence. The triad is the single most-violated rule in production code reviews; the `error-handling` skill lays out the canonical pattern.

## III. Errors are thrown, not returned (NON-NEGOTIABLE)

Use `throw new Error(message)` with the conventional vocabulary in the `error-handling` skill (`"Not authenticated"`, `"Not authorized"`, `"<Thing> not found"`, `"<Field> is required"`, etc.). Do not return `{ success: false, error: ... }` — callers will forget to check, and TypeScript can't help them.

Wrapping external API failures: `throw new Error(\`<service> failed: ${err}\`)` to preserve the original error in logs.

## IV. TypeScript strict, no `any` (NON-NEGOTIABLE)

`any` is forbidden. Use `unknown` + type guards, Zod parse, generics, or Convex's branded `Doc<>` / `Id<>` types. Type assertions (`as`) are a last resort after attempting to deduce the correct type via type guards or schema validation. The `typescript-patterns` skill enumerates the alternatives.

## V. No derived state in `useEffect` (NON-NEGOTIABLE)

If a value can be computed from props or existing state, compute it during render. Do not store it in state. Do not sync it via `useEffect`. The `derived-state` skill is the contract; `/noted-review` flags violations as a hard finding.

Specific noted corollary: **never sync `useQuery` results into local state**. Convex queries are already reactive — copying their result into `useState` introduces a render-extra-render loop and risks state drift.

## VI. Interaction logic in handlers, not effects (NON-NEGOTIABLE)

Side effects caused by user actions belong in `onClick`, `onSubmit`, `onChange`, mutation `onSuccess`, and library callbacks — never in `useEffect` watching a flag. The `effect-to-event` skill is the contract.

`useEffect` is for synchronization with external systems (DOM measurements, browser APIs, one-time mount initialization with a ref guard). It is not for reacting to user actions modeled as state.

## VII. Convex `useQuery` is the only reactive read on the client

Don't `fetch` inside `useEffect` for data that lives in Convex. Don't roll your own cache. Don't add TanStack Query — Convex's reactive subscriptions cover the client data-fetching surface noted needs today, and adding a parallel system means two sources of truth.

The exception: routes under `app/api/` that don't talk to Convex (e.g., the EdgeStore webhook). For those, plain `fetch` from the client into the route is fine.

## VIII. Linear ticket linkage (NON-NEGOTIABLE)

Every PR must reference a Linear ticket. The ticket prefix is `NOT-` (e.g., `NOT-142`). The branch name must include the ticket: `feature/not-142-document-presence` (or `bugfix/`, `hotfix/`). The PR description ends with `Closes NOT-142` so Linear auto-transitions the ticket to Done on merge.

Branches that don't follow this convention fail `/noted-review`'s ticket-alignment check. Drive-by commits (typo fixes, formatting) are fine inside a ticketed PR; standalone untracked work is not.

Branch flow: `feature/* → staging → main`. Features merge into `staging` first; `main` is the production line.

## IX. Quality gates pass before merge (NON-NEGOTIABLE)

```bash
npm run format && npm run lint:fix && npm run type:check && npm run test
```

All four must pass on every commit before merge. Coverage on touched files stays at or above 50% (per `jest.config.ts`'s `collectCoverageFrom`). The `code-quality-checklist` skill is the canonical pre-commit checklist.

CI catches plain formatting and lint; you fix it locally with `npm run format && npm run lint:fix`. Don't merge a red CI.

## X. File naming

- Files and directories: **kebab-case** (`coworker-message.tsx`, `use-search.tsx`).
- React component exports: **PascalCase**.
- Convex modules: **camelCase** (`aiSettings.ts`, `coworkerMessages.ts`) — this is Convex's own convention; module names become parts of the public API surface (`api.aiSettings.update`).
- Tests colocated as `<source>.test.ts(x)` next to the source file.

## XI. Server Components by default

In `app/`, default to React Server Components. Add `'use client'` only when a file uses hooks (`useState`, `useQuery`, `useEffect`, etc.) or browser APIs. This keeps bundles small and lets us push more rendering to the server.

## XII. shadcn primitives are read-only

Do not modify files under `components/ui/`. They are shadcn primitives and any modification will conflict with future shadcn updates. Wrap, don't edit: create variants in `components/<feature>/` that compose the primitive.

## XIII. AI feature surface conventions

AI-related code is concentrated in:

- `lib/agent/prompts/` — system prompts and prompt templates
- `lib/agent/tools/` — LLM-callable tools (Zod-validated input schemas, typed handlers)
- `convex/aiSettings.ts` / `aiSettingsActions.ts` — encrypted BYOK key storage and provider testing
- `convex/coworkerMessages.ts` — Coworker chat persistence
- `convex/squadAgents.ts` — Squad agent definitions

New AI tools follow the existing pattern: Zod schema for input, typed handler, registration with the agent that consumes it. AI conversation contents and tool inputs that contain user data are NEVER logged, NEVER tracked in analytics, and NEVER pasted into PRs or external services.

## XIV. team-os reflex

A feature is not "done" until:

1. The feature's dossier under `team-os/features/<slug>/` has been updated (status, what shipped, talking points).
2. A `ship-log.md` entry has been appended via the `/ship-log` command.
3. `team-os/feature-index.yaml` reflects the new status (e.g., `planned` → `live`).

This is what makes team-os work as a self-service knowledge base: every shipped feature lands in it, automatically. PRs that ship product code without these updates fail `/noted-review`'s ticket-alignment check.

## XV. Analytics: track decisions, not clicks

Major user-facing features and key interactions emit Amplitude events. Trivial UI interactions do not. The `event-tracking` skill defines the canonical event names, properties, and the DO/DON'T table. Events fire from event handlers (per principle VI), never from `useEffect`. Sensitive content (document body text, AI conversation contents, file contents, PII) NEVER goes into event properties — IDs only.

---

## Governance

This constitution is amended by PR. The current owner is `@avidx-app`. Material changes (adding/removing a principle) require sign-off from product and engineering leads. Stylistic changes (clarifying examples, tightening language) can be merged by any teammate with write access.

When `/speckit.plan` runs its Constitution Check and a feature's plan would violate one of the principles above, the plan must include a "Complexity Tracking" entry justifying the deviation, or the plan must be revised. There is no "we'll fix it later" — once a constitutional principle is ratified, deviations either revise the principle (via PR amendment) or get reverted.

When `/noted-review` finds a violation, the finding cites this constitution by section number (e.g., `Rule: Constitution §II — auth check missing before db.get`).

---

## Skills referenced

This constitution is enforced via these `.ai/skills/<name>/SKILL.md` files:

- `error-handling` (§II, §III)
- `typescript-patterns` (§IV)
- `derived-state` (§V)
- `effect-to-event` (§VI)
- `code-quality-checklist` (§IX)
- `event-tracking` (§XV)
- `unit-testing` (cross-cutting; covers test-coverage portion of §IX)

Plus these cross-cutting commands:

- `/feature-workflow` — daily-driver feature workflow that enforces §VIII (Linear linkage)
- `/speckit.specify` → `.plan` → `.tasks` → `.implement` — spec-driven workflow with Constitution Check
- `/noted-review` — multi-agent quality-check that surfaces constitution violations as findings
