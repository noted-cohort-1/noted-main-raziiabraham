# Marketing Co-worker Agent Specification

## Overview

This document outlines the plan to implement a **Marketing Co-worker Agent** for Noted. Unlike traditional AI assistants that respond to explicit commands, this agent operates **autonomously as a co-worker** — continuously working on marketing tasks in the background based on configured goals.

> [!IMPORTANT]
> This is a specialized agent focused on **marketing intelligence and content creation**. It uses the [Vercel AI SDK ToolLoopAgent](https://ai-sdk.dev/docs/agents/overview) architecture and integrates with the **Adology MCP server** for competitive intelligence.

---

## The Four Outputs

The Marketing Co-worker produces four distinct types of output:

![The Four Outputs](/Users/raziiabraham/Documents/GitHub/noted-main/specs/four_outputs_diagram.png)

### 1. Feeds (Monitoring)
*"Here's what I'm watching for you"*

The AI builds and maintains surveillance of the competitive landscape:
- Brands and competitors
- Influencers and thought leaders
- Search terms and keywords
- Industry discussions

**This is ongoing, always-updating.**

### 2. Collections (Reference)
*"Here's content worth studying"*

The AI curates exemplary work relevant to the user's context:
- Ads and campaigns
- Posts and content
- Creative executions

Not everything from the feeds — **the best, most relevant, most instructive content**. This is the "swipe file" the AI builds for you.

### 3. Briefings (Synthesis)
*"Here's what you need to know"*

The AI synthesizes feeds and collections into strategic understanding:
- 4 Voices analysis
- Positioning maps
- Trend reports
- Competitive updates

**This is the AI's interpretation, not just the data.**

### 4. Creative Options (Generative)
*"Here's what you could make"*

The AI uses reference content and category understanding to propose:
- Creative directions
- Concepts and angles
- Territories to own
- Draft executions

**This is the AI as creative partner.**

---

## Key Differences: Co-worker vs Assistant

| Aspect | Traditional AI Assistant | Marketing Co-worker |
|--------|-------------------------|---------------------|
| **Activation** | User must prompt | Works continuously |
| **Mode** | Reactive | Proactive |
| **Relationship** | Tool | Team member |
| **Output** | Single responses | Ongoing deliverables |
| **Memory** | Per-session | Persistent context |
| **Personality** | Generic | Configured persona |

---

## Technical Architecture

### Vercel AI SDK Agent Pattern

Using the `ToolLoopAgent` class from AI SDK v5:

```typescript
import { ToolLoopAgent, tool, stepCountIs } from 'ai';
import { z } from 'zod';

// Marketing Co-worker Agent Definition
const marketingCoworker = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-4.5", // Configurable via BYOK
  instructions: `
    You are a Marketing Co-worker agent. You work autonomously on marketing
    tasks for your team. You monitor competitive intelligence, curate reference
    content, synthesize insights into briefings, and generate creative options.
    
    Your personality and specific focus areas are defined in your configuration.
    Work continuously on your assigned tasks without waiting for explicit commands.
  `,
  tools: {
    // Workspace tools
    readDocument,
    writeDocument,
    editDocument,
    searchWorkspace,
    createPage,
    
    // Adology MCP tools (future)
    getCompetitorAds,
    getIndustryTrends,
    analyzeCreative,
  },
  stopWhen: stepCountIs(50), // Allow complex multi-step workflows
});
```

### System Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Client (Next.js)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐   │
│  │  Agent Settings  │  │  Floating Chat   │  │   Outputs Dashboard      │   │
│  │  (Sidebar Link)  │  │  (Bottom Right)   │  │   (Feeds/Collections/    │   │
│  │                 │  │                  │  │    Briefings/Creative)   │   │
│  └────────┬────────┘  └────────┬─────────┘  └────────┬─────────────────┘   │
│           │                    │                     │                      │
│           └────────────────────┼─────────────────────┘                      │
│                               │                                             │
│                    ┌──────────▼──────────┐                                  │
│                    │   useCoworker()     │                                  │
│                    │   React Hook        │                                  │
│                    └──────────┬──────────┘                                  │
└───────────────────────────────┼─────────────────────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   API Route           │
                    │   /api/ai/coworker    │
                    │                       │
                    │ createAgentUIStream   │
                    │ Response()            │
                    └───────────┬───────────┘
                                │
┌───────────────────────────────┼─────────────────────────────────────────────┐
│                    Backend (Convex + AI SDK)                                 │
├───────────────────────────────┼─────────────────────────────────────────────┤
│           ┌───────────────────▼───────────────────┐                         │
│           │       ToolLoopAgent                    │                         │
│           │       (Marketing Co-worker)            │                         │
│           │                                        │                         │
│           │  • Configured instructions             │                         │
│           │  • Workspace tools                     │                         │
│           │  • Adology MCP tools (future)          │                         │
│           └───────────────────┬───────────────────┘                         │
│                               │                                             │
│    ┌──────────────┬───────────┼───────────┬──────────────┐                  │
│    ▼              ▼           ▼           ▼              ▼                  │
│ ┌──────┐    ┌──────────┐ ┌─────────┐ ┌─────────┐   ┌─────────────┐          │
│ │Config│    │Workspace │ │ Search  │ │ CRUD    │   │ Adology MCP │          │
│ │Store │    │Context   │ │ Index   │ │ Tools   │   │ (Future)    │          │
│ └──────┘    └──────────┘ └─────────┘ └─────────┘   └─────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Tools

### 1. Workspace Document Tools

The agent needs basic document operations across the workspace:

```typescript
// Read a document by ID
const readDocument = tool({
  description: 'Read the content of a document in the workspace',
  inputSchema: z.object({
    documentId: z.string().describe('The ID of the document to read'),
  }),
  execute: async ({ documentId }, { userId }) => {
    const doc = await ctx.runQuery(api.documents.getById, { id: documentId });
    if (!doc || doc.userId !== userId) {
      return { error: 'Document not found or access denied' };
    }
    return { 
      id: doc._id,
      title: doc.title,
      content: doc.content,
      parentDocument: doc.parentDocument,
      createdAt: doc._creationTime,
    };
  },
});

// Write/create a new document
const writeDocument = tool({
  description: 'Create a new document in the workspace',
  inputSchema: z.object({
    title: z.string().describe('Title of the new document'),
    content: z.string().describe('Content of the document (HTML format)'),
    parentId: z.string().optional().describe('Parent document ID for nesting'),
  }),
  execute: async ({ title, content, parentId }, { userId }) => {
    const docId = await ctx.runMutation(api.documents.create, {
      title,
      content,
      parentDocument: parentId,
    });
    return { success: true, documentId: docId };
  },
});

// Edit an existing document
const editDocument = tool({
  description: 'Edit/update an existing document',
  inputSchema: z.object({
    documentId: z.string().describe('The ID of the document to edit'),
    title: z.string().optional().describe('New title (if changing)'),
    content: z.string().optional().describe('New content (if changing)'),
  }),
  execute: async ({ documentId, title, content }, { userId }) => {
    await ctx.runMutation(api.documents.update, {
      id: documentId,
      title,
      content,
    });
    return { success: true, documentId };
  },
});

// Search across workspace
const searchWorkspace = tool({
  description: 'Search for documents in the workspace by title or content',
  inputSchema: z.object({
    query: z.string().describe('Search query'),
    limit: z.number().optional().default(10).describe('Max results'),
  }),
  execute: async ({ query, limit }, { userId }) => {
    const results = await ctx.runQuery(api.documents.search, { query, limit });
    return { 
      results: results.map(doc => ({
        id: doc._id,
        title: doc.title,
        preview: doc.content?.substring(0, 200),
      }))
    };
  },
});

// List all documents (for navigation)
const listDocuments = tool({
  description: 'List all documents in the workspace or under a parent',
  inputSchema: z.object({
    parentId: z.string().optional().describe('Parent ID to list children of'),
  }),
  execute: async ({ parentId }, { userId }) => {
    const docs = await ctx.runQuery(api.documents.getSidebar, { parentDocument: parentId });
    return { documents: docs };
  },
});
```

### 2. Adology MCP Tools (Future Integration)

These will connect to the Adology MCP server for marketing intelligence:

```typescript
// Placeholder interfaces - will be implemented with MCP
interface AdologyMCPTools {
  // Get competitor ad creative
  getCompetitorAds: (params: {
    competitor: string;
    platform: 'facebook' | 'instagram' | 'tiktok' | 'google';
    dateRange: { from: Date; to: Date };
  }) => Promise<AdCreative[]>;
  
  // Get industry trends
  getIndustryTrends: (params: {
    industry: string;
    keywords: string[];
  }) => Promise<TrendData>;
  
  // Analyze creative performance
  analyzeCreative: (params: {
    creativeId: string;
    metrics: string[];
  }) => Promise<CreativeAnalysis>;
  
  // Get influencer data
  getInfluencerInsights: (params: {
    niche: string;
    minFollowers: number;
  }) => Promise<InfluencerData[]>;
}
```

---

## Sidebar Organization

To clearly differentiate between user-created content and agent-generated work, the sidebar will be divided into two main sections:

### 1. Workspace (User Work)
- Contains all user-created documents, folders, and private pages.
- Standard Notion-like hierarchy.

### 2. Adology Agent (Coworker Work)
A dedicated section for the agent's autonomous outputs and configuration:

```
┌─────────────────────────────────────┐
│ ADOLOGY AGENT                       │
│                                     │
│ ⚙️ Configuration                     │  ← Opens Persona/System Prompt
│                                     │
│ 📂 Workspace                        │  ← Root folder for all agent work
│   ├── 📊 Feeds                      │  ← Monitoring output
│   ├── 📚 Collections                │  ← Curated swipe file
│   ├── 📝 Briefings                  │  ← Strategic synthesis
│   └── ✨ Creative                   │  ← Generative output
└─────────────────────────────────────┘
```

---

## Agent Configuration UI

### Entry Point: Sidebar "Adology Agent"

The agent has a primary entry point in the main application sidebar labeled **"Adology Agent"**.

- **Click Action**: Opens the Agent Configuration / Persona page.
- **Location**: Typically grouped with other high-level workspace tools.

#### Agent Configuration Page
Visible when clicking "Adology Agent" in the sidebar:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🤖 Adology Agent Configuration                                        ✕     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Agent Status: ● Active [Pause Agent]                                       │
│                                                                             │
│  Agent Persona & Instructions                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ You are a marketing co-worker focused on B2B SaaS content.            │  │
│  │                                                                       │  │
│  │ Tone: Professional but friendly                                       │  │
│  │ Focus areas:                                                          │  │
│  │ - Competitor analysis                                                 │  │
│  │ - Content strategy                                                     │  │
│  │ - Creative briefs                                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Monitoring Targets                                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ + Add competitor                                                      │  │
│  │ • Notion (@NotionHQ)                                                  │  │
│  │ • Coda (@cloghq)                                                      │  │
│  │ • Confluence (@Atlassian)                                              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Output Schedule                                                            │
│  ┌─────────────────────────────────────────┐  ┌──────────────────────────┐  │
│  │ Feeds: ○ Daily  ● Continuous            │  │ Briefings: ● Weekly      │  │
│  │ Creative: ○ On-demand ● Weekly          │  │                          │  │
│  └─────────────────────────────────────────┘  └──────────────────────────┘  │
│                                                                             │
│  [Save Configuration]                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Configuration Schema

```typescript
// convex/schema.ts - Agent configuration
coworkerConfig: defineTable({
  userId: v.string(),
  
  // Agent status
  isActive: v.boolean(),
  
  // Persona configuration
  persona: v.object({
    name: v.optional(v.string()),           // e.g., "Max" 
    systemPrompt: v.string(),               // Custom instructions
    tone: v.string(),                       // professional, casual, creative
    focusAreas: v.array(v.string()),        // Content strategy, Ads, Social, etc.
  }),
  
  // Monitoring targets
  monitoring: v.object({
    competitors: v.array(v.object({
      name: v.string(),
      handles: v.array(v.string()),         // Social handles
      websites: v.array(v.string()),        // URLs to monitor
    })),
    keywords: v.array(v.string()),          // Keywords to track
    industries: v.array(v.string()),        // Industry categories
  }),
  
  // Output schedule
  schedule: v.object({
    feedsFrequency: v.union(v.literal("continuous"), v.literal("daily")),
    briefingsFrequency: v.union(v.literal("daily"), v.literal("weekly")),
    creativeFrequency: v.union(v.literal("on-demand"), v.literal("weekly")),
  }),
  
  // Output folders (where the agent saves its work)
  outputFolders: v.object({
    feeds: v.optional(v.id("documents")),
    collections: v.optional(v.id("documents")),
    briefings: v.optional(v.id("documents")),
    creative: v.optional(v.id("documents")),
  }),
  
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"]),
```

## Chat UI Interface (Floating Widget)

The primary interaction for chatting with the agent is a **floating chat widget in the bottom-right corner** of the application.

```
┌─────────────────────────────────────────────────────────────────┐
│ 🤖 Adology Agent                                          ──  ✕ │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 📊 Current Status                                           │ │
│ │ Working on: Competitor analysis for Q1                      │ │
│ │ Last update: 2 hours ago                                    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│                                                                 │
│  You (2h ago):                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Can you focus more on Notion's recent ad campaigns?     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Co-worker:                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Got it! I've shifted my focus to Notion's campaigns.    │   │
│  │ I found 23 new ads from the last 30 days.               │   │
│  │                                                          │   │
│  │ Here's what I'm seeing:                                 │   │
│  │ • Heavy push on "AI writing" features                   │   │
│  │ • New "Notion Calendar" positioning                     │   │
│  │ • Targeting SMB audience on Meta                        │   │
│  │                                                          │   │
│  │ [📄 View Full Analysis] [📁 Open Collections]           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  You (just now):                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Create a brief for a counter-campaign                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Co-worker:                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔄 Working on it...                                     │   │
│  │                                                          │   │
│  │ → Analyzing Notion's positioning angles                 │   │
│  │ → Identifying differentiation opportunities             │   │
│  │ → Drafting creative brief...                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ 💬 Message your co-worker...                              ⏎    │
│                                                                 │
│ Quick: [📊 Status] [📝 Brief] [🔍 Research] [✨ Ideas]          │
└─────────────────────────────────────────────────────────────────┘
 [ 🤖 ] ← Floating Toggle (Bottom Right)
```
```

### Chat API Integration

Using `createAgentUIStreamResponse` from AI SDK:

```typescript
// app/api/ai/coworker/route.ts
import { createAgentUIStreamResponse } from 'ai';
import { marketingCoworker } from '@/lib/agent/marketing-coworker';

export async function POST(request: Request) {
  const { messages } = await request.json();
  
  // Get user's coworker configuration
  const config = await getCoworkerConfig(userId);
  
  // Inject configuration into agent context
  const agentWithContext = marketingCoworker.withContext({
    userConfig: config,
    workspaceSummary: await getWorkspaceSummary(userId),
  });
  
  return createAgentUIStreamResponse({
    agent: agentWithContext,
    messages,
  });
}
```

---

## Autonomous Operation Mode

The key differentiator: the agent works **continuously** without explicit prompts.

### Background Task Processing

```typescript
// convex/crons.ts - Scheduled agent execution
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run agent tasks every hour
crons.interval(
  "run-coworker-tasks",
  { hours: 1 },
  internal.coworker.processAllActiveAgents
);

export default crons;
```

```typescript
// convex/coworker.ts
import { internalAction } from "./_generated/server";

export const processAllActiveAgents = internalAction({
  handler: async (ctx) => {
    // Get all users with active coworker
    const configs = await ctx.runQuery(internal.coworkerConfig.getAllActive);
    
    for (const config of configs) {
      await ctx.scheduler.runAfter(0, internal.coworker.runAgentTask, {
        userId: config.userId,
        configId: config._id,
      });
    }
  },
});

export const runAgentTask = internalAction({
  args: { userId: v.string(), configId: v.id("coworkerConfig") },
  handler: async (ctx, { userId, configId }) => {
    const config = await ctx.runQuery(internal.coworkerConfig.getById, { id: configId });
    
    // Determine which tasks to run based on schedule
    const now = Date.now();
    const tasks = determineTasksToRun(config, now);
    
    for (const task of tasks) {
      switch (task) {
        case 'update_feeds':
          await runFeedsUpdate(ctx, userId, config);
          break;
        case 'update_collections':
          await runCollectionsUpdate(ctx, userId, config);
          break;
        case 'generate_briefing':
          await runBriefingGeneration(ctx, userId, config);
          break;
        case 'generate_creative':
          await runCreativeGeneration(ctx, userId, config);
          break;
      }
    }
    
    // Update last run timestamp
    await ctx.runMutation(internal.coworkerConfig.updateLastRun, {
      id: configId,
      lastRun: now,
    });
  },
});
```

---

## Output Organization

The agent creates and organizes its outputs in a dedicated **"Adology Agent"** section of the workspace. This data is stored in the same database but tagged/folderized for clear separation.

### Folder Structure (in Database)

```
📁 [Workspace Root]
│
├── 📁 ... (User Folders)
│
└── 📁 Adology Agent/                ← Protected system folder
    │
    ├── 📁 Feeds/                    ← "Here's what I'm watching"
    │   ├── 📄 Daily Update 2026-01-25
    │   └── 📄 ...
    │
    ├── 📁 Collections/              ← "Here's content worth studying"
    │   ├── 📄 Swipe File: SaaS Ads
    │   └── 📄 ...
    │
    ├── 📁 Briefings/                ← "Here's what you need to know"
    │   ├── 📄 Weekly Strategy Brief
    │   └── 📄 ...
    │
    └── 📁 Creative/                 ← "Here's what you could make"
        ├── 📄 Campaign Concept: Alpha
        └── 📄 ...
```

### Automatic File Naming & Metadata
- **Naming Convention**: `[Type] [Topic] [Date]` (e.g., "Briefing: Q1 Strategy 2026-01-25")
- **Metadata**: Documents created by the agent are tagged with `createdBy: "agent"` for tracking purposes.

> [!NOTE]
> Agent outputs use **native Noted page capabilities**. No custom rendering or special document types are needed — the agent creates standard pages that work with all existing editor features (BlockNote, comments, sharing, etc.).

---

## Implementation Phases (3-Phase Approach)

### Phase 1: Agent Foundation & Chat UI

**Goal**: Get a working agent that users can chat with and that can read/write to the workspace.

**Duration**: 2-3 weeks

**Deliverables**:
- [ ] **Sidebar Entry Point**
  - Add "Adology Agent" section to the sidebar
  - Create `AdologyAgentConfig.tsx` configuration page
  - Implement persona/system prompt editor

- [ ] **AI SDK Agent Setup**
  - Set up `ToolLoopAgent` with Vercel AI SDK
  - Use existing BYOK settings (OpenAI, Anthropic, Google)
  - Implement `createAgentUIStreamResponse` for streaming

- [ ] **Workspace Tools (Core)**
  - `readDocument` - Read document content by ID
  - `writeDocument` - Create new documents
  - `editDocument` - Update existing documents
  - `searchWorkspace` - Search across documents
  - `listDocuments` - List documents in workspace

- [ ] **Floating Chat Widget**
  - Bottom-right floating toggle button
  - Chat panel with message history
  - Quick action buttons (Status, Brief, Research, Ideas)
  - Real-time streaming responses

- [ ] **Database Schema**
  - `coworkerConfig` table (persona, monitoring targets, schedule)
  - `coworkerMessages` table (chat history persistence)

**Success Criteria**:
- User can open chat, send a message, and receive a streamed response
- Agent can read and create documents in the workspace
- Configuration is saved and persists across sessions

---

### Phase 2: Autonomous Operation & Folder Structure

**Goal**: Enable the agent to work continuously in the background and organize its outputs.

**Duration**: 2-3 weeks

**Dependencies**: Phase 1 complete

**Deliverables**:
- [ ] **Agent Output Folders**
  - Auto-create "Adology Agent" folder structure on first run
  - Feeds, Collections, Briefings, Creative subfolders
  - Documents tagged with `createdBy: "agent"` metadata

- [ ] **Sidebar Agent Section**
  - Display agent folder hierarchy in sidebar
  - Visual distinction between user and agent content
  - "Agent" badge on auto-generated documents

- [ ] **Autonomous Background Processing**
  - Convex cron jobs for scheduled agent runs
  - Task scheduler based on user configuration
  - Feeds: Continuous or daily updates
  - Briefings: Weekly synthesis
  - Creative: On-demand or weekly

- [ ] **Status & Notifications**
  - Agent status indicator (Active/Paused/Working)
  - "Last updated" timestamp on outputs
  - Toast notifications for new briefings/content

- [ ] **Action Logging**
  - Log all agent actions (create, edit, search)
  - Viewable activity history in configuration page

**Success Criteria**:
- Agent runs on schedule without user intervention
- Outputs are correctly organized in the folder structure
- User can pause/resume the agent at any time
- Activity log shows what the agent has done

---

### Phase 3: Adology MCP Integration & Intelligence

**Goal**: Connect to real marketing data via Adology MCP server for meaningful outputs.

**Duration**: 3-4 weeks

**Dependencies**: Phase 2 complete, Adology MCP server available

**Deliverables**:
- [ ] **MCP Server Connection**
  - Connect to Adology MCP server
  - Authenticate and maintain connection
  - Handle connection errors gracefully

- [ ] **Marketing Intelligence Tools**
  - `getCompetitorAds` - Fetch competitor ad creatives
  - `getIndustryTrends` - Get trending topics and keywords
  - `analyzeCreative` - Analyze ad performance metrics
  - `getInfluencerInsights` - Discover relevant influencers

- [ ] **Four Outputs with Real Data**
  - **Feeds**: Populated with actual competitor monitoring
  - **Collections**: Curated from real ad library data
  - **Briefings**: Synthesized from actual market intelligence
  - **Creative**: Generated based on real competitive insights

- [ ] **Advanced Configuration**
  - Competitor targeting by brand/handle/URL
  - Keyword and industry tracking setup
  - Custom output templates

- [ ] **Polish & Optimization**
  - Rate limiting and cost controls
  - Caching for repeated queries
  - Performance optimization for large workspaces

**Success Criteria**:
- Agent produces meaningful marketing intelligence from real data
- Users can configure specific competitors to monitor
- Outputs reflect actual market conditions and competitive landscape

---

### Phase Summary

| Phase | Focus | Duration | Key Outcome |
|-------|-------|----------|-------------|
| **1** | Foundation & Chat | 2-3 weeks | Working agent with chat UI and workspace tools |
| **2** | Autonomous & Structure | 2-3 weeks | Background operation with organized outputs |
| **3** | Adology Integration | 3-4 weeks | Real marketing intelligence from MCP server |

**Total Estimated Time**: 7-10 weeks

---

## File Structure

```
app/
├── api/ai/
│   └── coworker/
│       └── route.ts                # Agent chat endpoint
├── (main)/_components/
│   ├── AdologyAgentConfig.tsx      # Sidebar entry page UI
│   └── CoworkerFloatingChat.tsx    # Floating UI

components/
├── coworker/
│   ├── CoworkerChat.tsx            # Chat component
│   ├── CoworkerMessage.tsx         # Message bubbles
│   ├── CoworkerStatus.tsx          # Status indicator
│   └── CoworkerQuickActions.tsx    # Quick action buttons

convex/
├── coworker.ts                     # Agent execution logic
├── coworkerConfig.ts               # Configuration mutations/queries
├── coworkerMessages.ts             # Chat message storage
└── crons.ts                        # Background task scheduling

hooks/
├── useCoworker.ts                  # Main agent hook
└── useCoworkerConfig.ts            # Configuration hook

lib/
├── agent/
│   ├── marketing-coworker.ts       # ToolLoopAgent definition
│   ├── tools/
│   │   ├── workspace.ts            # Document CRUD tools
│   │   ├── search.ts               # Search tools
│   │   └── adology.ts              # MCP integration (future)
│   └── prompts/
│       └── marketing-persona.ts    # Default system prompts
```

---

## Security & Permissions

### Agent Capabilities
- Can only access documents owned by the user
- Cannot share or publish documents
- Cannot access other users' workspaces
- All actions logged for audit

### Action Logging
```typescript
// Every agent action is logged
agentActionLog: defineTable({
  userId: v.string(),
  action: v.string(),              // 'create_page', 'edit_document', etc.
  target: v.optional(v.string()),  // Document ID affected
  input: v.string(),               // Agent's reasoning
  output: v.string(),              // Result
  timestamp: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_timestamp", ["timestamp"]),
```

---

## Success Metrics

### Engagement
- % of users who enable co-worker
- Average messages per week
- Agent uptime/activity

### Output Quality
- Documents created by agent per user
- User edits to agent-generated content (less = better)
- User satisfaction ratings

### Business Impact
- Time saved (estimated from task complexity)
- Premium conversion rate for agent users
- Retention rate for agent users vs non-users

---

## Open Questions

1. **What's the free tier limit?**
   - Number of agent runs per day?
   - Output pages per month?

2. **How to handle API costs for autonomous mode?**
   - Background tasks consume BYOK credits
   - Need usage monitoring/limits

3. **How to prevent runaway agents?**
   - Max steps per run
   - Rate limiting on document creation
   - User can pause/stop anytime

4. **When to notify the user?**
   - New briefing created?
   - Important finding discovered?
   - Agent needs clarification?

---

## References

- [Vercel AI SDK - Agents Overview](https://ai-sdk.dev/docs/agents/overview)
- [Vercel AI SDK - Building Agents](https://ai-sdk.dev/docs/agents/building-agents)
- [Vercel AI SDK - Loop Control](https://ai-sdk.dev/docs/agents/loop-control)
- [BlockNote AI Extension](https://www.blocknotejs.org/docs/ai)

---

**Author**: AI Planning Session  
**Created**: January 25, 2026  
**Updated**: January 25, 2026  
**Status**: Planning / Proposal  
**Depends On**: [01-ai-features.md](./01-ai-features.md) (Current AI MVP)
