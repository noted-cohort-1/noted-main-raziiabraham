# Noted vs Notion: Feature Comparison

## Overview

This document compares Noted's planned features with Notion's current offerings. Use this as a reference during implementation to ensure we're matching or improving upon Notion's user experience.

## 🤖 AI Features

| Feature | Notion AI | Noted (Planned) | Notes |
|---------|-----------|-----------------|-------|
| **Pricing** | $10/mo per user | Free (BYOK) | ✅ **Our advantage**: Users bring own key |
| **Inline AI** | ✓ | ✓ | Slash commands + hover actions |
| **Continue writing** | ✓ | ✓ | AI continues from cursor position |
| **Improve writing** | ✓ | ✓ | Make better, fix grammar, change tone |
| **Summarize** | ✓ | ✓ | Summarize page or selection |
| **Translate** | ✓ | ✓ | Multiple languages |
| **Ask AI** | ✓ | ✓ | Chat about current page |
| **Generate content** | ✓ | ✓ | Create pages from prompts |
| **Custom prompts** | ✓ | ✓ | Save AI templates |
| **AI autofill** | ✓ (databases) | 🔮 Future | Database-specific |
| **Multi-provider** | No | ✓ | ✅ **Our advantage**: OpenAI, Anthropic, more |

**Key Difference**: Notion charges $10/user/mo for AI. We let users bring their own keys, which:
- Costs us nothing
- Gives users control
- No markup on AI usage
- Privacy advantage (direct to OpenAI/Anthropic)

## 👥 Collaboration

| Feature | Notion | Noted (Planned) | Notes |
|---------|--------|-----------------|-------|
| **Workspaces** | ✓ | ✓ | Team & personal workspaces |
| **@Mentions** | ✓ | ✓ | Mention people and pages |
| **Inline comments** | ✓ | ✓ | Comment on any text |
| **Comment threads** | ✓ | ✓ | Reply to comments |
| **Resolve comments** | ✓ | ✓ | Mark as resolved |
| **Guest access** | ✓ | ✓ | Unlimited guests on free plan |
| **Live presence** | ✓ | ✓ | See who's viewing |
| **Real-time cursors** | ✓ | ✓ | See where others are typing |
| **Page permissions** | ✓ | ✓ | Full, Edit, Comment, View |
| **Version history** | ✓ | ✓ | View and restore old versions |
| **Templates** | ✓ | ✓ | Reusable page templates |
| **Duplicate page** | ✓ | 🔮 Future | Clone pages easily |
| **Activity feed** | ✓ | ✓ | See recent changes |

**Matched**: Our collaboration features closely match Notion's proven UX.

## 💳 Pricing

| Plan | Notion | Noted (Planned) | Difference |
|------|--------|-----------------|------------|
| **Free** | Unlimited pages (personal) | Unlimited pages (personal) | ✅ Matched |
| | Unlimited blocks | Unlimited blocks | ✅ Matched |
| | 10 guests | Unlimited guests (view) | ✅ **Our advantage** |
| | 7 day history | 7 day history | ✅ Matched |
| | 5 MB uploads | 5 MB uploads | ✅ Matched |
| **Plus/Pro** | $10/mo | $8/mo | ✅ **Our advantage**: Cheaper |
| | Unlimited file uploads | Up to 1GB per file | Similar |
| | 30 day history | 30 day history | ✅ Matched |
| | - | AI (BYOK) | ✅ **Our advantage** |
| **Team/Business** | $18/mo per user | $15/mo per user | ✅ **Our advantage**: Cheaper |
| | Team workspaces | Team workspaces | ✅ Matched |
| | Advanced permissions | Advanced permissions | ✅ Matched |
| | 90 day history | 90 day history | ✅ Matched |
| | Bulk export | Admin tools | Similar |
| **Enterprise** | Custom | Custom | ✅ Matched |
| | SAML SSO | SAML SSO | ✅ Matched |
| | Advanced security | Advanced security | ✅ Matched |
| | Dedicated support | Dedicated support | ✅ Matched |

**Key Advantages**:
1. **Lower prices**: Plus $8 vs $10, Team $15 vs $18
2. **BYOK AI included**: No extra $10/mo for AI
3. **Unlimited view-only guests**: Even on free plan

## 🎨 User Experience Patterns

### What to Copy from Notion

#### 1. Slash Commands
```
/ai          → AI actions menu
/page        → Create new page
/heading     → Insert heading
/todo        → Insert todo list
```
**Implementation**: Autocomplete dropdown on `/` key

#### 2. Inline Comments
- Highlight text → Comment button appears
- Comments show in right sidebar
- Thread-style conversations
- Resolve when done

#### 3. @Mentions
- Type `@` → People/pages dropdown
- Autocomplete as you type
- Sends notification to mentioned person
- Click mention to navigate (for pages)

#### 4. Share Modal
```
┌─────────────────────────────┐
│ Share                     × │
├─────────────────────────────┤
│ 🔍 Add people by email      │
│                             │
│ 👤 John (john@email.com)    │
│    [Can edit ▼]      Remove │
│                             │
│ 🔗 Copy link               │
│    Anyone with link can view│
│                             │
│ 🌐 Publish to web          │
│    Make public              │
└─────────────────────────────┘
```

#### 5. Workspace Switcher
```
┌─────────────────────┐
│ 🏠 Personal        │
│ 💼 Work Team       │
│ 🚀 Side Project    │
├─────────────────────┤
│ + New workspace     │
└─────────────────────┘
```

#### 6. Upgrade Prompts (Non-blocking)
```
┌───────────────────────────────┐
│ 📁 File too large             │
│ This file is 10MB.            │
│ Free plan: up to 5MB          │
│ Plus plan: up to 1GB          │
│                               │
│ [Try Plus Free]  [Use Smaller]│
└───────────────────────────────┘
```

### What NOT to Copy

#### 1. Database Views (Too Complex for v1)
- Notion's database features are powerful but complex
- Defer this to post-launch
- Focus on simple pages first

#### 2. Page Properties (Not MVP)
- Tags, dates, checkboxes on pages
- Nice to have, but not essential
- Can add later based on user feedback

#### 3. Relations & Rollups (Advanced)
- Linking between database items
- Very powerful but very complex
- Not needed for core use case

## Implementation Priorities

### ✅ Must Have (Match Notion)
1. Slash commands for quick actions
2. Inline comments with @mentions
3. Real-time collaboration
4. Guest access (generous, like Notion)
5. Clean, minimal UI
6. Fast performance
7. Workspace switcher
8. Share modal with clear permissions
9. Version history
10. Page templates

### 🎯 Should Have (Improve on Notion)
1. BYOK AI (our advantage)
2. Lower pricing
3. Unlimited view-only guests
4. Better mobile experience
5. Faster loading times
6. Simpler onboarding

### 🔮 Nice to Have (Future)
1. Database views
2. Advanced page properties
3. Calendar view
4. Board view (Kanban)
5. Custom integrations
6. API access

## UX Principles from Notion

### 1. Speed is a Feature
- Pages load instantly
- No loading spinners for basic actions
- Optimistic updates (assume success)

### 2. Inline Everything
- Edit in place (no separate edit mode)
- Commands appear where you work
- Comments attached to content
- AI suggestions in context

### 3. Keyboard First
- Every action has a keyboard shortcut
- Slash commands for speed
- Tab/Escape to accept/reject
- Arrow keys to navigate

### 4. Progressive Disclosure
- Start simple, reveal complexity
- Hide advanced features until needed
- Gentle upgrade prompts
- Don't overwhelm new users

### 5. Delight in Details
- Smooth animations
- Emoji support 🎉
- Confetti on success
- Friendly error messages
- Playful illustrations

## Testing Checklist

When implementing, test against Notion:

- [ ] Is our slash command as fast as Notion's?
- [ ] Are comments as easy to add as Notion?
- [ ] Is @mention autocomplete as smooth?
- [ ] Does the share modal feel familiar?
- [ ] Are workspace switches instant?
- [ ] Do upgrade prompts feel respectful?
- [ ] Is the free plan as generous?
- [ ] Can guests access pages easily?
- [ ] Does real-time sync feel instant?
- [ ] Are error messages helpful?

## Competitive Advantages

Where we beat Notion:

### 1. AI Pricing
- **Notion**: $10/mo per user for AI
- **Us**: Free with BYOK
- **Savings**: $120/year per user

### 2. Overall Cost
- **Notion Team**: $18/user/mo = $216/user/year
- **Noted Team**: $15/user/mo = $180/user/year
- **Savings**: $36/user/year (20% cheaper)

### 3. Guest Access
- **Notion**: Limited guests on free
- **Us**: Unlimited view-only guests on free
- **Value**: Better for sharing with clients

### 4. Multi-Provider AI
- **Notion**: Locked to their AI
- **Us**: OpenAI, Anthropic, more
- **Value**: Choice + privacy

## Next Steps

1. **Review these specs with the team**
2. **Create detailed technical design docs**
3. **Build proof-of-concepts for:**
   - Slash command system
   - Real-time collaboration
   - Inline comments
   - Stripe billing integration
4. **Set up user testing with Notion users**
5. **Create design mockups matching Notion's UX**

---

**Remember**: Copy the best, improve the rest, add unique value (BYOK AI).

