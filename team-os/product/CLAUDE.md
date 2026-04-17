# Product

Product thinking, specs, and positioning for Noted.

## Doc index

| Path | What it is |
|---|---|
| `vision.md` | What Noted is, what it isn't, who it's for |
| `roadmap.md` | Now / Next / Later view |
| `prds/` | Product Requirement Documents — one per feature, organized by area |
| `positioning.md` | How we talk about Noted vs Notion / Obsidian / Craft / Mem |

*These files are stubs for now. Populate as real work happens — don't backfill fiction.*

## Writing a new PRD

Use the `/prd-new` command in Claude Code. It will ask clarifying questions, pull relevant context from feature dossiers and market research, and scaffold a file in `prds/<area>/<slug>-prd.md`.

Or start from the template at [`team-os/templates/prd.md`](../templates/prd.md).

## Conventions

- One PRD per feature. If a feature gets big, split into sub-PRDs that link from an index PRD.
- Every PRD has a Hypothesis, Problem (with evidence), Solution, Non-goals, Success Metrics, Open Questions.
- Never ship a PRD without metric definitions. Metrics without baselines are wishes.
- When the feature ships, link its PRD from the feature dossier's `index.md`.
