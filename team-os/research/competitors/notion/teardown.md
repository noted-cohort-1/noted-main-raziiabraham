---
type: competitor-teardown
competitor: notion
last_updated: 2026-04-18
---

# Notion — Teardown

## What Notion got right that we should learn from

### 1. Publish-to-web is dead simple
Share modal → toggle "Publish to web" → link. The published page looks identical to the in-app page. Low friction, high impact — works for blog posts, docs, portfolios.

**Implication for Noted:** We have the primitive live already ([`components/publish.tsx`](../../../../app/%28main%29/_components/publish.tsx)). Worth polishing the share UX, maybe adding custom domains down the line.

### 2. Slash commands as the universal input
`/` in the editor opens a menu of actions (headings, lists, embeds, AI). Trains users once, pays back forever. Third-party integrations hook in via `/`.

**Implication for Noted:** Our `/` menu already includes "Ask AI". If we ever add more commands (templates, embeds, integrations), keep them in `/`, don't invent a new UX.

### 3. The database isn't *required*, but it's the moat
Power users hit databases at month 2, fall in love, never leave. The gravitational pull of "my Notion has all my data structured" is what keeps Notion sticky at the top tier.

**Implication for Noted:** We've chosen not to build databases — fine, but it means we have *no* stickiness gravity at the power-user end. We need a different hook (currently: AI cost savings + multi-provider choice).

### 4. Generous free tier, priced for teams
Individuals pay nothing. Teams pay per seat. Most free users never upgrade, but enough team-of-5s convert to fund the business.

**Implication for Noted:** Whenever we design the paywall (see [PRD](../../../product/prds/paywall/paywall-subscription-prd.md)), mirror this shape — free for individuals, pay for teams. Don't gate AI (we can't, users BYO-key anyway).

## What Notion got wrong or is weak on

### 1. AI is a $10-per-user upsell on top of an already paid plan
To use Notion AI, you need a paid plan *plus* the AI add-on. Power users often calculate $28-per-user-per-month and bail.

**Our exploit:** BYOK AI at zero markup. Users bring their OpenAI / Anthropic / Google key, Noted charges nothing for the AI layer. This is our single clearest differentiator.

### 2. AI is locked to Notion's bundled model
One provider, one model, no choice. Power users who know the landscape want to pick Claude Sonnet 4.6 or GPT-5 for different tasks.

**Our exploit:** Noted supports OpenAI, Anthropic, Google side-by-side ([`lib/ai-models.ts`](../../../../lib/ai-models.ts)) with 25+ models.

### 3. Mobile editing is still weaker than desktop
Community reviews consistently cite the mobile app as inferior. For a "capture anywhere" tool, that's a gap.

**Our exploit (long-term):** Mobile isn't a priority today, but when we build one, mobile-first editing is a real lever against Notion.

### 4. Onboarding can feel overwhelming
First-run shows so many features that new users bounce. Notion's own onboarding experiments acknowledge this.

**Our exploit:** Simpler first-run. Blocknote editor, one AI entry point, publish-to-web — that's it. Don't add Notion's feature count without a reason.

## Implications for Noted

1. **Lean into BYOK + multi-provider AI** in every positioning surface. This is the only thing we can claim with confidence.
2. **Don't try to rebuild databases.** Feature debt without a user story.
3. **Mirror Notion's publish-to-web flow** — it's already a primitive we have, polish it rather than reinvent.
4. **When paywall comes, copy the shape** (free personal, paid teams) but don't gate AI.
5. **Watch for a mobile pivot** — if Notion or a competitor nails mobile-first AI editing, that's a real story. Worth tracking in [`team-os/research/market-pulse/`](../../market-pulse/).

## What we do not know yet

- Notion AI's actual attach rate among paid users. Rumor is low. If we had data, it would confirm/refute the "AI as upsell is weak" thesis. `[NEED: data from an analyst report or Notion earnings commentary]`
- Whether Notion's database moat matters for teams *under 20 people*. Possibly they move to dedicated tools (Airtable, Linear) for anything structured. If true, our "no databases" isn't a gap at that segment.
