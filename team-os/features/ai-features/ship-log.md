---
type: ship-log
feature: ai-features
---

# AI Features — Ship Log

Append-only record of user-visible changes to the AI surface. Engineers: after a merge that touches any of the code paths listed in [`team-os/feature-index.yaml`](../../feature-index.yaml) under `ai-features`, add a row here. Easiest way: run `/ship-log <PR>` in Claude Code.

Newest first.

| Date (merged) | PR | Author | What changed for the user | Deploy status |
|---|---|---|---|---|
| — | — | — | *(No entries yet. Engineering backfills from this point forward — do not try to reconstruct history.)* | — |

## How to add an entry

- The "What changed for the user" column must be understandable by a non-engineer. No `Refactored createAIModel to use `; yes `Added Anthropic Claude Haiku 4.5 to the model picker`.
- Use the PR's merge date, not the open date.
- Deploy status: ✅ prod / 🚧 staging / ❌ reverted.
