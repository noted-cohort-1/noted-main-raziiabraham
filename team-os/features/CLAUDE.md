# Features

One folder per live (or in-flight) feature. **This is the first place customer service, sales, and leadership should look.**

Each feature folder contains:

| File | Purpose | Primary audience |
|---|---|---|
| `CLAUDE.md` | Navigation map for this feature | Claude + anyone |
| `status.md` | Current state: beta / GA / % rollout / known issues | CS, leadership |
| `customer-talking-points.md` | What to say to customers (and what NOT to promise) | CS, sales |
| `faq.md` | Top questions from users with our official answers | CS |
| `index.md` | The canonical feature writeup (PRD-style) — what it is, why, how it works | PM, new hires |
| `ship-log.md` | Append-only table of what shipped, PR link, date, coverage delta | Engineering → everyone |

## When to create a new feature dossier

When a feature moves from "idea in a PRD" to "code on main behind a flag or live". Before that, the PRD lives in `team-os/product/prds/` and a line in `feature-index.yaml` is enough.

## How to create a new dossier

1. Copy the template from [`team-os/templates/feature-dossier/`](../templates/feature-dossier/).
2. Rename the folder to the feature slug (kebab-case, e.g. `ai-templates`).
3. Add a row to [`team-os/feature-index.yaml`](../feature-index.yaml).
4. Fill in `status.md`, `customer-talking-points.md`, `faq.md`, `index.md` as you learn.
5. Engineers start logging to `ship-log.md` from the first PR.

## Live dossiers

- [ai-features/](ai-features/) — AI settings, in-editor "Ask AI", Coworker chat, Squad agents
