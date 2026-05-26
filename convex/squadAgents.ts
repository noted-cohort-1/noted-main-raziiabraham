import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import {
    extractAgentDescriptionFromContent,
    extractTextFromBlocks,
} from "../lib/blocknote-content";

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
                let dynamicDescription = agent.description;
                if (doc.content) {
                    dynamicDescription = extractAgentDescriptionFromContent(
                        doc.content,
                        agent.description ?? "",
                    );
                }

                filteredAgents.push({
                    ...agent,
                    name: doc.title,
                    icon: doc.icon || agent.icon,
                    description: dynamicDescription,
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

        const doc = await ctx.db.get(agent.instructionsDocId);
        if (!doc || doc.isArchived) {
            return null;
        }

        let dynamicDescription = agent.description;
        if (doc.content) {
            dynamicDescription = extractAgentDescriptionFromContent(
                doc.content,
                agent.description ?? "",
            );
        }

        return {
            ...agent,
            name: doc.title,
            icon: doc.icon || agent.icon,
            description: dynamicDescription,
        };
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

export { extractTextFromBlocks };
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
