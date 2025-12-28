import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const save = mutation({
    args: {
        name: v.string(),
        type: v.string(),
        url: v.string(),
        userId: v.string(),
        size: v.number(),
        documentId: v.optional(v.id("documents")),
    },
    handler: async (ctx, args) => {
        // Check if file already exists with same URL to prevent duplicates
        const existing = await ctx.db
            .query("files")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("url"), args.url))
            .first();

        if (existing) {
            return existing._id;
        }

        const fileId = await ctx.db.insert("files", {
            ...args,
            createdAt: Date.now(),
        });

        return fileId;
    },
});

export const remove = mutation({
    args: {
        url: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const file = await ctx.db
            .query("files")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("url"), args.url))
            .first();

        if (file) {
            await ctx.db.delete(file._id);
        }
    },
});

export const get = query({
    args: {
        userId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (!args.userId) {
            return [];
        }

        const files = await ctx.db
            .query("files")
            .withIndex("by_user", (q) => q.eq("userId", args.userId as string))
            .order("desc")
            .collect();

        return files;
    },
});
