# Feature Specification: [FEATURE NAME]

**Linear Ticket**: [NOT-XXXX](https://linear.app/avidx-app/issue/NOT-XXXX)
**Feature Branch**: `[type/NOT-XXXX-feature-name]`
**Created**: [DATE]
**Status**: Draft
**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently — e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: Replace these placeholders with the actual edge cases for this feature.

  For noted, edge cases worth thinking about:
  - What happens for unauthenticated users? (Clerk identity null)
  - What happens for archived/published documents?
  - What happens when a user is at storage quota?
  - What happens when AI provider is unconfigured / rate-limited?
  - What happens during real-time conflicts (Convex reactive updates landing during edits)?
-->

- What happens when [boundary condition]?
- How does the system handle [error scenario]?

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: Replace these placeholders with the actual functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to add a presence indicator on documents"]
- **FR-002**: System MUST [specific capability, e.g., "validate the document belongs to the current user via Clerk identity"]
- **FR-003**: Users MUST be able to [key interaction, e.g., "see who else is currently viewing the document"]
- **FR-004**: System MUST [data requirement, e.g., "persist the last-active timestamp per user per document"]
- **FR-005**: System MUST [behavior, e.g., "expire presence after 60 seconds of inactivity"]

_Example of marking unclear requirements:_

- **FR-006**: System MUST identify users via [NEEDS CLARIFICATION: should presence show full name, first name only, or just an avatar?]
- **FR-007**: System MUST retain presence history for [NEEDS CLARIFICATION: any retention requirement, or transient only?]

### Key Entities _(include if feature involves data)_

- **[Entity 1]**: [What it represents, key attributes — describe at the conceptual level. Avoid mentioning the Convex `defineTable` shape here; that lives in the plan.]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable from a user/business perspective,
  not from server/code internals.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users see another collaborator's presence within 2 seconds of them joining"]
- **SC-002**: [Measurable metric, e.g., "≥95% of documents with concurrent editors show accurate presence"]
- **SC-003**: [User satisfaction metric, e.g., "≥80% of users in the test cohort find presence ‘useful’ in post-launch survey"]
- **SC-004**: [Business metric, e.g., "Increase weekly active users on shared documents by 20% within 30 days of launch"]
