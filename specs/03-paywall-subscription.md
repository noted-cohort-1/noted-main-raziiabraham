# Paywall & Subscription Specification

## Overview
Users start with a free plan with basic features. To unlock advanced features like AI, team collaboration, and unlimited pages, they can upgrade to a paid subscription. We offer monthly and yearly plans with different tiers.

## Pricing Philosophy (Inspired by Notion)

**"Generous Free Plan, Pay for Teams & Advanced Features"**

Like Notion, our pricing strategy focuses on:
1. **Free forever for personal use** - Unlimited pages, generous limits
2. **Low friction growth** - No credit card for trials, easy invites
3. **Value-based pricing** - Pay when you get real value (teams, advanced features)
4. **Transparent and simple** - Clear pricing, no hidden fees
5. **Respectful limits** - Soft gates that explain, not block

This approach drives:
- **Viral growth**: Free users invite others
- **Natural upgrades**: Teams naturally need paid features
- **Happy users**: Never feel nickel-and-dimed
- **Product-led growth**: Product sells itself

## Why We Need This
- **Revenue**: Generate income to sustain and grow the product
- **Value**: Align pricing with value provided
- **Fairness**: Free users get started, power users pay for more
- **Growth**: Fund development of new features
- **Trust**: Build long-term relationships with users

## Key Features

### 1. Pricing Tiers (Notion-Inspired)

#### Free Plan (Personal Use)
**For individuals getting started**
- Unlimited pages for personal use
- Unlimited blocks (content)
- Personal workspace
- Basic editing features
- Guest access (unlimited guests, view-only)
- 5 MB file upload limit
- 7-day version history
- Community support

#### Plus Plan ($8/month or $80/year)
**For power users who want more**
- Everything in Free
- Unlimited file uploads (up to 1GB per file)
- 30-day version history
- AI features (bring your own key)
- Priority support
- Remove "Made with Noted" branding

#### Team Plan ($15/month per user or $144/year)
**For small teams collaborating together**
- Everything in Plus
- Unlimited team workspaces
- Unlimited team members
- Advanced permissions & roles
- Guest access with edit/comment permissions
- 90-day version history
- Admin tools & dashboard
- Bulk operations
- Priority support

#### Enterprise Plan (Custom Pricing)
**For large organizations**
- Everything in Team
- SAML SSO (single sign-on)
- Advanced security & compliance
- Unlimited version history
- Dedicated account manager
- Custom contract & invoicing
- Advanced admin & analytics
- 99.9% uptime SLA
- Custom integrations

### 2. Upgrade Flow
- Clear "Upgrade" button in navigation
- Feature restrictions with upgrade prompts
- Pricing page with plan comparison
- Secure payment with Stripe
- Instant access after payment
- Email receipt and confirmation

### 3. Feature Gates (Notion-Style Soft Limits)
When free users hit limits, show friendly, non-blocking messages:
- "File too large. Upgrade to Plus for files up to 1GB."
- "AI features available on Plus plan. Upgrade now to bring your own key."
- "Want to collaborate? Team plan lets you invite members with edit access."
- "Version history beyond 7 days requires Plus or Team plan."

**Philosophy (Like Notion):**
- Free plan is generous for personal use
- Gates focus on advanced features, not basic usage
- Always explain clearly what they get by upgrading
- Never feel punishing or restrictive

Each message has:
- Clear explanation of limit
- What they get with upgrade
- "Upgrade" button (primary)
- "Learn More" link
- Easy to dismiss (don't block workflow)

### 4. Payment Management
- Users can:
  - Update payment method
  - Change plan (upgrade/downgrade)
  - Cancel subscription
  - View billing history
  - Download invoices
  - Update billing email
- Grace period for failed payments
- Email reminders before renewal

### 5. Trial Period
- **Plus Plan**: 14-day free trial, no credit card required
- **Team Plan**: 30-day free trial (matches Notion)
- Email reminders at midpoint and 2 days before end
- Full access to all plan features during trial
- Auto-converts to Free plan if not upgraded (no data loss)
- Can only use trial once per email
- Easy cancellation anytime during trial
- Clear countdown shown in UI ("12 days left in trial")

## User Flow

### Signing Up (Free Plan)
1. User visits landing page
2. Clicks "Get Started Free"
3. Signs up with email/password
4. Immediately starts using free plan
5. No payment required

### Hitting a Free Plan Limit (Soft Gate)
1. User tries to upload a 10MB file
2. Friendly modal appears (not blocking):
   - "This file is too large for the Free plan"
   - "Free: up to 5MB per file"
   - "Plus: up to 1GB per file"
   - Shows comparison of Free vs Plus
3. Options:
   - "Start Free Trial" button (primary)
   - "Choose smaller file" button
   - "X" to close (not blocking)
4. User can still use the app normally

### Upgrading to Plus or Team
1. User clicks "Upgrade" button in banner/menu
2. Lands on pricing page with 4 plans
3. Sees clear comparison table (like Notion):
   - Free, Plus, Team, Enterprise
   - Feature checkmarks and limits
   - Prominent "Popular" badge on Team plan
4. Clicks "Try Plus Free" or "Try Team Free"
5. If trial, goes to simple form:
   - No credit card required
   - Just confirms email
   - Clicks "Start Trial"
6. If purchasing, goes to checkout:
   - Credit card details (Stripe)
   - Billing address
   - Toggle: Monthly/Yearly (show savings)
7. Reviews order
8. Clicks "Subscribe to Plus" (or Team)
9. Payment processes
10. Success message with confetti 🎉
11. Account instantly upgraded
12. Receives welcome email

### Starting a Free Trial (Notion-Style)
1. User clicks "Try Free" on pricing page
2. Modal explains:
    - Plus: 14 days free
    - Team: 30 days free
    - No credit card needed now
    - Cancel anytime, no charge
    - Full access to all features
3. User enters email (if not logged in)
4. Clicks "Start Free Trial"
5. Instantly get access to plan features
6. Colorful banner at top: "🎉 12 days left in your Plus trial"
7. Reminder emails:
   - Midpoint (day 7 for Plus, day 15 for Team)
   - 2 days before end
   - Day before end with upgrade link

### Managing Subscription
1. User goes to Settings
2. Clicks "Billing" tab
3. Sees current plan and next billing date
4. Options available:
   - Update payment method
   - Switch plan (upgrade/downgrade)
   - View invoices
   - Cancel subscription
5. If canceling:
   - Modal confirms: "Are you sure?"
   - Explains what happens (access until end of period)
   - Asks for feedback (optional)
   - Confirms cancellation

### Downgrading or Canceling (Respectful, Like Notion)
1. User clicks "Cancel Subscription" in billing settings
2. Before canceling, show retention screen:
   - "We'd be sorry to see you go"
   - Ask why (optional feedback)
   - Offer to pause instead of cancel
   - Show what they'll lose
3. If they proceed, confirm modal:
   - "Are you sure?"
   - Clear explanation: access until [date]
   - What happens to their data
   - Easy to undo (can reactivate)
4. User confirms cancellation
5. Account remains on paid plan until end of billing period
6. Friendly confirmation email with end date
7. 3 days before end: reminder email
8. On end date:
   - Account reverts to Free plan
   - All data preserved (nothing deleted!)
   - Advanced features become unavailable
   - Graceful degradation (no data loss)
   - Can re-upgrade anytime to restore access
9. Follow-up email:
   - "Your plan changed to Free"
   - Option to upgrade again
   - Link to export data if needed

## Technical Requirements

### Payment Processing
- Stripe integration for payments
- Support credit cards and debit cards
- Handle subscription lifecycle:
  - New subscription
  - Renewal
  - Upgrade/downgrade
  - Cancellation
  - Failed payment
- Secure payment form (Stripe Elements)
- PCI compliance (handled by Stripe)
- Webhook handling for events

### Feature Gating
- Middleware checks plan limits on every request
- Frontend checks for UI visibility
- Backend enforcement (always verify)
- Graceful degradation when limits exceeded
- Clear error messages with upgrade path

### Database Schema
- Subscriptions table:
  - user_id, plan_type, status, current_period_end
- Payments table:
  - subscription_id, amount, status, stripe_payment_id
- Usage tracking:
  - user_id, page_count, storage_used, updated_at

### User Interface
- Pricing page with plan comparison
- Upgrade prompts at feature gates
- Billing settings page
- Payment modal
- Success/failure messages
- Trial badge in navigation
- Current plan indicator

### Email Notifications
- Welcome email on signup
- Trial started confirmation
- Trial reminder (day 7, day 13)
- Payment successful
- Payment failed (retry prompts)
- Subscription canceled
- Subscription ending soon
- Monthly invoice

## Success Criteria

### User Experience
- Pricing is clear and easy to understand
- Upgrade takes less than 2 minutes
- No payment failures due to UI confusion
- Downgrade is simple and respectful
- Users understand what they're paying for

### Technical
- Zero payment security issues
- 99%+ payment success rate
- Instant feature access after payment
- Subscription webhooks processed in real-time
- No unauthorized access to paid features

### Business
- At least 3-5% of free users upgrade (Notion benchmark)
- At least 40% of trial users convert to paid
- Less than 3% monthly churn rate
- Average customer lifetime value > $300
- High Net Promoter Score (NPS > 50)
- Viral coefficient > 1.0 (users inviting others)
- Team plan users invite average 5+ members

## Pricing Strategy

### Monthly vs. Yearly
- Yearly saves 20% (10 months for price of 12)
- Show savings clearly: "Save $24/year"
- Promote yearly in UI
- Allow plan changes anytime

### Discounts & Promotions (Like Notion)
- **Free for Students**: Free Plus plan with .edu email
- **Free for Teachers**: Free Plus plan for educators
- **Free for Non-Profits**: Free Team plan for registered non-profits
- **Annual Discount**: Save 2 months (pay for 10, get 12)
- **Early Adopter**: Special pricing for first 1,000 users
- **Referral Program**: Give $10, get $10 credit
- **Startup Program**: Free Team plan for YC companies / accelerators
- Clear messaging: "Are you a student? Get Plus free!"

### Refund Policy
- 30-day money-back guarantee
- Prorated refunds for annual plans
- Clear refund process in settings
- No questions asked (though feedback welcome)

## Security & Compliance

### Payment Security
- Never store credit card numbers
- All handled by Stripe
- PCI DSS compliant via Stripe
- Encrypted data in transit (HTTPS)

### Legal Requirements
- Clear terms of service
- Privacy policy for payment data
- GDPR compliance (EU users)
- Right to export data
- Right to delete account and data

### Tax Handling
- Collect tax where required
- Stripe Tax handles calculation
- Include tax in checkout preview
- Show tax on invoices

## Future Enhancements
- **Usage-based pricing**: Pay for what you use (like Notion AI)
- **Add-ons**: Extra storage, AI credits, advanced features
- **Family plan**: 6 personal accounts, shared billing
- **Gift subscriptions**: Give Noted Plus/Team as a gift
- **Lifetime deal**: One-time payment for lifetime access
- **Partner program**: Discounts for partner companies
- **Volume discounts**: Better rates for large teams (100+)
- **Workspace transfer**: Move billing between team members
- **Multi-workspace billing**: Single payment for multiple workspaces
- **Flexible seat management**: Add/remove team members easily
- **Credit system**: Buy credits instead of subscription

