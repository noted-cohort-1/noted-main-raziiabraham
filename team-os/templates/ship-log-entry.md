# Ship Log Entry Template

Single-row append. Copy the markdown below into the target feature's `ship-log.md` table. Easiest: run `/ship-log <PR>` — the skill writes the row for you.

```markdown
| YYYY-MM-DD | [#NN](https://github.com/avidx-app/noted/pull/NN) | @github-handle | Short user-facing description | ✅ prod |
```

**Fields:**

- **Date** — the merged-at date in ISO format.
- **PR** — markdown link to the PR on GitHub.
- **Author** — GitHub handle of the person who merged.
- **What changed for the user** — one sentence, plain English, understandable without engineering context.
- **Deploy status** — `✅ prod` | `🚧 staging` | `❌ reverted`.

**Good user-facing descriptions:**

- ✅ Added Anthropic Claude Haiku 4.5 to the model picker
- ✅ Coworker chat now supports drag-and-drop file uploads
- ✅ Squad agent descriptions auto-update when you edit the instruction document

**Bad user-facing descriptions:**

- ❌ Refactored createAIModel to use a switch
- ❌ Moved auth check to middleware
- ❌ Fixed #127
