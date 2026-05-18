---
name: feature-workflow
description: End-to-end feature development workflow for noted-main — from ideation through merge and smoke test. Every feature MUST begin with user grounding against the noted Customer Understanding OS (personas, pain landscape, behavioural cohorts). Use when starting a new feature, planning implementation, or checking what step comes next in the dev process. Pairs with the `/feature-workflow` slash command, which walks an agent through the same phases interactively.
---

<!--
Adapted from Razii's personal feature-workflow skill (originally written for
heatseeker-next). This is the noted-main version. Three things changed:

1. The Customer Understanding OS link, the personas, the pain themes, the
   customer quotes, and the Amplitude cohorts all need to be replaced with
   noted-specific equivalents. Until those exist they're marked
   `[NEED: ...]` — see "Activating this skill" at the bottom.
2. Heatseeker conventions (pnpm, HST-XXXX, /heatseeker-review,
   docs/architecture/*) → noted conventions (npm, NOT-XXXX, /noted-review,
   noted skills as architecture docs).
3. Added the team-os ship-log reflex in Phase 7 — noted's CLAUDE.md treats
   features as "not done" until the dossier is updated.

Companion files:
- `.ai/commands/feature-workflow.md` — slash command that walks through the
  same phases interactively. Keep them in sync.
-->

# Feature Development Workflow

A complete end-to-end guide for shipping a feature in noted-main — from raw idea to production.

**Non-negotiable:** Every feature must be user-grounded before any planning begins. No feature gets built on a hunch. If Phase 0 cannot be completed, pause and flag it — do not proceed to Phase 1.

> **Status:** the *phases* are noted-ready and match the rest of the .ai stack (Speckit, `/noted-review`, the skills suite). The *user-grounding content* — Customer Understanding OS link, persona list, pain themes, Amplitude cohorts — is marked `[NEED: ...]` until the noted Customer Understanding OS exists. See "Activating this skill" at the bottom for the one-time fill-in steps.

---

## Phase 0 — User Grounding (MANDATORY)

### The source of truth

Every feature starts by opening the **noted Customer Understanding OS** Notion page:

🔗 **`[NEED: noted Customer Understanding OS — Notion URL]`**
(Notion ID: `[NEED: notion page id]`)

**Required action:** Fetch this page at the start of every feature using the Notion MCP (`notion-fetch` with the URL or ID above). Do not rely on a summary from memory — the doc is living and updates. Re-read the Pain Landscape, Behavioural Reality, and Customer-by-Customer sections before planning.

### What's in noted's Customer Understanding OS (summary — for orientation only, always open the real doc)

- **`[NEED: list noted's personas — defined by relationship to the product, not job title]`** (e.g. "01 — The Daily Note-Taker", "02 — The AI-First Drafter", "03 — The Editor", "04 — The Public Publisher" — placeholders only; replace with what your interviews actually surfaced)
- **`[NEED: list noted's pain themes, ordered by frequency across interviews]`**
- **Amplitude behavioural cohorts** for each persona (project: `[NEED: noted Amplitude project ID]`)
- **Closed Loop: Insight → Action** table — how every insight type maps to a measurable behavioural signal (template below — usable as-is once the cohorts and signals exist)
- **Priority interview queue** — where current evidence gaps are

### Then answer these four questions in writing (Linear ticket is a good home):

### 1. Which persona is this for?

Pick one (or explicitly more than one, if unavoidable):

- **`[NEED: persona 01]`** — `[one-line role description]`. `[Amplitude cohort URL]`
- **`[NEED: persona 02]`** — `[one-line role description]`. `[Amplitude cohort URL]`
- **`[NEED: persona 03]`** — `[one-line role description]`. `[Amplitude cohort URL]`
- **`[NEED: persona 04]`** — `[one-line role description]`. `[Amplitude cohort URL]`

If the feature "is for everyone," it's probably for no one. Force a choice.

### 2. Which pain from the Pain Landscape does it address?

Pick one (again — be specific, not generic):

1. `[NEED: pain theme #1]`
2. `[NEED: pain theme #2]`
3. `[NEED: pain theme #3]`
4. `[NEED: pain theme #4]`
5. `[NEED: pain theme #5]`
6. `[NEED: pain theme #6]`

Quote the evidence. Which interview, which customer, which Amplitude signal surfaced this pain?

### 3. What customer quote or behavioural signal justifies this feature?

Use real user words from the Customer Understanding OS, or a specific Amplitude cohort behaviour. **No quote = no grounding = stop.**

Examples (the *shape*; replace with noted-specific evidence once the OS exists):

- > *`[NEED: noted user quote — interview source + customer name]`*
- `[NEED: noted Amplitude behavioural signal — e.g. "X events to Y events ratio across N orgs over T days"]`

### 4. What action should this feature trigger, and how will we measure it?

Map to the **Closed Loop: Insight → Action** table in the Customer OS. The framework is universal and usable today; the *specific Amplitude events* will fill in as the SDK accumulates data (see `event-tracking` skill):

| Insight type | Action | Amplitude signal to watch |
|---|---|---|
| Usability friction | UX iteration | Reduced time-on-screen, higher conversion on the affected flow |
| Feature gap | New feature | New `track*` event fires after ship (see `event-tracking`) |
| JTBD misalignment | Onboarding copy / CTA change | Improved `Onboarding Completed` |
| Persona signal | Cohort tag + research flag | Org-level property in Amplitude |
| Blocking behaviour | Fix friction point | Drop-off event drops, success event rises |
| Champion loss | Re-engagement + multi-user onboarding | Second user activated within 30 days |

### Output of Phase 0

Write a short **User Grounding block** into the Linear ticket description at the top:

```markdown
## User Grounding
- **Persona:** [01 / 02 / 03 / 04]
- **Pain:** [# from Pain Landscape + one-line rephrasing]
- **Evidence:** [Quote or Amplitude signal]
- **Expected action + signal:** [What changes in behaviour, which `track*` event proves it]
```

If any of these four are hand-waved or blank, **stop**. Re-interview, re-read the OS, or pick a different feature. Do not proceed to Phase 1.

---

## Phase 1 — Ideation & Planning

### 1. Brainstorm with Claude Code

- Throw rough ideas, debate tradeoffs, ask for clarity and explanation.
- **Every idea must be traceable to the User Grounding block** from Phase 0. If you find yourself brainstorming in abstract terms, stop and re-open the Customer Understanding OS.
- Don't commit to an approach yet — this is exploration mode.

### 2. Plan with Claude Code Plan Mode

- Use `/plan` or enter Plan mode to develop a concrete implementation plan.
- **The plan must name the persona and pain it targets** — copy them from the User Grounding block. A plan that doesn't reference a persona is not ready.
- **Verify the plan understands you and you understand it** — iterate until aligned.
- Read the relevant skills before planning unfamiliar areas (these are noted's "architecture docs"):
  - Convex backend → `convex-handlers`, `convex-schema`, `convex-queries` skills
  - React + state → `react-components`, `state-management`, `derived-state`, `effect-to-event` skills
  - Component splitting → `component-composition` skill
  - Visual / styling → `design-system` skill (and `DESIGN.md` for the visual contract)
  - AI tool authoring → `agent-tool-authoring` skill
  - Picking server surfaces → `api-routes-and-actions` skill
  - Where files go → `repo-structure` and `file-naming` skills
  - Errors / quality → `error-handling` and `code-quality-checklist` skills

### 3. Update the Linear Ticket

- Use the **Linear MCP** to update the ticket description with the finalized plan.
- The ticket must include **both** the User Grounding block (Phase 0) and the implementation plan.
- Include a link back to the Customer Understanding OS in the ticket for future readers.

---

## Phase 2 — Decide Implementation Path

After the doc plan is written into the Linear ticket, choose one of two paths:

### Path A — Doc Plan Is Enough → Just Build

- Proceed directly to Phase 3.
- Best for smaller, well-understood features.

### Path B — Use Speckit for Structured Implementation

- The doc plan (already in the Linear ticket) becomes context for Speckit.
- Run the full Speckit workflow:
  1. `/speckit.specify` — generate spec from ticket + description
  2. `/speckit.clarify` — resolve underspecified areas (up to 5 questions)
  3. `/speckit.plan` — generate design artifacts and implementation plan
  4. `/speckit.tasks` — generate actionable, dependency-ordered `tasks.md`
  5. `/speckit.implement` — execute the plan task by task
- Best for larger, more complex features where structure prevents drift.

---

## Phase 3 — Build & Iterate Locally

### 3.0 Sync env files from local main (mandatory on a fresh worktree, recommended after rebasing main)

Worktrees do **not** inherit `.env*` files — they're gitignored. Before you `npm run dev` (or run any quality gate), copy the latest env files from your local main checkout. **Re-run this whenever you sync with main**, because the source-of-truth env may have new keys for a feature you're about to use.

```bash
# From inside the worktree:
NOTED_MAIN="${NOTED_MAIN:-$HOME/Documents/GitHub/noted-main}"
[ -d "$NOTED_MAIN" ] || { echo "Main checkout not found at $NOTED_MAIN — set NOTED_MAIN."; exit 1; }
(cd "$NOTED_MAIN" && find . -maxdepth 4 -type f \( -name ".env" -o -name ".env.*" \) \
    -not -path "*/node_modules/*" -not -path "*/.git/*" \
    -not -path "*/.next/*" -not -path "*/.swc/*") \
| while IFS= read -r f; do
    mkdir -p "$(dirname "$f")"
    cp -p "$NOTED_MAIN/$f" "$f" && echo "✓ $f"
done
```

This `find`-based form picks up any new env files added to main automatically — you don't need to hand-maintain a list. `cp -p` preserves timestamps so `npm install`'s postinstall hook (`sync-ai`) doesn't re-fire unnecessarily. `.gitignore` already covers `.env*`, so nothing leaks into commits.

> **When you're prompted about it:** if Claude is helping you set up a new worktree, ask it to run this step automatically. The step is also valid as a one-off later if main's env changed (e.g. a new `NEXT_PUBLIC_AMPLITUDE_API_KEY` gets added).

### 3.1 Implement & test locally

- Implement using the plan (or `tasks.md` if using Speckit).
- Run `npm run dev` in one terminal and `npx convex dev` in a second — both must be running for noted to work end-to-end (per `README.md`).
- **Locally test the functionality** — keep iterating until it matches your vision.
- Run the full quality gate before moving on:
  ```bash
  npm run format && npm run lint:fix && npm run type:check && npm run test
  ```

---

## Phase 4 — Push & Preview

- Push branch to remote.
- **Test again on the preview branch** — Render builds a preview environment for every feature branch; verify the feature works end-to-end in the deployed environment, not just locally. Convex preview deployments mirror the schema/handlers automatically.

---

## Phase 5 — Code Review (Self)

1. Run `/noted-review` — reviews all diffs against all skills and best practices (see the `noted-review` command).
2. Read the review report carefully.
3. Address every flagged issue.
4. **Add nuance where needed** — if a suggestion is about refactoring existing code (not caused by your change), it's out of scope. Push back with that context.

---

## Phase 6 — Open PR & BugBot

1. Open a PR (or use `/create-pr`). **The PR description must include:**
   - The User Grounding block from Phase 0 (persona, pain, evidence, expected signal)
   - A link to the Customer Understanding OS so reviewers can verify the grounding
   - A link to the Linear ticket as a `Closes NOT-XXXX` line so Linear auto-transitions on merge
2. **BugBot** will automatically run on the PR.
3. Read the BugBot comments.
4. Ask Claude Code to **explain what each comment catches and what the proposed solution is**.
5. Add context where needed (e.g. "this refactor suggestion is about pre-existing code, not my change — out of scope").
6. **Push back on invalid comments** with reasoning grounded in the feature's context.

---

## Phase 7 — Human Review, Merge & team-os update

1. Wait for human reviewer approval.
2. Address any additional comments from the reviewer.
3. Once approved → **Merge** (feature → staging → main, per noted's branch flow).
4. After deploy → **Smoke Test** in production.
5. **Update team-os** (per noted's CLAUDE.md — *"Feature not 'done' until team-os updated"*):
   - Use `/ship-log` to append an entry to `team-os/features/<slug>/ship-log.md` (PR link, merge date, coverage delta, deploy status).
   - Update the feature dossier's status if it changed (`planned` → `in-development` → `live`).
   - Add the feature to `team-os/feature-index.yaml` if it's a new entry.

---

## Quick Reference: Quality Gate

```bash
npm run format && npm run lint:fix && npm run type:check && npm run test
```

## Quick Reference: Customer Understanding OS

Always open at the start of a feature, and re-open whenever in doubt about persona, pain, or expected signal:
🔗 **`[NEED: noted Customer Understanding OS — Notion URL]`**

## Quick Reference: Step Order

| # | Step | Tool/Command |
|---|------|-------------|
| 0 | **User ground against Customer OS** | Notion MCP (`notion-fetch`) |
| 1 | Brainstorm (anchored to persona + pain) | Claude Code |
| 2 | Plan (names persona + pain) | Claude Code Plan Mode |
| 3 | Update ticket (includes User Grounding block) | Linear MCP |
| 4 | Decide path | Doc plan vs Speckit |
| 4.5 | **Sync env files from local main** (fresh worktree, or after rebase) | Phase 3.0 snippet |
| 5 | Build & test locally (`npm run dev` + `npx convex dev`) | Claude Code |
| 6 | Quality gate | `npm run format && npm run lint:fix && npm run type:check && npm run test` |
| 7 | Push + preview test (Render preview) | `git push` |
| 8 | Self review | `/noted-review` |
| 9 | Open PR + BugBot (PR body includes User Grounding + Customer OS link) | `gh pr create` or `/create-pr` |
| 10 | Human review | GitHub |
| 11 | Merge + smoke test + team-os update | GitHub + production + `/ship-log` |

---

## Activating this skill

This skill is structurally complete but has placeholder content for the noted-specific user research. To make it fully active, do these once and commit them in a follow-up PR:

1. **Build (or link to) the noted Customer Understanding OS.** The heatseeker version lives in Notion — follow the same shape:
   - Pain Landscape (themes ranked by interview frequency)
   - Behavioural Reality (Amplitude cohort behaviours per persona)
   - Customer-by-Customer (per-org notes from real interviews)
   - Closed Loop: Insight → Action table (template above)
   - Priority interview queue
2. **Replace every `[NEED: ...]` marker** in this file with the real value:
   - The Notion URL + page ID at the top of Phase 0 and in Quick Reference
   - The persona list (4 or so, defined by relationship to the product, not job title)
   - The pain themes (6 or so, ordered by frequency)
   - One example customer quote
   - One example Amplitude behavioural signal (you'll need at least a few weeks of `track*` data flowing per the `event-tracking` skill before this is meaningful)
   - The Amplitude project ID and per-persona cohort URLs
3. **Sanity-check the Closed Loop table.** The framework template is universal, but each row's "Amplitude signal to watch" should map to actual `track*` events from `lib/analytics.ts`. If a row has no concrete event today, leave a `[NEED: event]` note rather than aspirational text.

Until step 1 happens, treat the skill as a *framework* — agents should not pretend they have grounding evidence they don't. The **mandatory** rule still holds: features without grounding don't get built. If the Customer OS doesn't exist yet for a given feature area, **the feature gets paused** while a grounding interview happens — not the other way around.
