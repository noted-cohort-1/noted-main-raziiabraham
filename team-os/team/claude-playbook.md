---
type: playbook
last_updated: 2026-04-18
owner: raziiabraham
---

# How we use Claude at Noted

A living guide to Anthropic's Claude product family and how each teammate can get the most out of it for Noted work. Anthropic ships fast — things below will go stale. If you notice something wrong, open a PR or run `/market-scan` to prompt an update.

---

## TL;DR — which product for which task

| I want to… | Use | Why |
|---|---|---|
| Ask a question, draft something, iterate on a doc | **[Claude Chat](https://claude.ai)** | Conversational, immediate, works on mobile. Projects hold reusable context. |
| Generate a prototype mockup, slide deck, one-pager | **Claude Design** *(new, Apr 17 2026)* | Purpose-built for visual output. Exports to Canva/PPTX/PDF. |
| Have Claude autonomously do multi-step desktop work — pull data, prepare reports, schedule weekly jobs | **Claude Cowork** | Runs on your desktop with file access. Can be scheduled. |
| Work in this repo — write code, update team-os, generate PRDs, run `/feature-status` | **Claude Code** | Repo-aware. Picks up our `CLAUDE.md` navigation, our skills, and our commands. |
| Automate a recurring engineering task (weekly dep audit, daily GitHub digest) | **Claude Code Routines** *(new, Apr 14 2026)* | Scheduled runs, works even when your laptop is offline. |

When in doubt: **Chat for thinking, Code for this repo, Cowork for autonomous desktop work, Design for visuals.**

---

## The three surfaces

### 1. Claude Chat — [claude.ai](https://claude.ai)

The web + desktop + mobile chat product. Fastest path to "help me think about X."

**Core features worth knowing:**

- **Projects** — a persistent workspace that bundles a chat history with reusable knowledge. Each Project has a **200K-token context window** (≈500 pages) where you can pin documents, prompts, and instructions that load every conversation. Pro/Team. Shareable with teammates. *Good for:* "always-on context" like your team's style guide, roadmap summary, or positioning doc.
- **Artifacts** — a side pane that renders code, documents, diagrams, HTML, or website designs that Claude produces. Artifacts now support **MCP connectors** and **persistent storage**, so a built Artifact can reach external systems and remember state across chats.
- **Computer use** (Pro/Max) — Claude can open apps, click, and navigate on your behalf for tasks that don't have an API. No setup. Permission-gated per action.
- **Custom charts / diagrams** — inline in chat responses. Good for quick visuals without leaving the conversation.
- **Memory tool** — Claude stores facts outside the context window in a dedicated memory folder, so things persist between conversations without you re-pasting them every time.
- **Mobile apps** — iOS and Android. Also pair to your desktop Cowork for "message a task from phone, let desktop do the work."

**When to use Chat for Noted work:**
- Quick PRD drafts before you lift them into this repo with `/prd-new`.
- Brainstorming positioning, naming, messaging.
- Ad-hoc research where you don't need repo context.
- Reading / summarizing a user's docs they pasted.

### 2. Claude Cowork — the desktop autonomous agent

Generally available on **macOS + Windows** via the Claude Desktop app as of 2026. Powered by **Claude Sonnet 4.6** (default) with the option to switch.

**What makes it different from Chat:**
> *"Unlike Chat, Cowork lets Claude complete work on its own."*

Cowork is the product for tasks you'd otherwise delegate to an intern — multi-step desktop work that you set up once and walk away from.

**Core capabilities:**

- **File access** — reads, edits, and creates files in folders you explicitly grant. Handles Word, PDF, Excel, PowerPoint, JSON, CSV, images, code, Jupyter notebooks. Permission required before permanent deletes.
- **Projects in Cowork** — organize related tasks into persistent, self-contained workspaces with their own files, links, instructions, and memory. Different from Chat Projects — these are workspaces for *running* work, not archives.
- **Scheduled tasks** — "Pull my metrics every Friday at 9am and drop them in this template." Daily / weekly / monthly cadences. Only paid Claude plans.
- **Computer use** (research preview) — opens apps and navigates browsers when no direct integration exists. Requests permission per app.
- **Plugins** — combine Skills, Subagents, MCP connectors, Slash commands. Teams can host private plugin marketplaces.
- **Microsoft 365 unified connector** (2026) — one MCP connector brings Word, Excel, PowerPoint, OneDrive, SharePoint. Slack, Chrome, Zapier, and others are available too.
- **Phone integration** (research preview) — message a task from mobile; desktop executes and returns results. Requires pairing.

**When to use Cowork for Noted work:**
- **Weekly `/market-scan`** — set it to run every Monday morning so a fresh market pulse is waiting for you in `team-os/research/market-pulse/`.
- **Sales/support digests** — aggregate comments, issues, or feedback from connected tools into a weekly summary file.
- **Research that needs file access** — "read these 15 customer feedback emails and synthesize into a feedback-log entry."
- **Cross-tool automations** — anything that needs to touch Word/Excel/Slack/Drive and can't be scripted cleanly.

**When NOT to use Cowork:**
- Anything regulated (HIPAA, FedRAMP, FSI workloads aren't supported).
- Tasks that should modify this repo — use Claude Code instead, it has our repo conventions baked in.

### 3. Claude Code — the coding agent

The CLI + IDE extensions + the **redesigned desktop app** (released April 2026). Our daily driver for any work that touches the codebase or `team-os/`.

**Desktop app (April 2026 redesign):**
- Sidebar for managing **multiple parallel sessions**.
- Drag-and-drop layout to arrange your workspace.
- **Integrated terminal** for running tests and builds.
- **In-app file editor** for spot edits without switching windows.
- **Rebuilt diff viewer** for large changesets.
- **Expanded preview pane** — handles HTML files, PDFs, and local app servers inline.

**Extension mechanisms (all live in `.claude/`):**
- **Skills** — `SKILL.md` files Claude auto-invokes when the task matches. *(We have 8 — see [`.claude/`](../../.claude/).)*
- **Subagents** — independent AI assistants with their own context window, system prompt, and restricted tools. Good for isolating a task so it doesn't pollute your main conversation.
- **Hooks** — fire at lifecycle events (tool execution, session start/end, prompt submission, compaction). Useful for enforcing conventions or triggering side effects.
- **MCP servers** — connect Claude to external systems (Linear, Slack, Notion, your database). Open-standard protocol.
- **Slash commands** — named workflows you trigger explicitly (`/prd-new`, `/feature-status`, `/market-scan`, `/ship-log`, `/weekly-digest` are ours).
- **Plugins** — a *packaging* unit that bundles any of the above into an installable.

**When to use Claude Code for Noted work:**
- Anything that edits files in this repo (code, PRDs, feature dossiers).
- Running our slash commands (they're scoped to this repo).
- Tasks where the repo's `CLAUDE.md` navigation map saves you token-cost vs. re-explaining the project.

---

## What's new (April 2026)

### ⭐ Claude Opus 4.7 — the current flagship model

Released this week. Same pricing as Opus 4.6 ($5/$25 per MTok). Big gains in software engineering, vision, long-running agent reliability, and instruction following. New **effort controls** and **task budgets** so you can cap how deeply a given task reasons.

**For Noted**: Opus 4.7 is the default model to pick for complex PRD drafting, code review, and any Claude Design prototyping. Use Haiku for cheap quick turns, Sonnet for most tasks, Opus for the hard ones.

### ⭐ Claude Design (Apr 17, research preview)

> *"Intended to help people like founders and product managers without a design background share their ideas more easily."*

- Describe what you want → Claude Design generates prototypes, slides, one-pagers, or other visuals.
- Refine via direct edits or conversational requests.
- **Exports**: PDF, URL, PPTX, direct to Canva (editable + collaborative there).
- **Enterprise**: applies company design systems, reads codebases + design files for consistency.
- Powered by **Opus 4.7**.
- Positioned as *complementary* to Canva, not a replacement.
- Available on Pro, Max, Team, Enterprise.

**For Noted**:
- Mock up the **paywall pricing page** before Stage 4 of [`paywall-subscription-prd.md`](../product/prds/paywall/paywall-subscription-prd.md).
- Generate **internal slide decks** for feature launches.
- Draft **landing page hero variations** while the paywall PRD is in flight.
- Create **customer-facing one-pagers** that CS can attach to replies.

### ⭐ Routines in Claude Code (Apr 14, research preview)

Repeatable automations that package a workflow and run on schedule or trigger. **Run on Claude's web infrastructure**, so your Mac doesn't have to be online when they execute.

- **Triggers**: scheduled, or event-based.
- **Access**: your repos and connectors.
- **Limits**: 5/day Pro · 15/day Max · 25/day Team & Enterprise.
- **Example uses**: scheduled checks, API workflows, GitHub routines.

**For Noted**:
- **Weekly GitHub digest** — a routine that pulls merged PRs each week and drafts a `/weekly-digest` file.
- **Morning test-coverage check** — run `npm run test:coverage` on the latest main, flag if below 50%.
- **PR review triage** — summarize open PRs against team-os conventions every Monday morning.

Compared to a manual `/weekly-digest`: routines are *"same thing, but automated."* Manual command is fine while we're small; routinize what you do 3+ times.

### Claude Code desktop app redesign (April 2026)

New sidebar, multi-session management, integrated terminal, file editor, improved diff viewer, PDF + HTML preview pane. If you're still on the CLI-only flow, the desktop app is worth trying.

### Cowork GA + unified Microsoft 365 connector (2026)

Cowork left beta and is now generally available on macOS + Windows. Default model: Sonnet 4.6. New unified MCP connector covers Word, Excel, PowerPoint, OneDrive, SharePoint through a single integration.

---

## Core concepts across products

### Plugins = the packaging layer

A **Plugin** bundles any combination of:
- **Slash commands** — shortcuts for frequent operations.
- **Subagents** — purpose-built specialized agents.
- **MCP servers** — connections to external tools and data.
- **Hooks** — behavior customizations at workflow events.
- **Skills** — domain knowledge applied automatically.

We don't have a plugin for Noted yet — our `.claude/` directory is unpackaged. If our skills/commands stabilize and we'd share them externally (open source, give to other teams), turning them into a plugin is the next step.

### Skills vs. Projects vs. MCP vs. Subagents — when to pick which

| Tool | Best for | Key characteristic |
|---|---|---|
| **Skills** | Repeated specialized tasks | *"Procedural knowledge, loaded dynamically as needed."* |
| **Prompts** | One-off requests, immediate context | Moment-to-moment instructions |
| **Projects** | Background knowledge for an initiative | Persistent, always-loaded within bounded context |
| **Subagents** | Task specialization with tool isolation | Independent execution with restricted permissions |
| **MCP** | External data and tool access | Continuous connection to data sources |

Rules of thumb:
- **Skills vs. Prompts**: if you type the same instruction repeatedly across conversations, make it a Skill.
- **Skills vs. Projects**: Projects say *"here's what you need to know"*; Skills say *"here's how to do things."*
- **Skills vs. Subagents**: Skills are portable expertise any agent can use. Subagents are independent workers with specific tool access. Combine.
- **MCP vs. Skills**: MCP is connectivity. Skills use the data MCP provides.

### Computer use

Available on Pro/Max for Chat, research preview in Cowork. Claude clicks, types, and navigates applications on your machine. Permission-gated. Good fallback when there's no API.

### Memory tool

File-based persistent memory outside the context window. Claude writes facts to a memory directory and consults them across conversations. Great for "remember that we call it *the feature dossier*, not *the page*" without retyping every session.

---

## Decision guide by role

### If you're a PM on Noted…

| Task | Use | Notes |
|---|---|---|
| Draft a PRD | **Claude Code** `/prd-new` | Our skill pulls in feature dossiers + competitive context automatically. |
| Quick PRD brainstorm before committing to the repo | **Chat** | Less friction. Move to `/prd-new` when the shape is clear. |
| Weekly market pulse | **Cowork routine** or **Claude Code** `/market-scan` | Cowork if you want it scheduled; Code if you want it on-demand. |
| PRD mockup for stakeholders | **Claude Design** | Export to Canva or PPTX for review. |
| "What's the current status of feature X?" | **Claude Code** `/feature-status` | Reads our dossiers, always cites. |
| Competitive teardown | **Claude Code** (`competitive-analysis` skill) | Saves to `team-os/research/competitors/`. |

### If you're an engineer on Noted…

| Task | Use | Notes |
|---|---|---|
| Write / edit code | **Claude Code desktop** | Parallel sessions for multi-repo work. |
| Log what you just shipped | **Claude Code** `/ship-log` | Appends to the right feature's `ship-log.md`. |
| Refactor across files | **Claude Code + Subagent** | Use a subagent so the refactor doesn't pollute your main conversation. |
| Recurring checks (test coverage, outdated deps, security alerts) | **Claude Code Routines** | Schedule; offline-safe. |
| Convex schema change with cross-file impact | **Claude Code** with a purpose-built subagent | Restrict its tools to read-only first. |

### If you're in customer service / comms / support…

| Task | Use | Notes |
|---|---|---|
| Draft a reply to a customer question | **Chat** with a Project that contains our feature talking-points docs | Or **Claude Code** + `feature-status` skill if you want it cited from the repo. |
| "What's live, what's not, what's on the roadmap?" | **Claude Code** `/feature-status` | Non-engineer friendly, returns a Slack-sized answer. |
| Help a customer configure AI settings | **Chat** | Reference our [FAQ](../features/ai-features/faq.md). |

### If you're designing a visual…

Use **Claude Design**. Export to Canva for refinement; export to PPTX / PDF for sharing.

---

## Setting up for Noted

### 1. Claude Code in this repo

- Install Claude Code: [docs.claude.com](https://docs.claude.com).
- Open this repo. The root [`CLAUDE.md`](../../CLAUDE.md) auto-loads and tells Claude our layout.
- Our skills and commands live in [`.claude/`](../../.claude/) — available immediately.
- Try `/feature-status ai-features` to verify.

### 2. Pointing Claude Chat at our docs

Create a **Claude Project** called "Noted team OS". Upload:
- [`team-os/product/vision.md`](../product/vision.md)
- [`team-os/product/positioning.md`](../product/positioning.md)
- [`team-os/features/ai-features/customer-talking-points.md`](../features/ai-features/customer-talking-points.md)
- [`team-os/features/ai-features/faq.md`](../features/ai-features/faq.md)

Then ask things like "draft a reply to this customer question" — Claude answers with our talking points loaded.

Re-upload when these files change materially (monthly check is plenty).

### 3. Setting up a Cowork routine for weekly market pulse

Once Cowork is installed (paid plan required):
1. Create a Cowork Project called "Noted — weekly ops".
2. Grant file access to this repo folder only.
3. Schedule a task: every **Monday 9:00 AM**, run the equivalent of our `/market-scan` skill and save to `team-os/research/market-pulse/`.
4. The output will appear as a new file in that folder each week. Review, edit, ship.

### 4. Using Claude Design for Noted mockups

For any PRD that needs a visual (paywall pricing page, onboarding hero, settings modal):
1. Open Claude Design.
2. Describe the visual + reference our existing UI (shadcn/ui + Tailwind). Paste a screenshot if you have one.
3. Iterate. Export to PPTX for team review or PDF for a customer conversation.
4. Once aligned, an engineer can implement in `components/`.

### 5. Future: a Noted plugin

When our `.claude/` skills and commands are stable and we'd want to share them (open source? onboard a new teammate in 5 minutes?), bundle as a plugin. Not needed today — premature for a team of 3.

---

## Plans & pricing reference (as of April 2026)

| Plan | Chat | Cowork | Code | Design | Routines/day |
|---|---|---|---|---|---|
| **Free** | ✅ | ❌ | ✅ (limited) | ❌ | — |
| **Pro** | ✅ | ✅ quick tasks | ✅ | ✅ (preview) | 5 |
| **Max 5x** ($100/mo) | ✅ | ✅ | ✅ | ✅ | 15 |
| **Max 20x** ($200/mo) | ✅ | ✅ (higher limits) | ✅ | ✅ | 15 |
| **Team** ($20/seat/mo, 5–75 seats) | ✅ | ✅ | ✅ | ✅ | 25 |
| **Enterprise** (custom) | ✅ | ✅ + admin controls + OpenTelemetry | ✅ | ✅ + company design systems | 25 |

Opus 4.7 API pricing: **$5 / $25 per million tokens** (input / output).

Check [claude.com/pricing](https://claude.com/pricing) for the current truth — this will drift.

---

## Things we haven't tried yet

Worth experimenting with, and a source of future market-pulse entries:

- **A Cowork routine for the `/weekly-digest` command** — right now you run it manually. Test whether scheduling it on Sunday night produces a better Monday standup.
- **Claude Design integrated with our Blocknote editor** — users could describe a visual and have it appear inline in a document. Far-future feature idea, but worth watching Claude Design's export/embed options.
- **Subagent for Convex schema changes** — isolate the reasoning so breaking a schema doesn't crash a main session.
- **MCP server for our own Convex** — let Claude query our Convex tables directly during ops work. Would need a read-only mode for safety.
- **Plugin packaging** — wrap our skills + commands as a plugin, even privately, so a new teammate gets everything in one `install`.

---

## Keeping this doc fresh

This file will go stale. Anthropic ships features roughly monthly; pricing and availability shift. If you notice something wrong or new:

- **Small fix**: open a PR editing this file directly.
- **Big update (new feature, new product)**: run `/market-scan` or ask Claude to update this section.
- **Major rewrite**: bump `last_updated` at the top.

## Sources

- [Anthropic news](https://www.anthropic.com/news)
- [Claude Code docs](https://code.claude.com/docs/en/features-overview)
- [Claude Cowork product page](https://claude.com/product/cowork)
- [Claude Cowork help center](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork)
- [Skills explained blog post](https://claude.com/blog/skills-explained)
- [Claude Design launch (TechCrunch)](https://techcrunch.com/2026/04/17/anthropic-launches-claude-design-a-new-product-for-creating-quick-visuals/)
- [Claude Code Routines (9to5Mac)](https://9to5mac.com/2026/04/14/anthropic-adds-repeatable-routines-feature-to-claude-code-heres-how-it-works/)
- [Claude Code desktop redesign (SiliconANGLE)](https://siliconangle.com/2026/04/14/anthropics-claude-code-gets-automated-routines-desktop-makeover/)
- [Claude Opus 4.7 launch (Dataconomy)](https://dataconomy.com/2026/04/15/anthropic-to-launch-claude-opus-4-7-this-week/)
- [Plugins for Claude Code and Cowork](https://claude.com/plugins)
