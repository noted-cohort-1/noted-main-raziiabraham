---
description: 'Task list template for feature implementation in noted-main'
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[NOT-XXXX-feature-name]/`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`

**Tests**: Test tasks are OPTIONAL — include them only when (a) the feature spec explicitly requests TDD, (b) the touched code lives in `lib/` or `hooks/` (which always need tests), or (c) the touched Convex handler has non-trivial branching beyond the auth + ownership triad.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., `[US1]`, `[US2]`, `[US3]`)
- Include the exact file path in every task description

## Path conventions for noted-main

- **App routes / pages**: `app/(main)/(routes)/.../page.tsx`, `app/(public)/(routes)/.../page.tsx`
- **API routes**: `app/api/.../route.ts` (only when an HTTP boundary is required)
- **Components**: `components/<feature>/<thing>.tsx` (new feature components); `components/ui/` for shadcn primitives — wrap, don't modify
- **Convex handlers**: `convex/<featureName>.ts` (camelCase module names); shared schema in `convex/schema.ts`
- **Hooks**: `hooks/use-<thing>.tsx`
- **Utilities**: `lib/<thing>.ts`
- **Tests**: colocated as `*.test.ts(x)` next to the source file
- **Team OS dossier**: `team-os/features/<slug>/` — `status.md`, `ship-log.md`, dossier index

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration only.

  /speckit.tasks MUST replace these with actual tasks based on:
  - User stories from spec.md (with priorities P1, P2, P3...)
  - Schema additions from plan.md / data-model.md
  - Convex contracts from contracts/
  - The plan's project structure section

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (shared infrastructure)

**Purpose**: Project initialization and prep that all stories depend on.

- [ ] T001 Confirm Linear ticket NOT-XXXX exists and is in "In Progress" status
- [ ] T002 Branch created on `vibe-pm-course/wave-1` style (handled automatically by `.specify/scripts/bash/create-new-feature.sh`)
- [ ] T003 [P] Update `team-os/features/<slug>/status.md` to `in-development`

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: Convex schema additions and shared types that every user story builds on.

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete.

- [ ] T004 Add new fields/tables to `convex/schema.ts` per `data-model.md` (e.g., new table, new index)
- [ ] T005 Run `npx convex dev` to push the schema; confirm no migration warnings
- [ ] T006 [P] Define shared TypeScript types in `lib/<feature>.ts` if needed across multiple components
- [ ] T007 [P] Define analytics event names in `lib/analytics.ts` (per the `event-tracking` skill)

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 — [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own — e.g., "Create a new document, perform <action>, verify <observable outcome>"]

### Convex layer

- [ ] T010 [P] [US1] Add `<queryName>` query in `convex/<featureName>.ts`
- [ ] T011 [US1] Add `<mutationName>` mutation in `convex/<featureName>.ts` with auth + ownership + validation
- [ ] T012 [P] [US1] If non-trivial branching: write `convex/<featureName>.test.ts`

### Client layer

- [ ] T013 [P] [US1] Add `hooks/use-<feature>.tsx` consuming the new Convex query/mutation
- [ ] T014 [US1] Build `components/<feature>/<component>.tsx` consuming the hook
- [ ] T015 [P] [US1] Wire component into the relevant route (`app/(main)/(routes)/.../page.tsx`)

### Tests & instrumentation

- [ ] T016 [P] [US1] Add Amplitude event(s) at the user-action call site
- [ ] T017 [P] [US1] Component test in `components/<feature>/<component>.test.tsx` (if logic is non-trivial)

---

## Phase 4: User Story 2 — [Title] (Priority: P2)

**Goal**: [Brief description]

**Independent Test**: [How to verify]

[Mirror the Phase 3 structure: Convex layer → client layer → tests & instrumentation]

---

## Phase 5: User Story 3 — [Title] (Priority: P3)

**Goal**: [Brief description]

**Independent Test**: [How to verify]

[Mirror the Phase 3 structure]

---

## Final phase: Polish & cross-cutting

- [ ] T100 Run `npm run format && npm run lint:fix && npm run type:check && npm run test` and fix any issues
- [ ] T101 Update `team-os/features/<slug>/index.md` with what shipped
- [ ] T102 Append `team-os/features/<slug>/ship-log.md` entry via `/ship-log` command
- [ ] T103 Update `team-os/feature-index.yaml` if status changed (e.g., `planned` → `live`)
- [ ] T104 [P] Create / update PR description with `Closes NOT-XXXX` line
- [ ] T105 Run `/noted-review` (or `/heatseeker-review`-style equivalent) on the diff and fix surfaced issues

## Dependencies

- Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Final
- Within a phase, tasks marked `[P]` can run in parallel; non-`[P]` tasks must run in order
- Foundational tasks (Phase 2) block all user stories

## Implementation strategy

**MVP first**: ship User Story 1 alone, merged to `staging`, before starting Story 2. Re-validate the spec against what shipped before continuing.

**Parallel where it helps**: tests, hooks, and analytics events for the same story can usually run in parallel since they touch different files.

**Halt and ask** if a task forces a deviation from the plan (schema mismatch, missing context, surprising existing behavior). Don't push through.
