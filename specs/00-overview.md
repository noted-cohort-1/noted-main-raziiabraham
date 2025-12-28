# Product Specifications Overview

## About This Folder

This folder contains detailed specifications for three major features that will take Noted to the next level. These specs are inspired by best practices from Notion, focusing on user-friendly design and product-led growth.

## The Three Features

### 1. 🤖 AI Features (Bring Your Own Key)
**File**: `01-ai-features.md`

Let users create and improve content using AI—with their own API keys so they control costs and privacy.

**Key Highlights:**
- Slash commands (`/ai`) for quick AI access (like Notion AI)
- Inline AI suggestions and improvements
- Create entire pages from prompts
- Improve writing, change tone, translate, summarize
- AI chat assistant for each page
- Works with OpenAI, Anthropic, and more

**Why This Matters:**
- Helps users create content 10x faster
- Differentiates us from basic note-taking apps
- BYOK model means no AI costs for us
- Users who use AI create more pages (more engagement)

### 2. 👥 Team Collaboration
**File**: `02-team-collaboration.md`

Enable teams to work together seamlessly with workspaces, permissions, comments, and real-time collaboration.

**Key Highlights:**
- Team workspaces with member management
- Inline comments and @mentions (like Notion)
- Guest access for external collaborators
- Page-level sharing with granular permissions
- Real-time presence (see who's viewing)
- Page templates to share with team
- Activity feed and version history

**Why This Matters:**
- Teams are our revenue driver (Team plan)
- Collaboration creates network effects
- Guest access removes friction for sharing
- Comments keep discussions in context

### 3. 💳 Paywall & Subscription
**File**: `03-paywall-subscription.md`

A Notion-inspired pricing model with a generous free tier and team-based revenue.

**Key Highlights:**
- **Free Plan**: Unlimited pages for personal use
- **Plus Plan** ($8/mo): AI, larger uploads, no branding
- **Team Plan** ($15/mo per user): Team workspaces, advanced permissions
- **Enterprise**: Custom pricing for large orgs
- Free for students, teachers, and non-profits
- 14-day Plus trial, 30-day Team trial (no credit card)
- Respectful downgrades (no data loss)

**Why This Matters:**
- Free plan drives viral growth
- Teams naturally need paid features
- Education/non-profit programs build brand
- Product-led growth reduces sales costs

## How They Work Together

These three features create a powerful flywheel:

```
1. User signs up (Free plan)
   ↓
2. Creates pages with AI (tries Plus trial)
   ↓
3. Invites teammates (needs Team plan)
   ↓
4. Team collaborates with comments & @mentions
   ↓
5. Team upgrades to paid plan
   ↓
6. Team invites more members (revenue grows)
   ↓
7. Members create personal workspaces (more free users)
   ↓
8. Cycle repeats...
```

## Implementation Order

### Phase 1: Foundation (Months 1-2)
1. Paywall infrastructure & billing (Stripe)
2. Basic workspace structure
3. Free/Plus/Team plan enforcement

### Phase 2: AI Features (Months 2-3)
1. API key management & encryption
2. Basic AI integration (OpenAI/Anthropic)
3. Slash commands (`/ai`)
4. Inline AI suggestions
5. AI chat panel

### Phase 3: Collaboration (Months 3-5)
1. Team workspaces & invitations
2. Page-level permissions
3. Inline comments & @mentions
4. Real-time presence
5. Guest access
6. Page templates

### Phase 4: Polish & Scale (Month 5+)
1. Advanced AI features
2. Enhanced collaboration tools
3. Enterprise features
4. Mobile optimization
5. Performance improvements

## Success Metrics

### North Star Metric
**Weekly Active Teams** - Teams that collaborate on pages each week

### Key Performance Indicators (KPIs)

**Growth:**
- New user signups per week
- Activation rate (users who create 3+ pages)
- Viral coefficient (invitations per user)

**Engagement:**
- Pages created per user per week
- AI commands used per user
- Comments & mentions per team

**Revenue:**
- Free → Paid conversion rate (target: 3-5%)
- Trial → Paid conversion rate (target: 40%+)
- Monthly Recurring Revenue (MRR)
- Average Revenue Per User (ARPU)
- Customer Lifetime Value (LTV)
- Churn rate (target: <3% monthly)

**Feature Adoption:**
- % of users who use AI features
- % of users who invite others
- % of pages that are shared
- % of shared pages with comments

## Notion-Inspired Principles

Throughout these specs, we follow Notion's best practices:

### Product Design
✅ **Generous free tier** - Free plan is actually useful
✅ **Low friction** - No credit card for trials
✅ **Inline interactions** - Comments, AI, and actions in context
✅ **Slash commands** - Quick access to powerful features
✅ **Real-time collaboration** - See others' presence and changes
✅ **Flexible permissions** - From public to private, guests to members

### Pricing Strategy
✅ **Free for personal** - Unlimited pages, good for solo users
✅ **Pay for teams** - Revenue from organizations, not individuals
✅ **Educational discounts** - Free for students/teachers
✅ **Transparent pricing** - Clear tiers, no surprises
✅ **Respectful downgrades** - Keep data, graceful degradation

### User Experience
✅ **Speed matters** - Fast loading, responsive UI
✅ **Simple is better** - Clean design, clear actions
✅ **Helpful, not blocking** - Gentle prompts, not hard walls
✅ **Trust users** - Don't hide features behind unclear gates
✅ **Delight in details** - Confetti on upgrades, smooth animations

## Questions?

Each specification has detailed sections on:
- Why we need it
- Key features
- User flows (step-by-step)
- Technical requirements
- Success criteria
- Future enhancements

Read the individual spec files for complete details!

---

**Last Updated**: December 25, 2025
**Status**: Draft - Ready for Review
**Next Step**: Technical design docs & sprint planning

