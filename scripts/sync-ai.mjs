#!/usr/bin/env node
/**
 * sync-ai — materialize .ai/ assets as symlinks across agent runtimes.
 *
 * Source of truth lives in .ai/. This script creates relative symlinks at:
 *   - .claude/skills, .claude/commands  (Claude Code)
 *   - .cursor/skills, .cursor/commands  (Cursor)
 *   - .agents/skills                   (Codex)
 *   - CLAUDE.md, AGENTS.md (root)       (Claude Code, Codex)
 *
 * All symlink targets are gitignored — only .ai/ is tracked. Run automatically
 * via the postinstall hook in package.json, or manually with `npm run sync-ai`.
 *
 * Idempotent: if a symlink already points to the right target it's left alone.
 * If something else exists at the path (regular file/dir/wrong symlink) we
 * remove it and recreate. Safe to run repeatedly.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

/** @type {Array<{ source: string; target: string }>} */
const links = [
  // Claude Code
  { source: ".ai/skills", target: ".claude/skills" },
  { source: ".ai/commands", target: ".claude/commands" },
  // Cursor
  { source: ".ai/skills", target: ".cursor/skills" },
  { source: ".ai/commands", target: ".cursor/commands" },
  // Codex
  { source: ".ai/skills", target: ".agents/skills" },
  // Root-level instruction files (Claude Code & Codex)
  { source: ".ai/INSTRUCTIONS.md", target: "CLAUDE.md" },
  { source: ".ai/INSTRUCTIONS.md", target: "AGENTS.md" },
];

/**
 * Create a relative symlink from `target` → `source`. Removes any existing
 * file/dir/symlink at the target path first.
 */
function linkOne(sourceRel, targetRel) {
  const targetAbs = path.join(repoRoot, targetRel);
  const sourceAbs = path.join(repoRoot, sourceRel);

  if (!fs.existsSync(sourceAbs)) {
    console.warn(`[sync-ai] skip ${targetRel} — source missing: ${sourceRel}`);
    return;
  }

  // Compute the relative path from the target's parent dir to the source.
  // This makes the symlink portable inside the repo (works on any clone).
  const targetDir = path.dirname(targetAbs);
  const relSource = path.relative(targetDir, sourceAbs);

  // Make sure the target's parent dir exists.
  fs.mkdirSync(targetDir, { recursive: true });

  // If a correct symlink already exists, leave it alone.
  try {
    const existing = fs.readlinkSync(targetAbs);
    if (existing === relSource) {
      return;
    }
  } catch {
    // Not a symlink, fall through to remove + recreate.
  }

  // Remove anything that's there (file, dir, or wrong symlink).
  if (fs.existsSync(targetAbs) || fs.lstatSync(targetAbs, { throwIfNoEntry: false })) {
    fs.rmSync(targetAbs, { recursive: true, force: true });
  }

  // Create the new symlink. On most platforms `type` is auto-detected, but
  // on Windows we need to specify "dir" or "file" explicitly.
  const type = fs.statSync(sourceAbs).isDirectory() ? "dir" : "file";
  fs.symlinkSync(relSource, targetAbs, type);
  console.log(`[sync-ai] linked ${targetRel} → ${relSource}`);
}

function main() {
  for (const { source, target } of links) {
    linkOne(source, target);
  }
}

main();
