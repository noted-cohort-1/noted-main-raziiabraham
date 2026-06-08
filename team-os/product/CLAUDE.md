# Product

Product thinking, specs, and positioning for Noted.

## Doc index

| Path             | What it is                                                         |
| ---------------- | ------------------------------------------------------------------ |
| `vision.md`      | What Noted is, what it isn't, who it's for                         |
| `roadmap.md`     | Now / Next / Later view                                            |
| `prds/`          | Product Requirement Documents — one per feature, organized by area |
| `positioning.md` | How we talk about Noted vs Notion / Obsidian / Craft / Mem         |

_These files are stubs for now. Populate as real work happens — don't backfill fiction._

## Writing a new PRD

Use the `/prd-new` command in Claude Code. It will ask clarifying questions, pull relevant context from feature dossiers and market research, and scaffold a file in `prds/<area>/<slug>-prd.md`.

Or start from the template at [`team-os/templates/prd.md`](../templates/prd.md).

## Conventions

- One PRD per feature. If a feature gets big, split into sub-PRDs that link from an index PRD.
- Every PRD uses the hand-off format: Context, Key assumptions, Objectives, Design scope, Eng scope, Data scope, Ops scope, Experiment design, Launch plan.
- Never ship a PRD without objectives, metric definitions, and decision criteria. Metrics without baselines are wishes.
- If a feature is not an A/B test, keep the Experiment design section and describe the rollout learning plan instead.
- When the feature ships, link its PRD from the feature dossier's `index.md`.
