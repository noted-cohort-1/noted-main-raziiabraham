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
4. **Solution Review** — full PRD with solution details, flows, edge cases.
5. **Launch Readiness** — engineering handoff, edge cases, rollout.
6. **Impact Review** — post-launch, link results, what worked / didn't.

Stage is set in the PRD's Status line.
