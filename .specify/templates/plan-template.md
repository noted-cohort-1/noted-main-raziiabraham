# Implementation Plan: [FEATURE]

**Branch**: `[type/NOT-XXXX-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[NOT-XXXX-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  noted-main is a single Next.js 16 App Router app on top of Convex (realtime
  backend), Clerk (auth), EdgeStore (file storage), and BlockNote (editor).
  Default-fill the rows below with these values; only mark NEEDS CLARIFICATION
  if a row genuinely requires a decision the spec doesn't already settle.
-->

**Language/Version**: TypeScript 5 + React 19
**Frontend framework**: Next.js 16 App Router (default Server Components, `'use client'` only when hooks/browser APIs are used)
**Styling**: Tailwind CSS + shadcn/ui (primitives in `components/ui/`)
**Backend / Data**: Convex (queries, mutations, actions; real-time subscriptions; schema in `convex/schema.ts`)
**Auth**: Clerk (`ctx.auth.getUserIdentity()` in handlers; `useUser`/`useAuth` on the client)
**File storage**: EdgeStore (uploads via `app/api/edgestore/[...edgestore]/route.ts`)
**Editor**: BlockNote (with `@blocknote/xl-ai` for AI extensions)
**Client state**: Zustand for UI state; Convex `useQuery`/`useMutation` for server data (no TanStack Query)
**Testing**: Jest + React Testing Library (colocated `*.test.ts(x)`, ≥50% coverage on touched files)
**Performance Goals**: [domain-specific or NEEDS CLARIFICATION]
**Constraints**: [domain-specific, e.g., must keep editor input latency under 50ms or NEEDS CLARIFICATION]
**Scale/Scope**: [domain-specific, e.g., 10k users, 100 docs/user p95 or NEEDS CLARIFICATION]

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Read `.specify/memory/constitution.md`. Confirm this plan does not violate any of:

- Convex separation (queries vs mutations vs actions)
- Auth → existence → ownership → validation ordering in handlers
- No `any`; no derived state in `useEffect`; no interaction logic in `useEffect`
- File-naming convention (kebab-case files, PascalCase components, camelCase Convex modules)
- Quality gates pass before merge: `npm run format && npm run lint:fix && npm run type:check && npm run test`
- The `team-os/features/<slug>/` dossier is updated when this ships (ship-log entry, dossier status)

If any gate would be violated, document the justification under "Complexity Tracking" below or revise the plan.

## Project Structure

### Documentation (this feature)

```text
specs/[NOT-XXXX-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan)
├── data-model.md        # Phase 1 output (/speckit.plan) — Convex schema additions
├── quickstart.md        # Phase 1 output (/speckit.plan)
├── contracts/           # Phase 1 output (/speckit.plan) — Convex query/mutation/action shapes
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

<!--
  noted is a single-app Next.js + Convex repo. Replace the placeholder paths
  below with the concrete files this feature touches. Don't introduce new
  top-level directories without justification.
-->

```text
app/
├── (main)/
│   └── (routes)/documents/[documentId]/...   # If the feature surfaces in the document view
├── (public)/
│   └── (routes)/preview/[documentId]/...     # If the feature surfaces in the public preview
└── api/
    └── [...]/route.ts                         # Only if HTTP boundary is required (most data lives in Convex)

components/
├── [feature-name]/                            # New feature-specific components
│   ├── feature-name.tsx
│   └── feature-name.test.tsx
└── ui/                                        # shadcn primitives — do not modify; wrap if extending

convex/
├── [featureName].ts                           # New queries/mutations/actions for this feature
├── [featureName].test.ts                      # If logic is non-trivial
└── schema.ts                                  # Schema additions for this feature

hooks/
└── use-[feature-name].tsx                     # If feature needs a custom hook

lib/
└── [feature-name].ts                          # If feature needs shared utilities

team-os/features/[slug]/
├── status.md                                  # Updated when feature ships
├── ship-log.md                                # Append entry on merge
└── index.md                                   # Updated dossier
```

## Complexity Tracking

_Document any deliberate deviations from constitution principles or skill conventions here, with the rationale. Empty by default._

| Deviation | Rationale | Alternatives considered |
|---|---|---|

## Phases

### Phase 0 — Outline & research

For every Technical Context row marked NEEDS CLARIFICATION, run a brief research task and write findings to `research.md`. Format each finding as:

- **Decision**: [what was chosen]
- **Rationale**: [why]
- **Alternatives considered**: [what else evaluated]

**Output**: `research.md` with all NEEDS CLARIFICATION resolved.

### Phase 1 — Design & contracts

**Prerequisites:** `research.md` complete.

1. **Schema (`data-model.md`)**: list every new Convex `defineTable`, every new field on existing tables, every new index. State the field types using Convex's `v.*` validators (`v.string()`, `v.id("documents")`, `v.optional(...)`, `v.array(...)`).
2. **Convex contracts (`contracts/`)**:
   - One file per new `query`/`mutation`/`action`.
   - For each, document: the args schema (Convex `v.*`), the auth check, the ownership check, the return shape, and the error cases (using the conventional messages from the `error-handling` skill).
3. **Client contracts (`contracts/client.md`)**: list new hooks (`use-*`), the components that consume them, and the analytics events the feature will emit (per the `event-tracking` skill).
4. **Quickstart (`quickstart.md`)**: a 1-page user journey walkthrough — what does the user do, click-by-click, to exercise this feature in the deployed app?
5. **Re-evaluate the Constitution Check.** Anything that drifted? Update.

**Output**: `data-model.md`, `contracts/*`, `quickstart.md`.

### Phase 2 — Tasks (handed off to /speckit.tasks)

`/speckit.tasks` reads this plan and the spec to produce `tasks.md` — a dependency-ordered, user-story-grouped checklist of buildable units. Don't write tasks in this file; let `/speckit.tasks` generate them.

## Linear Document Sync

After Phase 1 completes, sync this plan to Linear:

1. Extract `NOT-XXXX` from the branch name.
2. Read final `plan.md` content.
3. Search Linear for an existing `[NOT-XXXX] plan` document (`list_documents(query: "NOT-XXXX")`).
4. If document exists: `update_document(id, content)`. If not: `create_document(title: "[NOT-XXXX] plan", content, issue: "NOT-XXXX")`.
5. Report: `✓ Synced plan to Linear as [NOT-XXXX] plan`.
6. On failure, warn but don't block; user can retry via `/speckit.sync` later.

For explore-mode plans (branch starts with `explore/EXP-N`), skip the sync and prompt the user to link via `/speckit.link EXP-N NOT-XXXX` if/when they're ready.

## Key rules

- Use absolute paths in scripts and output.
- ERROR on Constitution Check failures or unresolved NEEDS CLARIFICATION markers.
- Don't introduce new top-level directories without a Complexity Tracking entry.
- Don't propose adding TanStack Query, a custom error-class hierarchy, or a service layer — these aren't in noted today and adding them is a separate decision (see the `error-handling` skill).
