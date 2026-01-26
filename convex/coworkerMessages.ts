import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get chat messages for the coworker conversation
 */
export const getMessages = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;
        const limit = args.limit ?? 50;

        const messages = await ctx.db
            .query("coworkerMessages")
            .withIndex("by_user_time", (q) => q.eq("userId", userId))
            .order("asc")
            .take(limit);

        return messages;
    },
});

/**
 * Get recent messages (for context window)
 */
export const getRecentMessages = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;
        const limit = args.limit ?? 20;

        // Get most recent messages
        const messages = await ctx.db
            .query("coworkerMessages")
            .withIndex("by_user_time", (q) => q.eq("userId", userId))
            .order("desc")
            .take(limit);

        // Return in chronological order
        return messages.reverse();
    },
});

/**
 * Add a new message to the conversation
 */
export const addMessage = mutation({
    args: {
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        reasoning: v.optional(v.string()),
        toolInvocations: v.optional(v.any()),
        parts: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const messageId = await ctx.db.insert("coworkerMessages", {
            userId,
            role: args.role,
            content: args.content,
            reasoning: args.reasoning,
            toolInvocations: args.toolInvocations,
            parts: args.parts,
            createdAt: Date.now(),
        });

        return messageId;
    },
});

/**
 * Clear all chat history for the user
 */
export const clearHistory = mutation({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const messages = await ctx.db
            .query("coworkerMessages")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        for (const message of messages) {
            await ctx.db.delete(message._id);
        }

        return { deleted: messages.length };
    },
});
