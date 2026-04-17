# PRD: [Feature Name]

**Author:** [Name / GitHub handle]
**Date:** [YYYY-MM-DD]
**Status:** Draft — [Stage 1: Team Kickoff | Stage 2: Planning Review | Stage 3: XFN Kickoff | Stage 4: Solution Review | Stage 5: Launch Readiness | Stage 6: Impact Review]
**Feature index entry:** `team-os/feature-index.yaml` → [slug]

---

## 1. Hypothesis

We believe [action] will [outcome] for [users], measured by [metric].

## 2. Problem

**Who has this problem:**

**How bad is it:** *(frequency, severity, data)*

**How do they solve it today:** *(workarounds)*

**What happens if we don't solve it:**

**Customer evidence:** *(quotes, support tickets, research findings — never fabricate; use `[NEED: data from X]` for gaps)*

## 3. Strategic Fit

**Why this problem, why now:**

**Connection to current goals:**

**Alternatives considered and why we chose this:**

**Competitive context:** *(see `team-os/research/competitors/`)*

## 4. Solution

**What we're building:** *(specific, not vague)*

**User flow:**
1.
2.
3.

**Key interactions / states:**

**For AI features, also include:**
- Which model provider(s)
- Which Convex tables touched (`convex/schema.ts`)
- 15–25 example input/output pairs (golden-path + edge cases + rejection criteria)
- Streaming vs one-shot behavior

## 5. Non-Goals

- We are NOT doing [X] in this version because [reason].
- We considered [Y] and cut it because [reason].

## 6. Success Metrics

| Metric | Type | Baseline | Target | Timeframe | Source |
|---|---|---|---|---|---|
|   | Primary |   |   |   | Convex: [table/event] |
|   | Secondary |   |   |   |   |
|   | Guardrail |   |   |   |   |

**Anti-metric:**

**Passing criteria (for experiments):**

*Definitions live in `team-os/analytics/metrics/`.*

## 7. Rollout Plan

**Approach:** [ A/B experiment | gradual rollout | big-bang ]

**Stages (if gradual):** 1% → 10% → 50% → 100% with go/no-go criteria at each.

**Rollback plan:**

## 8. Open Questions

| Question | Owner | Due |
|---|---|---|

---

*Template inspired by [aakashg/pm-claude-code-setup](https://github.com/aakashg/pm-claude-code-setup) (MIT).*
