import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),
  aiSettings: defineTable({
    userId: v.string(),
    activeProvider: v.optional(v.string()), // Optional for migration
    activeModel: v.optional(v.string()),

    // Encrypted keys for each provider
    openaiKey: v.optional(v.string()),
    anthropicKey: v.optional(v.string()),
    googleKey: v.optional(v.string()),
    relevanceKey: v.optional(v.string()), // Encrypted Relevance AI API key (BYOK)

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
  userStorage: defineTable({
    userId: v.string(),
    bytesUsed: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
  files: defineTable({ // [NEW] Table to track uploaded files
    name: v.string(),
    type: v.string(), // MIME type
    url: v.string(),
    userId: v.string(),
    size: v.number(),
    documentId: v.optional(v.id("documents")),
    documentIds: v.optional(v.array(v.id("documents"))), // [NEW] Support multiple docs
    checksum: v.optional(v.string()), // [NEW] Content hash for deduplication
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_document", ["userId", "documentId"])
    .index("by_checksum", ["userId", "checksum"]), // [NEW] Fast lookup for dupes

  // Marketing Co-worker Chat Messages
  coworkerMessages: defineTable({
    userId: v.string(),
    agentId: v.optional(v.string()), // [NEW] Target agent ID (null = default)
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    reasoning: v.optional(v.string()), // Store reasoning tokens
    toolInvocations: v.optional(v.any()), // Store tool calls and results
    parts: v.optional(v.any()), // [NEW] Store full interleaved message parts
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_time", ["userId", "createdAt"]),

  // [NEW] Squad Agents Configuration
  squadAgents: defineTable({
    userId: v.string(),
    name: v.string(),              // Agent display name
    description: v.optional(v.string()), // Short description
    icon: v.optional(v.string()),  // Emoji icon
    instructionsDocId: v.id("documents"), // Links to document whose content = system prompt
    toolIds: v.optional(v.array(v.string())), // Linked Relevance AI tool IDs
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
});
