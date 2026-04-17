---
name: prd-writer
description: Draft or refine a PRD for a Noted feature using our team-standard structure
---

<!--
Adapted from aakashg/pm-claude-code-setup (MIT License, © 2026 Aakash Gupta).
Original: https://github.com/aakashg/pm-claude-code-setup/blob/main/.claude/skills/prd-writer/SKILL.md
Noted-specific adjustments: stage defaults, file paths, AI-feature guidance tuned to our stack.
-->

# PRD Writer

## Trigger

Activate on "write a PRD", "create a PRD", "draft a PRD", "PRD for [feature]", "spec out [feature]", "one-pager for [feature]".

## Context

The PRD isn't dead. The bad PRD is dead. Modern PRDs are lighter, sharper, example-heavy.

Core philosophy:

- **Think crisp, not complete.** Teammates crave clarity. Aim for 2–3 pages.
- **PRDs are for alignment, not dictation.** They drive discussion and decisions.
- **Nail the "why" and the "what," not the "how."**
- **You don't write a PRD once.** Living document that evolves through stages.

## Behavior

### Step 1: Clarify before writing

Ask 3–5 clarifying questions before generating anything. Common gaps:

- Who specifically has this problem? (Not "users" — job title, use case, segment)
- What data do we have? (usage, support, revenue impact, customer quotes)
- What stage is this PRD at? (speclet / planning / XFN / solution / launch-readiness / impact)
- Are there technical constraints the engineering team has flagged?
- What's the timeline and why?

For Noted specifically, also ask:
- Which product area: AI features, editor, collaboration, paywall, growth?
- Does this depend on Convex schema changes? Clerk auth changes? Blocknote extension?
- Is this behind a feature flag or full rollout?

Do NOT proceed until the user answers. Don't force a full PRD on an idea that needs discovery.

### Step 2: Determine PRD stage

| Stage | When | Shape |
|---|---|---|
| 1. Team Kickoff | Exploring with design + eng | Speclet — hypothesis + 2–3 open questions. A paragraph. |
| 2. Planning Review | Presenting to leadership | 1-pager: problem, strategic fit, data, initial approach |
| 3. XFN Kickoff | Bringing in support, growth, legal | Expanded doc with cross-functional asks |
| 4. Solution Review | Staking a position on the solution | Full PRD with flows, edge cases |
| 5. Launch Readiness | Engineering handoff | Concrete specs, metrics, rollout |
| 6. Impact Review | Post-launch learning | Results link at top, what worked / didn't |

Default to Stage 4 unless user specifies.

### Step 3: Generate the PRD

Every section earns its place. If a section doesn't drive a decision or prevent a mistake, cut it.

Use the template at `team-os/templates/prd.md` as the skeleton. Fill:

**1. Hypothesis** — one testable sentence:
"We believe [action] will [outcome] for [users], measured by [metric]."

**2. Problem**
- Who (specific segment, not "everyone")
- How bad (frequency, severity, with data)
- Current workarounds (strong signal)
- What if we don't solve it
- Customer evidence. A PRD without evidence is built on vibes.

**3. Strategic fit**
- Why this, why now
- Connection to current goals
- Why this approach vs alternatives (name the tradeoff openly)
- Competitive context (name competitors, not "the market")

**4. Solution**
- What we're building (not vague)
- User flow (step by step)
- Key interactions and states
- Wireframes or ASCII mockups where helpful
- **For AI features in Noted**: 15–25 example input/output pairs showing expected behavior, edge cases, rejection criteria, and how the system handles malformed inputs. Also call out: which model provider(s), which table(s) in `convex/schema.ts` are touched, whether it uses streaming.

**5. Non-goals** (state early)
- What we're explicitly NOT doing this version
- Features we considered and cut, with one-line reasoning
- Intentional trade-offs

**6. Success metrics**
- Primary with target + timeframe + baseline
- Secondary (2–3)
- Guardrails (what should NOT get worse — with baselines and acceptable ranges)
- Anti-metric (what going UP would actually be bad)
- For experiments: passing criteria to graduate

**7. Rollout plan**
- A/B test or full rollout? Gradual or big bang?
- Stage gates (1% → 10% → 50% → 100%) with go/no-go criteria
- Rollback plan

**8. Open questions**
- `[NEED: data from X]` for unknowns
- Owner + deadline per question

### Step 4: Self-check against stage

**Planning:**
- [ ] Problem with segment?
- [ ] Current state documented?
- [ ] Business metrics identified?
- [ ] Qualitative evidence?
- [ ] Competitive landscape?

**Solution Review:**
- [ ] Edge cases identified?
- [ ] Rollout plan decided?
- [ ] XFN requirements (legal, support, marketing) specified?
- [ ] Tracking events defined?

**Launch Readiness:**
- [ ] Engineering concerns addressed?
- [ ] Design complete?
- [ ] Tasks created?
- [ ] Support brief + FAQ ready?
- [ ] QA plan?

### Step 5: Review offer

After generating, offer:
- "Want me to review this as an engineer, designer, or skeptic?"
- "Want me to tighten this into a 1-pager for leadership?"
- "Want me to add input/output examples for the AI behavior?"

## Anti-patterns

- **Fancy structure, empty content.** Filler like "Ensuring alignment with legal standards" instead of naming the legal risk.
- **Delegating your thinking.** "Design will explore the optimal layout" instead of describing the flow yourself.
- **No customer evidence.** Zero quotes, zero tickets, zero data = vibes.
- **Hiding controversial decisions.** If A vs B was a close call, say so and explain why you chose.
- **Metrics without baselines.** A metric without a baseline is a wish.
- **Ending at launch.** Add Stage 6 results after launch closes the loop.
- **Over-specifying the "how".** Engineers and designers are creative problem solvers. Obsess over the "why" and "what."
- **Writing for every audience at once.** Be stage-appropriate.

## Rules

- **Think crisp, not complete.** Under 2 pages unless user asks for more.
- **Flag missing info** with `[NEED: data from X]`. Never fabricate data, customer quotes, or metrics.
- **Use specific numbers.** Not "improve engagement" — "increase 7-day activation from 23% to 35%."
- **Non-goals go early.** Best defense against scope creep.
- **For AI features**: include a behavior section with input/output examples, edge cases, and rejection criteria.
- **A strong PRD aligns the team without a meeting.** If reading it still needs a 30-minute walkthrough, it's not done.
- **Save PRDs to `team-os/product/prds/<area>/<slug>-prd.md`.** Link from the feature dossier if the feature is live.
