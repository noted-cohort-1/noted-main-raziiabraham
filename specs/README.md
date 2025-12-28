# Product Specifications

Welcome to the Noted product specs! This folder contains detailed requirements and design documents for our major features.

## 📚 Documents in This Folder

### Start Here
- **[00-overview.md](00-overview.md)** - High-level overview of all three features and how they work together

### Feature Specifications
1. **[01-ai-features.md](01-ai-features.md)** - ✅ **MVP LAUNCHED** - AI-powered content creation using BlockNote AI
2. **[02-team-collaboration.md](02-team-collaboration.md)** - Workspaces, sharing, comments, and real-time collaboration
3. **[03-paywall-subscription.md](03-paywall-subscription.md)** - Pricing tiers, billing, and monetization strategy

### Reference
- **[notion-comparison.md](notion-comparison.md)** - How our features compare to Notion (our inspiration)

## 🎯 Quick Navigation

**Need to understand the overall vision?**
→ Read `00-overview.md` first

**Want details on a specific feature?**
→ Jump to the numbered spec (01, 02, or 03)

**Implementing a feature and want to match Notion's UX?**
→ Check `notion-comparison.md` for patterns and best practices

**Looking for technical requirements?**
→ Each feature spec has a "Technical Requirements" section

**Want to see user flows?**
→ Each feature spec has step-by-step "User Flow" sections

## 📋 Specification Format

Each feature spec follows this consistent structure:

1. **Overview** - What it is in simple terms
2. **Why We Need This** - The business value
3. **Key Features** - What it does (detailed list)
4. **User Flow** - Step-by-step walkthroughs
5. **Technical Requirements** - What needs to be built
6. **Success Criteria** - How we measure success
7. **Future Enhancements** - What comes later

## 🚀 Implementation Status

### ✅ Phase 1: AI Features (COMPLETED - December 2025)
Built MVP of `01-ai-features.md`:
- ✅ API key management (OpenAI)
- ✅ Secure server-side encryption (Convex)
- ✅ BlockNote AI integration (`@blocknote/xl-ai`)
- ✅ "/Ask AI" slash command
- ✅ Accept/Reject UI for AI suggestions
- ✅ Streaming responses from OpenAI
- ✅ Debounced saves for performance

**Tech Stack**: BlockNote v0.45.0, Vercel AI SDK v5.0.116, Convex, Clerk Auth

### 🚧 Phase 2: Paywall & Subscription (NEXT)
From `03-paywall-subscription.md`:
- ⏳ Stripe integration
- ⏳ Plan tiers (Free, Plus, Team)
- ⏳ Feature gates
- ⏳ Usage limits

### 📅 Phase 3: Team Collaboration (PLANNED)
From `02-team-collaboration.md`:
- ⏳ Team workspaces
- ⏳ Comments & mentions
- ⏳ Real-time collaboration
- ⏳ Permissions

## 💡 Design Principles

All specs follow these Notion-inspired principles:

✅ **Generous free tier** - Free is actually useful
✅ **Low friction** - Easy to try, easy to upgrade
✅ **Inline interactions** - Work in context
✅ **Respectful limits** - Explain, don't block
✅ **Speed matters** - Fast is a feature
✅ **Simple by default** - Hide complexity until needed

## 🎨 Key Patterns from Notion

These UX patterns appear throughout our specs:

- **Slash commands** (`/ai`, `/heading`) - Quick access to features
- **Inline comments** - Discuss content in context
- **@Mentions** - Notify people and link pages
- **Share modal** - Clear, friendly sharing UI
- **Workspace switcher** - Easy navigation between spaces
- **Soft upgrade prompts** - Helpful, not blocking

See `notion-comparison.md` for detailed examples.

## 📊 Success Metrics

Our north star metric: **Weekly Active Teams**

Key metrics we track:
- New signups per week
- Activation rate (3+ pages created)
- Free → Paid conversion (target: 3-5%)
- Trial → Paid conversion (target: 40%+)
- Monthly churn (target: <3%)
- Pages created per user
- AI commands used
- Invitations sent

## 🤔 Questions?

Each spec is designed to answer:
- **What** we're building (features)
- **Why** we're building it (business value)
- **How** users will use it (flows)
- **How** we'll build it (technical)
- **How** we'll know it works (success criteria)

If something's unclear, it's a gap in the spec—let's fix it!

## 📝 Updating These Specs

These are living documents. Update them as:
- User feedback comes in
- Technical constraints are discovered
- Business priorities shift
- New ideas emerge

**Process:**
1. Make changes directly in the spec files
2. Update the "Last Updated" date at the bottom
3. Note major changes in commit messages
4. Discuss big changes with the team first

## 🔗 Related Documents

- `/TECH_STACK.md` - Our technology choices
- `/DEPLOYMENT.md` - How we deploy
- `/README.md` - Project overview

## ✨ Our Competitive Edge

What makes Noted different from Notion:

1. **BYOK AI** - Users bring their own OpenAI/Anthropic keys (no $10/mo markup)
2. **Lower prices** - Plus at $8/mo (vs $10), Team at $15/mo (vs $18)
3. **Unlimited guests** - View-only guests on free plan
4. **Multi-provider AI** - Choose your AI provider
5. **Privacy focused** - Your API key, your data, direct to provider

---

**Last Updated**: December 26, 2025

**Status**: AI MVP Launched - Ready for Subscription Phase

**Next Steps**: Stripe integration → Usage tracking → Team collaboration

**Questions?** Open an issue or discuss in team chat.

