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
      provider: settings.provider,
      model: settings.model,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  },
});

export const createSettings = internalMutation({
  args: {
    userId: v.string(),
    provider: v.string(),
    encryptedKey: v.string(),
    model: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("aiSettings", {
      userId: args.userId,
      provider: args.provider,
      apiKey: args.encryptedKey,
      model: args.model,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });
  },
});

export const updateSettings = internalMutation({
  args: {
    id: v.id("aiSettings"),
    encryptedKey: v.string(),
    model: v.optional(v.string()),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      apiKey: args.encryptedKey,
      model: args.model,
      updatedAt: args.updatedAt,
    });
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

export const getSettingsWithKey = internalQuery({
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
