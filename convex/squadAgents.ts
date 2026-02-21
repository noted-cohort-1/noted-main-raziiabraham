import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * List all squad agents for a user
 */
export const list = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        const userId = identity.subject;

        const agents = await ctx.db
            .query("squadAgents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();

        const filteredAgents = [];
        for (const agent of agents) {
            const doc = await ctx.db.get(agent.instructionsDocId);
            if (doc && !doc.isArchived) {
                filteredAgents.push({
                    ...agent,
                    name: doc.title,
                    icon: doc.icon || agent.icon,
                });
            }
        }

        return filteredAgents;
    },
});

/**
 * Get a squad agent by ID
 */
export const getById = query({
    args: { id: v.id("squadAgents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const agent = await ctx.db.get(args.id);
        if (!agent || agent.userId !== identity.subject) {
            return null;
        }
        return agent;
    },
});

/**
 * Create a new squad agent
 */
export const create = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        icon: v.optional(v.string()),
        instructionsDocId: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");
        const userId = identity.subject;

        const now = Date.now();
        return await ctx.db.insert("squadAgents", {
            userId,
            name: args.name,
            description: args.description,
            icon: args.icon,
            instructionsDocId: args.instructionsDocId,
            createdAt: now,
            updatedAt: now,
        });
    },
});

/**
 * Update an agent
 */
export const update = mutation({
    args: {
        id: v.id("squadAgents"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        icon: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const existing = await ctx.db.get(args.id);
        if (!existing || existing.userId !== identity.subject) {
            throw new Error("Agent not found");
        }

        const { id, ...updates } = args;
        await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        });

        return id;
    },
});

/**
 * Extract plain text from BlockNote content
 */
export function extractTextFromBlocks(content: string): string {
    try {
        const blocks = JSON.parse(content);
        let text = "";

        const processBlock = (block: any) => {
            if (Array.isArray(block.content)) {
                block.content.forEach((item: any) => {
                    if (typeof item === "string") text += item;
                    else if (item.text) text += item.text;
                });
            } else if (typeof block.content === "string") {
                text += block.content;
            }

            text += "\n";
            if (block.children) {
                block.children.forEach(processBlock);
            }
        };

        blocks.forEach(processBlock);
        return text;
    } catch (e) {
        return content; // Fallback to raw string if not JSON
    }
}


/**
 * Remove an agent
 */
export const remove = mutation({
    args: { id: v.id("squadAgents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const existing = await ctx.db.get(args.id);
        if (!existing || existing.userId !== identity.subject) {
            throw new Error("Agent not found");
        }

        await ctx.db.delete(args.id);
        return true;
    },
});

/**
 * Find agent by its instruction document ID
 */
export const findByDocId = query({
    args: { documentId: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        return await ctx.db
            .query("squadAgents")
            .withIndex("by_user", (q) => q.eq("userId", identity.subject))
            .filter((q) => q.eq(q.field("instructionsDocId"), args.documentId))
            .first();
    },
});
