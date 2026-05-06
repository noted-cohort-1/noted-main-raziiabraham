<!--
  Sync Impact Report
  ===================
  Version: 0.0.0 → 0.1.0 (DRAFT — scaffold only, content to be filled
  during Vibe PM course Module 4 cohort exercise)

  This file is the formal constitution location read by /speckit.plan's
  Constitution Check. The full content lives at:
    team-os/engineering/constitution.md  (TBD by Module 4 cohort exercise)

  Once that file is drafted, this file should either include it via
  reference or be replaced by it via symlink.

  Templates Status:
  ✅ plan-template.md — Constitution Check section references this file
  ✅ spec-template.md — no constitution dependency
  ✅ tasks-template.md — no constitution dependency
-->

# Noted Engineering Constitution

A constitution is the small, stable list of non-negotiables that govern how this codebase grows. The full constitution will be drafted as a cohort exercise in Module 4 of the Vibe PM course; this file is the placeholder it will replace.

## Principles (placeholder — to be ratified)

The principles below are the seed list — drawn from the existing skills under `.ai/skills/` and from `.ai/INSTRUCTIONS.md`. The cohort will refine, drop, or add to them.

### I. Convex separation (PROPOSED)

- Queries are reactive reads. Mutations are transactional writes. Actions are non-reactive (used for HTTP calls, AI provider calls, EdgeStore operations).
- Each handler must do, in order: **auth check** → **existence check** → **ownership check** → **validation** → **business logic**.
- Auth check uses `ctx.auth.getUserIdentity()`; ownership check verifies `existing.userId === identity.subject`.
- See `.ai/skills/error-handling/SKILL.md`.

### II. Strict TypeScript (PROPOSED)

- No `any`. Use `unknown` + type guards, Zod parse, generics, or Convex's `Doc<>`/`Id<>` branded types.
- See `.ai/skills/typescript-patterns/SKILL.md`.

### III. No derived state in `useEffect` (PROPOSED)

- If a value can be computed from props or state, compute it during render. Don't sync via `useEffect` + `setState`.
- See `.ai/skills/derived-state/SKILL.md`.

### IV. Interaction logic in handlers, not effects (PROPOSED)

- Side effects caused by user actions belong in `onClick`/`onSubmit`/`onChange`. Not in `useEffect` watching a flag.
- See `.ai/skills/effect-to-event/SKILL.md`.

### V. Convex `useQuery` is the only reactive read (PROPOSED)

- Don't `fetch` inside `useEffect`. Don't sync `useQuery` results into local state. Trust the subscription.
- See `.ai/skills/derived-state/SKILL.md`.

### VI. File naming (PROPOSED)

- Files and directories: kebab-case (`coworker-message.tsx`).
- React component exports: PascalCase.
- Convex modules: camelCase (`aiSettings.ts`).
- Tests colocated as `*.test.ts(x)`.

### VII. Quality gates before merge (PROPOSED)

- `npm run format && npm run lint:fix && npm run type:check && npm run test` must pass.
- ≥50% line coverage on every file touched in the diff.
- See `.ai/skills/code-quality-checklist/SKILL.md`.

### VIII. Linear linkage (PROPOSED)

- Branches: `feature/NOT-XXXX-short-slug` (or `bugfix/`, `hotfix/`, `explore/EXP-N-...`).
- Every PR description ends with `Closes NOT-XXXX` so Linear auto-transitions on merge.

### IX. team-os reflex (PROPOSED)

- A feature is not "done" until its dossier (`team-os/features/<slug>/`) is updated and its ship-log entry appended via `/ship-log`.
- See `.ai/INSTRUCTIONS.md` Rules of the Road.

### X. Server Components by default (PROPOSED)

- Add `'use client'` only when a file uses hooks or browser APIs. Most route components should be Server Components.

### XI. shadcn primitives are read-only (PROPOSED)

- Don't modify files under `components/ui/`. Wrap with project-specific variants in `components/<feature>/`.

### XII. AI feature surface (PROPOSED)

- AI logic lives in `lib/agent/` (prompts, tools) and `convex/aiSettings*.ts` / `convex/squadAgents.ts` / `convex/coworkerMessages.ts`.
- New AI tools follow the pattern in `lib/agent/tools/` — schema (Zod), handler, registration.

## Governance

This constitution is amended by PR. The current owner of this file is `@avidx-app`. Material changes (adding/removing a principle) require sign-off from the product and engineering leads.

When `/speckit.plan` runs its Constitution Check and a feature's plan would violate one of the principles above, the plan must include a "Complexity Tracking" entry justifying the deviation, or the plan must be revised. There is no "we'll fix it later."

---

**Status**: SCAFFOLD. The full ratified constitution is drafted as a cohort exercise in Module 4 of the Vibe PM course and lives at `team-os/engineering/constitution.md`. This file references that one once it exists.
