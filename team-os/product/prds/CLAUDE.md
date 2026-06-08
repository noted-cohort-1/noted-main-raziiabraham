# PRDs

Product Requirement Documents. One folder per product area. One file per feature.

```
prds/
├── ai-features/     — AI settings, in-editor AI, Coworker, Squad agents
├── editor/          — Blocknote editor, blocks, images, cover, icons
├── collaboration/   — Sharing, team workspaces, real-time collab
├── paywall/         — Subscriptions, pricing, billing
└── growth/          — Landing, onboarding, referrals
```

## Creating a new PRD

- Use `/prd-new` — it scaffolds from our template and asks clarifying questions.
- Or copy [`team-os/templates/prd.md`](../../templates/prd.md) manually.

## PRD stages

A PRD evolves. Each stage has a different audience and depth:

1. **Team Kickoff** — a "speclet": hypothesis + 2–3 open questions. A paragraph.
2. **Planning Review** — 1-pager for leadership prioritization.
3. **XFN Kickoff** — expanded with cross-functional inputs (eng, design, support).
4. **Solution Review** — hand-off PRD with assumptions, scope, flows, edge cases, metrics, and experiment design.
5. **Launch Readiness** — engineering handoff, QA, tracking, rollout, and decision criteria.
6. **Impact Review** — post-launch, link results, what worked / didn't.

Use the hand-off template for every stage. For early-stage PRDs, keep unknown sections visible and mark them with `[NEED: owner/source]` rather than deleting them.
