# Team Collaboration Specification

## Overview
Users can invite others to work together on their pages and workspaces. You can invite people to see everything in your workspace, or just share specific pages with them. Each person has different permission levels.

## Why We Need This
- **Collaboration**: Teams can work together on documents
- **Organization**: Keep work organized in shared workspaces
- **Control**: Owners decide who sees what
- **Productivity**: No more emailing documents back and forth

## Key Features

### 1. Workspaces
- Every user has a personal workspace (their own space)
- Users can create team workspaces
- Each workspace has:
  - Name (e.g., "Marketing Team", "Project Alpha")
  - Icon/avatar
  - List of all pages inside
  - List of team members

### 2. Inviting Team Members
- Invite by email address
- Set permission level when inviting:
  - **Owner**: Full control, can delete workspace
  - **Editor**: Can create, edit, delete pages
  - **Viewer**: Can only view, cannot edit
- Send invitation link via email
- Track pending invitations

### 3. Page-Level Sharing
- Share individual pages without sharing whole workspace
- Options:
  - Share with specific people (by email)
  - Share with anyone who has the link
  - Make page public (anyone on internet)
- Set permissions per page:
  - **Full Access**: Can edit, share, delete
  - **Can Edit**: Can make changes, cannot delete or share
  - **Can Comment**: Can add comments, cannot edit content
  - **Can View**: Read-only access

### 4. Comments & Discussions (Notion-Style)
- **Inline Comments**: Highlight any text and add a comment
- **Comment Threads**: Reply to comments, create discussions
- **@Mentions**: Tag people to notify them (`@john`, `@sarah`)
- **Page Mentions**: Reference other pages (`@Page Name`)
- **Resolve Comments**: Mark discussions as resolved
- **Comment Notifications**: Get notified when:
  - Someone mentions you
  - Someone replies to your comment
  - Someone comments on your page
- **Comment Sidebar**: View all comments on right side
- **Filter Comments**: Show resolved, unresolved, or all

### 5. Guest Access (Notion-Style)
- Invite people without adding them to full workspace
- Guests can only see specific pages they're invited to
- Guest permissions:
  - Can edit specific pages
  - Can comment only
  - Can view only
- Guests show with "Guest" badge
- No limit on guest count (even on free plan)
- Perfect for clients, contractors, or external partners

### 6. Member Management
- See list of all workspace members and guests
- View each member's role and access level
- Change member permissions anytime
- Remove members (they lose access immediately)
- Transfer ownership to another member
- See who's currently viewing a page (live presence)
- Member activity log (who did what, when)

### 7. Page Templates
- Create reusable page templates
- Template library:
  - Meeting notes
  - Project brief
  - Weekly report
  - Product roadmap
  - Design doc
  - User research
- Share templates with team
- Anyone can create new pages from templates
- Templates can include structure, placeholders, and instructions
- Option to publish templates to community

### 8. Activity & History
- See who edited what and when
- View page history and restore old versions
- Activity feed showing recent changes
- Updates sidebar (see all changes across workspace)
- Notifications when someone:
  - Edits a shared page
  - Comments on your page
  - Mentions you (@you)
  - Invites you to a workspace
  - Shares a new page with you
- Digest emails (daily or weekly summary)

## User Flow

### Creating a Team Workspace
1. User clicks workspace dropdown (top left)
2. Clicks "+ New Workspace"
3. Enters workspace name
4. Chooses an icon (optional)
5. Clicks "Create"
6. New workspace is created
7. User can start inviting people

### Inviting Someone to a Workspace
1. User opens workspace settings
2. Clicks "Members" tab
3. Clicks "Invite People"
4. Enters email addresses (can add multiple)
5. Selects permission level (Owner, Editor, Viewer)
6. Adds optional personal message
7. Clicks "Send Invitations"
8. System sends email invites
9. Pending invites show in member list

### Accepting an Invitation
1. Person receives email invitation
2. Clicks "Accept Invitation" button in email
3. Lands on signup page (if new user) or login page
4. After login, automatically joins workspace
5. Can see all workspace pages they have access to

### Sharing a Specific Page
1. User opens a page
2. Clicks "Share" button (top right)
3. Share modal opens with options:
   - Add people by email
   - Get shareable link
   - Make public
4. User enters email addresses
5. Sets permission (Editor, Commenter, Viewer)
6. Clicks "Share"
7. People receive email with link to page

### Adding a Comment (Notion-Style)
1. User highlights text on a page
2. Clicks "Comment" button in floating toolbar
3. Comment box appears on the right side
4. User types comment
5. Can @mention someone: types `@j` to see list of people
6. Selects `@john` from dropdown
7. Clicks "Comment" button
8. Comment appears attached to highlighted text
9. John receives notification about the mention
10. Highlighted text shows yellow indicator

### Replying to Comments
1. User sees comment indicator on page
2. Clicks the indicator
3. Comment thread opens on right side
4. User types reply
5. Can @mention others in reply
6. Clicks "Reply"
7. Thread updates with new reply
8. All thread participants get notified

### Inviting a Guest (Not Full Member)
1. User opens a specific page
2. Clicks "Share" button
3. Enters email address
4. Toggle shows "Add as Guest" (default)
5. Sets permission level (Edit, Comment, or View)
6. Clicks "Invite Guest"
7. Guest receives email with link to just that page
8. Guest can access only that specific page
9. Guest shows with "Guest" badge in member list

### Managing Team Members
1. Workspace owner clicks "Workspace Settings"
2. Goes to "Members & Guests" tab
3. Sees two lists:
   - Full Members (with workspace access)
   - Guests (page-specific access)
4. Can click menu (⋯) next to any member:
   - Change role
   - Remove from workspace
   - Transfer ownership (if owner)
   - View pages they have access to (for guests)
5. Changes take effect immediately

### Using Page Templates
1. User clicks "+ New Page" dropdown
2. Selects "From Template"
3. Modal shows template library:
   - Personal templates
   - Team templates
   - Community templates
4. User previews template by hovering
5. Clicks "Use This Template"
6. New page created with template structure
7. User fills in placeholders and customizes

## Technical Requirements

### Database Schema
- Workspace table:
  - ID, name, icon, owner_id, created_at
- Workspace members table:
  - workspace_id, user_id, role, is_guest, joined_at
- Page permissions table:
  - page_id, user_id, permission_level, granted_by, is_guest
- Invitations table:
  - ID, workspace_id, email, role, token, status, expires_at, is_guest
- Comments table:
  - ID, page_id, user_id, content, parent_id, resolved, created_at
  - text_range_start, text_range_end (for inline comments)
- Mentions table:
  - ID, comment_id, mentioned_user_id, mentioned_page_id, read_status
- Templates table:
  - ID, name, content, created_by, workspace_id, is_public, category
- Notifications table:
  - ID, user_id, type, related_id, read_status, created_at

### User Interface
- Workspace switcher dropdown (like Notion)
- Workspace settings page with tabs
- Member & Guest management interface
- Share modal with guest/member toggle
- Invitation acceptance page
- Member list with avatars, roles, and badges (Guest/Member)
- Comment sidebar (right side of page)
- Inline comment indicators on text
- @mention autocomplete dropdown
- Activity feed/updates sidebar
- Template library modal
- Template preview cards
- Live presence indicators (who's viewing)
- Notification center (bell icon)
- Unread notification badge

### Permissions System
- Check permissions on every page load
- Block unauthorized edits on backend
- Show/hide UI elements based on permissions
- Real-time permission updates

### Email Notifications
- Invitation emails with accept link
- Notification when added to workspace
- Daily/weekly digest of activity (user choice)
- @mention notifications (immediate)
- Comment reply notifications
- New comment on your page
- Page shared with you
- Permission changes
- Reminder emails for pending invites
- Workspace activity summary (weekly)

### Real-Time Features
- Live presence (see who's online)
- Real-time cursors (see where people are typing)
- Instant updates when others edit
- Conflict resolution for simultaneous edits

## Success Criteria

### User Experience
- Inviting someone takes less than 30 seconds
- Users can find "Share" button within 5 seconds
- No confusion about permission levels
- Clear visual indicators of shared vs. private pages
- Accepting invitation works in one click

### Technical
- Permission checks happen on every request
- Zero unauthorized access incidents
- Real-time updates work 99.9% of the time
- Email invites delivered within 1 minute
- Support at least 50 members per workspace

### Business
- At least 40% of users invite someone
- Average workspace has 3+ members
- Shared pages are edited 3x more than private pages
- Less than 10% of invitations rejected

## Security & Privacy

### Access Control
- Always verify permissions server-side
- Encrypted invitation tokens
- Tokens expire after 7 days
- Audit log of all permission changes
- Workspace owners can see all activity

### Data Protection
- Members only see pages they have access to
- Removing member revokes all access immediately
- Deleted workspaces remove all member access
- Export workspace data before deletion

## Future Enhancements
- Workspace homepage with key pages (like Notion)
- Page analytics (views, edits, top contributors)
- Advanced roles (custom permission sets)
- Workspace-level branding (logo, colors)
- Integration with Slack/Teams for notifications
- Public workspace profile pages
- Workspace search across all pages
- Duplicate page/template feature
- Move pages between workspaces
- Nested workspaces (sub-workspaces)
- Calendar view for pages with dates
- Board view (Kanban-style page organization)
- Wiki-style linking between pages
- Automatic backlinks (see what pages link to this one)

