import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";

export const getSettings = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const settings = await ctx.db
      .query("aiSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!settings) {
      return null;
    }

    return {
      _id: settings._id,
      userId: settings.userId,
      provider: settings.activeProvider,
      model: settings.activeModel,

      // Return boolean flags indicating if keys exist
      hasOpenAIKey: !!settings.openaiKey,
      hasAnthropicKey: !!settings.anthropicKey,
      hasGoogleKey: !!settings.googleKey,

      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  },
});

export const createSettings = internalMutation({
  args: {
    userId: v.string(),
    activeProvider: v.string(),
    activeModel: v.optional(v.string()),

    // Optional keys
    openaiKey: v.optional(v.string()),
    anthropicKey: v.optional(v.string()),
    googleKey: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("aiSettings", {
      userId: args.userId,
      activeProvider: args.activeProvider,
      activeModel: args.activeModel,
      openaiKey: args.openaiKey,
      anthropicKey: args.anthropicKey,
      googleKey: args.googleKey,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });
  },
});

export const updateSettings = internalMutation({
  args: {
    id: v.id("aiSettings"),
    activeProvider: v.optional(v.string()),
    activeModel: v.optional(v.string()),

    // Optional keys to update
    openaiKey: v.optional(v.string()),
    anthropicKey: v.optional(v.string()),
    googleKey: v.optional(v.string()),

    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Construct patch object only with provided fields
    const patch: any = { updatedAt: args.updatedAt };
    if (args.activeProvider !== undefined) patch.activeProvider = args.activeProvider;
    if (args.activeModel !== undefined) patch.activeModel = args.activeModel;
    if (args.openaiKey !== undefined) patch.openaiKey = args.openaiKey;
    if (args.anthropicKey !== undefined) patch.anthropicKey = args.anthropicKey;
    if (args.googleKey !== undefined) patch.googleKey = args.googleKey;

    await ctx.db.patch(args.id, patch);
  },
});

export const deleteSettings = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const settings = await ctx.db
      .query("aiSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (settings) {
      await ctx.db.delete(settings._id);
    }

    return { success: true };
  },
});

export const getSettingsWithKeys = internalQuery({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const settings = await ctx.db
      .query("aiSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return settings;
  },
});
