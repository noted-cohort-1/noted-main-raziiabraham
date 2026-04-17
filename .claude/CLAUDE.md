# .claude/ — Shared Claude Code Configuration

This folder holds what every teammate's Claude Code picks up automatically when they open this repo.

## Structure

```
.claude/
├── CLAUDE.md           this file — what lives here and when to use each piece
├── settings.json       team-shared settings (checked in)
├── settings.local.json personal overrides (gitignored)
├── CREDITS.md          attribution for skills/patterns adapted from public repos
├── skills/             auto-triggering task skills (loaded on keyword match)
│   ├── prd-writer/
│   ├── competitive-analysis/
│   ├── launch-checklist/
│   ├── metrics-definer/
│   ├── user-research/
│   ├── feature-status/
│   ├── market-pulse/
│   └── ship-log/
└── commands/           explicit slash commands
    ├── prd-new.md
    ├── feature-status.md
    ├── market-scan.md
    ├── ship-log.md
    └── weekly-digest.md
```

## When to use which

- **Skill** — you're in the middle of a task (writing a PRD, defining metrics, summarizing a market scan) and want Claude to follow a team-agreed structure automatically. Triggered by phrasing.
- **Command** — you want to run a named workflow explicitly (`/prd-new`, `/ship-log`). Shows up in Claude Code's `/` menu.
- **CLAUDE.md** (root and nested) — passive context. Loaded every session so Claude knows the map.

## Adding a new skill

1. Create `.claude/skills/<name>/SKILL.md` with frontmatter: `name`, `description`, `trigger` patterns.
2. Add a one-liner to the skills list in this file.
3. If it's credit-worthy (adapted from a public repo), add a line to `CREDITS.md`.
4. Open a PR against `team-os`-equivalent rules (since `.claude/` is owned by `@avidx-app`, get approval).

## Adding a new command

1. Create `.claude/commands/<name>.md` with a clear "Instructions" section.
2. Test it by typing `/<name>` in Claude Code.
