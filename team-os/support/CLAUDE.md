# Support

What customer service needs to answer questions fast, plus the feedback loop back to product.

## Doc index

| Path | What it is |
|---|---|
| `top-issues.md` | Ranked list of the issues customers ask about most — living doc |
| `faq.md` | Our official answers to common questions |
| `feedback-log/` | Raw customer feedback (by date or theme) — before it's been turned into a PRD or bug |
| `macros.md` | Pre-written responses for common asks (copy-pasteable) |

## How CS uses this folder

1. Customer asks a question.
2. Open Claude Code in this repo.
3. Ask Claude: *"A customer asked: [question]. Draft a reply using our docs."*
4. Claude reads `support/` + the relevant `features/<slug>/customer-talking-points.md` and drafts a reply.
5. If the question reveals something new, append to `feedback-log/` so product sees it next review.

## How PM uses this folder

- Review `top-issues.md` weekly. Patterns indicate what to prioritize.
- `feedback-log/` is raw — synthesize into PRDs or bug investigations as patterns emerge.
- When a feature ships, update its `features/<slug>/faq.md` with the top questions CS expects.
