# `.ai/` — Shared agent configuration

This folder is the source of truth for everything Claude Code, Codex, and Cursor pick up automatically when teammates open this repo. We use the `.ai/` convention so a single set of skills and commands works across every agent runtime — `.claude/` and `.cursor/` are auto-generated symlinks (see `scripts/sync-ai.mjs`).

## Structure

```
.ai/
├── INSTRUCTIONS.md     project-wide agent instructions (root CLAUDE.md and AGENTS.md symlink to this)
├── CONTRIBUTING.md     this file — what lives where and how to add new assets
├── CREDITS.md          attribution for skills/patterns adapted from public repos
├── skills/             auto-triggering task skills (loaded on keyword match)
│   ├── competitive-analysis/
│   ├── feature-status/
│   ├── launch-checklist/
│   ├── market-pulse/
│   ├── metrics-definer/
│   ├── prd-writer/
│   ├── ship-log/
│   └── user-research/
└── commands/           explicit slash commands
    ├── branch-commit.md
    ├── create-pr.md
    ├── feature-status.md
    ├── market-scan.md
    ├── prd-new.md
    ├── ship-log.md
    └── weekly-digest.md
```

## How it gets to each runtime

`scripts/sync-ai.mjs` — runs automatically after `npm install` (postinstall hook), and can be run manually with `npm run sync-ai`. It materializes `.ai/skills/` and `.ai/commands/` as symlinks at:

- `.claude/skills/` and `.claude/commands/` (Claude Code)
- `.cursor/skills/` and `.cursor/commands/` (Cursor)

It also creates root-level `CLAUDE.md` and `AGENTS.md` as symlinks to `.ai/INSTRUCTIONS.md`. All symlink targets are gitignored — only `.ai/` is tracked.

## When to use which

- **Skill** — you're in the middle of a task (writing a PRD, defining metrics, summarizing a market scan) and want the agent to follow a team-agreed structure automatically. Triggered by phrasing.
- **Command** — you want to run a named workflow explicitly (`/prd-new`, `/ship-log`). Shows up in the `/` menu in Claude Code and Cursor.
- **`INSTRUCTIONS.md`** — passive context. Loaded every session so the agent knows the map.

## Adding a new skill

1. Create `.ai/skills/<name>/SKILL.md` with frontmatter: `name`, `description`, optional `trigger` patterns.
2. Add a one-liner to the skills list in `INSTRUCTIONS.md` if it's a top-skill.
3. If it's credit-worthy (adapted from a public repo), add a line to `CREDITS.md`.
4. Run `npm run sync-ai` to materialize it across runtimes.
5. Open a PR. `.ai/` ownership follows the same merge policy as the rest of the repo (see `INSTRUCTIONS.md`).

## Adding a new command

1. Create `.ai/commands/<name>.md` with a clear "Instructions" section.
2. Run `npm run sync-ai`.
3. Test it by typing `/<name>` in Claude Code or Cursor.
