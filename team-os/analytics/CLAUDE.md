# Analytics

Metric definitions, experiment results, investigations. The source of truth for "what does X mean when we say it?".

## Doc index

| Path | What it is |
|---|---|
| `metrics/` | Metric definitions — one file per product area. Definition, data source, how to calculate. |
| `experiments/` | A/B test or feature-flag experiment writeups with results |
| `investigations/` | Dated deep-dives — "why did X drop last week?" |
| `dashboards.md` | Links to any live dashboards we rely on |

## Conventions

- **Definitions first, queries second.** A metric must be defined clearly before it's computed. "Engagement" is not a metric. "Users who created at least one document in the last 7 days" is.
- **Every metric has a baseline.** Without a baseline, a target is just a wish.
- **Anti-metrics are required.** What would going UP be bad? If you can't name one, you haven't thought hard enough.
- **Cite the source.** Every metric names the table, query, or event it's measured from.

## Related

- Convex schema lives in `convex/schema.ts`. Tables referenced by metrics here should mirror that.
- When a new feature launches, its metric definitions are a **launch-gate requirement**. Use `/metrics-define` while drafting the PRD.
