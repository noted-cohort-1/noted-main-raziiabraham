# Research

Market, competitor, and deep-dive research. This is where *outward-looking* knowledge lives — what the world outside Noted is doing.

(Internal customer calls would live in `../product/customers/` if we had them. We currently don't run structured customer calls, so that folder doesn't exist yet. When we do, create it.)

## Doc index

| Path | What it is |
|---|---|
| [market-pulse/](market-pulse/) | Weekly/monthly pulses on the note-taking + AI-native editor space |
| [competitors/](competitors/) | One folder per competitor: product teardown, pricing, positioning |
| `deep-dives/` | Multi-day research threads on a specific question (e.g., "what's the TAM of AI-native notes in 2026?") |
| `signals/` | Raw signals worth tracking (funding announcements, launches, pricing changes) before they become pulses |

## Market pulse cadence

Run `/market-scan` (weekly or biweekly) to generate a new pulse in `market-pulse/YYYY-MM-DD-pulse.md`. The skill asks what to cover, pulls signals from `signals/`, and drafts a structured report.

## Competitor folders

Each competitor has:

```
competitors/<slug>/
├── CLAUDE.md           what to care about for this competitor
├── tldr.md             30-second read: what they are, target user, key differentiator
├── pricing.md          current pricing and how it's evolved
├── teardown.md         our take: what's smart, what's weak, implications for us
└── signals.md          recent moves worth tracking
```

Start simple — `tldr.md` is enough on day one. Expand when a competitor gets relevant.

## Current priority competitors

*(Populate as we decide who to track. Notion, Obsidian, Craft, Mem, and any AI-native editors are obvious candidates.)*
