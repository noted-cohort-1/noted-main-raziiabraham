import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get the user's coworker configuration
 */
export const getConfig = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const config = await ctx.db
            .query("coworkerConfig")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        return config;
    },
});

/**
 * Create initial coworker configuration for a user
 */
export const createConfig = mutation({
    args: {
        persona: v.object({
            name: v.optional(v.string()),
            systemPrompt: v.string(),
            tone: v.string(),
            focusAreas: v.array(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        // Check if config already exists
        const existing = await ctx.db
            .query("coworkerConfig")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (existing) {
            throw new Error("Configuration already exists");
        }

        const now = Date.now();

        const configId = await ctx.db.insert("coworkerConfig", {
            userId,
            isActive: true,
            persona: args.persona,
            createdAt: now,
            updatedAt: now,
        });

        return configId;
    },
});

/**
 * Update coworker configuration
 */
export const updateConfig = mutation({
    args: {
        isActive: v.optional(v.boolean()),
        persona: v.optional(
            v.object({
                name: v.optional(v.string()),
                systemPrompt: v.string(),
                tone: v.string(),
                focusAreas: v.array(v.string()),
            })
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const config = await ctx.db
            .query("coworkerConfig")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!config) {
            throw new Error("Configuration not found");
        }

        const updates: Record<string, unknown> = {
            updatedAt: Date.now(),
        };

        if (args.isActive !== undefined) {
            updates.isActive = args.isActive;
        }

        if (args.persona !== undefined) {
            updates.persona = args.persona;
        }

        await ctx.db.patch(config._id, updates);

        return config._id;
    },
});

/**
 * Toggle agent active state
 */
export const toggleActive = mutation({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const config = await ctx.db
            .query("coworkerConfig")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!config) {
            throw new Error("Configuration not found");
        }

        await ctx.db.patch(config._id, {
            isActive: !config.isActive,
            updatedAt: Date.now(),
        });

        return !config.isActive;
    },
});

/**
 * Upsert configuration - create if not exists, update if exists
 * Now simplified to just require instructionsDocId
 */
export const upsertConfig = mutation({
    args: {
        instructionsDocId: v.id("documents"),
        persona: v.optional(v.object({
            name: v.optional(v.string()),
            systemPrompt: v.string(),
            tone: v.string(),
            focusAreas: v.array(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;
        const now = Date.now();

        const existing = await ctx.db
            .query("coworkerConfig")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        const updates: any = {
            instructionsDocId: args.instructionsDocId,
            updatedAt: now,
        };

        // Only update persona if provided (for backward compatibility)
        if (args.persona !== undefined) {
            updates.persona = args.persona;
        }

        if (existing) {
            await ctx.db.patch(existing._id, updates);
            return existing._id;
        } else {
            // For new configs, use a minimal default persona
            const defaultPersona = {
                name: undefined,
                systemPrompt: "",
                tone: "professional",
                focusAreas: [],
            };

            const configId = await ctx.db.insert("coworkerConfig", {
                userId,
                isActive: true,
                persona: args.persona || defaultPersona,
                instructionsDocId: args.instructionsDocId,
                createdAt: now,
                updatedAt: now,
            });
            return configId;
        }
    },
});

/**
 * Reset configuration (unlink instructions document)
 */
export const resetConfig = mutation({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const config = await ctx.db
            .query("coworkerConfig")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!config) {
            throw new Error("Configuration not found");
        }

        // Unlink the instructions document
        // We don't delete the document here to be safe, just unlink it
        // The frontend will create a new one when it sees no ID
        await ctx.db.patch(config._id, {
            instructionsDocId: undefined,
            updatedAt: Date.now(),
        });

        return true;
    },
});
