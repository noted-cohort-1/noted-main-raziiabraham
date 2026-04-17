# Engineering

Engineering knowledge for the Noted codebase.

## Doc index

| Path | What it is |
|---|---|
| `rfcs/` | Architecture decisions, cross-cutting design proposals |
| `plans/` | Per-feature implementation plans (lighter than RFCs) |
| `runbooks/` | "If X breaks, do Y" — Clerk JWT, Convex schema migrations, EdgeStore issues |
| `bug-investigations/` | Dated folders per bug — investigation plan, findings, fix link |
| `adr/` | Architecture Decision Records — a short-form log of decisions |

*Populate as real work happens. The first bug investigation or RFC should be templated so future ones follow the same shape.*

## What counts as engineering knowledge (belongs here)

- How a system is structured and why
- Why we chose Convex over Postgres+Prisma (ADR)
- How to debug Clerk JWT auth failures (runbook)
- Investigation plan + root cause for a specific bug (bug-investigations)
- Proposal for a Convex schema migration (RFC)

## What does **not** belong here

- Code conventions → root `CLAUDE.md`
- Tech-stack overview → `TECH_STACK.md`
- Deployment steps → `DEPLOYMENT.md`
- Setup → `README.md`

## Contributing

Engineers: after a non-trivial PR, consider whether the "why" or "what if this breaks" is now documented somewhere. If no, write a runbook, ADR, or RFC and link from the PR. Keeps institutional knowledge out of Slack DMs.
